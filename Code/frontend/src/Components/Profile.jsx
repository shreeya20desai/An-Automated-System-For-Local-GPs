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

// const Profile = () => {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [dob, setDob] = useState("");
//   const [gender, setGender] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");

//   //Dummy Data
//   useEffect(() => {
//     setFirstName("John");
//     setLastName("Doe");
//     setDob("1990-01-01");
//     setGender("Male");
//     setEmail("john.doe@example.com");
//     setPhone("123-456-7890");
//   }, []);

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/patientProfile`, {
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

    fetchPatientProfile();
  }, []);

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
                    value={profile?.FirstName || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile?.LastName || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={profile?.DOB || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile?.Gender || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={profile?.Email || ""}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                value={profile?.PhoneNo || ""}
                readOnly
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
