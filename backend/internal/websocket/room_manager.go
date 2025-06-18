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
	AllowedRooms map[string]bool
	sync.RWMutex
}

func NewManager() *Manager{
	return &Manager{
		rooms: make(map[string]*Room),
		AllowedRooms: make(map[string]bool),
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
	prevContent, err := redis.SyncContentFromRedis(roomID)
	if err == redis.ErrRoomNotFound{
		redis.SaveRoomToRedis(roomID, "")
	}
	newRoom.content = prevContent	
	go newRoom.Run(roomID) //Check if this is the right spot to start the goroutine
	m.Lock()
	m.rooms[roomID] = newRoom
	m.Unlock()
	return newRoom
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
	m.AllowedRooms[roomID] = true
	c.JSON(200, gin.H{"roomID": roomID})
}


/*
Manager logic:
	When a user creates a new codefile (POST) we call HandleGenerateRoomRequest which creates the URl and adds it to the map of
	approved URLs.

	When a URL is used to connect, we validate the URL, then call the GetOrCreateRoom method and connect the user to the returned Room.
	Case 1: The Room already exists, happens when the user is using the url in the browser to access their codefile
	Case 2: The Room doesn't exist, occurs when the user is using the URL that has been generated for them from HandleGenerateRoomRequest

	For now create a connect room button on the front end that returns a URL, use this to test the room connections
*/
