import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";
import { toast } from "react-toastify";

import { AuthContext } from "../../store/AuthContext";

export default function AuthForm() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState("form");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [userType, setUserType] = useState(null);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormValues({ name: "", email: "", password: "" });
    toast.info(isLogin ? "Switching to Sign Up" : "Switching to Login");
  };

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formValues.email || !emailPattern.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Only validate password complexity during signup
    if (!isLogin) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{6,}$/;
      if (!formValues.password || !passwordRegex.test(formValues.password)) {
        newErrors.password =
          "Password must contain at least 6 characters, one uppercase letter, and one special character (!@#$&*)";
      }
    } else {
      // For login, just check if password exists (no complexity check)
      if (!formValues.password) {
        newErrors.password = "Password is required";
      }
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
      try {
        const checkRes = await fetch(
          "http://localhost:5001/api/users/check-user",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formValues.email }),
          },
        );

        const checkData = await checkRes.json();
        if (!checkRes.ok) throw new Error(checkData.message);

        await sendOtp();
      } catch (err) {
        toast.error(err.message || "Signup failed.");
      } finally {
        setLoading(false);
      }
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
      if (!res.ok) {
        if (data.invalidCredentials) {
          throw new Error("Invalid email or password");
        }
        throw new Error(data.message || "Something went wrong");
      }

      navigate(data.role === "admin" ? "/admin" : "/users");
      console.log(data);
      auth.login(data.userId, data.token, data.role);
      toast.success("Login successful!");
    } catch (err) {
      toast.error(err.message || "Login failed.");
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

      toast.info("OTP sent to your email.");
      setStep("otp");
    } catch (err) {
      toast.error(err.message || "Failed to send OTP.");
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

      const signupRes = await fetch("http://localhost:5001/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        if (signupData.existingUser) {
          toast.error("User already exists. Please login instead.");
          setIsLogin(true);
          setStep("form");
          return;
        }
        if (signupData.passwordError) {
          setErrors({
            ...errors,
            password: signupData.message,
          });
          setStep("form");
          return;
        }
        throw new Error(signupData.message);
      }

      toast.success("Signup successful! Please login.");
      setIsLogin(true);
      setStep("form");
    } catch (err) {
      toast.error(err.message || "OTP verification failed.");
    }
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const logout = () => {
    setUserType(null);
    setFormValues({ name: "", email: "", password: "" });
  };

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
                  placeholder="your-email@address.com"
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
                  placeholder="******"
                  required
                />
                {errors.password && (
                  <small className="error">{errors.password}</small>
                )}
                {/* {!isLogin && !errors.password && (
                  <small className="password-hint">
                    Password must contain at least 6 characters, one uppercase
                    letter, and one special character (!@#$&*)
                  </small>
                )} */}
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
