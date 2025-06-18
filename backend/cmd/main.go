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


	/*API LOGIC =================================================================================
	==============================================================================================*/

	/*err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	token := os.Getenv("GPT_API_KEY")
	if token == "" {
		log.Fatal("Missing GPT_API_KEY in environment")
	}
	config := openai.DefaultConfig(token)
	config.BaseURL = "https://models.github.ai/inference"
	//client := openai.NewClientWithConfig(config)*/

	//r.POST("/api/hint", HintHandler(client))


	

	/*ROOMS LOGIC =================================================================================

	==============================================================================================*/
	m := websocket.NewManager()
	config.Init() //Sets the serverID
	postgres.Init() //starts postgres connection
	defer postgres.DB.Close()

	redis.InitRedisClient("localhost:6379", "", 0)

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

	//log.fatal here
}
