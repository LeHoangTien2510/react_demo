// src/pages/user/UserOrderHistory.jsx
import React, { useEffect, useState } from 'react';
import SideBarUser from "./SideBarUser.jsx";
import { getMyOrders, cancelMyOrder } from '../../api/userOrderService';
import './UserOrderHistory.css';

const UserOrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load dữ liệu khi vào trang
    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        try {
            const response = await getMyOrders();
            // Sắp xếp đơn mới nhất lên đầu (theo ID giảm dần)
            const sortedOrders = response.data.sort((a, b) => b.id - a.id);
            setOrders(sortedOrders);
        } catch (error) {
            console.error("Lỗi tải lịch sử đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
            return;
        }

        try {
            await cancelMyOrder(orderId);
            alert("✅ Hủy đơn hàng thành công!");

            // Cập nhật lại UI ngay lập tức mà không cần load lại trang
            setOrders(prevOrders => prevOrders.map(order =>
                order.id === orderId ? { ...order, status: 'CANCELLED' } : order
            ));
        } catch (error) {
            console.error(error);
            const msg = error.response?.data || "Có lỗi xảy ra khi hủy đơn";
            alert("❌ " + msg);
        }
    };

    // --- Helper Format ---
    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const translateStatus = (status) => {
        const map = {
            'PENDING': 'Chờ xử lý',
            'COMPLETED': 'Giao thành công',
            'CANCELLED': 'Đã hủy',
            'SHIPPING': 'Đang giao hàng'
        };
        return map[status] || status;
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'COMPLETED': return 'badge-success';
            case 'CANCELLED': return 'badge-danger';
            case 'SHIPPING': return 'badge-info';
            default: return 'badge-warning'; // Pending
        }
    };

    return (
        <div className="user-layout">
            <SideBarUser />

            <main className="user-main-content">
                <div className="history-container">
                    <h2 className="page-title">📦 Lịch Sử Đơn Hàng Của Tôi</h2>

                    {loading ? (
                        <div className="loading-text">Đang tải dữ liệu...</div>
                    ) : orders.length === 0 ? (
                        <div className="empty-state">Bạn chưa có đơn hàng nào.</div>
                    ) : (
                        <div className="order-list">
                            {orders.map(order => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <div className="header-left">
                                            <span className="order-id">Đơn hàng #{order.id}</span>
                                            <span className="order-date">{formatDate(order.createdAt)}</span>
                                        </div>
                                        <div className="header-right">
                                            <span className={`status-badge ${getStatusClass(order.status)}`}>
                                                {translateStatus(order.status)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="order-body">
                                        {/* Danh sách sản phẩm trong đơn */}
                                        {order.items && order.items.map((item, index) => (
                                            <div key={index} className="item-row">
                                                <div className="item-info">
                                                    <span className="item-name">
                                                        {item.product?.name || "Sản phẩm đã bị xóa"}
                                                    </span>
                                                    <span className="item-quantity">x{item.quantity}</span>
                                                </div>
                                                <div className="item-price">
                                                    {formatCurrency(item.price)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-footer">
                                        <div className="total-price">
                                            Tổng tiền: <span>{formatCurrency(order.totalPrice)}</span>
                                        </div>

                                        {/* Chỉ hiện nút Hủy khi trạng thái là PENDING (Theo logic Backend) */}
                                        {order.status === 'PENDING' && (
                                            <button
                                                className="btn-cancel"
                                                onClick={() => handleCancelOrder(order.id)}
                                            >
                                                Hủy Đơn
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserOrderHistory;