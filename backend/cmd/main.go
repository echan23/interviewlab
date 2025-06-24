package main

import (
	"interviewlab-backend/config"
	"interviewlab-backend/internal/redis"
	"interviewlab-backend/internal/websocket"
	"interviewlab-backend/postgres"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	  }))


	/*ROOMS LOGIC =================================================================================

	==============================================================================================*/
	websocket.MainManager = websocket.NewManager()
	config.Init() //Sets the serverID
	postgres.Init() //starts postgres connection
	defer postgres.DB.Close()
	redis.InitRedisClient()

	//Have a post method that handles creation of new Room
	r.POST("/api/room/create", func(c *gin.Context){
		log.Println("Generating new Room URL (main.go)")
		websocket.MainManager.HandleGenerateRoomRequest(c)
	})

	//Handles accessing an existing room
	r.GET("/ws/:roomID", func(c *gin.Context){
		roomID := c.Param("roomID")
		exists, err := redis.ClientExists(c.Request.Context(), roomID)
		if err != nil{
			if err == postgres.ErrRoomNotFound{
				c.JSON(404, gin.H{"error": "Room does not exist"})
				return
			}
			c.JSON(500, gin.H{"error": "Error validating room existence"})
			return
		}
		if !exists{
			c.JSON(404, gin.H{"error": "room does not exist"})
        	return
		}
		log.Println("Routing client to Room (main.go)")
		websocket.MainManager.RouteClients(c, roomID)
	})

	//Keep this last in file always
	r.NoRoute(func (c *gin.Context){
		c.File("./frontend/dist/index.html")
	})

	log.Println("Server starting on port 8080")
	r.Run(":8080")

	//log.fatal here
}
