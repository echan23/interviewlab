package websocket

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

type Init struct{
	Type string `json:"type"`
	Content string `json:"content"`
}

//Init passes the current contents of the codefile to the client
func (c *Client) InitClientContent(p *Pool){
	log.Println("Sending editor content to client: ", p.content)
	initContent := Init{Type: "init", Content: p.content}
	if err := c.conn.WriteJSON(initContent); err != nil{
		log.Println("Error sending editor content to client")
		return
	}
}

//Handler for a http connection, this upgrades the http connection to a websocket then start goroutines for reading and writing
func (p *Pool) ServeWS(c *gin.Context){
	log.Println("New ServeWS connection:", time.Now())
	conn, err := Upgrade(c)
	if err != nil{
		log.Println("Websocket upgrade failed")
		return
	}

	client := NewClient(conn, p)
	client.InitClientContent(p)
	p.register <- client
	log.Println("starting client goroutines")
	go client.readPump()
	go client.writePump()
}