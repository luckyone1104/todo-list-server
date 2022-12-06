# Todo List Server

This is a simple todo list server written in JS. It uses a mysql database to store the data. And it is based on RESTful API.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`


## API Reference

**Get all todo lists**

```
GET /lists
```

**Get a todo list**

```
GET /lists/:id
```

**Create a todo list**

```
POST /lists
```

| Parameter  | Type     | Description             |
|------------|----------|-------------------------|
| `name`     | `string` | **Required**. List name |

**Update a todo list**

```
PUT /lists/:id
```

| Parameter  | Type     | Description                   |
|------------|----------|-------------------------------|
| `name`     | `string` | **Required**. List name       |

**Delete a todo list**

```
DELETE /lists/:id
```

Deletes a todo list and all its todos.

**Create a todo**

```
POST /items
```

| Parameter     | Type     | Description               |
|---------------|----------|---------------------------|
| `listId`      | `string` | **Required**. List id     |
| `description` | `string` | **Required**. Description |

**Update a todo**

```
PUT /items/:id
```

| Parameter     | Type     | Description               |
|---------------|----------|---------------------------|
| `listId`      | `string` | **Required**. List id     |
| `description` | `string` | **Required**. Description |

**Reorder todos within a certain list**

```
PUT /items/reorder
```

| Parameter  | Type        | Description                       |
|------------|-------------|-----------------------------------|
| `itemIds`  | `string[]`  | **Required**. Reordered todo ids  |
| `listId`   | `string`    | **Required**. List id             |

Reordering is done by sending an array of todo ids in the order you want them to be in.
Reordering is possible only for one step at a time. For example, if you want to move todo with id 1 to the end of the list, you can send an array like this: `[2, 3, 4, 1]`.

**Delete a todo**

```
DELETE /items/:id
```

| Parameter  | Type     | Description                   |
|------------|----------|-------------------------------|
| `id`       | `string` | **Required**. Route parameter |

## TODO

- [ ] Add authentication and authorization so that users can only access their own lists, share lists with other users and collaborate on them.
