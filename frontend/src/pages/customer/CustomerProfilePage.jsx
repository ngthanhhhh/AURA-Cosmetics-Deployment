import { useEffect, useState } from "react";
import { fetchMyProfile, updateMyProfile } from "../../features/users/userService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import "./CustomerProfilePage.css";

function CustomerProfilePage(){
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const [originalData, setOriginalData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    /**
     * Tải thông tin tài khoản hiện tại từ backend.
     */
    const loadProfile = async () => {
        try{
            setLoading(true);
            setError("");

            const data = await fetchMyProfile();

            const profile = {
                name: data.name || "",
                email: data.email || "",
                phone: data.phone || "",
                address: data.address || "",
            };

            setFormData(profile);
            setOriginalData(profile);
        } catch {
            setError("Không thể tải thông tin tài khoản. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * Cập nhật thông tin cá nhân của customer.
     *
     * Sau khi cập nhật thành công,
     * dữ liệu profile sẽ được tải lại để đồng bộ giao diện.
     *
     * @param {React.FormEvent<HTMLFormElement>} e Sự kiện submit form.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if(!formData.name.trim()){
            setError("Họ tên không được để trống.");
            return;
        }

        if(formData.phone && !/^\d{10}$/.test(formData.phone)){
            setError("Số điện thoại phải có 10 chữ số");
            return;
        }

        try{
            setSaving(true);

            const payload = {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
            };

            await updateMyProfile(payload);

            const updatedProfile = await fetchMyProfile();

            const latestProfile = {
                name: updatedProfile.name || "",
                email: updatedProfile.email || "",
                phone: updatedProfile.phone || "",
                address: updatedProfile.address || "",
            };

            setFormData(latestProfile);
            setOriginalData(latestProfile);

            const currentUser = JSON.parse(localStorage.getItem("user") || "null");

            if(currentUser){
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...currentUser,
                        name: updatedProfile.name,
                    })
                );
            }

            setMessage("Cập nhật thông tin thành công.");
        } catch (err){
            setError(
                err.response?.data?.message ||
                "Cập nhật thông tin thất bại."
            );
        } finally {
            setSaving(false);
        }

    };

    const handleCancel = async () => {
        setFormData(originalData);
        setError("");
        setMessage("");
    }
    
    if (loading){
        return <div>Đang tải thông tin tài khoản...</div>;
    }

    return (
        <div className="customer-profile-page">
            <div className="profile-card">
                <h2>Thông tin tài khoản</h2>

                {error && <p className="profile-error">{error}</p>}
                {message && <p className="profile-success">{message}</p>}

                <form className="profile-form" 
                    onSubmit={handleSubmit}>
                    <div className="profile-row">
                        <label className="profile-label">Họ tên</label>

                        <Input   
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="profile-row">
                        <label className="profile-label">Email</label>

                        <Input      
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                        />

                    </div>

                    <div className="profile-row">
                        <label className="profile-label">Số điện thoại</label>

                        <Input  
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="profile-row">
                        <label className="profile-label">Địa chỉ</label>

                        <textarea      
                            className="profile-textarea"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="profile-actions">
                        <Button
                            type="button"
                            onClick={handleCancel}
                        >Hủy</Button>

                        <Button type="submit" disabled={saving}>
                            {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </div>
                
                </form>
            </div>
            
        </div>
    );
}

export default CustomerProfilePage;