import React, { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaTransgender,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaMailBulk,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ onRegister }) => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  //checks if all the details are filled to go to next page
  const isPage1Valid =
    firstName && lastName && gender && dob && streetAddress && city && postcode;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    onRegister({
      firstName,
      lastName,
      dob,
      gender,
      email,
      phone,
      streetAddress,
      city,
      postcode,
      password,
    });
  };

  const getYesterdayDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  };

  return (
    <form onSubmit={handleSubmit}>
      {step === 1 && (
        <>
          <div className="mb-3 position-relative">
            <input
              type="text"
              placeholder="Enter First Name"
              className="form-control"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
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
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <FaUser className="position-absolute top-50 end-0 translate-middle-y me-3" />
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
              max={getYesterdayDate()}
            />
          </div>

          <div className="mb-3 position-relative">
            <input
              type="text"
              placeholder="Enter Street Address"
              className="form-control"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              required
            />
            <FaMapMarkerAlt className="position-absolute top-50 end-0 translate-middle-y me-3" />
          </div>

          <div className="mb-3 position-relative">
            <input
              type="text"
              placeholder="Enter City"
              className="form-control"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <FaCity className="position-absolute top-50 end-0 translate-middle-y me-3" />
          </div>

          <div className="mb-3 position-relative">
            <input
              type="text"
              placeholder="Enter Postcode"
              className="form-control"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              required
            />
            <FaMailBulk className="position-absolute top-50 end-0 translate-middle-y me-3" />
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setStep(2)}
            disabled={!isPage1Valid}
            style={{ width: "100%", fontWeight: "bold" }}
          >
            NEXT
          </button>
        </>
      )}

      {step === 2 && (
        <>
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

          {error && (
            <div className="alert alert-danger text-center py-1">{error}</div>
          )}

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStep(1)}
              style={{ fontWeight: "bold", width: "48%" }}
            >
              BACK
            </button>

            <button
              className="btn btn-dark"
              type="submit"
              style={{ fontWeight: "bold", width: "48%" }}
            >
              REGISTER
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default RegisterForm;
