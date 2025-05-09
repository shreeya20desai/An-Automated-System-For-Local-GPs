import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TopNavbar from "../../../src/Components/TopNavBar";
import LeftNavbar from "../../../src/Components/LeftNavBar";
import AddPatientForm from "../../Components/AddPatient";
import AddStaffForm from "../../Components/AddStaff";
import PatientList from "../../Components/PatientList";
import StaffList from "../../Components/StaffList";
import BookAppointmentButton from "../../Components/BookAppointmentButton";
import BookingAppointment from "../../Components/BookingAppointment";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [showPatientList, setShowPatientList] = useState(false);
  const [showStaffList, setShowStaffList] = useState(false);
  const [showAppointmentContent, setShowAppointmentContent] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleBookAppointmentClick = () => {
    setShowBookingForm(true);
  };

  const handleBookingComplete = () => {
    setShowBookingForm(false);
  };

  //console.log(document.cookie);

  const navbarLinks = [
    {
      id: "addPatients",
      originalName: "Profile",
      displayName: "Add Patients",
      onClick: () => {
        setShowAddStaffForm(false);
        setShowAddPatientForm(true);
        setShowPatientList(false);
        setShowStaffList(false);
        setShowAppointmentContent(false);
        setShowBookingForm(false);
      },
    },
    {
      id: "addDoctors",
      originalName: "Profile",
      displayName: "Add Staff",
      onClick: () => {
        setShowAddStaffForm(true);
        setShowAddPatientForm(false);
        setShowPatientList(false);
        setShowStaffList(false);
        setShowAppointmentContent(false);
        setShowBookingForm(false);
      },
    },
    {
      id: "appointments",
      originalName: "Appointment_Bookings",
      displayName: "Manage Bookings",
      onClick: () => {
        setShowAddStaffForm(false);
        setShowAddPatientForm(false);
        setShowPatientList(false);
        setShowStaffList(false);
        setShowAppointmentContent(true);
        setShowBookingForm(false);
      },
    },

    {
      id: "setAvailability",
      originalName: "Profile",
      displayName: "Patient List",
      onClick: () => {
        setShowAddStaffForm(false);
        setShowAddPatientForm(false);
        setShowPatientList(true);
        setShowStaffList(false);
        setShowAppointmentContent(false);
        setShowBookingForm(false);
      },
    },
    {
      id: "setAvailability",
      originalName: "Profile",
      displayName: "Staff List",
      onClick: () => {
        setShowAddStaffForm(false);
        setShowAddPatientForm(false);
        setShowPatientList(false);
        setShowStaffList(true);
        setShowAppointmentContent(false);
        setShowBookingForm(false);
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
        {showAddPatientForm && (
          <Row>
            <Col
              xs={12}
              md={{ span: 9, offset: 3 }}
              lg={{ span: 10, offset: 2 }}
            >
              <AddPatientForm />
            </Col>
          </Row>
        )}

        {showAddStaffForm && (
          <Row>
            <Col
              xs={12}
              md={{ span: 9, offset: 3 }}
              lg={{ span: 10, offset: 2 }}
            >
              <AddStaffForm />
            </Col>
          </Row>
        )}

        {showPatientList && (
          <Row>
            <Col
              xs={12}
              md={{ span: 9, offset: 3 }}
              lg={{ span: 10, offset: 2 }}
            >
              <PatientList />
            </Col>
          </Row>
        )}

        {showStaffList && (
          <Row>
            <Col
              xs={12}
              md={{ span: 9, offset: 3 }}
              lg={{ span: 10, offset: 2 }}
            >
              <StaffList />
            </Col>
          </Row>
        )}
        {showAppointmentContent && (
          <Row>
            {!showBookingForm && (
              <Col
                xs={12}
                md={{ span: 9, offset: 3 }}
                lg={{ span: 10, offset: 2 }}
              >
                <BookAppointmentButton onClick={handleBookAppointmentClick} />
              </Col>
            )}

            <Col
              xs={12}
              md={{ span: 9, offset: 3 }}
              lg={{ span: 10, offset: 2 }}
            >
              <BookingAppointment
                show={showBookingForm}
                onHide={() => setShowBookingForm(false)}
                onBookingComplete={handleBookingComplete}
              />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default AdminDashboard;
