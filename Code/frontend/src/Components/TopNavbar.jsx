import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import LogoutButton from "./LogoutButton";

const TopNavbar = ({ onToggleSidebar }) => {
  return (
    <Navbar variant="dark" fixed="top" style={{ backgroundColor: "#041D4A" }}>
      <Container fluid>
        <Nav className="me-auto">
          <Nav.Link onClick={onToggleSidebar} className="d-md-none"></Nav.Link>
        </Nav>
        <Nav className="ms-auto">
          <LogoutButton />
        </Nav>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
