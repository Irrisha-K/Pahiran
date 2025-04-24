import { useContext } from "react";
import CartContext from "../../store/CartContext";
import "./CartPage.css";

export default function CartPage() {
  const { items, removeItem, clearCart } = useContext(CartContext);

  const totalAmount = items.reduce((acc, item) => {
    const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    return acc + numericPrice * item.quantity;
  }, 0);

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-items">
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>Price: {item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <p>Total: Rs. {totalAmount.toFixed(2)}</p>
            <button onClick={clearCart}>Clear Cart</button>
            {/* You can add a "Checkout" button here */}
          </div>
        </>
      )}
    </div>
  );
}
