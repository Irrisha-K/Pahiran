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
const REFUND_STAGES = [
  { key: "requested", icon: "📋", label: "Requested" },
  { key: "processing", icon: "🔄", label: "Processing" },
  { key: "refunded", icon: "💰", label: "Refunded" },
];

function getStageIndex(status = "") {
  const key = status.toLowerCase().replace(/ /g, "_");
  if (key === "cancelled") return -1;
  const idx = STAGE_ORDER.indexOf(key);
  return idx === -1 ? 0 : idx;
}
function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function fmt(n) {
  return Number(n).toLocaleString("en-IN");
}

// ── Confirmation modal (replaces window.confirm) ──────────────────────────────
function ConfirmModal({ type, order, onConfirm, onCancel, busy }) {
  const isCancel = type === "cancel";
  const isKhalti = order.paymentMethod === "Khalti";

  return (
    <div className="up-modal-overlay" onClick={onCancel}>
      <div className="up-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`up-modal__icon ${isCancel ? "red" : "amber"}`}>
          {isCancel ? "✕" : "💳"}
        </div>

        <h3 className="up-modal__title">
          {isCancel ? "Cancel this order?" : "Request a refund?"}
        </h3>

        {isCancel ? (
          <>
            <p className="up-modal__body">
              This will cancel <strong>Order #{order._idx + 1}</strong> and
              cannot be undone.
            </p>
            {isKhalti ? (
              <div className="up-modal__info up-modal__info--blue">
                <span className="up-modal__info-icon">⏱</span>
                <div>
                  <strong>Khalti refund scheduled</strong>
                  <p>
                    Rs {fmt(order.total)} will be credited back to your Khalti
                    wallet within <strong>1 hour</strong> of cancellation.
                  </p>
                </div>
              </div>
            ) : (
              <div className="up-modal__info up-modal__info--grey">
                <span className="up-modal__info-icon">ℹ</span>
                <p>
                  This is a Cash on Delivery order — no monetary refund applies.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="up-modal__body">
              You're requesting a refund for{" "}
              <strong>Order #{order._idx + 1}</strong> — Rs {fmt(order.total)}.
            </p>
            {isKhalti ? (
              <div className="up-modal__info up-modal__info--blue">
                <span className="up-modal__info-icon">⏱</span>
                <div>
                  <strong>Processing time: ~1 hour</strong>
                  <p>
                    Once approved by our team, Rs {fmt(order.total)} will be
                    returned to your Khalti wallet within 1 hour.
                  </p>
                </div>
              </div>
            ) : (
              <div className="up-modal__info up-modal__info--grey">
                <span className="up-modal__info-icon">ℹ</span>
                <p>
                  COD orders are not eligible for a monetary refund. Our team
                  will contact you for resolution.
                </p>
              </div>
            )}
          </>
        )}

        <div className="up-modal__actions">
          <button
            className="up-modal__btn-ghost"
            onClick={onCancel}
            disabled={busy}
          >
            Go back
          </button>
          <button
            className={`up-modal__btn-confirm ${isCancel ? "red" : "amber"}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy
              ? "Please wait…"
              : isCancel
                ? "Yes, cancel order"
                : "Submit refund request"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Refund tracker strip ──────────────────────────────────────────────────────
function RefundTracker({ refundStatus, refundNote, refundScheduledAt }) {
  if (!refundStatus || refundStatus === "none") return null;
  const idx = REFUND_STAGES.findIndex((s) => s.key === refundStatus);

  // Calculate time remaining if scheduled
  let timeRemaining = null;
  if (refundStatus === "processing" && refundScheduledAt) {
    const diff = new Date(refundScheduledAt) - new Date();
    if (diff > 0) {
      const mins = Math.ceil(diff / 60000);
      timeRemaining = mins >= 60 ? `~${Math.ceil(mins / 60)}h` : `~${mins}m`;
    }
  }

  return (
    <div className="refund-tracker">
      <div className="refund-tracker__head">
        <span className="refund-tracker__title">💳 Refund Status</span>
        {timeRemaining && (
          <span className="refund-tracker__eta">
            ⏱ Est. {timeRemaining} remaining
          </span>
        )}
      </div>

      <div className="refund-tl">
        {REFUND_STAGES.map((stage, i) => {
          const done = i <= idx,
            active = i === idx;
          return (
            <div className="refund-tl__step" key={stage.key}>
              {i > 0 && (
                <div className="refund-tl__line">
                  <div
                    className="refund-tl__line-fill"
                    style={{ width: i <= idx ? "100%" : "0%" }}
                  />
                </div>
              )}
              <div
                className={`refund-tl__node ${done ? "done" : ""} ${active ? "active" : ""}`}
              >
                {done ? stage.icon : <span>{i + 1}</span>}
                {active && <span className="refund-tl__pulse" />}
              </div>
              <span
                className={`refund-tl__label ${active ? "active" : done && !active ? "done" : ""}`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {refundNote && (
        <p className="refund-tracker__note">
          <strong>Note:</strong> {refundNote}
        </p>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const UserPurchases = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null); // { type: "cancel"|"refund", order }
  const [busy, setBusy] = useState(false);

  const token = localStorage.getItem("token");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5001/api/purchase/orders/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setOrders(data.orders);
      else setError(data.message || "Failed to fetch orders");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ── Cancel ──────────────────────────────────────────────────────────────────
  const confirmCancel = async () => {
    setBusy(true);
    try {
      const res = await fetch(
        `http://localhost:5001/api/purchase/orders/${modal.order._id}/cancel`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === modal.order._id
            ? {
                ...o,
                status: "cancelled",
                refundStatus: data.order.refundStatus,
                refundNote: data.order.refundNote,
                refundScheduledAt: data.order.refundScheduledAt,
              }
            : o,
        ),
      );
      setModal(null);
      showToast(data.message);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  // ── Refund request ──────────────────────────────────────────────────────────
  const confirmRefund = async () => {
    setBusy(true);
    try {
      const res = await fetch(
        `http://localhost:5001/api/purchase/orders/${modal.order._id}/refund`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ refundStatus: "requested", refundNote: "" }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === modal.order._id ? { ...o, refundStatus: "requested" } : o,
        ),
      );
      setModal(null);
      showToast(
        "✅ Refund request submitted! Our team will process it within 1 hour.",
      );
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="orders-page">
      {/* Toast */}
      {toast && (
        <div className={`up-toast up-toast--${toast.type}`}>{toast.msg}</div>
      )}

      {/* Modal */}
      {modal && (
        <ConfirmModal
          type={modal.type}
          order={modal.order}
          busy={busy}
          onConfirm={modal.type === "cancel" ? confirmCancel : confirmRefund}
          onCancel={() => !busy && setModal(null)}
        />
      )}

      <h2>Purchase History</h2>

      {loading && <p className="orders-status">Fetching your orders…</p>}
      {error && <p className="orders-status error">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="orders-status">No orders found yet.</p>
      )}

      {!loading && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order, index) => {
            const cancelled = order.status?.toLowerCase() === "cancelled";
            const stageIdx = getStageIndex(order.status);
            const rawStatus =
              order.status?.toLowerCase().replace(/ /g, "_") || "pending";
            const stageObj = STAGES[stageIdx];
            const isOpen = expanded[order._id || index];
            const canCancel = ["pending", "processing"].includes(
              order.status?.toLowerCase(),
            );
            const canRefund =
              ["cancelled", "delivered"].includes(
                order.status?.toLowerCase(),
              ) &&
              (!order.refundStatus || order.refundStatus === "none");
            const orderWithIdx = { ...order, _idx: index };

            return (
              <div
                key={order._id || index}
                className={`order-card ${cancelled ? "order-card--cancelled" : ""}`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Header */}
                <div className="order-header">
                  <div className="order-meta">
                    <span className="order-number">Order #{index + 1}</span>
                    <span className="order-id">
                      ID: {order._id?.slice(-10).toUpperCase()}
                    </span>
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
                    {order.refundStatus && order.refundStatus !== "none" && (
                      <RefundStatusBadge status={order.refundStatus} />
                    )}
                  </div>
                </div>

                {/* Products */}
                <div className="order-products-preview">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-product-row">
                      <span className="order-product-name">{item.name}</span>
                      <div className="order-product-right">
                        <span className="order-product-qty">
                          x{item.quantity}
                        </span>
                        {item.price && (
                          <span className="order-product-price">
                            Rs {fmt(item.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="order-product-total">
                    <span>Total</span>
                    <span>Rs {fmt(order.total)}</span>
                  </div>
                </div>

                {/* Shipping timeline */}
                {!cancelled && (
                  <div className="up-timeline">
                    {STAGES.map((stage, i) => {
                      const done = i <= stageIdx,
                        active = i === stageIdx;
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

                {/* Refund tracker */}
                <RefundTracker
                  refundStatus={order.refundStatus}
                  refundNote={order.refundNote}
                  refundScheduledAt={order.refundScheduledAt}
                />

                {/* Action row */}
                {(canCancel || canRefund) && (
                  <div className="order-action-row">
                    {canCancel && (
                      <button
                        className="order-cancel-btn"
                        onClick={() =>
                          setModal({ type: "cancel", order: orderWithIdx })
                        }
                      >
                        ✕ Cancel Order
                      </button>
                    )}
                    {canRefund && (
                      <button
                        className="order-refund-btn"
                        onClick={() =>
                          setModal({ type: "refund", order: orderWithIdx })
                        }
                      >
                        💳 Request Refund
                      </button>
                    )}
                  </div>
                )}

                {/* Expand toggle */}
                <button
                  className="order-toggle"
                  onClick={() => toggle(order._id || index)}
                >
                  <span>Order details</span>
                  <span
                    className={`order-toggle__chevron ${isOpen ? "open" : ""}`}
                  >
                    ›
                  </span>
                </button>

                {isOpen && (
                  <div className="order-details-body">
                    <div className="order-user">
                      <p>
                        <span>Payment</span>
                        {order.paymentMethod || "N/A"}
                      </p>
                      <p>
                        <span>Items</span>
                        {order.items?.length || 0}
                      </p>
                      <p className="order-full-id">
                        <span>Full ID</span>
                        {order._id}
                      </p>
                      {order.refundNote && (
                        <p>
                          <span>Refund Note</span>
                          {order.refundNote}
                        </p>
                      )}
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

function RefundStatusBadge({ status }) {
  const map = {
    requested: { label: "Refund Requested", bg: "#fef3c7", color: "#92400e" },
    processing: { label: "Refund in 1 hr", bg: "#dbeafe", color: "#1e40af" },
    refunded: { label: "Refunded ✓", bg: "#d1fae5", color: "#065f46" },
  };
  const c = map[status];
  if (!c) return null;
  return (
    <span className="refund-badge" style={{ background: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

export default UserPurchases;
