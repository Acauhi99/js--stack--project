# Infrastructure Project

This project demonstrates a complete infrastructure setup using Docker and Docker Compose. It includes:

- **API**: A backend API built with [NestJS](https://nestjs.com/) using TypeScript and TypeORM.
- **Database**: A PostgreSQL database for data persistence.
- **Proxy and Load Balancing**: Managed by NGINX.
- **Networking**: All components are containerized and connected via Docker Compose.

## Project Structure

- `api/`: Contains the NestJS API source code.
- `nginx/`: Configuration files for the NGINX proxy.
- `todo-request.http`: HTTP request examples for testing the API.

## Prerequisites

- [Docker](https://www.docker.com/) installed on your system.
- [Docker Compose](https://docs.docker.com/compose/) installed.

## How to Run

1. Navigate to the `api` directory:

   ```bash
   cd api
   ```

2. Start the containers:

   ```bash
   docker-compose up -d
   ```

   This will start the API, PostgreSQL database, and NGINX proxy.

3. Verify that the containers are running:
   ```bash
   docker ps
   ```

## Testing the API

Use the `todo-request.http` file to test the API endpoints. You can use an HTTP client like [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) for VS Code or [Postman](https://www.postman.com/).

### Example Requests

- **List all todos**:

  ```http
  GET http://localhost/todos
  ```

- **Create a new todo**:

  ```http
  POST http://localhost/todos
  Content-Type: application/json

  {
    "title": "Sample Todo",
    "description": "This is a sample todo item."
  }
  ```

Refer to the `todo-request.http` file for more examples.

## Notes

- The API is exposed on port `3000` internally and proxied by NGINX on port `80`.
- The PostgreSQL database is accessible on port `5432`.

## Stopping the Project

To stop and remove the containers, run:

```bash
docker-compose down
```

## License

This project is licensed under the MIT License.
