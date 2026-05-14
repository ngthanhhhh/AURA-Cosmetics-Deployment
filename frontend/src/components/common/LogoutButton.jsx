import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { logoutUser } from "../../features/auth/authService";
import { useAuth } from "../../hooks/useAuth";

const LogoutButton = ({redirectPath = "/auth/login"}) =>{
    const navigate  = useNavigate();
    const {setUser} = useAuth();

    const handleLogout = () => {
        //Xóa dữ liệu đăng nhập
        
        logoutUser();
        setUser(null);

        //Chuyển về login
        navigate(redirectPath);

    };

    return (
        <Button onClick={handleLogout}>
            Đăng xuất
        </Button>
    );
};

export default LogoutButton;