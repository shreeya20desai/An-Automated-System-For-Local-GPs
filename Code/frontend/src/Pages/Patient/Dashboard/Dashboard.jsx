import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TopNavbar from "../../../Components/TopNavBar";
import LeftNavbar from "../../../Components/LeftNavBar";
import AppointmentCard from "../../../Components/AppointmentCard";
import BookAppointmentButton from "../../../Components/BookAppointmentButton";
import BookingAppointmentModal from "../../../Components/BookingAppointmentModal";
import Profile from "../../../Components/Profile";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  //dummy data
  const [appointmentData, setAppointmentData] = useState({
    headers: ["APP ID", "Date", "Time", "Status"],
    rows: [
      { id: "001", data: ["001", "2022-10-10", "10:00 AM", "Scheduled"] },
      { id: "002", data: ["002", "2022-10-11", "11:30 AM", "Completed"] },
    ],
  });

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showAppointmentContent, setShowAppointmentContent] = useState(true);
  const [showProfile, setProfile] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleCancelAppointment = (appointmentId) => {
    console.log(`Canceling appointment ${appointmentId}`);
    setAppointmentData((prevData) => ({
      ...prevData,
      rows: prevData.rows.filter((row) => row.id !== appointmentId),
    }));
  };

  const handleBookAppointmentClick = () => {
    setShowBookingForm(true);
  };

  const handleBookingComplete = () => {
    setShowBookingForm(false);
  };

  // NavbarLinks as props
  const navbarLinks = [
    {
      id: "appointments",
      originalName: "Appointment_Bookings",
      displayName: "Appointment Bookings",
      onClick: () => {
        setShowAppointmentContent(true);
        setShowBookingForm(false);
        setProfile(false);
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
        setShowAppointmentContent(false);
        setShowBookingForm(false);
        setProfile(true);
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
            {showAppointmentContent && (
              <>
                <Row className="mb-4">
                  <Col xs={12} className="text-center mb-4">
                    <h1 style={{ fontFamily: "sans", fontWeight: "bold" }}>
                      APPOINTMENT
                    </h1>
                  </Col>
                  {!showBookingForm && (
                    <Col xs={12}>
                      <BookAppointmentButton
                        onClick={handleBookAppointmentClick}
                      />
                    </Col>
                  )}
                </Row>

                <BookingAppointmentModal
                  show={showBookingForm}
                  onHide={() => setShowBookingForm(false)}
                  onBookingComplete={handleBookingComplete}
                />

                {/* Appointment Card :shows the details of appointment */}
                {appointmentData && (
                  <AppointmentCard
                    data={{
                      headers: appointmentData.headers,
                      rows: appointmentData.rows.map((row) => row.data),
                    }}
                    onCancel={handleCancelAppointment}
                  />
                )}
              </>
            )}

            {showProfile && <Profile />}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
