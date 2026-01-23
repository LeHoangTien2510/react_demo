import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBarStaff from './SideBarStaff';
import StaffProductService from '../../api/StaffProductService';
import { getImageUrl } from '../../api/productService';
import StaffProductDetailModal from '../StaffProductDetailModal'; // 👈 Import Modal Mới
import './StaffProductManagement.css';

const StaffProductManagement = () => {
    const navigate = useNavigate();

    // State dữ liệu
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    // State Modal Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // State Modal Xem Chi Tiết (Mới)
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Form Data Edit
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        quantity: 0,
        description: '',
        status: 'AVAILABLE'
    });

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
        fetchStaffProducts();
    }, []);

    const fetchStaffProducts = async () => {
        try {
            setLoading(true);
            const res = await StaffProductService.getAll();
            setProducts(res.data || res);
        } catch (error) {
            console.error("Lỗi tải sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    // Mở Modal Sửa
    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            description: product.description || '',
            status: product.status || 'AVAILABLE'
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editingProduct) return;

        try {
            const payload = {
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                status: formData.status
            };
            await StaffProductService.update(editingProduct.id, payload);
            alert("✅ Cập nhật thành công!");
            setIsModalOpen(false);
            fetchStaffProducts();
        } catch (error) {
            console.error("Lỗi update:", error);
            const msg = error.response?.data?.message || error.response?.data || "Có lỗi xảy ra";
            alert("❌ " + msg);
        }
    };

    return (
        <div className="staff-product-layout">
            <SideBarStaff />
            <div className="staff-main-content">
                <div className="staff-header">
                    <h2>📦 Quản Lý Sản Phẩm</h2>
                    <div style={{color: '#666'}}>
                        Xin chào, <strong>{currentUser?.fullName || 'Nhân viên'}</strong>
                    </div>
                </div>

                <div className="staff-toolbar">
                    <input
                        className="search-input"
                        placeholder="🔍 Tìm kiếm theo tên sản phẩm..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="staff-table-container">
                    <table className="staff-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Sản phẩm</th>
                            <th>Giá bán</th>
                            <th>Tồn kho</th>
                            <th>Danh mục</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{textAlign:'center', padding:'20px'}}>Đang tải dữ liệu...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="7" style={{textAlign:'center', padding:'20px'}}>Bạn chưa được phân công quản lý sản phẩm nào.</td></tr>
                        ) : (
                            products
                                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(p => (
                                    <tr
                                        key={p.id}
                                        onClick={() => setSelectedProduct(p)} /* 👈 Click dòng để mở chi tiết */
                                        style={{cursor: 'pointer'}}
                                        className="row-hover"
                                    >
                                        <td>#{p.id}</td>
                                        <td>
                                            <div className="product-cell">
                                                <img
                                                    src={getImageUrl(p.image)}
                                                    className="product-thumb"
                                                    alt=""
                                                    onError={(e) => e.target.src = '/assets/no-image.jpg'}
                                                />
                                                <span className="product-name">{p.name}</span>
                                            </div>
                                        </td>
                                        <td>{p.price?.toLocaleString()} ₫</td>
                                        <td>{p.quantity}</td>
                                        <td>
                                            <span className="badge-cat">
                                                {p.category ? p.category.categoryName : '-'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge-status ${p.status === 'AVAILABLE' ? 'status-available' : 'status-out'}`}>
                                                {p.status === 'AVAILABLE' ? 'Đang bán' : 'Hết hàng'}
                                            </span>
                                        </td>
                                        <td>
                                            {/* 👈 stopPropagation quan trọng */}
                                            <button
                                                className="btn-edit-staff"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(p);
                                                }}
                                            >
                                                ✏️ Sửa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Edit (Giữ nguyên) */}
            {isModalOpen && (
                <div className="staff-modal-overlay">
                    <div className="staff-modal">
                        <div className="modal-header">
                            <h3>✏️ Cập nhật sản phẩm</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer'}}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {/* ... Form input fields giữ nguyên ... */}
                            <div className="form-group" style={{marginBottom: '15px'}}>
                                <label>Tên sản phẩm:</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} className="form-control" required />
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Giá bán:</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="form-group">
                                    <label>Số lượng:</label>
                                    <input type="number" name="quantity" value={formData.quantity} className="form-control" disabled />
                                </div>
                            </div>
                            <div className="form-group" style={{marginTop: '15px'}}>
                                <label>Trạng thái:</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="form-control">
                                    <option value="AVAILABLE">✅ Đang bán</option>
                                    <option value="OUT_OF_STOCK">⛔ Hết hàng</option>
                                    <option value="HIDDEN">👁️ Ẩn sản phẩm</option>
                                </select>
                            </div>
                            <div className="form-group" style={{marginTop: '15px'}}>
                                <label>Mô tả:</label>
                                <textarea name="description" rows="4" value={formData.description} onChange={handleInputChange} className="form-control"></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                                <button type="submit" className="btn-primary">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 👇 Render Modal Chi Tiết Mới */}
            {selectedProduct && (
                <StaffProductDetailModal
                    isOpen={!!selectedProduct}
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default StaffProductManagement;