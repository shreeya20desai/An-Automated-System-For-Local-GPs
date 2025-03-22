import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in the fields");
    } else {
      console.log("Successfully Logged In");
      setError("");
      onLoginSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3 position-relative">
        <input
          type="email"
          placeholder="Enter Your Email Address"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FaEnvelope className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
      </div>

      <div className="mb-3 position-relative">
        <input
          type="password"
          placeholder="Enter Your Password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FaLock className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
      </div>
    </form>
  );
}

export default LoginForm;
