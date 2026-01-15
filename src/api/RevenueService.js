import axiosClient from './axiosClient';

const END_POINT = '/admin/reports/revenue';

// 1. Doanh thu theo ngày (Mặc định)
export const getRevenueByDay = () => {
    return axiosClient.get(`${END_POINT}/day`);
};

// 2. Doanh thu theo tháng (Mặc định)
export const getRevenueByMonth = () => {
    return axiosClient.get(`${END_POINT}/month`);
};

// 3. Doanh thu theo ngày (Có lọc)
export const getRevenueByDayFilter = (from, to) => {
    return axiosClient.get(`${END_POINT}/day/filter`, {
        params: { from, to }
    });
};

// 4. Doanh thu theo tháng (Có lọc)
export const getRevenueByMonthFilter = (from, to) => {
    return axiosClient.get(`${END_POINT}/month/filter`, {
        params: { from, to }
    });
};