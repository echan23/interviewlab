package postgres

import (
	"context"
	"time"
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

func RetrieveContent(ctx context.Context, roomID string) (string, error){
	query := `SELECT content FROM codefiles WHERE roomID = $1`

	var content string
	err := DB.QueryRow(ctx, query, roomID).Scan(&content)
	if err != nil{
		return "", err
	}
	return content, nil
}