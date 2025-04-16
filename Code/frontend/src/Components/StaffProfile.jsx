import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import { BASE_URL } from "../config";

// const StaffProfile = ({ staffType }) => {
//   const [staffFirstName, setStaffFirstName] = useState("");
//   const [staffLastName, setStaffLastName] = useState("");
//   const [staffEmail, setStaffEmail] = useState("");
//   const [staffPhone, setStaffPhone] = useState("");
//   const [staffRegistrationNumber, setStaffRegistrationNumber] = useState("");
//   const [staffSpecialization, setStaffSpecialization] = useState("");

//   useEffect(() => {
//     // dummy data
//     setStaffFirstName("Jane");
//     setStaffLastName("Smith");
//     setStaffEmail("jane.smith@example.com");
//     setStaffPhone("987-654-3210");
//     setStaffRegistrationNumber(staffType === "Doctor" ? "DR1234" : "NR67890");
//     setStaffSpecialization(
//       staffType === "Doctor" ? "Cardiology" : "Pediatrics"
//     );
//   }, [staffType]);

const StaffProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/staffProfile`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setProfile(data.profile);

          setError("");
        } else {
          setError(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <Container className="mt-4 text-center">
        <Alert variant="danger">Profile not found!</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4 text-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

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
                  <Form.Control
                    type="text"
                    value={profile.FirstName || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.LastName || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Registration Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.RegistrationNumber || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Specialization</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.Specialization || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={profile.Email || ""} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                value={profile.PhoneNo || ""}
                readOnly
              />{" "}
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StaffProfile;
