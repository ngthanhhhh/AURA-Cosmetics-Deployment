import axiosClient from "../../api/axiosClient";

export const registerApi = (data) => {
    return axiosClient.post("/auth/register", data);
};