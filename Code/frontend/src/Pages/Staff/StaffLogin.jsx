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
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (email, password) => {
    setError("");
    setSuccessMessage("");
    //API call for staff login
    try {
      const response = await fetch(`${BASE_URL}/staff/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          staffEmail: email,
          staffPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("staffType", data.staffType);
        //localStorage.setItem("staffId", data.staffId);
        if (data.staffType === "doctor") {
          localStorage.setItem("doctor_id", data.staffId);
          setTimeout(() => {
            navigate("/StaffDashboard");
          }, 0);
        } else if (data.staffType === "nurse") {
          localStorage.setItem("nurse_id", data.staffId);
          setTimeout(() => {
            navigate("/StaffDashboard");
          }, 0);
        } else if (data.staffType === "admin") {
          localStorage.setItem("admin_id", data.staffId);
          setTimeout(() => {
            navigate("/AdminDashboard");
          }, 0);
        } else {
          setError("Unknown staff type.");
        }
      } else if (response.status === 401) {
        console.log("Error 401 occurred:", data);
        setError(data.message || "Invalid email or password");
      } else if (response.status === 400) {
        setError(data.message || "Bad request. Please check your input.");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Network error:", err);
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
            <LoginForm onLoginSuccess={handleLogin} />

            {error && (
              <div className="alert alert-danger text-center mt-3" role="alert">
                {error}
              </div>
            )}

            {successMessage && (
              <div
                className="alert alert-success text-center mt-3"
                role="alert"
              >
                {successMessage}
              </div>
            )}

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
