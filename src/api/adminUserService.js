import axiosClient from './axiosClient';

const URL_USER = '/admin/users';
const URL_CATEGORY = '/categories';
// Lấy danh sách user
export const getAllUsers = () => {
    return axiosClient.get(URL_USER);
};

// Tạo user mới (Role gửi qua param như Controller yêu cầu)
export const createUser = (userData, roleName) => {
    return axiosClient.post(`${URL_USER}?role=${roleName}`, userData);
};

// Cập nhật user
export const updateUser = (id, userData, roleName) => {
    // Nếu có chọn role mới thì gửi param, không thì thôi
    const url = roleName ? `${URL_USER}/${id}?role=${roleName}` : `${URL_USER}/${id}`;
    return axiosClient.put(url, userData);
};

// Xóa user
export const deleteUser = (id) => {
    return axiosClient.delete(`${URL_USER}/${id}`);
};

// Tạo Staff (kèm categoryIds)
export const createStaff = (staffData) => {
    // staffData phải khớp với StaffRequest DTO (username, password, categoryIds: [], ...)
    return axiosClient.post(`${URL_USER}/staff`, staffData);
};

// Update Staff (kèm categoryIds)
export const updateStaff = (id, staffData) => {
    return axiosClient.put(`${URL_USER}/staff/${id}`, staffData);
};

// Lấy danh sách Category để hiển thị checkbox
export const getAllCategories = () => {
    return axiosClient.get(URL_CATEGORY);
};