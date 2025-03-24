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

The project is organized into the following key directories:

*   **`src/core/`:** Contains the core domain logic, independent of any specific application or framework.
    *   **`domain/`:** The heart of the domain-driven design (DDD) approach.
        *   **`entities/`:** Base classes for entities and aggregates.
        *   **`events/`:** Base classes and dispatchers for domain events.
        *   **`user/`:** Domain-specific logic for users.
            *   **`entities/`:** User-related entities.
            *   **`events/`:** User-related domain events.
            *   **`handlers/`:** Handlers for user-related events.
        *   **`value-objects/`:** Value objects for the domain.
    *   **`config/`**: This folder is implied and it is supposed to keep track of env variables.
    *   **`dtos/`**: contains DTOS for input validation and also to shape responses.
    *   **`errors/`**: global error classes.
    *   **`types/`**: This folder is implied and it is supposed to keep the shared types, for usecases, entities, etc.
*   **`src/myapp/`:** Contains the application-specific code.
    *   **`usecases/`:** Application use cases.
    * **`presentation/`**: Contains the controllers and routes.
    * **`services/`**: Contains aux services also used in the app.
*   **`src/infra/`**: Contains the infrastructure code.
    * **`repositories/`**: Contains the repositories.
    * **`mongo/`**: Contains the mongo connection.
*   **`src/shared/`:** Contains shared utilities.

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
*   **`DEFAULT_API_PREFIX`:** The prefix for the API routes (e.g., `/api/v1`).
*   **`NODE_ENV`:** The environment (e.g., `development`, `production`).
*   **`PLATFORM`:** The platform where the app is running (e.g., `local`, `aws`).
*   **`API_KEY`:** Key to use to be able to access the app.
*   **`MONGO_USER`:** The MongoDB username.
*   **`MONGO_PASSWORD`:** The MongoDB password.
*   **`MONGO_URL`:** The MongoDB connection URL (e.g., `mongodb://localhost:27017/mydatabase`).
*   **`SERVICE_NAME`:** The name of the service (e.g., `my-user-service`).
*   **`MONGO_DATABASE`:** The name of Db to use.

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
  