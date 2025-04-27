import React, { useState, useEffect } from "react";
import { Container, Card, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionIdFromUrl = searchParams.get("session_id");
    if (sessionIdFromUrl) {
      setSessionId(sessionIdFromUrl);
      console.log("Payment Success! Session ID:", sessionIdFromUrl);
    }
  }, [location.search]);

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigate("/dashboard");
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 text-center">
        {showAlert && (
          // The payment alert
          // dismissible to close the box
          <Alert variant="success" onClose={handleCloseAlert} dismissible>
            <h4>Payment Successful!</h4>
            <p>
              Thank you for your purchase. Your prescription is being processed.
            </p>
            {sessionId && <p>Stripe Session ID: {sessionId}</p>}
          </Alert>
        )}
        {!showAlert && (
          <p>
            Payment successful. You can now view your order details on your
            dashboard.
          </p>
        )}
      </Card>
    </Container>
  );
}

export default PaymentSuccess;
