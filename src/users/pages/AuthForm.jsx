// import { useState } from "react";
// import "./AuthForm.css";

// export default function AuthForm() {
//   const [isLogin, setIsLogin] = useState(true);

//   const toggleForm = () => setIsLogin(!isLogin);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     const data = Object.fromEntries(formData);
//     console.log(isLogin ? "Logging in:" : "Signing up:", data);
//   };

//   return (
//     <div className="auth-wrapper">
//       <div className="auth-container">
//         <div className="auth-card">
//           <h2 className="auth-title">{isLogin ? "Login" : "Sign Up"}</h2>
//           <form onSubmit={handleSubmit} className="auth-form">
//             {!isLogin && (
//               <div className="auth-field">
//                 <label htmlFor="name">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   required
//                   placeholder="Your name"
//                 />
//               </div>
//             )}
//             <div className="auth-field">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 required
//                 placeholder="you@example.com"
//               />
//             </div>
//             <div className="auth-field">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 required
//                 placeholder="••••••••"
//               />
//             </div>
//             <button type="submit" className="auth-button">
//               {isLogin ? "Login" : "Sign Up"}
//             </button>
//           </form>
//           <p className="auth-toggle">
//             {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//             <button onClick={toggleForm}>
//               {isLogin ? "Sign Up" : "Login"}
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useContext, useState } from "react";
import "./AuthForm.css";
import { AuthContext } from "../../store/AuthContext";

export default function AuthForm() {
  const auth = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [userType, setUserType] = useState(null); // null | "admin" | "user"

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormValues({ name: "", email: "", password: "" });
    setUserType(null);
  };

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formValues.email || !emailPattern.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formValues.password || formValues.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    if (!isLogin && !formValues.name.trim()) {
      newErrors.name = "Name is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const endpoint = isLogin ? "/login" : "/signup";
    const url = `http://localhost:5001/api/users${endpoint}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      if (isLogin) {
        // setUserType(data.role);
        auth.login(data.userId, data.token, data.role);
      } else {
        alert("Signup successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.message);
      console.log({ err });
    }
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const logout = () => {
    setUserType(null);
    setFormValues({ name: "", email: "", password: "" });
  };

  // Render different dashboards based on userType
  if (userType === "admin") {
    return (
      <div className="auth-wrapper">
        <div className="dashboard">
          <h2>Welcome, Admin</h2>
          <p>You have access to admin controls.</p>
          <button onClick={logout} className="auth-button">
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (userType === "user") {
    return (
      <div className="auth-wrapper">
        <div className="dashboard">
          <h2>Welcome, User</h2>
          <p>You are logged in as a regular user.</p>
          <button onClick={logout} className="auth-button">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">{isLogin ? "Login" : "Sign Up"}</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="auth-field">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
                {errors.name && <small className="error">{errors.name}</small>}
              </div>
            )}
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
              {errors.email && <small className="error">{errors.email}</small>}
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              {errors.password && (
                <small className="error">{errors.password}</small>
              )}
            </div>
            <button type="submit" className="auth-button">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          <p className="auth-toggle">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={toggleForm}>
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
