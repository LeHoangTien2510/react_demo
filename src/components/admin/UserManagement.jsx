import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../api/adminUserService';
import './UserManagement.css';

const UserManagement = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form data
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
        phone: '',
        address: '', // ✅ Thêm field address
        role: 'USER'
    });

    // --- FETCH DATA ---
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res.data);
        } catch (error) {
            console.error("Lỗi tải users:", error);
        }
    };

    // --- HANDLERS ---
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openCreateModal = () => {
        setEditingUser(null);
        // ✅ Reset cả address
        setFormData({ username: '', password: '', fullName: '', email: '', phone: '', address: '', role: 'USER' });
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        let currentRole = 'USER';
        if (user.roles && user.roles.length > 0) {
            currentRole = user.roles[0];
        }

        setFormData({
            username: user.username,
            password: '',
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            address: user.address || '', // ✅ Load address từ user cũ
            role: currentRole
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Payload body (RegisterRequest)
            const payload = {
                username: formData.username,
                password: formData.password,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address // ✅ Gửi kèm address xuống backend
            };

            if (editingUser) {
                // UPDATE
                await updateUser(editingUser.id, payload, formData.role);
                alert("✅ Cập nhật thành công!");
            } else {
                // CREATE
                await createUser(payload, formData.role);
                alert("✅ Tạo tài khoản thành công!");
            }

            setShowModal(false);
            fetchUsers();
        } catch (error) {
            console.error(error);
            alert("❌ Có lỗi xảy ra! Kiểm tra lại thông tin.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa user này?")) {
            try {
                await deleteUser(id);
                fetchUsers();
            } catch (error) {
                alert("❌ Không thể xóa user này!");
            }
        }
    };

    return (
        <div className="admin-layout">
            <Sidebar />
            <main className="main-content">
                <header style={{marginBottom: '20px'}}>
                    <h2>👥 Quản Lý Người Dùng</h2>
                </header>

                <div className="toolbar">
                    <input
                        className="search-box"
                        placeholder="🔍 Tìm theo tên hoặc email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <button className="btn-primary" onClick={openCreateModal}>+ Tạo Tài Khoản</button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Họ Tên</th>
                            <th>Quyền (Role)</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.filter(u =>
                            (u.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
                        ).map(user => (
                            <tr key={user.id}>
                                <td>#{user.id}</td>
                                <td>
                                    <strong>{user.username}</strong><br/>
                                    <small style={{color:'#888'}}>{user.email}</small>
                                </td>
                                <td>{user.fullName}</td>
                                <td>
                                    {user.roles && user.roles.length > 0 ? (
                                        user.roles.map((r, index) => (
                                            <span key={index} className={`role-badge role-${r.replace('ROLE_', '')}`}>
                                                {r.replace('ROLE_', '')}
                                            </span>
                                        ))
                                    ) : (
                                        <span style={{color: '#999', fontSize: '12px'}}>Chưa cấp quyền</span>
                                    )}
                                </td>
                                <td>
                                        <span style={{color: user.status === 'ACTIVE' ? 'green' : 'red'}}>
                                            {user.status || 'ACTIVE'}
                                        </span>
                                </td>
                                <td>
                                    <button className="action-btn" title="Sửa" onClick={() => openEditModal(user)}>✏️</button>
                                    <button className="action-btn" title="Xóa" onClick={() => handleDelete(user.id)} style={{color:'red'}}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* --- MODAL FORM --- */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingUser ? "Cập nhật User" : "Tạo Tài Khoản Mới"}</h3>
                            <button onClick={() => setShowModal(false)} className="close-btn">×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <label><strong>Phân Quyền:</strong></label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="form-control"
                                style={{backgroundColor: '#f0f8ff', borderColor: '#667eea'}}
                            >
                                <option value="ROLE_USER">USER (Khách hàng)</option>
                                <option value="ROLE_STAFF">STAFF (Nhân viên)</option>
                                <option value="ROLE_ADMIN">ADMIN (Quản trị viên)</option>
                            </select>

                            <input name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} disabled={!!editingUser} className="form-control" required />

                            <input
                                type="password"
                                name="password"
                                placeholder={editingUser ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu"}
                                value={formData.password}
                                onChange={handleInputChange}
                                className="form-control"
                                required={!editingUser}
                            />

                            <input name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleInputChange} className="form-control" />
                            <input name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="form-control" />
                            <input name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleInputChange} className="form-control" />

                            {/* ✅ ĐÃ THÊM INPUT ADDRESS Ở ĐÂY */}
                            <input name="address" placeholder="Địa chỉ" value={formData.address} onChange={handleInputChange} className="form-control" />

                            <div style={{textAlign: 'right', marginTop: '10px'}}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{marginRight:'10px'}}>Hủy</button>
                                <button type="submit" className="btn-primary">Lưu Lại</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;