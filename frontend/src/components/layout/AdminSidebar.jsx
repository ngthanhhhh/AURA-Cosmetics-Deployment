import { NavLink } from 'react-router-dom';
import LogoutButton from '../common/LogoutButton';

/**
 * Sidebar điều hướng trong trang quản trị.
 *
 * Chứa các liên kết tới những module admin chính
 * và nút đăng xuất tài khoản quản trị.
 */
function AdminSidebar({ collapsed = false }) {
    return (
        <aside className={`admin-sidebar ${collapsed ? "admin-sidebar--collapsed" : ""}`}>
            <div className='admin-sidebar__brand'>
                <div className='admin-sidebar__logo'>AURA</div>
            </div>

            <nav className='admin-sidebar__nav'>
                <NavLink to="/admin" end>
                    Dashboard
                </NavLink>

                <NavLink to="/admin/products" end>
                    Sản phẩm
                </NavLink>

                <NavLink to="/admin/categories" end>
                    Danh mục
                </NavLink>

                <NavLink to="/admin/orders" end>
                    Đơn hàng
                </NavLink>

                <NavLink to="/admin/reviews" end>
                    Đánh giá
                </NavLink>

                <NavLink to="/admin/reviews/report">
                    Báo cáo hài lòng
                </NavLink>

                <NavLink to="/admin/customers" end>
                    Quản lý khách hàng
                </NavLink>

                <NavLink to="/admin/accounts" end>
                    Quản trị viên
                </NavLink>

                <NavLink to="/admin/revenue" end>
                    Thống kê doanh thu
                </NavLink>
            </nav>

            <div className='admin-sidebar__footer'>
                <LogoutButton redirectPath='/admin/login' />
            </div>
        </aside>
    );
}

export default AdminSidebar;