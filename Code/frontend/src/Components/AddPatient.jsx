import React, { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { BASE_URL } from "../config";

const AddPatientForm = ({ adminEmail, adminId }) => {
  const [patientFirstName, setFirstName] = useState("");
  const [patientLastName, setLastName] = useState("");
  const [patientEmail, setEmail] = useState("");
  const [patientPhone, setContactNumber] = useState("");
  const [patientPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (patientPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // API call for admin registering New patients from admin dashboard
    try {
      const response = await fetch(`${BASE_URL}/gp-patient/registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          patientFirstName,
          patientLastName,
          patientEmail,
          patientPhone,
          gender,
          dob,
          patientPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Patient added successfully!");
        // Reset form
        setFirstName("");
        setLastName("");
        setEmail("");
        setContactNumber("");
        setPassword("");
        setConfirmPassword("");
        setDob("");
        setGender("");
      } else {
        console.error(
          "Error registering patient:",
          data.message || "Unknown error occurred."
        );
        alert(
          `Error registering patient: ${
            data.message || "Unknown error occurred."
          }`
        );
      }
    } catch (networkErr) {
      console.error("Network error:", networkErr);
      alert("Network error. Please try again.");
    }
  };

  return (
    <Row className="justify-content-md-center mt-5">
      <Col xs={12} md={8} lg={6}>
        <Card>
          <Card.Header style={{ textAlign: "center" }}>Add Patient</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              {/* First and Last name */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter first name"
                      value={patientFirstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter last name"
                      value={patientLastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Email address and Contact number */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={patientEmail}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter contact number"
                      value={patientPhone}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* DOB and Gender */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Password */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={patientPassword}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
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
                </Col>
              </Row>

              <Button variant="primary" type="submit">
                Add Patient
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AddPatientForm;
