import axiosClient from './axiosClient'; // Đường dẫn trỏ tới file axios của bạn

// Lấy danh sách toàn bộ đơn hàng
export const getAllOrders = () => {
    return axiosClient.get('/admin/orders');
};

// Cập nhật trạng thái đơn hàng
// Backend dùng @RequestParam nên ta truyền vào config params
export const updateOrderStatus = (orderId, status) => {
    return axiosClient.put(`/admin/orders/${orderId}/status`, null, {
        params: { status: status }
    });
};

// (Tùy chọn) Lấy chi tiết đơn hàng nếu cần popup xem item
export const getOrderDetail = (orderId) => {
    return axiosClient.get(`/admin/orders/${orderId}`);
};