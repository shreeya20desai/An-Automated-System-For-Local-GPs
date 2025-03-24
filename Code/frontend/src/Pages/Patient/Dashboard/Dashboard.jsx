import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TopNavbar from "../../../Components/TopNavbar";
import LeftNavbar from "../../../Components/LeftNavbar";
import AppointmentCard from "../../../Components/AppointmentCard";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // NavbarLinks as props
  const navbarLinks = [
    {
      id: "appointments",
      originalName: "Appointment_Bookings",
      displayName: "Appointment Bookings",
      href: "#Schedule",
    },
    {
      id: "prescriptions",
      originalName: "Prescriptions",
      displayName: "Prescriptions",
      href: "#Medications",
    },
    {
      id: "records",
      originalName: "Medical Records",
      displayName: "Medical Records",
      href: "#PatientData",
    },
    {
      id: "profile",
      originalName: "Profile",
      displayName: "Profile",
      href: "#UserInfo",
    },
  ];

  return (
    <div
      style={{ backgroundColor: "#F5F5F5", minHeight: "100vh", width: "100vw" }}
    >
      <TopNavbar onToggleSidebar={toggleSidebar} />
      <LeftNavbar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        links={navbarLinks}
      />
      <Container fluid style={{ paddingTop: "76px" }}>
        <Row>
          <Col xs={12} md={{ span: 9, offset: 3 }} lg={{ span: 10, offset: 2 }}>
            <Row className="mb-4">
              {/* Appointment Header */}
              <Col xs={12} className="text-center mb-4">
                <h1 style={{ fontFamily: "sans", fontWeight: "bold" }}>
                  APPOINTMENT
                </h1>
              </Col>

              {/* Appointment Button */}
              <Col xs={12}>
                <Button variant="success">Book Appointment</Button>
              </Col>
            </Row>

            {/* Appointment Card :shows the details of appointment */}
            {appointmentData && (
              <AppointmentCard
                data={{
                  headers: appointmentData.headers,
                  rows: appointmentData.rows.map((row) => row.data),
                }}
              />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
