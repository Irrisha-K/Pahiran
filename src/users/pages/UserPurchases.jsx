// import React, { useState } from "react";
// import "./UserPurchases.css";

// const UserPurchases = () => {
//   const [userId, setUserId] = useState("");
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchOrders = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(
//         `http://localhost:5001/api/orders/${userId}`
//       );
//       const data = await response.json();

//       if (response.ok) {
//         setOrders(data.orders);
//       } else {
//         setError(data.message || "Failed to fetch orders");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="user-purchases-container">
//       <h2>User Purchase History</h2>
//       <div className="input-section">
//         <input
//           type="text"
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//           placeholder="Enter User ID"
//         />
//         <button onClick={fetchOrders} disabled={!userId || loading}>
//           {loading ? "Loading..." : "Get Purchases"}
//         </button>
//       </div>

//       {error && <div className="error">{error}</div>}

//       <div className="orders-list">
//         {orders.length === 0 && !loading ? (
//           <p>No orders to display</p>
//         ) : (
//           orders.map((order, index) => (
//             <div className="order-card" key={order._id || index}>
//               <p>
//                 <strong>Order ID:</strong> {order._id}
//               </p>
//               <p>
//                 <strong>Date:</strong>{" "}
//                 {new Date(order.createdAt).toLocaleString()}
//               </p>
//               <p>
//                 <strong>Status:</strong> {order.status || "N/A"}
//               </p>
//               {/* Add more order fields as needed */}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserPurchases;

import React, { useEffect, useState } from "react";
import "./UserPurchases.css";

const UserPurchases = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token"); // assuming you store JWT here

      const response = await fetch(
        `http://localhost:5001/api/purchase/orders/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(); // auto-fetch when component loads
  }, []);

  return (
    <div className="user-purchases-container">
      <h2>Your Purchase History</h2>

      {loading && <p>Loading orders...</p>}
      {error && <div className="error">{error}</div>}

      <div className="orders-list">
        {orders.length === 0 && !loading ? (
          <p>No orders found</p>
        ) : (
          orders.map((order, index) => (
            <div className="order-card" key={order._id || index}>
              <p>
                <strong>Name:</strong> {order.user.name}
              </p>
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {order.status || "N/A"}
              </p>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Total:</strong> Rs {order.total}
              </p>
              <div>
                <p className="items-label">Items:</p>
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      Item Name: {item.name} <span>x {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserPurchases;
