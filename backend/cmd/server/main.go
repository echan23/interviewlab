package main

import (
	"encoding/json"
	"fmt"
	"interviewlab-backend/internal/websocket"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	openai "github.com/sashabaranov/go-openai"
)

type HintRequest struct {
	Code     string `json:"code"`
	HintType string `json:"hintType"`
}

func hintHandler(client *openai.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		var req HintRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		hint, err := websocket.GetGPTResponse(client, req.Code, req.HintType)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to generate hint"})
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"hint": hint})
	}
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

	http.HandleFunc("/ws", websocket.HandleWebSocket(client))
	http.HandleFunc("/api/hint", hintHandler(client))

	port := "8080"
	fmt.Println("Server running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
