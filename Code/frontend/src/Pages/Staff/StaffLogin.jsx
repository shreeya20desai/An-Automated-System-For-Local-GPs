import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import LoginForm from "../../Components/LoginForm.jsx";
import { BASE_URL } from "../../config";

import "../Login/Login.css";

function StaffLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (email, password) => {
    setError("");
    //API call
    try {
      const response = await fetch(`${BASE_URL}/staff/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffEmail: email,
          staffPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        if (data.staffType === "doctor" || data.staffType === "nurse") {
          navigate("/StaffDashboard");
        } else if (data.staffType === "admin") {
          navigate("/AdminDashboard");
        } else {
          setError("Unknown staff type.");
        }
      } else {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Network error. Please try again.");
    }
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
            <LoginForm onLoginSuccess={handleSubmit} />

            <div>
              <p
                style={{
                  marginTop: "2rem",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Are You Patient? <Link to="/">Login Here</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default StaffLogin;
