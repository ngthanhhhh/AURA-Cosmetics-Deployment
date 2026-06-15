# AURA Cosmetics - Deployment Convention

## 1. Branch làm việc

Tất cả cấu hình Docker và hosting/server được thực hiện trên branch:

```bash
deploy
```

Trước khi làm:

```bash
git checkout deploy
git pull origin deploy
```

Sau khi làm xong:

```bash
git add .
git commit -m "message"
git push origin deploy
```

Không sửa trực tiếp trên `main`. Khi Docker và hosting/server chạy ổn định thì mới merge `deploy` vào `main`.

---

## 2. Backend environment

Backend sử dụng Spring Profiles:

| Môi trường | Profile    | File cấu hình                   | Mục đích                |
| ------------- | ---------- | --------------------------------- | -------------------------- |
| Local         | default    | `application.properties`        | Chạy trên máy cá nhân |
| Docker        | `docker` | `application-docker.properties` | Chạy bằng Docker Compose |
| Production    | `prod`   | `application-prod.properties`   | Chạy trên hosting/server |

File thật local không commit:

```txt
backend/src/main/resources/application.properties
```

File mẫu local được commit:

```txt
backend/src/main/resources/application.properties.example
```

Người clone project cần copy file mẫu thành file thật:

```powershell
Copy-Item backend/src/main/resources/application.properties.example backend/src/main/resources/application.properties
```

---

## 3. Frontend environment

Frontend sử dụng biến môi trường của Vite:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Trong axios client, không hard-code backend URL. Sử dụng:

```js
baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
```

Các file env:

| File                                 | Mục đích                                    |
| ------------------------------------ | ---------------------------------------------- |
| `frontend/.env.example`            | Mẫu cấu hình frontend local                 |
| `frontend/.env.docker`             | Cấu hình frontend khi chạy Docker           |
| `frontend/.env.production.example` | Mẫu cấu hình frontend khi deploy production |
| `frontend/.env`                    | File thật local, không commit                |

---

## 4. Docker convention

Docker do Thủy phụ trách.

Các file Docker chính:

```txt
backend/Dockerfile
backend/.dockerignore
frontend/Dockerfile
frontend/.dockerignore
frontend/nginx.conf
docker-compose.yml
backend/src/main/resources/application-docker.properties
```

Backend khi chạy Docker phải dùng profile:

```env
SPRING_PROFILES_ACTIVE=docker
```

Trong Docker Compose, service MySQL đặt tên là:

```txt
mysql
```

Vì vậy datasource trong `application-docker.properties` dùng host là `mysql`.

Port thống nhất:

```txt
Frontend Docker: http://localhost:5173
Backend Docker:  http://localhost:8080
MySQL Docker:    localhost:3307
```

---

## 5. Production / hosting convention

Hosting/server do Thanh phụ trách.

Backend production dùng profile:

```env
SPRING_PROFILES_ACTIVE=prod
```

Backend production đọc cấu hình từ environment variables:

```env
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080

DB_URL=jdbc:mysql://your-host:3306/web_store?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh&allowPublicKeyRetrieval=true
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

JWT_SECRET=your_long_random_secret
JWT_EXPIRATION=86400000

VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_RETURN_URL=https://your-frontend-domain.com/payments/vnpay-return

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Frontend production cần set trên Vercel/hosting:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
```

---

## 6. Phân công file

### Thanh phụ trách

```txt
backend/src/main/resources/application-prod.properties
frontend/.env.production.example
README-deploy.md
Cấu hình hosting/server
```

### Thủy phụ trách

```txt
backend/Dockerfile
backend/.dockerignore
frontend/Dockerfile
frontend/.dockerignore
frontend/nginx.conf
docker-compose.yml
backend/src/main/resources/application-docker.properties
README-docker.md nếu cần
```

### File dùng chung, hạn chế sửa cùng lúc

```txt
README.md
.gitignore
frontend/src/api/axiosClient.js
```

Nếu cần sửa file chung thì báo trước trong nhóm rồi `git pull origin deploy` trước khi sửa.

---

## 7. Quy tắc secret

Không commit các file chứa cấu hình thật:

```txt
backend/src/main/resources/application.properties
frontend/.env
frontend/.env.production
```

Chỉ commit file mẫu hoặc file dùng biến môi trường:

```txt
application.properties.example
application-docker.properties
application-prod.properties
.env.example
.env.docker
.env.production.example
```
