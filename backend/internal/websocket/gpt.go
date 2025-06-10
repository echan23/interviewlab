package main

import (
	"context"
	"fmt"
	openai "github.com/sashabaranov/go-openai"
)

func getGPTResponse(client *openai.Client, code string) (string, error) {
	resp, err := client.CreateChatCompletion(context.Background(), openai.ChatCompletionRequest{
		Model: "openai/gpt-4o",
		Messages: []openai.ChatCompletionMessage{
			{Role: openai.ChatMessageRoleSystem, Content: "You are a helpful interviewer."},
			{Role: openai.ChatMessageRoleUser, Content: fmt.Sprintf("Give a hint for this code:\n%s", code)},
		},
		MaxTokens:   500,
		Temperature: 0.7,
	})
	if err != nil {
		return "", err
	}

	return resp.Choices[0].Message.Content, nil
}
