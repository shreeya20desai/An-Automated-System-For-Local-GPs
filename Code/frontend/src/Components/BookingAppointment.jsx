import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import BookingAppointmentForm from "./BookingAppointmentForm";
import { getCookie } from "../utils";
import { BASE_URL } from "../config";

const BookingAppointment = ({ show, onHide, onBookingComplete }) => {
  const navigate = useNavigate();

  //  Step 1: Displays the form to select the type of diseases.
  //  Step 2: Displays the calendar for the patients.
  //  Step 3: Displays the doctors available at that day.
  //  Step 4: Displays the time slots available for that specific doctor.
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [problems, setProblems] = useState([]);
  const [diseaseDescription, setDiseaseDescription] = useState("");
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const csrfToken = getCookie("csrf_access_token");
    // API call to get the all the diseases.
    fetch(`${BASE_URL}/get_diseases`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken,
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        const mapped = data.map((item) => ({
          disease_id: item.Disease_ID,
          disease_name: item.Disease_Name,
          path: item.Path,
        }));
        setProblems(mapped);
      })
      .catch((error) => {
        console.error("Error fetching diseases:", error);
      });
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setStep(2); //Step 2: Displays the calendar
  };

  //The date is been formatted(YYYY-MM-DD)
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // API call to get the list of doctors available for specific diseases.
    if (selectedProblem) {
      const csrfToken = getCookie("csrf_access_token");
      fetch(`${BASE_URL}/get_doctors_list`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({
          health_issue: selectedProblem,
          on_date: formatDate(date), // Format: YYYY-MM-DD
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setAvailableDoctors(data);
          setStep(3); //Proceed Step 3: Doctor List.
        })
        .catch((error) => {
          console.error("Error fetching doctors:", error);
        });
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    //API call to get the Specific doctor availability.
    const csrfToken = getCookie("csrf_access_token");
    fetch(
      `${BASE_URL}/get_doctor_availability/${doctor.id}/${formatDate(
        selectedDate
      )}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setAvailableTimeSlots(data);
        setStep(4); // Proceed Step 4: Time Slot
      })
      .catch((error) => {
        console.error("Error fetching time slots:", error);
      });
  };

  const handleBookDoctor = (timeSlot) => {
    let patientId = localStorage.getItem("patient_id"); // Makes sures that the patient ID is stored in localStorage

    if (!patientId) {
      console.error("Patient ID not found in localStorage");
      return;
    }

    // Used to Find the selected doctor from the List of Available Doctors.
    const doctor = availableDoctors.find(
      (doctor) => doctor.id === selectedDoctor.id
    );

    if (!doctor) {
      console.error("Selected doctor not found");
      return;
    }

    // Creates the patient info required for book appointment using the patient ID.
    const patientInfo = {
      id: patientId,
      selectedProblem,
    };

    // API call to book the appointment for the patient.
    const csrfToken = getCookie("csrf_access_token");
    fetch(`${BASE_URL}/book_appointment`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken,
      },
      body: JSON.stringify({
        doctor_id: doctor.id,
        patient_id: patientInfo.id || patientId,
        date: formatDate(selectedDate),
        slot_id: timeSlot.id,
        disease_type: selectedProblem,
        disease_description: diseaseDescription,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        onBookingComplete();
        setStep(1); // Reset to step 1
        onHide(); // Close the book appointment form once completed.
      })
      .catch((error) => {
        console.error("Error booking appointment:", error);
      });
  };

  //navigates to display the articles.
  const navigateToInfoPage = (path) => {
    onHide();
    setTimeout(() => navigate(path), 0);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title style={{ textAlign: "center" }}>
          Booking Appointment Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === 1 && (
          //imported component BookingAppointmentForm
          <BookingAppointmentForm
            onSubmit={handleFormSubmit}
            selectedProblem={selectedProblem}
            setSelectedProblem={setSelectedProblem}
            problemOptions={problems}
            diseaseDescription={diseaseDescription}
            setDiseaseDescription={setDiseaseDescription}
            navigateToInfoPage={navigateToInfoPage}
            setPatientId={setPatientId}
          />
        )}

        {step === 2 && (
          <>
            <Calendar onChange={handleDateChange} value={selectedDate} />
            <Button
              variant="secondary"
              onClick={() => setStep(1)}
              style={{ marginTop: "10px" }}
            >
              Back
            </Button>
          </>
        )}

        {/* On the date selected , display a list of doctors avaiable */}
        {step === 3 && (
          <>
            <h3>Available Doctors on {selectedDate.toDateString()}</h3>
            <ul className="list-group">
              {availableDoctors.length > 0 ? (
                availableDoctors.map((doctor) => (
                  <li
                    key={doctor.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {doctor.firstname} {doctor.lastname}
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      Select
                    </Button>
                  </li>
                ))
              ) : (
                <li className="list-group-item">
                  No doctors available for this date
                </li>
              )}
            </ul>
            <Button
              variant="secondary"
              onClick={() => setStep(2)}
              style={{ marginTop: "10px" }}
            >
              Back
            </Button>
          </>
        )}

        {/* Display the doctors availability(time slots), which helps the user to book the appointment */}
        {step === 4 && (
          <>
            <h3>Available Time slots</h3>
            <ul className="list-group">
              {availableTimeSlots.map((timeSlot) => (
                <li
                  key={timeSlot.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    {timeSlot.start} - {timeSlot.end}
                  </div>
                  <Button size="sm" onClick={() => handleBookDoctor(timeSlot)}>
                    Book
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              variant="secondary"
              onClick={() => setStep(3)}
              style={{ marginTop: "10px" }}
            >
              Back
            </Button>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BookingAppointment;
