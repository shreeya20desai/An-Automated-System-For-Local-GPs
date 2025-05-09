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
import axios from "axios";
import { getCookie } from "../../utils.js";
import { BASE_URL } from "../../config.js";

function UserLogin() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (email, password) => {
    setLoading(true);
    setLoginError(null);

    try {
      // API endpoint for patient login
      const response = await axios.post(
        `${BASE_URL}/patient/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const waitForCSRF = () => {
        const csrfToken = getCookie("csrf_access_token");
        if (csrfToken) {
          // Locally stores patient ID
          localStorage.setItem("patient_id", response.data.patient_id);
          navigate("/dashboard");
        } else {
          console.log("Waiting for CSRF cookie...");
          setTimeout(waitForCSRF, 100);
        }
      };

      waitForCSRF();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setLoginError("Invalid email or password.");
      } else if (error.response && error.response.data?.message) {
        setLoginError(error.response.data.message);
      } else {
        setLoginError("An error occurred during login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="login-card">
        <Row>
          <Col md={6} className="image-container d-none d-md-flex">
            <img src={Image} alt="Login Visual" className="image" />
          </Col>

          <Col
            xs={12}
            md={6}
            className="p-4 d-flex flex-column justify-content-center"
          >
            <h1 className="text-center" style={{ fontFamily: "Poppins" }}>
              LOGIN
            </h1>

            {/* Imported The LoginFrom From Components */}
            <LoginForm onLoginSuccess={handleSubmit} loading={loading} />
            {loginError && (
              <p className="text-danger text-center mt-2">{loginError}</p>
            )}

            {/* Imported The StaffLoginButton From Components */}
            <div className="d-flex justify-content-center mt-3">
              <StaffLoginButton />
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
