import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import allProducts from "./AllProducts"; // a combined list of all product data

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResultsPage() {
  const query = useQuery().get("query") || "";

  const filteredItems = useMemo(() => {
    return allProducts.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div>
      <h2>Search Results for: "{query}"</h2>
      {filteredItems.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="product-list">
          {filteredItems.map((item) => (
            <div key={item.id} className="product-item">
              <img src={item.image} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// import { useLocation } from "react-router-dom";
// import { useMemo } from "react";
// import allProducts from "./AllProducts";

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

// export default function SearchResultsPage() {
//   const query = useQuery().get("query") || "";

//   const filteredItems = useMemo(() => {
//     return allProducts.filter((item) =>
//       item.name.toLowerCase().includes(query.toLowerCase())
//     );
//   }, [query]);

//   return (
//     <div>
//       <h2>Search Results for: "{query}"</h2>
//       {filteredItems.length === 0 ? (
//         <p>No results found.</p>
//       ) : (
//         <div className="product-list">
//           {filteredItems.map((item) => (
//             <div key={item.id} className="product-item">
//               <img src={`/assets/images/${item.image}`} alt={item.name} />
//               <div>
//                 <h3>{item.name}</h3>
//                 <p>{item.price}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
