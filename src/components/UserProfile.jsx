import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, updateMyProfile } from '../api/profileService.js'; // Check lại đường dẫn api nhé
import Sidebar from './Sidebar';

// 👇 CHỈ IMPORT ĐÚNG 1 FILE CSS NÀY
import './UserProfile.css';

const UserProfile = () => {
    const navigate = useNavigate();
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
            const res = await updateMyProfile(formData); // Gửi formData thẳng nếu khớp field
            alert("✅ Cập nhật thành công!");
            setCurrentUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
            alert("❌ Lỗi cập nhật!");
        } finally { setLoading(false); }
    };

    const getAvatarChar = () => (currentUser?.fullName || currentUser?.username || 'U').charAt(0).toUpperCase();

    return (
        <div className="admin-layout">
            <Sidebar />
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
                            <p>Quản lý thông tin cá nhân</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Tên đăng nhập</label>
                                    <input type="text" value={formData.username} disabled className="form-control" />
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
                                <button type="button" className="btn-secondary" onClick={fetchProfileData}>Hủy</button>
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