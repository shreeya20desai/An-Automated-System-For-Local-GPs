import React, { useState } from "react";
import { FaEnvelope, FaLock, FaUser, FaTransgender } from "react-icons/fa"; //https://react-icons.github.io/react-icons/search/#q=lock
import { useNavigate, Link } from "react-router-dom";

const RegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !fullName ||
      !gender ||
      !dob ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all the fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setError("");
    console.log("Successfully Registered");
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3 position-relative">
        <input
          type="text"
          placeholder="Enter Full Name"
          className="form-control"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <FaUser className="position-absolute top-50 end-0 translate-middle-y me-3" />
      </div>

      <div className="mb-3 position-relative">
        <input
          type="email"
          placeholder="Enter Email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FaEnvelope className="position-absolute top-50 end-0 translate-middle-y me-3" />
      </div>

      <div className="mb-3 position-relative">
        <select
          className="form-control"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="prefer-not-to-say">Prefer Not to Say</option>
        </select>
        <FaTransgender className="position-absolute end-0 top-50 translate-middle-y me-3" />
      </div>

      <div className="mb-3 position-relative">
        <input
          type="date"
          className="form-control"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
      </div>

      <div className="mb-3 position-relative">
        <input
          type="password"
          placeholder="Enter Password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FaLock className="position-absolute top-50 end-0 translate-middle-y me-3" />
      </div>

      <div className="mb-3 position-relative">
        <input
          type="password"
          placeholder="Confirm Password"
          className="form-control"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <FaLock className="position-absolute top-50 end-0 translate-middle-y me-3" />
      </div>
    </form>
  );
};

export default RegisterForm;
