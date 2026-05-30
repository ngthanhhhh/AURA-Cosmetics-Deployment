import { useState } from "react";
import { changePassword } from "../../features/users/userService";
import "./ChangePasswordPage.css";


function ChangePasswordPage() {

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

    /**
     * Xử lý đổi mật khẩu cho khách hàng.
     *
     * Trước khi gửi request:
     * - kiểm tra mật khẩu hiện tại
     * - kiểm tra độ dài mật khẩu mới
     * - kiểm tra mật khẩu mới khác mật khẩu cũ
     * - kiểm tra xác nhận mật khẩu
     *
     * @param {React.FormEvent<HTMLFormElement>} e Sự kiện submit form.
     */
    const handleSubmit = async (e) =>{
        
        e.preventDefault();

        if(!formData.oldPassword.trim()){
            setError("Vui lòng nhập mật khẩu hiện tại");
            return;
        }

        if(formData.newPassword.length < 6){

            setError("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        if(formData.oldPassword === formData.newPassword){
            setError("Mật khẩu mới phải khác mật khẩu cũ");
            return;
        }

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
                confirmPassword: formData.confirmPassword
            });

            setSuccess("Đổi mật khẩu thành công!");

            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

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
                    className="change-pw-error">
                    {error}
                </p>
            )}

            {success && (
                <p
                    className="change-pw-success">
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