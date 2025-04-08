import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TopNavbar from "../../Components/TopNavBar";
import LeftNavbar from "../../Components/LeftNavBar";
import SetDoctorAvailability from "../../Components/SetDoctorAvailability";
import StaffProfile from "../../Components/StaffProfile";

const StaffDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSetAvailability, setShowSetAvailability] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [staffType, setStaffType] = useState("Doctor");

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
      onClick: () => {
        setShowSetAvailability(true);
        setShowProfile(false);
      },
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
      onClick: () => {
        setShowSetAvailability(false);
        setShowProfile(true);
      },
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
            {showSetAvailability && <SetDoctorAvailability />}
            {showProfile && <StaffProfile staffType={staffType} />}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StaffDashboard;
