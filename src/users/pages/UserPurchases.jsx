import React, { useEffect, useState } from "react";
import "./UserPurchases.css";

const STAGES = [
  { key: "pending", icon: "⏳", label: "Order Placed" },
  { key: "processing", icon: "⚙️", label: "Processing" },
  { key: "shipped", icon: "🚚", label: "Shipped" },
  { key: "out_for_delivery", icon: "📦", label: "Out for Delivery" },
  { key: "delivered", icon: "✅", label: "Delivered" },
];

const STAGE_ORDER = STAGES.map((s) => s.key);

function getStageIndex(status = "") {
  const key = status.toLowerCase().replace(/ /g, "_");
  if (key === "cancelled") return -1;
  const idx = STAGE_ORDER.indexOf(key);
  return idx === -1 ? 0 : idx;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const UserPurchases = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});

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

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const isCancelled = (s) => s?.toLowerCase() === "cancelled";

  return (
    <div className="orders-page">
      <h2>Purchase History</h2>

      {loading && <p className="orders-status">Fetching your orders…</p>}
      {error && <p className="orders-status error">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="orders-status">No orders found yet.</p>
      )}

      {!loading && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order, index) => {
            const cancelled = isCancelled(order.status);
            const stageIdx = getStageIndex(order.status);
            const rawStatus =
              order.status?.toLowerCase().replace(/ /g, "_") || "pending";
            const stageObj = STAGES[stageIdx];
            const isExpanded = expanded[order._id || index];

            return (
              <div
                key={order._id || index}
                className={`order-card ${cancelled ? "order-card--cancelled" : ""}`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* ── Header ── */}
                <div className="order-header">
                  <div className="order-meta">
                    <span className="order-number">Order #{index + 1}</span>
                    <span className="order-date">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="order-header-right">
                    <span
                      className={`order-payment ${order.paymentMethod === "Khalti" ? "khalti" : "cod"}`}
                    >
                      {order.paymentMethod || "N/A"}
                    </span>
                    <span
                      className={`aop-badge aop-badge--${cancelled ? "cancelled" : rawStatus}`}
                    >
                      {cancelled
                        ? "❌ Cancelled"
                        : `${stageObj?.icon} ${stageObj?.label}`}
                    </span>
                  </div>
                </div>

                {/* ── Shipping timeline ── */}
                {!cancelled && (
                  <div className="up-timeline">
                    {STAGES.map((stage, i) => {
                      const done = i <= stageIdx;
                      const active = i === stageIdx;
                      const pct = i < stageIdx ? 100 : i === stageIdx ? 50 : 0;
                      return (
                        <div className="up-tl-step" key={stage.key}>
                          {i > 0 && (
                            <div className="up-tl-line">
                              <div
                                className="up-tl-line__fill"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          )}
                          <div
                            className={`up-tl-node ${done ? "up-tl-node--done" : ""} ${active ? "up-tl-node--active" : ""}`}
                          >
                            {done ? (
                              <span className="up-tl-node__icon">
                                {stage.icon}
                              </span>
                            ) : (
                              <span className="up-tl-node__num">{i + 1}</span>
                            )}
                            {active && <span className="up-tl-node__pulse" />}
                          </div>
                          <span
                            className={`up-tl-label ${active ? "up-tl-label--active" : ""} ${done && !active ? "up-tl-label--done" : ""}`}
                          >
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── Expand toggle ── */}
                <button
                  className="order-toggle"
                  onClick={() => toggle(order._id || index)}
                >
                  <span>Order details</span>
                  <span
                    className={`order-toggle__chevron ${isExpanded ? "order-toggle__chevron--open" : ""}`}
                  >
                    ›
                  </span>
                </button>

                {/* ── Expandable details ── */}
                {isExpanded && (
                  <div className="order-details-body">
                    <div className="order-total-row">
                      <span className="order-total-label">Order Total</span>
                      <span className="order-total-value">
                        Rs {Number(order.total).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="order-items">
                      <p className="order-items-title">Items Ordered</p>
                      <ul>
                        {order.items?.map((item, idx) => (
                          <li key={idx} className="order-item-row">
                            <span className="item-name">{item.name}</span>
                            <span className="item-qty">x{item.quantity}</span>
                            {item.price && (
                              <span className="item-price">
                                Rs {Number(item.price).toLocaleString("en-IN")}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserPurchases;
