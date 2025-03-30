import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TopNavbar from "../../Components/TopNavBar";
import LeftNavbar from "../../Components/LeftNavBar";
import SetDoctorAvailability from "../../Components/SetDoctorAvailability";

const StaffDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSetAvailability, setShowSetAvailability] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navbarLinks = [
    {
      id: "setAvailability",
      originalName: "Appointment_Bookings",
      displayName: "Set Availability",
      onClick: () => setShowSetAvailability(true),
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
            {/* Removed the "Appointment" heading and "Book Appointment" button */}
          </Col>
        </Row>
        {showSetAvailability && (
          <Row>
            <Col
              xs={12}
              md={{ span: 9, offset: 3 }}
              lg={{ span: 10, offset: 2 }}
            >
              <SetDoctorAvailability />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default StaffDashboard;
