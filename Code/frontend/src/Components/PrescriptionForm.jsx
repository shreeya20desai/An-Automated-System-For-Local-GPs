import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { getCookie } from "../utils";
import { BASE_URL } from "../config";

function PrescriptionForm({
  patient,
  medications,
  setMedications,
  goToNextStep,
  setPatientType,
  setCollectionMethod,
}) {
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState("");
  const [instructions, setInstructions] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const csrfToken = getCookie("csrf_access_token");
        // API call to fetch the medicines
        const response = await fetch(`${BASE_URL}/medicines`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAvailableMedicines(data);
        } else {
          const err = await response.json();
          setError(err.error || "Failed to fetch medicines.");
        }
      } catch (err) {
        setError("An error occurred while fetching medicines.");
        console.error(err);
      }
    };

    fetchMedicines();
  }, []);

  //   Logic to add the medicine
  const handleAddMedicine = () => {
    const selected = availableMedicines.find(
      (med) => med.medicine_id === parseInt(selectedMedicineId)
    );

    if (!selectedMedicineId || !quantity) {
      setError("Please fill the fields.");
      return;
    }

    if (
      selected &&
      !medications.some((med) => med.medicine_id === selected.medicine_id)
    ) {
      const medicineWithDetails = {
        ...selected,
        instructions,
        quantity,
      };
      setMedications([...medications, medicineWithDetails]);

      //Clear fields
      setSelectedMedicineId("");
      setInstructions("");
      setQuantity("");
      setError("");
    }
  };

  return (
    <div>
      <h4>Provide Prescription</h4>
      {/* Displys the patient Information */}
      <p>
        <strong>Patient:</strong> {patient.name}
      </p>
      <p>
        <strong>DOB:</strong> {patient.dob}
      </p>
      <p>
        <strong>Address:</strong> {patient.address}
      </p>

      <Form>
        <Row>
          {/* Select Medicine  */}
          <Col md={6}>
            <Form.Group controlId="medicineSelect">
              <Form.Label>Select Medicine</Form.Label>
              <Form.Control
                as="select"
                value={selectedMedicineId}
                onChange={(e) => setSelectedMedicineId(e.target.value)}
              >
                <option value="">-- Select Medicine --</option>
                {availableMedicines.map((medicine) => (
                  <option
                    key={medicine.medicine_id}
                    value={medicine.medicine_id}
                  >
                    {medicine.medicine_name} ({medicine.dosage}, {medicine.form}
                    )
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          {/* Quantity */}
          <Col md={3}>
            <Form.Group controlId="quantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 10"
              />
            </Form.Group>
          </Col>

          {/* Instructions */}
          <Col md={3}>
            <Form.Group controlId="instructions">
              <Form.Label>Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g., Take after meals, 2 times a day"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Patient Type */}
        <Row className="mt-3">
          <Col md={6}>
            <Form.Group controlId="patientType">
              <Form.Label>Patient Type</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setPatientType(e.target.value)}
              >
                <option value="">-- Select Patient Type --</option>
                <option value="student">Student</option>
                <option value="normal">Normal Patient</option>
              </Form.Control>
            </Form.Group>
          </Col>

          {/* Collection Method */}
          <Col md={6}>
            <Form.Group controlId="collectionMethod">
              <Form.Label>Collection Method</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setCollectionMethod(e.target.value)}
              >
                <option value="">-- Select Collection Method --</option>
                <option value="home_delivery">Home Delivery</option>
                <option value="in_store">In-store</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Button variant="success" className="mt-3" onClick={handleAddMedicine}>
          Add Medicine
        </Button>

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}

        {medications.length > 0 && (
          <div className="mt-4">
            <h5> Medicines:</h5>
            <ul>
              {medications.map((med) => (
                <li key={med.medicine_id}>
                  {med.medicine_name} - {med.dosage} ({med.form}) | Quantity:{" "}
                  {med.quantity} | Instructions: {med.instructions}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          variant="primary"
          className="mt-3"
          onClick={goToNextStep}
          disabled={!patient} // if incase patient is not verified
        >
          Pharmacy
        </Button>
      </Form>
    </div>
  );
}

export default PrescriptionForm;
