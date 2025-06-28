package postgres

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func Init(){

	url := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		os.Getenv("PG_USER"),
		os.Getenv("PG_PASSWORD"),
		os.Getenv("PG_HOST"),
		os.Getenv("PG_PORT"),
		os.Getenv("PG_DB"),
	)

	pool, err := pgxpool.New(context.Background(), url)
	if err != nil{
		log.Fatal("Postgres connection failed")
	}
	log.Println("Connected to Postgres")
	DB = pool
}

