/**
 * Header của khu vực quản trị.
 *
 * Hiển thị tiêu đề dashboard, ô tìm kiếm giao diện
 * và thông tin admin đang đăng nhập.
 */
function AdminHeader(){
    const user = JSON.parse(localStorage.getItem("user") || "null");

    return (
        <header className="admin-header">
            <div className="admin-header__title">
                <p>Dashboard quản trị cửa hàng mỹ phẩm</p>
            </div>

            <div className="admin-header__actions">
                <div className="admin-header__search">
                    <input 
                        type="text"
                        placeholder="Tìm kiếm..."/>
                </div>

                <div className="admin-profile-card">
                    <div className="admin-profile-card__avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>

                    <div>
                        <strong>{user?.name || "Admin"}</strong>
                        <span>{user?.role || "ADMIN"}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;