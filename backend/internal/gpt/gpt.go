package websocket

import (
	"context"
	"encoding/json"
	"fmt"
	"interviewlab-backend/internal/websocket"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	openai "github.com/sashabaranov/go-openai"
)

type Message struct {
	Type     string `json:"type"`
	Code     string `json:"code"`
	HintType string `json:"hintType"`
}

type HintRequest struct {
	Code     string `json:"code"`
	HintType string `json:"hintType"`
}

func GetGPTResponse(client *openai.Client, code string, hintType string) (string, error) {
	var prompt string

	switch hintType {
	case "weak":
		prompt = fmt.Sprintf("I'm working on this code:\n\n%s\n\nIf there is nothing, say No code shown. Tell me if I am on the right track.Give me a vague or small hint or suggestion to improve it in one paragraph. Dont give answer and Dont say anything acknowledging me or the prompt like I am happy to help or Ok, just say the advice of logic or syntax errors. DONT FOCUS ON TIME COMPLEXITY ADVICE AT ALL", code)
	case "strong":
		prompt = fmt.Sprintf("Here is my code:\n\n%s\n\nIf there is nothing say no code shown. Tell me if I am on the right track.Please give me a very detailed or strong hint and guidance in the right direction to help me improve it in one paragraph. Do not give me the full answer, just advice to lead me in the right direction. Dont say anything acknowledging me or the prompt like I am happy to help or Ok. Just say the advice", code)
	}

	resp, err := client.CreateChatCompletion(context.Background(), openai.ChatCompletionRequest{
		Model: "openai/gpt-4o",
		Messages: []openai.ChatCompletionMessage{
			{Role: openai.ChatMessageRoleSystem, Content: "You are a helpful interviewer."},
			{Role: openai.ChatMessageRoleUser, Content: prompt},
		},
		MaxTokens:   500,
		Temperature: 0.7,
	})
	if err != nil {
		return "", err
	}

	return resp.Choices[0].Message.Content, nil
}

func HintHandler(client *openai.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Header("Access-Control-Allow-Methods", "POST, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type")

		if c.Request.Method == http.MethodOptions {
			c.Status(http.StatusOK)
			return
		}

		var req HintRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		hint, err := GetGPTResponse(client, req.Code, req.HintType)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate hint"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"hint": hint})
	}
}

func WebSocketHandler(client *openai.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		conn, err := websocket.Upgrade(c)
		if err != nil {
			log.Println("WebSocket upgrade failed:", err)
			return
		}
		defer conn.Close()

		for {
			_, msgData, err := conn.ReadMessage()
			if err != nil {
				log.Println("WebSocket read error:", err)
				break
			}

			var msg Message
			if err := json.Unmarshal(msgData, &msg); err != nil {
				log.Println("WebSocket JSON unmarshal error:", err)
				continue
			}

			if msg.Type == "hint" {
				hint, err := GetGPTResponse(client, msg.Code, msg.HintType)
				if err != nil {
					log.Println("GPT generation error:", err)
					conn.WriteJSON(map[string]string{"error": "GPT failed to generate a response"})
					continue
				}

				conn.WriteJSON(map[string]string{
					"type": "hint",
					"hint": hint,
				})
			}
		}
	}
}