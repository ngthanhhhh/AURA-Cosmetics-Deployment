import axiosClient from "../../api/axiosClient";

export const getAllProductsApi = (params) => {
  return axiosClient.get("/products", { params });
};

export const getProductByIdApi = (id) => {
  return axiosClient.get(`/products/${id}`);
};

export const getAdminProductsApi = (params) => {
  return axiosClient.get("/admin/products", { params });
};

export const createProductApi = (data) => {
  return axiosClient.post("/admin/products", data);
};

export const updateProductApi = (id, data) => {
  return axiosClient.put(`/admin/products/${id}`, data);
};

export const deleteProductApi = (id) => {
  return axiosClient.delete(`/admin/products/${id}`);
};