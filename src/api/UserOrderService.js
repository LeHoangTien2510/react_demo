// src/api/userOrderService.js
import axiosClient from './axiosClient'; // Đảm bảo đường dẫn đúng tới file cấu hình axios của bạn

// Lấy danh sách đơn hàng của người dùng đang đăng nhập
export const getMyOrders = () => {
    return axiosClient.get('/user/orders');
};

// Hủy đơn hàng (Chỉ gọi được khi đơn hàng ở trạng thái PENDING)
export const cancelMyOrder = (orderId) => {
    return axiosClient.put(`/user/orders/${orderId}/cancel`);
};