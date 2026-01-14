import axiosClient from "./axiosClient";

const BASE_URL = "/staff/products"; // Prefix trong Controller là /api/staff/products

const StaffProductService = {
    // 1. Lấy danh sách sản phẩm (có lọc theo quyền Staff luôn)
    // Gửi kèm categoryId, minPrice... nếu cần filter nâng cao
    getAll: (params = {}) => {
        return axiosClient.get(`${BASE_URL}/filter`, { params });
    },

    // 2. Cập nhật sản phẩm (Staff chỉ được sửa một số trường)
    // Backend sẽ check quyền category
    update: (id, data) => {
        return axiosClient.put(`${BASE_URL}/${id}`, data);
    }
};

export default StaffProductService;