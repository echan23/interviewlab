package piston

import (
	"bytes"
	"encoding/json"
	"net/http"
)

type PistonRequest struct {
	Language string `json:"language"`
	Source string `json:"source"`
}

type PistonResponse struct {
	Output string `json:"output"`
}

func ExecuteCode(language, source string) (PistonResponse, error){
	reqBody := PistonRequest{
		Language: language,
		Source: source,
	}

	body, _ := json.Marshal(reqBody)
	resp, err := http.Post("https://emkc.org/api/v2/piston/execute", "application/json", bytes.NewBuffer(body))
	if err != nil{
		return PistonResponse{}, err
	}
	defer resp.Body.Close()

	var pistonResp PistonResponse
	json.NewDecoder(resp.Body).Decode(&pistonResp)
	return pistonResp, nil
}