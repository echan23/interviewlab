package redis

import (
	"context"
	"encoding/json"
	"interviewlab-backend/config"
	"interviewlab-backend/internal/types"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

type CodeFile struct{
	RoomID string `json:"roomID"`
	Content string `json:"content"`
}

var client *redis.Client
func InitRedisClient(addr string, password string, db int){
	client = redis.NewClient(&redis.Options{
		Addr: addr,
		Password:password,
		DB: db,
		Protocol: 2,
	})
}

func SaveRoomToRedis(roomID string, contentString string){
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	err := client.HSet(ctx, roomID, map[string]interface{}{
		"roomID": roomID,
		"content": contentString,
	}).Err()
	if err != nil{
		log.Println("error setting file in redis for room: ", roomID, err)
		return
	}
	log.Println("Saving room hash in redis")
}

func SyncRoomFromRedis(roomID string) (string){
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	content, err := client.HGet(ctx, roomID, "content").Result()
	if err == redis.Nil{
		//Implement logic to query DB
		return ""
	}
	if err != nil{
		log.Println("error retrieving content from redis")
		return ""
	}
	log.Println("Retrieving room content from redis")
	return content
}

func SyncContentToRedis(roomID string, contentString string){
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	err := client.HSet(ctx, roomID, "content", contentString).Err()
	if err != nil{
		log.Println("error syncing diffs to redis for room: ", roomID, err)
		return
	}
	log.Println("Sending room content to redis")
}

func SubscribeDiffs(ctx context.Context, roomID string, handleIncomingDiff func([]types.Edit)){
	pubsub := client.Subscribe(ctx, "room:"+roomID+":diffs")
	channel := pubsub.Channel()
	for{
		select{
		case <- ctx.Done():
			return

		case msg := <- channel:
			var rEdits types.RedisEnvelope
			if err := json.Unmarshal([]byte(msg.Payload), &rEdits); err != nil{
				log.Println("redis: invalid diff payload", err)
				continue
			}
			//Ignore edits that are from the same server, those edits have already been broadcasted locally
			if rEdits.Origin != config.ServerID{
				handleIncomingDiff(rEdits.Edits)
			}
		}
	}
}

func PublishDiffs(ctx context.Context, roomID string, editPayload types.RedisEnvelope){
	editJSON, err := json.Marshal(editPayload)
	if err != nil{
		log.Println("Error converting edits to JSON")
		return
	}
	if err := client.Publish(ctx, "room:"+roomID+":diffs", editJSON).Err(); err != nil{
		log.Println("redis: could not publish diffs for payload: ", editJSON)
		return
	}
}
