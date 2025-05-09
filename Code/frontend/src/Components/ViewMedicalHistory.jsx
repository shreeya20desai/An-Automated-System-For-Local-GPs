import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  ListGroup,
  Alert,
} from "react-bootstrap";
import { getCookie } from "../utils";
import { BASE_URL } from "../config";

const ViewMedicalRecords = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [medicalFolders, setMedicalFolders] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMedicalFolders(null);
    setErrorMessage("");

    try {
      // API endpoint to get the patients medical ViewMedicalRecords.
      const csrfToken = getCookie("csrf_access_token");
      const response = await fetch(`${BASE_URL}/patient/medicalRecords`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({ firstName, lastName, dob }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMedicalFolders(data.folders);
      } else if (response.status === 401) {
        setErrorMessage("Not authorized to view medical records.");
      } else if (response.status === 404) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      } else {
        setErrorMessage("Failed to fetch medical records.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <Container className="mt-5">
      <h1>View Patient Medical Records</h1>
      <Form onSubmit={handleSubmit} className="mb-3">
        <Form.Group className="mb-3">
          {/* First Name */}
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </Form.Group>

        {/* Last Name */}
        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </Form.Group>

        {/* DOB */}
        <Form.Group className="mb-3">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Search Records
        </Button>
      </Form>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {medicalFolders && Object.keys(medicalFolders).length > 0 ? (
        <Card style={{ maxHeight: "60vh", overflow: "hidden" }}>
          {/* Medical records */}
          <Card.Header>Medical Records</Card.Header>
          <div style={{ maxHeight: "calc(60vh - 56px)", overflowY: "auto" }}>
            <ListGroup variant="flush">
              {Object.entries(medicalFolders).map(([folderName, files]) => (
                <div key={folderName}>
                  <ListGroup.Item>
                    <strong>{folderName}</strong>
                    {files.length > 0 ? (
                      <ListGroup>
                        {files.map((file) => (
                          <ListGroup.Item key={file.name}>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {file.name}
                            </a>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <p className="text-muted ms-2">
                        No files in this folder.
                      </p>
                    )}
                  </ListGroup.Item>
                </div>
              ))}
            </ListGroup>
          </div>
        </Card>
      ) : (
        medicalFolders !== null &&
        !errorMessage && (
          <Alert variant="info">
            No medical records found for this patient.
          </Alert>
        )
      )}
    </Container>
  );
};

export default ViewMedicalRecords;
