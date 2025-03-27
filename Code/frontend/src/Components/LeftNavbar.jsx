import React, { useRef, useEffect } from "react"; //https://react.dev/learn/manipulating-the-dom-with-refs
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
    //The LeftNavBAr will be closed when clicked outside.
    const handleClickOutside = (event) => {
      // Checks if any click  is done outside the menuRef
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
      //if the NavBar is open display it in block or else d-none for small screens and d-md-block for medium screens
      className={`position-fixed text-white ${
        isOpen ? "d-block" : "d-none d-md-block"
      }`}
      style={{
        backgroundColor: "#041D4A",
        paddingTop: "56px",
        top: 0,
        bottom: 0,
        width: isOpen ? "40%" : "200px", //if NavBar is open make it 40% or else fixed size of 200px.
        zIndex: 1000,
      }}
    >
      <Nav
        className="flex-column"
        style={{ height: "100%", overflowY: "auto" }}
      >
        {/* NavBar links */}
        {links &&
          links.map((link) => (
            <Nav.Link
              key={link.id}
              className="mt-4 mb-2"
              href={link.href}
              onClick={link.onClick}
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
