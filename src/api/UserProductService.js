// src/api/UserProductService.js
import axiosClient from "./axiosClient";

const UserProductService = {
    // Lấy danh sách sản phẩm
    getAllProducts: () => {
        return axiosClient.get('/products');
    },

    // Lấy danh sách danh mục
    getAllCategories: () => {
        return axiosClient.get('/categories');
    },

    // Xử lý thanh toán
    checkout: (payload) => {
        return axiosClient.post('/user/orders/checkout', payload);
    },

    // --- MỚI: Lấy chi tiết sản phẩm kèm comment ---
    getProductDetail: (id) => {
        return axiosClient.get(`/products/${id}`);
    },

    // --- MỚI: Gửi comment ---
    addComment: (commentData) => {
        // commentData format: { userId, productId, content }
        return axiosClient.post('/products/comments', commentData);
    },
};

export default UserProductService;