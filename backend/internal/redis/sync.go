package redis

import (
	"context"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

var SyncStreamMaxTime = 5000 * time.Millisecond

func WaitForSync(ctx context.Context, roomID string) error {
	streamKey := "room" + roomID + ":syncs"

	ctx, cancel := context.WithTimeout(ctx, SyncStreamMaxTime)
	defer cancel()

	log.Println("🔍 Blocking to read from Redis stream for up to", SyncStreamMaxTime)

	_, err := client.XRead(ctx, &redis.XReadArgs{
		Streams: []string{streamKey, "$"},
		Block:   SyncStreamMaxTime,
		Count:   1,
	}).Result()

	if err != nil && err != context.DeadlineExceeded && err != redis.Nil {
		log.Println("WaitForSync failed:", err)
		return err
	}

	log.Println("WaitForSync successful (stream returned)")
	return nil
}

func PublishSyncMarker(ctx context.Context, roomID string) {
	streamKey := "room:" + roomID + ":syncs"

	_, err := client.XAdd(ctx, &redis.XAddArgs{
		Stream: streamKey,
		Values: map[string]interface{}{
			"event": "sync",
		},
	}).Result()
	if err != nil {
		log.Println("redis: failed to publish sync marker for room", roomID, ":", err)
	} else {
		log.Println("Published sync marker for room", roomID)
	}

}
func StartRedisSyncLoop(roomID string, getContent func() string) {
	go func() {
		log.Println("🌀 Starting sync loop for room:", roomID)
		ticker := time.NewTicker(2 * time.Second)
		defer ticker.Stop()

		for {
			<-ticker.C

			content := getContent()
			ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)

			SyncContentToRedis(roomID, content)
			log.Println("Writing content and publishing sync marker for room:", roomID)
			PublishSyncMarker(ctx, roomID)

			cancel()
		}
	}()
}
