import React, { useState } from "react";
import Button from "react-bootstrap";
import CancelAppointmentModal from "./CancelAppointmentButtonModal";

// Reference  Links
// https://react-bootstrap.netlify.app/docs/forms/form-control/
// https://react-bootstrap.netlify.app/docs/forms/form-text
// https://react-bootstrap.netlify.app/docs/forms/select
// https://stackoverflow.com/questions/38537651/bootstrap-close-modal-not-working

const CancelAppointmentButton = ({ onCancel, rowId }) => {
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

export default CancelAppointmentButton;
