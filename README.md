# BV Todo App

A simple Todo application built with Angular and .NET 9, using Entity Framework and SQLite for data persistence.

## Features

- User authentication (Login, Logout, and Registration)
- Create, edit, and delete todo items
- Responsive UI with Angular Material

## Tech Stack

### Frontend

- **Angular** (Latest version)
- **Angular Material** (UI components)
- **RxJS** (Reactive programming)

### Backend

- **.NET 9 Web API**
- **Entity Framework Core** (ORM for database management)
- **SQLite** (Lightweight database)
- **JWT Authentication** (Secure API access)

## Installation

### Prerequisites

- Node.js & npm (for Angular)
- .NET 9 SDK
- SQLite (or another database if configured)

### Clone the Repository

```sh
git clone https://github.com/Arc4d3-G/BV_Todo.git 
cd  BV_Todo 
```

### Frontend Setup

```sh
cd frontend/todo-app
npm install
npm start
```

### Backend Setup

```sh
cd backend/todo-api
# Restore .NET dependencies
dotnet restore
# Apply migrations and create database
dotnet ef database update
# Run the API
dotnet run
```

## Usage

1. Open the frontend in a browser (default: `http://localhost:4200`).
2. Register or log in with your credentials.
3. Start adding, editing, and organizing your todos!

## Environment Variables

(Optional) Create a `.env` file in the backend todo-api directory with:

```env
JWTSETTINGS__SECRET=your-secret-JWT-key
ALLOWEDORIGINS=your-frontend-url
```

## API Endpoints

### User Endpoints

- **POST /api/user/register**
  - Registers a new user.
  - Request body: `{ "Email": "user@example.com", "Password": "password123", "Username": "user123" }`
  - Response: Created user details or error message.

- **POST /api/user/login**
  - Logs in a user and returns a JWT token.
  - Request body: `{ "Email": "user@example.com", "Password": "password123" }`
  - Response: JWT token or error message.

- **GET /api/user/me**
  - Retrieves details of the authenticated user.
  - Response: Authenticated user's ID and username or error message.

### Todo Endpoints

- **GET /api/todo/me**
  - Retrieves all todo items for the authenticated user.
  - Response: List of todo items.

- **POST /api/todo**
  - Creates a new todo item for the authenticated user.
  - Request body: `{ "Title": "New Task", "IsComplete": false }`
  - Response: Created todo item details or error message.

- **PUT /api/todo/{id}**
  - Updates an existing todo item for the authenticated user.
  - Request body: `{ "Title": "Updated Task", "IsComplete": true }`
  - Response: No content or error message.

- **DELETE /api/todo/{id}**
  - Deletes a todo item for the authenticated user.
  - Response: No content or error message.

## Author

Developed by **Dewald Breed**
