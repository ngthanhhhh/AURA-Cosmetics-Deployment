import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { logoutUser } from "../../features/auth/authService";
import { useAuth } from "../../hooks/useAuth";

const LogoutButton = () =>{
    const navigate  = useNavigate();
    const {user, setUser} = useAuth();

    const handleLogout = () => {
        //Xóa dữ liệu đăng nhập
        const isAdmin = user?.role == "ROLE_ADMIN";
        logoutUser();
        setUser(null);

        //Chuyển về login
        navigate(isAdmin ? "/admin/login" : "/auth/login");

    };

    return (
        <Button onClick={handleLogout}>
            Đăng xuất
        </Button>
    );
};

export default LogoutButton;