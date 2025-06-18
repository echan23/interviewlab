package postgres

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var DB *pgxpool.Pool

func Init(){
	if err := godotenv.Load(); err != nil{
		log.Println("No env variables found")
	}

	url := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		os.Getenv("PG_USER"),
		os.Getenv("PG_PASSWORD"),
		os.Getenv("PG_HOST"),
		os.Getenv("PG_PORT"),
		os.Getenv("PG_DB"),
	)

	pool, err := pgxpool.New(context.Background(), url)
	if err != nil{
		log.Fatal("Postgres conneciton failed")
	}

	DB = pool
}

