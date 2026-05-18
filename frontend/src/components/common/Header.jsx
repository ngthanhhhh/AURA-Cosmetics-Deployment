
import { Link, useNavigate } from 'react-router-dom';
import SearchBox from "../ui/SearchBox";
import { logoutUser } from "../../features/auth/authService";

import "./Header.css";
import { ChevronDown } from "lucide-react";


function Header() {
    
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const role = localStorage.getItem("role") || user?.role;

    const isCustomer = role === "ROLE_CUSTOMER";
    const isAdmin = role === "ROLE_ADMIN";

    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate("/");
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-left">
                    <Link to="/" className="header-logo">AURA</Link>

                    <div className="category-dropdown">
                        <button 
                            type="button" className="category-button">
                                <span className="hamburger-icon">☰</span>
                                <span>Danh mục</span>
                        </button>

                        <div className="dropdown-menu">
                            <Link to="/category/skin-care">Chăm sóc da</Link>
                            <Link to="/category/make-up">Trang điểm</Link>
                            <Link to="/category/perfume">Nước hoa</Link>
                        </div>
                    </div>
                </div>

                <div className="header-center">
                    <SearchBox/>
                   
                </div>

                <div className="header-right">
                    {!isAdmin && (
                        <Link to="/cart" className="cart-link">
                            🛒
                            <span className="cart-badge">0</span>
                        </Link>
                    )}

                    {!user ? ( 
                        <Link to="/auth/login" className="login-link">
                            Đăng nhập
                        </Link>
                        
                    ) : isAdmin ? (
                        <div className='profile-dropdown'>

                            <button 
                            type="button"className="profile-trigger">
                                <div className="profile-avatar">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>

                                <div className="profile-info">
                                    <strong>{user.name}</strong>
                                    <span>Quản trị viên</span>
                                </div>

                                <ChevronDown size={16} className="dropdown-arrow"/>
                            </button>

                            <div className="profile-menu">
                                <Link to="/admin">
                                    Trang quản trị
                                </Link>

                                <button type="button" onClick={handleLogout}>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>    
                    ) : isCustomer ? (
                        <div className='profile-dropdown'>

                            <button 
                            type="button"className="profile-trigger">
                                <div className="profile-avatar">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>

                                <div className="profile-info">
                                    <strong>{user.name}</strong>
                                    <span>Khách hàng</span>
                                </div>

                                <ChevronDown size={16} className="dropdown-arrow"/>
                            </button>
                       
                            <div className="profile-menu">
                                <Link to="/account">
                                    Thông tin cá nhân
                                </Link>

                                <Link to="/change-password">
                                    Đổi mật khẩu
                                </Link>
                    
                                <button type="button" onClick={handleLogout}>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button type="button" className="login-link" onClick={handleLogout}>
                            Đăng xuất
                        </button>
                    
                    )}
                </div>
            </div>
        </header>
    
    );
}

export default Header;