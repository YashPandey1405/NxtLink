# NxtLink Postman-API Documentation

Welcome to the **NxtLink** API! This API allows you to create and manage short URLs, as well as perform user authentication.

---

## Base URL

```
http://192.168.1.91:3000/api
```

---

## Authentication

- **Signup:** Create a new user account.
- **Login:** Authenticate with your credentials to receive a JWT token (if implemented in backend).

---

## Endpoints

### 1. Create Short URL

- **URL:** `/urls`

- **Method:** `POST`

- **Description:** Create a new short URL with the original long URL and type (Public/Private).

- **Request Body:**

  ```json
  {
    "originalUrl": "https://leetcode.com/u/pandeyyash041/",
    "typeURL": "Public"
  }
  ```

- **Success Response:** `201 Created`

- **Response Body:** JSON object of the created short URL

---

### 2. Get All Short URLs

- **URL:** `/urls`
- **Method:** `GET`
- **Description:** Retrieve all short URLs visible to the user (public URLs or URLs created by the logged-in user).
- **Success Response:** `201 OK`
- **Response Body:** Array of short URL objects

---

### 3. Get Short URL By ID

- **URL:** `/urls/:id`

- **Method:** `GET`

- **Description:** Retrieve a single short URL by its unique ID.

- **URL Params:**

  | Parameter | Type   | Description             |
  | --------- | ------ | ----------------------- |
  | `id`      | String | MongoDB ObjectId of URL |

- **Success Response:** `201 OK`

- **Response Body:** Short URL object with details including the creator's username and fullname (populated).

---

### 4. User Signup

- **URL:** `/signup`

- **Method:** `POST`

- **Description:** Register a new user.

- **Request Body:**

  ```json
  {
    "email": "yashpandey@gmail.com",
    "username": "yashpandey",
    "fullname": "Yash Pandey",
    "password": "1234"
  }
  ```

- **Success Response:** `201 Created`

- **Response Body:** User object or confirmation message

---

### 5. User Login

- **URL:** `/login`

- **Method:** `POST`

- **Description:** Login with existing user credentials.

- **Request Body:**

  ```json
  {
    "email": "yashpandey@gmail.com",
    "username": "yashpandey",
    "password": "1234"
  }
  ```

- **Success Response:** `200 OK`

- **Response Body:** JWT token or user session data

---

## Notes

- Make sure to handle authentication tokens (JWT) properly for secured endpoints.
- The `typeURL` field in URL creation defaults to `"Private"` if omitted.
- `GET /urls` returns URLs filtered by your authentication status:

  - Unauthenticated users get only public URLs.
  - Authenticated users get their own URLs + public URLs.

- All IDs should be valid MongoDB ObjectIds.

---

## Example Curl

Create Short URL:

```bash
curl --location --request POST 'http://192.168.1.91:3000/api/urls' \
--header 'Content-Type: application/json' \
--data-raw '{
  "originalUrl": "https://leetcode.com/u/pandeyyash041/",
  "typeURL": "Public"
}'
```
