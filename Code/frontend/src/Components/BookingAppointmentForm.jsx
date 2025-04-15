import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "react-calendar/dist/Calendar.css";

// Reference  Links
// https://react-bootstrap.netlify.app/docs/forms/form-control/
// https://react-bootstrap.netlify.app/docs/forms/form-text
// https://react-bootstrap.netlify.app/docs/forms/select

const BookingAppointmentForm = ({
  onSubmit,
  selectedProblem,
  setSelectedProblem,
  problemOptions = [],
  problems,
  navigateToInfoPage,
}) => {
  const selected =
    Array.isArray(problemOptions) &&
    problemOptions.find(
      (problem) => problem.disease_id.toString() === selectedProblem
    );
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Type of Problem Faced</Form.Label>
        <Form.Select
          value={selectedProblem}
          onChange={(e) => setSelectedProblem(e.target.value)}
          required
        >
          <option value="">Select a problem</option>
          {problemOptions.map((problem) => (
            <option key={problem.disease_id} value={problem.disease_id}>
              {problem.disease_name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Articles to display */}
      {selected && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            Precaution taken at early stage{" "}
            <strong>{selected.disease_name}</strong>:{" "}
            <Button
              variant="link"
              onClick={() => navigateToInfoPage(selected.path)}
            >
              Click here
            </Button>
          </p>
        </div>
      )}
      <Button variant="primary" type="submit">
        Next
      </Button>
    </Form>
  );
};

export default BookingAppointmentForm;
