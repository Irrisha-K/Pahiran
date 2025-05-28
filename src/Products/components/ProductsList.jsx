import { useEffect, useState } from "react";
import ProductsItem from "./ProductsItem";

export default function ProductsList(props) {
  const [productList, setProductList] = useState(props.items);

  useEffect(() => {
    setProductList(props.items);
  }, [props.items]);

  const handleProductDeleted = (deletedProductId) => {
    setProductList((prev) => prev.filter((p) => p._id !== deletedProductId));
  };

  return (
    <ul className="product-list">
      {productList.map((item) => (
        <ProductsItem
          key={item._id}
          id={item._id}
          name={item.name}
          image={item.image}
          price={item.price}
          category={item.category}
          quantity={item.quantity}
          onProductDeleted={handleProductDeleted}
        />
      ))}
    </ul>
  );
}
