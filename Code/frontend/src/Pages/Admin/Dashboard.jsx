import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TopNavbar from "../../../src/Components/TopNavBar";
import LeftNavbar from "../../../src/Components/LeftNavBar";
import AddPatientForm from "../../Components/AddPatient";
import AddStaffForm from "../../Components/AddStaff";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  //Handles the AddPatientClick
  const handleAddPatientClick = () => {
    setShowAddStaffForm(false);
    setShowAddPatientForm(true);
  };

  const handlePatientFormClose = () => {
    setShowAddPatientForm(false);
  };

  //Handles the AddStaffClick
  const handleAddStaffClick = () => {
    setShowAddStaffForm(true);
    setShowAddPatientForm(false);
  };

  const handleStaffFormClose = () => {
    setShowAddStaffForm(false);
  };

  const navbarLinks = [
    {
      id: "addPatients",
      originalName: "Profile",
      displayName: "Add Patients",
      onClick: handleAddPatientClick,
    },
    {
      id: "addDoctors",
      originalName: "Profile",
      displayName: "Add Staff",
      onClick: handleAddStaffClick,
    },
    {
      id: "appointments",
      originalName: "Appointment_Bookings",
      displayName: "Manage Bookings",
      href: "#Schedule",
    },
    {
      id: "setAvailability",
      originalName: "Appointment_Bookings",
      displayName: "Set Availability",
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
        {/* Display Add PatientForm */}
        {showAddPatientForm && (
          <Row>
            <Col
              xs={12}
              md={{ span: 9, offset: 3 }}
              lg={{ span: 10, offset: 2 }}
            >
              <AddPatientForm onClose={handlePatientFormClose} />
            </Col>
          </Row>
        )}

        {/* Display Add StaffForm */}
        {showAddStaffForm && (
          <Row>
            <Col
              xs={12}
              md={{ span: 9, offset: 3 }}
              lg={{ span: 10, offset: 2 }}
            >
              <AddStaffForm onClose={handleStaffFormClose} />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default AdminDashboard;
