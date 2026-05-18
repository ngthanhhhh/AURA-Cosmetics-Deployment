import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import SearchBox from "../ui/SearchBox";
import { logoutUser } from "../../features/auth/authService";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

import "./Header.css";

function Header() {
    const navigate = useNavigate();
    const { totalItems, clearCartState } = useContext(CartContext);

    const { user, logout } = useContext(AuthContext);
    const role = user?.role;

    const isCustomer = role === "ROLE_CUSTOMER";
    const isAdmin = role === "ROLE_ADMIN";

    const handleLogout = () => {
        logoutUser();
        logout();
        clearCartState();
        navigate("/");
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-left">
                    <Link to="/" className="header-logo">AURA</Link>

                    <div className="category-dropdown">
                        <button type="button" className="category-button">
                            <span className="hamburger-icon">☰</span>
                            <span>Danh mục</span>
                        </button>

                        <div className="dropdown-menu">
                            <Link to="/products">Tất cả sản phẩm</Link>
                            <Link to="/products">Chăm sóc da</Link>
                            <Link to="/products">Trang điểm</Link>
                            <Link to="/products">Nước hoa</Link>
                        </div>
                    </div>
                </div>

                <div className="header-center">
                    <SearchBox />
                </div>

                <div className="header-right">
                    {!isAdmin && (
                        <Link to="/cart" className="cart-link">
                            🛒
                            {totalItems > 0 && (
                                <span className="cart-badge">{totalItems}</span>
                            )}
                        </Link>
                    )}

                    {!user ? (
                        <Link to="/auth/login" className="login-link">
                            Đăng nhập
                        </Link>
                    ) : (
                        <div className="profile-dropdown">
                            <button type="button" className="profile-trigger">
                                <div className="profile-avatar">
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                </div>

                                <div className="profile-info">
                                    <strong>{user.name}</strong>
                                    <span>{isAdmin ? "Quản trị viên" : "Khách hàng"}</span>
                                </div>

                                <ChevronDown size={16} className="dropdown-arrow" />
                            </button>

                            <div className="profile-menu">
                                {isAdmin ? (
                                    <Link to="/admin">Trang quản trị</Link>
                                ) : (
                                    <>
                                        <Link to="/account">Thông tin cá nhân</Link>
                                        <Link to="/change-password">Đổi mật khẩu</Link>
                                    </>
                                )}

                                <button type="button" onClick={handleLogout}>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;