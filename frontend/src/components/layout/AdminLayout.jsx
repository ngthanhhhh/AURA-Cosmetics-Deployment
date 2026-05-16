import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "./AdminLayout.css";

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