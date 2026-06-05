# AURA Cosmetics - E-commerce Website

## 1. Giới thiệu

AURA Cosmetics là website thương mại điện tử bán mỹ phẩm, hỗ trợ khách hàng xem sản phẩm, tìm kiếm/lọc sản phẩm, quản lý giỏ hàng, đặt hàng, tích hợp mô phỏng thanh toán qua VNPay Sandbox và đánh giá sản phẩm.

Hệ thống cũng cung cấp trang quản trị cho admin để quản lý sản phẩm, danh mục, khách hàng, đơn hàng, đánh giá sản phẩm và thống kê doanh thu.

## 2. Công nghệ và kỹ thuật sử dụng

### Kiến trúc và giao tiếp

- Client-Server Architecture
- RESTful API

### Backend

- Java 17
- Spring Boot
- Spring Security + JWT
- Spring Data JPA / Hibernate
- MySQL

### Frontend

- ReactJS
- Vite

### Tích hợp bên ngoài

- VNPay Sandbox
- Cloudinary

### Design Pattern

- Prototype Pattern: áp dụng trong chức năng đặt hàng để tạo bản sao thông tin sản phẩm tại thời điểm phát sinh đơn hàng.

### Công cụ hỗ trợ

- Git / GitHub

## 3. Cấu trúc project

```text
Du-An-My-Pham/
├── backend/
├── frontend/
└── database/
```

## 4. Yêu cầu môi trường

Máy cần cài đặt:

- JDK 17 trở lên
- Node.js
- MySQL
- MySQL Workbench hoặc công cụ chạy SQL tương đương

## 5. Khởi tạo cơ sở dữ liệu

Mở MySQL Workbench và chạy lần lượt các file SQL trong thư mục:

```text
database/
```

Thứ tự chạy:

```text
1. create_tables.sql
2. insert_data.sql
```

Database mặc định:

```text
web_store
```

Lưu ý:

- File `insert_data.sql` dùng để nạp dữ liệu mẫu.
- Nếu chạy lại `insert_data.sql`, dữ liệu hiện tại trong database có thể bị reset về dữ liệu mẫu.

## 6. Cấu hình backend

Mở file:

```text
backend/src/main/resources/application.properties
```

Kiểm tra thông tin kết nối MySQL:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/web_store?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

Sửa `spring.datasource.password` thành mật khẩu MySQL trên máy đang chạy.

### Lưu ý về cấu hình bảo mật

Một số thông tin nhạy cảm như VNPay Sandbox key và Cloudinary API secret có thể được thay bằng giá trị `YOUR_...` trong file `application.properties`.

- Các ảnh sản phẩm mẫu vẫn hiển thị bình thường vì database đã lưu sẵn URL ảnh.
- Cloudinary chỉ cần thiết khi kiểm thử chức năng thêm/sửa sản phẩm có upload ảnh mới.
- VNPay chỉ cần thiết khi kiểm thử chức năng thanh toán trực tuyến.
- Khi cần kiểm thử đầy đủ các chức năng liên quan đến VNPay hoặc Cloudinary, nhóm sẽ cung cấp cấu hình demo riêng.

## 7. Chạy backend

Mở terminal tại thư mục gốc project:

```bash
cd backend
```

Chạy backend:

```bash
./mvnw spring-boot:run
```

Nếu dùng Windows PowerShell và lệnh trên không chạy, dùng:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend chạy tại:

```text
http://localhost:8080
```

## 8. Chạy frontend

Mở terminal mới tại thư mục gốc project:

```bash
cd frontend
```

Cài thư viện:

```bash
npm install
```

Chạy frontend:

```bash
npm run dev
```

Frontend chạy tại:

```text
http://localhost:5173
```

## 9. Tài khoản demo

Các tài khoản dưới đây chỉ dùng để kiểm thử chức năng trong môi trường demo.

### Admin

```text
Email: admin@aurabeauty.vn
Password: 123456
```

### Customer

```text
Email: khach1@gmail.com
Password: 123456
```

## 10. Ghi chú

- Backend chạy port `8080`.
- Frontend chạy port `5173`.
- React frontend gọi API từ Spring Boot backend thông qua RESTful API.
- Nếu backend không kết nối được database, kiểm tra lại tên database, username và password MySQL trong `application.properties`.
- Nếu frontend chưa chạy được, chạy `npm install` trong thư mục `frontend` trước khi chạy `npm run dev`.
- Thông tin VNPay trong project là thông tin sandbox dùng cho mục đích kiểm thử chức năng thanh toán.
