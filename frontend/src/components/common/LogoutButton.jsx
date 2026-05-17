import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { logoutUser } from "../../features/auth/authService";

/**
 * Xử lý đăng xuất customer.
 *
 * Sau khi đăng xuất:
 * - xóa thông tin đăng nhập
 * - điều hướng về trang login hoặc homepage
 */
const LogoutButton = ({redirectPath = "/auth/login"}) =>{
    const navigate  = useNavigate();

    const handleLogout = () => {
        //Xóa dữ liệu đăng nhập
        logoutUser();

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