# AURA Cosmetics - E-commerce Website

## 1. Giới thiệu

AURA Cosmetics là website thương mại điện tử bán mỹ phẩm, hỗ trợ khách hàng xem sản phẩm, tìm kiếm/lọc sản phẩm, quản lý giỏ hàng, đặt hàng, tích hợp mô phỏng thanh toán qua VNPay Sandbox và đánh giá sản phẩm.

Hệ thống cũng cung cấp trang quản trị cho admin để quản lý sản phẩm, danh mục, khách hàng, đơn hàng, đánh giá sản phẩm và thống kê doanh thu.

Ngoài cách chạy thủ công trên môi trường local, project đã được bổ sung Docker Compose để chuẩn hóa môi trường chạy và đã được triển khai demo online với frontend trên Vercel, backend trên Render và cơ sở dữ liệu MySQL trên Aiven Cloud.

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
- Postman / Swagger

### Triển khai và đóng gói

- Docker
- Docker Compose
- Render
- Vercel
- Aiven Cloud MySQL

## 3. Cấu trúc project

```text

Du-An-My-Pham/

├── backend/

├── frontend/

├── database/

└── docker-compose.yml

```

## 4. Yêu cầu môi trường

Nếu chạy thủ công trên local, máy cần cài đặt:

- JDK 17 trở lên
- Node.js
- MySQL
- MySQL Workbench hoặc công cụ chạy SQL tương đương

Nếu chạy bằng Docker, máy cần cài đặt:

- Docker Desktop
- Docker Compose

## 5. Khởi tạo cơ sở dữ liệu khi chạy thủ công

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
- Nếu chạy bằng Docker Compose, database có thể được khởi tạo tự động theo cấu hình trong `docker-compose.yml`.

## 6. Cấu hình backend khi chạy thủ công

Vì file `application.properties` chứa một số thông tin cấu hình cục bộ và thông tin nhạy cảm nên file này không được đẩy trực tiếp lên GitHub. Thay vào đó, project có cung cấp file cấu hình mẫu:

```text

backend/src/main/resources/application.properties.example

```

Trước khi chạy backend, cần tạo file cấu hình thật bằng cách copy hoặc đổi tên file mẫu:

```text

backend/src/main/resources/application.properties.example

→ backend/src/main/resources/application.properties

```

Sau đó mở file:

```text

backend/src/main/resources/application.properties

```

và chỉnh lại thông tin kết nối MySQL theo máy đang chạy:

```properties

spring.datasource.url=jdbc:mysql://localhost:3306/web_store?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true

spring.datasource.username=root

spring.datasource.password=YOUR_PASSWORD

```

Sửa `spring.datasource.password` thành mật khẩu MySQL trên máy đang chạy.

### Lưu ý về cấu hình bảo mật

Một số thông tin nhạy cảm như VNPay Sandbox key, Cloudinary API secret hoặc JWT secret có thể được thay bằng giá trị `YOUR_...` trong file `application.properties`.

- Các ảnh sản phẩm mẫu vẫn hiển thị bình thường vì database đã lưu sẵn URL ảnh.
- Cloudinary chỉ cần thiết khi kiểm thử chức năng thêm/sửa sản phẩm có upload ảnh mới.
- VNPay chỉ cần thiết khi kiểm thử chức năng thanh toán trực tuyến.
- Khi cần kiểm thử đầy đủ các chức năng liên quan đến VNPay hoặc Cloudinary, nhóm sẽ cung cấp cấu hình demo riêng.

## 7. Chạy backend thủ công

Mở terminal tại thư mục gốc project:

```bash

cdbackend

```

Chạy backend:

```bash

./mvnwspring-boot:run

```

Nếu dùng Windows PowerShell và lệnh trên không chạy, dùng:

```powershell

.\mvnw.cmd spring-boot:run

```

Backend chạy tại:

```text

http://localhost:8080

```

## 8. Chạy frontend thủ công

Mở terminal mới tại thư mục gốc project:

```bash

cdfrontend

```

Cài thư viện:

```bash

npminstall

```

Chạy frontend:

```bash

npmrundev

```

Frontend chạy tại:

```text

http://localhost:5173

```

## 9. Chạy hệ thống bằng Docker Compose

Project hỗ trợ chạy toàn bộ hệ thống bằng Docker Compose, bao gồm frontend, backend và cơ sở dữ liệu MySQL. Cách chạy này giúp chuẩn hóa môi trường, giảm phụ thuộc vào cấu hình máy cá nhân và đơn giản hóa quá trình cài đặt.

Tại thư mục gốc project, chạy lệnh:

```bash

dockercomposeup-d--build

```

Lệnh trên sẽ tự động build frontend, backend và khởi động MySQL theo cấu hình trong `docker-compose.yml`.

Kiểm tra trạng thái các container:

```bash

dockercomposeps

```

Sau khi các container chạy thành công, hệ thống có thể truy cập tại:

```text

Frontend: http://localhost:5173

Backend API: http://localhost:8080

MySQL: localhost:3307

```

Dừng hệ thống Docker:

```bash

dockercomposedown

```

Nếu muốn build lại sau khi thay đổi source code hoặc Dockerfile:

```bash

dockercomposeup-d--build

```

Lưu ý:

- Khi chạy bằng Docker, không cần cài và cấu hình riêng MySQL local nếu database đã được cấu hình trong `docker-compose.yml`.
- Docker Compose giúp các container frontend, backend và database giao tiếp với nhau thông qua mạng nội bộ.
- Cơ sở dữ liệu có thể được khởi tạo tự động từ các file SQL trong thư mục `database`.
- Backend chỉ nên khởi động sau khi MySQL đã sẵn sàng tiếp nhận kết nối để tránh lỗi kết nối database khi chạy hệ thống.

## 10. Demo online

Hệ thống đã được triển khai lên môi trường hosting online để phục vụ kiểm thử và demo trực tiếp qua Internet.

```text

Frontend: https://aura-cosmetics-tau.vercel.app

Backend API: https://aura-backend-3ep7.onrender.com/api/v1

```

Trong môi trường online:

- Frontend ReactJS/Vite được triển khai trên Vercel.
- Backend Spring Boot được đóng gói bằng Docker và triển khai trên Render.
- Cơ sở dữ liệu MySQL được triển khai trên Aiven Cloud.
- Frontend gọi API backend thông qua biến môi trường `VITE_API_BASE_URL`.
- VNPay Sandbox được cấu hình return URL để chuyển hướng người dùng về website sau khi thanh toán.

Lưu ý:

- Backend sử dụng dịch vụ hosting miễn phí nên lần truy cập đầu tiên có thể mất thời gian khởi động.
- Chức năng thanh toán sử dụng VNPay Sandbox, chỉ phục vụ mục đích mô phỏng và kiểm thử.
- Các thông tin nhạy cảm trên môi trường online như database URL, JWT secret, VNPay secret và Cloudinary secret được cấu hình bằng biến môi trường trên Render/Vercel, không ghi trực tiếp trong source code.

## 11. Tài khoản demo

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

## 12. Ghi chú

- Backend chạy port `8080`.
- Frontend chạy port `5173`.
- React frontend gọi API từ Spring Boot backend thông qua RESTful API.
- Project hỗ trợ hai cách chạy: chạy thủ công trên máy local hoặc chạy bằng Docker Compose.
- Bản demo online được triển khai với frontend trên Vercel, backend trên Render và database trên Aiven Cloud.
- Nếu backend không kết nối được database khi chạy thủ công, kiểm tra lại tên database, username và password MySQL trong `application.properties`.
- Nếu frontend chưa chạy được, chạy `npm install` trong thư mục `frontend` trước khi chạy `npm run dev`.
- Thông tin VNPay trong project là thông tin sandbox dùng cho mục đích kiểm thử chức năng thanh toán.
- Các thông tin nhạy cảm như JWT secret, VNPay secret, Cloudinary secret và thông tin database không được đẩy trực tiếp lên GitHub mà được cấu hình thông qua file local hoặc biến môi trường trên nền tảng hosting.
