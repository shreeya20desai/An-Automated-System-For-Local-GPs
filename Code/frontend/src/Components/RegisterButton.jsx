import React from "react";

function RegisterButton({ onClick }) {
  // Added onClick prop
  return (
    <button
      className="btn btn-dark"
      type="button"
      style={{ fontWeight: "bold" }}
      onClick={onClick}
    >
      REGISTER
    </button>
  );
}

export default RegisterButton;
