import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import {
    getAllUsers,
    createUser,
    updateUser,
    createStaff,
    updateStaff,
    deleteUser
} from '../../api/adminUserService';
import './UserManagement.css';
import CategoryService from '../../api/CategoryService';

const StaffManagement = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    // Data form
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
        phone: '',
        address: '', // ✅ Đã có
        role: 'ROLE_STAFF',
        categoryIds: []
    });

    // 1️⃣ Load data ban đầu
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [userRes, cateRes] = await Promise.all([
                getAllUsers(),
                CategoryService.getAll()
            ]);
            setUsers(userRes.data || userRes);
            setCategories(cateRes.data || cateRes);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2️⃣ Xử lý input form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 3️⃣ Xử lý chọn Category (Checkbox)
    const handleCategoryToggle = (cateId) => {
        setFormData(prev => {
            const currentIds = prev.categoryIds;
            if (currentIds.includes(cateId)) {
                return { ...prev, categoryIds: currentIds.filter(id => id !== cateId) };
            } else {
                return { ...prev, categoryIds: [...currentIds, cateId] };
            }
        });
    };

    // 4️⃣ Mở Modal
    const openModal = (user = null) => {
        if (user) {
            // EDIT MODE
            setIsEditMode(true);
            setCurrentUserId(user.id);

            const roleName = user.roles && user.roles.length > 0 ? Array.from(user.roles)[0] : 'ROLE_STAFF';
            const currentCateIds = user.managedCategories
                ? user.managedCategories.map(c => c.id)
                : [];

            setFormData({
                username: user.username,
                password: '',
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                address: user.address || '', // ✅ Load địa chỉ từ user cũ
                role: roleName,
                categoryIds: currentCateIds
            });
        } else {
            // CREATE MODE
            setIsEditMode(false);
            setCurrentUserId(null);
            setFormData({
                username: '',
                password: '',
                fullName: '',
                email: '',
                phone: '',
                address: '', // ✅ Reset địa chỉ
                role: 'ROLE_STAFF',
                categoryIds: []
            });
        }
        setIsModalOpen(true);
    };

    // 5️⃣ SUBMIT FORM
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.role === 'ROLE_STAFF') {
                const staffPayload = { ...formData, categoryIds: formData.categoryIds };
                if (isEditMode) {
                    await updateStaff(currentUserId, staffPayload);
                } else {
                    await createStaff(staffPayload);
                }
            } else {
                const { categoryIds, ...normalPayload } = formData;
                if (isEditMode) {
                    await updateUser(currentUserId, normalPayload, formData.role);
                } else {
                    await createUser(normalPayload, formData.role);
                }
            }
            alert("✅ Thành công!");
            setIsModalOpen(false);
            fetchInitialData();
        } catch (error) {
            console.error("Lỗi submit:", error);
            alert("❌ Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
        }
    };

    // 6️⃣ DELETE
    const handleDelete = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa nhân viên này?")) {
            try {
                await deleteUser(id);
                fetchInitialData();
            } catch (error) {
                alert("❌ Xóa thất bại");
            }
        }
    };

    return (
        <div className="admin-layout">
            <Sidebar />
            <main className="main-content">
                <header style={{ marginBottom: '20px' }}>
                    <h2>🧑‍💼 Quản Lý Nhân Viên (Staff)</h2>
                </header>

                <div className="toolbar">
                    <input
                        className="search-box"
                        placeholder="🔍 Tìm theo tên hoặc email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <button className="btn-primary" onClick={() => openModal()}>
                        + Thêm Nhân Viên
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Họ tên</th>
                            <th>Vai trò</th>
                            <th>Quản lý danh mục</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users
                            .filter(u =>
                                u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (u.fullName && u.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
                            )
                            .map(u => (
                                <tr key={u.id}>
                                    <td>
                                        <strong>{u.username}</strong><br/>
                                        <small style={{color:'#888'}}>{u.email}</small>
                                    </td>
                                    <td>{u.fullName}</td>
                                    <td>
                                        {u.roles && Array.from(u.roles).map((r, idx) => (
                                            <span key={idx} className={`role-badge role-${r.replace('ROLE_', '')}`}>
                                                {r.replace('ROLE_', '')}
                                            </span>
                                        ))}
                                    </td>
                                    <td>
                                        {u.managedCategories && u.managedCategories.length > 0 ? (
                                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                {u.managedCategories.map(c => (
                                                    <span key={c.id} className="cate-badge" style={{
                                                        background: '#e2e8f0', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85em'
                                                    }}>
                                                        {c.categoryName}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted">-</span>
                                        )}
                                    </td>
                                    <td>
                                        <button className="action-btn" title="Sửa" onClick={() => openModal(u)}>✏️</button>
                                        <button className="action-btn" title="Xóa" onClick={() => handleDelete(u.id)} style={{ color: 'red' }}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* --- MODAL FORM --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{isEditMode ? 'Cập nhật Staff' : 'Thêm Staff Mới'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="close-btn">×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <label><strong>Vai trò:</strong></label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="form-control"
                                style={{backgroundColor: '#f0f8ff'}}
                            >
                                <option value="ROLE_STAFF">STAFF (Nhân viên)</option>
                                <option value="ROLE_ADMIN">ADMIN</option>
                                <option value="ROLE_USER">USER</option>
                            </select>

                            <input name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} className="form-control" required />
                            <input type="password" name="password" placeholder={isEditMode ? "Mật khẩu (để trống nếu không đổi)" : "Mật khẩu"} value={formData.password} onChange={handleInputChange} className="form-control" />
                            <input name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleInputChange} className="form-control" />
                            <input name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="form-control" />
                            <input name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleInputChange} className="form-control" />

                            {/* ✅ ĐÃ THÊM INPUT ADDRESS Ở ĐÂY */}
                            <input name="address" placeholder="Địa chỉ" value={formData.address} onChange={handleInputChange} className="form-control" />

                            {formData.role === 'ROLE_STAFF' && (
                                <div style={{ marginTop: '15px', background: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                        Phân quyền quản lý danh mục:
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                                        {categories.map(cate => (
                                            <label key={cate.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.categoryIds.includes(cate.id)}
                                                    onChange={() => handleCategoryToggle(cate.id)}
                                                    style={{ marginRight: '8px' }}
                                                />
                                                {cate.categoryName}
                                            </label>
                                        ))}
                                    </div>
                                    {categories.length === 0 && <p className="text-warning">Chưa có danh mục nào.</p>}
                                </div>
                            )}

                            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{ marginRight: '10px' }}>Hủy</button>
                                <button type="submit" className="btn-primary">Lưu lại</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffManagement;
