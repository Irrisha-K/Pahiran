import { useState } from "react";
import "./AddProduct.css";

const CATEGORIES = [
  { value: "home", label: "Home (Featured)" },
  { value: "bestseller", label: "Best Seller" },
  { value: "newarrival", label: "New Arrival" },
  { value: "tops", label: "Tops" },
  { value: "pants", label: "Pants" },
  { value: "dresses", label: "Dresses" },
  { value: "skirts", label: "Skirts" },
  { value: "coords", label: "Coords" },
];

export default function AdminProductForm() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    imageFile: null,
    category: "",
    quantity: "",
  });

  const [modalMessage, setModalMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
            imageFile: file,
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

    if (!formData.imageFile) {
      setModalMessage("Please select a product image.");
      setIsSuccess(false);
      setIsModalVisible(true);
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("category", formData.category);
    form.append("quantity", formData.quantity);
    form.append("image", formData.imageFile);

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5001/api/products/addProduct", {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add product");

      // Reset form
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
      setIsSuccess(true);
      setModalMessage(
        `"${data.product.name}" added successfully under "${data.product.category}"!`,
      );
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setModalMessage(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
      setIsModalVisible(true);
    }
  };

  return (
    <>
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
            min="0"
            step="0.01"
            required
            value={formData.price}
            onChange={handleChange}
          />

          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Category
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            min="0"
            required
            value={formData.quantity}
            onChange={handleChange}
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            required
            onChange={handleChange}
          />

          {formData.image && (
            <img src={formData.image} alt="Preview" className="preview-image" />
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>

      {isModalVisible && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <p style={{ color: isSuccess ? "green" : "red" }}>{modalMessage}</p>
            <button onClick={() => setIsModalVisible(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
