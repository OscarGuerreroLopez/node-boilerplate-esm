# Node.js Boilerplate with DDD

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20.12.x-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Yarn](https://img.shields.io/badge/Yarn-1.22.x-blue)](https://yarnpkg.com/)

This project is a robust and scalable boilerplate for building Node.js applications using modern architectural patterns. It incorporates **Domain-Driven Design (DDD)** principles to create a clean, maintainable, and extensible codebase.

## Key Features

*   **Domain-Driven Design (DDD):** The application is structured around core domain concepts, promoting a clear separation of concerns and a rich domain model.
*   **Clean Architecture:** The codebase is organized into layers (domain, application, infrastructure, presentation) to ensure loose coupling and testability.
*   **TypeScript:** Leverages the power of TypeScript for static typing, improved code quality, and enhanced developer experience.
*   **Asynchronous Operations:** Built with asynchronous programming in mind, making it suitable for I/O-bound tasks.
*   **Dependency Injection:** Promotes loose coupling and testability.
*   **Logging:** Includes a robust logging system for monitoring and debugging.
*   **Environment Variables:** Uses environment variables for configuration, making it easy to deploy to different environments.
*   **Docker Support:** Provides a Dockerfile and docker-compose configuration for easy containerization and deployment.
* **MongoDB:** Uses MongoDB as database.
* **Yarn:** Uses Yarn as package manager.

## Project Structure

```text
.
├── src/
│   ├── app.ts                     # Express bootstrap: middleware, routes, error handling
│   ├── core/
│   │   ├── config/                # Environment variable loader (`env-var`)
│   │   ├── domain/                # DDD entities, aggregates, events, value objects
│   │   ├── dtos/                  # Request/response DTOs with validation logic
│   │   ├── errors/                # Typed errors (WarnError, AppError, etc.)
│   │   └── types/                 # Shared types, constants, identifiers, status enums
│   ├── infra/
│   │   ├── mongo/                 # Mongo connections and health checks
│   │   ├── mongoRepositories/     # Mongo persistence adapters (user repository)
│   │   ├── sql/                   # SQL connection helpers / Prisma adapters
│   │   └── sqlRepositories/       # SQL persistence adapters mirroring the Mongo API
│   ├── myapp/
│   │   ├── presentation/          # Express controller + route registration
│   │   ├── services/              # Integrations (DB checks, fake KYC/Mail/Geo services)
│   │   └── usecases/              # Application service layer (add/get/update user)
│   ├── shared/
│   │   ├── helpers/               # Cross-cutting helpers (UUID maker, etc.)
│   │   ├── logger/                # Winston logger configuration
│   │   └── middleware/            # Logger, rate limiting, credentials, exception handling
│   └── __tests__/                 # Jest test suites
├── prisma/                        # Prisma schema, migrations, and SQLite dev DB
├── script-*.ts                    # Utility scripts for creating/listing/updating resources
├── dist/                          # Transpiled output (gitignored)
├── coverage/                      # Jest coverage reports
├── logs/                          # Runtime logs written by the logger middleware
├── Dockerfile / docker-compose.yml# Containerization assets
├── jest.config.ts / tsconfig.json # Tooling configuration
└── package.json / yarn.lock       # Dependencies and scripts
```

**Layer rundown**

- `src/core/` is pure domain + shared kernel code and has no Express dependencies, which keeps the domain model portable.
- `src/myapp/` composes DTOs, use cases, and controllers specific to this service; this is where new features usually land.
- `src/infra/` holds persistence adapters for Mongo and SQL so use cases can persist to multiple stores in parallel.
- `src/shared/` centralizes middleware stacks (JSON parsing, rate limiting, credentials, exception handler) plus logging helpers.
- `src/app.ts` wires Express middleware (`expressEssentials`, `LoggerMiddleware`, `expressRateLimiter`, `credentialsMiddleware`) and mounts the routes under `/${SERVICE_NAME}/${DEFAULT_API_PREFIX}` before handing off to `src/index.ts` for the actual `listen` call.
- Non-`src` folders such as `prisma/`, `script-*.ts`, `dist/`, `coverage/`, and `logs/` support infrastructure tasks (database schema, automation, build artifacts, and diagnostics).

## Prerequisites

*   Node.js (v20.12.x or higher recommended)
*   Yarn
*   Docker (optional, for containerized deployment)
*   MongoDB

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/OscarGuerreroLopez/node-boilerplate-esm.git  
    ```

2.  **Install dependencies:**

    ```bash
    yarn install
    ```

3.  **Create a `.env` file:**

    *   Copy the `.env.example` file to `.env` and update the values with your own.

    ```bash
    cp .env.example .env
    ```

## Environment Variables

The following environment variables are required to run the application. You must define them in your `.env` file:

*   **`PORT`:** The port the application will listen on (e.g., `3000`).
*   **`DEFAULT_API_PREFIX`:** Path segment appended after the service name (e.g., `api/v1`); omit the leading slash because the app prefixes one for you.
*   **`NODE_ENV`:** The environment (e.g., `development`, `production`).
*   **`PLATFORM`:** The platform where the app is running (e.g., `local`, `aws`).
*   **`API_KEY`:** Key to use to be able to access the app.
*   **`MONGO_USER`:** The MongoDB username.
*   **`MONGO_PASSWORD`:** The MongoDB password.
*   **`MONGO_URL`:** The MongoDB connection URL (e.g., `mongodb://localhost:27017/mydatabase`).
*   **`SERVICE_NAME`:** The name of the service (e.g., `my-user-service`).
*   **`MONGO_DATABASE`:** The name of Db to use.
*   **`DATABASE_URL`:** Prisma/SQL connection string used by the SQL repository layer.
*   **`DATABASE_URL_TEST`:** Separate connection string for running the Jest/Prisma test suite.

## HTTP API

### Base URL & Headers

- All routes are mounted under `/${SERVICE_NAME}/${DEFAULT_API_PREFIX}`. With the default `.env.example` this resolves to `/boilerplate/v1`.
- Every request must include an `x-api-key` header that matches `API_KEY`. Requests without it are rejected by `credentialsMiddleware`.
- Accept and send JSON (`Content-Type: application/json`). Requests are rate-limited to 25 per IP every 5 minutes by `expressRateLimiter`.
- `LoggerMiddleware` attaches a `code` correlation ID to each request; controllers echo it back inside the response payload for tracing.
- Successful responses follow the `SuccessResponse<T>` envelope:

```json
{
  "serviceName": "boilerplate",
  "data": { /* endpoint-specific payload */ }
}
```

### Endpoints

> The paths below are relative to the base URL described above.

#### `GET /meta`

- Returns deployment metadata and confirms Mongo connectivity by calling `checkMongoDatabase`.
- Response body:

```json
{
  "serviceName": "boilerplate",
  "data": {
    "message": "OK",
    "code": "1b4f8b50-34b5-4d23-bf44-8b0d38e2ce41",
    "platform": "development",
    "environment": "development",
    "dbName": "boilerplate"
  }
}
```

#### `POST /add-user`

- Creates a user aggregate in both Mongo and SQL repositories.
- Required headers: `x-api-key`.
- Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "addresses": [
    {
      "street": "123 Main St",
      "city": "Austin",
      "country": "US",
      "status": "PENDING",
      "entityId": "addr-1"
    }
  ]
}
```

- Validation rules enforced by `AddUserDto`:
  - `name` and `email` are required and trimmed.
  - `addresses` must contain 1–3 entries; each entry defaults missing fields to empty strings and status to `PENDING`.
- Response payload mirrors `UserResponseDto` plus the request `code`:

```json
{
  "serviceName": "boilerplate",
  "data": {
    "id": "65b5c1e7d10c3f001294fd2b",
    "entityId": "user-123",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "status": "PENDING",
    "kycStatus": "PENDING",
    "emailStatus": "PENDING",
    "addresses": [
      {
        "entityId": "addr-1",
        "street": "123 Main St",
        "city": "Austin",
        "country": "US",
        "status": "PENDING"
      }
    ],
    "code": "1b4f8b50-34b5-4d23-bf44-8b0d38e2ce41"
  }
}
```

#### `GET /:entityId`

- Retrieves a user by `entityId`.
- Requires the `x-api-key` header; `entityId` comes from the path segment following the base URL.
- Response body is identical to the `POST /add-user` response and includes the correlation `code`.

#### `PUT /update-user`

- Updates a user by either Mongo `_id` or domain `entityId`. Both Mongo and SQL repositories are updated in parallel.
- Request body:

```json
{
  "identifier": { "type": "entityId", "value": "user-123" },
  "name": "Jane D",
  "email": "jane.d@example.com",
  "addresses": [
    {
      "entityId": "addr-1",
      "street": "500 Market St",
      "city": "San Francisco",
      "country": "US"
    }
  ],
  "status": "ACTIVE",
  "kycStatus": "VERIFIED",
  "emailStatus": "VERIFIED"
}
```

- Validation rules enforced by `UpdateUserDto`:
  - `identifier.type` must be either `id` or `entityId`; both `type` and `value` are required.
  - At most 3 addresses. Each address must include `street`, `city`, and `country` when present.
  - Changing `name` or `email` automatically sets the aggregate, KYC, or email statuses to `PENDING` before persistence.
- Response payload matches the user schema returned by `POST /add-user`.

## Running the Application

### Development Mode

```bash
yarn dev
```
```bash
yarn build
yarn start  
```

### Docker

```bash
 yarn build
 docker-compose --env-file .docker.env  up -d --build 
 docker-compose down --remove-orphans   
```
  
