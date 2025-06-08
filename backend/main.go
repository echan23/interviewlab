package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"github.com/joho/godotenv"
	openai "github.com/sashabaranov/go-openai"
)

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

	http.HandleFunc("/ws", handleWebSocket(client))

	port := "8080"
	fmt.Println("🚀 Server running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
