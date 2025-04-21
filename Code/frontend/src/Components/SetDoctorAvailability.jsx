import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SetAvailabilityModal from "../Components/SetAvailabilityModal";
import { format, addMonths } from "date-fns";
import { BASE_URL } from "../../src/config";
import { startOfMonth, endOfMonth } from "date-fns";

const SetStaffAvailability = () => {
  const [dates, setDates] = useState([new Date()]);
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [staffType, setStaffType] = useState("");
  const [staffId, setStaffId] = useState(null);

  useEffect(() => {
    const storedStaffType = localStorage.getItem("staffType");
    const storedDoctorId = localStorage.getItem("doctor_id");
    const storedNurseId = localStorage.getItem("nurse_id");

    if (storedStaffType) {
      setStaffType(storedStaffType);
      if (storedStaffType.toLowerCase() === "doctor" && storedDoctorId) {
        setStaffId(storedDoctorId);
      } else if (storedStaffType.toLowerCase() === "nurse" && storedNurseId) {
        setStaffId(storedNurseId);
      } else {
        setError("Staff ID not found. Please log in again.");
      }
    } else {
      setError("Staff type not found. Please log in again.");
    }
  }, []);

  const today = new Date();
  const minDate = startOfMonth(addMonths(today, 2)); // First day of two months ahead
  const maxDate = endOfMonth(addMonths(today, 3));

  const timeSlots = []; //Initialzied an Empty Array of TimeSlot
  for (
    let hour = 9;
    hour < 17;
    hour++ //starts to loop from 9 am to 5pm
  ) {
    if (hour >= 13 && hour < 14) continue; //skips the hours considered as a lunch break
    for (
      let minute = 0;
      minute < 60;
      minute += 30 //loops after every 30 minutes
    ) {
      //padstart makes sure that atleast there are 2 characters. Formates hours & minutes to two digit.
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      const endTimeMinute = minute + 30;

      // calculates the ending minute and hour.
      const endTimeHour = hour + (endTimeMinute === 60 ? 1 : 0);
      const formattedEndTimeMinute = (endTimeMinute % 60)
        .toString()
        .padStart(2, "0");
      const formattedEndTimeHour = endTimeHour.toString().padStart(2, "0");

      //The formattted time slot start hour and minute - end hour and minute
      //This create the time slot eg. 09:00- 09:30
      timeSlots.push(
        `${formattedHour}:${formattedMinute} - ${formattedEndTimeHour}:${formattedEndTimeMinute}`
      );
    }
  }

  //the function takes the date as object and makes the use of  get day and returns the correspondig dayofweek.
  const getDayName = (date) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[date.getDay()];
  };

  //Bookings is within the range of 2 months ahead
  const isWithinBookingRange = (selectedDate) => {
    const today = new Date();
    const twoMonthsAhead = addMonths(today, 2);
    twoMonthsAhead.setHours(23, 59, 59, 999);
    selectedDate.setHours(0, 0, 0, 0); //indicates hour, minute,second, millisecond
    return selectedDate >= today && selectedDate <= twoMonthsAhead;
  };

  const isNotOneDayBefore = (selectedDate) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate >= tomorrow;
  };

  //Availability can only be cancelled two weeks or more in advance.
  const isCancelable = (itemDate) => {
    const today = new Date();
    const twoWeeksAhead = new Date(today);
    twoWeeksAhead.setDate(today.getDate() + 14);
    twoWeeksAhead.setHours(0, 0, 0, 0);
    const itemDateObj = new Date(itemDate);
    itemDateObj.setHours(0, 0, 0, 0);
    return itemDateObj > twoWeeksAhead;
  };

  //Slot Selection
  const handleSlotSelection = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot)); //if a selected slot exist in the array it dosent include it.
    } else {
      setSelectedSlots([...selectedSlots, slot]); //use of spread opeartor is been done inorder to inlclude existing slot plus new one
    }
  };

  const handleAddAvailability = async () => {
    if (!staffId) {
      setError("Staff ID is not available.");
      return;
    }

    if (!staffType) {
      setError("Staff type is not available.");
      return;
    }

    if (selectedSlots.length === 0) {
      setError("Please select at least one time slot to add availability.");
      return;
    }

    const datesArray = Array.isArray(dates) ? dates : [dates]; //checks whether date is an array if not it wraps into an array.
    //Filters through the dates.array and keep only the date that are not within booking range
    const invalidRangeDates = datesArray.filter(
      (date) => !isWithinBookingRange(date)
    );

    //Checks for invalid dates Staff can only set their availability for 2 months in advance
    if (invalidRangeDates.length > 0) {
      setError("Availability can only be set for up to two months in advance.");
      return;
    }

    const invalidOneDayBeforeDates = datesArray.filter(
      (date) => !isNotOneDayBefore(date)
    );

    if (invalidOneDayBeforeDates.length > 0) {
      setError("Availability cannot be set for the next day or earlier.");
      return;
    }

    setError("");
    setShowConfirmation(true);
  };

  const confirmAddAvailability = async () => {
    const storedStaffType = localStorage.getItem("staffType");
    const storedDoctorId = localStorage.getItem("doctor_id");
    const storedNurseId = localStorage.getItem("nurse_id");

    if (!storedStaffType) {
      setError("Staff type not found. Please log in again.");
      setShowConfirmation(false);
      return;
    }

    //ensures the dates are in array
    const slotsToAdd = selectedSlots;
    const datesArray = Array.isArray(dates) ? dates : [dates];
    const slotIdsToAdd = slotsToAdd.map((slot) => timeSlots.indexOf(slot) + 1);

    for (const dateObj of datesArray) {
      const formattedDate = format(dateObj, "yyyy-MM-dd");
      let endpoint = null;
      let payload = {
        date: formattedDate,
        slot_ids: slotIdsToAdd,
      };

      if (storedStaffType.toLowerCase() === "doctor") {
        if (!storedDoctorId) {
          setError("Doctor ID not found. Please log in again.");
          setShowConfirmation(false);
          return;
        }

        //API endpoint to Set the staff availability.
        endpoint = `${BASE_URL}/set_doctor_availability`;
        payload.doctor_id = storedDoctorId;
      } else if (storedStaffType.toLowerCase() === "nurse") {
        if (!storedNurseId) {
          setError("Nurse ID not found. Please log in again.");
          setShowConfirmation(false);
          return;
        }
        endpoint = `${BASE_URL}/set_nurse_availability`;
        payload.nurse_id = storedNurseId;
      }

      if (!endpoint) {
        setError("Invalid staff type for setting availability.");
        setShowConfirmation(false);
        return;
      }

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setAvailability((prevAvailability) => [
            ...prevAvailability,
            ...slotsToAdd.map((slot) => ({
              date: formattedDate,
              day: getDayName(dateObj),
              timeSlot: slot,
            })),
          ]);
          setError("");
        } else if (response.status === 400) {
          setError(
            data.message || `Failed to set availability for ${formattedDate}.`
          );
        } else {
          setError(
            `Failed to set availability for ${formattedDate}. Server error.`
          );
        }
      } catch (error) {
        console.error("Error setting availability:", error);
        setError("Network error. Please try again.");
      }
    }

    setSelectedSlots([]);
    setShowConfirmation(false);
  };

  //Remove the availability of the Staff
  const handleRemoveAvailability = async (index) => {
    if (!staffId || !staffType) {
      setError("Staff ID or type not available.");
      return;
    }

    const itemToRemove = availability[index];
    // API call to delete the availability set by Doctor/Nurse
    const formattedDate = itemToRemove.date;
    const slotIndex = timeSlots.indexOf(itemToRemove.timeSlot);
    const slotIdToRemove = slotIndex + 1;

    // API call to delete the availability set by Doctor/Nurse
    const endpoint =
      staffType.toLowerCase() === "doctor"
        ? `${BASE_URL}/cancel_doctor_availability/${staffId}/${formattedDate}/${slotIdToRemove}`
        : staffType.toLowerCase() === "nurse"
        ? `${BASE_URL}/cancel_nurse_availability/${staffId}/${formattedDate}/${slotIdToRemove}`
        : null;

    if (!endpoint) {
      setError("Invalid staff type for cancelling availability.");
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setAvailability(availability.filter((_, i) => i !== index));
      } else {
        const data = await response.json();
        setError(data.message || "Failed to cancel availability.");
      }
    } catch (error) {
      console.error("Error cancelling availability:", error);
      setError("Network error during cancellation.");
    }
  };

  // Handles the changes to the selected date
  const handleDateChange = (dateOrDates) => {
    const selectedDates = Array.isArray(dateOrDates)
      ? dateOrDates
      : [dateOrDates];
    setDates(selectedDates);
    if (selectAll) {
      setSelectedSlots([]);
    }
  };

  // "Select All" checkbox toggle
  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked); // if the checkbox is selected. it'll seletct all the time slots.
    if (checked) {
      setSelectedSlots([...timeSlots]);
    } else {
      setSelectedSlots([]);
    }
  };

  return (
    <Row className="justify-content-md-center mt-5">
      <Col xs={12} md={8} lg={8}>
        <Card>
          <Card.Header style={{ textAlign: "center" }}>
            Set {staffType === "nurse" ? "Nurse" : "Doctor"} Availability
          </Card.Header>
          <Card.Body style={{ maxHeight: "600px", overflowY: "auto" }}>
            <Form>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Label style={{ fontWeight: "bold" }}>Dates</Form.Label>
                  {/* <DatePicker
                    selected={dates}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    filterDate={(date) =>
                      isWithinBookingRange(date) && isNotOneDayBefore(date)
                    }
                    minDate={minDate}
                    maxDate={maxDate}
                    className="form-control"
                    isMulti
                  /> */}
                  <DatePicker
                    selected={dates}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    filterDate={(date) =>
                      isWithinBookingRange(date) && isNotOneDayBefore(date)
                    }
                    minDate={minDate}
                    maxDate={maxDate}
                    className="form-control"
                    isMulti
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Label style={{ fontWeight: "bold" }}>
                    Time Slots
                  </Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="Select All"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                  <div className="d-flex flex-wrap">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={
                          selectedSlots.includes(slot)
                            ? "primary"
                            : "outline-primary"
                        }
                        className="me-2 mb-2"
                        onClick={() => handleSlotSelection(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </Col>
              </Row>
              <Button
                variant="primary"
                onClick={handleAddAvailability}
                disabled={!staffId || !staffType}
              >
                Add Availability
              </Button>
              {error && (
                <p className="text-danger mt-2">
                  <strong>{error}</strong>
                </p>
              )}
            </Form>

            <h4 className="mt-4">Availability</h4>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th style={{ width: "15%" }}>Date</th>
                  <th style={{ width: "10%" }}>Day</th>
                  <th style={{ width: "45%" }}>Time Slot</th>
                  <th style={{ width: "30%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {availability.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.day}</td>
                    <td>{item.timeSlot}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveAvailability(index)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <SetAvailabilityModal
              showConfirmation={showConfirmation}
              setShowConfirmation={setShowConfirmation}
              confirmAddAvailability={confirmAddAvailability}
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SetStaffAvailability;
