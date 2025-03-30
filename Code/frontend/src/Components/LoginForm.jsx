import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onLoginSuccess(email, password);
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

      <button
        className="btn btn-dark w-100"
        type="submit"
        style={{ fontWeight: "bold" }}
      >
        LOGIN
      </button>
    </form>
  );
}

export default LoginForm;
