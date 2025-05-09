import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Card, Col } from "react-bootstrap";
import "../Login/Login.css";
import Image from "../../Assets/Image1.png";
import RegisterForm from "../../Components/RegisterForm";
import { Link } from "react-router-dom";
import { getCookie } from "../../utils";
import { BASE_URL } from "../../config";

const Register = () => {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState(null);

  const handleRegister = async (registrationData) => {
    //API call for patient regsitration
    try {
      const csrfToken = getCookie("csrf_access_token");
      const response = await fetch(`${BASE_URL}/patient/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        navigate("/");
      } else {
        const errorData = await response.json();
        setRegisterError(errorData.message || "Registration failed");
      }
    } catch (error) {
      setRegisterError("An error occurred during registration.");
      console.error("Registration error:", error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="card">
        <Row className="row">
          <Col md={6} className="image-container d-none d-md-flex">
            <img src={Image} alt="Login" className="image"></img>
          </Col>
          <Col
            md={6}
            xs={12}
            className="p-4 d-flex flex-column align-items-center"
          >
            <h1
              className="text-center"
              style={{ font: "Poppins", fontWeight: "bold" }}
            >
              REGISTER
            </h1>

            <RegisterForm onRegister={handleRegister} />
            {registerError && (
              <p className="text-danger mt-2">{registerError}</p>
            )}
            <div>
              <p style={{ marginTop: "2rem", fontWeight: "600" }}>
                Already Have An Account? <Link to="/">Login</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};
export default Register;
