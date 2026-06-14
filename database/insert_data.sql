USE web_store;
SET NAMES utf8mb4;
-- =========================================================
-- FINAL SAMPLE DATA - AURA COSMETICS
-- File này dùng sau create_tables.sql.
--
-- Tài khoản mẫu dùng cho demo/kiểm thử:
--   Admin: admin@aurabeauty.vn / 123456
--   Customer: khach1@gmail.com / 123456
-- =========================================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE reviews;
TRUNCATE TABLE payments;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE cart;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
TRUNCATE TABLE roles;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Roles
INSERT INTO roles (role_id, role_name) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_CUSTOMER');

-- 2. Users
INSERT INTO users (user_id, name, email, password, address, phone, role_id, is_active, created_at, updated_at) VALUES
(1, 'Admin Aura', 'admin@aurabeauty.vn', '$2a$10$M51wR6tRHQXa83AUJ7EB3e.QF2nUZW0G.fXJzdBaM2MECUHCegIZe', '97 Man Thiện, Quận 9, HCM', '0901112222', 1, TRUE, '2026-05-20 15:13:52', '2026-05-20 15:13:52'),
(2, 'Quỳnh Manager', 'quynh@aurabeauty.vn', '$2a$10$M51wR6tRHQXa83AUJ7EB3e.QF2nUZW0G.fXJzdBaM2MECUHCegIZe', 'Thủ Đức, HCM', '0903334444', 1, TRUE, '2026-05-20 15:13:52', '2026-05-20 15:13:52'),
(3, 'Nguyễn Văn Khách', 'khach1@gmail.com', '$2a$10$M51wR6tRHQXa83AUJ7EB3e.QF2nUZW0G.fXJzdBaM2MECUHCegIZe', 'Quận 1, HCM', '0981112222', 2, TRUE, '2026-05-20 15:13:52', '2026-05-20 15:13:52'),
(4, 'Lê Thị Thanh', 'thanh.test@gmail.com', '$2a$10$M51wR6tRHQXa83AUJ7EB3e.QF2nUZW0G.fXJzdBaM2MECUHCegIZe', 'Quận 7, HCM', '0983334444', 2, TRUE, '2026-05-20 15:13:52', '2026-05-20 15:13:52'),
(5, 'Trần Thu Thủy', 'thuy.test@gmail.com', '$2a$10$M51wR6tRHQXa83AUJ7EB3e.QF2nUZW0G.fXJzdBaM2MECUHCegIZe', 'Bình Thạnh, HCM', '0975556666', 2, TRUE, '2026-05-20 15:13:52', '2026-05-20 15:13:52'),
(6, 'Phạm Minh Tuấn', 'tuan.pham@gmail.com', '$2a$10$M51wR6tRHQXa83AUJ7EB3e.QF2nUZW0G.fXJzdBaM2MECUHCegIZe', 'Hải Châu, Đà Nẵng', '0911222333', 2, TRUE, '2026-05-20 15:13:52', '2026-05-20 15:13:52'),
(7, 'Hoàng Bảo Ngọc', 'ngoc.hoang@gmail.com', '$2a$10$M51wR6tRHQXa83AUJ7EB3e.QF2nUZW0G.fXJzdBaM2MECUHCegIZe', 'Ba Đình, Hà Nội', '0944555666', 2, TRUE, '2026-05-20 15:13:52', '2026-05-20 15:13:52'),
(8, 'Đặng Quốc Bảo', 'bao.dang@gmail.com', '$2a$10$M51wR6tRHQXa83AUJ7EB3e.QF2nUZW0G.fXJzdBaM2MECUHCegIZe', 'Ninh Kiều, Cần Thơ', '0966777888', 2, TRUE, '2026-05-20 15:13:52', '2026-05-20 15:13:52'),
(9, 'Huynh Thi Nhu Quynh', 'buggbata039@gmail.com', '$2a$10$M51wR6tRHQXa83AUJ7EB3e.QF2nUZW0G.fXJzdBaM2MECUHCegIZe', '97, Man Thiện, Hiệp Phú, Thủ Đức', '0345117235', 2, TRUE, '2026-05-20 16:56:59', '2026-05-20 17:10:59'),
(11, 'Nguyễn Văn Nam', 'admin123@gmail.com', '$2a$10$M51wR6tRHQXa83AUJ7EB3e.QF2nUZW0G.fXJzdBaM2MECUHCegIZe', '', '0345117235', 1, TRUE, '2026-05-24 16:07:17', '2026-05-24 16:07:27'),
(12, 'Min Yoongi', 'yoongi1993@gmail.com', '$2a$10$M51wR6tRHQXa83AUJ7EB3e.QF2nUZW0G.fXJzdBaM2MECUHCegIZe', '', '0345117235', 2, TRUE, '2026-05-24 17:21:11', '2026-05-24 17:21:11'),
(13, 'Nguyen Van B', 'customer123@gmail.com', '$2a$10$M51wR6tRHQXa83AUJ7EB3e.QF2nUZW0G.fXJzdBaM2MECUHCegIZe', '', '0123456789', 2, TRUE, '2026-05-24 19:12:25', '2026-05-24 19:12:25'),
(14, 'Nguyễn Hải Đăng', 'admin12345@gmail.com', '$2a$10$M51wR6tRHQXa83AUJ7EB3e.QF2nUZW0G.fXJzdBaM2MECUHCegIZe', '', '0112234567', 1, TRUE, '2026-05-24 19:15:15', '2026-05-24 19:15:40'),
(15, 'Nguyễn Kiệt', 'customer12345@gmail.com', '$2a$10$M51wR6tRHQXa83AUJ7EB3e.QF2nUZW0G.fXJzdBaM2MECUHCegIZe', '', '0345117235', 2, TRUE, '2026-05-24 19:37:50', '2026-05-24 19:37:50');

-- 3. Categories
INSERT INTO categories (category_id, name, description, created_at, updated_at) VALUES
(1, 'Làm Sạch', 'Sữa rửa mặt, tẩy trang', '2026-05-20 14:49:21', '2026-05-20 14:49:21'),
(2, 'Dưỡng Da', 'Serum, kem dưỡng phục hồi', '2026-05-20 14:49:21', '2026-05-20 14:49:21'),
(3, 'Trang Điểm', 'Son, Cushion, Phấn', '2026-05-20 14:49:21', '2026-05-20 14:49:21'),
(4, 'Chống Nắng', 'Bảo vệ da toàn diện', '2026-05-20 14:49:21', '2026-05-20 14:49:21'),
(5, 'Mặt Nạ', 'Mặt nạ giấy, mặt nạ ngủ', '2026-05-20 14:49:21', '2026-05-20 14:49:21'),
(6, 'Phụ Kiện', 'Bông tẩy trang, máy rửa mặt', '2026-05-20 14:49:21', '2026-05-20 14:49:21'),
(7, 'Son dưỡng', 'Dưỡng môi', '2026-05-20 15:18:04', '2026-05-20 15:18:04'),
(8, 'Trang điểm mắt', 'Sản phẩm hỗ trợ trang điểm mắt', '2026-05-20 16:36:06', '2026-05-20 16:36:06'),
(9, 'Dụng cụ trang điểm', 'Cọ trang điểm, mút trang điểm,...', '2026-05-24 16:53:01', '2026-05-24 16:53:01');

-- 4. Products
INSERT INTO products (product_id, name, price, stock, description, image, status, category_id, created_at, updated_at) VALUES
(1, 'Sữa Rửa Mặt Aura B5', 185000.00, 99, 'Làm sạch dịu nhẹ', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779288987/aura/products/ewbfzjsuijsy22nrov3g.jpg', 'ACTIVE', 1, '2026-05-20 14:49:21', '2026-05-24 16:14:39'),
(2, 'Nước Tẩy Trang Aura', 210000.00, 49, 'Sạch sâu bã nhờn', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779289005/aura/products/inoz2cbrl9qeswluyt4x.jpg', 'ACTIVE', 1, '2026-05-20 14:49:21', '2026-05-24 16:16:00'),
(3, 'Tẩy Tế Bào Chết Cafe Sữa Dừa', 550000.00, 39, 'Mịn da tự nhiên', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779289015/aura/products/zhelarc3b4furdvl3z6i.jpg', 'ACTIVE', 1, '2026-05-20 14:49:21', '2026-05-24 16:21:31'),
(4, 'Serum HA Lấp Lánh', 350000.00, 80, 'Cấp ẩm đa tầng', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779289038/aura/products/mjdgnoguj8sdx3pahlp8.jpg', 'ACTIVE', 2, '2026-05-20 14:49:21', '2026-05-20 14:57:21'),
(5, 'Kem Phục Hồi Aura', 420000.00, 30, 'Tái tạo da ban đêm', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779289054/aura/products/jf1vcbtyi00f9mujzv3d.jpg', 'ACTIVE', 2, '2026-05-20 14:49:21', '2026-05-20 14:57:37'),
(6, 'Serum Vitamin C 15%', 550000.00, 0, 'Sáng da mờ thâm', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779289066/aura/products/aai7lw7zkrn7lhgtudgw.jpg', 'INACTIVE', 2, '2026-05-20 14:49:21', '2026-05-20 14:57:48'),
(7, 'Kem Dưỡng Rau Má', 290000.00, 65, 'Dịu da mụn', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779289080/aura/products/g4xpmofaxyqzruvqeztx.jpg', 'ACTIVE', 2, '2026-05-20 14:49:21', '2026-05-20 14:58:05'),
(8, 'Son Kem Aura #01', 250000.00, 150, 'Đỏ san hô', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779289100/aura/products/ffqgcavgsulzranwyp1i.jpg', 'ACTIVE', 3, '2026-05-20 14:49:21', '2026-05-20 14:58:22'),
(9, 'Son Kem Aura #02', 250000.00, 120, 'Hồng trà', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779289110/aura/products/wbd6yarlq1fljybcliec.jpg', 'ACTIVE', 3, '2026-05-20 14:49:21', '2026-05-20 14:58:33'),
(10, 'Cushion Aura Matte', 420000.00, 45, 'Che phủ hoàn hảo', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779289121/aura/products/olrjdxfv9liqqyzinp4w.jpg', 'ACTIVE', 3, '2026-05-20 14:49:21', '2026-05-20 14:58:44'),
(11, 'Phấn Phủ Aura Silk', 280000.00, 139, 'Kiềm dầu mịn da', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779289138/aura/products/rnkmvrwloyy85uuz1j2h.jpg', 'ACTIVE', 3, '2026-05-20 14:49:21', '2026-05-20 15:15:23'),
(12, 'KCN Aura Invisible', 390000.00, 110, 'Chống nắng SPF50+', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779289151/aura/products/zymbte4h3m9qd30a5yno.jpg', 'ACTIVE', 4, '2026-05-20 14:49:21', '2026-05-20 14:59:14'),
(13, 'KCN Nâng Tông Pink', 390000.00, 20, 'Trắng hồng tự nhiên', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779289170/aura/products/rudxxoft9hjvnulugxjw.jpg', 'ACTIVE', 4, '2026-05-20 14:49:21', '2026-05-20 14:59:32'),
(14, 'Mặt Nạ Ngủ Water', 450000.00, 35, 'Cấp nước tức thì', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779289180/aura/products/j4bdurils8fhh9h0hfvq.jpg', 'ACTIVE', 5, '2026-05-20 14:49:21', '2026-05-20 14:59:43'),
(15, 'Mặt Nạ Giấy Tràm Trà', 25000.00, 500, 'Giảm sưng mụn', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779289190/aura/products/r8ymb6lemibml56a1kwi.jpg', 'ACTIVE', 5, '2026-05-20 14:49:21', '2026-05-20 14:59:52'),
(16, 'Bông Tẩy Trang 222m', 45000.00, 200, 'Bông mềm không xơ', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779289202/aura/products/jgoectmfwuakomsc2orp.jpg', 'ACTIVE', 6, '2026-05-20 14:49:21', '2026-05-20 15:00:05'),
(17, 'Son tint đỏ phúc bồn tử', 230000.00, 399, 'Son môi bóng hồng tự tin khoe tính nữ', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779289280/aura/products/y4mmowqcn2ymmio7n36s.jpg', 'ACTIVE', 3, '2026-05-20 15:01:52', '2026-05-20 15:56:23'),
(18, 'Nước Tẩy Trang Aura ver02', 185000.00, 200, 'Làm sạch dịu nhẹ', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779290156/aura/products/gn4nvbjk0xjpwhbbngd4.jpg', 'ACTIVE', 1, '2026-05-20 15:15:59', '2026-05-20 15:15:59'),
(20, 'Son dưỡng môi mật ong Aura', 185000.00, 50, 'Dưỡng ẩm môi, tẩy tế bào chết môi', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779290318/aura/products/lo2bic7vjxjlnxnaprdl.jpg', 'ACTIVE', 7, '2026-05-20 15:18:55', '2026-05-20 15:18:55'),
(21, 'Dưỡng môi tinh chất thanh long cấp ẩm', 45000.00, 120, 'Dưỡng mềm mịn, sáng hồng mờ thâm', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779290691/aura/products/ljcuekzzeuwsvn2p0s56.jpg', 'ACTIVE', 7, '2026-05-20 15:24:55', '2026-05-20 15:24:55'),
(22, 'Son dưỡng sáp ong hoa bưởi', 280000.00, 50, 'Nguyên liệu thiên nhiên lành tính, hỗ trợ dưỡng ẩm môi mềm mịn đỏ hồng', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779290844/aura/products/pewlb5uyj9vv9qniofx4.jpg', 'ACTIVE', 7, '2026-05-20 15:27:27', '2026-05-20 15:27:27'),
(23, 'Kem nền SkinSilk màu #01 trắng sáng', 550000.00, 200, 'Kem nền SkinSilk tạo hiệu ứng mịn màng, nhẹ tênh như lụa trên da. Màu #01 trắng sáng phù hợp tone da trắng sáng. Phù hợp cho da nhạy cảm', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779290983/aura/products/dngrcv16ffvvody6xgbi.jpg', 'ACTIVE', 3, '2026-05-20 15:30:48', '2026-05-20 15:55:04'),
(24, 'Kem nền SkinSilk. Màu #02 trung bình sáng', 550000.00, 133, 'Kem nền SkinSilk tạo hiệu ứng mịn màng, nhẹ tênh như lụa trên da. Màu #02 trung bình sáng, phù hợp cho da nhạy cảm', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779291175/aura/products/x0qpr9bjuio3evbzawfs.jpg', 'ACTIVE', 3, '2026-05-20 15:31:59', '2026-05-20 15:55:37'),
(25, 'Móc khóa phụ kiện xinh xắn', 129000.00, 90, 'Móc khóa ngẫu nhiên dùng làm phụ kiện trang trí đính kèm', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779293284/aura/products/llilpbpdkli1ol089zyj.jpg', 'ACTIVE', 6, '2026-05-20 16:08:07', '2026-05-20 16:08:07'),
(26, 'Túi mini đựng son trong suốt', 299000.00, 200, 'Túi đựng đồ makeup tiện lợi, gọn nhẹ, trong suốt xinh xắn', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779293580/aura/products/re7s2l7u79naoptjitbr.jpg', 'ACTIVE', 6, '2026-05-20 16:13:50', '2026-05-20 16:13:50'),
(27, 'Bảng mắt Aura 12 ô màu, chất nhũ.', 280000.00, 99, 'Bảng phấn mắt 9 ô Aura chất nhũ mịn, lấp lánh, lên màu tự nhiên', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779294979/aura/products/upfkhhshk3gcxtro4nye.jpg', 'ACTIVE', 8, '2026-05-20 16:38:45', '2026-05-20 16:38:45'),
(28, 'Bút kẻ mắt Aura chống thấm nước lâu trôi nhanh khô dễ sử dụng 0.55ml', 99000.00, 200, 'Chống nước và lâu trôi: Bút kẻ mắt Aura đảm bảo đường kẻ sắc nét và bền màu suốt cả ngày, không lo bị lem dù trong điều kiện ẩm ướt.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779295132/aura/products/wpjeabedzfy5dy0klv8q.jpg', 'ACTIVE', 8, '2026-05-20 16:39:57', '2026-05-20 16:39:57'),
(29, 'Mascara Chải Lông Mày Tự Nhiên. Màu 01 - Nâu sáng - Gel Kẻ Mày Siêu Lì Chống Nước, Lâu Trôi 24H', 199000.00, 120, 'Màu 01 - Nâu Sáng : Phù hợp với các nàng nhuộm tóc màu sáng (nâu vàng, nâu trà sữa, tóc tẩy). Giúp khuôn mặt trông trẻ trung, tây và sáng da cực kỳ.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779295208/aura/products/dywhidhjiy7xg54nvxlx.jpg', 'ACTIVE', 8, '2026-05-20 16:41:18', '2026-05-20 16:41:18'),
(30, 'Bảng Phấn Mắt Aura Chín Màu Tông Cam Lì Và Nhũ Ngọc Trai Sáng Bóng', 299000.00, 50, 'Phấn phủ mịn, màu sắc phong phú, trang điểm rạng rỡ  Cảm ứng mượt như thiên nga và tinh tế, pha trộn các màu cổ điển phổ biến', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779295296/aura/products/ui1q9lvllhkukfwqagtd.jpg', 'ACTIVE', 8, '2026-05-20 16:43:08', '2026-05-20 16:43:08'),
(31, 'Phấn Má Hồng 04 Ô Dual Color Blush Mịn lì Chuẩn Màu Dễ Tán', 399000.00, 100, 'Trang điểm hợp xu hướng màu sắc, kết hợp hoàn hảo giữa phong cách cá nhân và nhu cầu trang điểm cơ bản hàng ngày.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779295396/aura/products/bfufehbbsquiie9mzhsm.jpg', 'ACTIVE', 3, '2026-05-20 16:45:15', '2026-05-20 16:45:15'),
(32, 'Má Hồng Kem Hoá Phấn Aura thuần chay mịn lì và nhũ dễ tán bền màu', 280000.00, 50, 'Má Hồng Kem Hoá Phấn Aura thuần chay mịn lì và nhũ dễ tán bền màu. Phù hợp mọi loại da', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779295530/aura/products/jtzindwrxsqliahi5q0g.jpg', 'ACTIVE', 3, '2026-05-20 16:46:27', '2026-05-20 16:46:27'),
(33, 'Bông tẩy trang Tơ Tằm Mịn Màng 80 miếng', 70000.00, 120, 'Bông tẩy trang Tơ Tằm Mịn Màng. Gợi cảm giác lướt nhẹ trên da êm ái như lụa, không gây đau rát hay tổn thương da khi lau mạnh.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779299588/aura/products/hjhi6pjo0n0elvsld9tq.jpg', 'ACTIVE', 1, '2026-05-20 17:53:27', '2026-05-20 17:53:27'),
(34, 'Bông tẩy trang Bông Xơ Tự Nhiên 150 miếng', 63000.00, 100, 'Bông tẩy trang Bông Xơ Tự Nhiên 100% bông tự nhiên thuần khiết, chưa qua tẩy trắng độc hại.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779299644/aura/products/gqw6nk8pxkvaxqlvooel.jpg', 'ACTIVE', 1, '2026-05-20 17:54:32', '2026-05-20 17:54:32'),
(35, 'Kem Dương Ẩm Aura Tinh Chất Rau Má B5+', 280000.00, 200, 'Cấp ẩm cho làn da mềm mịn căng bóng, hỗ trợ phục hồi da sau mụn. Làn da khỏe thấy rõ sau 2 tháng sử dụng.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779640072/aura/products/tcj1iblip5zak9aifl0x.jpg', 'ACTIVE', 2, '2026-05-24 16:29:15', '2026-05-24 16:29:15'),
(36, 'Serum Dưỡng Ẩm Làm Trắng Sáng Da Hỗ Trợ Giảm Mụn Trứng Cá Chống Nếp Nhăn Se Khít Lỗ Chân Lông', 550000.00, 50, 'Serum Dưỡng Da SENANA 15ml là lựa chọn tuyệt vời để giúp làn da bạn trở nên rạng rỡ, đều màu và sáng khỏe. Không chỉ dưỡng trắng, sản phẩm còn hỗ trợ làm mờ nám, tàn nhang, giảm mụn trứng cá và se khít lỗ chân lông. Ngoài ra, serum còn giúp chống nếp nhăn và phục hồi làn da, mang lại sự tươi trẻ và căng mịn.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779640169/aura/products/s34fcurnffpspunuljf8.jpg', 'ACTIVE', 2, '2026-05-24 16:30:41', '2026-05-24 16:30:41'),
(37, 'Son Dưỡng Môi Tùy Chọn Hương Liệu Thiên Nhiên', 185000.00, 133, 'Son Dưỡng Môi Tùy Chọn Hương Liệu Thiên Nhiên Cho Bờ Môi Căng Mọng Ngừa Thâm', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779640259/aura/products/tmytigcffpeznvezbzxj.jpg', 'ACTIVE', 7, '2026-05-24 16:32:05', '2026-05-24 16:32:05'),
(38, 'Tẩy Tế Bào Chết Da Mặt Đường Đen Tạo Bột Làm Sạch Nhẹ Nhàng', 139000.00, 260, 'Tẩy Tế Bào Chết Da Mặt Đường Đen Tạo Bột Làm Sạch Nhẹ Nhàng. Hỗ trợ mờ thâm cho vết mụn thâm mới, làm sạch lỗ chân lông.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779640633/aura/products/gbybt4gnpeojqqoa7hin.jpg', 'ACTIVE', 1, '2026-05-24 16:38:36', '2026-05-24 16:38:36'),
(39, 'Kem Cấp Ẩm, Làm Trắng da Mặt Aura 140g', 450000.00, 133, 'Kem dưỡng ẩm Aura với thiết kế vỏ hình chú cừu đáng yêu, giúp làm trắng mịn, kiểm soát dầu và tăng độ đàn hồi cho da. Với thành phần gồm lanolin nguyên chất và glycerin, kem này không chỉ dưỡng ẩm mà còn nuôi dưỡng làn da khô, mịn, không nhờn.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779640771/aura/products/xssknbisfxyqnpmfglud.jpg', 'ACTIVE', 2, '2026-05-24 16:40:05', '2026-05-24 16:40:05'),
(40, 'Kem dưỡng giúp phục hồi dưỡng trắng B5 Aura 52ml', 280000.00, 100, 'Cấp ẩm sâu: Kem dưỡng da mặt Aura B5 giúp da luôn đủ ẩm, mịn màng và căng bóng. Phục hồi da hiệu quả: Với thành phần Vitamin B5, sản phẩm này hỗ trợ tái tạo và phục hồi da bị tổn thương.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779640889/aura/products/chaunzal6pmn41z4sadm.jpg', 'ACTIVE', 2, '2026-05-24 16:42:08', '2026-05-24 16:42:08'),
(41, 'Tonner Pad thuần chay dạng miếng Dewycel Salady Pad 70 miếng', 320000.00, 100, 'Dewycel Salady Pad là sản phẩm tẩy da chết đột phá, kết hợp giữa công thức tự nhiên với PHA và AHA, giúp cung cấp độ ẩm tối ưu cho làn da bạn trong khi nhẹ nhàng loại bỏ bụi bẩn và tế bào chết tích tụ. Đây chính là giải pháp hoàn hảo cho làn da tươi trẻ và rạng rỡ!', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779640980/aura/products/dm42mv60r9yothhakydb.jpg', 'ACTIVE', 2, '2026-05-24 16:43:37', '2026-05-24 16:43:37'),
(42, 'Son Bóng Romand The Juicy Lasting Tint Mẫu Mới', 200000.00, 133, 'Son Bóng Romand The Juicy Lasting Tint Mẫu Mới. Chất son bóng mượt, không gây nặng môi, phù hợp cho mọi tone da, mang đến cho bạn đôi môi căng mọng và bền màu suốt cả ngày.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779641088/aura/products/zsupgp0guvdh7g92xcmc.jpg', 'ACTIVE', 3, '2026-05-24 16:47:36', '2026-05-24 16:47:36'),
(43, 'Thỏi son lì O.TWO.O nhung mịn lâu trôi không thấm nước chống khô màu đỏ cherry', 280000.00, 50, '', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779641281/aura/products/sgcx4waam318rrxmfyos.jpg', 'ACTIVE', 3, '2026-05-24 16:48:03', '2026-05-24 16:48:03'),
(44, 'Kem Nền Aura Dạng Lỏng 30ml Che Khuyết Điểm Tự Nhiên Cho Làn Da Hoàn Hảo', 360000.00, 120, 'Kem nền Aura dạng lỏng nổi bật với khả năng che khuyết điểm tự nhiên, mang lại làn da mịn màng, đều màu và rạng rỡ. Sản phẩm phù hợp với nhiều loại da, giúp kiểm soát dầu hoặc dưỡng ẩm tùy theo nhu cầu, đồng thời giữ lớp nền bền màu suốt ngày dài.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779641458/aura/products/aq7y6q0iz8t2oe1t1fkd.jpg', 'ACTIVE', 3, '2026-05-24 16:51:13', '2026-05-24 16:51:13'),
(45, 'Bộ 8 Cọ Trang Điểm Chuyên Nghiệp Lông Mềm Cho Người Mới', 185000.00, 133, 'Điểm nổi bật không thể bỏ qua! Bộ 8 cọ trang điểm sở hữu lông mềm mại, không gây trầy xước da, giúp bạn tạo lớp nền tự nhiên và mịn màng chỉ trong vài thao tác. Tay cầm chống trượt chắc chắn, hỗ trợ thao tác linh hoạt và dễ dàng kiểm soát khi trang điểm.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779641656/aura/products/sak8wznnzivajunrckgi.jpg', 'ACTIVE', 9, '2026-05-24 16:55:39', '2026-05-24 16:55:39'),
(46, 'Bộ Cọ Trang Điểm Mắt 7 Món', 210000.00, 100, '', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779641747/aura/products/rjw3bbahczir9tarskbo.jpg', 'ACTIVE', 9, '2026-05-24 16:57:50', '2026-05-24 16:57:50'),
(47, 'Cọ Tán Nền Mảnh Dẹt Aura', 110000.00, 120, '', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779641876/aura/products/o4wb4qyrctcrotx6cuz2.jpg', 'ACTIVE', 9, '2026-05-24 16:58:39', '2026-05-24 16:58:39'),
(48, 'Trọn Bộ 30 Cọ Make Up Sang Trọng', 399000.00, 332, '', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779642028/aura/products/mrc50kvvw0ls0a6gbj2h.jpg', 'ACTIVE', 9, '2026-05-24 17:01:35', '2026-05-24 17:26:21'),
(49, 'Hộp 4  Mút Đánh Nền Mềm Mịn', 99000.00, 133, '', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779642102/aura/products/mnagundekss7cbvasn9m.jpg', 'ACTIVE', 9, '2026-05-24 17:02:21', '2026-05-24 17:02:21'),
(50, 'Phấn má hồng một màu Daimanpu', 280000.00, 90, 'Phấn má hồng một màu Daimanpu, lì, dạng bột sữa, bắt sáng lâu trôi, phù hợp cho các bạn gái tuổi teen', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779650489/aura/products/aiqsfvnbnhl6sxdxbnlh.jpg', 'ACTIVE', 3, '2026-05-24 19:21:38', '2026-05-24 19:21:38'),
(51, 'Son Thỏi Aura Ẩm Mướt Bơ Mịn Mờ vân môi 3,6g', 210000.00, 199, 'Dòng son thỏi lì mịn, mềm như bơ chất sơn mềm mướt đích thực.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779650587/aura/products/iyrejqqlpyr8o0eyu2lk.jpg', 'ACTIVE', 3, '2026-05-24 19:24:14', '2026-05-24 19:24:14'),
(52, 'Son Thỏi Lì Mịn Môi Etude House Fixing Tint Bar 5 Màu 3.2g', 550000.00, 100, 'Son Etude House Fixing Tint Bar dưỡng ẩm giúp môi hoàn hảo với kết thúc lì cho đôi môi căng mọng và cuốn hút, thoải mái sửa như thể đó là đôi môi tự nhiên của bạn.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779650695/aura/products/neybnkmjgzkjp4m25wns.jpg', 'ACTIVE', 3, '2026-05-24 19:25:15', '2026-05-24 19:25:15'),
(53, 'Bảng phấn má hồng 2 ô Aura 4.5gx2 phù hợp với mọi tone dạ', 210000.00, 100, 'Thiết kế 2 màu trong 1 - dễ dàng mix & match để tạo hiệu ứng má ửng hồng trong trẻo.  Hạt phấn siêu mịn giúp dễ dàng tán đều, tạo hiệu ứng blur làm mờ khuyết điểm.  Màu sắc kéo dài cả ngày.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779650783/aura/products/ged0qia4eblk4ih0gztx.jpg', 'ACTIVE', 3, '2026-05-24 19:26:52', '2026-05-24 19:26:52'),
(54, 'Mặt nạ mắt Bioaqua HỘP 60 miếng tảo biển collagen hồng', 189000.00, 133, 'Mặt nạ mắt Bioaqua HỘP 60 miếng tảo biển collagen vàng - Giảm Quầng Thâm - Nhăn Mắt', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779651040/aura/products/szqwodziotdfrzyxblkp.jpg', 'ACTIVE', 5, '2026-05-24 19:31:24', '2026-05-24 19:31:24'),
(55, 'Mặt Nạ Giấy Biodance 25ml Dưỡng Ẩm, Làm Dịu Da, Hỗ Trợ Dưỡng Sáng', 45000.00, 200, 'Mặt nạ giấy  Biodance Vitamin B5 25ml nổi bật với khả năng cấp ẩm vượt trội, giúp làn da luôn mềm mại, căng bóng và rạng rỡ. Công nghệ vải màng Tencel "vô hình" cho cảm giác nhẹ nhàng, thẩm thấu nhanh, phù hợp với mọi loại da và không gây bí da.', 'https://res.cloudinary.com/dibq4hudo/image/upload/v1779651212/aura/products/ftg2yns3qzgma0uwhmwx.jpg', 'ACTIVE', 5, '2026-05-24 19:34:06', '2026-05-24 19:34:06');

-- 5. Cart và cart_items
INSERT INTO cart (cart_id, user_id, created_at, updated_at) VALUES
(1, 3, '2026-05-21 15:03:13', '2026-05-21 15:03:13'),
(2, 4, '2026-05-21 15:03:13', '2026-05-21 15:03:13'),
(3, 5, '2026-05-21 15:03:13', '2026-05-21 15:03:13'),
(4, 6, '2026-05-21 15:03:13', '2026-05-21 15:03:13'),
(5, 7, '2026-05-21 15:03:13', '2026-05-21 15:03:13'),
(7, 9, '2026-05-22 15:22:18', '2026-05-22 15:22:18'),
(9, 11, '2026-05-24 16:07:17', '2026-05-24 16:07:17'),
(10, 12, '2026-05-24 17:21:11', '2026-05-24 17:21:11'),
(11, 13, '2026-05-24 19:12:25', '2026-05-24 19:12:25'),
(12, 14, '2026-05-24 19:15:15', '2026-05-24 19:15:15'),
(13, 15, '2026-05-24 19:37:50', '2026-05-24 19:37:50');
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES
(1, 1, 1, 2),
(2, 1, 8, 1),
(3, 2, 4, 1),
(4, 2, 16, 2),
(5, 3, 10, 1),
(6, 4, 15, 10);

-- 6. Orders
INSERT INTO orders (order_id, user_id, total_price, recipient_name, recipient_phone, shipping_address, status, created_at, updated_at) VALUES
(1, 3, 620000.00, 'Nguyễn Văn Khách', '0981112222', 'Quận 1, HCM', 'COMPLETED', '2026-03-01 02:00:00', '2026-05-21 15:03:13'),
(2, 4, 440000.00, 'Lê Thị Thanh', '0983334444', 'Quận 7, HCM', 'COMPLETED', '2026-03-05 07:00:00', '2026-05-21 15:03:13'),
(3, 6, 390000.00, 'Phạm Minh Tuấn', '0911222333', 'Đà Nẵng', 'SHIPPING', '2026-03-10 01:30:00', '2026-05-21 15:03:13'),
(4, 7, 250000.00, 'Hoàng Bảo Ngọc', '0944555666', 'Hà Nội', 'CANCELLED', '2026-03-11 04:00:00', '2026-05-21 15:03:13'),
(5, 5, 185000.00, 'Trần Thu Thủy', '0975556666', 'Bình Thạnh, HCM', 'PENDING', '2026-05-21 15:03:13', '2026-05-21 15:03:13'),
(7, 9, 185000.00, 'Nguyễn Văn Khách', '0981112222', 'Quận 1, TP.HCM', 'PENDING', '2026-05-24 16:14:39', '2026-05-24 16:14:39'),
(8, 9, 210000.00, 'Huỳnh Thị Như Quỳnh', '0981112222', 'Quận 1, TP.HCM', 'PENDING', '2026-05-24 16:16:00', '2026-05-24 16:16:00'),
(9, 9, 120000.00, 'huynh thi nhu quynh', '0345117295', '97 Man Thiện Tăng Nhơn Phú Thủ Đức', 'DELIVERED', '2026-05-24 16:18:03', '2026-05-24 16:18:24'),
(10, 12, 399000.00, 'Min Yoongi', '0345117295', '123 Lê Văn Việt Tăng Nhơn Phú Thủ Đức', 'PENDING', '2026-05-24 17:26:21', '2026-05-24 17:26:21');

-- 7. Order items
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, quantity, price) VALUES
(1, 1, 1, 'Sữa Rửa Mặt Aura B5', 2, 185000.00),
(2, 1, 8, 'Son Kem Aura #01', 1, 250000.00),
(3, 2, 4, 'Serum HA Lấp Lánh', 1, 350000.00),
(4, 2, 16, 'Bông Tẩy Trang 222m', 2, 45000.00),
(5, 3, 12, 'KCN Aura Invisible', 1, 390000.00),
(6, 4, 9, 'Son Kem Aura #02', 1, 250000.00),
(7, 5, 1, 'Sữa Rửa Mặt Aura B5', 1, 185000.00),
(9, 7, 1, 'Sữa Rửa Mặt Aura B5', 1, 185000.00),
(10, 8, 2, 'Nước Tẩy Trang Aura', 1, 210000.00),
(11, 9, 3, 'Tẩy Tế Bào Chết Cafe', 1, 120000.00),
(12, 10, 48, 'Trọn Bộ 30 Cọ Make Up Sang Trọng', 1, 399000.00);

-- 8. Payments
INSERT INTO payments (payment_id, order_id, payment_method, transaction_no, amount, payment_date, status) VALUES
(1, 1, 'VNPAY', NULL, 620000.00, '2026-05-21 15:03:13', 'SUCCESS'),
(2, 2, 'COD', NULL, 440000.00, '2026-05-21 15:03:13', 'SUCCESS'),
(3, 3, 'VNPAY', NULL, 390000.00, '2026-05-21 15:03:13', 'SUCCESS'),
(4, 4, 'COD', NULL, 250000.00, '2026-05-21 15:03:13', 'FAILED'),
(5, 5, 'VNPAY', NULL, 185000.00, NULL, 'PENDING'),
(7, 7, 'COD', NULL, 185000.00, NULL, 'PENDING'),
(8, 8, 'COD', NULL, 210000.00, NULL, 'PENDING'),
(9, 9, 'COD', NULL, 120000.00, '2026-05-24 16:18:26', 'SUCCESS'),
(10, 10, 'COD', NULL, 399000.00, NULL, 'PENDING');

-- 9. Reviews
INSERT INTO reviews (user_id, product_id, rating, comment, is_verified_purchase, admin_flag, created_at) VALUES
(3, 1, 5, 'Sữa rửa mặt xài rất êm, da không bị khô. Đóng gói cẩn thận, giao hàng nhanh!', TRUE, 'NORMAL', '2026-03-03 10:00:00'),
(3, 8, 4, 'Màu son lên môi chuẩn đẹp, nhưng ăn uống xong thì hơi mau trôi nha shop.', TRUE, 'NORMAL', '2026-03-03 10:05:00'),
(4, 4, 1, 'Xài bị kích ứng, da nổi mẩn đỏ ngứa ngáy quá shop ơi, cần kiểm tra lại sản phẩm này.', TRUE, 'NEGATIVE_FEEDBACK', '2026-03-07 15:30:00'),
(4, 16, 5, 'Bông tẩy trang dai, mịn, xài siêu tiết kiệm nước tẩy trang, rất đáng tiền.', TRUE, 'NORMAL', '2026-03-07 15:35:00'),
(5, 1, 5, 'Mình chưa nhận được hàng nhưng thấy bạn bè khen dòng B5 này lắm nên cho 5 sao ủng hộ shop trước.', FALSE, 'NORMAL', '2026-05-24 10:00:00'),
(7, 2, 5, 'Sản phẩm này bên mình đang sale rẻ hơn nửa giá, mọi người qua zalo mua nha!', FALSE, 'ATTENTION_NEEDED', '2026-05-24 10:05:00'),
(6, 12, 3, 'Giá hơi chát so với dung tích, chưa xài thử nên chưa biết chất lượng ra sao.', FALSE, 'NORMAL', '2026-05-24 10:10:00'),
(9, 2, 4, 'sản phẩm tốt, khá ok', FALSE, 'NORMAL', '2026-05-22 15:59:44'),
(9, 1, 5, 'Sản phẩm dùng rất ổn, đóng gói đẹp.', FALSE, 'NORMAL', '2026-05-24 16:04:39'),
(9, 10, 5, 'Sản phẩm chất lượng sử dụng rất thích, sẽ ủng hộ lần sau.', FALSE, 'NORMAL', '2026-05-24 17:18:05'),
(9, 3, 2, 'Đóng gói sản phẩm không tốt', FALSE, 'NORMAL', '2026-05-24 17:18:29'),
(12, 5, 5, 'Đã mua và dùng được 2 tuần, da trắng sáng hơn thích lắm nha', FALSE, 'NORMAL', '2026-05-24 17:21:58'),
(12, 48, 5, 'giao đủ hàng, cọ mềm mịn sử dụng rất thích. cọ nhìn chất lượng lắm nha', FALSE, 'NORMAL', '2026-05-24 17:25:23');



-- =========================================================
-- 2. KHỐI STORED PROCEDURE THỨ 1: SINH DỮ LIỆU LỚN LỊCH SỬ (650 ĐƠN)
-- =========================================================
DELIMITER $$

DROP PROCEDURE IF EXISTS FastGenerateBulkData$$

CREATE PROCEDURE FastGenerateBulkData()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE j INT DEFAULT 1;
    DECLARE k INT DEFAULT 1;
    
    DECLARE v_user_id INT;
    DECLARE v_order_id INT;
    DECLARE v_product_id INT;
    DECLARE v_product_name VARCHAR(150);
    DECLARE v_product_price DECIMAL(12,2);
    DECLARE v_quantity INT;
    DECLARE v_total_price DECIMAL(12,2);
    
    DECLARE v_rand_month INT;
    DECLARE v_rand_year INT;
    DECLARE v_order_date TIMESTAMP;
    DECLARE v_order_status VARCHAR(20);
    DECLARE v_pay_status VARCHAR(20);
    DECLARE v_pay_method VARCHAR(10);
    
    DECLARE v_name VARCHAR(100);
    DECLARE v_city VARCHAR(100);
    DECLARE v_phone VARCHAR(20);

    -- Sinh thêm 60 Users ngẫu nhiên (Rải rác từ năm 2021 đến 2025)
    SET i = 1;
    WHILE i <= 60 DO
        SET v_name = ELT(MOD(i, 5) + 1, 'Nguyễn Minh Triết', 'Trần Thị Hồng', 'Lê Hoàng Long', 'Phạm Thanh Thảo', 'Hoàng Vân Anh');
        SET v_name = CONCAT(v_name, ' Khách ', i);
        SET v_city = ELT(MOD(i, 6) + 1, 'Quận 1, HCM', 'Đống Đa, Hà Nội', 'Hải Châu, Đà Nẵng', 'Ninh Kiều, Cần Thơ', 'Vũng Tàu', 'Nha Trang');
        SET v_phone = CONCAT('09', FLOOR(10000000 + RAND() * 89999999));
        
        SET v_rand_year = 2021 + FLOOR(RAND() * 5);
        SET v_rand_month = 1 + FLOOR(RAND() * 12);
        
        INSERT INTO users (name, email, password, address, phone, role_id, is_active, created_at)
        VALUES (
            v_name, 
            CONCAT('user_test_', i, '@gmail.com'), 
            '$2a$10$M51wR6tRHQXa83AUJ7EB3e.QF2nUZW0G.fXJzdBaM2MECUHCegIZe', 
            v_city, 
            v_phone, 
            2, 
            IF(RAND() > 0.04, TRUE, FALSE),
            STR_TO_DATE(CONCAT(v_rand_year, '-', v_rand_month, '-', 1 + FLOOR(RAND() * 28), ' 10:00:00'), '%Y-%m-%d %H:%i:%s')
        );
        
        INSERT INTO cart (user_id, created_at) VALUES (LAST_INSERT_ID(), NOW());
        SET i = i + 1;
    END WHILE;

    -- Sinh tự động 650 Đơn hàng lịch sử (2021 -> 2026)
    SET j = 1;
    WHILE j <= 650 DO
        SELECT user_id INTO v_user_id FROM users WHERE role_id = 2 ORDER BY RAND() LIMIT 1;
        SET v_rand_year = 2021 + FLOOR(RAND() * 6);
        
        IF RAND() > 0.45 THEN
            SET v_rand_month = ELT(FLOOR(1 + RAND() * 5), 1, 2, 10, 11, 12);
        ELSE
            SET v_rand_month = 1 + FLOOR(RAND() * 12);
        END IF;
        
        IF v_rand_year = 2026 AND v_rand_month > 5 THEN
            SET v_rand_month = 1 + FLOOR(RAND() * 4);
        END IF;

        SET v_order_date = STR_TO_DATE(CONCAT(v_rand_year, '-', v_rand_month, '-', 1 + FLOOR(RAND() * 28), ' ', FLOOR(RAND() * 24), ':', FLOOR(RAND() * 60), ':00'), '%Y-%m-%d %H:%i:%s');

        IF v_rand_year < 2026 THEN
            SET v_order_status = IF(RAND() > 0.1, 'COMPLETED', 'CANCELLED');
        ELSE
            SET v_order_status = ELT(FLOOR(1 + RAND() * 6), 'PENDING', 'PREPARING', 'SHIPPING', 'DELIVERED', 'COMPLETED', 'CANCELLED');
        END IF;

        INSERT INTO orders (user_id, total_price, recipient_name, recipient_phone, shipping_address, status, created_at, updated_at)
        SELECT v_user_id, 0, name, phone, IFNULL(address, 'Việt Nam'), v_order_status, v_order_date, v_order_date
        FROM users WHERE user_id = v_user_id;
        
        SET v_order_id = LAST_INSERT_ID();

        SET k = 1;
        SET v_total_price = 0;
        WHILE k <= (1 + FLOOR(RAND() * 3)) DO
            SELECT product_id, name, price INTO v_product_id, v_product_name, v_product_price 
            FROM products WHERE status = 'ACTIVE' ORDER BY RAND() LIMIT 1;
            SET v_quantity = 1 + FLOOR(RAND() * 2);
            
            IF NOT EXISTS (SELECT 1 FROM order_items WHERE order_id = v_order_id AND product_id = v_product_id) THEN
                INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
                VALUES (v_order_id, v_product_id, v_product_name, v_quantity, v_product_price);
                SET v_total_price = v_total_price + (v_product_price * v_quantity);
            END IF;
            SET k = k + 1;
        END WHILE;

        UPDATE orders SET total_price = v_total_price WHERE order_id = v_order_id;

        SET v_pay_method = IF(RAND() > 0.5, 'VNPAY', 'COD');
        IF v_order_status = 'COMPLETED' OR v_order_status = 'DELIVERED' THEN
            SET v_pay_status = 'SUCCESS';
        ELSEIF v_order_status = 'CANCELLED' THEN
            SET v_pay_status = IF(v_pay_method = 'VNPAY', 'FAILED', 'PENDING');
        ELSE
            SET v_pay_status = 'PENDING';
        END IF;

        INSERT INTO payments (order_id, payment_method, transaction_no, amount, payment_date, status)
        VALUES (
            v_order_id, 
            v_pay_method, 
            IF(v_pay_method = 'VNPAY' AND v_pay_status = 'SUCCESS', CONCAT('VNP_TXN_', FLOOR(100000 + RAND() * 899999)), NULL),
            v_total_price, 
            IF(v_pay_status = 'SUCCESS', DATE_ADD(v_order_date, INTERVAL FLOOR(5 + RAND() * 60) MINUTE), NULL),
            v_pay_status
        );

        IF v_order_status = 'COMPLETED' AND RAND() < 0.25 THEN
            INSERT INTO reviews (user_id, product_id, rating, comment, is_verified_purchase, admin_flag, created_at)
            SELECT 
                v_user_id, 
                oi.product_id, 
                ELT(FLOOR(1 + RAND() * 5), 5, 5, 4, 3, 2),
                ELT(FLOOR(1 + RAND() * 4), 'Hàng xài mướt lắm, mờ thâm tốt nha.', 'Sản phẩm chính hãng, check được mã vạch.', 'Đóng gói sản phẩm đẹp, ship thân thiện.', 'Mùi hơi nồng một tí nhưng hiệu quả tốt.'),
                TRUE, 
                'NORMAL',
                DATE_ADD(v_order_date, INTERVAL FLOOR(1 + RAND() * 5) DAY)
            FROM order_items oi WHERE oi.order_id = v_order_id LIMIT 1;
        END IF;

        SET j = j + 1;
    END WHILE;
END$$

DELIMITER ;


-- =========================================================
-- 3. KHỐI STORED PROCEDURE THỨ 2: TĂNG MẠNH 1,000 ĐƠN HÀNG CHO NĂM 2026
-- =========================================================
DELIMITER $$

DROP PROCEDURE IF EXISTS GenerateRecent2026Data$$

CREATE PROCEDURE GenerateRecent2026Data()
BEGIN
    DECLARE j INT DEFAULT 1;
    DECLARE k INT DEFAULT 1;
    
    DECLARE v_user_id INT;
    DECLARE v_order_id INT;
    DECLARE v_product_id INT;
    DECLARE v_product_name VARCHAR(150);
    DECLARE v_product_price DECIMAL(12,2);
    DECLARE v_quantity INT;
    DECLARE v_total_price DECIMAL(12,2);
    
    DECLARE v_rand_month INT;
    DECLARE v_rand_day INT;
    DECLARE v_order_date TIMESTAMP;
    DECLARE v_order_status VARCHAR(20);
    DECLARE v_pay_status VARCHAR(20);
    DECLARE v_pay_method VARCHAR(10);

    -- Đã nâng cấp vòng lặp chạy đủ 1000 đơn hàng tập trung cho năm 2026
    SET j = 1;
    WHILE j <= 1000 DO
        SELECT user_id INTO v_user_id FROM users WHERE role_id = 2 ORDER BY RAND() LIMIT 1;
        
        -- Phân phối mật độ: 70% rơi vào tháng gần đây (Tháng 3, 4, 5/2026), 30% cho Tháng 1, 2/2026
        IF RAND() > 0.3 THEN
            SET v_rand_month = ELT(FLOOR(1 + RAND() * 3), 3, 4, 5);
        ELSE
            SET v_rand_month = ELT(FLOOR(1 + RAND() * 2), 1, 2);
        END IF;

        -- Giới hạn biên ngày thực tế của Tháng 5 năm nay (2026-05-19)
        IF v_rand_month = 5 THEN
            SET v_rand_day = 1 + FLOOR(RAND() * 19);
        ELSE
            SET v_rand_day = 1 + FLOOR(RAND() * 28);
        END IF;

        SET v_order_date = STR_TO_DATE(CONCAT('2026-', v_rand_month, '-', v_rand_day, ' ', FLOOR(RAND() * 24), ':', FLOOR(RAND() * 60), ':00'), '%Y-%m-%d %H:%i:%s');

        IF v_rand_month < 5 THEN
            SET v_order_status = IF(RAND() > 0.15, 'COMPLETED', 'CANCELLED');
        ELSE
            SET v_order_status = ELT(FLOOR(1 + RAND() * 6), 'PENDING', 'PREPARING', 'SHIPPING', 'DELIVERED', 'COMPLETED', 'CANCELLED');
        END IF;

        INSERT INTO orders (user_id, total_price, recipient_name, recipient_phone, shipping_address, status, created_at, updated_at)
        SELECT v_user_id, 0, name, phone, IFNULL(address, 'Việt Nam'), v_order_status, v_order_date, v_order_date
        FROM users WHERE user_id = v_user_id;
        
        SET v_order_id = LAST_INSERT_ID();

        SET k = 1;
        SET v_total_price = 0;
        WHILE k <= (1 + FLOOR(RAND() * 3)) DO
            SELECT product_id, name, price INTO v_product_id, v_product_name, v_product_price 
            FROM products WHERE status = 'ACTIVE' ORDER BY RAND() LIMIT 1;
            SET v_quantity = 1 + FLOOR(RAND() * 2);
            
            IF NOT EXISTS (SELECT 1 FROM order_items WHERE order_id = v_order_id AND product_id = v_product_id) THEN
                INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
                VALUES (v_order_id, v_product_id, v_product_name, v_quantity, v_product_price);
                SET v_total_price = v_total_price + (v_product_price * v_quantity);
            END IF;
            SET k = k + 1;
        END WHILE;

        UPDATE orders SET total_price = v_total_price WHERE order_id = v_order_id;

        SET v_pay_method = IF(RAND() > 0.5, 'VNPAY', 'COD');
        IF v_order_status = 'COMPLETED' OR v_order_status = 'DELIVERED' THEN
            SET v_pay_status = 'SUCCESS';
        ELSEIF v_order_status = 'CANCELLED' THEN
            SET v_pay_status = IF(v_pay_method = 'VNPAY', 'FAILED', 'PENDING');
        ELSE
            SET v_pay_status = IF(v_pay_method = 'VNPAY' AND RAND() > 0.4, 'SUCCESS', 'PENDING');
        END IF;

        INSERT INTO payments (order_id, payment_method, transaction_no, amount, payment_date, status)
        VALUES (
            v_order_id, 
            v_pay_method, 
            IF(v_pay_method = 'VNPAY' AND v_pay_status = 'SUCCESS', CONCAT('VNP_2026_', FLOOR(100000 + RAND() * 899999)), NULL),
            v_total_price, 
            IF(v_pay_status = 'SUCCESS', DATE_ADD(v_order_date, INTERVAL FLOOR(5 + RAND() * 45) MINUTE), NULL),
            v_pay_status
        );

        IF v_order_status = 'COMPLETED' AND RAND() < 0.28 THEN
            INSERT INTO reviews (user_id, product_id, rating, comment, is_verified_purchase, admin_flag, created_at)
            SELECT 
                v_user_id, 
                oi.product_id, 
                ELT(FLOOR(1 + RAND() * 5), 5, 5, 4, 3, 1), 
                ELT(FLOOR(1 + RAND() * 4), 'Sản phẩm date rất mới, giao hàng nhanh đợt sale.', 'Xài ổn định, mẫu mã đẹp mắt.', 'Mua tặng bạn gái, thấy khen dùng rất thích.', 'Giao hàng bọc lót chống sốc cẩn thận.'),
                TRUE, 
                'NORMAL',
                DATE_ADD(v_order_date, INTERVAL FLOOR(1 + RAND() * 4) DAY)
            FROM order_items oi WHERE oi.order_id = v_order_id LIMIT 1;
        END IF;

        SET j = j + 1;
    END WHILE;
END$$

DELIMITER ;


-- =========================================================
-- KHỞI CHẠY TUẦN TỰ CÁC KHỐI PHÁT SINH DỮ LIỆU
-- =========================================================
CALL FastGenerateBulkData();
CALL GenerateRecent2026Data();

-- Giải phóng Procedure khỏi hệ thống database
DROP PROCEDURE IF EXISTS FastGenerateBulkData;
DROP PROCEDURE IF EXISTS GenerateRecent2026Data;

-- =========================================================
-- PHÂN TÍCH NHANH BIỂU ĐỒ SỐ ĐƠN HÀNG RIÊNG TRONG NĂM 2026
-- =========================================================
SELECT 
    MONTH(created_at) AS 'Tháng (Năm 2026)', 
    COUNT(*) AS 'Tổng Số Đơn Hàng Năm 2026',
    FORMAT(SUM(total_price), 0) AS 'Doanh Thu Tạm Tính (VND)'
FROM orders 
WHERE YEAR(created_at) = 2026
GROUP BY MONTH(created_at)
ORDER BY MONTH(created_at);