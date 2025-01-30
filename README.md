# Task Management API

This API enables the creation and management of tasks, users, and groups. Built with [NestJS](https://nestjs.com/), it follows a modular architecture for scalability and provides secure user authentication through JWT.

## Features

- **Authentication**: User signup and login using JWT.
- **Task Management**: Create, retrieve, update, and delete tasks.
- **Group Management**: Organize users into groups, manage roles, and remove members.
- **Role Assignment**: Assign roles to users within groups.
- **User Management**: Retrieve a list of all users.
- **Modular Architecture**: Separate modules for authentication, tasks, users, and groups for easy maintenance.

## Project Structure

```plaintext
src/
├── auth/                 # Authentication module
│   ├── dto/              # Data Transfer Objects for authentication
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── id-decorator.ts   # Custom decorator for extracting user ID
│   └── jwt-strategy.ts   # JWT implementation
├── db/                   # Database configuration
│   ├── database.module.ts
│   ├── database.service.ts
│   └── usersGroups.model.ts  # Association between users and groups
├── groups/               # Groups module
│   ├── dto/              # Data Transfer Objects for groups
│   ├── entities/         # Entities for database models
│   ├── groups.controller.ts
│   ├── groups.module.ts
│   └── groups.service.ts
├── tasks/                # Tasks module
│   ├── dto/              # Data Transfer Objects for tasks
│   ├── entities/         # Entities for database models
│   ├── task.controller.ts
│   ├── tasks.module.ts
│   └── task.service.ts
├── users/                # Users module
│   ├── user.controller.ts
│   ├── user.module.ts
│   └── user.service.ts
├── app.module.ts         # Root module
└── main.ts               # Application entry point
```


## API Endpoints

### Authentication

- **POST /auth/signup**  
  Create a new user.

- **POST /auth/signin**  
  Authenticate a user and return a JWT token.

---

### Groups

- **POST /groups**  
  Create a new group.

- **GET /groups**  
  Retrieve all groups associated with the authenticated user.

- **GET /groups/:groupId**  
  Retrieve details of a specific group by its ID.

- **PUT /groups/:groupId**  
  Update group details by its ID.

- **DELETE /groups/:groupId**  
  Delete a group by its ID.

- **POST /groups/:groupId/:asigneeId**  
  Assign a role to a user in a group.

- **DELETE /groups/:groupId/:toEliminateId**  
  Remove a user from a group.

---

### Tasks

- **POST /tasks/**  
  Create a new task and associate it with a group.

- **GET /tasks/**  
  Retrieve all tasks for the authenticated user.

- **GET /tasks/:taskId**  
  Retrieve details of a specific task by its ID.

- **PUT /tasks/:taskId**  
  Update details of a specific task.

- **DELETE /tasks/:taskId**  
  Delete a task by its ID.

---

### Users

- **GET /users/**  
  Retrieve a list of all users.

---

## Authentication

All endpoints (except `/auth/signup` and `/auth/signin`) are protected and require a valid JWT token. Include the token in the `Authorization` header as follows: 'Authorization: Bearer <token>'


