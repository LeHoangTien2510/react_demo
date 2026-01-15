import axiosClient from './axiosClient';

const END_POINT = '/staff/orders';

// 1. Lấy danh sách đơn hàng thuộc phạm vi quản lý của Staff
// Backend yêu cầu tham số ?staffId=...
export const getStaffOrders = (staffId) => {
    return axiosClient.get(END_POINT, {
        params: { staffId }
    });
};

// 2. Xem chi tiết đơn hàng (có check quyền Category bên backend)
export const getStaffOrderDetail = (orderId, staffId) => {
    return axiosClient.get(`${END_POINT}/${orderId}`, {
        params: { staffId }
    });
};

// 3. Cập nhật trạng thái đơn hàng
// Backend: PUT /api/staff/orders/{orderId}/status?staffId=...&status=...
export const updateStaffOrderStatus = (orderId, staffId, status) => {
    return axiosClient.put(`${END_POINT}/${orderId}/status`, null, {
        params: {
            staffId,
            status
        }
    });
};