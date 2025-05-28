import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import CartContext from "../../store/CartContext";
import { AuthContext } from "../../store/AuthContext";
import { toast } from "react-toastify";
import "./ProductDetails.css";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const cartCtx = useContext(CartContext);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/products/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch product.");
        const data = await response.json();
        if (!data || !data.name)
          throw new Error("Product details not available.");
        setProduct(data);

        // Fetch related products by category (assuming your API supports this)
        const relatedResponse = await fetch(
          `http://localhost:5001/api/products?category=${encodeURIComponent(
            data.category
          )}&exclude=${id}`
        );
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedProducts(relatedData);
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const val = Math.max(
      1,
      Math.min(parseInt(e.target.value) || 1, product.stock)
    );
    setQuantity(val);
  };

  // const handleAddToCart = () => {
  //   if (!authCtx.isLoggedIn) {
  //     navigate("/auth");
  //     return;
  //   }

  //   const item = {
  //     ...product,
  //     numericPrice: parseFloat(product.price),
  //   };

  //   cartCtx.addItem(item);
  //   toast.success(`${product.name} added to cart!`, {
  //     style: {
  //       backgroundColor: "#000",
  //       color: "#fff",
  //       fontWeight: "bold",
  //       borderRadius: "10px",
  //     },
  //   });
  // };

  const handleAddToCart = () => {
    if (!authCtx.isLoggedIn) {
      navigate("/auth");
      return;
    }
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items left in stock.`);
      return;
    }

    const item = {
      ...product,
      numericPrice: parseFloat(product.price),
      quantity: quantity,
    };

    cartCtx.addItem(item);
    toast.success(`${product.name} (${quantity}) added to cart!`, {
      style: {
        backgroundColor: "#000",
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "10px",
      },
    });
  };

  if (error) return <div className="center error-message">{error}</div>;
  if (!product) return <div className="center loading-message">Loading...</div>;

  return (
    <div className="product-details-container">
      {/* Header Section */}
      <div className="top-nav">
        <button className="btn-back" onClick={() => navigate(-1)}>
          &larr; Back
        </button>

        <nav className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/products">Products</Link> /{" "}
          <span>{product.name}</span>
        </nav>
      </div>

      {/* Product Image */}
      <motion.img
        src={product.image}
        alt={product.name}
        className="details-image"
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", duration: 1 }}
      />

      {/* Product Info */}
      <motion.div
        className="details-info"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", duration: 1 }}
      >
        <h1 className="details-name">{product.name}</h1>
        <p className="price">₹{product.price}</p>
        {product.originalPrice && (
          <p className="original-price">MRP: ₹{product.originalPrice}</p>
        )}
        {product.discount && (
          <p className="discount">{product.discount}% OFF</p>
        )}
        <p className="category">Category: {product.category}</p>
        {product.description && (
          <p className="description">{product.description}</p>
        )}
        <p className="stock-info">Available: {product.quantity} items</p>
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={handleQuantityChange}
          style={{ width: "60px", marginBottom: "1rem" }}
        />
        <button className="btn-add-to-cart" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </motion.div>

      {/* Related Products */}
      {/* {relatedProducts.length > 0 && (
        <section className="related-products">
          <h2>Related Products</h2>
          <div className="related-products-list">
            {relatedProducts.map((rp) => (
              <div key={rp.id} className="related-product-item">
                <Link to={`/product/${rp.id}`}>
                  <img src={rp.image} alt={rp.name} />
                  <p>{rp.name}</p>
                  <p>₹{rp.price}</p>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )} */}
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <h2>Related Products</h2>
          <div className="related-products-grid">
            {relatedProducts.map((rp) => (
              <Link
                to={`/product/${rp._id}`}
                key={rp._id}
                className="related-product-item"
                onClick={() => window.scrollTo(0, 0)}
              >
                <img src={rp.image} alt={rp.name} />
                <p className="related-product-name">{rp.name}</p>
                <p className="related-product-price">₹{rp.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
