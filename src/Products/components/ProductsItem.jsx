import { useContext } from "react";
import Card from "../../shared/components/UIElements/Cards";
import "./ProductsItem.css";
import CartContext from "../../store/CartContext";

export default function ProductsItem(props) {
  const cartCtx = useContext(CartContext);

  function handleProductToCart() {
    const cleanedItem = {
      ...props,
      numericPrice: parseFloat(props.price.replace(/[^\d]/g, "")), // ✅ FIXED
    };
    cartCtx.addItem(cleanedItem);
  }

  return (
    <li className="product-item">
      <Card className="product-item__content">
        <div className="product-item__image">
          <img src={props.image} alt={props.name} />
        </div>

        <div className="product-item__info">
          <h2 className="product-item__title">
            {props.name} <br />
            <span className="product-item__price">{props.price}</span>
          </h2>
        </div>

        <button className="btn--view" onClick={handleProductToCart}>
          ADD TO CART
        </button>
      </Card>
    </li>
  );
}
