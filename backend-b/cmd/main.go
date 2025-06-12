package main

import (
	"log"

	"github.com/echan23/interviewlab/backend-b/internal/websocket"
	"github.com/gin-gonic/gin"
)

func hello(c *gin.Context) {
	c.String(200, "Hello websocket!")
}

func main() {
	p := websocket.NewPool()

	go p.Run()

	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.String(200, "Hello websocket!")
	})
	r.GET("/ws", p.ServeWS)

	log.Println("Server starting on port 8080")
	r.Run(":8080")
}

