// KhaltiPaymentPage.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
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
  const [walletBalance, setWalletBalance] = useState(null); // fetched on mount
  const [balanceLoading, setBalanceLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // ── Load current wallet balance ───────────────────────────────────────────
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/khalti/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setWalletBalance(data.balance);
          // Pre-fill phone if already registered
          if (data.khaltiPhone) setKhaltiPhone(data.khaltiPhone);
        }
      } catch {
        // non-fatal — user can still see the form
      } finally {
        setBalanceLoading(false);
      }
    };
    if (token) fetchBalance();
    else setBalanceLoading(false);
  }, [token]);

  const hasSufficientBalance =
    walletBalance === null || walletBalance >= (amount || 0);
  const isFormValid =
    khaltiPhone.trim().length === 10 &&
    khaltiPassword.trim().length >= 4 &&
    hasSufficientBalance;

  // ── Payment flow ──────────────────────────────────────────────────────────
  // Step 1: Call /api/khalti/pay  — validates phone + deducts balance
  // Step 2: Create the order via /api/purchase/add
  const handlePayment = async () => {
    setIsPaying(true);
    try {
      // ── Step 1: deduct from demo wallet ───────────────────────────────────
      const payRes = await fetch("http://localhost:5001/api/khalti/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          phone: khaltiPhone,
          amount: amount,
        }),
      });

      const payData = await payRes.json();

      if (!payRes.ok) {
        // e.g. insufficient balance or wrong phone
        toast.error(payData.message || "Payment failed");
        setIsPaying(false);
        return;
      }

      // Update displayed balance immediately
      setWalletBalance(payData.newBalance);

      // ── Step 2: create order ──────────────────────────────────────────────
      const orderRes = await fetch("http://localhost:5001/api/purchase/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...orderData,
          paymentMethod: "Khalti",
          khaltiPhone, // stored on order for refund routing
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        // Order failed after deducting — refund the wallet back
        // (In production you'd handle this server-side atomically)
        await fetch("http://localhost:5001/api/khalti/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, phone: khaltiPhone, amount: -amount }),
        });
        throw new Error(err.message || "Order creation failed");
      }

      toast.success("Payment successful! Order placed.");
      localStorage.removeItem(`cart-${userId}`);
      clearCart();
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      setIsPaying(false);
    }
  };

  const fmt = (n) => new Intl.NumberFormat("en-IN").format(n || 0);
  const insufficient = walletBalance !== null && walletBalance < (amount || 0);

  return (
    <div className="khalti-page">
      <div className="khalti-card">
        {/* ── Brand header ── */}
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

        {/* ── Amount ── */}
        <div className="khalti-amount">
          <span className="amount-label">Amount due</span>
          <span className="amount-value">Rs. {fmt(amount)}</span>
        </div>

        {/* ── Wallet balance strip ── */}
        <div
          className={`khalti-balance-strip ${insufficient ? "khalti-balance-strip--low" : ""}`}
        >
          <span className="khalti-balance-strip__label">
            {balanceLoading ? "Checking balance…" : "Your Khalti balance"}
          </span>
          {!balanceLoading && walletBalance !== null && (
            <span
              className={`khalti-balance-strip__amount ${insufficient ? "red" : "green"}`}
            >
              Rs. {fmt(walletBalance)}
            </span>
          )}
        </div>

        {/* ── Insufficient balance warning ── */}
        {insufficient && (
          <div className="khalti-error-box">
            ⚠ Insufficient balance. You need Rs. {fmt(amount - walletBalance)}{" "}
            more.
            <br />
            <small>
              Please use Cash on Delivery or top up your demo wallet.
            </small>
          </div>
        )}

        {/* ── Form ── */}
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
              placeholder="Enter your MPIN (any 4+ digits)"
              value={khaltiPassword}
              onChange={(e) => setKhaltiPassword(e.target.value)}
              required
            />
          </div>

          <button
            className={`khalti-btn ${isPaying ? "loading" : ""} ${insufficient ? "disabled" : ""}`}
            onClick={handlePayment}
            disabled={!isFormValid || isPaying}
          >
            {isPaying ? (
              <span className="btn-inner">
                <span className="spinner" />
                Processing...
              </span>
            ) : insufficient ? (
              "Insufficient Balance"
            ) : (
              `Pay Rs. ${fmt(amount)}`
            )}
          </button>
        </form>

        {/* ── Footer ── */}
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
          Secured by Khalti · Demo Mode
        </div>
      </div>
    </div>
  );
}
