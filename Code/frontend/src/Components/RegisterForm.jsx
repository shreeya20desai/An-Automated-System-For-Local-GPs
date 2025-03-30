import React, { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaTransgender,
  FaPhone,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ onRegister }) => {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    onRegister({
      firstName,
      lastName,
      dob,
      gender,
      email,
      phone,
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3 position-relative">
        <input
          type="text"
          placeholder="Enter First Name"
          className="form-control"
          value={firstName}
          onChange={(e) => setfirstName(e.target.value)}
          required
        />
        <FaUser className="position-absolute top-50 end-0 translate-middle-y me-3" />
      </div>

      <div className="mb-3 position-relative">
        <input
          type="text"
          placeholder="Enter Last Name"
          className="form-control"
          value={lastName}
          onChange={(e) => setlastName(e.target.value)}
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
          type="tel"
          placeholder="Enter Phone Number"
          className="form-control"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <FaPhone className="position-absolute top-50 end-0 translate-middle-y me-3" />
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

      <button
        className="btn btn-dark"
        type="submit"
        style={{ fontWeight: "bold", width: "100%" }}
      >
        REGISTER
      </button>
    </form>
  );
};

export default RegisterForm;
