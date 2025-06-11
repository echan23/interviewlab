package main

import (
	"log"
	"net/http"
)

func main() {
	poolInstance := NewPool()
	log.Println("Server starting on port 8080")
	http.ListenAndServe(":8080", nil)
}