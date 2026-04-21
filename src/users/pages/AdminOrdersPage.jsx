// import { useEffect, useState } from "react";
// import "./AdminOrdersPage.css";

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await fetch("http://localhost:5001/api/purchase/all");
//         if (!res.ok) throw new Error("Failed to fetch orders");
//         const data = await res.json();
//         setOrders(data.orders);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, []);

//   if (loading)
//     return (
//       <div className="orders-page">
//         <p className="orders-status">Loading orders...</p>
//       </div>
//     );
//   if (error)
//     return (
//       <div className="orders-page">
//         <p className="orders-status error">{error}</p>
//       </div>
//     );

//   return (
//     <div className="orders-page">
//       <h2>All Orders</h2>

//       {orders.length === 0 ? (
//         <p className="orders-status">No orders found.</p>
//       ) : (
//         <div className="orders-list">
//           {orders.map((order, index) => (
//             <div key={order._id} className="order-card">
//               <div className="order-header">
//                 <div className="order-meta">
//                   <span className="order-number">Order #{index + 1}</span>
//                   <span className="order-date">
//                     {new Date(order.createdAt).toLocaleDateString("en-US", {
//                       year: "numeric",
//                       month: "short",
//                       day: "numeric",
//                     })}
//                   </span>
//                 </div>
//                 <span
//                   className={`order-payment ${order.paymentMethod === "Khalti" ? "khalti" : "cod"}`}
//                 >
//                   {order.paymentMethod}
//                 </span>
//               </div>

//               <div className="order-user">
//                 <p>
//                   <span>Name:</span> {order.user?.name || "N/A"}
//                 </p>
//                 <p>
//                   <span>Phone:</span> {order.user?.phone || "N/A"}
//                 </p>
//                 <p>
//                   <span>Email:</span> {order.user?.email || "N/A"}
//                 </p>
//               </div>

//               <div className="order-items">
//                 <p className="order-items-title">Items</p>
//                 <ul>
//                   {order.items.map((item, i) => (
//                     <li key={i} className="order-item-row">
//                       <span className="item-name">{item.name}</span>
//                       <span className="item-qty">x{item.quantity}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import "./AdminOrdersPage.css";

// All possible statuses — must match your backend allowed list
const STATUSES = [
  { key: "pending", icon: "⏳", label: "Pending" },
  { key: "processing", icon: "⚙️", label: "Processing" },
  { key: "shipped", icon: "🚚", label: "Shipped" },
  { key: "out_for_delivery", icon: "📦", label: "Out for Delivery" },
  { key: "delivered", icon: "✅", label: "Delivered" },
  { key: "cancelled", icon: "❌", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({}); // { [orderId]: true } while saving
  const [toast, setToast] = useState(null);

  // ── Fetch all orders ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchOrders = async () => {
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
    };
    fetchOrders();
  }, []);

  // ── Update a single order's status ─────────────────────────────────────────
  // This calls PATCH /api/purchase/orders/:id/status
  // When it succeeds the order in local state is updated immediately
  // so the user's page will reflect the change on their next fetch
  const updateStatus = async (orderId, newStatus) => {
    setUpdating((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(
        `http://localhost:5001/api/purchase/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Update failed");

      // Reflect change locally — user page will see it next time they load
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)),
      );

      const statusLabel = STATUSES.find((s) => s.key === newStatus)?.label;
      showToast(`✓ Status updated to "${statusLabel}"`, "success");
    } catch (err) {
      showToast(`✗ ${err.message}`, "error");
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="orders-page">
        <p className="orders-status">Loading orders...</p>
      </div>
    );
  if (error)
    return (
      <div className="orders-page">
        <p className="orders-status error">{error}</p>
      </div>
    );

  return (
    <div className="orders-page">
      {/* Toast notification */}
      {toast && (
        <div className={`aop-toast aop-toast--${toast.type}`}>{toast.msg}</div>
      )}

      <h2>All Orders</h2>

      {orders.length === 0 ? (
        <p className="orders-status">No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => {
            // Normalise status key (handles spaces, caps, undefined)
            const rawStatus =
              order.status?.toLowerCase().replace(/ /g, "_") || "pending";
            const statusObj =
              STATUSES.find((s) => s.key === rawStatus) || STATUSES[0];
            const isBusy = updating[order._id];

            return (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-meta">
                    <span className="order-number">Order #{index + 1}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <span
                    className={`order-payment ${
                      order.paymentMethod === "Khalti" ? "khalti" : "cod"
                    }`}
                  >
                    {order.paymentMethod}
                  </span>
                </div>

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

                <div className="order-items">
                  <p className="order-items-title">Items</p>
                  <ul>
                    {order.items.map((item, i) => (
                      <li key={i} className="order-item-row">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ── Status manager ── */}
                <div className="aop-status-row">
                  {/* Current badge */}
                  <span className={`aop-badge aop-badge--${rawStatus}`}>
                    {statusObj.icon} {statusObj.label}
                  </span>

                  {/* Dropdown to change status */}
                  <div className="aop-select-wrap">
                    <select
                      className="aop-select"
                      value={rawStatus}
                      disabled={isBusy}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.icon} {s.label}
                        </option>
                      ))}
                    </select>
                    {isBusy && <span className="aop-spinner" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
