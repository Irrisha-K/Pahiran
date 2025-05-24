import CardsUI from "../../shared/components/UIElements/Card";
import NewArrivalsItem from "./NewArrivalsItem";
import Card from "../../shared/components/UIElements/Card";

import "./NewArrivalsList.css";

export default function NewArrivalsList(props) {
  if (props.items.length === 0) {
    return (
      <div className="no-product-container">
        <CardsUI className="no-product">
          <p className="no-product-text">
            No Items Found! Please Try Again Later!
          </p>
          {/* <button className="button">Share Place</button> */}
        </CardsUI>
      </div>
    );
  }

  return (
    <ul className="product-list">
      {props.items.map((item) => (
        <NewArrivalsItem
          key={item.id}
          id={item.id}
          image={item.image}
          name={item.name}
          price={item.price}
        />
      ))}
    </ul>
  );
}
