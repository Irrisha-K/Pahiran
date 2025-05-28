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

  const [modalMessage, setModalMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

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

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("category", formData.category);
    form.append("quantity", formData.quantity);
    form.append("image", formData.imageFile);

    try {
      const res = await fetch("http://localhost:5001/api/products/addProduct", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add product");
      }

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

      setModalMessage("Product added successfully!");
      setIsModalVisible(true);
    } catch (err) {
      console.error(err);
      setModalMessage(err.message || "An error occurred.");
      setIsModalVisible(true);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
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
            required
            value={formData.price}
            onChange={handleChange}
          />
          {/* <input
            type="text"
            name="category"
            placeholder="Category"
            required
            value={formData.category}
            onChange={handleChange}
          /> */}
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="tops">Top</option>
            <option value="pants">Pants</option>
            <option value="dresses">Dresses</option>
            <option value="skirts">Skirts</option>
            <option value="coords">Coords</option>
          </select>

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

      {isModalVisible && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
