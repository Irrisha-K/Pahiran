import Card from "../../shared/components/UIElements/Card";
import ProductsItem from "./ProductsItem";

import "./ProductsList.css";

export default function ProductsList(props) {
  // if (props.items.length === 0) {
  //   return (
  //     <div className="product-list center">
  //       <Card className="no-product">
  //         <p>No Places Found! Maybe Create One?</p>
  //         <button>Share Place</button>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <ul className="product-list">
      {props.items.map((item) => (
        <ProductsItem
          key={item._id} // ✅ Add this!
          id={item._id}
          name={item.name}
          image={item.image}
          price={item.price}
          category={item.category}
        />
      ))}
    </ul>
    // <ul className="product-list">
    //   {props.items.map((item) => (
    //     <li key={item._id} className="product-item">
    //       <ProductsItem
    //         id={item._id}
    //         name={item.name}
    //         image={item.image}
    //         price={item.price}
    //         category={item.category}
    //       />
    //     </li>
    //   ))}
    // </ul>
  );
}

// import Card from "../../shared/components/UIElements/Card";
// import ProductsItem from "./ProductsItem";
// import "./ProductsList.css";

// export default function ProductsList(props) {
//   return (
//     <ul className="product-list">
//       {props.items.map((item) => (
//         <li key={item._id} className="product-item">
//           <ProductsItem
//             id={item._id}
//             name={item.name}
//             image={item.image}
//             price={item.price}
//             category={item.category}
//           />
//         </li>
//       ))}
//     </ul>
//   );
// }
