package websocket

import (
	"context"
	"fmt"

	openai "github.com/sashabaranov/go-openai"
)

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
