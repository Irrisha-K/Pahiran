import { useEffect, useState } from "react";
import "./AdminOrdersPage.css";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <h2>All Orders</h2>

      {orders.length === 0 ? (
        <p className="orders-status">No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
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
                  className={`order-payment ${order.paymentMethod === "Khalti" ? "khalti" : "cod"}`}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
