package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
	openai "github.com/sashabaranov/go-openai"
	"github.com/joho/godotenv"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type Message struct {
	Type string `json:"type"`
	Code string `json:"code"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	token := os.Getenv("GPT_API_KEY")
	if token == "" {
		log.Fatal("Missing GPT_API_KEY in environment")
	}

	config := openai.DefaultConfig(token)
	config.BaseURL = "https://models.github.ai/inference"
	client := openai.NewClientWithConfig(config)

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("WebSocket upgrade failed:", err)
			return
		}
		defer conn.Close()

		for {
			_, msgData, err := conn.ReadMessage()
			if err != nil {
				log.Println("Read error:", err)
				break
			}

			var msg Message
			if err := json.Unmarshal(msgData, &msg); err != nil {
				log.Println("JSON error:", err)
				continue
			}

			if msg.Type == "hint" {
				resp, err := client.CreateChatCompletion(context.Background(), openai.ChatCompletionRequest{
					Model: "openai/gpt-4o",
					Messages: []openai.ChatCompletionMessage{
						{Role: openai.ChatMessageRoleSystem, Content: "You are a helpful interviewer."},
						{Role: openai.ChatMessageRoleUser, Content: fmt.Sprintf("Give a hint for this code:\n%s", msg.Code)},
					},
					MaxTokens: 500,
					Temperature: 0.7,
				})
				if err != nil {
					log.Println("GPT error:", err)
					conn.WriteJSON(map[string]string{"error": "GPT failed"})
					continue
				}

				hint := resp.Choices[0].Message.Content
				conn.WriteJSON(map[string]string{"hint": hint})
			}
		}
	})

	port := "8080"
	fmt.Println("🚀 Server running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
