import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";

import "./CheckoutPage.css";
import CartContext from "../../store/CartContext";

export default function CheckoutPage() {
  const { clearCart } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // default to COD
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const items = location.state?.items ?? [];

  const [mergedItems, setMergedItems] = useState(mergeItems(items));

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await fetch(`http://localhost:5001/api/users/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user data");

        const userData = await res.json();

        setFormData((prev) => ({
          ...prev,
          name: userData.name || "",
          phone: userData.number || "",
        }));
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        toast.error("Could not auto-fill user details.");
      }
    };

    fetchUserData();
  }, []);

  const handlePaymentChange = (e) => {
    const method = e.target.value;
    setPaymentMethod(method);

    if (method === "eSewa") {
      toast.info("eSewa is coming soon!", {
        style: {
          backgroundColor: "#222",
          color: "#fff",
        },
      });
    }

    // if (method === "Khalti") {
    //   window.open("https://khalti.com/", "_blank");
    // }
  };

  const cartTotal = mergedItems.reduce(
    (total, item) => total + item.quantity * item.numericPrice,
    0,
  );

  const formattedTotal =
    "Rs. " +
    new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(
      cartTotal,
    );

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleKhaltiPayment = () => {
    if (!formData.name || !formData.address || !formData.phone) {
      toast.error("Please fill all delivery details before proceeding.");
      return;
    }

    const orderData = {
      items: mergedItems.map(({ id, quantity, name }) => ({
        id,
        quantity,
        name,
      })),
      user: {
        id: localStorage.getItem("userId"),
        name: formData.name,
        phone: formData.phone,
        email: localStorage.getItem("email") || "",
      },
      paymentMethod: "Khalti",
    };

    navigate("/khalti-payment", {
      state: {
        amount: cartTotal,
        orderData,
      },
    });
  };

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.address || !formData.phone) {
      toast.error("Please fill all delivery details.");
      return;
    }

    if (items.length === 0) {
      toast.error("No items in cart.");
      return;
    }

    if (paymentMethod === "Khalti") {
      const orderData = {
        items: mergedItems.map(({ id, quantity, name }) => ({
          id,
          quantity,
          name,
        })),
        user: {
          id: localStorage.getItem("userId"),
          name: formData.name,
          phone: formData.phone,
          email: localStorage.getItem("email") || "",
        },
        paymentMethod: "Khalti",
      };

      navigate("/khalti-payment", {
        state: {
          amount: cartTotal,
          orderData,
        },
      });

      return; // stop further processing here
    }

    // COD flow (continue as before)
    setIsPlacingOrder(true);

    try {
      const response = await fetch("http://localhost:5001/api/purchase/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: mergedItems.map(({ id, quantity, name }) => ({
            id,
            quantity,
            name,
          })),
          user: {
            id: localStorage.getItem("userId"),
            name: formData.name,
            phone: formData.phone,
            email: localStorage.getItem("email") || "",
          },
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Order failed");
      }

      toast.success("Order placed successfully!");
      localStorage.removeItem(`cart-${localStorage.getItem("userId")}`);
      clearCart();
      setOrderPlaced(true);
      setTimeout(() => navigate("/mypurchasehistory"), 3000);
    } catch (error) {
      toast.error(error.message);
      setIsPlacingOrder(false);
    }
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

  const isStockAvailable = items.every((item) => item.quantity <= item.stock);

  // function mergeItems(items) {
  //   const map = new Map();
  //   items.forEach((item) => {
  //     if (map.has(item.name)) {
  //       const existing = map.get(item.name);
  //       map.set(item.name, {
  //         ...existing,
  //         quantity: existing.quantity + item.quantity,
  //       });
  //     } else {
  //       map.set(item.name, { ...item });
  //     }
  //   });
  //   return Array.from(map.values());
  // }

  function mergeItems(items) {
    const map = new Map();
    items.forEach((item) => {
      if (map.has(item.id)) {
        const existing = map.get(item.id);
        map.set(item.id, {
          ...existing,
          quantity: existing.quantity + item.quantity,
        });
      } else {
        map.set(item.id, { ...item });
      }
    });
    return Array.from(map.values());
  }

  // const handleQuantityChange = (id, delta) => {
  //   setMergedItems((prev) =>
  //     prev.map((item) => {
  //       if (item.id === id) {
  //         const newQty = item.quantity + delta;
  //         return { ...item, quantity: newQty > 0 ? newQty : 1 };
  //       }
  //       return item;
  //     })
  //   );
  // };

  const handleQuantityChange = (id, delta = 0) => {
    if (typeof delta !== "number") return;

    setMergedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          const limitedQty = Math.min(item.stock, Math.max(1, newQty));
          return { ...item, quantity: limitedQty };
        }
        return item;
      }),
    );
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      {items.length === 0 ? (
        <p className="empty">No items to checkout.</p>
      ) : (
        <div className="checkout-card">
          {/* Items */}
          <div className="checkout-section">
            <p className="section-title">Your Items</p>
            <ul className="checkout-items">
              {mergedItems.map((item) => (
                <li key={item.id} className="checkout-item">
                  <img src={item.image} alt={item.name} />
                  <div className="checkout-info">
                    <h3>{item.name}</h3>
                    <p>{item.price}</p>
                    <span className="quantity-badge">Qty: {item.quantity}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery */}
          <div className="checkout-section">
            <p className="section-title">Delivery Details</p>
            <form
              className="delivery-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="form-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Delivery Address</label>
                <textarea
                  name="address"
                  placeholder="Street, City, Area..."
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Phone Number</label>
                <input
                  type="number"
                  name="phone"
                  placeholder="98XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </form>
          </div>

          {/* Payment */}
          <div className="checkout-section">
            <p className="section-title">Payment Method</p>
            <div className="payment-options">
              <label
                className={`payment-option ${paymentMethod === "Khalti" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Khalti"
                  checked={paymentMethod === "Khalti"}
                  onChange={handlePaymentChange}
                />
                <div className="payment-option-label">
                  <span>Pay with Khalti</span>
                  <small>Secure digital wallet</small>
                </div>
              </label>
              <label
                className={`payment-option ${paymentMethod === "eSewa" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="eSewa"
                  checked={paymentMethod === "eSewa"}
                  onChange={handlePaymentChange}
                />
                <div className="payment-option-label">
                  <span>Pay with eSewa</span>
                  <small>Coming soon</small>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="checkout-section">
            <p className="section-title">Order Summary</p>
            <div className="order-summary">
              <div className="summary-row">
                <span>Items ({mergedItems.length})</span>
                <span>{formattedTotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span style={{ color: "#4caf50" }}>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formattedTotal}</span>
              </div>
            </div>
          </div>

          {/* Place Order */}
          <button
            className="checkout-button"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
          >
            {paymentMethod === "Khalti" && !location.state?.khaltiPaid
              ? "Proceed to Pay"
              : isPlacingOrder
                ? "Placing Order..."
                : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
}
