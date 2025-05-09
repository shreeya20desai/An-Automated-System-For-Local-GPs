import React from "react";
import { Container, Card, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function PaymentCancel() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 text-center">
        <Alert variant="danger">
          <h4>Payment Cancelled</h4>
          <p>
            Your payment was cancelled. Please try again to purchase the
            prescription.
          </p>
          <Button variant="primary" onClick={handleGoBack}>
            Go Back to Dashboard
          </Button>
        </Alert>
      </Card>
    </Container>
  );
}

export default PaymentCancel;
