import React, { useState, useEffect } from "react";
import { Form, Button, ListGroup, Alert, Row, Col } from "react-bootstrap";
import { BASE_URL } from "../../src/config";

function MedicineForm({ setMedications, medications, setPrescriptionError }) {
  const [currentMedication, setCurrentMedication] = useState({
    name: "",
    quantity: 1,
    instructions: "",
  });
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [loadingMedicines, setLoadingMedicines] = useState(false);
  const [medicineFetchError, setMedicineFetchError] = useState("");

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoadingMedicines(true);
      setMedicineFetchError("");

      // API call to get the medicine
      try {
        const response = await fetch(`${BASE_URL}/medicines`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch medicines");
        }

        const data = await response.json();
        setAvailableMedicines(data);
      } catch (error) {
        setMedicineFetchError("Error fetching medicines");
      } finally {
        setLoadingMedicines(false);
      }
    };

    fetchMedicines();
  }, []);

  // Handles Selected medicine
  const handleMedicineSelect = (selectedName) => {
    const selectedMedicine = availableMedicines.find(
      (med) => med.medicine_name === selectedName
    );
    if (selectedMedicine) {
      setCurrentMedication({
        medicationName: selectedName,
        dosage: selectedMedicine.dosage || "",
        route: selectedMedicine.form || "",
        instructions: "",
      });
    }
  };

  // Add medicine
  const handleAddMedication = () => {
    if (!currentMedication.medicationName) {
      setPrescriptionError("Medication name is required");
      return;
    }

    setMedications([...medications, currentMedication]);
    setCurrentMedication({
      medicationName: "",
      dosage: "",
      route: "",
      instructions: "",
    });
    setPrescriptionError("");
  };

  const handleRemoveMedication = (indexToRemove) => {
    setMedications(medications.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <h5>Add Medication</h5>
      <Row className="mb-2">
        <Form.Group as={Col} xs="12">
          {/* Medicine Name */}
          <Form.Label className="mb-1">Medication Name:</Form.Label>
          {loadingMedicines ? (
            <div>Loading medicines...</div>
          ) : medicineFetchError ? (
            <Alert variant="danger">{medicineFetchError}</Alert>
          ) : (
            <Form.Control
              // Select Medicine
              as="select"
              value={currentMedication.medicationName}
              onChange={(e) => handleMedicineSelect(e.target.value)}
              required
              size="sm"
            >
              <option value="">Select medicine</option>
              {availableMedicines.map((med) => (
                <option key={med.medicine_id} value={med.medicine_name}>
                  {med.medicine_name} ({med.form}, {med.manufacturer})
                </option>
              ))}
            </Form.Control>
          )}
        </Form.Group>
      </Row>

      {/* Instructions  */}
      <Form.Group className="mb-2">
        <Form.Label className="mb-1">Instructions:</Form.Label>
        <Form.Control
          type="text"
          value={currentMedication.instructions}
          onChange={(e) =>
            setCurrentMedication({
              ...currentMedication,
              instructions: e.target.value,
            })
          }
          size="sm"
        />
      </Form.Group>

      {/* Add Medication to list  */}
      <Button
        variant="outline-primary"
        className="mb-2"
        onClick={handleAddMedication}
        size="sm"
      >
        Add Medication to List
      </Button>

      {medications.length > 0 && (
        <div>
          {/* Prescribed medication list */}
          <h5>Prescribed Medications</h5>
          <ListGroup className="mb-2">
            {medications.map((medication, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between align-items-start p-2"
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{medication.medicationName}</div>
                  <div style={{ fontSize: "0.8rem" }}>
                    <strong>Dosage:</strong> {medication.dosage}
                  </div>
                  <div style={{ fontSize: "0.8rem" }}>
                    <strong>Route:</strong> {medication.route}
                  </div>
                  <div style={{ fontSize: "0.8rem" }}>
                    <strong>Instructions:</strong> {medication.instructions}
                  </div>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemoveMedication(index)}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </div>
  );
}

export default MedicineForm;
