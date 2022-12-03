#!/bin/bash

PORT="3306"
CONTAINER_NAME="todo-mysql-db"
MYSQL_DATABASE="todo-list"
MYSQL_ROOT_PASSWORD="password"

echo $'Running docker container...\n'

docker run --rm --detach -p $PORT:$PORT --name $CONTAINER_NAME \
  -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
  -e MYSQL_DATABASE=$MYSQL_DATABASE \
  mysql:latest > /dev/null

while ! docker exec $CONTAINER_NAME mysqladmin --user=root --password=$MYSQL_ROOT_PASSWORD --host "127.0.0.1" ping --silent &> /dev/null ; do
  echo "Connecting to mysql..."
  sleep 2
done

echo $'\nPushing database...\n'

npx prisma db push > /dev/null

echo $'Seeding database...\n'
npx prisma db seed > /dev/null

docker exec -it $CONTAINER_NAME bash

exit_container() {
  docker container stop $CONTAINER_NAME
}

trap exit_container EXIT

# To exit and stop container type "exit"
