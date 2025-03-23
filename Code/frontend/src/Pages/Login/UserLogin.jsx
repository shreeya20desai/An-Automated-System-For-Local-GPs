import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import LoginForm from "../../Components/LoginForm.jsx";
import LoginButton from "../../Components/LoginButton.jsx";
import RegisterButton from "../../Components/RegisterButton.jsx";
import StaffLoginButton from "../../Components/StaffLoginButton.jsx";
import Image from "../../../src/Assets/Image1.png";
import "./Login.css";

function UserLogin() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/dashboard");
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

            {/* Imported The LoginButton From Components */}
            <div className="d-flex justify-content-center">
              <LoginButton onSubmit={handleSubmit} />
            </div>

            {/* Imported The StaffLoginButton From Components */}
            <div className="d-flex justify-content-center mt-3">
              <StaffLoginButton onSubmit={handleSubmit} />
            </div>

            <div className="d-flex flex-column align-items-center mt-4">
              <p className="mb-4" style={{ fontWeight: "bold" }}>
                Don't have an account?
              </p>

              {/* Imported The RegisterButton From Components */}
              <RegisterButton />
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default UserLogin;
