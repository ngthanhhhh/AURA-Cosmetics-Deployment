import Header from "../common/Header";
import Footer from "../common/Footer";

function CustomerLayout({ children }) {
    return (
        <div className="customer-layout">
            <Header />
                <main className="customer-main">{children}</main>
            <Footer />
        </div>
    );
}

export default CustomerLayout;