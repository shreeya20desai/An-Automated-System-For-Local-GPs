import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TopNavbar from "../../Components/TopNavBar";
import LeftNavbar from "../../Components/LeftNavBar";
import SetDoctorAvailability from "../../Components/SetDoctorAvailability";
import StaffProfile from "../../Components/StaffProfile";
import GetPatientBooking from "../../Components/GetPatientBooking";
import ProvidePrescription from "../../Components/ProvidePrescription";
import ViewMedicalHistory from "../../Components/ViewMedicalHistory";

const StaffDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSetAvailability, setShowSetAvailability] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [staffType, setStaffType] = useState("");
  const [sidebarLinks, setSidebarLinks] = useState([]);
  const [showGetPatientBooking, setShowGetPatientBooking] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [showViewMedicalHistory, setShowMedicalHistory] = useState(false);

  useEffect(() => {
    const storedStaffType = localStorage.getItem("staffType");
    if (storedStaffType) {
      setStaffType(storedStaffType);
    }

    const initialLinks = [
      {
        id: "setAvailability",
        originalName: "Appointment_Bookings",
        displayName: "Set Availability",
        onClick: () => {
          setShowSetAvailability(true);
          setShowProfile(false);
          setShowGetPatientBooking(false);
          setShowPrescription(false);
          setShowMedicalHistory(false);
        },
      },

      {
        id: "getPatientBooking",
        originalName: "Appointment_Bookings",
        displayName: "Get Patient Booking",
        onClick: () => {
          setShowSetAvailability(false);
          setShowProfile(false);
          setShowGetPatientBooking(true);
          setShowPrescription(false);
          setShowMedicalHistory(false);
        },
      },

      {
        id: "prescriptions",
        originalName: "Prescriptions",
        displayName: "Prescriptions",
        onClick: () => {
          setShowSetAvailability(false);
          setShowProfile(false);
          setShowGetPatientBooking(false);
          setShowPrescription(true);
          setShowMedicalHistory(false);
        },
      },

      {
        id: "records",
        originalName: "Medical Records",
        displayName: "Medical Records",
        onClick: () => {
          setShowSetAvailability(false);
          setShowProfile(false);
          setShowGetPatientBooking(false);
          setShowPrescription(false);
          setShowMedicalHistory(true);
        },
      },

      {
        id: "profile",
        originalName: "Profile",
        displayName: "Profile",
        onClick: () => {
          setShowSetAvailability(false);
          setShowProfile(true);
          setShowGetPatientBooking(false);
          setShowMedicalHistory(false);
        },
      },
    ];

    if (storedStaffType === "nurse") {
      // Nurse: Disabled the prescriptions ,records & getPatientBooking.
      const updatedLinks = initialLinks.map((link) =>
        link.id === "prescriptions" ||
        link.id === "records" ||
        link.id === "getPatientBooking"
          ? { ...link, disabled: true }
          : link
      );
      setSidebarLinks(updatedLinks);
    } else {
      setSidebarLinks(initialLinks);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div
      style={{ backgroundColor: "#F5F5F5", minHeight: "100vh", width: "100vw" }}
    >
      <TopNavbar onToggleSidebar={toggleSidebar} />
      <LeftNavbar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        links={sidebarLinks}
        staffType={staffType} //if incase the stafftype is nurse wiould disable the prescription & medical recods.
      />
      <Container fluid style={{ paddingTop: "76px" }}>
        <Row>
          <Col xs={12} md={{ span: 9, offset: 3 }} lg={{ span: 10, offset: 2 }}>
            {showSetAvailability && <SetDoctorAvailability />}
            {showProfile && <StaffProfile staffType={staffType} />}
            {showGetPatientBooking && <GetPatientBooking />}
            {showPrescription && <ProvidePrescription />}
            {showViewMedicalHistory && <ViewMedicalHistory />}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StaffDashboard;
