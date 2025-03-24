import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <button
      className="btn btn-dark"
      href=""
      type="button"
      style={{
        borderRadius: "3px",
        backgroundColor: "white",
        color: "black",
        display: "flex",
        alignItems: "center",
        margin: "5px 10px",
      }}
      onClick={handleLogout}
    >
      <FaSignOutAlt style={{ marginRight: "6px" }} />
      Logout
    </button>
  );
}

export default LogoutButton;
