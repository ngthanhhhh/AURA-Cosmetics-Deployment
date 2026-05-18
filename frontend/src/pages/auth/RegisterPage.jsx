import { useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import { registerUser } from "../../features/auth/authService";
import "./RegisterPage.css";

function RegisterPage() {
    
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword:"",
    });
    

    const [error, setError]= useState("");

    // State loading
    const [loading, setLoading] = useState(false);

    // Hàm cập nhật state mỗi khi người dùng gõ vào ô input
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    /**
     * Xử lý đăng ký tài khoản khách hàng.
     *
     * Trước khi gửi request:
     * - validate mật khẩu
     * - validate xác nhận mật khẩu
     * - chuẩn hóa dữ liệu đầu vào
     *
     * Sau khi đăng ký thành công,
     * user sẽ được chuyển sang trang đăng nhập.
     *
     * @param {React.FormEvent<HTMLFormElement>} e Sự kiện submit form.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!/^\d{10}$/.test(formData.phone.trim())){
            setError("Số điện thoại phải gồm 10 chữ số");
            return;
        }

        if(formData.password.length < 6){
            setError("Mật khẩu có ít nhất 6 ký tự");
            return;
        }

        if(formData.password !== formData.confirmPassword){
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        // console.log("Du lieu hien tai: ", formData);
        setError("");

        // Đóng gói dữ liệu: Kết hợp thông tin người dùng nhập + dữ liệu mặc định hệ thống cần
        const dataToSubmit = {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),
            password: formData.password,
            confirmPassword: formData.confirmPassword, //phải có để xác nhận!!!
            address: "",
        };

        try{
            setLoading(true);
            await registerUser(dataToSubmit);
            
            navigate("/auth/login", {
                state: {
                    message: "Đăng ký thành công. Vui lòng đăng nhập.",
                },
            }); 
        } catch (err){
            setError(err.response?.data?.message || err.message || "Có lỗi xảy ra, vui lòng thử lại!");
        } finally{
            setLoading(false);
        }

    };
    
    return (
        <div className="register-container">
           
            <h2 className="register-title">Tạo tài khoản</h2>

            {error && <p className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</p>}
            
            <form className="register-form" onSubmit={handleSubmit}>

                {/* Phần nhập họ tên */}
                <div className="form-group">
                    <label>Họ tên</label>
                    <input 
                        name="name"
                        type="text" 
                        placeholder="Nhập họ và tên"
                        value={formData.name}
                        onChange={handleChange}
                        required></input>

                </div>

                {/* Phần nhập email */}
                <div className="form-group">
                    <label>Email</label>
                    <input 
                        name="email"
                        type="email" 
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        required></input>

                </div>

                {/* Phần nhập sdt */}
                <div className="form-group">
                    <label>Số điện thoại</label>
                    <input 
                        name="phone"
                        type="text" 
                        placeholder="Nhập số điện thoại"
                        value={formData.phone}
                        onChange={handleChange}
                        required></input>

                </div>
                

                {/* Phần nhập mật khẩu */}
                <div className="form-group">
                    <label>Mật khẩu</label>
                    <input 
                        name="password"
                        type="password" 
                        placeholder="Tối thiểu 6 kí tự"
                        value={formData.password}
                        onChange={handleChange}
                        required></input>

                </div>

                {/* Phần xác nhận mật khẩu */}
                <div className="form-group">
                    <label>Xác nhận mật khẩu</label>
                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required>

                    </input>
                </div>
                
                {/* Nút gửi form */}
                <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={loading}
                    >
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>
            </form>

            {/* Link chuyển hướng trang đăng nhập */}
            <div className="register-footer">
                <span>Bạn đã có tài khoản?  </span>
                <Link to="/auth/login">Đăng nhập!</Link>
            </div>
            
        </div>
    );
}

export default RegisterPage;