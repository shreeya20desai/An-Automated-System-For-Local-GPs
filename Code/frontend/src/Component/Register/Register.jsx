import React, { useState } from "react";
import "../Login/Login.css";
import Image from "../../Assets/Image1.png"; //Image from Google https://www.google.com/search?q=hospital+management+images+&sca_esv=12555c0b9fcc47a6&udm=2&biw=1536&bih=695&sxsrf=AHTn8zr0dM5q1a70OBxTFI6gQzBmKkYTUA%3A1740743358605&ei=vqLBZ6nTJJLPhbIPg6eC-AY&ved=0ahUKEwipqqOspuaLAxWSZ0EAHYOTAG8Q4dUDCBE&uact=5&oq=hospital+management+images+&gs_lp=EgNpbWciG2hvc3BpdGFsIG1hbmFnZW1lbnQgaW1hZ2VzIDIFEAAYgAQyBhAAGAgYHjIGEAAYCBgeMgYQABgIGB4yBhAAGAgYHjIGEAAYCBgeMgYQABgIGB5I_QRQugJYugJwAHgAkAEAmAFWoAGLAaoBATK4AQPIAQD4AQGYAgGgAmSYAwDiAwUSATEgQIgGAZIHAzAuMaAHhgU&sclient=img#imgrc=a6i6ZCYTdL-CYM&imgdii=mq2RMqRVs0kdgM
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa"; //https://react-icons.github.io/react-icons/search/#q=lock
import { useNavigate } from "react-router-dom";

const Register = () => {
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
      setError("Please fill in all the Fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password Dosen't Match");
      return;
    }
    setError("");
    console.log("Sucessfully Registered");
  };

  return (
    <div className="form-for-register">
      <img src={Image} alt="Login" className="image" />

      <form className="register-form" onSubmit={handleSubmit}>
        <h1>REGISTER</h1>
        {error && <p className="message-error">{error}</p>}

        <div className="input-form">
          {/* <label className="Email">Email Address:</label> */}
          <input
            type="text"
            placeholder="Enter your Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <FaUser className="icons" />
        </div>

        <div className="input-form">
          {/* <label className="Password">Password</label> */}
          {/* <input
            type="text"
            placeholder="Select the Gender"
            value={gender}
            required
            onChange={(e) => setGender(e.target.value)}
          /> */}
          <select
            value={gender}
            required
            onChange={(e) => setGender(e.target.value)}
          >
            <option>Select Your Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="prefer-not-to-say">Prefer Not to Say</option>
          </select>

          {/* <FaTransgender className="icons" /> */}
        </div>

        <div className="input-form">
          {/* <label className="Password">Password</label> */}
          <input
            type="date"
            placeholder="Date Of Birth: dd/mm/yyy"
            value={dob}
            required
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div className="input-form">
          {/* <label className="Email">Email Address:</label> */}
          <input
            type="email"
            placeholder="Enter your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FaEnvelope className="icons" />
        </div>

        <div className="input-form">
          {/* <label className="Password">Password</label> */}
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icons" />
        </div>

        <div className="input-form">
          {/* <label className="Password">Password</label> */}
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FaLock className="icons" />
        </div>

        <button className="register-btn" type="submit">
          REGISTER
        </button>

        {/* <div className="register">
          <p className="reg-p">
            {" "}
            Don't Have An Account? <br />
          </p>

          <button
            className="register-btn"
            type="button"
            onClick={() => "../Register"}
          >
            REGISTER HERE
          </button> */}

        {/* <a
            className="register-btn"
            onClick={() => navigate("../Register")}
            style={{ cursor: "pointer" }}
          >
            REGISTER HERE
          </a> */}
      </form>
    </div>
  );
};

export default Register;
