import React from "react";
import { Button, Modal } from "react-bootstrap";

function SetDoctorAvailabilityModal({
  showConfirmation,
  setShowConfirmation,
  confirmAddAvailability,
}) {
  return (
    <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Availability</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to add this availability?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={confirmAddAvailability}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SetDoctorAvailabilityModal;
