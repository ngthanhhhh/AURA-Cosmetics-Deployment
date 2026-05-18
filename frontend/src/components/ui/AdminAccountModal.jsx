import { useEffect, useState } from "react";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import {
    createAdminAccount,
    updateAdminAccount,
    changeAdminPassword,
} from "../../features/adminAccounts/adminAccountService";

const EMPTY_FORM = { name: "", email: "", password: "", isActive: true};
const EMPTY_PASSWORD_FORM = { newPassword: "", confirmPassword: ""};

function AdminAccountModal({ open, mode, account, onClose, onSubmit}) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [passwordForm, setPasswordForm] = useState(EMPTY_PASSWORD_FORM);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(mode === "edit" && account){
            setForm({ name: account.name, email: account.email, password: "", isActive: account.isActive});
        } else {
            setForm(EMPTY_FORM);
        }

        setPasswordForm(EMPTY_PASSWORD_FORM);
        setErrors({});

    }, [open, mode, account]);

    const validate = () => {
        const err = {};
        if (mode !== "password"){
            if (!form.name.trim()) 
                err.name = "Vui lòng nhập họ tên";

            if (mode === "add" && !form.email.trim()) 
                err.email = "Vui lòng nhập email";

            if (mode === "add" && !form.password.trim()) 
                err.password = "Vui lòng nhập mật khẩu";

        } else {
            
            if (!passwordForm.newPassword.trim()) {
                err.newPassword = "Vui lòng nhập mật khẩu mới";
            } 
            
            else if (passwordForm.newPassword.trim().length < 6){
                err.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
            }

            else if(!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(passwordForm.newPassword.trim())){
                err.newPassword = "Mật khẩu phải chứa chữ và số";
            }

            if (passwordForm.newPassword.trim() !== passwordForm.confirmPassword.trim()) 
                err.confirmPassword = "Mật khẩu xác nhận không khớp";
        }
        return err;
    };

    const handleSubmit = async () => {
        const err = validate();
        if (Object.keys(err).length > 0){
            setErrors(err);
            return;
        }

        setLoading(true);
        try{
            if (mode === "add"){
                await createAdminAccount(form);
            } else if (mode === "edit") {

                await updateAdminAccount(account.userId, { 
                    name: form.name,
                    email: form.email,
                    isActive: form.isActive
                });
            } else if (mode === "password"){
                await changeAdminPassword(account.userId, {
                    newPassword: passwordForm.newPassword,
                    confirmPassword: passwordForm.confirmPassword,
                });
            }
            onSubmit(); // báo page load lại
        } catch (err){
            alert(err.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    const titles = {
        add: "Thêm tài khoản Admin",
        edit: "Sửa tài khoản Admin",
        password: `Đổi mật khẩu - ${account?.name ?? ""}`,
    };

    return (
        <Modal 
            open={open}
            title={titles[mode]}
            onClose={onClose}>  
            
            {mode !== "password" ? (
                <>
                    <Input
                        label="Họ tên"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        error={errors.name}
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        error={errors.email}
                        // disabled={mode === "edit"}
                        
                    />

                    {/* Thêm toggle isActive */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 8
                    }}>
                        <label>Trạng thái</label>
                        <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={(e) => setForm({...form, isActive: e.target.checked})}
                        />
                        <span>{form.isActive ? "Hoạt động" : "Đã khóa"}</span>
                            
                    </div>
                    {mode === "add" && (
                        <Input
                            label="Mật khẩu"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({...form, password: e.target.value})}
                            error={errors.password}
                        
                        />
                    )}
                    
                    
                </>
            ): (
                <>
                    <Input
                        label="Mật khẩu mới"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value})}
                        error={errors.newPassword}
                
                    />

                    <Input
                        label="Xác nhận mật khẩu mới"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value})}
                        error={errors.confirmPassword}
                    
                    />
                </>
            )}

            <div 
                style={{ 
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                    margin: 16
                }}
            >
                <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={loading}
                >
                    Hủy
                </Button>

                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Đang xử lý..." : "Xác nhận"}

                </Button>
            </div>

        </Modal>
    );
}

export default AdminAccountModal;