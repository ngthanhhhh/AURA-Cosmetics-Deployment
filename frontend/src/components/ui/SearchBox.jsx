import "./SearchBox.css";
import { Search } from "lucide-react";

/**
 * Thanh tìm kiếm sản phẩm dùng chung cho customer layout.
 */
function SearchBox() {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form className="search-box" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
            />

            <button type="submit">
                <Search size={18}/>
            </button>
        </form>
    );
}

export default SearchBox;