import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";

const StaffProfile = ({ staffType }) => {
  const [staffFirstName, setStaffFirstName] = useState("");
  const [staffLastName, setStaffLastName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [staffRegistrationNumber, setStaffRegistrationNumber] = useState("");
  const [staffSpecialization, setStaffSpecialization] = useState("");

  useEffect(() => {
    // dummy data
    setStaffFirstName("Jane");
    setStaffLastName("Smith");
    setStaffEmail("jane.smith@example.com");
    setStaffPhone("987-654-3210");
    setStaffRegistrationNumber(staffType === "Doctor" ? "DR1234" : "NR67890");
    setStaffSpecialization(
      staffType === "Doctor" ? "Cardiology" : "Pediatrics"
    );
  }, [staffType]);

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
                  <Form.Control type="text" value={staffFirstName} readOnly />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" value={staffLastName} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {staffType === "Doctor"
                      ? "Doctor Registration Number"
                      : "Nurse Registration Number"}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={staffRegistrationNumber}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Specialization</Form.Label>
                  <Form.Control
                    type="text"
                    value={staffSpecialization}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={staffEmail} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="tel" value={staffPhone} readOnly />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StaffProfile;
