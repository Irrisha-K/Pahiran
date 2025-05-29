// src/components/KhaltiPaymentPage.jsx

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import CartContext from "../../store/CartContext";
import "./KhaltiPaymentPage.css";

export default function KhaltiPaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, orderData } = location.state || {};
  const { clearCart } = useContext(CartContext);

  const [khaltiPhone, setKhaltiPhone] = useState("");
  const [khaltiPassword, setKhaltiPassword] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const isFormValid =
    khaltiPhone.trim().length === 10 && khaltiPassword.trim().length >= 4;

  const handlePayment = async () => {
    setIsPaying(true);

    try {
      // Simulate payment success
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Place order via API
      const response = await fetch("http://localhost:5001/api/purchase/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Order failed");
      }

      toast.success("Payment and order placed successfully!");

      // Clear localStorage and context cart
      const userId = localStorage.getItem("userId");
      localStorage.removeItem(`cart-${userId}`);
      clearCart();

      navigate("/"); // Go to homepage
    } catch (error) {
      toast.error(error.message);
      setIsPaying(false);
    }
  };

  return (
    <div className="khalti-payment-page">
      <h2>Mock Khalti Payment</h2>
      <p>Enter your Khalti credentials to proceed.</p>
      <form className="khalti-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="tel"
          placeholder="Khalti Phone Number"
          value={khaltiPhone}
          onChange={(e) => setKhaltiPhone(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Khalti Password"
          value={khaltiPassword}
          onChange={(e) => setKhaltiPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          onClick={handlePayment}
          disabled={!isFormValid || isPaying}
        >
          {isPaying ? "Processing..." : `Pay Now - Rs. ${amount}`}
        </button>
      </form>
    </div>
  );
}
