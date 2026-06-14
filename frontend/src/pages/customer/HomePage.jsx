import { useNavigate } from "react-router-dom";
import "./HomePage.css";

import ScrollTopButton from "../../components/common/ScrollTopButton";



export default function HomePage() {
  const navigate = useNavigate();

  const categories = [
    {
      categoryId: 1,
      name: "Làm sạch",
      image: "/images/lam-sach.jpg",
    },
    {
      categoryId: 2,
      name: "Dưỡng da",
      image: "/images/duong-da.jpg",
    },
    {
      categoryId: 3,
      name: "Trang điểm",
      image: "/images/trang-diem.jpg",
    },
    {
      categoryId: 5,
      name: "Mặt nạ",
      image: "/images/mat-na.jpg",
    },
  ];

  const products = [
    {
      productId: 4,
      name: "Serum HA lấp lánh",
      price: "350.000đ",
      image: "/images/serum-duong-sang.jpg",
    },
    {
      productId: 27,
      name: "Bảng mắt Aura 12 ô màu, chất nhũ.",
      price: "280.000 đ",
      image: "/images/kem-duong-am.jpg",
    },
    {
      productId: 3,
      name: "Tẩy Tế Bào Chết Cafe Sữa Dừa",
      price: "550.000 đ",
      image: "/images/son-moi.jpg",
    },
    {
      productId: 2,
      name: "Nước tẩy trang Aura",
      price: "210.000đ",
      image: "/images/nc-tay-trang.jpg",
    },
  ];

  return (
    <main className="home-page">
      <button className="floating-shop-btn" onClick={() => navigate("/products")}>
        Bắt đầu mua sắm
      </button>

      <section className="hero">
        <div className="hero-content">
          <p>AURA COSMETICS</p>
          <h1>Vẻ đẹp tinh tế bắt đầu từ làn da khỏe mạnh</h1>
          <span>
            Khám phá mỹ phẩm chính hãng, an toàn và phù hợp với nhu cầu làm đẹp hằng ngày của bạn.
          </span>

          <div className="hero-buttons">
            <button onClick={() => navigate("/products")}>Mua ngay</button>
            <button className="outline" onClick={() => navigate("/products")}>
              Xem sản phẩm
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="/images/banner-my-pham.jpg"
            alt="Aura Cosmetics"
          />
        </div>
      </section>

      <section className="section" id="categories">
        <p className="section-label">DANH MỤC NỔI BẬT</p>
        <h2>Khám phá theo nhu cầu</h2>

        <div className="category-grid">
          {categories.map((item) => (
            <div
              className="category-card"
              key={item.name}
              onClick={() =>
                navigate(
                  `/products?categoryId=${item.categoryId}&sortBy=productId&direction=asc&page=0`
                )
              }
            >
              <img src={item.image} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <button type="button">→</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="section-label">SẢN PHẨM NỔI BẬT</p>
        <h2>Sản phẩm được yêu thích</h2>

      <div className="product-grid">
        {products.map((item) => (
          <div
            className="product-card"
            key={item.productId}
            onClick={() => navigate(`/products/${item.productId}`)}
          >
              <img src={item.image} alt={item.name} />
              <div className="product-info">
                <h3>{item.name}</h3>
                <strong>{item.price}</strong>
                <p>★★★★★ <span>(98)</span></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="benefits">
        <div>
          <h3>Chính hãng</h3>
          <p>100% sản phẩm chính hãng, nguồn gốc rõ ràng.</p>
        </div>
        <div>
          <h3>Giao hàng nhanh</h3>
          <p>Đóng gói cẩn thận, giao hàng nhanh chóng.</p>
        </div>
        <div>
          <h3>Hỗ trợ tận tâm</h3>
          <p>Tư vấn sản phẩm phù hợp với từng nhu cầu.</p>
        </div>
      </section>

      <section className="about-us" id="about-us">
        <div>
          <p>AURA COSMETICS</p>
          <h2>About Us</h2>
          <span>
            AURA là thương hiệu mỹ phẩm hướng đến vẻ đẹp nhẹ nhàng, tinh tế và an toàn.
            Chúng tôi mang đến những sản phẩm chăm sóc sắc đẹp chính hãng, giúp khách hàng
            tự tin hơn mỗi ngày.
          </span>
        </div>
      </section>
      <ScrollTopButton />
    </main>
  );
}