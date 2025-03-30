import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import BookingAppointmentForm from "../Components/BookingAppointmentForm";

const BookingAppointmentModal = ({ show, onHide, onBookingComplete }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [diseaseBrief, setDiseaseBrief] = useState("");
  const [selectedProblem, setSelectedProblem] = useState("");

  const doctors = [
    //Dummy values are been inserted.
    {
      id: 1,
      name: "Dr. Smith",
      specialization: "Cardiology",
      availability: ["10:00 AM", "11:00 AM"],
    },
    {
      id: 2,
      name: "Dr. Jones",
      specialization: "Dermatology",
      availability: ["11:30 AM", "1:00 PM"],
    },
    {
      id: 3,
      name: "Dr. Lee",
      specialization: "Pediatrics",
      availability: ["9:00 AM", "10:30 AM"],
    },
  ];

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setShowCalendar(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const available = doctors.filter(
      (doctor) => doctor.availability.length > 0
    );
    setAvailableDoctors(available);
    setShowDoctors(true);
  };

  const handleBookDoctor = (doctorId) => {
    console.log(
      `Booking doctor with ID: ${doctorId} on ${selectedDate} with name: ${name}, email: ${email}, contact: ${contactNumber}, disease: ${diseaseBrief}, problem: ${selectedProblem}`
    );
    onBookingComplete();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title style={{ textAlign: "center" }}>
          Booking Appointment Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!showCalendar && !showDoctors && (
          //imported component BookingAppointmentForm
          <BookingAppointmentForm
            onSubmit={handleFormSubmit}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            contactNumber={contactNumber}
            setContactNumber={setContactNumber}
            diseaseBrief={diseaseBrief}
            setDiseaseBrief={setDiseaseBrief}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedProblem={selectedProblem}
            setSelectedProblem={setSelectedProblem}
          />
        )}

        {showCalendar && (
          <Calendar onChange={handleDateChange} value={selectedDate} />
        )}

        {showDoctors && (
          <div>
            <h3>
              Available Doctors on {selectedDate && selectedDate.toDateString()}
            </h3>
            <ul className="list-group">
              {availableDoctors.map((doctor) => (
                <li
                  key={doctor.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    {doctor.name} ({doctor.specialization})
                    <br />
                    Availability: {doctor.availability.join(", ")}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleBookDoctor(doctor.id)}
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
