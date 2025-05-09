import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { BASE_URL } from "../../src/config";
import { getCookie } from "../utils";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const csrfToken = getCookie("csrf_access_token");
      await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
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
