import axiosClient from './axiosClient';

const URL_USER = '/admin/users';

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