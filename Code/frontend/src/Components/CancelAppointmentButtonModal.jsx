import React from "react";
import { Button, Modal } from "react-bootstrap";

// Reference  Links
// https://react-bootstrap.netlify.app/docs/forms/form-control/
// https://react-bootstrap.netlify.app/docs/forms/form-text
// https://react-bootstrap.netlify.app/docs/forms/select
// https://stackoverflow.com/questions/38537651/bootstrap-close-modal-not-working

const CancelAppointmentModal = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Cancellation</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to cancel the appointment?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          No
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Yes, Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CancelAppointmentModal;
