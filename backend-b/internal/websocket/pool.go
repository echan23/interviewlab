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


type Pool struct{
	clients map[*Client]bool
	broadcast chan Broadcast
	register chan *Client
	unregister chan *Client
	content string 
	sync.RWMutex
}

/*We pass broadcast instead of just a message because we ned to track senderid so that clients don't re-receive their own edits. 
Without senderID a client will send a message to the pool which will send it back to all clients, resulting in a client's input
getting doubled on their browser*/
func (p *Pool) broadcastEdit(edit Broadcast){
	for client := range p.clients{
		if client.id != edit.Sender{
			client.receiveEdit <- edit.Message
		}
	}
}

func (p *Pool) addClient(c *Client){
	p.Lock()
	defer p.Unlock()
	log.Println("New Client Connected", c.id)
	p.clients[c] = true
}

func (p* Pool) removeClient(c *Client){
	p.Lock()
	defer p.Unlock()
	_, ok := p.clients[c]
	if ok{
		delete(p.clients, c)
	}
	c.conn.Close()
	log.Println("Client Disconnected", c.id)
}

func (p *Pool) handleEdit(edits []Edit){
	p.Lock()
	defer p.Unlock()
	sort.Slice(edits, func(i, j int) bool{
		return edits[i].RangeOffset > edits[j].RangeOffset
	})

	for _, e := range(edits){
		start := e.RangeOffset
		end := e.RangeOffset + e.RangeLength
		if start < 0 || end > len(p.content){
			continue
		}
		before := p.content[:start]
		after := p.content[end:]
		p.content = before + e.Text + after
	}
	log.Println(p.content)
}

func NewPool() *Pool {
	return &Pool{
		clients: make(map[*Client]bool),
		register: make(chan *Client),
		unregister: make(chan *Client),
		broadcast: make(chan Broadcast),
	}
}

//Starts the server's listeners for channels
func (p *Pool) Run() {
	log.Println("Pool.Run started")
	for{
		select{
			case client := <-p.register:
				p.addClient(client)
				fmt.Println("Client connected", client.id)
			
			case client := <-p.unregister:
				p.removeClient(client)
				fmt.Println("Client disconnected", client.id)
			
			case edit := <-p.broadcast:	
				p.handleEdit(edit.Message)
				fmt.Println("Edit received from broadcast")
				for client := range(p.clients){
					fmt.Println(client.id)
				}
				p.broadcastEdit(edit)
		}
	}
}
