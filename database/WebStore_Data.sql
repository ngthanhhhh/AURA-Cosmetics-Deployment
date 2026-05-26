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
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,3,'2026-05-21 15:03:13','2026-05-21 15:03:13'),(2,4,'2026-05-21 15:03:13','2026-05-21 15:03:13'),(3,5,'2026-05-21 15:03:13','2026-05-21 15:03:13'),(4,6,'2026-05-21 15:03:13','2026-05-21 15:03:13'),(5,7,'2026-05-21 15:03:13','2026-05-21 15:03:13'),(6,10,'2026-05-22 13:33:13','2026-05-22 13:33:13'),(7,9,'2026-05-22 15:22:18','2026-05-22 15:22:18'),(9,11,'2026-05-24 16:07:17','2026-05-24 16:07:17'),(10,12,'2026-05-24 17:21:11','2026-05-24 17:21:11'),(11,13,'2026-05-24 19:12:25','2026-05-24 19:12:25'),(12,14,'2026-05-24 19:15:15','2026-05-24 19:15:15'),(13,15,'2026-05-24 19:37:50','2026-05-24 19:37:50');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `cart_item_id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`cart_item_id`),
  UNIQUE KEY `cart_id` (`cart_id`,`product_id`),
  UNIQUE KEY `UK6oue0maw421roerltnxn16a38` (`cart_id`,`product_id`),
  KEY `idx_cart_items_product` (`product_id`),
  CONSTRAINT `fk_cartitem_cart` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cartitem_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_chk_1` CHECK ((`quantity` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (1,1,1,2),(2,1,8,1),(3,2,4,1),(4,2,16,2),(5,3,10,1),(6,4,15,10);
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Làm Sạch','Sữa rửa mặt, tẩy trang','2026-05-20 14:49:21','2026-05-20 14:49:21'),(2,'Dưỡng Da','Serum, kem dưỡng phục hồi','2026-05-20 14:49:21','2026-05-20 14:49:21'),(3,'Trang Điểm','Son, Cushion, Phấn','2026-05-20 14:49:21','2026-05-20 14:49:21'),(4,'Chống Nắng','Bảo vệ da toàn diện','2026-05-20 14:49:21','2026-05-20 14:49:21'),(5,'Mặt Nạ','Mặt nạ giấy, mặt nạ ngủ','2026-05-20 14:49:21','2026-05-20 14:49:21'),(6,'Phụ Kiện','Bông tẩy trang, máy rửa mặt','2026-05-20 14:49:21','2026-05-20 14:49:21'),(7,'Son dưỡng','Dưỡng môi','2026-05-20 15:18:04','2026-05-20 15:18:04'),(8,'Trang điểm mắt','Sản phẩm hỗ trợ trang điểm mắt','2026-05-20 16:36:06','2026-05-20 16:36:06'),(9,'Dụng cụ trang điểm','Cọ trang điểm, mút trang điểm,...','2026-05-24 16:53:01','2026-05-24 16:53:01');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `product_name` varchar(150) NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(12,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `fk_orderitem_product` (`product_id`),
  KEY `idx_order_items_order` (`order_id`),
  CONSTRAINT `fk_orderitem_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orderitem_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE SET NULL,
  CONSTRAINT `order_items_chk_1` CHECK ((`quantity` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,'Sữa Rửa Mặt Aura B5',2,185000.00),(2,1,8,'Son Kem Aura #01',1,250000.00),(3,2,4,'Serum HA Lấp Lánh',1,350000.00),(4,2,16,'Bông Tẩy Trang 222m',2,45000.00),(5,3,12,'KCN Aura Invisible',1,390000.00),(6,4,9,'Son Kem Aura #02',1,250000.00),(7,5,1,'Sữa Rửa Mặt Aura B5',1,185000.00),(8,6,19,'loppy',1,20000000.00),(9,7,1,'Sữa Rửa Mặt Aura B5',1,185000.00),(10,8,2,'Nước Tẩy Trang Aura',1,210000.00),(11,9,3,'Tẩy Tế Bào Chết Cafe',1,120000.00),(12,10,48,'Trọn Bộ 30 Cọ Make Up Sang Trọng',1,399000.00),(13,11,19,'loppy',3,20000000.00),(14,12,1,'Sữa Rửa Mặt Aura B5',2,185000.00),(15,12,11,'Phấn Phủ Aura Silk',1,280000.00),(16,12,49,'Hộp 4  Mút Đánh Nền Mềm Mịn',1,99000.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `recipient_name` varchar(255) DEFAULT NULL,
  `recipient_phone` varchar(255) DEFAULT NULL,
  `shipping_address` varchar(255) NOT NULL,
  `status` enum('PENDING','PREPARING','SHIPPING','DELIVERED','COMPLETED','CANCELLED') DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `idx_orders_user` (`user_id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,3,620000.00,'Nguyễn Văn Khách','0981112222','Quận 1, HCM','COMPLETED','2026-03-01 02:00:00','2026-05-21 15:03:13'),(2,4,440000.00,'Lê Thị Thanh','0983334444','Quận 7, HCM','COMPLETED','2026-03-05 07:00:00','2026-05-21 15:03:13'),(3,6,390000.00,'Phạm Minh Tuấn','0911222333','Đà Nẵng','SHIPPING','2026-03-10 01:30:00','2026-05-21 15:03:13'),(4,7,250000.00,'Hoàng Bảo Ngọc','0944555666','Hà Nội','CANCELLED','2026-03-11 04:00:00','2026-05-21 15:03:13'),(5,5,520000.00,'Trần Thu Thủy','0975556666','Bình Thạnh, HCM','PENDING','2026-05-21 15:03:13','2026-05-21 15:03:13'),(6,9,20000000.00,'huynh thi nhu quynh','0345117298','97 man thiện','DELIVERED','2026-05-22 15:24:52','2026-05-22 15:25:15'),(7,9,185000.00,'Nguyễn Văn Khách','0981112222','Quận 1, TP.HCM','PENDING','2026-05-24 16:14:39','2026-05-24 16:14:39'),(8,9,210000.00,'Huỳnh Thị Như Quỳnh','0981112222','Quận 1, TP.HCM','PENDING','2026-05-24 16:16:00','2026-05-24 16:16:00'),(9,9,120000.00,'huynh thi nhu quynh','0345117295','97 Man Thiện Tăng Nhơn Phú Thủ Đức','DELIVERED','2026-05-24 16:18:03','2026-05-24 16:18:24'),(10,12,399000.00,'Min Yoongi','0345117295','123 Lê Văn Việt Tăng Nhơn Phú Thủ Đức','PENDING','2026-05-24 17:26:21','2026-05-24 17:26:21'),(11,15,60000000.00,'Nguyễn Kiệt','0345117295','97 man thiện hiệp phú thủ đức','COMPLETED','2026-05-26 11:52:06','2026-05-26 11:52:47'),(12,15,749000.00,'Nguyễn Kiệt','0345117295','97 man thiện','COMPLETED','2026-05-26 11:57:31','2026-05-26 11:58:42');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `payment_method` enum('COD','VNPAY') DEFAULT NULL,
  `transaction_no` varchar(100) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('PENDING','SUCCESS','FAILED') DEFAULT 'PENDING',
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `order_id` (`order_id`),
  CONSTRAINT `fk_payment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,'VNPAY',NULL,620000.00,'2026-05-21 15:03:13','SUCCESS'),(2,2,'COD',NULL,440000.00,'2026-05-21 15:03:13','SUCCESS'),(3,3,'VNPAY',NULL,390000.00,'2026-05-21 15:03:13','SUCCESS'),(4,4,'COD',NULL,250000.00,'2026-05-21 15:03:13','FAILED'),(5,5,'VNPAY',NULL,520000.00,'2026-05-21 15:03:13','PENDING'),(6,6,'COD',NULL,20000000.00,'2026-05-22 15:25:17','SUCCESS'),(7,7,'COD',NULL,185000.00,NULL,'PENDING'),(8,8,'COD',NULL,210000.00,NULL,'PENDING'),(9,9,'COD',NULL,120000.00,'2026-05-24 16:18:26','SUCCESS'),(10,10,'COD',NULL,399000.00,NULL,'PENDING'),(11,11,'COD',NULL,60000000.00,'2026-05-26 11:52:29','SUCCESS'),(12,12,'VNPAY','12-1779796650920',749000.00,'2026-05-26 11:58:25','SUCCESS');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Sữa Rửa Mặt Aura B5',185000.00,97,'Làm sạch dịu nhẹ','https://res.cloudinary.com/dibq4hudo/image/upload/v1779288987/aura/products/ewbfzjsuijsy22nrov3g.jpg','ACTIVE',1,'2026-05-20 14:49:21','2026-05-26 11:57:31'),(2,'Nước Tẩy Trang Aura',210000.00,49,'Sạch sâu bã nhờn','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289005/aura/products/inoz2cbrl9qeswluyt4x.jpg','ACTIVE',1,'2026-05-20 14:49:21','2026-05-24 16:16:00'),(3,'Tẩy Tế Bào Chết Cafe Sữa Dừa',550000.00,39,'Mịn da tự nhiên','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289015/aura/products/zhelarc3b4furdvl3z6i.jpg','ACTIVE',1,'2026-05-20 14:49:21','2026-05-24 16:21:31'),(4,'Serum HA Lấp Lánh',350000.00,80,'Cấp ẩm đa tầng','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289038/aura/products/mjdgnoguj8sdx3pahlp8.jpg','ACTIVE',2,'2026-05-20 14:49:21','2026-05-20 14:57:21'),(5,'Kem Phục Hồi Aura',420000.00,30,'Tái tạo da ban đêm','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289054/aura/products/jf1vcbtyi00f9mujzv3d.jpg','ACTIVE',2,'2026-05-20 14:49:21','2026-05-20 14:57:37'),(6,'Serum Vitamin C 15%',550000.00,0,'Sáng da mờ thâm','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289066/aura/products/aai7lw7zkrn7lhgtudgw.jpg','INACTIVE',2,'2026-05-20 14:49:21','2026-05-20 14:57:48'),(7,'Kem Dưỡng Rau Má',290000.00,65,'Dịu da mụn','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289080/aura/products/g4xpmofaxyqzruvqeztx.jpg','ACTIVE',2,'2026-05-20 14:49:21','2026-05-20 14:58:05'),(8,'Son Kem Aura #01',250000.00,150,'Đỏ san hô','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289100/aura/products/ffqgcavgsulzranwyp1i.jpg','ACTIVE',3,'2026-05-20 14:49:21','2026-05-20 14:58:22'),(9,'Son Kem Aura #02',250000.00,120,'Hồng trà','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289110/aura/products/wbd6yarlq1fljybcliec.jpg','ACTIVE',3,'2026-05-20 14:49:21','2026-05-20 14:58:33'),(10,'Cushion Aura Matte',420000.00,45,'Che phủ hoàn hảo','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289121/aura/products/olrjdxfv9liqqyzinp4w.jpg','ACTIVE',3,'2026-05-20 14:49:21','2026-05-20 14:58:44'),(11,'Phấn Phủ Aura Silk',280000.00,138,'Kiềm dầu mịn da','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289138/aura/products/rnkmvrwloyy85uuz1j2h.jpg','ACTIVE',3,'2026-05-20 14:49:21','2026-05-26 11:57:31'),(12,'KCN Aura Invisible',390000.00,110,'Chống nắng SPF50+','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289151/aura/products/zymbte4h3m9qd30a5yno.jpg','ACTIVE',4,'2026-05-20 14:49:21','2026-05-20 14:59:14'),(13,'KCN Nâng Tông Pink',390000.00,20,'Trắng hồng tự nhiên','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289170/aura/products/rudxxoft9hjvnulugxjw.jpg','ACTIVE',4,'2026-05-20 14:49:21','2026-05-20 14:59:32'),(14,'Mặt Nạ Ngủ Water',450000.00,35,'Cấp nước tức thì','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289180/aura/products/j4bdurils8fhh9h0hfvq.jpg','ACTIVE',5,'2026-05-20 14:49:21','2026-05-20 14:59:43'),(15,'Mặt Nạ Giấy Tràm Trà',25000.00,500,'Giảm sưng mụn','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289190/aura/products/r8ymb6lemibml56a1kwi.jpg','ACTIVE',5,'2026-05-20 14:49:21','2026-05-20 14:59:52'),(16,'Bông Tẩy Trang 222m',45000.00,200,'Bông mềm không xơ','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289202/aura/products/jgoectmfwuakomsc2orp.jpg','ACTIVE',6,'2026-05-20 14:49:21','2026-05-20 15:00:05'),(17,'Son tint đỏ phúc bồn tử',230000.00,399,'Son môi bóng hồng tự tin khoe tính nữ','https://res.cloudinary.com/dibq4hudo/image/upload/v1779289280/aura/products/y4mmowqcn2ymmio7n36s.jpg','ACTIVE',3,'2026-05-20 15:01:52','2026-05-20 15:56:23'),(18,'Nước Tẩy Trang Aura ver02',185000.00,200,'Làm sạch dịu nhẹ','https://res.cloudinary.com/dibq4hudo/image/upload/v1779290156/aura/products/gn4nvbjk0xjpwhbbngd4.jpg','ACTIVE',1,'2026-05-20 15:15:59','2026-05-20 15:15:59'),(19,'loppy',20000000.00,130,'','https://res.cloudinary.com/dibq4hudo/image/upload/v1779290194/aura/products/jvwru86g5sbmac7to233.jpg','ACTIVE',6,'2026-05-20 15:16:48','2026-05-26 11:52:06'),(20,'Son dưỡng môi mật ong Aura',185000.00,50,'Dưỡng ẩm môi, tẩy tế bào chết môi','https://res.cloudinary.com/dibq4hudo/image/upload/v1779290318/aura/products/lo2bic7vjxjlnxnaprdl.jpg','ACTIVE',7,'2026-05-20 15:18:55','2026-05-20 15:18:55'),(21,'Dưỡng môi tinh chất thanh long cấp ẩm',45000.00,120,'Dưỡng mềm mịn, sáng hồng mờ thâm','https://res.cloudinary.com/dibq4hudo/image/upload/v1779290691/aura/products/ljcuekzzeuwsvn2p0s56.jpg','ACTIVE',7,'2026-05-20 15:24:55','2026-05-20 15:24:55'),(22,'Son dưỡng sáp ong hoa bưởi',280000.00,50,'Nguyên liệu thiên nhiên lành tính, hỗ trợ dưỡng ẩm môi mềm mịn đỏ hồng','https://res.cloudinary.com/dibq4hudo/image/upload/v1779290844/aura/products/pewlb5uyj9vv9qniofx4.jpg','ACTIVE',7,'2026-05-20 15:27:27','2026-05-20 15:27:27'),(23,'Kem nền SkinSilk màu #01 trắng sáng',550000.00,200,'Kem nền SkinSilk tạo hiệu ứng mịn màng, nhẹ tênh như lụa trên da. Màu #01 trắng sáng phù hợp tone da trắng sáng. Phù hợp cho da nhạy cảm','https://res.cloudinary.com/dibq4hudo/image/upload/v1779290983/aura/products/dngrcv16ffvvody6xgbi.jpg','ACTIVE',3,'2026-05-20 15:30:48','2026-05-20 15:55:04'),(24,'Kem nền SkinSilk. Màu #02 trung bình sáng',550000.00,133,'Kem nền SkinSilk tạo hiệu ứng mịn màng, nhẹ tênh như lụa trên da. Màu #02 trung bình sáng, phù hợp cho da nhạy cảm','https://res.cloudinary.com/dibq4hudo/image/upload/v1779291175/aura/products/x0qpr9bjuio3evbzawfs.jpg','ACTIVE',3,'2026-05-20 15:31:59','2026-05-20 15:55:37'),(25,'Móc khóa phụ kiện xinh xắn',129000.00,90,'Móc khóa ngẫu nhiên dùng làm phụ kiện trang trí đính kèm ','https://res.cloudinary.com/dibq4hudo/image/upload/v1779293284/aura/products/llilpbpdkli1ol089zyj.jpg','ACTIVE',6,'2026-05-20 16:08:07','2026-05-20 16:08:07'),(26,'Túi mini đựng son trong suốt',299000.00,200,'Túi đựng đồ makeup tiện lợi, gọn nhẹ, trong suốt xinh xắn','https://res.cloudinary.com/dibq4hudo/image/upload/v1779293580/aura/products/re7s2l7u79naoptjitbr.jpg','ACTIVE',6,'2026-05-20 16:13:50','2026-05-20 16:13:50'),(27,'Bảng mắt Aura 12 ô màu, chất nhũ.',280000.00,99,'Bảng phấn mắt 9 ô Aura chất nhũ mịn, lấp lánh, lên màu tự nhiên','https://res.cloudinary.com/dibq4hudo/image/upload/v1779294979/aura/products/upfkhhshk3gcxtro4nye.jpg','ACTIVE',8,'2026-05-20 16:38:45','2026-05-20 16:38:45'),(28,'Bút kẻ mắt Aura chống thấm nước lâu trôi nhanh khô dễ sử dụng 0.55ml',99000.00,200,'Chống nước và lâu trôi: Bút kẻ mắt Aura đảm bảo đường kẻ sắc nét và bền màu suốt cả ngày, không lo bị lem dù trong điều kiện ẩm ướt.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779295132/aura/products/wpjeabedzfy5dy0klv8q.jpg','ACTIVE',8,'2026-05-20 16:39:57','2026-05-20 16:39:57'),(29,'Mascara Chải Lông Mày Tự Nhiên. Màu 01 - Nâu sáng - Gel Kẻ Mày Siêu Lì Chống Nước, Lâu Trôi 24H',199000.00,120,'Màu 01 - Nâu Sáng : Phù hợp với các nàng nhuộm tóc màu sáng (nâu vàng, nâu trà sữa, tóc tẩy). Giúp khuôn mặt trông trẻ trung, tây và sáng da cực kỳ.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779295208/aura/products/dywhidhjiy7xg54nvxlx.jpg','ACTIVE',8,'2026-05-20 16:41:18','2026-05-20 16:41:18'),(30,'Bảng Phấn Mắt Aura Chín Màu Tông Cam Lì Và Nhũ Ngọc Trai Sáng Bóng',299000.00,50,'Phấn phủ mịn, màu sắc phong phú, trang điểm rạng rỡ  Cảm ứng mượt như thiên nga và tinh tế, pha trộn các màu cổ điển phổ biến','https://res.cloudinary.com/dibq4hudo/image/upload/v1779295296/aura/products/ui1q9lvllhkukfwqagtd.jpg','ACTIVE',8,'2026-05-20 16:43:08','2026-05-20 16:43:08'),(31,'Phấn Má Hồng 04 Ô Dual Color Blush Mịn lì Chuẩn Màu Dễ Tán',399000.00,100,'Trang điểm hợp xu hướng màu sắc, kết hợp hoàn hảo giữa phong cách cá nhân và nhu cầu trang điểm cơ bản hàng ngày.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779295396/aura/products/bfufehbbsquiie9mzhsm.jpg','ACTIVE',3,'2026-05-20 16:45:15','2026-05-20 16:45:15'),(32,'Má Hồng Kem Hoá Phấn Aura thuần chay mịn lì và nhũ dễ tán bền màu',280000.00,50,'Má Hồng Kem Hoá Phấn Aura thuần chay mịn lì và nhũ dễ tán bền màu. Phù hợp mọi loại da','https://res.cloudinary.com/dibq4hudo/image/upload/v1779295530/aura/products/jtzindwrxsqliahi5q0g.jpg','ACTIVE',3,'2026-05-20 16:46:27','2026-05-20 16:46:27'),(33,'Bông tẩy trang Tơ Tằm Mịn Màng 80 miếng',70000.00,120,'Bông tẩy trang Tơ Tằm Mịn Màng. Gợi cảm giác lướt nhẹ trên da êm ái như lụa, không gây đau rát hay tổn thương da khi lau mạnh.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779299588/aura/products/hjhi6pjo0n0elvsld9tq.jpg','ACTIVE',1,'2026-05-20 17:53:27','2026-05-20 17:53:27'),(34,'Bông tẩy trang Bông Xơ Tự Nhiên 150 miếng',63000.00,100,'Bông tẩy trang Bông Xơ Tự Nhiên 100% bông tự nhiên thuần khiết, chưa qua tẩy trắng độc hại.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779299644/aura/products/gqw6nk8pxkvaxqlvooel.jpg','ACTIVE',1,'2026-05-20 17:54:32','2026-05-20 17:54:32'),(35,'Kem Dương Ẩm Aura Tinh Chất Rau Má B5+',280000.00,200,'Cấp ẩm cho làn da mềm mịn căng bóng, hỗ trợ phục hồi da sau mụn. Làn da khỏe thấy rõ sau 2 tháng sử dụng.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779640072/aura/products/tcj1iblip5zak9aifl0x.jpg','ACTIVE',2,'2026-05-24 16:29:15','2026-05-24 16:29:15'),(36,'Serum Dưỡng Ẩm Làm Trắng Sáng Da Hỗ Trợ Giảm Mụn Trứng Cá Chống Nếp Nhăn Se Khít Lỗ Chân Lông',550000.00,50,'Serum Dưỡng Da SENANA 15ml là lựa chọn tuyệt vời để giúp làn da bạn trở nên rạng rỡ, đều màu và sáng khỏe. Không chỉ dưỡng trắng, sản phẩm còn hỗ trợ làm mờ nám, tàn nhang, giảm mụn trứng cá và se khít lỗ chân lông. Ngoài ra, serum còn giúp chống nếp nhăn và phục hồi làn da, mang lại sự tươi trẻ và căng mịn.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779640169/aura/products/s34fcurnffpspunuljf8.jpg','ACTIVE',2,'2026-05-24 16:30:41','2026-05-24 16:30:41'),(37,'Son Dưỡng Môi Tùy Chọn Hương Liệu Thiên Nhiên',185000.00,133,'Son Dưỡng Môi Tùy Chọn Hương Liệu Thiên Nhiên Cho Bờ Môi Căng Mọng Ngừa Thâm','https://res.cloudinary.com/dibq4hudo/image/upload/v1779640259/aura/products/tmytigcffpeznvezbzxj.jpg','ACTIVE',7,'2026-05-24 16:32:05','2026-05-24 16:32:05'),(38,'Tẩy Tế Bào Chết Da Mặt Đường Đen Tạo Bột Làm Sạch Nhẹ Nhàng',139000.00,260,'Tẩy Tế Bào Chết Da Mặt Đường Đen Tạo Bột Làm Sạch Nhẹ Nhàng. Hỗ trợ mờ thâm cho vết mụn thâm mới, làm sạch lỗ chân lông.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779640633/aura/products/gbybt4gnpeojqqoa7hin.jpg','ACTIVE',1,'2026-05-24 16:38:36','2026-05-24 16:38:36'),(39,'Kem Cấp Ẩm, Làm Trắng da Mặt Aura 140g',450000.00,133,'Kem dưỡng ẩm Aura với thiết kế vỏ hình chú cừu đáng yêu, giúp làm trắng mịn, kiểm soát dầu và tăng độ đàn hồi cho da. Với thành phần gồm lanolin nguyên chất và glycerin, kem này không chỉ dưỡng ẩm mà còn nuôi dưỡng làn da khô, mịn, không nhờn.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779640771/aura/products/xssknbisfxyqnpmfglud.jpg','ACTIVE',2,'2026-05-24 16:40:05','2026-05-24 16:40:05'),(40,'Kem dưỡng giúp phục hồi dưỡng trắng B5 Aura 52ml',280000.00,100,'Cấp ẩm sâu: Kem dưỡng da mặt Aura B5 giúp da luôn đủ ẩm, mịn màng và căng bóng. Phục hồi da hiệu quả: Với thành phần Vitamin B5, sản phẩm này hỗ trợ tái tạo và phục hồi da bị tổn thương.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779640889/aura/products/chaunzal6pmn41z4sadm.jpg','ACTIVE',2,'2026-05-24 16:42:08','2026-05-24 16:42:08'),(41,'Tonner Pad thuần chay dạng miếng Dewycel Salady Pad 70 miếng',320000.00,100,'Dewycel Salady Pad là sản phẩm tẩy da chết đột phá, kết hợp giữa công thức tự nhiên với PHA và AHA, giúp cung cấp độ ẩm tối ưu cho làn da bạn trong khi nhẹ nhàng loại bỏ bụi bẩn và tế bào chết tích tụ. Đây chính là giải pháp hoàn hảo cho làn da tươi trẻ và rạng rỡ!','https://res.cloudinary.com/dibq4hudo/image/upload/v1779640980/aura/products/dm42mv60r9yothhakydb.jpg','ACTIVE',2,'2026-05-24 16:43:37','2026-05-24 16:43:37'),(42,'Son Bóng Romand The Juicy Lasting Tint Mẫu Mới',200000.00,133,'Son Bóng Romand The Juicy Lasting Tint Mẫu Mới. Chất son bóng mượt, không gây nặng môi, phù hợp cho mọi tone da, mang đến cho bạn đôi môi căng mọng và bền màu suốt cả ngày.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779641088/aura/products/zsupgp0guvdh7g92xcmc.jpg','ACTIVE',3,'2026-05-24 16:47:36','2026-05-24 16:47:36'),(43,'Thỏi son lì O.TWO.O nhung mịn lâu trôi không thấm nước chống khô màu đỏ cherry',280000.00,50,'','https://res.cloudinary.com/dibq4hudo/image/upload/v1779641281/aura/products/sgcx4waam318rrxmfyos.jpg','ACTIVE',3,'2026-05-24 16:48:03','2026-05-24 16:48:03'),(44,'Kem Nền Aura Dạng Lỏng 30ml Che Khuyết Điểm Tự Nhiên Cho Làn Da Hoàn Hảo',360000.00,120,'Kem nền Aura dạng lỏng nổi bật với khả năng che khuyết điểm tự nhiên, mang lại làn da mịn màng, đều màu và rạng rỡ. Sản phẩm phù hợp với nhiều loại da, giúp kiểm soát dầu hoặc dưỡng ẩm tùy theo nhu cầu, đồng thời giữ lớp nền bền màu suốt ngày dài.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779641458/aura/products/aq7y6q0iz8t2oe1t1fkd.jpg','ACTIVE',3,'2026-05-24 16:51:13','2026-05-24 16:51:13'),(45,'Bộ 8 Cọ Trang Điểm Chuyên Nghiệp Lông Mềm Cho Người Mới',185000.00,133,'Điểm nổi bật không thể bỏ qua! Bộ 8 cọ trang điểm sở hữu lông mềm mại, không gây trầy xước da, giúp bạn tạo lớp nền tự nhiên và mịn màng chỉ trong vài thao tác. Tay cầm chống trượt chắc chắn, hỗ trợ thao tác linh hoạt và dễ dàng kiểm soát khi trang điểm. ','https://res.cloudinary.com/dibq4hudo/image/upload/v1779641656/aura/products/sak8wznnzivajunrckgi.jpg','ACTIVE',9,'2026-05-24 16:55:39','2026-05-24 16:55:39'),(46,'Bộ Cọ Trang Điểm Mắt 7 Món',210000.00,100,'','https://res.cloudinary.com/dibq4hudo/image/upload/v1779641747/aura/products/rjw3bbahczir9tarskbo.jpg','ACTIVE',9,'2026-05-24 16:57:50','2026-05-24 16:57:50'),(47,'Cọ Tán Nền Mảnh Dẹt Aura',110000.00,120,'','https://res.cloudinary.com/dibq4hudo/image/upload/v1779641876/aura/products/o4wb4qyrctcrotx6cuz2.jpg','ACTIVE',9,'2026-05-24 16:58:39','2026-05-24 16:58:39'),(48,'Trọn Bộ 30 Cọ Make Up Sang Trọng',399000.00,332,'','https://res.cloudinary.com/dibq4hudo/image/upload/v1779642028/aura/products/mrc50kvvw0ls0a6gbj2h.jpg','ACTIVE',9,'2026-05-24 17:01:35','2026-05-24 17:26:21'),(49,'Hộp 4  Mút Đánh Nền Mềm Mịn',99000.00,132,'','https://res.cloudinary.com/dibq4hudo/image/upload/v1779642102/aura/products/mnagundekss7cbvasn9m.jpg','ACTIVE',9,'2026-05-24 17:02:21','2026-05-26 11:57:31'),(50,'Phấn má hồng một màu Daimanpu',280000.00,90,'Phấn má hồng một màu Daimanpu, lì, dạng bột sữa, bắt sáng lâu trôi, phù hợp cho các bạn gái tuổi teen','https://res.cloudinary.com/dibq4hudo/image/upload/v1779650489/aura/products/aiqsfvnbnhl6sxdxbnlh.jpg','ACTIVE',3,'2026-05-24 19:21:38','2026-05-24 19:21:38'),(51,'Son Thỏi Aura Ẩm Mướt Bơ Mịn Mờ vân môi 3,6g',210000.00,199,'Dòng son thỏi lì mịn, mềm như bơ chất sơn mềm mướt đích thực.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779650587/aura/products/iyrejqqlpyr8o0eyu2lk.jpg','ACTIVE',3,'2026-05-24 19:24:14','2026-05-24 19:24:14'),(52,'Son Thỏi Lì Mịn Môi Etude House Fixing Tint Bar 5 Màu 3.2g',550000.00,100,'Son Etude House Fixing Tint Bar dưỡng ẩm giúp môi hoàn hảo với kết thúc lì cho đôi môi căng mọng và cuốn hút, thoải mái sửa như thể đó là đôi môi tự nhiên của bạn.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779650695/aura/products/neybnkmjgzkjp4m25wns.jpg','ACTIVE',3,'2026-05-24 19:25:15','2026-05-24 19:25:15'),(53,'Bảng phấn má hồng 2 ô Aura 4.5gx2 phù hợp với mọi tone dạ',210000.00,100,'Thiết kế 2 màu trong 1 - dễ dàng mix & match để tạo hiệu ứng má ửng hồng trong trẻo.  Hạt phấn siêu mịn giúp dễ dàng tán đều, tạo hiệu ứng blur làm mờ khuyết điểm.  Màu sắc kéo dài cả ngày.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779650783/aura/products/ged0qia4eblk4ih0gztx.jpg','ACTIVE',3,'2026-05-24 19:26:52','2026-05-24 19:26:52'),(54,'Mặt nạ mắt Bioaqua HỘP 60 miếng tảo biển collagen hồng',189000.00,133,'Mặt nạ mắt Bioaqua HỘP 60 miếng tảo biển collagen vàng - Giảm Quầng Thâm - Nhăn Mắt','https://res.cloudinary.com/dibq4hudo/image/upload/v1779651040/aura/products/szqwodziotdfrzyxblkp.jpg','ACTIVE',5,'2026-05-24 19:31:24','2026-05-24 19:31:24'),(55,'Mặt Nạ Giấy Biodance 25ml Dưỡng Ẩm, Làm Dịu Da, Hỗ Trợ Dưỡng Sáng',45000.00,200,'Mặt nạ giấy  Biodance Vitamin B5 25ml nổi bật với khả năng cấp ẩm vượt trội, giúp làn da luôn mềm mại, căng bóng và rạng rỡ. Công nghệ vải màng Tencel \"vô hình\" cho cảm giác nhẹ nhàng, thẩm thấu nhanh, phù hợp với mọi loại da và không gây bí da.','https://res.cloudinary.com/dibq4hudo/image/upload/v1779651212/aura/products/ftg2yns3qzgma0uwhmwx.jpg','ACTIVE',5,'2026-05-24 19:34:06','2026-05-24 19:34:06');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `is_verified_purchase` tinyint(1) DEFAULT '0',
  `admin_flag` enum('NORMAL','NEGATIVE_FEEDBACK','ATTENTION_NEEDED') DEFAULT 'NORMAL',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `fk_reviews_user` (`user_id`),
  KEY `idx_reviews_product` (`product_id`),
  KEY `idx_reviews_rating` (`product_id`,`rating`),
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,9,19,5,'âhfoihiwafawefe',0,'NORMAL','2026-05-22 15:53:37','2026-05-22 15:53:37'),(2,9,2,4,'sản phẩm tốt, khá ok',0,'NORMAL','2026-05-22 15:59:44','2026-05-22 15:59:44'),(3,9,19,5,'khá tốt sản phẩm ok',0,'NORMAL','2026-05-22 16:00:24','2026-05-22 16:00:24'),(4,9,1,5,'Sản phẩm dùng rất ổn, đóng gói đẹp.',0,'NORMAL','2026-05-24 16:04:39','2026-05-24 16:04:39'),(5,9,10,5,'Sản phẩm chất lượng sử dụng rất thích, sẽ ủng hộ lần sau.',0,'NORMAL','2026-05-24 17:18:05','2026-05-24 17:18:05'),(6,9,3,2,'Đóng gói sản phẩm không tốt',0,'NORMAL','2026-05-24 17:18:29','2026-05-24 17:18:29'),(7,12,5,5,'Đã mua và dùng được 2 tuần, da trắng sáng hơn thích lắm nha',0,'NORMAL','2026-05-24 17:21:58','2026-05-24 17:21:58'),(8,12,48,5,'giao đủ hàng, cọ mềm mịn sử dụng rất thích. cọ nhìn chất lượng lắm nha',0,'NORMAL','2026-05-24 17:25:23','2026-05-24 17:25:23'),(9,15,19,4,'hàng giao về 1 cái bị vỡ, còn 2 cái thì đẹp không sao hết',1,'NORMAL','2026-05-26 11:53:16','2026-05-26 11:53:16'),(10,15,1,4,'hàng dùng không phù hợp lắm, giá hơi mắc',0,'NORMAL','2026-05-26 11:53:42','2026-05-26 11:53:42');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin Aura','admin@aurabeauty.vn','123456','97 Man Thiện, Quận 9, HCM','0901112222',1,1,'2026-05-20 15:13:52','2026-05-20 15:13:52'),(2,'Quỳnh Manager','quynh@aurabeauty.vn','123456','Thủ Đức, HCM','0903334444',1,1,'2026-05-20 15:13:52','2026-05-20 15:13:52'),(3,'Nguyễn Văn Khách','khach1@gmail.com','123456','Quận 1, HCM','0981112222',2,1,'2026-05-20 15:13:52','2026-05-20 15:13:52'),(4,'Lê Thị Thanh','thanh.test@gmail.com','123456','Quận 7, HCM','0983334444',2,1,'2026-05-20 15:13:52','2026-05-20 15:13:52'),(5,'Trần Thu Thủy','thuy.test@gmail.com','123456','Bình Thạnh, HCM','0975556666',2,1,'2026-05-20 15:13:52','2026-05-20 15:13:52'),(6,'Phạm Minh Tuấn','tuan.pham@gmail.com','123456','Hải Châu, Đà Nẵng','0911222333',2,1,'2026-05-20 15:13:52','2026-05-20 15:13:52'),(7,'Hoàng Bảo Ngọc','ngoc.hoang@gmail.com','123456','Ba Đình, Hà Nội','0944555666',2,1,'2026-05-20 15:13:52','2026-05-20 15:13:52'),(8,'Đặng Quốc Bảo','bao.dang@gmail.com','123456','Ninh Kiều, Cần Thơ','0966777888',2,1,'2026-05-20 15:13:52','2026-05-20 15:13:52'),(9,'Huynh Thi Nhu Quynh','buggbata039@gmail.com','$2a$10$UHY.ifHy.0oDVVaP2DYv7uiLgwa0EzIdVpLukT3NfwITmOB2g5XC.','97, Man Thiện, Hiệp Phú, Thủ Đức','0345117235',2,1,'2026-05-20 16:56:59','2026-05-20 17:10:59'),(11,'Nguyễn Văn Nam','admin123@gmail.com','$2a$10$s0q20eW7YEKK3uuPu7hLq.yAdBsJtrqMOEZkuaGDpIypPbOaZuixW','','0345117235',1,1,'2026-05-24 16:07:17','2026-05-24 16:07:27'),(12,'Min Yoongi','yoongi1993@gmail.com','$2a$10$u8Jx7aDkc6aAxMqr2aNCS.vT08SL728L.I1g9NcohwlvBtSYJvNLm','','0345117235',2,1,'2026-05-24 17:21:11','2026-05-24 17:21:11'),(13,'Nguyen Van B','customer123@gmail.com','$2a$10$14ihnPRWcssMpUGf3PFvV.ktoO6SKIkwsm92kAA39Wa7raP4jlSK.','','0123456789',2,1,'2026-05-24 19:12:25','2026-05-24 19:12:25'),(14,'Nguyễn Hải Đăng','admin12345@gmail.com','$2a$10$dZysTgLzxwfjBz9zHYzYReQuXqygdhASi6ZOKmPjIdl5R2OM7wybq','','0112234567',1,1,'2026-05-24 19:15:15','2026-05-24 19:15:40'),(15,'Nguyễn Kiệt','customer12345@gmail.com','$2a$10$hSmvOpAKDmrBF9zzF8LEt.yMqpnROptVvAbDgyqXvvuHn0F/cda8e','','0345117235',2,1,'2026-05-24 19:37:50','2026-05-24 19:37:50');
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

-- Dump completed on 2026-05-26 18:59:34
