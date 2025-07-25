import React, { useState } from "react";
import CancelAppointmentButton from "./CancelAppointmentButton";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { getCookie } from "../utils";
import { BASE_URL } from "../config";

const GetPatientBooking = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(null);
  const [cancelError, setCancelError] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setLoading(true);
    setError(null); // Reset the previous errors

    // The date format 'yyyy-mm-dd' inorder to match the backend API.
    const formattedDate = date.toLocaleDateString("en-CA");

    // API call to get patient booking for specific date
    const csrfToken = getCookie("csrf_access_token");
    fetch(`${BASE_URL}/get_patient_bookings/${formattedDate}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        return response.json();
      })
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Handles the cancel appointment
  const handleCancelAppointment = (appointmentId) => {
    setCancelLoading(appointmentId);
    setCancelError(null);

    //API endpoint to cancel the appointmen t
    const csrfToken = getCookie("csrf_access_token");
    fetch(`${BASE_URL}/cancel_doctor_appointment/${appointmentId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to cancel appointment");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);

        // Upon cancellation, updates the appointments list
        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment.appointment_id !== appointmentId
          )
        );
        setCancelLoading(null);
      })
      .catch((err) => {
        console.error("Error cancelling appointment:", err);
        setCancelError(err.message);
        setCancelLoading(null);
      });
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <div className="input-group date-picker-wrapper">
          {/* Inorder to select a particluar date date picker is been used*/}
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="form-control rounded-pill py-2"
            placeholderText="Select a Date"
            customInput={
              <button className="btn btn-light d-flex align-items-center px-3 py-2 rounded-pill">
                <FaCalendarAlt className="me-2" />
                Select Date
              </button>
            }
          />
        </div>
      </div>

      {/* Appointment is been dispalyed once the date is selected */}
      {selectedDate && (
        <div className="card shadow-lg rounded-3">
          <div className="card-header bg-light text-dark text-center">
            <h4 className="mb-0">
              Doctor's Appointments for {selectedDate.toLocaleDateString()}
            </h4>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-4 text-muted">
                Loading appointments...
              </div>
            ) : error ? (
              <div className="alert alert-danger text-center mb-0">{error}</div>
            ) : appointments.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>Appointment ID</th>
                      <th>Patient Name</th>
                      <th>Disease Type</th>
                      <th>Disease Description</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.appointment_id}>
                        <td>{appointment.appointment_id}</td>
                        <td>
                          {appointment.patient_firstname}{" "}
                          {appointment.patient_lastname}
                        </td>
                        <td>{appointment.disease_name}</td>
                        <td>{appointment.disease_description}</td>
                        <td>{appointment.start_time}</td>
                        <td>{appointment.end_time}</td>
                        {/* Cancel appointment button imported from the component */}
                        <td>
                          <CancelAppointmentButton
                            onCancel={handleCancelAppointment}
                            rowId={appointment.appointment_id}
                            loading={
                              cancelLoading === appointment.appointment_id
                            }
                            error={cancelError}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info text-center mb-0">
                No appointments found for this date.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GetPatientBooking;
