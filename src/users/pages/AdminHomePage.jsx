import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBoxOpen,
  FaPlusCircle,
  FaShoppingBag,
  FaListAlt,
  FaUserShield,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import "./AdminHome.css";

export default function AdminHomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalAdmins: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch("http://localhost:5001/api/users/stats"),
          fetch("http://localhost:5001/api/purchase/all"),
        ]);

        const statsData = await statsRes.json();
        const ordersData = await ordersRes.json();

        setStats({
          totalUsers: statsData.totalUsers || 0,
          totalProducts: statsData.totalProducts || 0,
          totalAdmins: statsData.totalAdmins || 0,
        });

        const allOrders = Array.isArray(ordersData) ? ordersData : [];
        setOrders(allOrders);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const recentOrders = orders.slice(-5).reverse();

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage your store from one place</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FaUsers />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">
              {loading ? "—" : stats.totalUsers}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <FaBoxOpen />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Products</span>
            <span className="stat-value">
              {loading ? "—" : stats.totalProducts}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FaShoppingBag />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{loading ? "—" : orders.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <FaUserShield />
          </div>
          <div className="stat-info">
            <span className="stat-label">Admins</span>
            <span className="stat-value">
              {loading ? "—" : stats.totalAdmins}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => navigate("/add")}>
            <div className="action-icon blue">
              <FaPlusCircle />
            </div>
            <span>Add Product</span>
          </button>
          <button
            className="action-card"
            onClick={() => navigate("/user-list")}
          >
            <div className="action-icon purple">
              <FaUsers />
            </div>
            <span>View Users</span>
          </button>
          <button
            className="action-card"
            onClick={() => navigate("/userpurchasehistory")}
          >
            <div className="action-icon green">
              <FaShoppingBag />
            </div>
            <span>All Orders</span>
          </button>
          <button className="action-card" onClick={() => navigate("/")}>
            <div className="action-icon orange">
              <FaListAlt />
            </div>
            <span>View Products</span>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="admin-section">
        <div className="section-header">
          <h2 className="section-title">Recent Orders</h2>
          <button
            className="view-all-btn"
            onClick={() => navigate("/userpurchasehistory")}
          >
            View All
          </button>
        </div>

        {loading ? (
          <p className="admin-loading">Loading orders...</p>
        ) : recentOrders.length === 0 ? (
          <p className="admin-empty">No orders yet.</p>
        ) : (
          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Items</th>
                  <th>Payment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={order._id}>
                    <td className="order-num">{i + 1}</td>
                    <td>{order.user?.name || "N/A"}</td>
                    <td>{order.user?.phone || "N/A"}</td>
                    <td>{order.items?.length || 0} item(s)</td>
                    <td>
                      <span
                        className={`payment-badge ${order.paymentMethod === "Khalti" ? "khalti" : "cod"}`}
                      >
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
