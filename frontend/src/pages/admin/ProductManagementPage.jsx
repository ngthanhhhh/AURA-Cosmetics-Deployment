import { useEffect, useState } from "react";
import productApi from "../../features/products/productApi";

function ProductManagementPage() {
  // danh sách sản phẩm
  const [products, setProducts] = useState([]);

  // loading
  const [loading, setLoading] = useState(false);

  // form thêm sản phẩm
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    description: "",
    categoryId: "",
    status: "ACTIVE",
  });

  // load products
  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await productApi.getAdminProducts({
        page: 0,
        size: 20,
      });

      setProducts(data.content || []);
    } catch (error) {
      console.error("Load products error:", error);

      alert("Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // thêm sản phẩm
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await productApi.createProduct({
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        categoryId: Number(newProduct.categoryId),
      });

      alert("Thêm sản phẩm thành công");

      // reset form
      setNewProduct({
        name: "",
        price: "",
        stock: "",
        image: "",
        description: "",
        categoryId: "",
        status: "ACTIVE",
      });

      loadProducts();
    } catch (error) {
      console.error("Create product error:", error);

      alert("Không thể thêm sản phẩm");
    }
  };

  // xóa sản phẩm
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa sản phẩm này?"
    );

    if (!confirmDelete) return;

    try {
      await productApi.deleteProduct(id);

      alert("Xóa sản phẩm thành công");

      loadProducts();
    } catch (error) {
      console.error("Delete product error:", error);

      alert("Không thể xóa sản phẩm");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Quản lý sản phẩm</h1>

      {/* FORM THÊM */}
      <form
        onSubmit={handleCreate}
        style={{
          marginTop: "24px",
          marginBottom: "32px",
        }}
      >
        <h2>Thêm sản phẩm</h2>

        <input
          type="text"
          placeholder="Tên sản phẩm"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              name: e.target.value,
            })
          }
          required
        />

        <input
          type="number"
          placeholder="Giá"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              price: e.target.value,
            })
          }
          required
        />

        <input
          type="number"
          placeholder="Số lượng"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              stock: e.target.value,
            })
          }
          required
        />

        <input
          type="number"
          placeholder="Category ID"
          value={newProduct.categoryId}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              categoryId: e.target.value,
            })
          }
          required
        />

        <input
          type="text"
          placeholder="Ảnh"
          value={newProduct.image}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              image: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Mô tả"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              description: e.target.value,
            })
          }
        />

        <select
          value={newProduct.status}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              status: e.target.value,
            })
          }
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <button type="submit">Thêm</button>
      </form>

      {/* DANH SÁCH SẢN PHẨM */}
      <h2>Danh sách sản phẩm</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : products.length === 0 ? (
        <p>Không có sản phẩm nào</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Kho</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td>{product.productId}</td>

                <td>{product.name}</td>

                <td>
                  {Number(product.price).toLocaleString("vi-VN")} đ
                </td>

                <td>{product.stock}</td>

                <td>{product.categoryName}</td>

                <td>{product.status}</td>

                <td>
                  <button
                    onClick={() =>
                      handleDelete(product.productId)
                    }
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductManagementPage;