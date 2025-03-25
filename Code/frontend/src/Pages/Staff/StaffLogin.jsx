import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import LoginForm from "../../Components/LoginForm.jsx";
import LoginButton from "../../Components/LoginButton.jsx";

import "../Login/Login.css";

function StaffLogin() {
  const navigate = useNavigate();

  const handleLoginSubmit = () => {
    navigate("/StaffDashboard");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 vw-100">
      <Card className="w-100" style={{ maxWidth: "500px", height: "auto" }}>
        <Row>
          <Col
            xs={12}
            className="p-5 d-flex flex-column justify-content-center"
          >
            <h1
              className="text-center mb-4"
              style={{ fontFamily: "Poppins", fontWeight: "revert-layer" }}
            >
              STAFF LOGIN
            </h1>
            <LoginForm onLoginSuccess={handleLoginSubmit} />
            <LoginButton onSubmit={handleLoginSubmit} />
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default StaffLogin;
