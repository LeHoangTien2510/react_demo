import React, { useState, useEffect } from 'react';
import CategoryService from '../../api/CategoryService';
import Sidebar from './Sidebar';
import './CategoryManagement.css';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ id: '', categoryName: '' });
    const [isEditing, setIsEditing] = useState(false);

    // --- 1. Load dữ liệu ---
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getAll();
                setCategories(response.data);
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    const reloadData = async () => {
        try {
            const response = await CategoryService.getAll();
            setCategories(response.data);
        } catch (error) {
            console.error("Lỗi tải lại:", error);
        }
    };

    // --- Xử lý Form ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSave = async () => {
        if (!form.categoryName?.trim()) {
            alert("Vui lòng nhập tên danh mục!");
            return;
        }

        try {
            const payload = { categoryName: form.categoryName };

            if (isEditing) {
                await CategoryService.update(form.id, payload);
                alert("✅ Cập nhật thành công!");
            } else {
                await CategoryService.create(payload);
                alert("✅ Thêm mới thành công!");
            }

            resetForm();
            reloadData();
        } catch (error) {
            console.error("Lỗi lưu:", error);
            alert("❌ Có lỗi xảy ra. Kiểm tra Console để xem chi tiết.");
        }
    };

    const resetForm = () => {
        setForm({ id: '', categoryName: '' });
        setIsEditing(false);
    };

    // --- SỬA LỖI Ở ĐÂY: Xử lý nút Edit ---
    const handleEditClick = (category) => {
        setForm({
            id: category.id,
            // Thêm || '' để nếu database trả về null thì form vẫn hiểu là rỗng, không bị lỗi
            categoryName: category.categoryName || category.name || ''
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
            try {
                await CategoryService.delete(id);
                alert("🗑️ Đã xóa thành công!");
                reloadData();
            } catch (error) {
                console.error("Lỗi xóa:", error);
                alert("❌ Không thể xóa.");
            }
        }
    };

    return (
        <div className="admin-layout">
            <Sidebar />

            <main className="admin-content">
                <h2 className="page-title">📂 Quản Lý Danh Mục</h2>

                <div className="form-section">
                    <div className="input-group">
                        <label>Tên Danh Mục:</label>
                        <input
                            type="text"
                            name="categoryName"
                            className="form-control"
                            placeholder="Nhập tên danh mục..."
                            // Thêm || '' để input không bao giờ bị undefined
                            value={form.categoryName || ''}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button className="btn btn-primary" onClick={handleSave}>
                        {isEditing ? "Cập Nhật" : "Thêm Mới"}
                    </button>

                    {isEditing && (
                        <button className="btn btn-cancel" onClick={resetForm}>Hủy</button>
                    )}
                </div>

                <div className="table-container">
                    <table className="category-table">
                        <thead>
                        <tr>
                            <th style={{width: '10%'}}>ID</th>
                            <th>Tên Danh Mục</th>
                            <th style={{width: '20%'}}>Hành Động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <tr key={cat.id}>
                                    <td>#{cat.id}</td>
                                    {/* Hiển thị tên, nếu null thì hiện chữ (Trống) cho dễ nhìn */}
                                    <td>{cat.categoryName || cat.name || <i style={{color:'#ccc'}}>(Trống)</i>}</td>
                                    <td className="action-buttons">
                                        <button className="btn-edit" onClick={() => handleEditClick(cat)}>
                                            ✏️ Sửa
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDeleteClick(cat.id)}>
                                            🗑️ Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{textAlign: 'center', color: '#94a3b8'}}>
                                    Chưa có danh mục nào.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default CategoryManagement;