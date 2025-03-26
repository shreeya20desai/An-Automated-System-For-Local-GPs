import React, { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";

const AddStaffForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [staffType, setStaffType] = useState(""); // No default value

  const handleSubmit = (e) => {
    e.preventDefault();
    // logic to send the data to backend
    console.log({
      fullName,
      email,
      contactNumber,
      specialization,
      password,
      staffType,
    });
  };

  return (
    <Row className="justify-content-md-center mt-5">
      <Col xs={12} md={8} lg={6}>
        <Card>
          <Card.Header style={{ textAlign: "center" }}>Add Staff</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter contact number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Specialization</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Staff Type</Form.Label>
                <Form.Control
                  as="select"
                  value={staffType}
                  onChange={(e) => setStaffType(e.target.value)}
                  required
                >
                  <option value="">Select Staff Type</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Add Staff
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AddStaffForm;
