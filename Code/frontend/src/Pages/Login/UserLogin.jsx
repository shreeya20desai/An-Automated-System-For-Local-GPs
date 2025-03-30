import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import LoginForm from "../../Components/LoginForm.jsx";
import RegisterButtonHere from "../../Components/RegisterHereButton.jsx";
import StaffLoginButton from "../../Components/StaffLoginButton.jsx";
import Image from "../../../src/Assets/Image1.png";
import "./Login.css";
import { BASE_URL } from "../../config.js";

function UserLogin() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);
  const handleSubmit = async (email, password) => {
    //API call
    try {
      const response = await fetch(`${BASE_URL}/patient/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        setLoginError(errorData.message || "Login failed");
      }
    } catch (error) {
      setLoginError("An error occurred during login.");
      console.error("Login error:", error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="card">
        <Row>
          <Col md={6} className="image-container d-none d-md-flex">
            <img src={Image} alt="Login" className="image" />
          </Col>
          <Col
            xs={12}
            md={6}
            className="p-4 d-flex flex-column justify-content-center"
          >
            <h1
              className="text-center"
              style={{ fontFamily: "Poppins", fontWeight: "revert-layer" }}
            >
              LOGIN
            </h1>

            {/* Imported The LoginFrom From Components */}
            <LoginForm onLoginSuccess={handleSubmit} />

            {/* Imported The StaffLoginButton From Components */}
            <div className="d-flex justify-content-center mt-3">
              <StaffLoginButton onSubmit={handleSubmit} />
            </div>

            <div className="d-flex flex-column align-items-center mt-4">
              <p className="mb-4" style={{ fontWeight: "bold" }}>
                Don't have an account?
              </p>

              {/* Imported The RegisterButton From Components */}
              <RegisterButtonHere />
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default UserLogin;
