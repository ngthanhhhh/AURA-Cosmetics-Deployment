
function DashboardPage() {

    const summaryCards = [
        {
            title: "Tổng doanh thu",
            value: "128.500.000đ",
            desc: "+12% so với tháng trước",
        },
        {
            title: "Tổng đơn hàng",
            value: "1.248",
            desc: "86 đơn hôm nay",
        },
        {
            title: "Khách hàng",
            value: "3.420",
            desc: "124 khách hàng mới",
        },
        {
            title: "Đánh giá trung bình",
            value: "4.8/5",
            desc: "980 đánh giá",
        },
        
    ];

    const recentOrders = [
        {
            id: "DH001",
            customer: "Nguyễn Thảo",
            total: "850.000đ",
            status: "Đang xử lý",
        },
        {
            id: "DH002",
            customer: "Minh Anh",
            total: "1.850.000đ",
            status: "Hoàn thành",
        },
        {
            id: "DH003",
            customer: "Hoàng Linh",
            total: "420.000đ",
            status: "Chờ xác nhận",
        },
    ];

    return (
        <div className="dashboard-page">
            <div className="dashboard-page__header">
                <div>
                    <h2>Dashboard tổng quan</h2>
                    <p>
                        Theo dõi nhanh hoạt động kinh doanh của cửa hàng

                    </p>
                </div>
            </div>

            <div className="dashboard-summary">
                {summaryCards.map((item) => (
                    <div className="dashboard-card" key={item.title}>
                        <p>{item.title}</p>
                        <h3>{item.value}</h3>
                        <span>{item.desc}</span>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <section className="dashboard-panel dashboard-panel--large">
                    <div className="dashboard-panel__header">
                        <h3>Doanh thu gần đây</h3>
                        <span>7 ngày qua</span>
                    </div>

                    <div className="dashboard-chart-placeholder">
                        Biểu đồ doanh thu
                    </div>
                </section>

                <section className="dashboard-panel">
                    <div className="dashboard-panel__header">
                        <h3>Đơn hàng gần đây</h3>
                    </div>

                    <div className="recent-orders">
                        {recentOrders.map((order) => (
                            <div className="recent-order" key={order.id}>
                                <div>
                                    <strong>{order.id}</strong>
                                    <p>{order.customer}</p>
                                </div>

                                <div>
                                    <strong>{order.total}</strong>
                                    <span>{order.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            
            
        </div>

    );
}

export default DashboardPage;