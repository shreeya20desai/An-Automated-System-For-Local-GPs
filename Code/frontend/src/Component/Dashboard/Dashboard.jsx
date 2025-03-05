import React from "react";
import {
  Container,
  Row,
  Column,
  Card,
  Button,
  Navbar,
  Nav,
} from "react-bootstrap";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div
      style={{ backgroundColor: "#F5F5F5", minHeight: "100vh", width: "100vw" }}
    >
      {/* Navbar content */}
      {/* https://react-bootstrap.netlify.app/docs/components/navbar/ */}
      {/* https://www.geeksforgeeks.org/react-bootstrap-navbar-component/ */}
      <Navbar
        collapseOnSelect
        expand="lg"
        fixed="top"
        variant="dark"
        style={{ backgroundColor: "#041D4A" }}
      >
        {/* {Top Navbar} */}
        <Container fluid>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              {/* {Navbar Links} */}

              <Nav.Link
                href="#"
                style={{
                  borderRadius: "3px",
                  backgroundColor: "white",
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                  marginRight: "10px",
                  margin: "5px 10px",
                }}
              >
                <FaUser style={{ marginRight: "6px" }} />
                My Profile
              </Nav.Link>

              <Nav.Link
                href="#logout"
                style={{
                  borderRadius: "3px",
                  backgroundColor: "white",
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                  margin: "5px 10px",
                }}
              >
                <FaSignOutAlt style={{ marginRight: "6px" }} />
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
