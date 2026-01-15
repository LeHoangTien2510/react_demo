import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBarStaff from './SideBarStaff'; // 👇 Import Sidebar Staff
import { getStaffOrders, updateStaffOrderStatus } from '../../api/StaffOrderService'; // Import Service mới
import './StaffOrderManagement.css'; // Import CSS mới

const StaffOrderManagement = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [staffId, setStaffId] = useState(null);

    // 1. Lấy thông tin Staff hiện tại từ LocalStorage
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                // Kiểm tra xem có phải role STAFF không
                if (userObj.roles && userObj.roles.includes("ROLE_STAFF")) {
                    setStaffId(userObj.id); // Lưu ID để gọi API
                } else {
                    alert("Bạn không có quyền truy cập trang này!");
                    navigate("/login");
                }
            } catch (e) {
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    // 2. Gọi API lấy danh sách đơn khi có staffId
    useEffect(() => {
        if (staffId) {
            fetchOrders();
        }
    }, [staffId]);

    const fetchOrders = async () => {
        try {
            // 👇 Truyền staffId vào để Backend lọc theo Category
            const res = await getStaffOrders(staffId);

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
        if (!window.confirm(`Xác nhận đổi trạng thái thành "${translateStatus(newStatus)}"?`)) return;

        try {
            // 👇 Truyền cả staffId để Backend check quyền lần nữa
            await updateStaffOrderStatus(orderId, staffId, newStatus);
            alert("✅ Cập nhật thành công!");

            // Cập nhật lại UI ngay lập tức
            setOrders(prevOrders => prevOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (error) {
            const msg = error.response?.data || "Lỗi cập nhật (Có thể do đơn hàng không thuộc Category quản lý)";
            alert("❌ " + msg);
        }
    };

    // --- CÁC HÀM HELPER (GIỐNG ADMIN) ---
    const renderProductList = (items) => {
        if (!items || items.length === 0) return <span style={{color:'#999'}}>Trống</span>;
        const MAX_DISPLAY = 2;
        const displayItems = items.slice(0, MAX_DISPLAY);
        const remainingCount = items.length - MAX_DISPLAY;
        const fullTooltip = items.map(i => `- ${i.product?.name} (x${i.quantity})`).join('\n');

        return (
            <div className="product-list-wrapper" title={fullTooltip}>
                {displayItems.map((item, index) => (
                    <div key={index} className="product-item-row">
                        <span className="bullet">•</span>
                        <span className="p-name">{item.product?.name}</span>
                        <span className="p-qty">x{item.quantity}</span>
                    </div>
                ))}
                {remainingCount > 0 && (
                    <div className="more-items-badge">+{remainingCount} món khác...</div>
                )}
            </div>
        );
    };

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

    return (
        <div className="admin-layout"> {/* Dùng chung layout class */}

            {/* 👇 Gắn SidebarStaff vào đây */}
            <SideBarStaff />

            <main className="main-content">
                <div className="staff-order-container">
                    <h2 className="page-title">📦 Đơn Hàng Cần Xử Lý (Theo Category)</h2>

                    {loading ? (
                        <div className="loading-spinner">Đang tải dữ liệu...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="order-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Khách Hàng</th>
                                    <th>Sản Phẩm</th>
                                    <th>Thời Gian</th>
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
                                                    <span className="user-name">{order.user?.fullName || "Khách"}</span>
                                                    <small className="user-email">{order.user?.phone}</small>
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
                                                    <option value="SHIPPING">Giao hàng</option>
                                                    <option value="COMPLETED">Hoàn thành</option>
                                                    <option value="CANCELLED">Hủy đơn</option>
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                            {orders.length === 0 && (
                                <div className="no-data">
                                    <p>Hiện không có đơn hàng nào thuộc danh mục bạn quản lý.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StaffOrderManagement;