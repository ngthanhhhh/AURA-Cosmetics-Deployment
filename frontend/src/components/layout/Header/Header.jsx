import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
//dùng text/emoji tạm thời để bạn dễ chạy thử

const Header = () => {
    return (
        <nav className="header">
            <div className="header-container">

            {/* 1. Logo - quay về trang chủ */}
                <div className="topbar-left">
                    <Link to="/" className="logo">AURA</Link>

                    {/* 2. Danh mục */}
                    <div className="category-dropdown">
                        <button className="dropbtn">
                            <span className="hamburger-icon">☰</span>
                            <span className="menu-text">Danh mục</span>
                        </button>
                        <div className="dropdown-content">
                            <Link to="/category/skin-care">Chăm sóc da</Link>
                            <Link to="/category/make-up">Trang điểm</Link>
                            <Link to="/category/perfume">Nước hoa</Link>

                        </div>
                    </div>
                </div>
             
            {/* 3. Thanh tìm kiếm */}
                <div className="topbar-center">
                    <form className="search-bar">
                        <input type="text" placeholder="Tìm kiếm"/>
                        <button type="submit">
                            <i className="fas fa-search"></i></button> 🔍
                    </form>
                </div>

            {/* 4. giỏ hàng và Auth (Sign in) */}
                <div className="topbar-right">
                    
                    <Link to="/cart" className="cart-icon">
                    <i className="fas fa-shopping-cart"></i> 🛒
                    <span className="cart-badge">0</span>
                    </Link>

                    {/* Kết nối quan trọng dẫn tới trang Đăng ký/Đăng nhập */}
                    {/* Click vao dua toi trang Log in */}
                    <div className="auth-links">
                        <Link to="/auth/login" className="auth-btn login-btn">Đăng nhập</Link>
                        <span className="divider">|</span>
                        <Link to="/auth/register" className="auth-btn register-btn">Đăng ký</Link>
                    </div>
                    
                </div>
            </div>
        </nav>
    );
};

export default Header;