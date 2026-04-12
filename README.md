# Cosmetics Shop Project

## 1. Clone project

```bash
git clone https://github.com/ngthanhhhh/Du-An-My-Pham.git
cd Du-An-My-Pham
```

---

## 2. Chạy Backend (Spring Boot)

Đi vào folder backend:

```bash
cd backend
```

Chạy server:

```bash
./mvnw spring-boot:run
```

Backend sẽ chạy tại:

```
http://localhost:8080
```

---

## 3. Chạy Frontend (ReactJS)

Mở terminal mới rồi vào folder frontend:

```bash
cd frontend
```

Cài thư viện:

```bash
npm install
```

Chạy React:

```bash
npm run dev
```

Frontend sẽ chạy tại:

```
http://localhost:5173
```

---

## 4. Cấu trúc project

```
Du-An-My-Pham
 ├─ backend  (Spring Boot API)
 └─ frontend (ReactJS UI)
```

---

## 5. Lưu ý

* Backend chạy port **8080**
* Frontend chạy port **5173**
* React sẽ gọi API từ Spring Boot
* Copy file application.properties.example thành application.properties ở backend để chạy DB.
