// src/api/userService.js
import axiosClient from './axiosClient';

export const getMyProfile = () => {
    return axiosClient.get('/users/me'); // Tự động có token
};

export const updateMyProfile = (userData) => {
    return axiosClient.put('/users/me', userData);
};