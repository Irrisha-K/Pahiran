// // import { useContext } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { toast } from "react-toastify";

// import { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Card from "../../shared/components/UIElements/Card";
// import { AuthContext } from "../../store/AuthContext";
// import CartContext from "../../store/CartContext";
// import Button from "../../shared/components/UIElements/Button";
// import { toast } from "react-toastify";
// import "./ProductsItem.css";

// // import CartContext from "../../store/CartContext";
// // import Card from "../../shared/components/UIElements/Card";
// // import { AuthContext } from "../../store/AuthContext";
// // import Button from "../../shared/components/UIElements/Button";

// // export default function ProductsItem(props) {
// //   const cartCtx = useContext(CartContext);
// //   const authCtx = useContext(AuthContext);
// //   const navigate = useNavigate();

// //   function handleProductToCart() {
// //     if (!authCtx.isLoggedIn) {
// //       navigate("/auth");
// //       return;
// //     }

// //     const numericPrice =
// //       typeof props.price === "string"
// //         ? parseFloat(props.price.replace(/[^\d.]/g, ""))
// //         : Number(props.price);

// //     const cleanedItem = {
// //       ...props,
// //       numericPrice,
// //     };

// //     cartCtx.addItem(cleanedItem);

// //     toast.success(`${props.name} added to cart!`, {
// //       style: {
// //         backgroundColor: "#000",
// //         color: "#fff",
// //         fontWeight: "bold",
// //         borderRadius: "10px",
// //       },
// //     });
// //   }

// //   return (
// //     <li className="product-item">
// //       <Card className="product-item__content">
// //         <div className="product-item__image">
// //           <img src={props.image} alt={props.name} />
// //           <img
// //             src={`http://localhost:5001/${props.image}`}
// //             alt={props.name}
// //             className="product-image"
// //           />
// //         </div>

// //         <div className="product-item__info">
// //           <h2 className="product-item__title">
// //             {props.name} <br />
// //             <span className="product-item__price">Rs {props.price}</span>
// //           </h2>
// //           <span className="product-item__price">
// //             Quantity Left:{props.quantity}
// //           </span>
// //         </div>

// //         <div className="product-item__buttons">
// //           {/* <button
// //             className="btn--view btn--details"
// //             onClick={() => navigate(`/product/${props.id}`)}
// //           >
// //             VIEW DETAILS
// //           </button> */}
// //           <Button
// //             className="btn--view btn--details"
// //             onClick={() => navigate(`/product/${props.id}`)}
// //           >
// //             VIEW DETAILS
// //           </Button>

// //           {authCtx.role === "admin" ? (
// //             <button className="btn--view btn--details">DELETE</button>
// //           ) : (
// //             <button
// //               className="btn--view btn--add"
// //               onClick={handleProductToCart}
// //             >
// //               ADD TO CART
// //             </button>
// //           )}
// //         </div>
// //       </Card>
// //     </li>
// //   );
// // }
// export default function ProductsItem(props) {
//   const [quantity, setQuantity] = useState(props.quantity);
//   const [isLoading, setIsLoading] = useState(false);

//   const cartCtx = useContext(CartContext);
//   const authCtx = useContext(AuthContext);
//   const navigate = useNavigate();

//   async function decrementProductQuantity() {
//     try {
//       const res = await fetch(
//         `http://localhost:5001/api/products/${props.id}/decrement`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!res.ok) {
//         throw new Error("Failed to decrement product quantity");
//       }

//       const data = await res.json();
//       setQuantity(data.quantity); // Update local state to match backend
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update product quantity. Please try again.");
//     }
//   }

//   async function hanldeProductDelete() {
//     if (!window.confirm("Are you sure you want to delete this product?"))
//       return;

//     try {
//       const res = await fetch(
//         `http://localhost:5001/api/products/${props.id}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!res.ok) {
//         throw new Error("Failed to delete product");
//       }

//       const data = await res.json();

//       // Show toast
//       toast.success("Product deleted successfully!");

//       // Notify parent to remove product from list
//       if (props.onProductDeleted) {
//         props.onProductDeleted(props.id);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Could not delete product. Please try again.");
//     }
//   }

//   async function handleProductToCart() {
//     if (!authCtx.isLoggedIn) {
//       navigate("/auth");
//       return;
//     }

//     if (quantity === 0) {
//       toast.warning("This product is out of stock!");
//       return;
//     }

//     const numericPrice =
//       typeof props.price === "string"
//         ? parseFloat(props.price.replace(/[^\d.]/g, ""))
//         : Number(props.price);

//     const cleanedItem = {
//       ...props,
//       numericPrice,
//     };

//     cartCtx.addItem(cleanedItem);

//     setIsLoading(true);
//     await decrementProductQuantity();
//     setIsLoading(false);

//     toast.success(`${props.name} added to cart!`, {
//       style: {
//         backgroundColor: "#000",
//         color: "#fff",
//         fontWeight: "bold",
//         borderRadius: "10px",
//       },
//     });
//   }

//   return (
//     <li className="product-item">
//       <Card className="product-item__content">
//         <div className="product-item__image">
//           <img src={props.image} alt={props.name} />

//           <img
//             src={`http://localhost:5001/${props.image}`}
//             alt={props.name}
//             className="product-image"
//           />
//         </div>

//         <div className="product-item__info">
//           <h2 className="product-item__title">
//             {props.name} <br />
//             <span className="product-item__price">Rs {props.price}</span>
//           </h2>
//           <span className="product-item__quantity">
//             {quantity > 0 ? `Quantity Left: ${quantity}` : "Out of stock"}
//           </span>
//         </div>

//         <div className="product-item__buttons">
//           <Button
//             className="btn--view btn--details"
//             onClick={() => navigate(`/product/${props.id}`)}
//           >
//             VIEW DETAILS
//           </Button>

//           {authCtx.role === "admin" ? (
//             <button
//               className="btn--view btn--details"
//               onClick={hanldeProductDelete}
//             >
//               DELETE
//             </button>
//           ) : (
//             <button
//               className="btn--view btn--add"
//               onClick={handleProductToCart}
//               disabled={quantity === 0 || isLoading}
//             >
//               {isLoading
//                 ? "ADDING..."
//                 : quantity === 0
//                 ? "OUT OF STOCK"
//                 : "ADD TO CART"}
//             </button>
//           )}
//         </div>
//       </Card>
//     </li>
//   );
// }

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../store/AuthContext";
import CartContext from "../../store/CartContext";
import Button from "../../shared/components/UIElements/Button";
import { toast } from "react-toastify";
import ConfirmModal from "../../shared/components/UIElements/ConfirmModal"; // Import modal!
import "./ProductsItem.css";

export default function ProductsItem(props) {
  const [quantity, setQuantity] = useState(props.quantity);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // For modal visibility

  const cartCtx = useContext(CartContext);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  async function decrementProductQuantity() {
    try {
      const res = await fetch(
        `http://localhost:5001/api/products/${props.id}/decrement`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to decrement product quantity");
      }

      const data = await res.json();
      setQuantity(data.quantity);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product quantity. Please try again.");
    }
  }

  async function hanldeProductDelete() {
    try {
      const res = await fetch(
        `http://localhost:5001/api/products/${props.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      await res.json();
      toast.success("Product deleted successfully!");
      if (props.onProductDeleted) {
        props.onProductDeleted(props.id);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not delete product. Please try again.");
    } finally {
      setShowConfirm(false); // Close modal
    }
  }

  async function handleProductToCart() {
    if (!authCtx.isLoggedIn) {
      navigate("/auth");
      return;
    }

    if (quantity === 0) {
      toast.warning("This product is out of stock!");
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

    setIsLoading(true);
    await decrementProductQuantity();
    setIsLoading(false);

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
    <>
      {showConfirm && (
        <ConfirmModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this product?"
          onConfirm={hanldeProductDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <li className="product-item">
        <Card className="product-item__content">
          <div className="product-item__image">
            <img src={props.image} alt={props.name} />

            {/* <img
              src={`http://localhost:5001/${props.image}`}
              alt={props.name}
            /> */}
          </div>

          <div className="product-item__info">
            <h2 className="product-item__title">
              {props.name} <br />
              <span className="product-item__price">Rs {props.price}</span>
            </h2>
            <span className="product-item__quantity">
              {quantity > 0 ? `Quantity Left: ${quantity}` : "Out of stock"}
            </span>
          </div>

          <div className="product-item__buttons">
            <Button
              className="btn--view btn--details"
              onClick={() => navigate(`/product/${props.id}`)}
            >
              VIEW DETAILS
            </Button>
            {authCtx.role === "admin" ? (
              <>
                <Button
                  className="btn--view btn--details"
                  onClick={() => navigate(`/admin/update/${props.id}`)}
                >
                  UPDATE PRODUCT
                </Button>

                <button
                  className="btn--view btn--details"
                  onClick={() => setShowConfirm(true)}
                >
                  DELETE
                </button>
              </>
            ) : (
              <button
                className="btn--view btn--add"
                onClick={handleProductToCart}
                disabled={quantity === 0 || isLoading}
              >
                {isLoading
                  ? "ADDING..."
                  : quantity === 0
                  ? "OUT OF STOCK"
                  : "ADD TO CART"}
              </button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
}
