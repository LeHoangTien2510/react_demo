import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, createProduct, updateProduct, deleteProduct, getImageUrl, getAllCategories } from '../../api/productService.js';
// 👇 1. Import Sidebar
import Sidebar from './Sidebar.jsx';
import './ProductManager.css';

const ProductManager = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '', price: '', quantity: '', description: '', status: 'AVAILABLE', categoryId: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // --- FETCH DATA ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token) {
            navigate("/login"); return;
        }
        if (userStr) setCurrentUser(JSON.parse(userStr));

        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                getAllProducts(), getAllCategories()
            ]);
            setProducts(productsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        }
    };

    // --- HANDLERS ---

    const handleAddNewClick = () => {
        resetForm();
        setEditingId(null);
        setShowModal(true);
    };

    const handleEditClick = (product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            description: product.description || '',
            status: product.status,
            categoryId: product.category ? product.category.id : (categories[0]?.id || '')
        });
        setPreviewImage(getImageUrl(product.image));
        setSelectedFile(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let finalCatId = formData.categoryId;
            if (!finalCatId && categories.length > 0) finalCatId = categories[0].id;

            const productPayload = {
                name: formData.name,
                price: parseFloat(formData.price) || 0,
                quantity: parseInt(formData.quantity) || 0,
                description: formData.description,
                status: formData.status,
                category: { id: parseInt(finalCatId) }
            };

            if (editingId) {
                await updateProduct(editingId, productPayload, selectedFile);
                alert("✅ Cập nhật thành công!");
            } else {
                await createProduct(productPayload, selectedFile);
                alert("✅ Thêm mới thành công!");
            }

            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error("Lỗi:", error);
            alert("❌ Có lỗi xảy ra!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa?")) {
            try {
                await deleteProduct(id);
                fetchData();
            } catch (error) {
                alert("❌ Không thể xóa!");
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '', price: '', quantity: '', description: '', status: 'AVAILABLE',
            categoryId: categories.length > 0 ? categories[0].id : ''
        });
        setSelectedFile(null);
        setPreviewImage(null);
        setEditingId(null);
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        if (file) setPreviewImage(URL.createObjectURL(file));
    };

    // (Đã xóa handleLogout vì Sidebar lo rồi)

    return (
        <div className="admin-layout">
            {/* 👇 2. Thay thế toàn bộ <aside> cũ bằng 1 dòng này */}
            <Sidebar />

            <main className="main-content">
                <header className="top-header">
                    <div className="header-title"><h2>Quản Lý Sản Phẩm</h2></div>
                    <div
                        className="user-profile"
                        onClick={() => navigate("/profile")}
                        style={{cursor: 'pointer'}}
                        title="Xem hồ sơ cá nhân"
                    >
                        <span style={{fontWeight:'bold'}}>Hi, {currentUser?.fullName || 'Admin'}</span>
                        <div className="avatar">A</div>
                    </div>
                </header>

                <div className="content-body">
                    <div className="toolbar">
                        <input className="search-box" type="text" placeholder="🔍 Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                        <button className="btn-primary" onClick={handleAddNewClick}>+ Thêm Sản Phẩm</button>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                            <tr><th>Sản Phẩm</th><th>Giá</th><th>Tồn Kho</th><th>Danh Mục</th><th>Hành Động</th></tr>
                            </thead>
                            <tbody>
                            {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <div className="product-info">
                                            <img src={getImageUrl(p.image)} className="product-img" alt="" onError={(e)=>e.target.src='https://via.placeholder.com/50'}/>
                                            <div><strong>{p.name}</strong><br/><small>#{p.id}</small></div>
                                        </div>
                                    </td>
                                    <td>{p.price?.toLocaleString()} ₫</td>
                                    <td>{p.quantity}</td>
                                    <td>{p.category ? (p.category.categoryName || p.category.name) : '-'}</td>
                                    <td>
                                        <button className="action-btn btn-edit" onClick={() => handleEditClick(p)} title="Sửa" style={{marginRight:'5px'}}>✏️</button>
                                        <button className="action-btn btn-delete" onClick={() => handleDelete(p.id)} title="Xóa">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* --- MODAL GIỮ NGUYÊN --- */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingId ? "✏️ Cập Nhật Sản Phẩm" : "✨ Thêm Sản Phẩm"}</h3>
                            <button onClick={() => setShowModal(false)} className="close-btn">×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group image-upload">
                                <label htmlFor="file-input" className="image-preview-box">
                                    {previewImage ? <img src={previewImage} alt="Preview" /> : <span>📂 Chọn ảnh</span>}
                                </label>
                                <input id="file-input" type="file" onChange={handleFileChange} hidden />
                            </div>
                            <input type="text" name="name" placeholder="Tên sản phẩm" value={formData.name} onChange={handleInputChange} required className="form-control mb-2"/>
                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                                <input type="number" name="price" placeholder="Giá" value={formData.price} onChange={handleInputChange} required className="form-control"/>
                                <input type="number" name="quantity" placeholder="Số lượng" value={formData.quantity} onChange={handleInputChange} required className="form-control"/>
                            </div>

                            <label>Danh mục:</label>
                            <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="form-control mb-2" required>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.categoryName || cat.name}</option>
                                ))}
                            </select>

                            <select name="status" value={formData.status} onChange={handleInputChange} className="form-control mb-2">
                                <option value="AVAILABLE">✅ Đang bán</option>
                                <option value="OUT_OF_STOCK">⛔ Hết hàng</option>
                            </select>
                            <textarea name="description" placeholder="Mô tả..." value={formData.description} onChange={handleInputChange} rows="3" className="form-control"></textarea>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Hủy</button>
                                <button type="submit" className="btn-primary">
                                    {editingId ? "Lưu Thay Đổi" : "Tạo Mới"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManager;