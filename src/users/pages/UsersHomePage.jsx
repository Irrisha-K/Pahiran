import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/AuthContext";
import { FaEnvelope, FaUser, FaPhone } from "react-icons/fa";
import { toast } from "react-toastify";

import "./UsersHomePage.css";
import { useNavigate } from "react-router-dom";

export default function UsersHomePage() {
  const { userId, token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    number: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch user data");

        setUser(data);
        setFormValues({
          name: data.name,
          email: data.email,
          number: data.number || "",
        });
      } catch (err) {
        toast.error(err.message || "Something went wrong.");
        setError(err.message);
      }
    };

    if (userId && token) {
      fetchUser();
    }
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5001/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formValues),
      });

      const updatedUser = await res.json();
      if (!res.ok) throw new Error(updatedUser.message);

      setUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(`Update failed: ${err.message}`);
    }
  };

  if (error) return <div className="user-error">{error}</div>;
  if (!user) return <div className="user-loading">Loading user details...</div>;

  function goToHistory() {
    navigate("/mypurchasehistory");
  }

  return (
    <div className="user-page-wrapper">
      <div className="user-card">
        <h2 className="user-title">Welcome, {user.name}</h2>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="user-edit-form">
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              type="number"
              name="number"
              value={formValues.number}
              onChange={handleChange}
              placeholder="Phone Number"
            />
            <button type="submit">Save</button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                toast.info("Edit cancelled.");
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="user-info">
            <div className="user-item">
              <FaUser className="user-icon" />
              <span>Name: {user.name}</span>
            </div>
            <div className="user-item">
              <FaEnvelope className="user-icon" />
              <span>Email: {user.email}</span>
            </div>
            <div className="user-item">
              <FaPhone className="user-icon" />
              <span>Phone: {user.number || "Not Provided"}</span>
            </div>
            <button onClick={() => setIsEditing(true)}>Update Profile</button>
            <button onClick={goToHistory}>My Purchase History</button>
          </div>
        )}

        <p className="user-role">
          Logged in as <strong>{user.role}</strong>
        </p>
      </div>
    </div>
  );
}
