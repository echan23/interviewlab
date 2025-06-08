package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	openai "github.com/sashabaranov/go-openai"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type Message struct {
	Type string `json:"type"`
	Code string `json:"code"`
}

func handleWebSocket(client *openai.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
				hint, err := getGPTResponse(client, msg.Code)
				if err != nil {
					log.Println("GPT error:", err)
					conn.WriteJSON(map[string]string{"error": "GPT failed"})
					continue
				}

				conn.WriteJSON(map[string]string{"hint": hint})
			}
		}
	}
}
