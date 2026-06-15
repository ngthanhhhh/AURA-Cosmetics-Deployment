# AURA Cosmetics - Docker Guide

## 1. Mục tiêu

Docker dùng để chạy toàn bộ hệ thống AURA Cosmetics bằng một lệnh, gồm:

- MySQL
- Spring Boot Backend
- React/Vite Frontend

## 2. Service convention

| Service  | Container         | Port          |
| -------- | ----------------- | ------------- |
| MySQL    | `aura_mysql`    | `3307:3306` |
| Backend  | `aura_backend`  | `8080:8080` |
| Frontend | `aura_frontend` | `5173:80`   |

## 3. Backend profile

Backend chạy Docker bằng Spring profile:

```env
SPRING_PROFILES_ACTIVE=docker
```

File cấu hình:

```txt
backend/src/main/resources/application-docker.properties
```

## 4. Database

Trong Docker network, backend kết nối MySQL bằng service name:

```txt
mysql
```

Datasource:

```properties
spring.datasource.url=jdbc:mysql://mysql:3306/web_store?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh&allowPublicKeyRetrieval=true
```

## 5. Chạy Docker

Tại thư mục root project:

```bash
docker compose up --build
```

Chạy nền:

```bash
docker compose up -d --build
```

Dừng:

```bash
docker compose down
```

Reset database volume:

```bash
docker compose down -v
```

## 6. URL sau khi chạy

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:8080
MySQL:    localhost:3307
```
