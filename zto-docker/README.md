# Run ZTO project

1. Run project using Docker Compose with build option
   ```
   docker compose -f docker-compose.yaml up --build -d
   ```

2. Run project using Docker Compose without build option
   ```
   docker compose -f docker-compose.yaml up -d
   ```

# Stop ZTO project

1. Stop project using Docker Compose
   ```
   docker compose -f docker-compose.yaml down
   ```