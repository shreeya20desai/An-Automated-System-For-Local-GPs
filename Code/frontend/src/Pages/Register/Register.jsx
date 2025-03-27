import React, { useState } from "react";
import { Container, Row, Card, Col } from "react-bootstrap";
import "../Login/Login.css";
import Image from "../../Assets/Image1.png"; //Image from Google https://www.google.com/search?q=hospital+management+images+&sca_esv=12555c0b9fcc47a6&udm=2&biw=1536&bih=695&sxsrf=AHTn8zr0dM5q1a70OBxTFI6gQzBmKkYTUA%3A1740743358605&ei=vqLBZ6nTJJLPhbIPg6eC-AY&ved=0ahUKEwipqqOspuaLAxWSZ0EAHYOTAG8Q4dUDCBE&uact=5&oq=hospital+management+images+&gs_lp=EgNpbWciG2hvc3BpdGFsIG1hbmFnZW1lbnQgaW1hZ2VzIDIFEAAYgAQyBhAAGAgYHjIGEAAYCBgeMgYQABgIGB4yBhAAGAgYHjIGEAAYCBgeMgYQABgIGB5I_QRQugJYugJwAHgAkAEAmAFWoAGLAaoBATK4AQPIAQD4AQGYAgGgAmSYAwDiAwUSATEgQIgGAZIHAzAuMaAHhgU&sclient=img#imgrc=a6i6ZCYTdL-CYM&imgdii=mq2RMqRVs0kdgM
import RegisterForm from "../../Components/RegisterForm";
import RegisterButton from "../../Components/RegisterButton";
import { Link } from "react-router-dom";

const Register = () => {
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
            <RegisterForm />
            <RegisterButton />
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
