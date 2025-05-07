import { useState } from "react";
import "./AuthForm.css";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    console.log(isLogin ? "Logging in:" : "Signing up:", data);
  };

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
                  required
                  placeholder="Your name"
                />
              </div>
            )}
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
              />
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
