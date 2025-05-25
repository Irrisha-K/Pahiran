import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CartContext from "../../store/CartContext";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../store/AuthContext";
import "./ProductsItem.css";

export default function ProductsItem(props) {
  const cartCtx = useContext(CartContext);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  function handleProductToCart() {
    if (!authCtx.isLoggedIn) {
      navigate("/auth");
      return;
    }

    const numericPrice =
      typeof props.price === "string"
        ? parseFloat(props.price.replace(/[^\d.]/g, ""))
        : Number(props.price);

    const cleanedItem = {
      ...props,
      numericPrice,
    };

    cartCtx.addItem(cleanedItem);

    toast.success(`${props.name} added to cart!`, {
      style: {
        backgroundColor: "#000",
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "10px",
      },
    });
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
            onClick={() => navigate(`/product/${props.id}`)}
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
