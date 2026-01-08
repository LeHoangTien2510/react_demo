import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, updateMyProfile } from '../api/profileService.js';

// 👇 1. Import cả 3 Sidebar
import Sidebar from './admin/Sidebar.jsx';      // Admin
import SideBarUser from './user/SideBarUser';   // User
import SideBarStaff from "./staff/SideBarStaff.jsx"; // Staff

import './UserProfile.css';

const UserProfile = () => {
    const navigate = useNavigate();

    // 👇 2. Logic kiểm tra quyền Admin (Ưu tiên cao nhất)
    const [isAdmin, setIsAdmin] = useState(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userObj = JSON.parse(userStr);
            return userObj.roles && userObj.roles.includes("ROLE_ADMIN");
        }
        return false;
    });

    // 👇 3. Logic kiểm tra quyền Staff (Thêm mới)
    const [isStaff, setIsStaff] = useState(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userObj = JSON.parse(userStr);
            // Chỉ set là Staff nếu có ROLE_STAFF
            return userObj.roles && userObj.roles.includes("ROLE_STAFF");
        }
        return false;
    });

    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '', fullName: '', email: '', phone: '', address: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate("/login"); return; }
        fetchProfileData();
    }, [navigate]);

    const fetchProfileData = async () => {
        try {
            const res = await getMyProfile();
            const data = res.data;
            setFormData({
                username: data.username,
                fullName: data.fullName || '',
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || ''
            });
            setCurrentUser(data);

            // 👇 4. Cập nhật lại quyền từ dữ liệu mới nhất server trả về
            if (data.roles) {
                // Kiểm tra Admin
                if (data.roles.includes("ROLE_ADMIN")) {
                    setIsAdmin(true);
                    setIsStaff(false); // Nếu là Admin thì ưu tiên Admin, bỏ qua Staff flag (tuỳ logic của bạn)
                }
                // Kiểm tra Staff
                else if (data.roles.includes("ROLE_STAFF")) {
                    setIsAdmin(false);
                    setIsStaff(true);
                }
                // User thường
                else {
                    setIsAdmin(false);
                    setIsStaff(false);
                }
            }

        } catch (error) { console.error(error); }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await updateMyProfile(formData);
            alert("✅ Cập nhật thành công!");
            setCurrentUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
            alert("❌ Lỗi cập nhật: " + (error.response?.data || "Vui lòng thử lại"));
        } finally { setLoading(false); }
    };

    const getAvatarChar = () => (currentUser?.fullName || currentUser?.username || 'U').charAt(0).toUpperCase();

    // 👇 5. Hàm helper để render Sidebar phù hợp
    const renderSidebar = () => {
        if (isAdmin) return <Sidebar />;
        if (isStaff) return <SideBarStaff />;
        return <SideBarUser />;
    };

    // 👇 6. Hàm helper để hiển thị Role text
    const getRoleText = () => {
        if (isAdmin) return "Quản trị viên hệ thống";
        if (isStaff) return "Nhân viên hệ thống";
        return "Thành viên thân thiết";
    };

    return (
        <div className="admin-layout">
            {/* Render Sidebar dựa trên logic ưu tiên: Admin -> Staff -> User */}
            {renderSidebar()}

            <main className="main-content">
                <header className="top-header">
                    <div className="header-title"><h2>Cài Đặt Tài Khoản</h2></div>
                    <div className="user-profile">
                        <span style={{fontWeight:'bold'}}>Hi, {currentUser?.fullName || 'User'}</span>
                        <div className="avatar">{getAvatarChar()}</div>
                    </div>
                </header>

                <div className="content-body">
                    <div className="profile-wrapper">
                        <div className="profile-header-section">
                            <div className="profile-avatar-large">{getAvatarChar()}</div>
                            <h3>{currentUser?.fullName || currentUser?.username}</h3>
                            <p>
                                {/* Hiển thị text role tương ứng */}
                                {getRoleText()}
                            </p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Tên đăng nhập</label>
                                    <input type="text" value={formData.username} disabled className="form-control" style={{background: '#f1f5f9'}} />
                                </div>
                                <div className="form-group">
                                    <label>Họ và tên</label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Số điện thoại</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="form-control" />
                                </div>
                                <div className="form-group full-width">
                                    <label>Địa chỉ</label>
                                    <textarea name="address" value={formData.address} onChange={handleInputChange} className="form-control" rows="3"></textarea>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={fetchProfileData}>Hoàn tác</button>
                                <button type="submit" className="btn-save" disabled={loading}>
                                    {loading ? "Đang lưu..." : "💾 Lưu Thay Đổi"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;