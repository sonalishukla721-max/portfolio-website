# Task Management REST API

A secure CRUD REST API built with Node.js, Express.js and MongoDB.

## Features

- User registration
- User login with JWT authentication
- Password hashing using bcrypt
- Protected task routes
- Create, Read, Update and Delete tasks
- Input validation
- Proper HTTP status codes
- MongoDB database integration

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- CORS

## Authentication

### Register User

**POST** `/api/auth/register`

Request Body:

```json
{
  "name": "Sonali",
  "email": "sonali@example.com",
  "password": "password123"
}