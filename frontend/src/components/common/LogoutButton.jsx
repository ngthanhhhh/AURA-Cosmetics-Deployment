import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { logoutUser } from "../../features/auth/authService";

/**
 * Button đăng xuất dùng chung cho customer và admin
 *
 * Sau khi đăng xuất:
 * - xóa thông tin đăng nhập
 * - điều hướng về trang được truyền qua redirectPath
 */
const LogoutButton = ({redirectPath = "/auth/login"}) =>{
    const navigate  = useNavigate();

    /**
     * Xử lý đăng xuất người dùng hiện tại.
     */
    const handleLogout = () => {
        logoutUser();
        navigate(redirectPath);
    };

    return (
        <Button onClick={handleLogout}>
            Đăng xuất
        </Button>
    );
};

export default LogoutButton;