import { useState, useEffect } from "react";
import "./AddProduct.css";

export default function AdminProductForm() {
  const [products, setProducts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  // Mock load from backend
  useEffect(() => {
    // TODO: Load from backend API
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      if (file) reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updated = [...products];
      updated[editingIndex] = formData;
      setProducts(updated);
      setEditingIndex(null);
    } else {
      setProducts([...products, formData]);
    }

    // TODO: Send to backend (POST/PUT)

    setFormData({ name: "", description: "", price: "", stock: "", image: "" });
  };

  const handleEdit = (index) => {
    setFormData(products[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);

    // TODO: Send delete to backend
  };

  return (
    <div className="admin-form-container">
      <h2>{editingIndex !== null ? "Edit Product" : "Add Product"}</h2>
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
          type="number"
          name="stock"
          placeholder="Stock"
          required
          value={formData.stock}
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
        <button type="submit">
          {editingIndex !== null ? "Update Product" : "Add Product"}
        </button>
      </form>

      <h3>Product List</h3>
      <div className="product-list">
        {products.length === 0 ? (
          <p>No products yet.</p>
        ) : (
          products.map((p, i) => (
            <div key={i} className="product-card">
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p>{p.description}</p>
              <p>💲{p.price}</p>
              <p>Stock: {p.stock}</p>
              <button onClick={() => handleEdit(i)}>Edit</button>
              <button onClick={() => handleDelete(i)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
