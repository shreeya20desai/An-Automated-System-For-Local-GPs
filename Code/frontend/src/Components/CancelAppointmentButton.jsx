import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

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

const CancelButton = ({ onCancel, rowId }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCancelConfirm = () => {
    onCancel(rowId);
    setShowModal(false);
  };

  return (
    <>
      <Button
        variant="danger"
        onClick={() => setShowModal(true)}
        style={{ padding: "5px 10px", fontSize: "14px" }}
      >
        &#x2717; Cancel
      </Button>
      <CancelAppointmentModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleCancelConfirm}
      />
    </>
  );
};

export default CancelButton;
