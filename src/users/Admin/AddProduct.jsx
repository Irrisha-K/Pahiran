// import { useState, useEffect } from "react";
// import "./AddProduct.css";

// export default function AdminProductForm() {
//   const [products, setProducts] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     image: "",
//     category: "",
//     quantity: "",
//   });

//   // Mock load from backend
//   useEffect(() => {
//     // TODO: Load from backend API
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "image") {
//       const file = files[0];
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData((prev) => ({ ...prev, image: reader.result }));
//       };
//       if (file) reader.readAsDataURL(file);
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const productToSend = {
//       name: formData.name,
//       description: formData.description,
//       price: Number(formData.price),
//       image: formData.image,
//       category: formData.category,
//       quantity: formData.quantity,
//     };

//     try {
//       const res = await fetch("http://localhost:5001/api/products/addProduct", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(productToSend),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to add product");
//       }

//       const data = await res.json();
//       console.log("Product created:", data);

//       // Update local state (optional)
//       setProducts([...products, { ...formData }]);
//       setFormData({
//         name: "",
//         description: "",
//         price: "",
//         image: "",
//         category: "",
//         quantity: "",
//       });
//       setEditingIndex(null);
//     } catch (err) {
//       console.error("Error submitting product:", err.message);
//       console.log(err);
//     }
//   };

//   const handleEdit = (index) => {
//     setFormData(products[index]);
//     setEditingIndex(index);
//   };

//   const handleDelete = (index) => {
//     const updated = products.filter((_, i) => i !== index);
//     setProducts(updated);

//     // TODO: Send delete to backend
//   };

//   return (
//     <div className="admin-form-container">
//       <h2>{editingIndex !== null ? "Edit Product" : "Add Product"}</h2>
//       <form className="product-form" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Product Name"
//           required
//           value={formData.name}
//           onChange={handleChange}
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           required
//           value={formData.description}
//           onChange={handleChange}
//         />
//         <input
//           type="number"
//           name="price"
//           placeholder="Price"
//           required
//           value={formData.price}
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="category"
//           placeholder="Category"
//           required
//           value={formData.category}
//           onChange={handleChange}
//         />

//         <input
//           type="number"
//           name="quantity"
//           placeholder="Quantity"
//           required
//           value={formData.quantity}
//           onChange={handleChange}
//         />
//         <input
//           type="file"
//           name="image"
//           accept="image/*"
//           onChange={handleChange}
//         />
//         {formData.image && (
//           <img src={formData.image} alt="Preview" className="preview-image" />
//         )}
//         <button type="submit">
//           {editingIndex !== null ? "Update Product" : "Add Product"}
//         </button>
//       </form>

//       <h3>Product List</h3>
//       <div className="product-list">
//         {products.length === 0 ? (
//           <p>No products yet.</p>
//         ) : (
//           products.map((p, i) => (
//             <div key={i} className="product-card">
//               <img src={p.image} alt={p.name} />
//               <h4>{p.name}</h4>
//               <p>{p.description}</p>
//               <p>💲{p.price}</p>
//               <p>Stock: {p.quantity}</p>
//               <button onClick={() => handleEdit(i)}>Edit</button>
//               <button onClick={() => handleDelete(i)}>Delete</button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import "./AddProduct.css";

export default function AdminProductForm() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    quantity: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            image: reader.result,
            imageFile: file, // Keep original File object
          }));
          setIsImageLoaded(true);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("category", formData.category);
    form.append("quantity", formData.quantity);
    form.append("image", formData.imageFile); // Use File object

    try {
      const res = await fetch("http://localhost:5001/api/products/addProduct", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      alert("Product added successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
        imageFile: null,
        category: "",
        quantity: "",
      });
      setIsImageLoaded(false);
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="admin-form-container">
      <h2>Add Product</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          required
          value={formData.price}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          required
          value={formData.category}
          onChange={handleChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          required
          value={formData.quantity}
          onChange={handleChange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        {formData.image && (
          <img src={formData.image} alt="Preview" className="preview-image" />
        )}
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}
