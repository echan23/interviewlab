package websocket

import (
	"interviewlab-backend/internal/redis"
	"log"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Manager struct{
	rooms map[string]*Room
	sync.RWMutex
}

var MainManager *Manager

func NewManager() *Manager{
	return &Manager{
		rooms: make(map[string]*Room),
	}
}

func (m *Manager) generateRoomID() string{
	return uuid.NewString();
}

func (m *Manager) GetOrCreateRoom(roomID string) *Room{
	m.Lock()
	_, ok := m.rooms[roomID]
	m.Unlock()
	if ok{
		return m.rooms[roomID]
	}
	newRoom := NewRoom(roomID)
	content, err := redis.SyncContentFromRedis(roomID)
	if err == redis.ErrRoomNotFound{
		redis.SaveRoomToRedis(roomID, "")
		content = ""
	}
	newRoom.content = content	
	go newRoom.Run(roomID) //Check if this is the right spot to start the goroutine
	m.Lock()
	m.rooms[roomID] = newRoom
	m.Unlock()
	return newRoom
}

func (m * Manager) removeRoom(roomID string){
	m.Lock()
	defer m.Unlock()
	delete (m.rooms, roomID)
	log.Println("Room removed from manager: ", roomID)
}

//Connects clients to their Room
func (m *Manager) RouteClients(c *gin.Context, roomID string) {
	room := m.GetOrCreateRoom(roomID)
	log.Println("Routing client to Room")
	room.ServeWS(c)
}

//Handles the post request when a client wants to create a new codefile. 
func (m *Manager) HandleGenerateRoomRequest(c *gin.Context){
	m.Lock()
	defer m.Unlock()
	roomID := m.generateRoomID()
	redis.SaveRoomToRedis(roomID, "")
	redis.UpdateRoomsCreated(c.Request.Context())
	c.JSON(200, gin.H{"roomID": roomID})
}
