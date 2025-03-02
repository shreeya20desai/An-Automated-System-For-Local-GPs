import React, { useState } from "react";
import "./Login.css";
import Image from "../../Assets/Image1.png"; //Image from Google https://www.google.com/search?q=hospital+management+images+&sca_esv=12555c0b9fcc47a6&udm=2&biw=1536&bih=695&sxsrf=AHTn8zr0dM5q1a70OBxTFI6gQzBmKkYTUA%3A1740743358605&ei=vqLBZ6nTJJLPhbIPg6eC-AY&ved=0ahUKEwipqqOspuaLAxWSZ0EAHYOTAG8Q4dUDCBE&uact=5&oq=hospital+management+images+&gs_lp=EgNpbWciG2hvc3BpdGFsIG1hbmFnZW1lbnQgaW1hZ2VzIDIFEAAYgAQyBhAAGAgYHjIGEAAYCBgeMgYQABgIGB4yBhAAGAgYHjIGEAAYCBgeMgYQABgIGB5I_QRQugJYugJwAHgAkAEAmAFWoAGLAaoBATK4AQPIAQD4AQGYAgGgAmSYAwDiAwUSATEgQIgGAZIHAzAuMaAHhgU&sclient=img#imgrc=a6i6ZCYTdL-CYM&imgdii=mq2RMqRVs0kdgM
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
      <img src={Image} alt="Login" className="image" />

      <form className="login-form" onSubmit={handleSubmit}>
        <h1>LOGIN</h1>
        {error && <p className="message-error">{error}</p>}

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

        <button className="login-btn" type="submit">
          LOGIN
        </button>

        <div className="register">
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
          </button>

          {/* <a
            className="register-btn"
            onClick={() => navigate("../Register")}
            style={{ cursor: "pointer" }}
          >
            REGISTER HERE
          </a> */}
        </div>
      </form>
    </div>
  );
};

export default Login;
