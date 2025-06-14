package main

import (
	"log"

	"github.com/echan23/interviewlab/backend-b/internal/websocket"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	m := websocket.NewManager()

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	  }))

	r.GET("/", func(c *gin.Context) {
		c.String(200, "Hello websocket!")
	})

	//Have a post method that handles creation of new Room
	r.POST("/api/room/create", func(c *gin.Context){
		log.Println("Generating new Room URL (main.go)")
		m.HandleGenerateRoomRequest(c)
	})

	//Handles accessing an existing room
	r.GET("/ws/:roomID", func(c *gin.Context){
		roomID := c.Param("roomID")
		if !m.AllowedRooms[roomID]{
			log.Println("RoomID not allowed", roomID)
			c.JSON(403, gin.H{"error": "Room does not exist"})
			return
		}
		log.Println("Routing client to Room (main.go)")
		m.RouteClients(c, roomID)
	})

	//Keep this last in file always
	r.NoRoute(func (c *gin.Context){
		c.File("./frontend/dist/index.html")
	})

	log.Println("Server starting on port 8080")
	r.Run(":8080")
}

