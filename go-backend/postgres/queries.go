package postgres

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
)

func SaveToDB(ctx context.Context, roomID string, content string, editTime time.Time) error{
	query := `INSERT INTO codefiles(roomID, content, lastEdited) 
				VALUES($1, $2, $3)
				ON CONFLICT (roomID) DO UPDATE
				SET content = EXCLUDED.content,
					lastEdited = EXCLUDED.lastEdited;`
	_, err := DB.Exec(ctx, query, roomID, content, editTime)
	return err
}

var ErrRoomNotFound = errors.New("Room not found in Postgres")
func RetrieveContent(ctx context.Context, roomID string) (string, error){
	query := `SELECT content FROM codefiles WHERE roomID = $1`

	var content string
	err := DB.QueryRow(ctx, query, roomID).Scan(&content)
	if err != nil{
		if errors.Is(err, pgx.ErrNoRows){
			return "", ErrRoomNotFound
		}
		return "", fmt.Errorf("Failed to retrieve content from Postgres  %s: %w", roomID, err)
	}
	return content, nil
}