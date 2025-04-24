import { useContext } from "react";
import Card from "../../shared/components/UIElements/Card";

import "./ProductsItem.css";
import CartContext from "../../store/CartContext";

export default function ProductsItem(props) {
  const cartCtx = useContext(CartContext);

  function handleProductToCart() {
    cartCtx.addItem(props);
  }

  return (
    <>
      <li className="product-item">
        <Card className="product-item__content">
          <div className="product-item__image">
            <img src={props.image} alt={props.name} />\
          </div>

          <div className="product-item__info">
            <h2 className="product-item__title">
              {props.name} <br />
              <span className="product-item__price">{props.price}</span>
            </h2>
          </div>
          <div className="product-item__actions">
            <button className="btn--view" onClick={handleProductToCart}>
              ADD TO CART
            </button>
            {/* <button className="btn--edit">EDIT</button> */}
            {/* <button className="btn--delete">DELETE</button> */}
          </div>
        </Card>
      </li>
    </>
  );
}
