package redis

import (
	"context"
	"encoding/json"
	"errors"
	"interviewlab-backend/config"
	"interviewlab-backend/internal/types"
	"interviewlab-backend/postgres"
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

//Hash is unnecessary but leave as a hash in case more fields get added
func SaveRoomToRedis(roomID string, contentString string){
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	err := client.HSet(ctx, roomID, map[string]interface{}{
		"content": contentString,
	}).Err()
	if err != nil{
		log.Println("error setting file in redis for room: ", roomID, err)
		return
	}
	log.Println("Saving room hash in redis")
}

var ErrRoomNotFound = errors.New("room not found in redis")

func SyncContentFromRedis(roomID string) (string, error){
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	content, err := client.HGet(ctx, roomID, "content").Result()
	if err == nil{
		return content, nil
	}
	if err == redis.Nil{
		log.Println("Room doesn't exist in redis: ", roomID)
		content, dbErr := postgres.RetrieveContent(ctx, roomID)
		if dbErr == nil{
			log.Println("Room retrieved from Postgres: ", roomID)
			return content, nil
		}
		log.Println("Content not found in postgres")
	}
	return "", ErrRoomNotFound
}

func SyncContentToRedis(roomID string, contentString string){
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	err := client.HSet(ctx, roomID, "content", contentString).Err()
	if err != nil{
		log.Println("error syncing diffs to redis for room: ", roomID, err)
		return
	}
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
