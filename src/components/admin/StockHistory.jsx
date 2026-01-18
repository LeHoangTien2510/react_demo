import React, { useEffect, useState } from 'react';
import StockService from '../../api/StockService'; // Sửa lại đường dẫn nếu cần
import Sidebar from "./Sidebar.jsx"; // Import Sidebar ADMIN
import './StockHistory.css';      // Import CSS vừa tạo

const StockHistory = () => {
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load dữ liệu khi vào trang
    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await StockService.getStockHistory();
            setHistoryList(res.data || []);
        } catch (error) {
            console.error("Lỗi lấy lịch sử:", error);
        } finally {
            setLoading(false);
        }
    };

    // Format ngày giờ: DD/MM/YYYY HH:mm
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    return (
        <div className="admin-page-wrapper">
            {/* 1. Sidebar cố định bên trái */}
            <Sidebar />

            {/* 2. Nội dung chính (đã được đẩy sang phải nhờ CSS) */}
            <div className="admin-history-container">

                <div className="history-header">
                    <h2 className="history-title">📜 Lịch sử Nhập / Xuất Kho</h2>
                    <p style={{margin: '5px 0 0', color: '#888'}}>
                        Theo dõi toàn bộ biến động số lượng sản phẩm
                    </p>
                </div>

                <div className="table-wrapper">
                    {loading ? (
                        <div style={{padding: '20px', textAlign: 'center'}}>Đang tải dữ liệu...</div>
                    ) : (
                        <table className="history-table">
                            <thead>
                            <tr>
                                <th>Thời gian</th>
                                <th>Sản phẩm</th>
                                <th>Loại giao dịch</th>
                                <th>Số lượng</th>
                                <th>Ghi chú</th>
                            </tr>
                            </thead>
                            <tbody>
                            {historyList.length > 0 ? (
                                historyList.map((item) => (
                                    <tr key={item.id}>
                                        <td className="date-text">
                                            {formatDate(item.createdAt)}
                                        </td>
                                        <td className="product-text">
                                            {/* Backend trả về object Product hoặc null nếu bị xóa */}
                                            {item.product ? item.product.name : 'Sản phẩm đã xóa'}
                                        </td>
                                        <td>
                                                <span className={`badge-type ${item.type === 'IMPORT' ? 'badge-import' : 'badge-export'}`}>
                                                    {item.type === 'IMPORT' ? 'NHẬP KHO' : 'XUẤT KHO'}
                                                </span>
                                        </td>
                                        <td className={item.type === 'IMPORT' ? 'qty-positive' : 'qty-negative'}>
                                            {item.type === 'IMPORT' ? '+' : '-'}{item.quantity}
                                        </td>
                                        <td style={{fontStyle: 'italic', color: '#666'}}>
                                            {item.note || "--"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center', padding: '30px'}}>
                                        Chưa có dữ liệu lịch sử nào.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>
    );
};

export default StockHistory;