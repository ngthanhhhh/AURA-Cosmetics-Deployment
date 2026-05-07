import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import { changePassword } from "../../features/users/userService";
import "./ChangePasswordPage.css";


function ChangePasswordPage() {

    //const navigate = useNavigate();

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading ] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) =>{
        
        e.preventDefault();

        // Validdate mật khẩu hiện tại rỗng
        if(!formData.oldPassword.trim()){
            setError("Vui lòng nhập mật khẩu hiện tại");
            return;
        }

        //Validate mật khẩu mới
        if(formData.newPassword.length < 6){

            setError("Mật khẩu mới phải có ít nhất 6 ký tự");

            return;
        }

        if(formData.oldPassword === formData.newPassword){
            setError("Mật khẩu mới phải khác mật khẩu cũ");
            return;
        }

        //Validate mật khẩu xác nhận
        if(
            formData.newPassword !==
            formData.confirmPassword
        ) {
            setError("Mật khẩu xác nhận không khớp");

            return;
        }

        try{
            setLoading(true);

            await changePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
            });

            setSuccess("Đổi mật khẩu thành công!");

            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            //navigate("profile");
        } catch(err){

            setError(
                err.response?.data?.message ||
                "Đổi mật khẩu thất bại"
            );
        } finally {
            setLoading(false);
        }
    };
    
    return (

        <div className="change-pw-container">

            <h2 className="change-pw-title">Đổi mật khẩu</h2>

            {error && (
                <p
                    style={{
                        color: "red",
                        marginBottom: "10px",
                    }}
                >
                    {error}
                </p>
            )}

            {success && (
                <p
                    style={{
                        color: "green",
                        marginBottom: "10px",
                    }}
                >
                    {success}
                </p>
            )}

            <form
                className="change-pw-form"
                onSubmit={handleSubmit}>

                <div className="form-group">
                    
                    <label>Mật khẩu hiện tại</label>

                    <input
                        type="password"
                        name="oldPassword"
                        placeholder="Nhập mật khẩu hiện tại"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        required>

                    </input>
                </div>

                <div className="form-group">
                    <label>Mật khẩu mới</label>

                    <input
                        type="password"
                        name="newPassword"
                        placeholder="Nhập mật khẩu mới"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required>
                        
                    </input>

                </div>

                <div className="form-group">
                    <label>Xác nhận mật khẩu mới</label>

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu mới"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required>
                        
                    </input>

                </div>

                <button
                    type="submit"
                    className="btn-submit"
                    disabled={loading}>
                        {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
            </form>
        </div>

    );
}

export default ChangePasswordPage;