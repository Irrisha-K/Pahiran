// import { useLocation } from "react-router-dom";
// import "./CheckoutPage.css";

// export default function CheckoutPage() {
//   const location = useLocation();
//   const { items } = location.state || { items: [] };

//   const cartTotal = items.reduce(
//     (total, item) => total + item.quantity * item.numericPrice,
//     0
//   );

//   const formattedTotal =
//     "Rs. " +
//     new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(
//       cartTotal
//     );

//   return (
//     <div className="checkout-page">
//       <h2>Checkout</h2>
//       {items.length === 0 ? (
//         <p className="empty">No items to checkout.</p>
//       ) : (
//         <>
//           <ul className="checkout-items">
//             {items.map((item) => (
//               <li key={item.id} className="checkout-item">
//                 <img src={item.image} alt={item.name} />
//                 <div className="checkout-info">
//                   <h3>{item.name}</h3>
//                   <p>{item.price}</p>
//                   <p>Quantity: {item.quantity}</p>
//                 </div>
//               </li>
//             ))}
//           </ul>
//           <div className="checkout-summary">
//             <p className="checkout-total">Total: {formattedTotal}</p>
//             <button className="checkout-button">Place Order</button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = location.state || { items: [] };

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const cartTotal = items.reduce(
    (total, item) => total + item.quantity * item.numericPrice,
    0
  );

  const formattedTotal =
    "Rs. " +
    new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(
      cartTotal
    );

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = () => {
    if (!formData.name || !formData.address || !formData.phone) {
      toast.error("Please fill all delivery details.");
      return;
    }

    setOrderPlaced(true);

    // Simulate a delay before redirecting
    setTimeout(() => {
      toast.success("Order placed successfully! Redirecting to home...");
      navigate("/");
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <h2>Thank You!</h2>
        <p className="confirmation">Your order has been placed.</p>
        <p className="confirmation">Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      {items.length === 0 ? (
        <p className="empty">No items to checkout.</p>
      ) : (
        <>
          <ul className="checkout-items">
            {items.map((item) => (
              <li key={item.id} className="checkout-item">
                <img src={item.image} alt={item.name} />
                <div className="checkout-info">
                  <h3>{item.name}</h3>
                  <p>{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>

          <form className="delivery-form">
            <h3>Delivery Details</h3>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <textarea
              name="address"
              placeholder="Delivery Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </form>

          <div className="checkout-summary">
            <p className="checkout-total">Total: {formattedTotal}</p>
            <button className="checkout-button" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
