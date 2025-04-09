import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  //Dummy Data
  useEffect(() => {
    setFirstName("John");
    setLastName("Doe");
    setDob("1990-01-01");
    setGender("Male");
    setEmail("john.doe@example.com");
    setPhone("123-456-7890");
  }, []);

  return (
    <Container className="mt-4 d-flex justify-content-center">
      <Card style={{ maxWidth: "600px", width: "100%" }}>
        <Card.Body>
          <Card.Title className="text-center mb-3">Profile</Card.Title>
          <Form>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" value={firstName} readOnly />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" value={lastName} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control type="date" value={dob} readOnly />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control type="text" value={gender} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="tel" value={phone} readOnly />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
