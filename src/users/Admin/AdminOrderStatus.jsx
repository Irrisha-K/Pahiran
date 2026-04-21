import React, { useEffect, useState, useCallback } from "react";
import "./AdminOrderStatus.css";

const STATUSES = [
  { key: "pending", icon: "⏳", label: "Pending" },
  { key: "processing", icon: "⚙️", label: "Processing" },
  { key: "shipped", icon: "🚚", label: "Shipped" },
  { key: "out_for_delivery", icon: "📦", label: "Out for Delivery" },
  { key: "delivered", icon: "✅", label: "Delivered" },
  { key: "cancelled", icon: "❌", label: "Cancelled" },
];

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STAGE_ORDER = [
  "pending",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const AdminOrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState({}); // { [orderId]: true }
  const [toast, setToast] = useState(null); // { msg, type }
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  /* ── Fetch all orders ── */
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5001/api/purchase/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ── Show toast ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Update order status ── */
  const updateStatus = async (orderId, newStatus) => {
    setUpdating((p) => ({ ...p, [orderId]: true }));
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5001/api/purchase/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o,
          ),
        );
        showToast(
          `Order updated to "${STATUSES.find((s) => s.key === newStatus)?.label}"`,
        );
      } else {
        showToast(data.message || "Update failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setUpdating((p) => ({ ...p, [orderId]: false }));
    }
  };

  /* ── Filtered + searched orders ── */
  const visible = orders.filter((o) => {
    const matchFilter =
      filter === "all" || o.status?.toLowerCase().replace(/ /g, "_") === filter;
    const matchSearch =
      !search ||
      o._id?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  /* ── Stats ── */
  const stats = STATUSES.slice(0, 5).map((s) => ({
    ...s,
    count: orders.filter(
      (o) => o.status?.toLowerCase().replace(/ /g, "_") === s.key,
    ).length,
  }));

  return (
    <div className="ao-root">
      {/* Toast */}
      {toast && (
        <div className={`ao-toast ao-toast--${toast.type}`}>
          {toast.type === "success" ? "✓" : "✗"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="ao-header">
        <div>
          <div className="ao-header__eyebrow">Admin Panel</div>
          <h1 className="ao-header__title">Order Management</h1>
        </div>
        <button className="ao-btn-refresh" onClick={fetchOrders}>
          ↺ Refresh
        </button>
      </header>

      {/* Stats strip */}
      <div className="ao-stats">
        {stats.map((s, i) => (
          <button
            key={s.key}
            className={`ao-stat ${filter === s.key ? "ao-stat--active" : ""} ao-stat--${i}`}
            onClick={() => setFilter(filter === s.key ? "all" : s.key)}
          >
            <span className="ao-stat__icon">{s.icon}</span>
            <span className="ao-stat__count">{s.count}</span>
            <span className="ao-stat__label">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="ao-toolbar">
        <div className="ao-search">
          <span className="ao-search__icon">⌕</span>
          <input
            className="ao-search__input"
            placeholder="Search by order ID or customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="ao-search__clear" onClick={() => setSearch("")}>
              ×
            </button>
          )}
        </div>
        <span className="ao-toolbar__count">
          {visible.length} order{visible.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Error */}
      {error && <div className="ao-error">⚠ {error}</div>}

      {/* Loading */}
      {loading && (
        <div className="ao-loading">
          <div className="ao-dots">
            <span />
            <span />
            <span />
          </div>
          <p>Loading orders…</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && visible.length === 0 && (
        <div className="ao-empty">
          <p>No orders match your filters.</p>
          <button
            className="ao-btn-ghost"
            onClick={() => {
              setFilter("all");
              setSearch("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Table */}
      {visible.length > 0 && (
        <div className="ao-table-wrap">
          <table className="ao-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Current Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order, idx) => {
                const rawStatus = order.status
                  ?.toLowerCase()
                  .replace(/ /g, "_");
                const statusObj =
                  STATUSES.find((s) => s.key === rawStatus) || STATUSES[0];
                const stageIdx = STAGE_ORDER.indexOf(rawStatus);
                const isLoading = updating[order._id];

                return (
                  <tr
                    key={order._id || idx}
                    className="ao-row"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* ID */}
                    <td>
                      <span className="ao-oid">
                        #{order._id?.slice(-8).toUpperCase()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td>
                      <div className="ao-customer">
                        <span className="ao-customer__avatar">
                          {(order.user?.name || "U")[0].toUpperCase()}
                        </span>
                        <span className="ao-customer__name">
                          {order.user?.name || "Unknown"}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="ao-date">{formatDate(order.createdAt)}</td>

                    {/* Items */}
                    <td>
                      <span className="ao-count">
                        {order.items?.length || 0}
                      </span>
                    </td>

                    {/* Total */}
                    <td>
                      <span className="ao-total">
                        ₹{Number(order.total).toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Current status */}
                    <td>
                      <span className={`ao-badge ao-badge--${rawStatus}`}>
                        {statusObj.icon} {statusObj.label}
                      </span>
                    </td>

                    {/* Status dropdown */}
                    <td>
                      <div className="ao-select-wrap">
                        <select
                          className={`ao-select ${isLoading ? "ao-select--busy" : ""}`}
                          value={rawStatus}
                          disabled={isLoading}
                          onChange={(e) =>
                            updateStatus(order._id, e.target.value)
                          }
                        >
                          {STATUSES.map((s) => (
                            <option key={s.key} value={s.key}>
                              {s.icon} {s.label}
                            </option>
                          ))}
                        </select>
                        {isLoading && <span className="ao-select__spinner" />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrderStatus;
