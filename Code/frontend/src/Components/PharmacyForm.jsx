import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

function PharmacyForm({ goBack, medications, patientType, collectionMethod }) {
  const [pharmacy, setPharmacy] = useState({
    name: "",
    street: "",
    city: "",
    postcode: "",
    contact_number: "",
  });

  const [pharmacies, setPharmacies] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //API call to get the pharmcy details
  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const response = await fetch(`${BASE_URL}/pharmacies`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setPharmacies(data);
        } else {
          alert("Error fetching pharmacies.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching pharmacies.");
      }
    };

    fetchPharmacies();
  }, []);

  const handleChange = (e) => {
    setPharmacy({ ...pharmacy, [e.target.name]: e.target.value });
  };

  // Pharmacy Selection
  const handlePharmacySelect = (e) => {
    const selectedPharmacyName = e.target.value;
    const selectedPharmacy = pharmacies.find(
      (pharmacy) => pharmacy.name === selectedPharmacyName
    );
    if (selectedPharmacy) {
      setPharmacy({
        ...pharmacy,
        name: selectedPharmacy.name,
        street: selectedPharmacy.street,
        city: selectedPharmacy.city,
        postcode: selectedPharmacy.postcode,
        contact_number: selectedPharmacy.contact_number,
      });
    }
  };

  const handleSubmit = async () => {
    const currentDate = new Date().toISOString().split("T")[0];

    const data = {
      patientId: localStorage.getItem("patientId"), //locally Stores the pateint id
      medicines: medications,
      pharmacyName: pharmacy.name,
      collectionMethod: collectionMethod,
      dateProvided: currentDate,
      patientType: patientType, //either student / normal
    };

    //API call to provide the prescription
    try {
      const response = await fetch(`${BASE_URL}/providePrescription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          `Prescription sent to pharmacy! Prescription ID: ${result.prescriptionid}`
        );
        // navigate("/nextPage"); // Navigate to the next page if needed
      } else {
        const err = await response.json();
        setError(
          err.message || "An error occurred while sending the prescription."
        );
      }
    } catch (error) {
      setError("An error occurred while sending the prescription.");
      console.error("Error:", error);
    }
  };
  return (
    <div>
      <h5>Add Pharmacy</h5>
      <Row>
        <Col md={6}>
          <Form.Group>
            {/* Pharmacy Name */}
            <Form.Label>Pharmacy Name</Form.Label>
            <Form.Select
              name="name"
              value={pharmacy.name}
              onChange={handlePharmacySelect}
            >
              <option value="">Select a Pharmacy</option>
              {pharmacies.map((pharmacy) => (
                <option key={pharmacy.pharmacy_id} value={pharmacy.name}>
                  {pharmacy.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Street */}
        <Col md={6}>
          <Form.Group>
            <Form.Label>Street</Form.Label>
            <Form.Control
              name="street"
              value={pharmacy.street}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* City & Postcode*/}
      <Row>
        <Col md={6}>
          <Form.Group>
            <Form.Label>City</Form.Label>
            <Form.Control
              name="city"
              value={pharmacy.city}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Postcode</Form.Label>
            <Form.Control
              name="postcode"
              value={pharmacy.postcode}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Contact Number */}
      <Row>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              name="contact_number"
              value={pharmacy.contact_number}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="mt-3 d-flex gap-2">
        <Button className="mt-3" variant="secondary" onClick={goBack}>
          Back to Prescription
        </Button>
        <Button onClick={handleSubmit}>Send to Pharmacy</Button>
      </div>
    </div>
  );
}

export default PharmacyForm;
