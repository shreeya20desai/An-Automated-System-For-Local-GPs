import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { BASE_URL } from "../config";

const AddStaffForm = () => {
  const [staffFirstName, setFirstName] = useState("");
  const [staffLastName, setLastName] = useState("");
  const [staffEmail, setEmail] = useState("");
  const [staffPhone, setContactNumber] = useState("");
  const [staffSpecialization, setSpecialization] = useState("");
  const [staffPassword, setPassword] = useState("");
  const [staffRegistrationNumber, setStaffRegistrationNumber] = useState("");
  const [staffType, setStaffType] = useState("");
  const [specializations, setSpecializations] = useState([]);

  const fetchSpecializations = async (staffType) => {
    //API Call to get the specializations for the staff based on their type i.e Nurse/Doctor.
    try {
      const response = await fetch(
        `${BASE_URL}/get_specializations?staff_type=${staffType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();

      if (response.ok) {
        setSpecializations(data);
      } else {
        console.error("Error fetching specializations:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    if (staffType) {
      fetchSpecializations(staffType);
    }
  }, [staffType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //API call for admin to register staff
    try {
      const response = await fetch(`${BASE_URL}/staff/registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          staffType,
          staffFirstName,
          staffLastName,
          staffEmail,
          staffPhone,
          staffRegistrationNumber,
          staffSpecialization,
          staffPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Staff added successfully:", data);
        alert("Staff added successfully!");
        // Reset form
        setFirstName("");
        setLastName("");
        setEmail("");
        setContactNumber("");
        setSpecialization("");
        setPassword("");
        setStaffType("");
        setStaffRegistrationNumber("");
      } else {
        console.error("Error adding staff:", data.message);
        alert(`Error adding staff: ${data.message}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <Row className="justify-content-md-center mt-5 ">
      <Col xs={12} md={8} lg={6}>
        <Card>
          <Card.Header style={{ textAlign: "center" }}>Add Staff</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              {/* First name and last name */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter first name"
                      value={staffFirstName}
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
                      value={staffLastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Email address and Contact Number */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter Email Address"
                      value={staffEmail}
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
                      value={staffPhone}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Specialization and Staff Type */}
              <Row>
                <Col md={6}>
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
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Specialization</Form.Label>
                    <Form.Control
                      as="select"
                      value={staffSpecialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      required
                    >
                      <option value="">Select Specialization</option>
                      {specializations.map((spec) => (
                        <option
                          key={spec.Specialization_ID}
                          value={spec.Specialization_ID}
                        >
                          {spec.Specialization_Name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              {/* Registration number and Password */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Registration Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="staff Registration Number"
                      value={staffRegistrationNumber}
                      onChange={(e) =>
                        setStaffRegistrationNumber(e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={staffPassword}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

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
