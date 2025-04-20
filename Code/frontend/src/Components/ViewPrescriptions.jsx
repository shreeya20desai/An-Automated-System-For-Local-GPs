import React, { useState, useEffect } from "react";
import { Container, Card, Table } from "react-bootstrap";
import { BASE_URL } from "../config";

function PatientDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentPatientId = localStorage.getItem("patient_id");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/prescriptions?patientId=${currentPatientId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch prescriptions");
        }

        const data = await response.json();
        setPrescriptions(data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [currentPatientId]);

  if (loading) {
    return (
      <Container className="mt-5">
        <Card className="p-4 text-center">Loading prescriptions...</Card>
      </Container>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <Container className="mt-5">
        <Card className="p-4 text-center">
          <h4>No Prescriptions Found</h4>
          <p>It seems you don't have any prescriptions yet.</p>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">
      <Card className="p-3 shadow-sm" style={{ borderRadius: "16px" }}>
        <h2 className="text-center mb-4">Prescriptions</h2>

        {/* Scrollable section */}
        <div
          style={{
            maxHeight: "65vh",
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >
          {prescriptions.map((prescription, index) => (
            <Card key={index} className="mb-3 p-2 border-0 bg-light">
              <Card.Header className="text-truncate bg-white fw-semibold">
                Prescribed on{" "}
                {new Date(prescription.dateProvided).toLocaleDateString()} by{" "}
                {prescription.doctorEmail}
              </Card.Header>

              <Card.Body>
                <p className="mb-2">
                  <strong>Pharmacy:</strong> {prescription.pharmacyName} <br />
                  <strong>Collection Method:</strong>{" "}
                  {prescription.collectionMethod} <br />
                  <strong>Total Cost:</strong> £{prescription.totalCost}
                </p>

                {/* Desktop Table */}
                <div className="d-none d-md-block">
                  <Table striped bordered hover responsive size="sm">
                    <thead>
                      <tr>
                        <th>Medication</th>
                        <th>Quantity</th>
                        <th>Instructions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescription.medicines.map((med, medIndex) => (
                        <tr key={medIndex}>
                          <td>{med.name}</td>
                          <td>{med.quantity}</td>
                          <td>{med.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {/* Mobile View */}
                <div className="d-md-none">
                  {prescription.medicines.map((med, medIndex) => (
                    <Card
                      key={medIndex}
                      className="mb-2 border-light shadow-sm"
                    >
                      <Card.Body className="p-2">
                        <Card.Title className="fs-6 mb-1">
                          <strong>Name: </strong>
                          {med.name}
                        </Card.Title>
                        <Card.Text className="mb-1">
                          <strong>Quantity:</strong> {med.quantity}
                        </Card.Text>
                        <Card.Text className="mb-0">
                          <strong>Instructions:</strong> {med.instructions}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Card>
    </Container>
  );
}

export default PatientDashboard;
