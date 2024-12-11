# Run Docker Compose

1. With build
```
docker compose -f docker-compose.yaml up --build -d
```

2. Without build
```
docker compose -f docker-compose.yaml up -d
```


# Stop Docker Compose

```
docker compose -f docker-compose.yaml down
```