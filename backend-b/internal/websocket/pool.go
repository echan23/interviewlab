package main

import(
	"github.com/echan23/interviewlab/client"
	"github.com/echan23/interviewlab/websocket"
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

func HandleEdit(edit Edit, pool *Pool){
	editRange := edit.editRange

}

type Pool struct{
	clients map[*Client]bool
	broadcast chan []Edit
	register chan *Client
	unregister chan *Client
	content []string 
}

func (p *Pool) broadcastEdit(edit Edit){
	for client := range p.clients{
		client <- edit
	}
}

func (p *Pool) addClient(client *Client){
	log.println("New Client Connected", client.id)
	pool.clients[client] = true
}

func (p* Pool) removeClient(c *Client){
	_, ok := p.clients[c]
	if ok{
		delete(p.clients, c)
	}
	c.conn.Close()
	log.Println("Client Disconnected", client.id)
}

func (p *Pool) handleEdit(edit Edit){
	p.content[]
}

func NewPool() *Pool {
	return &Pool{
		clients: make(map[*Client]bool)
		broadcast: make(chan event.Edit),

	}
}


func (p *Pool) serveWS(){
	ws , err := Upgrade(c)
	if err != nil{
		log.Println("Websocket upgrade failed")
	}

	for{
		select{
			case client := <-p.register:
				p.addClient(c)
				fmt.Printf("Client connected", client.id)
			}
			case client := <-p.unregister:
				p.removeClient(c)
				fmt.Printf("Client disconnected", client.id)
			}
			case edit := p <-p.broadcast:		
				p.handleEdit(edit)
				fmt.Printf("Edit handled")
				p.broadcastEdit(edit)
}
