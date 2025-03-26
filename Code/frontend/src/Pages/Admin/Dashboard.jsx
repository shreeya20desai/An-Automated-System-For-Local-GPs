import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TopNavbar from "../../Components/TopNavbar";
import LeftNavbar from "../../Components/LeftNavbar";
import AppointmentCard from "../../Components/AppointmentCard";
import BookAppointmentButton from "../../Components/BookAppointmentButton";

const StaffDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navbarLinks = [
    {
      id: "addPatients",
      originalName: "Profile",
      displayName: "Add Patients",
    },
    {
      id: "addDoctors",
      originalName: "Profile",
      displayName: "Add Staff",
    },
    {
      id: "appointments",
      originalName: "Appointment_Bookings",
      displayName: "Manage Bookings",
      href: "#Schedule",
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
              {/* Appointment Header will be changed*/}
              <Col xs={12} className="text-center mb-4">
                <h1 style={{ fontFamily: "sans", fontWeight: "bold" }}>
                  APPOINTMENT
                </h1>
              </Col>

              {/* Appointment Button which will be changed*/}
              <Col xs={12}>
                <BookAppointmentButton />
              </Col>
            </Row>

            {/* this will be changed*/}
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

export default StaffDashboard;
