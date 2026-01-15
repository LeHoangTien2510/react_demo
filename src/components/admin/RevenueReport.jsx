import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar'; // 👇 1. Import Sidebar
import {
    getRevenueByDay,
    getRevenueByMonth,
    getRevenueByDayFilter,
    getRevenueByMonthFilter
} from '../../api/RevenueService';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import './RevenueReport.css';

const RevenueReport = () => {
    const [viewType, setViewType] = useState('day'); // 'day' hoặc 'month'
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // State cho bộ lọc ngày
    const [dateRange, setDateRange] = useState({
        from: '',
        to: ''
    });

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [viewType]);

    const fetchData = async (isFilter = false) => {
        setLoading(true);
        try {
            let res;

            // LOGIC GỌI API
            if (viewType === 'day') {
                if (isFilter && dateRange.from && dateRange.to) {
                    res = await getRevenueByDayFilter(dateRange.from, dateRange.to);
                } else {
                    res = await getRevenueByDay();
                }
            } else {
                if (isFilter && dateRange.from && dateRange.to) {
                    res = await getRevenueByMonthFilter(dateRange.from, dateRange.to);
                } else {
                    res = await getRevenueByMonth();
                }
            }

            // XỬ LÝ DATA
            const formattedData = res.data.map(item => {
                if (viewType === 'day') {
                    return {
                        name: item.date || item.reportDate || item[0],
                        revenue: item.revenue || item.totalRevenue || item[1],
                        fullDate: item.date
                    };
                } else {
                    return {
                        name: `T${item.month}/${item.year}`,
                        revenue: item.revenue || item.totalRevenue,
                        month: item.month,
                        year: item.year
                    };
                }
            });

            setData(formattedData);
        } catch (error) {
            console.error("Lỗi tải báo cáo:", error);
            alert("Không thể tải dữ liệu báo cáo.");
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        fetchData(true);
    };

    const handleReset = () => {
        setDateRange({ from: '', to: '' });
        fetchData(false);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const totalRevenueInRange = data.reduce((acc, curr) => acc + curr.revenue, 0);

    return (
        <div className="admin-layout"> {/* 👇 2. Layout bao ngoài */}

            <Sidebar /> {/* 👇 3. Gắn Sidebar vào đây */}

            <main className="main-content"> {/* 👇 4. Phần nội dung chính bên phải */}

                <div className="revenue-container">
                    <h2 className="page-title">📊 Báo Cáo Doanh Thu</h2>

                    {/* --- CONTROLS --- */}
                    <div className="controls-bar">
                        <div className="view-toggle">
                            <button
                                className={viewType === 'day' ? 'active' : ''}
                                onClick={() => setViewType('day')}
                            >
                                Theo Ngày
                            </button>
                            <button
                                className={viewType === 'month' ? 'active' : ''}
                                onClick={() => setViewType('month')}
                            >
                                Theo Tháng
                            </button>
                        </div>

                        <form className="date-filter-form" onSubmit={handleFilter}>
                            <input
                                type="date"
                                value={dateRange.from}
                                onChange={e => setDateRange({...dateRange, from: e.target.value})}
                                required
                            />
                            <span className="arrow">→</span>
                            <input
                                type="date"
                                value={dateRange.to}
                                onChange={e => setDateRange({...dateRange, to: e.target.value})}
                                required
                            />
                            <button type="submit" className="btn-filter">Lọc</button>
                            <button type="button" className="btn-reset" onClick={handleReset}>⟳</button>
                        </form>
                    </div>

                    {/* --- SUMMARY CARD --- */}
                    <div className="summary-card">
                        <h3>Tổng Doanh Thu (Giai đoạn này)</h3>
                        <div className="big-number">{formatCurrency(totalRevenueInRange)}</div>
                    </div>

                    {/* --- CHART SECTION --- */}
                    <div className="chart-wrapper">
                        {loading ? (
                            <div className="loading-text">Đang tải biểu đồ...</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact" }).format(value)}/>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="revenue" name="Doanh Thu" fill="#3498db" radius={[4, 4, 0, 0]}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3498db' : '#2980b9'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* --- DETAIL TABLE --- */}
                    <div className="table-responsive" style={{marginTop: '20px'}}>
                        <table className="revenue-table">
                            <thead>
                            <tr>
                                <th>Thời Gian</th>
                                <th>Doanh Thu</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td className="money-col">{formatCurrency(item.revenue)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="no-data">Không có dữ liệu trong khoảng thời gian này.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RevenueReport;