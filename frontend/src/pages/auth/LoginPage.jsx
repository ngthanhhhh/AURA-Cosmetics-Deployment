import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../features/auth/authService";
import "./LoginPage.css";

function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try{
            
            await loginUser({
                email,
                password,
            });

             navigate("/");
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
        <div className="login-container">

            <h2 className="login-title">Đăng nhập</h2>

            {error && (
                <p
                    className="error-message"
                    style={{ color: "red", marginBottom: "10px"}}
                >
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
                    required>

                    </input>

                </div>

                <div className="form-group">

                    <label>Mật khẩu</label>

                    <input
                    type="password"
                    placeholder="Mật khẩu"
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