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
  const { items } = location.state || { items: [] };
  const [mergedItems, setMergedItems] = useState(mergeItems(items));

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

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

    if (method === "Khalti") {
      window.open("https://khalti.com/", "_blank");
    }
  };

  const cartTotal = mergedItems.reduce(
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

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.address || !formData.phone) {
      toast.error("Please fill all delivery details.");
      return;
    }

    if (items.length === 0) {
      toast.error("No items in cart.");
      return;
    }

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
      setTimeout(() => navigate("/"), 3000);
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

  const handleQuantityChange = (id, delta) => {
    setMergedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          const limitedQty = Math.min(item.stock, Math.max(1, newQty));
          return { ...item, quantity: limitedQty };
        }
        return item;
      })
    );
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      {items.length === 0 ? (
        <p className="empty">No items to checkout.</p>
      ) : (
        <>
          {/* <ul className="checkout-items">
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
          </ul> */}
          <ul className="checkout-items">
            {mergedItems.map((item) => (
              <li key={item.id} className="checkout-item">
                <img src={item.image} alt={item.name} />
                <div className="checkout-info">
                  <h3>Name: {item.name}</h3>
                  <p>Rs: {item.price}</p>
                  <div className="quantity-control">
                    <button onClick={() => handleQuantityChange(item.id, -1)}>
                      -
                    </button>
                    Quantity:
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>
                      +
                    </button>
                  </div>
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
              pattern="[0-9]{10}"
              title="Enter a 10-digit number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </form>
          <div className="payment-methods">
            <h3>Payment Method</h3>
            <label>
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={handlePaymentChange}
              />
              Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="Khalti"
                checked={paymentMethod === "Khalti"}
                onChange={handlePaymentChange}
              />
              Pay with Khalti
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="eSewa"
                checked={paymentMethod === "eSewa"}
                onChange={handlePaymentChange}
              />
              Pay with eSewa (Coming Soon)
            </label>
          </div>

          <div className="checkout-summary">
            <p className="checkout-total">Total: {formattedTotal}</p>

            <button
              className="checkout-button"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
