import Card from "../../shared/components/UIElements/Card";
import ProductsItem from "./ProductsItem";

import "./ProductsList.css";

export default function ProductsList(props) {
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
      {props.items.map((place) => (
        <ProductsItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
        />
      ))}
    </ul>
  );
}
