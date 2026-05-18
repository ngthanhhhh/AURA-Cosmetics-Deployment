import "./Footer.css";

function Footer() {
    return(
         <footer className="footer">
            <div className="footer-container">

                <div className="footer-section">
                    <h2 className="footer-logo">AURA</h2>

                    <p>
                        Mỹ phẩm và chăm sóc da chính hãng,
                        mang đến trải nghiệm làm đẹp nhẹ nhàng
                        và tinh tế mỗi ngày.
                    </p>
                </div>

                <div className="footer-section">
                    <h3>Thông tin</h3>

                    <ul>
                        <li>Về chúng tôi</li>
                        <li>Sản phẩm</li>
                        <li>Khuyến mãi</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Hỗ trợ</h3>

                    <ul>
                        <li>Chính sách đổi trả</li>
                        <li>Hướng dẫn mua hàng</li>
                        <li>Câu hỏi thường gặp</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Liên hệ</h3>

                    <ul>
                        <li>Email: aura@gmail.com</li>
                        <li>Hotline: 0123 456 789</li>
                        <li>TP. Hồ Chí Minh</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                2026 AURA Cosmetics. All rights reserved.
            </div>
         </footer>

    )
}

export default Footer;