import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { logoutUser } from "../../features/auth/authService";

const LogoutButton = () =>{
    const navigate  = useNavigate();

    const handleLogout = () => {
        //Xóa dữ liệu đăng nhập
        logoutUser();

        //Chuyển về login
        navigate("/login");
    };

    return (
        <Button onClick={handleLogout}>
            Đăng xuất
        </Button>
    );
};

export default LogoutButton;