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
    return (
        <div className="admin-layout">
            <AdminSidebar/>

            <main className="admin-main">
                <AdminHeader />
                
                <section className="admin-content">
                    {children}  
                </section>
            </main>
        </div>
    );
}

export default AdminLayout;