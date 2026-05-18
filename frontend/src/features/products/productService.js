import {
  getAllProductsApi,
  getProductByIdApi,
  getAdminProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  uploadProductImageApi,
} from "./productApi";

export const productService = {
  async getAllProducts(params) {
    const res = await getAllProductsApi(params);
    return res.data;
  },

  async getProductById(id) {
    const res = await getProductByIdApi(id);
    return res.data;
  },

  async getAdminProducts(params) {
    const res = await getAdminProductsApi(params);
    return res.data;
  },

  async createProduct(data) {
    const res = await createProductApi(data);
    return res.data;
  },

  async updateProduct(id, data) {
    const res = await updateProductApi(id, data);
    return res.data;
  },

  async deleteProduct(id) {
    const res = await deleteProductApi(id);
    return res.data;
  },
  async uploadProductImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadProductImageApi(formData);
    return res.data;
  },
};