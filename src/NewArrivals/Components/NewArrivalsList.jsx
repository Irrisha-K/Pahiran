import Card from "../../shared/components/UIElements/Card";
import NewArrivalsItem from "./NewArrivalsItem";

import "./NewArrivalsList.css";

export default function NewArrivalsList(props) {
  if (props.items.length === 0) {
    return (
      <div className="product-list center">
        <Card className="no-product">
          <p>No Places Found! Maybe Create One?</p>
          <button>Share Place</button>
        </Card>
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
