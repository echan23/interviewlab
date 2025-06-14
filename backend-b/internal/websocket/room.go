package websocket

import (
	"fmt"
	"log"
	"sort"
	"sync"
)

type IRange struct {
	EndColumn int `json:"endColumn"`
	EndLineNumber int `json:"endLineNumber"`
	StartColumn int `json:"startColumn"`
	StartLineNumber int `json:"startLineNumber"`
}

type Edit struct{
	Range IRange `json:"range"`
	RangeLength int `json:"rangeLength"`
	RangeOffset int `json:"rangeOffset"`
	Text string `json:"text"`
}

type Broadcast struct{
	Sender string
	Message []Edit
}


type Room struct{
	clients map[*Client]bool
	broadcast chan Broadcast
	register chan *Client
	unregister chan *Client
	content string 
	sync.RWMutex
}

/*We pass broadcast instead of just a message because we ned to track senderid so that clients don't re-receive their own edits. 
Without senderID a client will send a message to the Room which will send it back to all clients, resulting in a client's input
getting doubled on their browser*/
func (r *Room) broadcastEdit(edit Broadcast){
	for client := range r.clients{
		if client.id != edit.Sender{
			client.receiveEdit <- edit.Message
		}
	}
}

func (r *Room) addClient(c *Client){
	r.Lock()
	defer r.Unlock()
	log.Println("New Client Connected", c.id)
	r.clients[c] = true
}

func (r *Room) removeClient(c *Client){
	r.Lock()
	defer r.Unlock()
	_, ok := r.clients[c]
	if ok{
		delete(r.clients, c)
	}
	c.conn.Close()
	log.Println("Client Disconnected", c.id)
}

func (r *Room) handleEdit(edits []Edit){
	log.Println("handling edit")
	r.Lock()
	defer r.Unlock()
	sort.Slice(edits, func(i, j int) bool{
		return edits[i].RangeOffset > edits[j].RangeOffset
	})

	for _, e := range(edits){
		start := e.RangeOffset
		end := e.RangeOffset + e.RangeLength
		if start < 0 || end > len(r.content){
			continue
		}
		before := r.content[:start]
		after := r.content[end:]
		r.content = before + e.Text + after
	}
	log.Println(r.content)
}

func NewRoom() *Room {
	return &Room{
		clients: make(map[*Client]bool),
		register: make(chan *Client),
		unregister: make(chan *Client),
		broadcast: make(chan Broadcast),
	}
}

//Starts the server's listeners for channels
func (r *Room) Run() {
	log.Println("Room.Run started")
	for{
		select{
			case client := <-r.register:
				r.addClient(client)
				fmt.Println("Client connected", client.id)
			
			case client := <-r.unregister:
				r.removeClient(client)
				fmt.Println("Client disconnected", client.id)
			
			case edit := <-r.broadcast:	
				r.handleEdit(edit.Message)
				fmt.Println("Edit received from broadcast")
				for client := range(r.clients){
					fmt.Println(client.id)
				}
				r.broadcastEdit(edit)
		}
	}
}
