import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import BookingAppointmentForm from "./BookingAppointmentForm";

const BookingAppointmentModal = ({ show, onHide, onBookingComplete }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [selectedProblem, setSelectedProblem] = useState("");
  const [problems, setProblems] = useState([
    { disease_id: 1, disease_name: "Fever" },
    { disease_id: 2, disease_name: "Cough" },
    { disease_id: 3, disease_name: "Cold" },
    { disease_id: 4, disease_name: "Abdominal Pain" },
  ]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  //dummy vales
  useEffect(() => {
    setName("John Doe");
    setEmail("john.doe@example.com");
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setShowCalendar(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    //dummy vales
    const doctors = [
      {
        doctor_id: 101,
        doctor_name: "Dr. Smith",
        specialization: "Cardiology",
      },
      {
        doctor_id: 102,
        doctor_name: "Dr. Jones",
        specialization: "Dermatology",
      },
    ];

    setAvailableDoctors(doctors);
    setShowDoctors(true);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    //dummy time slots
    const timeSlots = [
      { availability_id: 201, time_slot: "10:00 AM" },
      { availability_id: 202, time_slot: "11:00 AM" },
      { availability_id: 203, time_slot: "01:00 PM" },
    ];
    setAvailableTimeSlots(timeSlots);
    setShowTimeSlots(true);
  };

  //handle booking the selecetd doctor
  const handleBookDoctor = () => {
    console.log(
      `Booking doctor ${selectedDoctor.doctor_name} on ${selectedDate} at ${selectedTime}`
    );
    onBookingComplete();
  };

  return (
    <Modal show={show} onHide={onHide}>
      {/* CloseButton  */}
      <Modal.Header closeButton>
        <Modal.Title style={{ textAlign: "center" }}>
          Booking Appointment Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!showCalendar && !showDoctors && !showTimeSlots && (
          //imported component BookingAppointmentForm
          <BookingAppointmentForm
            onSubmit={handleFormSubmit}
            name={name}
            email={email}
            contactNumber={contactNumber}
            setContactNumber={setContactNumber}
            selectedProblem={selectedProblem}
            setSelectedProblem={setSelectedProblem}
            problemOptions={problems}
          />
        )}

        {showCalendar && (
          <Calendar onChange={handleDateChange} value={selectedDate} />
        )}

        {/* On the date selected , display a list of doctors avaiable */}
        {showDoctors && (
          <div>
            <h3>
              Available Doctors on {selectedDate && selectedDate.toDateString()}
            </h3>
            <ul className="list-group">
              {availableDoctors.map((doctor) => (
                <li
                  key={doctor.doctor_id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    {doctor.doctor_name} ({doctor.specialization})
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    Select
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display the doctors availability(time slots), which helps the user to book the appointment */}
        {showTimeSlots && (
          <div>
            <h3>Available Time slots</h3>
            <ul className="list-group">
              {availableTimeSlots.map((timeSlot) => (
                <li
                  key={timeSlot.availability_id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>{timeSlot.time_slot}</div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedTime(timeSlot.time_slot);
                      handleBookDoctor();
                    }}
                  >
                    Book
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BookingAppointmentModal;
