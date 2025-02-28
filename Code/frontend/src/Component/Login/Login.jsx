import React, { useState } from "react";
import "./Login.css";
// import Image from "../../Assets/Image1.jpg"; //Image from Google https://www.google.com/search?q=hospital+management+images+&sca_esv=12555c0b9fcc47a6&udm=2&biw=1536&bih=695&sxsrf=AHTn8zr0dM5q1a70OBxTFI6gQzBmKkYTUA%3A1740743358605&ei=vqLBZ6nTJJLPhbIPg6eC-AY&ved=0ahUKEwipqqOspuaLAxWSZ0EAHYOTAG8Q4dUDCBE&uact=5&oq=hospital+management+images+&gs_lp=EgNpbWciG2hvc3BpdGFsIG1hbmFnZW1lbnQgaW1hZ2VzIDIFEAAYgAQyBhAAGAgYHjIGEAAYCBgeMgYQABgIGB4yBhAAGAgYHjIGEAAYCBgeMgYQABgIGB5I_QRQugJYugJwAHgAkAEAmAFWoAGLAaoBATK4AQPIAQD4AQGYAgGgAmSYAwDiAwUSATEgQIgGAZIHAzAuMaAHhgU&sclient=img#imgrc=a6i6ZCYTdL-CYM&imgdii=mq2RMqRVs0kdgM
import { FaEnvelope, FaLock } from "react-icons/fa"; //https://react-icons.github.io/react-icons/search/#q=lock
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in the fields");
    } else {
      setError("");
      console.log("Sucessfully Logged In");
    }
  };

  return (
    <div className="login">
      <div className="image">
        <img src={Image} alt="Login" className="image-login" />
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Welcome Back!</h1>
        {error && <p className="message-error">{error}</p>}

        <div className="input-form">
          <FaEnvelope />
          <input
            type="email"
            placeholder="Enter your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-form">
          <FaLock />
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" type="submit">
          Login
        </button>

        <div className="register-link">
          <p>
            {" "}
            Don't Have An Account?
            <a
              onClick={() => navigate("../Register")}
              style={{ cursor: "pointer" }}
            >
              Register Here.
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
