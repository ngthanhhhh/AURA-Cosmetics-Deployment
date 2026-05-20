import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "./AdminLayout.css";

/**
 * Layout chính cho khu vực quản trị.
 *
 * Bao gồm:
 * - Sidebar điều hướng
 * - Header quản trị
 * - Khu vực nội dung trang admin
 */
function AdminLayout({ children }) {

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth <= 1024){
                setSidebarCollapsed(true);
            }else{
                setSidebarCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarCollapsed((prev) => !prev);
    };

    return (
        <div className={`admin-layout ${sidebarCollapsed ? "admin-layout--collapsed" : ""}`}>
            <AdminSidebar collapsed={sidebarCollapsed}/>

            {!sidebarCollapsed && (
                <div    
                    className="admin-sidebar-overlay"
                    onClick={toggleSidebar}
                />
            )}

            <main className="admin-main">
                <AdminHeader onToggleSidebar={toggleSidebar} />
                
                <section className="admin-content">
                    {children}  
                </section>
            </main>
        </div>
    );
}

export default AdminLayout;