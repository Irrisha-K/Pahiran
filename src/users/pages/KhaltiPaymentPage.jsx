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
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch("http://localhost:5001/api/purchase/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Order failed");
      }

      toast.success("Payment successful! Order placed.");
      const userId = localStorage.getItem("userId");
      localStorage.removeItem(`cart-${userId}`);
      clearCart();
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      setIsPaying(false);
    }
  };

  const formattedAmount = new Intl.NumberFormat("en-IN").format(amount || 0);

  return (
    <div className="khalti-page">
      <div className="khalti-card">
        {/* Brand header */}
        <div className="khalti-brand">
          <div className="khalti-logo">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#534AB7"
              strokeWidth="2.2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <p className="brand-name">Khalti Payment</p>
            <p className="brand-sub">Secure digital wallet</p>
          </div>
        </div>

        {/* Amount */}
        <div className="khalti-amount">
          <span className="amount-label">Amount due</span>
          <span className="amount-value">Rs. {formattedAmount}</span>
        </div>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="khalti-field">
            <label>Khalti phone number</label>
            <input
              type="tel"
              placeholder="98XXXXXXXX"
              value={khaltiPhone}
              onChange={(e) => setKhaltiPhone(e.target.value)}
              maxLength={10}
              required
            />
          </div>

          <div className="khalti-field">
            <label>Khalti MPIN</label>
            <input
              type="password"
              placeholder="Enter your MPIN"
              value={khaltiPassword}
              onChange={(e) => setKhaltiPassword(e.target.value)}
              required
            />
          </div>

          <button
            className={`khalti-btn ${isPaying ? "loading" : ""}`}
            onClick={handlePayment}
            disabled={!isFormValid || isPaying}
          >
            {isPaying ? (
              <span className="btn-inner">
                <span className="spinner" />
                Processing...
              </span>
            ) : (
              `Pay Rs. ${formattedAmount}`
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="khalti-footer">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Secured by Khalti
        </div>
      </div>
    </div>
  );
}
