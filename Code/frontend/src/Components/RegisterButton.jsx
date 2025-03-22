import React from "react";
import { useNavigate } from "react-router-dom";

function RegisterButton() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <button
      className="btn btn-dark"
      type="button"
      style={{ fontWeight: "bold" }}
      onClick={handleRegister}
    >
      REGISTER HERE
    </button>
  );
}

export default RegisterButton;
