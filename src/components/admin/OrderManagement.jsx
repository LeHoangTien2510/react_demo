import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import để đá về login nếu không có quyền
import { getAllOrders, updateOrderStatus } from '../../api/adminOrderService';
// Import cả 2 Sidebar
import Sidebar from './Sidebar';
import SideBarStaff from '../staff/SideBarStaff';

import './OrderManagement.css';

const OrderManagement = () => {
    const navigate = useNavigate();

    // 👇 1. Logic kiểm tra quyền kỹ hơn (Check cả Admin và Staff)
    const [currentRole, setCurrentRole] = useState(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                const roles = userObj.roles || [];

                // Ưu tiên check ADMIN trước
                if (roles.includes("ROLE_ADMIN")) return "ADMIN";

                // Nếu không phải Admin, check tiếp STAFF
                if (roles.includes("ROLE_STAFF")) return "STAFF";

                return "USER"; // Hoặc null
            } catch (e) {
                return null;
            }
        }
        return null;
    });

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const renderProductList = (items) => {
        if (!items || items.length === 0) return <span style={{color:'#999'}}>Không có sản phẩm</span>;

        // Cấu hình: Chỉ hiện tối đa 2 món
        const MAX_DISPLAY = 2;
        const displayItems = items.slice(0, MAX_DISPLAY); // Cắt lấy 2 món đầu
        const remainingCount = items.length - MAX_DISPLAY; // Tính số lượng còn lại

        // Tạo chuỗi text để hiển thị khi rê chuột vào (Tooltip)
        const fullTooltip = items.map(i => `- ${i.product?.name} (x${i.quantity})`).join('\n');

        return (
            <div className="product-list-wrapper" title={fullTooltip}>
                {displayItems.map((item, index) => (
                    <div key={index} className="product-item-row">
                        <span className="bullet">•</span>
                        <span className="p-name">{item.product?.name || "Unknown"}</span>
                        <span className="p-qty">x{item.quantity}</span>
                    </div>
                ))}

                {/* Nếu còn dư sản phẩm thì hiện dòng này */}
                {remainingCount > 0 && (
                    <div className="more-items-badge">
                        +{remainingCount} sản phẩm khác...
                    </div>
                )}
            </div>
        );
    };
    // 👇 2. Effect phụ: Nếu không phải Admin hay Staff thì đá về trang khác
    useEffect(() => {
        if (currentRole !== "ADMIN" && currentRole !== "STAFF") {
            // Nếu lỡ user thường truy cập vào link này -> đá về trang chủ hoặc login
            // navigate("/login");
            // Hoặc chỉ đơn giản là không hiển thị gì (để loading false)
        }
    }, [currentRole, navigate]);

    // Load danh sách đơn hàng
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await getAllOrders();
            // Sắp xếp đơn mới nhất lên đầu
            const sortedOrders = res.data.sort((a, b) => b.id - a.id);
            setOrders(sortedOrders);
        } catch (error) {
            console.error("Lỗi tải đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        if (!window.confirm(`Bạn có chắc muốn đổi trạng thái thành "${translateStatus(newStatus)}"?`)) return;

        try {
            await updateOrderStatus(orderId, newStatus);
            alert("✅ Cập nhật trạng thái thành công!");
            setOrders(prevOrders => prevOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (error) {
            const msg = error.response?.data || "Lỗi cập nhật trạng thái";
            alert("❌ " + msg);
        }
    };

    // --- HELPER FUNCTIONS ---
    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'COMPLETED': return 'status-completed';
            case 'CANCELLED': return 'status-cancelled';
            case 'PENDING': return 'status-pending';
            case 'SHIPPING': return 'status-shipping';
            default: return 'status-default';
        }
    };

    const translateStatus = (status) => {
        const map = { 'PENDING': 'Chờ xử lý', 'COMPLETED': 'Hoàn thành', 'CANCELLED': 'Đã hủy', 'SHIPPING': 'Đang giao' };
        return map[status] || status;
    };

    // --- RENDER SIDEBAR LOGIC ---
    // Tách hàm render Sidebar cho gọn
    const renderSidebar = () => {
        if (currentRole === "ADMIN") return <Sidebar />;
        if (currentRole === "STAFF") return <SideBarStaff />;
        return null; // Không hiện sidebar nếu không có quyền
    };

    // Nếu không có quyền truy cập content (User thường), có thể return null hoặc trang 403 ở đây
    if (currentRole !== "ADMIN" && currentRole !== "STAFF") {
        return <div style={{padding: 50, textAlign: 'center'}}>🚫 Bạn không có quyền truy cập trang này.</div>;
    }

    return (
        <div className="admin-layout">
            {/* 👇 Hiển thị Sidebar đúng theo Role */}
            {renderSidebar()}

            <main className="main-content">
                <div className="order-management-container">
                    <h2 className="page-title">📦 Quản Lý Đơn Hàng</h2>

                    {loading ? (
                        <div className="loading-spinner">Đang tải dữ liệu...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="order-table">
                                <thead>
                                <tr>
                                    <th>Mã ĐH</th>
                                    <th>Khách Hàng</th>
                                    <th>Sản Phẩm</th>
                                    <th>Ngày Đặt</th>
                                    <th>Tổng Tiền</th>
                                    <th>Trạng Thái</th>
                                    <th>Hành Động</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders.map((order) => {
                                    const isFinalState = order.status === 'COMPLETED' || order.status === 'CANCELLED';
                                    return (
                                        <tr key={order.id}>
                                            <td>#{order.id}</td>
                                            <td>
                                                <div className="user-info">
                                                        <span className="user-name">
                                                            {order.user?.fullName || order.user?.username || "Khách lẻ"}
                                                        </span>
                                                    <small className="user-email">{order.user?.email}</small>
                                                </div>
                                            </td>
                                            <td style={{verticalAlign: 'top'}}>
                                                {renderProductList(order.items)}
                                            </td>
                                            <td>{formatDate(order.createdAt)}</td>
                                            <td className="price-cell">{formatCurrency(order.totalPrice)}</td>
                                            <td>
                                                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                                                        {translateStatus(order.status)}
                                                    </span>
                                            </td>
                                            <td>
                                                <select
                                                    className="status-select"
                                                    value={order.status}
                                                    disabled={isFinalState}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                >
                                                    <option value="PENDING" disabled={order.status !== 'PENDING'}>Chờ xử lý</option>
                                                    <option value="SHIPPING">Đang giao hàng</option>
                                                    <option value="COMPLETED">Hoàn thành</option>
                                                    <option value="CANCELLED">Hủy đơn</option>
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                            {orders.length === 0 && <p className="no-data">Chưa có đơn hàng nào.</p>}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default OrderManagement;