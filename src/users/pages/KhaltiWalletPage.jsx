// users/pages/KhaltiWalletPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./KhaltiWalletPage.css";

function fmt(n) {
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(
    n || 0,
  );
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Build a flat transaction list from orders
function buildTransactions(orders) {
  const txns = [];
  for (const o of orders) {
    if (o.paymentMethod === "Khalti") {
      // Purchase debit
      txns.push({
        id: `pay-${o._id}`,
        type: "debit",
        label: `Order #${o._id.slice(-6).toUpperCase()}`,
        sub: o.items?.map((i) => i.name).join(", ") || "",
        amount: o.total,
        date: o.createdAt,
        badge: o.status,
      });

      // Refund credit (completed)
      if (o.refundStatus === "refunded") {
        txns.push({
          id: `ref-${o._id}`,
          type: "credit",
          label: `Refund — Order #${o._id.slice(-6).toUpperCase()}`,
          sub: o.refundNote || "Refund processed",
          amount: o.total,
          date: o.refundScheduledAt || o.createdAt,
          badge: "refunded",
        });
      }

      // Pending refund (still processing)
      if (o.refundStatus === "processing") {
        txns.push({
          id: `pref-${o._id}`,
          type: "pending",
          label: `Refund pending — Order #${o._id.slice(-6).toUpperCase()}`,
          sub: o.refundNote || "Your refund is being processed",
          amount: o.total,
          date: o.refundScheduledAt,
          badge: "processing",
        });
      }
    }
  }
  // Most recent first
  return txns.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default function KhaltiWalletPage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [khaltiPhone, setKhaltiPhone] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    const loadData = async () => {
      try {
        const [balRes, ordRes] = await Promise.all([
          fetch("http://localhost:5001/api/khalti/balance", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5001/api/purchase/orders/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const balData = await balRes.json();
        const ordData = await ordRes.json();

        if (balRes.ok) {
          setBalance(balData.balance ?? 0);
          setKhaltiPhone(balData.khaltiPhone ?? null);
        }
        if (ordRes.ok) setOrders(ordData.orders || []);
      } catch {
        setError("Failed to load wallet data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, navigate]);

  const transactions = buildTransactions(orders);
  const khaltiOrders = orders.filter((o) => o.paymentMethod === "Khalti");
  const totalSpent = khaltiOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);
  const totalRefunded = orders
    .filter((o) => o.refundStatus === "refunded")
    .reduce((s, o) => s + o.total, 0);
  const pendingRefund = orders
    .filter((o) => o.refundStatus === "processing")
    .reduce((s, o) => s + o.total, 0);

  if (loading)
    return (
      <div className="kw-page">
        <div className="kw-loader">
          <span />
          <span />
          <span />
          <p>Loading your wallet…</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="kw-page">
        <p className="kw-error">{error}</p>
      </div>
    );

  return (
    <div className="kw-page">
      {/* ── Wallet card ── */}
      <div className="kw-card">
        <div className="kw-card__header">
          <div className="kw-card__brand">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              width="20"
              height="20"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>Khalti Wallet</span>
          </div>
          <span className="kw-card__demo-pill">Demo</span>
        </div>

        <p className="kw-card__balance-label">Available Balance</p>
        <div className="kw-card__balance">
          <span className="kw-card__currency">Rs</span>
          <span className="kw-card__amount">{fmt(balance)}</span>
        </div>

        {khaltiPhone && (
          <div className="kw-card__phone">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="13"
              height="13"
            >
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
            </svg>
            {khaltiPhone}
          </div>
        )}
      </div>

      {/* ── Stats strip ── */}
      <div className="kw-stats">
        <div className="kw-stat">
          <span className="kw-stat__icon">🛍</span>
          <span className="kw-stat__label">Total Spent</span>
          <span className="kw-stat__val kw-stat__val--red">
            Rs {fmt(totalSpent)}
          </span>
        </div>
        <div className="kw-stat">
          <span className="kw-stat__icon">💰</span>
          <span className="kw-stat__label">Refunded</span>
          <span className="kw-stat__val kw-stat__val--green">
            Rs {fmt(totalRefunded)}
          </span>
        </div>
        <div className="kw-stat">
          <span className="kw-stat__icon">⏳</span>
          <span className="kw-stat__label">Pending Refund</span>
          <span className="kw-stat__val kw-stat__val--amber">
            Rs {fmt(pendingRefund)}
          </span>
        </div>
      </div>

      {/* ── Transaction history ── */}
      <div className="kw-section">
        <h3 className="kw-section__title">Transaction History</h3>

        {transactions.length === 0 ? (
          <div className="kw-empty">
            <span className="kw-empty__icon">💳</span>
            <p className="kw-empty__title">No Khalti transactions yet</p>
            <p className="kw-empty__sub">
              Purchases and refunds made via Khalti will appear here.
            </p>
          </div>
        ) : (
          <div className="kw-txns">
            {transactions.map((txn) => (
              <div key={txn.id} className={`kw-txn kw-txn--${txn.type}`}>
                <div className={`kw-txn__icon kw-txn__icon--${txn.type}`}>
                  {txn.type === "debit"
                    ? "↑"
                    : txn.type === "credit"
                      ? "↓"
                      : "⏱"}
                </div>

                <div className="kw-txn__info">
                  <span className="kw-txn__label">{txn.label}</span>
                  {txn.sub && <span className="kw-txn__sub">{txn.sub}</span>}
                  <span className="kw-txn__date">{fmtDate(txn.date)}</span>
                </div>

                <div className="kw-txn__right">
                  <span
                    className={`kw-txn__amount kw-txn__amount--${txn.type}`}
                  >
                    {txn.type === "debit"
                      ? "−"
                      : txn.type === "credit"
                        ? "+"
                        : "~"}
                    Rs {fmt(txn.amount)}
                  </span>
                  <span className={`kw-txn__badge kw-txn__badge--${txn.badge}`}>
                    {txn.type === "pending"
                      ? "Refund ~1 hr"
                      : txn.badge === "refunded"
                        ? "Refunded"
                        : txn.badge === "cancelled"
                          ? "Cancelled"
                          : txn.badge === "delivered"
                            ? "Delivered"
                            : txn.badge === "shipped"
                              ? "Shipped"
                              : "Paid"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Demo notice ── */}
      <p className="kw-demo-note">
        🔒 This is a demo Khalti wallet. Every new account starts with Rs
        10,000. Balances reset if the database is cleared.
      </p>
    </div>
  );
}
