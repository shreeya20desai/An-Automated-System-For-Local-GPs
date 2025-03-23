import React from "react";

function LoginButton({ onSubmit }) {
  return (
    <button
      type="submit"
      className="btn btn-dark"
      style={{ fontWeight: "bold" }}
      onClick={onSubmit}
    >
      LOGIN
    </button>
  );
}

export default LoginButton;
