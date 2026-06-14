import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ChevronDown } from "lucide-react";

import "./Header.css";

import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { logoutUser } from "../../features/auth/authService";



export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useContext(AuthContext);
  const { totalItems, clearCartState } = useContext(CartContext);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isAdmin = user?.role === "ROLE_ADMIN";

  // Điều hướng và tự đóng menu tài khoản
  const handleMenuNavigate = (path) => {
    setShowProfileMenu(false);
    navigate(path);
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    logoutUser();
    logout();
    clearCartState();
    navigate("/");
  };

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

  const handleLogoClick = (e) => {
    e.preventDefault();

    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      navigate("/");
    }
  };

  return (
    <header className="main-header">
      <Link
        to="/"
        className="logo"
        onClick={handleLogoClick}
      >
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
        {!isAdmin && (
          <button
            type="button"
            className="cart-btn"
            onClick={() => navigate("/cart")}
          >
            <span>🛒</span>
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </button>
        )}

        {!user ? (
          <button
            type="button"
            className="login-header-btn"
            onClick={() => navigate("/auth/login")}
          >
            Đăng nhập
          </button>
        ) : (
          <div className="profile-dropdown">
            <button
              type="button"
              className="user-box"
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
              <div className="avatar">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div>
                <strong>{user.name}</strong>
                <p>{isAdmin ? "Quản trị viên" : "Khách hàng"}</p>
              </div>

              <ChevronDown size={16} />
            </button>

            {showProfileMenu && (
              <div className="profile-menu">
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={() => handleMenuNavigate("/admin")}
                  >
                    Trang quản trị
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleMenuNavigate("/account")}
                    >
                      Thông tin cá nhân
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMenuNavigate("/my-orders")}
                    >
                      Đơn hàng của tôi
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMenuNavigate("/change-password")}
                    >
                      Đổi mật khẩu
                    </button>
                  </>
                )}

                <button type="button" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}