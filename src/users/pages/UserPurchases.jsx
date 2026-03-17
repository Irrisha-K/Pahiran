import React, { useEffect, useState } from "react";
import "./UserPurchases.css";

const STATUS_MAP = {
  delivered: { label: "Delivered", cls: "delivered" },
  processing: { label: "Processing", cls: "processing" },
  cancelled: { label: "Cancelled", cls: "cancelled" },
  pending: { label: "Pending", cls: "pending" },
};

function getStatus(raw = "") {
  const key = raw.toLowerCase();
  return STATUS_MAP[key] || { label: raw || "Unknown", cls: "pending" };
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const UserPurchases = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5001/api/purchase/orders/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="user-purchases-container">
      {/* ── Header ── */}
      <div className="purchases-header">
        <h2>Purchase History</h2>
        <p>All your orders in one place</p>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="purchases-loading">
          <div className="purchases-loading-dots">
            <span />
            <span />
            <span />
          </div>
          <p>Fetching your orders…</p>
        </div>
      )}

      {/* ── Error ── */}
      {error && <div className="purchases-error">⚠ {error}</div>}

      {/* ── Empty ── */}
      {!loading && !error && orders.length === 0 && (
        <div className="purchases-empty">
          <span className="purchases-empty-icon">🛍</span>
          <p>No orders found yet.</p>
        </div>
      )}

      {/* ── Orders ── */}
      <div className="orders-list">
        {orders.map((order, index) => {
          const { label, cls } = getStatus(order.status);

          return (
            <div className="order-card" key={order._id || index}>
              {/* Coloured top stripe */}
              <div
                className={`order-card__topbar order-card__topbar--${cls}`}
              />

              {/* Header row */}
              <div className="order-card__header">
                <div>
                  <p className="order-card__id">
                    Order #{order._id?.slice(-8).toUpperCase()}
                  </p>
                  <p className="order-card__name">
                    {order.user?.name || "Customer"}
                  </p>
                  <p className="order-card__date">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className={`order-status order-status--${cls}`}>
                  <span className="order-status__dot" />
                  {label}
                </div>
              </div>

              {/* Meta row */}
              <div className="order-card__body">
                <div className="order-meta">
                  <span className="order-meta__label">Payment</span>
                  <span className="order-meta__value">
                    {order.paymentMethod || "N/A"}
                  </span>
                </div>
                <div className="order-meta">
                  <span className="order-meta__label">Items</span>
                  <span className="order-meta__value">
                    {order.items?.length || 0}
                  </span>
                </div>
                <div className="order-meta">
                  <span className="order-meta__label">Total</span>
                  <span className="order-meta__value order-meta__value--amber">
                    Rs {Number(order.total).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Items list */}
              <div className="order-card__items">
                <p className="order-items-label">Items ordered</p>
                <ul className="order-items-list">
                  {order.items?.map((item, idx) => (
                    <li key={idx} className="order-item">
                      <span className="order-item__name">{item.name}</span>
                      <span className="order-item__qty">× {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserPurchases;
