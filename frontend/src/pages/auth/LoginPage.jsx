import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, logoutUser } from "../../features/auth/authService";
import { AuthContext } from "../../context/AuthContext";
import "./LoginPage.css";

function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { login, logout } = useContext(AuthContext);

    /**
     * Xử lý đăng nhập customer.
     *
     * Nếu tài khoản là admin, hệ thống sẽ đăng xuất ngay
     * và hiển thị thông báo yêu cầu đăng nhập tại trang quản trị.
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

            if (data.role === "ROLE_ADMIN") {
                logoutUser();
                logout();
                setError("Tài khoản quản trị vui lòng đăng nhập tại trang quản trị.");
                return;
            }

            login({
                name: data.name,
                role: data.role,
                email: data.email,
            });

            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message || err.message ||
                "Email hoặc mật khẩu không đúng"
            );  
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <h2 className="login-title">Đăng nhập</h2>

            {error && (
                <p
                    className="error-message">
                    {error}
                </p>
            )}

            <form className="login-form" onSubmit={handleLogin}>

                <div className="form-group">

                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                </div>

                <div className="form-group">

                    <label>Mật khẩu</label>

                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                </div>

                <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={loading}
                >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>

            </form>

            <div className="login-footer">
                <span>Chưa có tài khoản?</span>

                <Link to="/auth/register">
                    Đăng ký
                </Link>
            </div>

        </div>
    );
}

export default LoginPage;