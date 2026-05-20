import { Link, useLocation, useNavigate } from "react-router-dom";

import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);

      return;
    }

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <header className="main-header">
      <Link to="/" className="logo">
        AURA
      </Link>

      <nav className="nav-menu">
        <button type="button" onClick={() => scrollToSection("about-us")}>
          About Us
        </button>

        <button type="button" onClick={() => navigate("/products")}>
          Products
        </button>

        <button type="button" onClick={() => scrollToSection("categories")}>
          Danh mục
        </button>
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className="cart-btn"
          onClick={() => navigate("/cart")}
        >
          🛒
        </button>

        <div className="user-box">
          <div className="avatar">N</div>

          <div>
            <strong>Nguyễn Văn A</strong>
            <p>Khách hàng</p>
          </div>
        </div>
      </div>
    </header>
  );
}