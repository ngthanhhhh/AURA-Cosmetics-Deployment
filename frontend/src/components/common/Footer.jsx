import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import "./Footer.css";

import { AuthContext } from "../../context/AuthContext";

function Footer() {
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useContext(AuthContext);

    const isAdmin = user?.role === "ROLE_ADMIN";
    const isCustomer = user?.role === "ROLE_CUSTOMER";

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
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h2 className="footer-logo">AURA</h2>

                    <p>
                        Website bán mỹ phẩm trực tuyến, hỗ trợ khách hàng xem sản phẩm,
                        thêm vào giỏ hàng, đặt hàng, thanh toán và theo dõi đơn hàng.
                    </p>
                </div>

                <div className="footer-section">
                    <h3>Điều hướng</h3>

                    <ul>
                        <li>
                            <Link to="/">Trang chủ</Link>
                        </li>

                        <li>
                            <button type="button" onClick={() => scrollToSection("about-us")}>
                                Về chúng tôi
                            </button>
                        </li>

                        <li>
                            <Link to="/products">Sản phẩm</Link>
                        </li>

                        <li>
                            <button type="button" onClick={() => scrollToSection("categories")}>
                                Danh mục
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Tài khoản</h3>

                    <ul>
                        {!user && (
                            <>
                                <li>
                                    <Link to="/auth/login">Đăng nhập</Link>
                                </li>

                                <li>
                                    <Link to="/auth/register">Đăng ký</Link>
                                </li>
                            </>
                        )}

                        {isCustomer && (
                            <>
                                <li>
                                    <Link to="/cart">Giỏ hàng</Link>
                                </li>

                                <li>
                                    <Link to="/my-orders">Đơn hàng của tôi</Link>
                                </li>

                                <li>
                                    <Link to="/account">Thông tin cá nhân</Link>
                                </li>

                                <li>
                                    <Link to="/change-password">Đổi mật khẩu</Link>
                                </li>
                            </>
                        )}

                        {isAdmin && (
                            <li>
                                <Link to="/admin">Trang quản trị</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                2026 AURA Cosmetics. Final Project.
            </div>
        </footer>
    );
}

export default Footer;