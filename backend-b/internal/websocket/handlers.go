package websocket

import (
	"log"

	"github.com/gin-gonic/gin"
)

//Handler for a http connection, this upgrades the http connection to a websocket then start goroutines for reading and writing
func (p *Pool) serveWS(c *gin.Context){
	conn, err := Upgrade(c)
	defer conn.Close()
	if err != nil{
		log.Println("Websocket upgrade failed")
	}

	client := NewClient(conn, p)
	p.addClient(client)
	go client.readPump()
	go client.writePump()
}