package websocket

import (
	"context"
	"fmt"
	"interviewlab-backend/config"
	"interviewlab-backend/internal/redis"
	"interviewlab-backend/internal/types"
	"log"
	"sort"
	"sync"
	"time"
)



type Room struct{
	Id string
	clients map[*Client]bool
	broadcast chan types.Broadcast
	register chan *Client
	unregister chan *Client
	publishQueue chan []types.Edit
	publishInterval time.Duration
	publishBatchSize int
	content string 
	sync.RWMutex
	Ctx context.Context
	Cancel context.CancelFunc
	hashWriteInterval time.Duration
	writeInProgress bool
	flushedChannel chan struct{}
}

/*We pass broadcast instead of just a message because we ned to track senderid so that clients don't re-receive their own edits. 
Without senderID a client will send a message to the Room which will send it back to all clients, resulting in a client's input
getting doubled on their browser*/
func (r *Room) BroadcastEdit(edit types.Broadcast){
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

func (r *Room) handleEdit(edits []types.Edit){
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


func NewRoom(roomID string) *Room {
	ctx, cancel := context.WithCancel(context.Background())
	return &Room{
		Id: roomID,
		clients: make(map[*Client]bool),
		register: make(chan *Client),
		unregister: make(chan *Client),
		broadcast: make(chan types.Broadcast),
		publishQueue: make(chan []types.Edit),
		publishBatchSize: 20,
		publishInterval: 200 * time.Millisecond,
		Ctx: ctx,
		Cancel: cancel,
		content: redis.SyncRoomFromRedis(roomID),
		hashWriteInterval: 2 * time.Second,
	}
}

func (r *Room) handleIncomingDiff(edits []types.Edit){
	r.broadcast <- types.Broadcast{
		Sender: "redis",
		Message: edits,
	}
}

//Batch diffs to publish every 200 ms or when buffer exceeded instead of publishing each change, this is only for cross server sync
func (r *Room) startPublishBatcher(){
	ticker := time.NewTicker(r.publishInterval)
	defer ticker.Stop()

	var buffer []types.Edit
	flush := func(){
		if len(buffer) == 0{
			return
		}
		batch := make([]types.Edit, len(buffer))
		copy(batch, buffer)
		buffer = buffer[:0]

		env := types.RedisEnvelope{
			Origin: config.ServerID,
			Edits: batch,
		}
		redis.PublishDiffs(r.Ctx, r.Id, env)
		log.Println("Publishing edit batch to Redis")
	}
	for{
		select{
		case <- r.Ctx.Done():
			return
		case edits := <- r.publishQueue:
			buffer = append(buffer, edits...)
			if len(buffer) >= r.publishBatchSize{
				flush()
			}
		case <- ticker.C:
			flush()
		}
	}
}

func (r *Room) startHashWriteRoutine(){
	ticker := time.NewTicker(r.hashWriteInterval)
	defer ticker.Stop()
	for{
		select{
			case <- r.Ctx.Done():
					redis.SyncContentToRedis(r.Id, r.content)
					return
			
			case <- ticker.C:
				redis.SyncContentToRedis(r.Id, r.content)
		}
	}
}


//Starts the server's listeners for channels
func (r *Room) Run(roomID string) {
	log.Println("Room.Run started")
	go redis.SubscribeDiffs(r.Ctx, roomID, r.handleIncomingDiff)
	go r.startPublishBatcher()
	go r.startHashWriteRoutine()
	for{
		select{
			case <-r.Ctx.Done():
            	return
			case client := <-r.register:
				r.addClient(client)
				fmt.Println("Client connected", client.id)
				redis.SyncContentToRedis(r.Id, r.content)
			case client := <-r.unregister:
				r.removeClient(client)
				fmt.Println("Client disconnected", client.id)
			case edit := <-r.broadcast:	
				r.handleEdit(edit.Message)
				for client := range(r.clients){
					fmt.Println(client.id)
				}
				r.BroadcastEdit(edit)
		}
	}
}
