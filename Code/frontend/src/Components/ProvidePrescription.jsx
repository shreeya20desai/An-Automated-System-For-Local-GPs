import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Alert,
} from "react-bootstrap";
import { BASE_URL } from "../config";
import PharmacyForm from "./PharmacyForm";
import PrescriptionForm from "./PrescriptionForm";

function ProvidePrescription() {
  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState(null);
  const [verificationError, setVerificationError] = useState("");
  const [medications, setMedications] = useState([]);
  const [patientType, setPatientType] = useState("");
  const [collectionMethod, setCollectionMethod] = useState("");

  const [formInputs, setFormInputs] = useState({
    firstName: "",
    lastName: "",
    dob: "",
  });

  const handleInputChange = (e) => {
    setFormInputs({
      ...formInputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleVerify = async () => {
    const { firstName, lastName, dob } = formInputs;

    if (!firstName || !lastName || !dob) {
      setVerificationError("Please enter all fields.");
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        first_name: firstName,
        last_name: lastName,
        dob,
      });

      const response = await fetch(
        //API call to verify the patient
        `${BASE_URL}/patients/verify?${queryParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("patientId", data.p_id);
        //Displays the details of the Patint
        setPatient({
          name: `${data.first_name} ${data.last_name}`,
          dob: data.dob,
          address: `${data.street}, ${data.city}, ${data.postcode}`,
        });
        setVerificationError("");
      } else {
        const errorData = await response.json();
        setVerificationError(errorData.message || "Patient not found.");
        setPatient(null);
      }
    } catch (error) {
      setVerificationError("An error occurred while verifying the patient.");
      console.error(error);
      setPatient(null);
    }
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow">
        {step === 1 && (
          <>
            <h4>Verify Patient</h4>
            <Row>
              {/* First name , Last name & DOB */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    name="firstName"
                    value={formInputs.firstName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    name="lastName"
                    value={formInputs.lastName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    name="dob"
                    type="date"
                    value={formInputs.dob}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Throws the error Patient not found. */}
            {verificationError && (
              <Alert variant="danger" className="mt-3">
                {verificationError}
              </Alert>
            )}

            <Button className="mt-3" onClick={handleVerify}>
              Verify
            </Button>

            {patient && (
              <Card className="mt-4 p-3 bg-light">
                {/* After verifying displays the details of the patient  */}
                <h5>Patient Details</h5>
                <p>
                  <strong>Name:</strong> {patient.name}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {patient.dob}
                </p>
                <p>
                  <strong>Address:</strong> {patient.address}
                </p>
                <Button
                  variant="primary"
                  className="mt-2"
                  onClick={() => setStep(2)}
                >
                  Provide Prescription
                </Button>
              </Card>
            )}
          </>
        )}

        {step === 2 && (
          <PrescriptionForm
            patient={patient}
            medications={medications}
            setMedications={setMedications}
            goToNextStep={() => setStep(3)}
            setPatientType={setPatientType}
            setCollectionMethod={setCollectionMethod}
          />
        )}

        {step === 3 && (
          <PharmacyForm
            goBack={() => setStep(2)}
            medications={medications}
            patientType={patientType}
            collectionMethod={collectionMethod}
          />
        )}
      </Card>
    </Container>
  );
}

export default ProvidePrescription;
