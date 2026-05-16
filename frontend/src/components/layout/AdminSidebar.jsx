import { NavLink } from 'react-router-dom';
import LogoutButton from '../common/LogoutButton';

function AdminSidebar() {
    return (
        <aside className='admin-sidebar'>
            <div className='admin-sidebar__brand'>
                <div className='admin-sidebar__logo'>AURA</div>

                {/* <div>
                    <h2>Cửa hàng mỹ phẩm</h2>
                    <p>Admin Panel</p>
                </div> */}
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

                <NavLink to="/admin/customers" end>
                    Quản lý khách hàng
                </NavLink>

                <NavLink to="/admin/accounts" end>
                    Quản trị viên
                </NavLink>

                <NavLink to="/admin/revenue" end>
                    Thống kê doanh thu
                </NavLink>

                <div className='admin-sidebar__logout'>
                    <LogoutButton redirectPath='/admin/login' />
                </div>
                
            </nav>
        </aside>
    );
}

export default AdminSidebar;