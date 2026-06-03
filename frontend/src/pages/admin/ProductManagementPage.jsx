import { useEffect, useRef, useState } from "react";
import { productService } from "../../features/products/productService";
import "./ProductManagementPage.css";
import { categoryService } from "../../features/categories/categoryService";

/**
 * Trang quản lý sản phẩm dành cho quản trị viên.
 *
 * Chức năng chính:
 * - Hiển thị danh sách sản phẩm.
 * - Tìm kiếm, lọc và sắp xếp sản phẩm.
 * - Thêm sản phẩm mới.
 * - Cập nhật thông tin sản phẩm.
 * - Xóa sản phẩm.
 * - Upload và xem trước ảnh sản phẩm.
 */
function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [categoryIdFilter, setCategoryIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("productId");
  const [direction, setDirection] = useState("asc");

  const [uploadingImage, setUploadingImage] = useState(false);

  /**
   * Ref trỏ tới form thêm/cập nhật sản phẩm.
   *
   * Dùng để tự động cuộn lên form khi admin bấm nút "Sửa".
   */
  const formRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    categoryId: "",
    status: "ACTIVE",
  });

  /**
   * ID của sản phẩm đang được chỉnh sửa.
   *
   * Nếu editingId là null thì form đang ở chế độ thêm mới.
   * Nếu editingId có giá trị thì form đang ở chế độ cập nhật.
   */
  const [editingId, setEditingId] = useState(null);

  /**
   * Tải danh sách sản phẩm dành cho admin.
   *
   * Dữ liệu được tải theo các điều kiện:
   * - từ khóa tìm kiếm
   * - danh mục
   * - trạng thái
   * - trang hiện tại
   * - tiêu chí sắp xếp
   * - hướng sắp xếp
   */
  const loadProducts = async () => {
    try {
      const data = await productService.getAdminProducts({
        keyword: keyword || undefined,
        categoryId: categoryIdFilter || undefined,
        status: statusFilter || undefined,
        page,
        size: 10,
        sortBy,
        direction,
      });

      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Load products error:", error);
      alert("Không thể tải sản phẩm");
    }
  };

  /**
   * Tải danh sách danh mục.
   *
   * Danh mục được dùng cho:
   * - bộ lọc sản phẩm
   * - form thêm/cập nhật sản phẩm
   */
  const loadCategories = async () => {
    try {
      const data = await categoryService.getAdminCategories({
        page: 0,
        size: 100,
        sortBy: "categoryId",
        direction: "asc",
      });

      setCategories(data.content || []);
    } catch (error) {
      console.error("Load categories error:", error);
    }
  };

  /**
   * Load sản phẩm và danh mục khi trang được mở,
   * hoặc khi thay đổi trang / tiêu chí sắp xếp / hướng sắp xếp.
   */
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [page, sortBy, direction]);

  /**
   * Xử lý submit form tìm kiếm/lọc sản phẩm.
   *
   * Khi lọc lại dữ liệu, trang sẽ được đưa về trang đầu tiên.
   */
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadProducts();
  };

  /**
   * Reset bộ lọc về trạng thái mặc định.
   */
  const handleResetFilter = () => {
    setKeyword("");
    setCategoryIdFilter("");
    setStatusFilter("");
    setSortBy("productId");
    setDirection("asc");
    setPage(0);
  };

  /**
   * Khi toàn bộ điều kiện lọc trở về mặc định,
   * hệ thống tự động tải lại danh sách sản phẩm ban đầu.
   */
  useEffect(() => {
    if (
      keyword === "" &&
      categoryIdFilter === "" &&
      statusFilter === "" &&
      sortBy === "productId" &&
      direction === "asc"
    ) {
      loadProducts();
    }
  }, [keyword, categoryIdFilter, statusFilter, sortBy, direction]);

  /**
   * Cập nhật state form khi admin nhập dữ liệu.
   */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Reset form về trạng thái thêm mới.
   */
  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      stock: "",
      description: "",
      image: "",
      categoryId: "",
      status: "ACTIVE",
    });

    setEditingId(null);
  };

  /**
   * Upload ảnh sản phẩm lên server.
   *
   * Sau khi upload thành công, backend trả về imageUrl.
   * imageUrl này sẽ được gán vào field image của form.
   */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploadingImage(true);

      const data = await productService.uploadProductImage(file);

      setForm((prev) => ({
        ...prev,
        image: data.imageUrl,
      }));

      alert("Upload ảnh thành công");
    } catch (error) {
      console.error("Upload image error:", error);
      alert(error.response?.data?.message || "Upload ảnh thất bại");
    } finally {
      setUploadingImage(false);
    }
  };

  /**
   * Xử lý thêm mới hoặc cập nhật sản phẩm.
   *
   * Nếu editingId có giá trị thì gọi API cập nhật.
   * Nếu editingId là null thì gọi API thêm mới.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId),
    };

    try {
      if (editingId) {
        await productService.updateProduct(editingId, data);
        alert("Cập nhật sản phẩm thành công");
      } else {
        await productService.createProduct(data);
        alert("Thêm sản phẩm thành công");
      }

      resetForm();
      loadProducts();
    } catch (error) {
      console.error("Save product error:", error);
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  /**
   * Đưa thông tin sản phẩm được chọn lên form để chỉnh sửa.
   *
   * Có xử lý tìm lại categoryId theo categoryName trong trường hợp
   * dữ liệu product trả về không có sẵn categoryId.
   *
   * Sau khi set dữ liệu form, trang sẽ tự động cuộn lên khu vực form
   * để admin dễ dàng cập nhật sản phẩm.
   */
  const handleEdit = (product) => {
    setEditingId(product.productId);

    const currentCategory = categories.find(
      (category) => category.name === product.categoryName
    );

    setForm({
      name: product.name || "",
      price: product.price || "",
      stock: product.stock || "",
      description: product.description || "",
      image: product.image || "",
      categoryId: product.categoryId || currentCategory?.categoryId || "",
      status: product.status || "ACTIVE",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /**
   * Xóa sản phẩm theo ID.
   *
   * Trước khi xóa sẽ hiển thị confirm để tránh admin thao tác nhầm.
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      await productService.deleteProduct(id);
      alert("Xóa sản phẩm thành công");
      loadProducts();
    } catch (error) {
      console.error("Delete product error:", error);
      alert(error.response?.data?.message || "Không thể xóa sản phẩm");
    }
  };

  // const API_BASE_URL =
  //   import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

  // const getImageUrl = (imagePath) => {
  //   if (!imagePath) return "";

  //   if (imagePath.startsWith("http")) return imagePath;

  //   const serverUrl = API_BASE_URL.replace("/api/v1", "");

  //   if (imagePath.startsWith("/uploads/")) {
  //     return `${serverUrl}${imagePath}`;
  //   }

  //   if (imagePath.startsWith("uploads/")) {
  //     return `${serverUrl}/${imagePath}`;
  //   }

  //   return `${serverUrl}/uploads/products/${imagePath}`;
  // };

  return (
    <div className="product-management">
      <h2 className="product-management__title">Quản lý sản phẩm</h2>

      {/* Khu vực tìm kiếm, lọc danh mục, lọc trạng thái và sắp xếp sản phẩm */}
      <form className="product-management__filter" onSubmit={handleFilterSubmit}>
        <h3>Lọc / tìm kiếm sản phẩm</h3>

        <div className="product-management__filter-row">
          <input
            placeholder="Tìm theo tên sản phẩm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <select
            value={categoryIdFilter}
            onChange={(e) => setCategoryIdFilter(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>

            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="productId">Sắp xếp theo ID</option>
            <option value="name">Sắp xếp theo tên</option>
            <option value="price">Sắp xếp theo giá</option>
            <option value="stock">Sắp xếp theo tồn kho</option>
          </select>

          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
          >
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>

          <button type="submit">Áp dụng</button>

          <button type="button" onClick={handleResetFilter}>
            Reset
          </button>
        </div>
      </form>

      {/* Form nhập thông tin sản phẩm, dùng chung cho chức năng thêm mới và cập nhật */}
      <form
        ref={formRef}
        className="product-management__form"
        onSubmit={handleSubmit}
      >
        <h3>{editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</h3>

        <div className="product-management__form-row">
          <input
            name="name"
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="price"
            placeholder="Giá"
            value={form.price}
            onChange={handleChange}
          />

          <input
            name="stock"
            placeholder="Số lượng"
            value={form.stock}
            onChange={handleChange}
          />

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
          >
            <option value="">Chọn danh mục</option>

            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>

          <label className="product-management__file-label">
            Chọn ảnh
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>

          <input
            name="image"
            placeholder="Đường dẫn ảnh"
            value={form.image}
            readOnly
          />

          {uploadingImage && (
            <span className="product-management__uploading">
              Đang upload ảnh...
            </span>
          )}

          {form.image && (
            <img
              src={form.image}
              alt="Preview"
              className="product-management__preview"
            />
          )}

          <input
            name="description"
            placeholder="Mô tả"
            value={form.description}
            onChange={handleChange}
          />

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          <button type="submit" disabled={uploadingImage}>
            {editingId ? "Cập nhật" : "Thêm"}
          </button>

          
          <button type="button" onClick={resetForm}>
            Hủy
          </button>
          
        </div>
      </form>

      {/* Bảng danh sách sản phẩm và các thao tác quản trị trên từng sản phẩm */}
      <table className="product-management__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
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

              <td>
                <img
                  className="product-management__table-image"
                  src={product.image || "/favicon.svg"}
                  alt={product.name}
                />
              </td>

              <td>{product.name}</td>
              <td>{Number(product.price).toLocaleString("vi-VN")} đ</td>
              <td>{product.stock}</td>
              <td>{product.categoryName}</td>
              <td>{product.status}</td>

              <td>
                <button onClick={() => handleEdit(product)}>Sửa</button>

                <button onClick={() => handleDelete(product.productId)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang danh sách sản phẩm */}
      <div className="product-management__pagination">
        <button disabled={page <= 0} onClick={() => setPage(page - 1)}>
          Trang trước
        </button>

        <span>
          Trang {page + 1} / {totalPages || 1}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default ProductManagementPage;