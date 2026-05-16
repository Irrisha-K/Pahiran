import { useEffect, useState, useCallback } from "react";
import "./AdminOrdersPage.css";

const STATUSES = [
  { key: "pending", icon: "⏳", label: "Pending" },
  { key: "processing", icon: "⚙️", label: "Processing" },
  { key: "shipped", icon: "🚚", label: "Shipped" },
  { key: "out_for_delivery", icon: "📦", label: "Out for Delivery" },
  { key: "delivered", icon: "✅", label: "Delivered" },
  { key: "cancelled", icon: "❌", label: "Cancelled" },
];

function fmt(n) {
  return Number(n || 0).toLocaleString("en-IN");
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ── Refund state label shown to admin ─────────────────────────────────────────
function RefundBadge({ status }) {
  const map = {
    requested: { label: "⚠️ Refund Requested", cls: "requested" },
    processing: { label: "🔄 Refund Scheduled", cls: "processing" },
    refunded: { label: "✅ Refunded", cls: "refunded" },
  };
  const c = map[status];
  if (!c) return null;
  return (
    <span className={`aop-refund-badge aop-refund-badge--${c.cls}`}>
      {c.label}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});
  const [toast, setToast] = useState(null);
  const [refundPanel, setRefundPanel] = useState({}); // { [id]: open }
  const [rejectNote, setRejectNote] = useState({}); // { [id]: string }

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5001/api/purchase/all");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ── Patch helper ────────────────────────────────────────────────────────────
  const patch = async (url, body) => {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  };

  // ── Update shipping status ──────────────────────────────────────────────────
  const updateStatus = async (orderId, newStatus) => {
    setUpdating((p) => ({ ...p, [`s_${orderId}`]: true }));
    try {
      const data = await patch(
        `http://localhost:5001/api/purchase/orders/${orderId}/status`,
        { status: newStatus },
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...data.order } : o)),
      );
      showToast(
        `✓ Status → ${STATUSES.find((s) => s.key === newStatus)?.label}`,
      );
    } catch (err) {
      showToast(`✗ ${err.message}`, "error");
    } finally {
      setUpdating((p) => ({ ...p, [`s_${orderId}`]: false }));
    }
  };

  // ── Approve refund: sets processing + schedules 1 hour ─────────────────────
  const approveRefund = async (orderId) => {
    setUpdating((p) => ({ ...p, [`r_${orderId}`]: true }));
    try {
      const data = await patch(
        `http://localhost:5001/api/purchase/orders/${orderId}/refund`,
        { refundStatus: "processing", refundNote: "" },
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...data.order } : o)),
      );
      setRefundPanel((p) => ({ ...p, [orderId]: false }));
      showToast("✓ Refund approved — will be credited within 1 hour");
    } catch (err) {
      showToast(`✗ ${err.message}`, "error");
    } finally {
      setUpdating((p) => ({ ...p, [`r_${orderId}`]: false }));
    }
  };

  // ── Refund immediately (manual override) ───────────────────────────────────
  const refundNow = async (orderId) => {
    setUpdating((p) => ({ ...p, [`r_${orderId}`]: true }));
    try {
      const data = await patch(
        `http://localhost:5001/api/purchase/orders/${orderId}/refund`,
        {
          refundStatus: "refunded",
          refundNote: "Refunded immediately by admin.",
        },
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...data.order } : o)),
      );
      setRefundPanel((p) => ({ ...p, [orderId]: false }));
      showToast("✓ Refund processed — balance credited to user's wallet");
    } catch (err) {
      showToast(`✗ ${err.message}`, "error");
    } finally {
      setUpdating((p) => ({ ...p, [`r_${orderId}`]: false }));
    }
  };

  // ── Reject refund: set back to none + store rejection note ─────────────────
  const rejectRefund = async (orderId) => {
    const note = rejectNote[orderId]?.trim();
    if (!note) {
      showToast("Please write a reason before rejecting", "error");
      return;
    }
    setUpdating((p) => ({ ...p, [`r_${orderId}`]: true }));
    try {
      const data = await patch(
        `http://localhost:5001/api/purchase/orders/${orderId}/refund`,
        { refundStatus: "none", refundNote: `Refund rejected: ${note}` },
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...data.order } : o)),
      );
      setRefundPanel((p) => ({ ...p, [orderId]: false }));
      setRejectNote((p) => ({ ...p, [orderId]: "" }));
      showToast("Refund request rejected — user notified via note");
    } catch (err) {
      showToast(`✗ ${err.message}`, "error");
    } finally {
      setUpdating((p) => ({ ...p, [`r_${orderId}`]: false }));
    }
  };

  if (loading)
    return (
      <div className="orders-page">
        <p className="orders-status">Loading orders…</p>
      </div>
    );
  if (error)
    return (
      <div className="orders-page">
        <p className="orders-status error">{error}</p>
      </div>
    );

  const pendingRefunds = orders.filter(
    (o) => o.refundStatus === "requested",
  ).length;

  return (
    <div className="orders-page">
      {toast && (
        <div className={`aop-toast aop-toast--${toast.type}`}>{toast.msg}</div>
      )}

      <div className="aop-page-header">
        <h2>All Orders</h2>
        {pendingRefunds > 0 && (
          <span className="aop-alert-pill">
            ⚠️ {pendingRefunds} refund{pendingRefunds > 1 ? "s" : ""} need
            action
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <p className="orders-status">No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => {
            const rawStatus =
              order.status?.toLowerCase().replace(/ /g, "_") || "pending";
            const statusObj =
              STATUSES.find((s) => s.key === rawStatus) || STATUSES[0];
            const isBusyS = updating[`s_${order._id}`];
            const isBusyR = updating[`r_${order._id}`];
            const panelOpen = refundPanel[order._id];
            const hasRefundRequest = order.refundStatus === "requested";

            return (
              <div
                key={order._id}
                className={`order-card ${hasRefundRequest ? "order-card--alert" : ""}`}
              >
                {/* ── Header ── */}
                <div className="order-header">
                  <div className="order-meta">
                    <span className="order-number">Order #{index + 1}</span>
                    <span className="order-date">
                      {fmtDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="order-header-right">
                    <span
                      className={`order-payment ${order.paymentMethod === "Khalti" ? "khalti" : "cod"}`}
                    >
                      {order.paymentMethod}
                    </span>
                    <span className={`aop-badge aop-badge--${rawStatus}`}>
                      {statusObj.icon} {statusObj.label}
                    </span>
                    {order.refundStatus && order.refundStatus !== "none" && (
                      <RefundBadge status={order.refundStatus} />
                    )}
                  </div>
                </div>

                {/* ── User ── */}
                <div className="order-user">
                  <p>
                    <span>Name:</span> {order.user?.name || "N/A"}
                  </p>
                  <p>
                    <span>Phone:</span> {order.user?.phone || "N/A"}
                  </p>
                  <p>
                    <span>Email:</span> {order.user?.email || "N/A"}
                  </p>
                </div>

                {/* ── Items ── */}
                <div className="order-items">
                  <p className="order-items-title">Items</p>
                  <ul>
                    {order.items.map((item, i) => (
                      <li key={i} className="order-item-row">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">x{item.quantity}</span>
                        {item.price && (
                          <span className="item-price">
                            Rs {fmt(item.price)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="order-total-row">
                    <span>Total</span>
                    <strong>Rs {fmt(order.total)}</strong>
                  </div>
                </div>

                {/* ── Shipping status dropdown ── */}
                <div className="aop-status-row">
                  <span className={`aop-badge aop-badge--${rawStatus}`}>
                    {statusObj.icon} {statusObj.label}
                  </span>
                  <div className="aop-select-wrap">
                    <select
                      className="aop-select"
                      value={rawStatus}
                      disabled={isBusyS}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.icon} {s.label}
                        </option>
                      ))}
                    </select>
                    {isBusyS && <span className="aop-spinner" />}
                  </div>
                </div>

                {/* ── Refund section ── */}
                {order.refundStatus !== "none" && order.refundStatus ? (
                  // ── Refund exists — show panel toggle ────────────────────
                  <div className="aop-refund-section">
                    <button
                      className={`aop-refund-toggle ${hasRefundRequest ? "aop-refund-toggle--alert" : ""}`}
                      onClick={() =>
                        setRefundPanel((p) => ({
                          ...p,
                          [order._id]: !p[order._id],
                        }))
                      }
                    >
                      <span>
                        {hasRefundRequest
                          ? "⚠️ Action needed — Refund Request"
                          : "💳 Refund Details"}
                      </span>
                      <span
                        className={`aop-chevron ${panelOpen ? "open" : ""}`}
                      >
                        ›
                      </span>
                    </button>

                    {panelOpen && (
                      <div className="aop-refund-panel">
                        {/* ── Current state info ── */}
                        <div
                          className={`aop-refund-info aop-refund-info--${order.refundStatus}`}
                        >
                          {order.refundStatus === "requested" && (
                            <>
                              <p className="aop-refund-info__title">
                                📋 User requested a refund
                              </p>
                              <p className="aop-refund-info__body">
                                Rs {fmt(order.total)} · {order.paymentMethod}
                                {order.paymentMethod === "Khalti"
                                  ? " — approving will credit the wallet within 1 hour."
                                  : " — COD, no money to return."}
                              </p>
                            </>
                          )}
                          {order.refundStatus === "processing" && (
                            <>
                              <p className="aop-refund-info__title">
                                🔄 Refund is scheduled
                              </p>
                              <p className="aop-refund-info__body">
                                Rs {fmt(order.total)} will be credited
                                automatically within 1 hour. You can also refund
                                immediately below.
                              </p>
                            </>
                          )}
                          {order.refundStatus === "refunded" && (
                            <>
                              <p className="aop-refund-info__title">
                                ✅ Refund completed
                              </p>
                              <p className="aop-refund-info__body">
                                Rs {fmt(order.total)} has been credited to the
                                user's Khalti wallet.
                              </p>
                            </>
                          )}
                          {order.refundNote && (
                            <p className="aop-refund-info__note">
                              Note: {order.refundNote}
                            </p>
                          )}
                        </div>

                        {/* ── Actions — only when not yet refunded ── */}
                        {order.refundStatus !== "refunded" && (
                          <div className="aop-refund-actions">
                            {/* Approve → schedules 1-hour auto-refund */}
                            {order.refundStatus === "requested" && (
                              <button
                                className="aop-btn aop-btn--approve"
                                disabled={isBusyR}
                                onClick={() => approveRefund(order._id)}
                              >
                                {isBusyR
                                  ? "Processing…"
                                  : "✓ Approve — refund in 1 hr"}
                              </button>
                            )}

                            {/* Refund now — immediate wallet credit */}
                            {order.paymentMethod === "Khalti" && (
                              <button
                                className="aop-btn aop-btn--now"
                                disabled={isBusyR}
                                onClick={() => refundNow(order._id)}
                              >
                                {isBusyR
                                  ? "Processing…"
                                  : "⚡ Refund now (immediate)"}
                              </button>
                            )}

                            {/* Reject — requires a reason */}
                            {order.refundStatus === "requested" && (
                              <div className="aop-reject-wrap">
                                <textarea
                                  className="aop-refund-textarea"
                                  rows={2}
                                  placeholder="Reason for rejection (required)…"
                                  value={rejectNote[order._id] || ""}
                                  onChange={(e) =>
                                    setRejectNote((p) => ({
                                      ...p,
                                      [order._id]: e.target.value,
                                    }))
                                  }
                                />
                                <button
                                  className="aop-btn aop-btn--reject"
                                  disabled={
                                    isBusyR || !rejectNote[order._id]?.trim()
                                  }
                                  onClick={() => rejectRefund(order._id)}
                                >
                                  ✕ Reject refund
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
