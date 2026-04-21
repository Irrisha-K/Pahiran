import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/AuthContext";
import {
  FaEnvelope,
  FaUser,
  FaPhone,
  FaHistory,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
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
          headers: { Authorization: `Bearer ${token}` },
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
    if (userId && token) fetchUser();
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

  if (error) return <div className="up-state up-error">{error}</div>;
  if (!user)
    return (
      <div className="up-state">
        <div className="up-spinner" />
        <p>Loading profile…</p>
      </div>
    );

  const initials = user.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="up-wrapper">
      <div className="up-card">
        {/* Avatar */}
        <div className="up-avatar-ring">
          <div className="up-avatar">{initials}</div>
        </div>

        {/* Name + role */}
        <h2 className="up-name">{user.name}</h2>
        <span className="up-role-badge">Member</span>

        <div className="up-divider" />

        {/* View mode */}
        {!isEditing ? (
          <>
            <div className="up-info-list">
              <div className="up-info-row">
                <div className="up-info-icon">
                  <FaUser />
                </div>
                <div className="up-info-content">
                  <span className="up-info-label">Full name</span>
                  <span className="up-info-value">{user.name}</span>
                </div>
              </div>
              <div className="up-info-row">
                <div className="up-info-icon">
                  <FaEnvelope />
                </div>
                <div className="up-info-content">
                  <span className="up-info-label">Email address</span>
                  <span className="up-info-value">{user.email}</span>
                </div>
              </div>
              <div className="up-info-row">
                <div className="up-info-icon">
                  <FaPhone />
                </div>
                <div className="up-info-content">
                  <span className="up-info-label">Phone number</span>
                  <span className="up-info-value">
                    {user.number || "Not provided"}
                  </span>
                </div>
              </div>
            </div>

            <div className="up-actions">
              <button
                className="up-btn up-btn--primary"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit /> Edit Profile
              </button>
              <button
                className="up-btn up-btn--ghost"
                onClick={() => navigate("/mypurchasehistory")}
              >
                <FaHistory /> Purchase History
              </button>
            </div>
          </>
        ) : (
          /* Edit mode */
          <form className="up-form" onSubmit={handleUpdate}>
            <div className="up-field">
              <label>Full name</label>
              <div className="up-input-wrap">
                <FaUser className="up-input-icon" />
                <input
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
            </div>
            <div className="up-field">
              <label>Email address</label>
              <div className="up-input-wrap">
                <FaEnvelope className="up-input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>
            </div>
            <div className="up-field">
              <label>Phone number</label>
              <div className="up-input-wrap">
                <FaPhone className="up-input-icon" />
                <input
                  type="number"
                  name="number"
                  value={formValues.number}
                  onChange={handleChange}
                  placeholder="98XXXXXXXX"
                />
              </div>
            </div>
            <div className="up-actions">
              <button type="submit" className="up-btn up-btn--primary">
                <FaSave /> Save Changes
              </button>
              <button
                type="button"
                className="up-btn up-btn--ghost"
                onClick={() => {
                  setIsEditing(false);
                  toast.info("Edit cancelled.");
                }}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
