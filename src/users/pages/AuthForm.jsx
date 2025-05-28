import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";
import { AuthContext } from "../../store/AuthContext";

export default function AuthForm() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    if (!isLogin) {
      await sendOtp();
      setLoading(false);
      return;
    }

    const url = `http://localhost:5001/api/users/login`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      auth.login(data.userId, data.token, data.role);
      navigate(data.role === "admin" ? "/admin" : "/users");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/users/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formValues.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("OTP sent to your email.");
      setStep("otp");
    } catch (err) {
      alert(err.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formValues.email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ Now perform signup (manually, since OTP verified)
      const signupRes = await fetch("http://localhost:5001/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const signupData = await signupRes.json();
      if (!signupRes.ok) throw new Error(signupData.message);

      alert("Signup successful! Please login.");
      setIsLogin(true);
      setStep("form");
    } catch (err) {
      alert(err.message);
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
          {step === "form" ? (
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
                  {errors.name && (
                    <small className="error">{errors.name}</small>
                  )}
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
                {errors.email && (
                  <small className="error">{errors.email}</small>
                )}
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
              <button type="submit" className="auth-button" disabled={loading}>
                {loading
                  ? isLogin
                    ? "Logging in..."
                    : "Signing up..."
                  : isLogin
                  ? "Login"
                  : "Sign Up"}
              </button>
            </form>
          ) : (
            <div className="otp-section">
              <h3>Enter OTP sent to your email</h3>
              <input
                type="text"
                className="otp-input"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button className="verify-otp-button" onClick={verifyOtp}>
                Verify OTP
              </button>
            </div>
          )}
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
