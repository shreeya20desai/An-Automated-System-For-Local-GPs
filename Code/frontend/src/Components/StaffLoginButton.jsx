import React from "react";
import { useNavigate } from "react-router-dom";

function StaffLoginButton() {
  const navigate = useNavigate();

  const handleStaffLoginButton = () => {
    navigate("/staffLogin");
  };

  return (
    <button
      className="btn btn-dark"
      type="button"
      style={{ fontWeight: "bold" }}
      onClick={handleStaffLoginButton}
    >
      STAFF LOGIN
    </button>
  );
}

export default StaffLoginButton;
