package websocket

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
	Type     string `json:"type"`
	Code     string `json:"code"`
	HintType string `json:"hintType"`
}

func HandleWebSocket(client *openai.Client) http.HandlerFunc {
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
				log.Println("WebSocket read error:", err)
				break
			}

			var msg Message
			if err := json.Unmarshal(msgData, &msg); err != nil {
				log.Println("WebSocket JSON unmarshal error:", err)
				continue
			}

			if msg.Type == "hint" {
				log.Printf("Handling %s hint request...\n", msg.HintType)

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
