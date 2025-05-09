import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Card,
  Spinner,
  Alert,
  Modal,
  Button,
} from "react-bootstrap";
import { getCookie } from "../utils";
import { BASE_URL } from "../config";

const StaffList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!selectedRole) {
        setStaff([]);
        return;
      }

      setLoading(true);
      setError(null);

      const endpoint =
        selectedRole === "Doctor"
          ? `${BASE_URL}/getDoctors`
          : `${BASE_URL}/getNurses`;

      try {
        //API call to get the patient list
        const csrfToken = getCookie("csrf_access_token");
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setStaff(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Error fetching staff data");
        }
      } catch (err) {
        setError("An error occurred while fetching staff data");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [selectedRole]);

  // Filters the person based on the name, email & phone
  const filteredStaff = staff.filter((person) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      (person.Name && person.Name.toLowerCase().includes(lowerSearch)) ||
      (person.Email && person.Email.toLowerCase().includes(lowerSearch)) ||
      (person.Phone && person.Phone.includes(searchTerm))
    );
  });

  useEffect(() => {
    if (selectedRole) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedRole]);

  // Handle the confirm remove action
  const confirmRemove = (person) => {
    setSelectedPerson(person);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedPerson) return;

    const endpoint =
      selectedRole === "Doctor"
        ? `${BASE_URL}/deleteDoctor?email=${selectedPerson.Email}`
        : `${BASE_URL}/deleteNurse?email=${selectedPerson.Email}`;

    try {
      const csrfToken = getCookie("csrf_access_token");
      //API endpoint to delete the staff
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
      });

      if (response.ok) {
        const updatedStaff = staff.filter(
          (s) => s.Email !== selectedPerson.Email
        );
        setStaff(updatedStaff);
        setShowConfirmModal(false);
        setSelectedPerson(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error deleting staff");
      }
    } catch (err) {
      setError("An error occurred while deleting staff");
    }
  };

  return (
    <Container fluid className="py-4 px-3">
      <Row className="justify-content-center mb-3">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Form.Control
            type="text"
            placeholder="Search by name, email, or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />

          {/* Select the Role */}
          <Form.Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
          </Form.Select>
        </Col>
      </Row>

      {error && (
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {loading && !error && selectedRole && (
        <Row className="justify-content-center">
          <Col xs="auto">
            <Spinner animation="border" role="status" />
          </Col>
        </Row>
      )}

      {!loading && !error && selectedRole && (
        <Row className="justify-content-center">
          <Col xs={12} sm={11} md={10} lg={8}>
            <Card className="shadow-sm">
              <Card.Body className="p-3">
                <div className="table-responsive" style={{ maxHeight: "45vh" }}>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th className="d-none d-md-table-cell">
                          Registration No.
                        </th>
                        <th className="d-none d-lg-table-cell">
                          Specialization
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaff.length > 0 ? (
                        filteredStaff.map((person, index) => (
                          <tr key={index}>
                            <td>{person.Name}</td>
                            <td>{person.Email}</td>
                            <td>{person.Phone}</td>
                            <td className="d-none d-md-table-cell">
                              {person.RegistrationNumber}
                            </td>
                            <td className="d-none d-lg-table-cell">
                              {person.Specialization
                                ? `Specialization ${person.Specialization}`
                                : "N/A"}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => confirmRemove(person)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No staff found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {!selectedRole && !loading && !error && (
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} className="text-center">
            <p className="lead">
              Please select a role (Doctor or Nurse) to view the staff list.
            </p>
          </Col>
        </Row>
      )}

      {/* Delete Modal*/}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{selectedPerson?.Name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StaffList;
