import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; //npm install react-datepicker@latest
import SetDoctorAvailabilityModal from "../Components/SetDoctorAvailabilityModal";

const SetDoctorAvailability = () => {
  const [dates, setDates] = useState([new Date()]);
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const timeSlots = []; //FInitialzied an Empty Array of TimeSlot
  for (
    let hour = 9;
    hour < 17;
    hour++ //starts to loop from 9 am to 4pm
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
    const twoMonthsAhead = new Date(today);
    twoMonthsAhead.setMonth(today.getMonth() + 2);
    twoMonthsAhead.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0); // (0, 0, 0, 0) indicates hour, minute,second, millisecond
    return selectedDate >= today && selectedDate <= twoMonthsAhead;
  };

  //Availability can only be cancelled two weeks or more in advance.
  const isCancelable = (itemDate) => {
    const today = new Date();
    const twoWeeksAhead = new Date(today);
    twoWeeksAhead.setDate(today.getDate() + 14);
    twoWeeksAhead.setHours(0, 0, 0, 0); //
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

  //Add availability
  const handleAddAvailability = () => {
    const datesArray = Array.isArray(dates) ? dates : [dates]; //checks whether date is an array if not it wraps into an array.
    //Filters through the dates.array and keep only the date taht are not qithin booking range
    const invalidDates = datesArray.filter(
      (date) => !isWithinBookingRange(date)
    );
    //Checks for invalid dates Staff can only set their availability for 2 months in advance
    if (invalidDates.length > 0) {
      setError("Availability can only be set for up to two months in advance.");
      return;
    }
    setError("");
    setShowConfirmation(true);
  };

  const confirmAddAvailability = () => {
    //ensures the dates are in array
    const slotsToAdd = selectedSlots;
    const datesArray = Array.isArray(dates) ? dates : [dates];
    let newAvailability = [];
    //each date, map through the slots selectes inorder to create availability and then concats to newAvailability
    datesArray.forEach((date) => {
      newAvailability = newAvailability.concat(
        slotsToAdd.map((slot) => ({
          date: date.toISOString().split("T")[0],
          day: getDayName(date),
          timeSlot: slot,
        }))
      );
    });

    setAvailability([...availability, ...newAvailability]);
    setSelectedSlots([]);
    setShowConfirmation(false);
  };

  //Remove Availability
  const handleRemoveAvailability = (index) => {
    //from the availability retrieves the date at a given index
    const itemDate = availability[index].date;
    if (!isCancelable(itemDate)) {
      setError(
        "Availability can only be cancelled two weeks or more in advance. Kindly Contact the Admin"
      );
      return;
    }
    setError("");
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleDateChange = (dateOrDates) => {
    setDates(Array.isArray(dateOrDates) ? dateOrDates : [dateOrDates]);
  };

  return (
    <Row className="justify-content-md-center mt-5">
      <Col xs={12} md={8} lg={8}>
        <Card>
          <Card.Header style={{ textAlign: "center" }}>
            Set Doctor Availability
          </Card.Header>
          <Card.Body>
            <Form>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Label style={{ fontWeight: "bold" }}>Dates</Form.Label>
                  <DatePicker
                    selected={dates}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    filterDate={(date) => isWithinBookingRange(date)}
                    minDate={new Date()}
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
              <Button variant="primary" onClick={handleAddAvailability}>
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
                  <th>Date</th>
                  <th>Day</th>
                  <th>Time Slot</th>
                  <th>Actions</th>
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

            <SetDoctorAvailabilityModal
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

export default SetDoctorAvailability;
