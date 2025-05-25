// // import "./ProductsPage.css";
// import NewArrivalsList from "../../NewArrivals/Components/NewArrivalsList";

// const products = [
//   {
//     id: 1,
//     name: "Black Sweatpants",
//     price: 1899,
//     originalPrice: 3226,
//     discount: 41,
//     image: "/images/sweatp.jpg",
//   },
//   {
//     id: 2,
//     name: "White Silk Pajama Set",
//     price: 1899,
//     originalPrice: 2847,
//     discount: 33,
//     image: "/images/whsilkpj.jpg",
//   },
//   {
//     id: 3,
//     name: "White Long Coat",
//     price: "Rs. 2,199",
//     image: "/images/wcoat.jpg",
//   },
//   {
//     id: 4,
//     name: "Polka Pajama Set",
//     price: "Rs. 2,199",
//     image: "/images/polkapj.jpg",
//   },
//   {
//     id: 5,
//     name: "White Tshirt",
//     price: "Rs. 2,199",
//     image: "/images/whi.jpg",
//   },
//   {
//     id: 6,
//     name: "Black Silk Pajama Set",
//     price: "Rs. 2,199",
//     image: "/images/blsipj.jpg",
//   },
//   {
//     id: 7,
//     name: "Red Leather Coat",
//     price: "Rs. 2,199",
//     image: "/images/redlejacket.jpg",
//   },
//   {
//     id: 8,
//     name: "Floral Print Satin Skirt",
//     price: "Rs. 2,199",
//     image: "/images/silskirt.jpg",
//   },
//   {
//     id: 9,
//     name: "High Waist Jeans",
//     price: "Rs. 2,199",
//     image: "/images/highj.jpg",
//   },
//   {
//     id: 10,
//     name: "Wool co-ord set",
//     price: "Rs. 2,199",
//     image: "/images/wollset.jpg",
//   },
//   {
//     id: 11,
//     name: "Minimal Pastel Pink Lehenga",
//     price: "Rs. 2,199",
//     image: "/images/pinleh.jpg",
//   },
//   {
//     id: 12,
//     name: "Floral Print Crop Top",
//     price: "Rs. 2,199",
//     image: "/images/redt.jpg",
//   },
//   {
//     id: 13,
//     name: "Full Set pj",
//     price: "Rs. 2,199",
//     image: "/images/bwpj.jpg",
//   },
//   {
//     id: 14,
//     name: "Black Skinny Jeans",
//     price: "Rs. 2,199",
//     image: "/images/blskinny.jpg",
//   },
// ];

// const BestSellersPage = () => {
//   return (
//     <>
//       {/* <ImageSlider /> */}
//       <NewArrivalsList items={products} />
//     </>
//   );
// };

// export default BestSellersPage;

// import { useEffect, useState } from "react";
// import NewArrivalsList from "../../NewArrivals/Components/NewArrivalsList";

// const BestSellersPage = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch(
//           "http://localhost:5001/api/products/best-seller"
//         );
//         const data = await res.json();
//         setProducts(data);
//       } catch (err) {
//         console.error("Failed to fetch products:", err);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return <NewArrivalsList items={products} />;
// };

// export default BestSellersPage;

import { useEffect, useState } from "react";
import NewArrivalsList from "../../NewArrivals/Components/NewArrivalsList";
import CardsUI from "../../shared/components/UIElements/Card";
import ProductsList from "../components/ProductsList";

const BestSellersPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null); // ⬅️ error state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5001/api/products/best-seller"
        );
        if (!res.ok) {
          throw new Error("Something went wrong!");
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products. Please check your network.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="no-product-container">
        <CardsUI className="no-product">
          <p className="no-product-text">Loading products...</p>
        </CardsUI>
      </div>
    );
  }

  if (error) {
    return (
      <div className="no-product-container">
        <CardsUI className="no-product">
          <p className="no-product-text">{error}</p>
        </CardsUI>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="no-product-container">
        <CardsUI className="no-product">
          <p className="no-product-text">
            No Items Found! Please Try Again Later!
          </p>
        </CardsUI>
      </div>
    );
  }

  return <ProductsList items={products} />;
  // return <NewArrivalsList items={products} />;
};

export default BestSellersPage;
