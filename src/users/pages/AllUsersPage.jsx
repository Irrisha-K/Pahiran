import { useEffect, useState } from "react";
import "./AllUsersPage.css";

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ email: "", name: "" });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.email) queryParams.append("email", filters.email);
      if (filters.name) queryParams.append("name", filters.name);

      const res = await fetch(`http://localhost:5001/api/users?${queryParams}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="users-page">
      <h2>Users List</h2>

      <form onSubmit={handleSearch} className="users-form">
        <input
          type="text"
          name="email"
          placeholder="Search by email"
          value={filters.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={filters.name}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : users.length === 0 ? (
        <p className="no-users">No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
