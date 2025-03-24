import React, { useState, useRef, useEffect } from "react";
import { Nav, Col } from "react-bootstrap";
import {
  FaCalendarAlt,
  FaPrescriptionBottleAlt,
  FaFileAlt,
  FaUser,
} from "react-icons/fa";

const LeftNavbar = ({ isOpen, onClose, links }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, onClose]);

  const icons = {
    Appointment_Bookings: (
      <FaCalendarAlt style={{ marginRight: "6px", marginBottom: "2px" }} />
    ),
    Prescriptions: <FaPrescriptionBottleAlt style={{ marginRight: "6px" }} />,
    "Medical Records": <FaFileAlt style={{ marginRight: "6px" }} />,
    Profile: <FaUser style={{ marginRight: "6px" }} />,
  };

  return (
    <Col
      ref={menuRef}
      xs={12}
      sm={10}
      md={2}
      lg={3}
      xl={3}
      xxl={3}
      className={`position-fixed text-white ${
        isOpen ? "d-block" : "d-none d-md-block"
      }`}
      style={{
        backgroundColor: "#041D4A",
        paddingTop: "56px",
        top: 0,
        bottom: 0,
        width: isOpen ? "40%" : "250px", //if NavBar is open make it 40% or else fixed size of 250px.
        zIndex: 1000,
      }}
    >
      <Nav
        className="flex-column"
        style={{ height: "100%", overflowY: "auto" }}
      >
        {links &&
          links.map((link) => (
            <Nav.Link
              key={link.id}
              className="mt-4 mb-2"
              href={link.href}
              style={{ color: "white" }}
            >
              {icons[link.originalName]} {link.displayName}
            </Nav.Link>
          ))}
      </Nav>
    </Col>
  );
};

export default LeftNavbar;
