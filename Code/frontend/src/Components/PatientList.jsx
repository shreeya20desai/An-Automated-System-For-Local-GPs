import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Modal,
  Button,
} from "react-bootstrap";
import { BASE_URL } from "../config";

const PatientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${BASE_URL}/getPatients`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Error fetching data");
        }
      } catch (err) {
        setError("An error occurred while fetching patients");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Patients are been filtered based on First name and email id.
  const filteredPatients = patients.filter(
    (patient) =>
      (patient.P_FirstName &&
        patient.P_FirstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.Email_Id &&
        patient.Email_Id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  //  Details are been shown of selected patient (Modal Toggle)
  const handleShowDetails = (patient) => {
    setSelectedPatient(patient);
  };

  const handleCloseDetails = () => {
    setSelectedPatient(null);
  };

  return (
    <Container className="my-4">
      <Row className="mb-3">
        <Col>
          <h2>Patients</h2>
        </Col>
      </Row>

      {/* Search by name or email */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </Col>
        </Row>
      )}

      {/* Spinner loading */}
      {loading && !error && (
        <Row className="mb-3">
          <Col>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </Col>
        </Row>
      )}

      {/* Scrollable list of patients */}
      <div
        style={{
          maxHeight: "400px", // maxi height of the of scrollable area
          overflowY: "auto", // vertical scrolling
        }}
      >
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th className="d-none d-sm-table-cell">DOB</th>
              <th className="d-none d-md-table-cell">Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
                <tr key={index}>
                  <td>
                    {patient.P_FirstName} {patient.P_LastName}
                  </td>
                  <td>{patient.Email_Id}</td>
                  <td>{patient.Gender}</td>
                  <td className="d-none d-sm-table-cell">
                    {patient.DOB
                      ? new Date(patient.DOB).toISOString().slice(0, 10)
                      : ""}
                  </td>

                  <td className="d-none d-md-table-cell">{patient.Phone_No}</td>
                  <td>
                    <Button
                      variant="info"
                      onClick={() => handleShowDetails(patient)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Patient details (Modal) */}
      {selectedPatient && (
        <Modal show={true} onHide={handleCloseDetails}>
          <Modal.Header closeButton>
            <Modal.Title>Patient Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Name:</strong> {selectedPatient.P_FirstName}{" "}
              {selectedPatient.P_LastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedPatient.Email_Id}
            </p>
            <p>
              <strong>Gender:</strong> {selectedPatient.Gender}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {selectedPatient.DOB
                ? new Date(selectedPatient.DOB).toISOString().slice(0, 10)
                : ""}
            </p>

            <p>
              <strong>Phone Number:</strong> {selectedPatient.Phone_No}
            </p>
            <p>
              <strong>Address:</strong> {selectedPatient.StreetAddress},{" "}
              {selectedPatient.City}, {selectedPatient.Postcode}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetails}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default PatientList;
