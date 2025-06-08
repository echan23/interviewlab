package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/echan23/interviewlab/backend/piston"
)


func runCodeHandler(w http.ResponseWriter, r *http.Request){
	var req piston.PistonRequest
	json.NewDecoder(r.Body).Decode(&req)

	result, err := piston.ExecuteCode(req.Language, req.Source)
	if err != nil{
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func main(){
	fmt.Println("implement this later")
	http.ListenAndServe(":8080", nil)
}