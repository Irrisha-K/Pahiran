import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./AdminUpdateProduct.css";
// import "./AddProduct.css";

export default function AdminUpdateProduct() {
  const { id: productId } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    discount: "",
    image: "",
    category: "",
    description: "",
    quantity: "",
  });

  const [modalMessage, setModalMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/products/${productId}`
        );
        const data = await res.json();
        if (res.ok) {
          setFormData({
            ...data,
            imageFile: null,
          });
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [productId]);

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
    form.append("price", formData.price);
    form.append("originalPrice", formData.originalPrice);
    form.append("discount", formData.discount);
    form.append("category", formData.category);
    form.append("description", formData.description);
    form.append("quantity", formData.quantity);
    if (formData.imageFile) {
      form.append("image", formData.imageFile);
    }

    try {
      const res = await fetch(
        `http://localhost:5001/api/products/updateProduct/${productId}`,
        {
          method: "PUT",
          body: form,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update product");
      }
      setModalMessage("Product updated successfully!");
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
    <div className="admin-update-container">
      <h2>Update Product</h2>
      <form className="admin-update-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          required
          value={formData.name}
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
          name="originalPrice"
          placeholder="Original Price"
          value={formData.originalPrice}
          onChange={handleChange}
        />
        <input
          type="number"
          name="discount"
          placeholder="Discount (%)"
          value={formData.discount}
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
        <textarea
          name="description"
          placeholder="Description"
          required
          value={formData.description}
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
        <button type="submit">Update Product</button>
      </form>

      {isModalVisible && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
