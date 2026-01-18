import React, { useEffect, useState } from 'react';
import StockService from "../../api/StockService.js";
import SideBarStaff from './SideBarStaff'; // 👈 IMPORT SIDEBAR
import './StockManagement.css';

const StockManagement = () => {
    const [products, setProducts] = useState([]);

    // --- Các state cho Modal ---
    const [selectedProduct, setSelectedProduct] = useState(null);
    // transactionType: 'IMPORT' (Nhập) hoặc 'EXPORT' (Xuất)
    const [transactionType, setTransactionType] = useState('IMPORT');
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await StockService.getAllProducts();
            // Đảm bảo data là mảng
            setProducts(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Lỗi tải sản phẩm:", error);
            setProducts([]); // Set mảng rỗng nếu lỗi
        }
    };

    // Hàm tiện ích để chọn màu cho số lượng tồn kho
    const getStockColor = (qty) => {
        if (qty === 0) return '#eb3b5a'; // Đỏ - Hết hàng
        if (qty <= 10) return '#f7b731'; // Vàng cam - Sắp hết
        return '#20bf6b'; // Xanh ngọc - Còn nhiều
    };

    // --- Xử lý Modal ---
    const handleOpenModal = (product, type) => {
        setSelectedProduct(product);
        setTransactionType(type);
        setQuantity(1);
        setNote(type === 'IMPORT'
            ? `Nhập hàng bổ sung cho: ${product.name}`
            : `Xuất kho cho: ${product.name}`
        );
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
        setNote('');
        setQuantity(1);
    };

    // --- Xử lý Submit (Nhập hoặc Xuất) ---
    const handleSubmit = async () => {
        if (!selectedProduct) return;

        if (quantity <= 0) {
            alert("Số lượng phải lớn hơn 0");
            return;
        }

        // Validate nếu là Xuất kho
        if (transactionType === 'EXPORT' && quantity > selectedProduct.quantity) {
            alert(`Lỗi: Tồn kho chỉ còn ${selectedProduct.quantity}, không đủ để xuất ${quantity}.`);
            return;
        }

        const payload = {
            productId: selectedProduct.id,
            quantity: parseInt(quantity),
            note: note
        };

        try {
            setLoading(true);

            if (transactionType === 'IMPORT') {
                await StockService.importStock(payload);
                alert("✅ Nhập kho thành công!");
            } else {
                await StockService.exportStock(payload);
                alert("✅ Xuất kho thành công!");
            }

            handleCloseModal();
            fetchProducts(); // Load lại dữ liệu mới nhất
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
            alert("❌ " + msg);
        } finally {
            setLoading(false);
        }
    };

    // 👇 CẤU TRÚC BỐ CỤC MỚI: Sidebar bên trái, Nội dung bên phải
    return (
        <div className="staff-dashboard-layout">

            {/* 1. SIDEBAR KHU VỰC */}
            <div className="staff-sidebar-container">
                <SideBarStaff />
            </div>

            {/* 2. NỘI DUNG CHÍNH KHU VỰC */}
            <div className="staff-content-area">
                <div className="stock-import-container">
                    <div className="stock-header">
                        <h2 className="stock-title">📦 Quản lý Kho Hàng (Nhập/Xuất)</h2>
                    </div>

                    <div className="table-responsive">
                        <table className="stock-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên sản phẩm</th>
                                <th>Tồn kho</th>
                                <th>Trạng thái</th>
                                <th style={{width: '180px', textAlign:'center'}}>Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.length > 0 ? (
                                products.map((p) => (
                                    <tr key={p.id}>
                                        <td>#{p.id}</td>
                                        {/* 👇 Màu tên sản phẩm dễ nhìn hơn */}
                                        <td className="product-name-cell">{p.name}</td>

                                        {/* 👇 Màu tồn kho thay đổi động */}
                                        <td style={{
                                            fontWeight: '800',
                                            fontSize: '1.1em',
                                            color: getStockColor(p.quantity)
                                        }}>
                                            {p.quantity}
                                        </td>
                                        <td>
                                                <span className={`status-badge ${p.quantity > 0 ? 'status-active' : 'status-out'}`}>
                                                    {p.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                                                </span>
                                        </td>
                                        <td style={{textAlign:'center'}}>
                                            {/* Nút Nhập */}
                                            <button
                                                className="btn-action btn-import"
                                                title="Nhập thêm hàng"
                                                onClick={() => handleOpenModal(p, 'IMPORT')}
                                            >
                                                📥 Nhập
                                            </button>

                                            {/* Nút Xuất */}
                                            <button
                                                className="btn-action btn-export"
                                                title="Xuất kho (Hủy/Kiểm kê)"
                                                onClick={() => handleOpenModal(p, 'EXPORT')}
                                                disabled={p.quantity <= 0}
                                                style={{ opacity: p.quantity <= 0 ? 0.5 : 1 }}
                                            >
                                                📤 Xuất
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center', padding: '20px', color: '#666'}}>
                                        Chưa có dữ liệu sản phẩm.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- MODAL DÙNG CHUNG --- */}
                    {selectedProduct && (
                        <div className="modal-overlay">
                            <div className="modal-box animate-pop-in">
                                <h3 className={`modal-title ${transactionType === 'IMPORT' ? 'modal-header-import' : 'modal-header-export'}`}>
                                    {transactionType === 'IMPORT' ? '📥 NHẬP KHO' : '📤 XUẤT KHO'}
                                </h3>

                                <div className="modal-info">
                                    <p>Sản phẩm: <strong>{selectedProduct.name}</strong></p>
                                    <p>Tồn hiện tại: <strong style={{color: getStockColor(selectedProduct.quantity)}}>{selectedProduct.quantity}</strong></p>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Số lượng {transactionType === 'IMPORT' ? 'nhập thêm' : 'xuất đi'}: <span style={{color:'red'}}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={quantity}
                                        min="1"
                                        // Nếu là Xuất, max là tồn kho hiện tại
                                        max={transactionType === 'EXPORT' ? selectedProduct.quantity : ''}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Ghi chú (Lý do):</label>
                                    <textarea
                                        className="form-textarea"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder={transactionType === 'IMPORT'
                                            ? "VD: Nhập hàng đợt 1..."
                                            : "VD: Hàng lỗi, Kiểm kê..."}
                                    ></textarea>
                                </div>

                                <div className="modal-actions">
                                    <button className="btn-cancel" onClick={handleCloseModal}>
                                        Hủy bỏ
                                    </button>
                                    <button
                                        className={`btn-submit ${transactionType === 'IMPORT' ? 'btn-import-submit' : 'btn-export-submit'}`}
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? "Đang xử lý..." : "Xác nhận"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockManagement;