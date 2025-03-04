import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Image from "../../Assets/Image1.png";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function UserLogin() {
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
      console.log("Successfully Logged In");
    }
  };

  // https://react-bootstrap.github.io/docs/layout/grid/#setting-column-widths-in-row

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="card">
        <Row className="row">
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
              style={{ fontFamily: "Poppins", fontWeight: "bold" }}
            >
              LOGIN
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 position-relative">
                <input
                  type="email"
                  placeholder="Enter Your Email Address"
                  className="form-control"
                  style={{ width: "100%", height: "50px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <FaEnvelope className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
              </div>

              <div className="mb-3 position-relative">
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  className="form-control"
                  style={{ width: "100%", height: "50px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <FaLock className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
              </div>

              {error && <p className="text-danger">{error}</p>}
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-dark"
                  style={{ fontWeight: "bold" }}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                >
                  Login
                </button>
              </div>

              <div className="d-flex flex-column align-items-center mt-4">
                <p className="mb-4" style={{ fontWeight: "bold" }}>
                  Don't have an account?
                </p>
                <button
                  className="btn btn-dark"
                  type="button"
                  style={{ fontWeight: "bold" }}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  onClick={() => navigate("/register")}
                >
                  REGISTER HERE
                </button>
              </div>
            </form>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default UserLogin;
