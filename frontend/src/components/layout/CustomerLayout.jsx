import Header from "./Header/Header";
import Footer from "../common/Footer";
import { Outlet } from "react-router-dom";
import "./CustomerLayout.css";


function CustomerLayout() {
    return (
        <>
            <div className="customer-layout-container">
                <Header />
                <hr />
                <main className="main-content">
                    <Outlet />
                </main>
                <Footer />
            </div>
            
        </>
    );
}

export default CustomerLayout;