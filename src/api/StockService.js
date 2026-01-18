import axiosClient from './axiosClient';

class StockService {
    getAllProducts() {
        return axiosClient.get('/products'); // Hoặc API lấy list product của bạn
    }

    // API Nhập kho
    importStock(stockRequest) {
        return axiosClient.post('/admin/stocks/import', stockRequest);
    }

    // 👇 MỚI: API Xuất kho
    exportStock(stockRequest) {
        return axiosClient.post('/admin/stocks/export', stockRequest);
    }

    getStockHistory() {
        return axiosClient.get('/admin/stocks/history');
    }
}
export default new StockService();