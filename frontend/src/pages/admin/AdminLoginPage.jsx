import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, logoutUser } from "../../features/auth/authService";
import "./AdminLoginPage.css";


function AdminLoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    /**
     * Xử lý đăng nhập trang quản trị.
     *
     * Sau khi đăng nhập thành công, frontend kiểm tra role.
     * Chỉ tài khoản ROLE_ADMIN mới được truy cập dashboard admin.
     * Nếu tài khoản không phải admin, hệ thống sẽ đăng xuất và hiển thị lỗi.
     *
     * @param {React.FormEvent<HTMLFormElement>} e Sự kiện submit form.
     */

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try{
            
            const data = await loginUser({
                email: email.trim(),
                password,
            });

            // Kiểm tra ROLE
            if(data.role !== "ROLE_ADMIN"){
                logoutUser();

                navigate("/auth/login", {
                    replace: true,
                    state: {
                        message: "Tài khoản không có quyền truy cập trang quản trị",
                    },
                });
                
                return;

            }
            // Chuyển hướng admin dashboard
             navigate("/admin");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Email hoặc mật khẩu không đúng"
            );  

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">

            <h2 className="admin-login-title">Đăng nhập quản trị</h2>

            {error && (
                <p
                    className="error-message"
                    style={{ color: "red", marginBottom: "10px"}}
                >
                    {error}
                </p>
            )}

            <form className="admin-login-form" onSubmit={handleLogin}>

                <div className="form-group">

                    <label>Email</label>

                    <input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required>

                    </input>

                </div>

                <div className="form-group">

                    <label>Mật khẩu</label>

                    <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required>

                    </input>

                </div>

                <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={loading}
                >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập Admin"}
                </button>

            </form>
        
        </div>
    );
}

export default AdminLoginPage;