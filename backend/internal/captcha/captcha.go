package websocket

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

const googleVerifyURL = "https://www.google.com/recaptcha/api/siteverify"

type CaptchaResponse struct {
	Success     bool     `json:"success"`
	ChallengeTS string   `json:"challenge_ts"`
	Hostname    string   `json:"hostname"`
	ErrorCodes  []string `json:"error-codes"`
}

func VerifyCaptcha(token string) error {
	godotenv.Load()
	secret := os.Getenv("CAPTCHA_SECRET_KEY")
	fmt.Println("Using secret:", secret)
	if secret == "" {
		return fmt.Errorf("CAPTCHA_SECRET_KEY is not set")
	}

	data := fmt.Sprintf("secret=%s&response=%s", secret, token)
	req, err := http.NewRequest("POST", googleVerifyURL, bytes.NewBufferString(data))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	var captchaResp CaptchaResponse
	if err := json.Unmarshal(body, &captchaResp); err != nil {
		return err
	}

	if !captchaResp.Success {
		return fmt.Errorf("captcha verification failed: %v", captchaResp.ErrorCodes)
	}
	return nil
}
