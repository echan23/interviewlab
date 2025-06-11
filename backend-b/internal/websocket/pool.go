package websocket

import (
	"fmt"
	"log"
)

type IRange struct {
	endColumn int
	endLineNumber int
	startColumn int
	startLineNumber int
}

type Edit struct{
	editRange IRange
	rangeLength int
	rangeOffset int
	text string
}

func HandleEdit(edit []Edit, pool *Pool){

}

type Pool struct{
	clients map[*Client]bool
	broadcast chan []Edit
	register chan *Client
	unregister chan *Client
	content []string 
}

func (p *Pool) broadcastEdit(edit []Edit){
	for client := range p.clients{
		client.send <- edit
	}
}

func (p *Pool) addClient(client *Client){
	log.Println("New Client Connected", client.id)
	p.clients[client] = true
}

func (p* Pool) removeClient(c *Client){
	_, ok := p.clients[c]
	if ok{
		delete(p.clients, c)
	}
	c.conn.Close()
	log.Println("Client Disconnected", c.id)
}

func (p *Pool) handleEdit(edit []Edit){
}

func NewPool() *Pool {
	return &Pool{
		clients: make(map[*Client]bool),
		broadcast: make(chan []Edit),
	}
}

//Starts the server's listeners for channels
func (p *Pool) run() {
	for{
		select{
			case client := <-p.register:
				p.addClient(client)
				fmt.Printf("Client connected", client.id)
			
			case client := <-p.unregister:
				p.removeClient(client)
				fmt.Printf("Client disconnected", client.id)
			
			case edit := <-p.broadcast:		
				p.handleEdit(edit)
				fmt.Printf("Edit handled")
				p.broadcastEdit(edit)
		}
	}
}
