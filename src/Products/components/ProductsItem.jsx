import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../../store/CartContext";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../store/AuthContext";
import "./ProductsItem.css";

export default function ProductsItem(props) {
  const cartCtx = useContext(CartContext);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  // function handleProductToCart() {
  //   const cleanedItem = {
  //     ...props,
  //     numericPrice: parseFloat(props.price.replace(/[^\d]/g, "")),
  //   };
  //   cartCtx.addItem(cleanedItem);
  // }

  function handleProductToCart() {
    if (!authCtx.isLoggedIn) {
      navigate("/auth");
      return;
    }

    const cleanedItem = {
      ...props,
      numericPrice: parseFloat(props.price.replace(/[^\d]/g, "")),
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

        <div className="product-item__buttons">
          <button
            className="btn--view btn--details"
            onClick={handleProductToCart}
          >
            VIEW DETAILS
          </button>
          <button className="btn--view btn--add" onClick={handleProductToCart}>
            ADD TO CART
          </button>
        </div>
      </Card>
    </li>
  );
}
