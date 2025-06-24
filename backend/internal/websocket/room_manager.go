package websocket

import (
	captcha "interviewlab-backend/internal/captcha"
	"interviewlab-backend/internal/redis"
	"log"
	"sync"
	"net/http"

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

type captchaRequest struct {
	Captcha string `json:"captcha"`
}

//Handles the post request when a client wants to create a new codefile and prompts for a captcha. 
func (m *Manager) HandleGenerateRoomRequest(c *gin.Context) {
	var req captchaRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	log.Println("Received captcha token:", req.Captcha)z

	if err := captcha.VerifyCaptcha(req.Captcha); err != nil {
		log.Println("Captcha verification failed:", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Captcha failed"})
		return
	}

	roomID := m.generateRoomID()
	redis.SaveRoomToRedis(roomID, "")
	c.JSON(http.StatusOK, gin.H{"roomID": roomID})
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
