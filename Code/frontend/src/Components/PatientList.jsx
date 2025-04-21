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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      //API call to get the patients to display
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

  // Filters the patient based on the name, email & phone
  const filteredPatients = patients.filter(
    (patient) =>
      (patient.P_FirstName &&
        patient.P_FirstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.Email_Id &&
        patient.Email_Id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleShowDetails = (patient) => {
    setSelectedPatient(patient);
  };

  const handleCloseDetails = () => {
    setSelectedPatient(null);
  };

  const handleRemovePatient = (patient) => {
    setPatientToDelete(patient);
    setShowConfirmModal(true);
  };

  const confirmDeletePatient = async () => {
    if (!patientToDelete) return;

    try {
      // API call to delete patient
      const response = await fetch(
        `${BASE_URL}/deletePatient?email=${patientToDelete.Email_Id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setPatients(
          patients.filter((p) => p.Email_Id !== patientToDelete.Email_Id)
        );
        alert(
          `Patient with email ${patientToDelete.Email_Id} has been removed.`
        );
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error removing patient");
      }
    } catch (err) {
      setError("An error occurred while removing the patient");
    } finally {
      setShowConfirmModal(false);
      setPatientToDelete(null);
    }
  };

  return (
    <Container className="my-4">
      <Row className="mb-3">
        <Col>
          <h2>Patients</h2>
        </Col>
      </Row>

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

      {loading && !error && (
        <Row className="mb-3">
          <Col>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </Col>
        </Row>
      )}

      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
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
                  <td>{patient.P_id}</td>
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
                    <div className="d-flex gap-2 flex-wrap">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleShowDetails(patient)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemovePatient(patient)}
                      >
                        Remove
                      </Button>
                    </div>
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

      {/* Patient Details Modal */}
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

      {/* Modal: Confirm delete*/}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove the patient{" "}
          <strong>
            {patientToDelete?.P_FirstName} {patientToDelete?.P_LastName}
          </strong>{" "}
          with email <strong>{patientToDelete?.Email_Id}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeletePatient}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PatientList;
