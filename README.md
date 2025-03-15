[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=18605226&assignment_repo_type=AssignmentRepo)

# P2-Challenge-1 (Server Side)

> Tuliskan API Docs kamu di sini

# Cuisine API Documentation

## Endpoints

List of available endpoints:

- `POST /login`
- `GET /pub/cuisines`
- `GET /pub/cuisines/:id`
- `GET /pub/categories`

Routes below need authentication:

- `POST /cuisines`
- `GET /cuisines`
- `GET /cuisines/:id`
- `POST /categories`
- `GET /categories`
- `PUT /categories/:id`

Routes below need authorization:

> The request user, if not of role admin, can only delete or update cuisine that has their user id

- `PUT /cuisines/:id`
- `DELETE /cuisines/:id`
- `PATCH /cuisines/:id/img-url`

> The request user should be an admin

- `POST /add-user`

&nbsp;

## 1. POST /login

Description:

- Login into the system

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email is required"
}

OR

{
  "message": "Password is required"
}

OR

{
  "message": "Invalid email or password"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 2. GET /pub/cuisines

Description:

- Get cuisine from the database
- Can have filter, search, sort, pagination
- No need to log in

Request:

- query:

```json
{
  "q": "string (optional)",
  "filterCategory": "number or comma-separated number (optional)",
  "page": "number (optional)",
  "sort": "string (optional) - Can only be ASC or DESC"
}
```

_Response (200 - OK)_

```json
{
  "page": "number",
  "data": [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "price": "number",
      "imgUrl": "string",
      "categoryId": "number",
      "authorId": "number",
      "createdAt": "string",
      "updatedAt": "string",
      "User": {
        "id": "number",
        "username": "string",
        "email": "string",
        "role": "string",
        "phoneNumber": "string",
        "address": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
  ],
  "totalData": "number",
  "totalPage": "number"
}
```

&nbsp;

## 3. GET /pub/cuisines/:id

Description:

- Get cuisine by id
- No need to log in

Request:

- params:

```json
{
  "id": "number (required)"
}
```

_Response (200 - OK)_

```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "price": "number",
  "imgUrl": "string",
  "categoryId": "number",
  "authorId": "number",
  "createdAt": "number",
  "updatedAt": "number"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Data not found"
}
```

&nbsp;

## 4. GET /pub/categories

Description:

- Get all category from the database
- No need to log in

Request:

_Response (200 - OK)_

```json
[
  {
    "id": "number",
    "name": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

&nbsp;

## 5. POST /cuisines

Description:

- Create a new cuisine

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "imgUrl": "string",
  "categoryId": "number",
  "authorId": "number"
}
```

_Response (201 - Created)_

```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "price": "number",
  "imgUrl": "string",
  "categoryId": "number",
  "authorId": "number",
  "updatedAt": "string",
  "createdAt": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "name is required"
}

OR

{
  "message": "description is required"
}

OR

{
  "message": "price is required"
}

OR

{
  "message": "Image URL is required"
}

OR

{
  "message": "CategoryId is required"
}

OR

{
  "message": "authorId is required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

&nbsp;

## 6. GET /cuisines

Description:

- Get all cuisine from the database

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "price": "number",
    "imgUrl": "string",
    "categoryId": "number",
    "authorId": "number",
    "createdAt": "string",
    "updatedAt": "string",
    "User": {
      "id": "number",
      "username": "string",
      "email": "string",
      "role": "string",
      "phoneNumber": "string",
      "address": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
]
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

&nbsp;

## 7. GET /cuisines/:id

Description:

- Get cuisine by id

Request:

- params:

```json
{
  "id": "number (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "price": "number",
  "imgUrl": "string",
  "categoryId": "number",
  "authorId": "number",
  "createdAt": "number",
  "updatedAt": "number"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Data not found"
}
```

&nbsp;

## 8. POST /categories

Description:

- Create a new category

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "name": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "number",
  "name": "string",
  "updatedAt": "string",
  "createdAt": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "name is required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

&nbsp;

## 9. GET /categories

Description:

- Get all category from the database

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": "number",
    "name": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

&nbsp;

## 10. PUT /categories/:id

Description:

- Edit category by id

Request:

- params:

```json
{
  "id": "number (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "name": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "number",
  "name": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "name is required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Data not found"
}
```

&nbsp;

## 11. PUT /cuisines/:id

Description:

- Edit cuisine by id

Request:

- params:

```json
{
  "id": "number (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "imgUrl": "string",
  "categoryId": "number",
  "authorId": "number"
}
```

_Response (201 - Created)_

```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "price": "number",
  "imgUrl": "string",
  "categoryId": "number",
  "authorId": "number",
  "updatedAt": "string",
  "createdAt": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "name is required"
}

OR

{
  "message": "description is required"
}

OR

{
  "message": "price is required"
}

OR

{
  "message": "Image URL is required"
}

OR

{
  "message": "CategoryId is required"
}

OR

{
  "message": "authorId is required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "Forbidden access"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Data not found"
}
```

&nbsp;

## 12. DELETE /cuisines/:id

Description:

- Delete cuisine by id

Request:

- params:

```json
{
  "id": "number (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "price": "number",
  "imgUrl": "string",
  "categoryId": "number",
  "authorId": "number",
  "createdAt": "string",
  "updatedAt": "string"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "Forbidden access"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Data not found"
}
```

&nbsp;

## 13. PATCH /cuisines/:id/img-url

Description:

- Update cuisine image

Request:

- params:

```json
{
  "id": "number (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
{
  "message": "Image cuisine success to update"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "File is required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "Forbidden access"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Data not found"
}
```

&nbsp;

## 14. POST /add-user

Description:

- Create a new user
- Only for admin

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "email": "string",
  "password": "string",
  "phoneNumber": "string",
  "address": "string",
  "username": "string"
}
```

_Response (201 - Created)_

```json
{
  "email": "string",
  "username": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "email is required"
}

OR

{
  "message": "email is already registered"
}

OR

{
  "message": "email must be of format email"
}

OR

{
  "message": "password is required"
}

OR

{
  "message": "minimal password length is 5 characters"
}

```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "Forbidden access"
}
```

&nbsp;

## Global Error

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```
