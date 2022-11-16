#!/bin/bash

# Define variables
PORT="3306"
CONTAINER_NAME="todo-mysql-db"
MYSQL_DATABASE="todo"
MYSQL_ROOT_PASSWORD="password"

# Run docker container with postgres db
CONTAINER_ID=$(
  docker run --rm --detach -p $PORT:$PORT --name $CONTAINER_NAME \
    -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
    -e MYSQL_DATABASE=$MYSQL_DATABASE \
    mysql:latest
)

echo "Container id: $CONTAINER_ID"

# Run prisma migrations
#npx dotenv -e .env.development -- npx prisma migrate dev

# Open container bash and execute enter the command-line interface to PostgreSQL
docker exec -it $CONTAINER_NAME bash

# Define on_exit function which will stop container
on_exit() {
  docker container stop $CONTAINER_NAME
}

# Bind on_exit function to EXIT
trap on_exit EXIT
