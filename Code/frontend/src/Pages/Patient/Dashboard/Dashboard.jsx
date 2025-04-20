import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TopNavbar from "../../../Components/TopNavBar";
import LeftNavbar from "../../../Components/LeftNavBar";
import AppointmentCard from "../../../Components/AppointmentCard";
import BookAppointmentButton from "../../../Components/BookAppointmentButton";
import BookingAppointment from "../../../Components/BookingAppointment";
import ViewPrescriptions from "../../../Components/ViewPrescriptions";
import Profile from "../../../Components/Profile";
import { BASE_URL } from "../../../config";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showAppointmentContent, setShowAppointmentContent] = useState(true);
  const [showProfile, setProfile] = useState(false);
  const [showPrescriptions, setShowPrescriptions] = useState(false);

  //headers for the table, appointments table
  const [appointmentData, setAppointmentData] = useState({
    headers: ["APP ID", "Doctor", "Date", "Time", "Status"],
    rows: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Call to get all the appointments till dates
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/my_appointments`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // makes the response in JSON format
      const data = await response.json();

      // Mapping the response to headers
      const formattedAppointments = data.map((appointment) => ({
        id: appointment.appointment_id,
        appointment_id: appointment.appointment_id,
        doctor: `${appointment.doctor_first_name} ${appointment.doctor_last_name}`,
        date: new Date(appointment.date).toLocaleDateString(),
        time: `${appointment.start_time} - ${appointment.end_time}`, // Makes the Use of time strings directly
        status: appointment.status,
      }));
      setAppointmentData({ ...appointmentData, rows: formattedAppointments });
    } catch (e) {
      setError(e.message);
      console.error("Failed to fetch appointments:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  //dummy data
  /* const [appointmentData, setAppointmentData] = useState({
      headers: ["APP ID", "Date", "Time", "Status"],
      rows: [
        { id: "001", data: ["001", "2022-10-10", "10:00 AM", "Scheduled"] },
        { id: "002", data: ["002", "2022-10-11", "11:30 AM", "Completed"] },
      ],
    });

    */

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleCancelAppointment = async (appointmentId) => {
    // API call for cancel appointment
    try {
      const response = await fetch(
        `${BASE_URL}/cancel_appointment/${appointmentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setAppointmentData((prevData) => ({
        ...prevData,
        rows: prevData.rows.filter(
          (row) => row.appointment_id !== appointmentId
        ),
      }));
      console.log(`Appointment ${appointmentId} canceled successfully`);
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  const handleBookAppointmentClick = () => {
    setShowBookingForm(true);
  };

  const handleBookingComplete = () => {
    fetchAppointments();
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
        setShowPrescriptions(false);
      },
    },
    {
      id: "prescriptions",
      originalName: "Prescriptions",
      displayName: "Prescriptions",
      onClick: () => {
        setShowAppointmentContent(false);
        setShowBookingForm(false);
        setProfile(false);
        setShowPrescriptions(true);
      },
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
        setShowPrescriptions(false);
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

                <BookingAppointment
                  show={showBookingForm}
                  onHide={() => setShowBookingForm(false)}
                  onBookingComplete={handleBookingComplete}
                />

                {appointmentData.rows.length > 0 ? (
                  <AppointmentCard
                    data={appointmentData}
                    onCancel={handleCancelAppointment}
                  />
                ) : (
                  <div className="text-center py-3">
                    No appointments scheduled yet.
                  </div>
                )}
              </>
            )}

            {showProfile && <Profile />}
            {showPrescriptions && <ViewPrescriptions />}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
