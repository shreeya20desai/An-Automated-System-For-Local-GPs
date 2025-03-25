import React from "react";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

const BookAppointmentButton = ({ onClick }) => {
  return (
    <Button variant="success" onClick={onClick}>
      Book Appointment
    </Button>
  );
};

export default BookAppointmentButton;
