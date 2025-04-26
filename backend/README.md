# Uber Project - Backend Documentation

## API Endpoints

### 1. User Registration

#### Endpoint: `/users/register`

#### Method: `POST`

#### Description:

This endpoint allows a new user to register by providing their details. It validates the input, checks if the user already exists, hashes the password, and creates a new user in the database.

---

#### Request Body:

The following fields are required in the request body:

| Field                | Type   | Required | Description                               |
| -------------------- | ------ | -------- | ----------------------------------------- |
| `fullname.firstname` | String | Yes      | The first name of the user (min 3 chars). |
| `fullname.lastname`  | String | No       | The last name of the user (min 3 chars).  |
| `email`              | String | Yes      | The email address of the user.            |
| `password`           | String | Yes      | The password for the user (min 6 chars).  |

---

#### Validation Rules:

- `fullname.firstname`: Must be at least 3 characters long.
- `email`: Must be a valid email address.
- `password`: Must be at least 6 characters long.

---

#### Response:

##### Success (201):

- **Description**: User successfully registered.
- **Response Body**:
  ```json
  {
    "token": "JWT_TOKEN",
    "user": {
      "_id": "USER_ID",
      "fullname": {
        "firstname": "FIRST_NAME",
        "lastname": "LAST_NAME"
      },
      "email": "EMAIL"
    }
  }
  ```
2. Get User Profile
Endpoint: /users/profile
Method: GET
Description:
This endpoint retrieves the profile of the currently authenticated user. The user must be logged in and authenticated to access this endpoint.

Headers:
Authorization: Bearer token (JWT token).
Response:
Success (200):
Description: User profile retrieved successfully.
Response Body:
{
    "_id": "USER_ID",
    "fullname": {
        "firstname": "FIRST_NAME",
        "lastname": "LAST_NAME"
    },
    "email": "EMAIL"
}
Client Errors:
401 Unauthorized: User is not authenticated.
Response Body:
{
    "message": "Authentication required"
}

3. Logout User
Endpoint: /users/logout
Method: GET
Description:
This endpoint logs out the currently authenticated user by clearing the authentication token and blacklisting it.

Headers:
Authorization: Bearer token (JWT token).
Response:
Success (200):
Description: User logged out successfully.
Response Body:
{
    "message": "User logged out successfully"
}
Client Errors:
401 Unauthorized: User is not authenticated.
Response Body:
{
    "message": "Authentication required"
}

