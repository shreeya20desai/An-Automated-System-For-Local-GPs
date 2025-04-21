// import React, { useState } from "react";
// import { Form, Button } from "react-bootstrap";
// import Cough from "./Cough";
// import Fever from "./Fever";
// import AbdominalPain from "./Abdominalpain";
// import "react-calendar/dist/Calendar.css";

// // Reference  Links
// // https://react-bootstrap.netlify.app/docs/forms/form-control/
// // https://react-bootstrap.netlify.app/docs/forms/form-text
// // https://react-bootstrap.netlify.app/docs/forms/select

// const BookingAppointmentForm = ({
//   onSubmit,
//   selectedProblem,
//   setSelectedProblem,
//   problemOptions = [],
//   problems,
//   navigateToInfoPage,
//   diseaseDescription,
//   setDiseaseDescription,
// }) => {
//   const selected =
//     Array.isArray(problemOptions) &&
//     problemOptions.find(
//       (problem) => problem.disease_id.toString() === selectedProblem
//     );
//   return (
//     <Form onSubmit={onSubmit}>
//       <Form.Group controlId="diseaseDescription">
//         <Form.Label>Description </Form.Label>
//         <Form.Control
//           as="textarea"
//           rows={3}
//           placeholder="Describe your symptoms"
//           value={diseaseDescription}
//           onChange={(e) => {
//             //Splits the string into an array using the spaces for eg. I am looking.("I", "", "am", "", "looking")
//             const words = e.target.value.split(" ");
//             if (words.length <= 200) {
//               setDiseaseDescription(e.target.value);
//             }
//           }}
//         />
//         <Form.Text className="text-muted">
//           {(diseaseDescription || "").split(" ").filter(Boolean).length}/200
//           words
//         </Form.Text>
//       </Form.Group>
//       <Form.Group className="mb-3">
//         <Form.Label>Type of Problem Faced</Form.Label>
//         <Form.Select
//           value={selectedProblem}
//           onChange={(e) => setSelectedProblem(e.target.value)}
//           required
//         >
//           <option value="">Select a problem</option>
//           {problemOptions.map((problem) => (
//             <option key={problem.disease_id} value={problem.disease_id}>
//               {problem.disease_name}
//             </option>
//           ))}
//         </Form.Select>
//       </Form.Group>
//       {/* "1" is the disease_id for fever */}
//       selectedProblem === "1" && <Fever />
//       {/* "2" is the disease_id for cough */}
//       {selectedProblem === "2" && <Cough />}
//       {/*  "3" is the disease_id for abdominal pain */}
//       {selectedProblem === "3" && <AbdominalPain />}
//       {/* Articles to display */}
//       {selected && (
//         <div style={{ marginTop: "1rem" }}>
//           <p>
//             Precaution taken at early stage{" "}
//             <strong>{selected.disease_name}</strong>:{" "}
//             <Button
//               variant="link"
//               onClick={() => navigateToInfoPage(selected.path)}
//             >
//               Click here
//             </Button>
//           </p>
//         </div>
//       )}
//       <Button variant="primary" type="submit">
//         Next
//       </Button>
//     </Form>
//   );
// };

// export default BookingAppointmentForm;

import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Cough from "./Cough";
import Fever from "./Fever";
import AbdominalPain from "./Abdominalpain";
import "react-calendar/dist/Calendar.css";

// Reference Links
// https://react-bootstrap.netlify.app/docs/forms/form-control/
// https://react-bootstrap.netlify.app/docs/forms/form-text
// https://react-bootstrap.netlify.app/docs/forms/select

const BookingAppointmentForm = ({
  onSubmit,
  selectedProblem,
  setSelectedProblem,
  problemOptions = [],
  diseaseDescription,
  setDiseaseDescription,
  setPatientId,
}) => {
  const selected =
    Array.isArray(problemOptions) &&
    problemOptions.find(
      (problem) => problem.disease_id.toString() === selectedProblem
    );

  const [staffType, setStaffType] = useState(null);
  const [localPatientId, setLocalPatientId] = useState("");

  // get the staff type from the local storage
  useEffect(() => {
    const storedStaffType = localStorage.getItem("staffType");
    if (storedStaffType) {
      setStaffType(storedStaffType);
    }
  }, []);

  const handlePatientIdChange = (e) => {
    setLocalPatientId(e.target.value);
  };

  const handleSubmit = (e) => {
    if (staffType === "admin" && localPatientId) {
      localStorage.setItem("patient_id", localPatientId);
    }
    onSubmit(e);
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="diseaseDescription">
        <Form.Label>Description </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Describe your symptoms"
          value={diseaseDescription}
          onChange={(e) => {
            //Splits the string into an array using the spaces for eg. I am looking.("I", "", "am", "", "looking")
            const words = e.target.value.split(" ");
            if (words.length <= 200) {
              setDiseaseDescription(e.target.value);
            }
          }}
        />
        <Form.Text className="text-muted">
          {(diseaseDescription || "").split(" ").filter(Boolean).length}/200
          words
        </Form.Text>
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

      {staffType === "admin" && (
        <Form.Group className="mb-3" controlId="patientId">
          <Form.Label>Patient ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter patient ID"
            onChange={handlePatientIdChange}
          />
        </Form.Group>
      )}

      {/* the article would be displayed according to the disease type */}
      {selectedProblem && selectedProblem === "1" && <Fever />}
      {selectedProblem && selectedProblem === "2" && <Cough />}
      {selectedProblem && selectedProblem === "3" && <AbdominalPain />}

      {/* Articles to display only if a disease is selected
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
      )} */}

      <Button variant="primary" type="submit">
        Next
      </Button>
    </Form>
  );
};

export default BookingAppointmentForm;
