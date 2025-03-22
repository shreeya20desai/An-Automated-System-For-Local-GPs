import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import "../Login/Login.css";
import Image from "../../Assets/Image1.png"; //Image from Google https://www.google.com/search?q=hospital+management+images+&sca_esv=12555c0b9fcc47a6&udm=2&biw=1536&bih=695&sxsrf=AHTn8zr0dM5q1a70OBxTFI6gQzBmKkYTUA%3A1740743358605&ei=vqLBZ6nTJJLPhbIPg6eC-AY&ved=0ahUKEwipqqOspuaLAxWSZ0EAHYOTAG8Q4dUDCBE&uact=5&oq=hospital+management+images+&gs_lp=EgNpbWciG2hvc3BpdGFsIG1hbmFnZW1lbnQgaW1hZ2VzIDIFEAAYgAQyBhAAGAgYHjIGEAAYCBgeMgYQABgIGB4yBhAAGAgYHjIGEAAYCBgeMgYQABgIGB5I_QRQugJYugJwAHgAkAEAmAFWoAGLAaoBATK4AQPIAQD4AQGYAgGgAmSYAwDiAwUSATEgQIgGAZIHAzAuMaAHhgU&sclient=img#imgrc=a6i6ZCYTdL-CYM&imgdii=mq2RMqRVs0kdgM
import { FaEnvelope, FaLock, FaUser, FaTransgender } from "react-icons/fa"; //https://react-icons.github.io/react-icons/search/#q=lock
import { useNavigate } from "react-router-dom";
import RegisterButton from "../../Components/RegisterButton";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !fullName ||
      !gender ||
      !dob ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all the Fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password Dosen't Match");
      return;
    }
    setError("");
    console.log("Sucessfully Registered");
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

            <form onSubmit={handleSubmit}>
              <div className="mb-3 mt-2 position-relative">
                <input
                  type="fullName"
                  placeholder="Enter Full Name"
                  className="form-control"
                  style={{ width: "290px", height: "50px" }}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <FaUser className="position-absolute top-50 end-0 translate-middle-y me-3 " />
              </div>

              <div className="mb-3 position-relative">
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="form-control"
                  style={{ width: "290px", height: "50px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <FaEnvelope className="position-absolute top-50 end-0 translate-middle-y me-3 " />
              </div>

              <div className="mb-3 position-relative">
                <select
                  className="form-control"
                  style={{ width: "290px", height: "50px" }}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="prefer-not-to-say">Prefer Not to Say</option>
                </select>
                <FaTransgender className="position-absolute end-0 top-50 translate-middle-y me-3" />
              </div>

              <div className="mb-3 position-relative">
                <input
                  type="date"
                  placeholder="dd-mm-yyyy"
                  className="form-control"
                  style={{ width: "290px", height: "50px" }}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3 position-relative">
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="form-control"
                  style={{ width: "100%", height: "50px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <FaLock className="position-absolute top-50 end-0 translate-middle-y me-3 " />
              </div>

              <div className="mb-3 position-relative">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="form-control"
                  style={{ width: "100%", height: "50px" }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <FaLock className="position-absolute top-50 end-0 translate-middle-y me-3 " />
              </div>

              <RegisterButton />
            </form>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};
export default Register;
