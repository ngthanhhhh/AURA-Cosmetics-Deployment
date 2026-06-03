import { createContext, useState } from "react";

/**
 * Context quản lý trạng thái đăng nhập ở frontend.
 *
 * Khi ứng dụng khởi động, user được khôi phục từ localStorage
 * để tránh mất trạng thái đăng nhập sau khi reload trang.
 *
 * login() chỉ cập nhật state trong React Context.
 * Việc lưu token/user vào localStorage được xử lý trong authService.
 */
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user") || "null");
    });

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}