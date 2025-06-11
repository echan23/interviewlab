package main

import (
	"log"
	"net/http"

	"github.com/echan23/interviewlab/backend-b/internal/websocket/pool"
)

func main() {
	p := pool.NewPool()

	go p.run()
	log.Println("Server starting on port 8080")
	http.ListenAndServe(":8080", nil)
}