import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import "./SearchBox.css";

function SearchBox() {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedKeyword = keyword.trim();

        if (trimmedKeyword) {
            navigate(`/products?keyword=${encodeURIComponent(trimmedKeyword)}`);
        } else {
            navigate("/products");
        }
    };

    return (
        <form className="search-box" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />

            <button type="submit">
                <Search size={18} />
            </button>
        </form>
    );
}

export default SearchBox;