# Test done!

## Instalation

- Pull project
- `npm i`
- `docker-compose up --build`
- `docker exec -it be-test-app-1 sh scripts/migrations.sh -y`
- Running tests `docker exec -it be-test-app-1 sh scripts/tests.sh`

## Walkthrough

### Directory

- `scripts/` = folder where are the scripts to run easly migrations and tests
- `migrations/` = files need to create the tables in postgresql with sequelize
- `src/` = source folder where are living all typescript files
- `src/controllers` = there are the controllers need to run the application
- `src/models` = models Task and User to handle the objects for the required purpose
- `src/policy` = authentication file
- `src/lib` = decorators file taken from a library and modifed for our purpose

### Endpoints (localhost:8080)

- `POST /users`; create a new user, payload = `{ email, password }`
- `POST /users/login`; log in a user, payload = `{ email, password }`
- `GET /tasks`; get all tasks of a user, header `accessToken = jwt`
- `POST /tasks`; create a new task, header `accessToken = jwt`, payload `{ title, description, status: "TO_DO" | "IN_PROGRESS" | "ARCHIVED" | "DONE" }`
- `POST /tasks/:taskId`; update a task, header `accessToken = jwt`, payload `{ title, description, status: "TO_DO" | "IN_PROGRESS" | "ARCHIVED" | "DONE" }`

---

# Getting Started with the Every.io engineering challenge.

Thanks for taking the time to complete the Every.io code challenge. Don't worry, it's not too hard, and please do not spend more than an hour or two. We know you have lots of these to do, and it can be very time consuming.

## The biggest factor will be your code:

1. How readable, is your code.
2. Scalability.
3. Are there any bugs.

## Requirements

You will be creating an API for a task application.

1. This application will have tasks with four different states:
   - To do
   - In Progress
   - Done
   - Archived
2. Each task should contain: Title, Description, and what the current status is.
3. A task can be archived and moved between columns, or statuses.
4. The endpoint for tasks should only display tasks for those users who have authenticated and are authorized to view their tasks.

## Ideal

- Typescript
- Tests
- Dockerized Application

## Extra credit

- Apollo Server GraphQL
- Logging
