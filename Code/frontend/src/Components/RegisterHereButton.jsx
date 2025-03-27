import React from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterHereButton() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <button
      className="btn btn-dark"
      type="submit"
      style={{ fontWeight: "bold" }}
      onClick={handleRegister}
    >
      REGISTER HERE
    </button>
  );
}

export default RegisterHereButton;
