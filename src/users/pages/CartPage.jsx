import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CartContext from "../../store/CartContext";
import "./CartPage.css";

export default function CartPage() {
  const navigate = useNavigate();

  const { items, clearCart, increaseQuantity, decreaseQuantity, removeAll } =
    useContext(CartContext);

  const cartTotal = items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.numericPrice,
    0
  );

  const formattedTotal =
    "Rs. " +
    new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(
      cartTotal
    );

  return (
    <div className="cart-overlay">
      <div className="cart-slide">
        <h2>Your Cart</h2>
        {items.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <div className="cart-container">
            <ul className="cart-items">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>Price: {item.price}</p>
                    <div className="quantity-controls">
                      <button onClick={() => decreaseQuantity(item.id)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)}>
                        +
                      </button>
                    </div>

                    <button onClick={() => removeAll(item.id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-summary">
              <p className="cart-summary-total">Total: {formattedTotal}</p>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button onClick={clearCart} className="cart-summary-button">
                  Clear Cart
                </button>

                <button
                  onClick={() => {
                    const safeItems = items.map(
                      ({ id, name, quantity, price, numericPrice, image }) => ({
                        id,
                        name,
                        quantity,
                        price,
                        numericPrice,
                        image,
                      })
                    );
                    console.log("Navigating with safe items:", safeItems);
                    navigate("/checkout", { state: { items: safeItems } });
                  }}
                  className="cart-summary-button"
                >
                  Go To Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
