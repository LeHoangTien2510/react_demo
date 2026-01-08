import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';          // Import Sidebar Admin
import SideBarStaff from '../components/staff/SideBarStaff'; // Import Sidebar Staff (hoặc đường dẫn đúng của bạn)
import './AdminLayout.css'; // File css layout chung (để chia cột sidebar và content)

const AdminLayout = () => {
    // 1. Lấy role từ localStorage (giả sử bạn lưu key là "role" hoặc lấy từ object user)
    // Lưu ý: Tùy vào cách bạn lưu lúc login mà sửa dòng dưới cho đúng
    const role = localStorage.getItem("role");

    // Nếu chưa đăng nhập -> đá về login
    if (!role) {
        return <Navigate to="/login" />;
    }

    // 2. Logic chọn Sidebar
    const renderSidebar = () => {
        if (role .includes("ROLE_ADMIN")) {
            return <Sidebar />;
        } else if (role.includes("ROLE_STAFF")) {
            return <SideBarStaff />;
        } else {
            // Trường hợp role lạ thì cho về trang chủ hoặc hiện Staff mặc định
            return <SideBarStaff />;
        }
    };

    return (
        <div className="admin-container">
            {/* Hiển thị Sidebar tương ứng */}
            {renderSidebar()}

            {/* Nội dung trang con sẽ hiển thị ở đây */}
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;