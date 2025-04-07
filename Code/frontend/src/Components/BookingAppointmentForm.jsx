import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "react-calendar/dist/Calendar.css";

// Reference  Links
// https://react-bootstrap.netlify.app/docs/forms/form-control/
// https://react-bootstrap.netlify.app/docs/forms/form-text
// https://react-bootstrap.netlify.app/docs/forms/select

const BookingAppintmentForm = ({
  onSubmit,
  name,
  email,
  contactNumber,
  setContactNumber,
  selectedProblem,
  setSelectedProblem,
  problemOptions,
}) => {
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your name"
          value={name}
          readOnly
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your email"
          value={email}
          readOnly
          required
        />
      </Form.Group>

      {/* might change in future */}
      <Form.Group className="mb-3">
        <Form.Label>Contact Number</Form.Label>
        <Form.Control
          type="tel"
          placeholder="Enter your contact number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          required
        />
      </Form.Group>

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

      <Button variant="primary" type="submit">
        Next
      </Button>
    </Form>
  );
};

export default BookingAppintmentForm;
