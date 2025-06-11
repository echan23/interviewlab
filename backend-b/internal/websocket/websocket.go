package websocket

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize: 1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool { return true },
}

func Upgrade(c *gin.Context) (*websocket.Conn, error){
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil{
		log.Println("error while upgrading")
		return nil, err
	}
	return conn, nil
}