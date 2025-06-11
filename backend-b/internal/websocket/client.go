package websocket

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

type Client struct{
	id string
	pool *Pool
	conn *websocket.Conn
}

func generateID() string{
	return ""
}

func NewClient(conn *websocket.Conn, pool *Pool) *Client {
	return &Client{
		id: generateID(),
		pool: pool,
		conn: conn,
	}
}

func (c *Client) readPump() {
	for{
		_, payload, err := c.conn.ReadMessage()
		if err != nil{
			log.Println("Error reading message")
			return
		}

		var edit []Edit
		if err := json.Unmarshal(payload, &edit); err != nil{
			fmt.Println("Error:", err)
			continue
		}

		c.pool.broadcast <- edit
	}
}

func (c *Client) writePump(){
	defer func(){
		c.conn.Close()
	}()

	for{
		output, ok := <- c.pool.broadcast
		if !ok{
			log.Println("Error receiving broadcast")
		}

		if editOutput, ok := json.Marshal(output); ok{
			c.conn.WriteMessage(websocket.TextMessage, editOutput)
		}
	}
}


