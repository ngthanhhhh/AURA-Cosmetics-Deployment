-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: web_store
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Làm Sạch','Sữa rửa mặt, tẩy trang','2026-05-20 14:49:21','2026-05-20 14:49:21'),(2,'Dưỡng Da','Serum, kem dưỡng phục hồi','2026-05-20 14:49:21','2026-05-20 14:49:21'),(3,'Trang Điểm','Son, Cushion, Phấn','2026-05-20 14:49:21','2026-05-20 14:49:21'),(4,'Chống Nắng','Bảo vệ da toàn diện','2026-05-20 14:49:21','2026-05-20 14:49:21'),(5,'Mặt Nạ','Mặt nạ giấy, mặt nạ ngủ','2026-05-20 14:49:21','2026-05-20 14:49:21'),(6,'Phụ Kiện','Bông tẩy trang, máy rửa mặt','2026-05-20 14:49:21','2026-05-20 14:49:21'),(7,'Son dưỡng','Dưỡng môi','2026-05-20 15:18:04','2026-05-20 15:18:04'),(8,'Trang điểm mắt','Sản phẩm hỗ trợ trang điểm mắt','2026-05-20 16:36:06','2026-05-20 16:36:06');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `description` varchar(1000) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  `category_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  KEY `idx_product_category` (`category_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Sữa Rửa Mặt Aura B5',185000.00,100,'Làm sạch dịu nhẹ','https://res.cloudinary.com/dibq4hudo/image/upload/v1779288987/aura/products/ewbfzjsuijsy22nrov3g.jpg','ACTIVE',1,'2026-05-20 14:49:21','2026-05-20 14:56:31'),(2,'Nước Tẩy Trang Aura',210000.00,50,'Sạch sâu bã nhờn','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289005/aura/products/inoz2cbrl9qeswluyt4x.jpg','ACTIVE',1,'2026-05-20 14:49:21','2026-05-20 14:56:47'),(3,'Tẩy Tế Bào Chết Cafe',120000.00,40,'Mịn da tự nhiên','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289015/aura/products/zhelarc3b4furdvl3z6i.jpg','ACTIVE',1,'2026-05-20 14:49:21','2026-05-20 14:56:58'),(4,'Serum HA Lấp Lánh',350000.00,80,'Cấp ẩm đa tầng','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289038/aura/products/mjdgnoguj8sdx3pahlp8.jpg','ACTIVE',2,'2026-05-20 14:49:21','2026-05-20 14:57:21'),(5,'Kem Phục Hồi Aura',420000.00,30,'Tái tạo da ban đêm','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289054/aura/products/jf1vcbtyi00f9mujzv3d.jpg','ACTIVE',2,'2026-05-20 14:49:21','2026-05-20 14:57:37'),(6,'Serum Vitamin C 15%',550000.00,0,'Sáng da mờ thâm','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289066/aura/products/aai7lw7zkrn7lhgtudgw.jpg','INACTIVE',2,'2026-05-20 14:49:21','2026-05-20 14:57:48'),(7,'Kem Dưỡng Rau Má',290000.00,65,'Dịu da mụn','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289080/aura/products/g4xpmofaxyqzruvqeztx.jpg','ACTIVE',2,'2026-05-20 14:49:21','2026-05-20 14:58:05'),(8,'Son Kem Aura #01',250000.00,150,'Đỏ san hô','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289100/aura/products/ffqgcavgsulzranwyp1i.jpg','ACTIVE',3,'2026-05-20 14:49:21','2026-05-20 14:58:22'),(9,'Son Kem Aura #02',250000.00,120,'Hồng trà','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289110/aura/products/wbd6yarlq1fljybcliec.jpg','ACTIVE',3,'2026-05-20 14:49:21','2026-05-20 14:58:33'),(10,'Cushion Aura Matte',420000.00,45,'Che phủ hoàn hảo','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289121/aura/products/olrjdxfv9liqqyzinp4w.jpg','ACTIVE',3,'2026-05-20 14:49:21','2026-05-20 14:58:44'),(11,'Phấn Phủ Aura Silk',280000.00,139,'Kiềm dầu mịn da','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289138/aura/products/rnkmvrwloyy85uuz1j2h.jpg','ACTIVE',3,'2026-05-20 14:49:21','2026-05-20 15:15:23'),(12,'KCN Aura Invisible',390000.00,110,'Chống nắng SPF50+','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289151/aura/products/zymbte4h3m9qd30a5yno.jpg','ACTIVE',4,'2026-05-20 14:49:21','2026-05-20 14:59:14'),(13,'KCN Nâng Tông Pink',390000.00,20,'Trắng hồng tự nhiên','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289170/aura/products/rudxxoft9hjvnulugxjw.jpg','ACTIVE',4,'2026-05-20 14:49:21','2026-05-20 14:59:32'),(14,'Mặt Nạ Ngủ Water',450000.00,35,'Cấp nước tức thì','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289180/aura/products/j4bdurils8fhh9h0hfvq.jpg','ACTIVE',5,'2026-05-20 14:49:21','2026-05-20 14:59:43'),(15,'Mặt Nạ Giấy Tràm Trà',25000.00,500,'Giảm sưng mụn','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289190/aura/products/r8ymb6lemibml56a1kwi.jpg','ACTIVE',5,'2026-05-20 14:49:21','2026-05-20 14:59:52'),(16,'Bông Tẩy Trang 222m',45000.00,200,'Bông mềm không xơ','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289202/aura/products/jgoectmfwuakomsc2orp.jpg','ACTIVE',6,'2026-05-20 14:49:21','2026-05-20 15:00:05'),(17,'Son tint đỏ phúc bồn tử',230000.00,399,'Son môi bóng hồng tự tin khoe tính nữ','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289280/aura/products/y4mmowqcn2ymmio7n36s.jpg','ACTIVE',3,'2026-05-20 15:01:52','2026-05-20 15:56:23'),(18,'Nước Tẩy Trang Aura ver02',185000.00,200,'Làm sạch dịu nhẹ','https://res.cloudinary.com/dibq4hudo/image/upload/v1779290156/aura/products/gn4nvbjk0xjpwhbbngd4.jpg','ACTIVE',1,'2026-05-20 15:15:59','2026-05-20 15:15:59'),(19,'loppy',20000000.00,133,'','https://res.cloudinary.com/dibq4hudo/image/upload/v1779290194/aura/products/jvwru86g5sbmac7to233.jpg','ACTIVE',6,'2026-05-20 15:16:48','2026-05-20 15:16:48'),(20,'Son dưỡng môi mật ong Aura',185000.00,50,'Dưỡng ẩm môi, tẩy tế bào chết môi','https://res.cloudinary.com/dibq4hudo/image/upload/v1779290318/aura/products/lo2bic7vjxjlnxnaprdl.jpg','ACTIVE',7,'2026-05-20 15:18:55','2026-05-20 15:18:55'),(21,'Dưỡng môi tinh chất thanh long cấp ẩm',45000.00,120,'Dưỡng mềm mịn, sáng hồng mờ thâm','https://res.cloudinary.com/dibq4hudo/image/upload/v1779290691/aura/products/ljcuekzzeuwsvn2p0s56.jpg','ACTIVE',7,'2026-05-20 15:24:55','2026-05-20 15:24:55'),(22,'Son dưỡng sáp ong hoa bưởi',280000.00,50,'Nguyên liệu thiên nhiên lành tính, hỗ trợ dưỡng ẩm môi mềm mịn đỏ hồng','https://res.cloudinary.com/dibq4hudo/image/upload/v1779290844/aura/products/pewlb5uyj9vv9qniofx4.jpg','ACTIVE',7,'2026-05-20 15:27:27','2026-05-20 15:27:27'),(23,'Kem nền SkinSilk màu #01 trắng sáng',550000.00,200,'Kem nền SkinSilk tạo hiệu ứng mịn màng, nhẹ tênh như lụa trên da. Màu #01 trắng sáng phù hợp tone da trắng sáng. Phù hợp cho da nhạy cảm','https://res.cloudinary.com/dibq4hudo/image/upload/v1779290983/aura/products/dngrcv16ffvvody6xgbi.jpg','ACTIVE',3,'2026-05-20 15:30:48','2026-05-20 15:55:04'),(24,'Kem nền SkinSilk. Màu #02 trung bình sáng',550000.00,133,'Kem nền SkinSilk tạo hiệu ứng mịn màng, nhẹ tênh như lụa trên da. Màu #02 trung bình sáng, phù hợp cho da nhạy cảm','https://res.cloudinary.com/dibq4hudo/image/upload/v1779291175/aura/products/x0qpr9bjuio3evbzawfs.jpg','ACTIVE',3,'2026-05-20 15:31:59','2026-05-20 15:55:37'),(25,'Móc khóa phụ kiện xinh xắn',129000.00,90,'Móc khóa ngẫu nhiên dùng làm phụ kiện trang trí đính kèm ','https://res.cloudinary.com/dibq4hudo/image/upload/v1779293284/aura/products/llilpbpdkli1ol089zyj.jpg','ACTIVE',6,'2026-05-20 16:08:07','2026-05-20 16:08:07'),(26,'Túi mini đựng son trong suốt',299000.00,200,'Túi đựng đồ makeup tiện lợi, gọn nhẹ, trong suốt xinh xắn','https://res.cloudinary.com/dibq4hudo/image/upload/v1779293580/aura/products/re7s2l7u79naoptjitbr.jpg','ACTIVE',6,'2026-05-20 16:13:50','2026-05-20 16:13:50'),(27,'Bảng mắt Aura 12 ô màu, chất nhũ.',280000.00,99,'Bảng phấn mắt 9 ô Aura chất nhũ mịn, lấp lánh, lên màu tự nhiên','https://res.cloudinary.com/dibq4hudo/image/upload/v1779294979/aura/products/upfkhhshk3gcxtro4nye.jpg','ACTIVE',8,'2026-05-20 16:38:45','2026-05-20 16:38:45'),(28,'Bút kẻ mắt Aura chống thấm nước lâu trôi nhanh khô dễ sử dụng 0.55ml',99000.00,200,'Chống nước và lâu trôi: Bút kẻ mắt Aura đảm bảo đường kẻ sắc nét và bền màu suốt cả ngày, không lo bị lem dù trong điều kiện ẩm ướt.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779295132/aura/products/wpjeabedzfy5dy0klv8q.jpg','ACTIVE',8,'2026-05-20 16:39:57','2026-05-20 16:39:57'),(29,'Mascara Chải Lông Mày Tự Nhiên. Màu 01 - Nâu sáng - Gel Kẻ Mày Siêu Lì Chống Nước, Lâu Trôi 24H',199000.00,120,'Màu 01 - Nâu Sáng : Phù hợp với các nàng nhuộm tóc màu sáng (nâu vàng, nâu trà sữa, tóc tẩy). Giúp khuôn mặt trông trẻ trung, tây và sáng da cực kỳ.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779295208/aura/products/dywhidhjiy7xg54nvxlx.jpg','ACTIVE',8,'2026-05-20 16:41:18','2026-05-20 16:41:18'),(30,'Bảng Phấn Mắt Aura Chín Màu Tông Cam Lì Và Nhũ Ngọc Trai Sáng Bóng',299000.00,50,'Phấn phủ mịn, màu sắc phong phú, trang điểm rạng rỡ  Cảm ứng mượt như thiên nga và tinh tế, pha trộn các màu cổ điển phổ biến','https://res.cloudinary.com/dibq4hudo/image/upload/v1779295296/aura/products/ui1q9lvllhkukfwqagtd.jpg','ACTIVE',8,'2026-05-20 16:43:08','2026-05-20 16:43:08'),(31,'Phấn Má Hồng 04 Ô Dual Color Blush Mịn lì Chuẩn Màu Dễ Tán',399000.00,100,'Trang điểm hợp xu hướng màu sắc, kết hợp hoàn hảo giữa phong cách cá nhân và nhu cầu trang điểm cơ bản hàng ngày.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779295396/aura/products/bfufehbbsquiie9mzhsm.jpg','ACTIVE',3,'2026-05-20 16:45:15','2026-05-20 16:45:15'),(32,'Má Hồng Kem Hoá Phấn Aura thuần chay mịn lì và nhũ dễ tán bền màu',280000.00,50,'Má Hồng Kem Hoá Phấn Aura thuần chay mịn lì và nhũ dễ tán bền màu. Phù hợp mọi loại da','https://res.cloudinary.com/dibq4hudo/image/upload/v1779295530/aura/products/jtzindwrxsqliahi5q0g.jpg','ACTIVE',3,'2026-05-20 16:46:27','2026-05-20 16:46:27'),(33,'Bông tẩy trang Tơ Tằm Mịn Màng 80 miếng',70000.00,120,'Bông tẩy trang Tơ Tằm Mịn Màng. Gợi cảm giác lướt nhẹ trên da êm ái như lụa, không gây đau rát hay tổn thương da khi lau mạnh.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779299588/aura/products/hjhi6pjo0n0elvsld9tq.jpg','ACTIVE',1,'2026-05-20 17:53:27','2026-05-20 17:53:27'),(34,'Bông tẩy trang Bông Xơ Tự Nhiên 150 miếng',63000.00,100,'Bông tẩy trang Bông Xơ Tự Nhiên 100% bông tự nhiên thuần khiết, chưa qua tẩy trắng độc hại.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779299644/aura/products/gqw6nk8pxkvaxqlvooel.jpg','ACTIVE',1,'2026-05-20 17:54:32','2026-05-20 17:54:32');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ROLE_ADMIN'),(2,'ROLE_CUSTOMER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role_id` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_user_role` (`role_id`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin Aura','admin@aurabeauty.vn','123456','97 Man Thiện, Quận 9, HCM','0901112222',1,1,'2026-05-20 15:13:52','2026-05-20 15:13:52'),(2,'Quỳnh Manager','quynh@aurabeauty.vn','123456','Thủ Đức, HCM','0903334444',1,1,'2026-05-20 15:13:52','2026-05-20 15:13:52'),(3,'Nguyễn Văn Khách','khach1@gmail.com','123456','Quận 1, HCM','0981112222',2,1,'2026-05-20 15:13:52','2026-05-20 15:13:52'),(4,'Lê Thị Thanh','thanh.test@gmail.com','123456','Quận 7, HCM','0983334444',2,1,'2026-05-20 15:13:52','2026-05-20 15:13:52'),(5,'Trần Thu Thủy','thuy.test@gmail.com','123456','Bình Thạnh, HCM','0975556666',2,1,'2026-05-20 15:13:52','2026-05-20 15:13:52'),(6,'Phạm Minh Tuấn','tuan.pham@gmail.com','123456','Hải Châu, Đà Nẵng','0911222333',2,1,'2026-05-20 15:13:52','2026-05-20 15:13:52'),(7,'Hoàng Bảo Ngọc','ngoc.hoang@gmail.com','123456','Ba Đình, Hà Nội','0944555666',2,1,'2026-05-20 15:13:52','2026-05-20 15:13:52'),(8,'Đặng Quốc Bảo','bao.dang@gmail.com','123456','Ninh Kiều, Cần Thơ','0966777888',2,1,'2026-05-20 15:13:52','2026-05-20 15:13:52'),(9,'Huynh Thi Nhu Quynh','buggbata039@gmail.com','$2a$10$UHY.ifHy.0oDVVaP2DYv7uiLgwa0EzIdVpLukT3NfwITmOB2g5XC.','97, Man Thiện, Hiệp Phú, Thủ Đức','0345117235',2,1,'2026-05-20 16:56:59','2026-05-20 17:10:59');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-21  1:59:14
