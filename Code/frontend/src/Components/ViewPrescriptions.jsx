import React, { useState, useEffect } from "react";
import { Container, Card, Table, Button } from "react-bootstrap";
import PaymentAlreadyDoneModal from "./PaymentAlreadyDoneModal";
import { BASE_URL } from "../config";
import { getCookie } from "../utils";
import { loadStripe } from "@stripe/stripe-js";

// Publishable key (From the Stripe dashboard)
const stripePromise = loadStripe(
  "pk_test_51RGHcUBVGfGb5W2wShdqPPEa03fhPvlfsCdoewGMVZ8jGVjUtPYrqpjBgNCOXa7caOEw4Qd0SQoP5yuyjvkTR9OM00GjDn9wNB"
);

function ViewPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentError, setPaymentError] = useState(null);
  const [showPaymentDoneModal, setShowPaymentDoneModal] = useState(false);
  const currentPatientId = localStorage.getItem("patient_id");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      // API endpoint to fetch the prescription
      try {
        const csrfToken = getCookie("csrf_access_token");
        const response = await fetch(
          `${BASE_URL}/prescriptions?patientId=${currentPatientId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": csrfToken,
            },
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

  const handlePayNow = async (totalCost, prescriptionID) => {
    // API endpoint to create the payment session
    try {
      const csrfToken = getCookie("csrf_access_token");
      const response = await fetch(`${BASE_URL}/create-payment-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({
          amount: totalCost * 100, // Stripe expects amount in cents
          patientId: currentPatientId,
          prescription_id: prescriptionID,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (
          errorData &&
          errorData.error === "Payment already completed for this prescription"
        ) {
          // PaymentAlreadyDoneModal
          setShowPaymentDoneModal(true);
          return;
        }
        throw new Error(
          `Failed to create payment intent: ${
            errorData.error || response.statusText
          }`
        );
      }
      const { sessionId } = await response.json();
      console.log("Session ID:", sessionId);

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        console.error("Error redirecting to Stripe Checkout:", error);
        setPaymentError(
          "Failed to redirect to payment gateway. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setPaymentError(`Failed to initiate payment: ${error.message}`);
    }
  };

  // If the prescriptions are loading
  if (loading) {
    return (
      <Container className="mt-5">
        <Card className="p-4 text-center">Loading prescriptions...</Card>
      </Container>
    );
  }

  // If incase there arent any prescriptions provided
  if (prescriptions.length === 0) {
    return (
      <Container className="mt-5">
        <Card className="p-4 text-center">
          <h4>No Prescriptions Found</h4>
          <p>Seems you don't have any prescriptions yet.</p>
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
            // Prescription Header
            <Card key={index} className="mb-3 p-2 border-0 bg-light">
              <Card.Header className="text-truncate bg-white fw-semibold">
                Prescribed on{" "}
                {new Date(prescription.dateProvided).toLocaleDateString()} by{" "}
                {prescription.doctorEmail}
              </Card.Header>

              {/* Prescription Body */}
              <Card.Body>
                <p className="mb-2">
                  <strong>Pharmacy:</strong> {prescription.pharmacyName} <br />
                  <strong>Collection Method:</strong>{" "}
                  {prescription.collectionMethod} <br />
                  <strong>Total Cost:</strong> £{prescription.totalCost}
                  {/* Pay now Button */}
                  <Button
                    variant="success"
                    size="sm"
                    className="ms-2"
                    onClick={() =>
                      handlePayNow(
                        prescription.totalCost,
                        prescription.prescriptionid
                      )
                    }
                  >
                    Pay Now (£{prescription.totalCost})
                  </Button>
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
                  <div className="d-grid mt-2">
                    <Button
                      variant="success"
                      onClick={() =>
                        handlePayNow(
                          prescription.totalCost,
                          prescription.prescriptionid
                        )
                      }
                    >
                      Pay Now (£{prescription.totalCost})
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Card>

      {/* Payment already done modal */}
      <PaymentAlreadyDoneModal
        show={showPaymentDoneModal}
        onClose={() => setShowPaymentDoneModal(false)}
      />
    </Container>
  );
}

export default ViewPrescriptions;
