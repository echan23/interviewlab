package websocket

import (
	"encoding/json"
	"interviewlab-backend/internal/types"
	"log"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Client struct{
	id string
	room *Room
	conn *websocket.Conn
	receiveEdit chan []types.Edit
	send chan []byte
}

func generateID() string{
	return uuid.NewString()
}

func NewClient(conn *websocket.Conn, room *Room) *Client {
	return &Client{
		id: generateID(),
		room: room,
		conn: conn,
		receiveEdit: make(chan []types.Edit),
		send: make(chan []byte),
	}
}

func (c *Client) readPump() {
	defer func() {
        c.room.unregister <- c
        c.conn.Close()
        log.Println("Client closed connection")
    }()
	for{
		_, payload, err := c.conn.ReadMessage()
		if err != nil{
			log.Println("Error reading message: ", err)
			return
		}
		//log.Println("websocket received input: ", payload)
		var edits []types.Edit
		if err := json.Unmarshal(payload, &edits); err != nil{
			log.Println("Error:", err)
			return
		}
		//log.Println("sending diffs to redis")
		c.room.broadcast <- types.Broadcast{Sender: c.id, Message: edits}
		c.room.publishQueue <- edits
	}
}

func (c *Client) writePump(){
	defer func(){
		log.Println("Closing from write pump")
		c.conn.Close()
	}()

	for{
		output, ok := <- c.receiveEdit
		log.Println("Writepump output from broadcast:" , output)
		if !ok{
			log.Println("Error receiving broadcast")
			return
		}

		log.Println("Sending message:", output)
		if err := c.conn.WriteJSON(output); err != nil{
			log.Println("error writing message", err)
			return
		}
	}
}


