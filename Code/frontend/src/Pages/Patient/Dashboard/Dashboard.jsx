import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Navbar,
  Nav,
  Table,
  CardBody,
} from "react-bootstrap";
import {
  FaUser,
  FaSignOutAlt,
  FaCalendarAlt,
  FaPrescriptionBottleAlt,
  FaFileAlt,
} from "react-icons/fa";

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

      {/* {Left Side Navbar} */}
      {/* {https://getbootstrap.com/docs/4.4/utilities/sizing/} */}
      <Container fluid style={{ paddingTop: "76px" }}>
        <Row>
          <Col
            className="h-100 d-inline-block"
            md={3}
            lg={2}
            variant="dark"
            style={{
              backgroundColor: "#041D4A",
              position: "fixed",
              paddingTop: "56px",
              bottom: 0,
              // height: "cal(100vh - 56px)", https://stackoverflow.com/questions/52941346/css-height-calc100vh-vs-height-100vh
            }}
          >
            <Nav className="flex-column" style={{ height: "100%" }}>
              <Nav.Link
                className="mt-4 mb-2 "
                href="#Appointment Bookings"
                style={{ color: "white" }}
              >
                <FaCalendarAlt
                  style={{ marginRight: "6px", marginBottom: "2px" }}
                />
                Appointment Bookings
              </Nav.Link>

              <Nav.Link
                className="mt-4 mb-2 "
                href="#Prescriptions"
                style={{ color: "white" }}
              >
                <FaPrescriptionBottleAlt style={{ marginRight: "6px" }} />
                Prescriptions
              </Nav.Link>

              <Nav.Link
                className="mt-4 mb-2 "
                href="#Medical Records"
                style={{ color: "white" }}
              >
                <FaFileAlt style={{ marginRight: "6px" }} />
                Medical Records
              </Nav.Link>

              <Nav.Link
                className="mt-4 mb-2 "
                href="#Profile"
                style={{ color: "white" }}
              >
                <FaUser style={{ marginRight: "6px" }} />
                Profile
              </Nav.Link>

              <div
                className="d-flex align-items-end mb-4 "
                style={{ height: "100%" }}
              >
                <Nav.Link
                  className="mt-auto "
                  href="#Logout"
                  style={{
                    marginLeft: "-150px",
                    color: "white",
                  }}
                >
                  <FaSignOutAlt style={{ marginRight: "6px" }} />
                  Logout
                </Nav.Link>
              </div>
            </Nav>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
