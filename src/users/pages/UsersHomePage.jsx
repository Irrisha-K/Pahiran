import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/AuthContext";
import { FaEnvelope, FaUser } from "react-icons/fa";
import "./UsersHomePage.css";

export default function UsersHomePage() {
  const { userId, token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch user data");
        }

        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (userId && token) {
      fetchUser();
    }
  }, [userId, token]);

  if (error) {
    return <div className="user-error">{error}</div>;
  }

  if (!user) {
    return <div className="user-loading">Loading user details...</div>;
  }

  return (
    <div className="user-page-wrapper">
      <div className="user-card">
        <h2 className="user-title">Welcome, {user.name}</h2>
        <div className="user-info">
          <div className="user-item">
            <FaUser className="user-icon" />
            <span>Name: {user.name}</span>
          </div>
          <div className="user-item">
            <FaEnvelope className="user-icon" />
            <span>Email: {user.email}</span>
          </div>
        </div>
        <p className="user-role">
          Logged in as <strong>{user.role}</strong>
        </p>
      </div>
    </div>
  );
}
