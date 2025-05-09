import React, { useState, useEffect } from "react";
import { Form, Button, ListGroup, Alert, Table } from "react-bootstrap";
import { getCookie } from "../utils";
import { BASE_URL } from "../config";

const UploadMedicalHistory = () => {
  // get patient_id from local storage
  const patient_id = localStorage.getItem("patient_id");

  const [currentCategory, setCurrentCategory] = useState("");
  const [allSelectedFiles, setAllSelectedFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [patientFiles, setPatientFiles] = useState([]);

  // handle selecting files
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file) => ({
      category: currentCategory,
      file: file,
    }));

    setAllSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  // remove a selected file
  const handleRemoveFile = (index) => {
    setAllSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // upload all files together
  const handleFinalUpload = async () => {
    if (!patient_id) {
      setUploadError("Patient ID is not available.");
      return;
    }

    const formData = new FormData();
    allSelectedFiles.forEach((item) => {
      formData.append("files", item.file);
      formData.append("categories", item.category);
      formData.append("record_type", item.category);
    });

    // API endpoint to upload the docs
    try {
      const csrfToken = getCookie("csrf_access_token");

      const response = await fetch(`${BASE_URL}/upload/${patient_id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadSuccess(data.message);
        setUploadError(null);
        setAllSelectedFiles([]);
      } else {
        const errorData = await response.json();
        setUploadError(errorData.message || "Upload failed.");
        setUploadSuccess(null);
      }
    } catch (error) {
      setUploadError(error.message);
      setUploadSuccess(null);
    }
  };

  const fetchPatientFiles = async () => {
    if (!patient_id) return;

    try {
      // API endpoint to get the files
      const csrfToken = getCookie("csrf_access_token");

      const response = await fetch(
        `${BASE_URL}/patient/files?patient_id=${patient_id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPatientFiles(data.patient_files || []);
      } else {
        setPatientFiles([]);
        setUploadError("Failed to fetch patient files.");
      }
    } catch (error) {
      setUploadError(error.message);
    }
  };

  useEffect(() => {
    fetchPatientFiles();
  }, []);

  return (
    <div>
      <h4 className="mb-3">Upload Medical History</h4>

      <Form.Group className="mb-3">
        <Form.Label>Select Category:</Form.Label>
        <Form.Select
          value={currentCategory}
          onChange={(e) => setCurrentCategory(e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="X-ray">X-ray</option>
          <option value="Prescriptions">Prescriptions</option>
          <option value="Reports">Reports</option>
          <option value="Other">Other</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Select Files:</Form.Label>
        <Form.Control
          type="file"
          name="files"
          multiple
          disabled={!currentCategory}
          onChange={handleFileChange}
        />
      </Form.Group>

      {allSelectedFiles.length > 0 && (
        <div className="mb-3">
          <h5>Selected Files:</h5>
          <ListGroup>
            {allSelectedFiles.map((item, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between align-items-center"
              >
                {item.category}/{item.file.name}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemoveFile(index)}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}

      <Button
        onClick={handleFinalUpload}
        disabled={allSelectedFiles.length === 0}
        className="mb-3"
      >
        Upload All
      </Button>

      {uploadSuccess && <Alert variant="success">{uploadSuccess}</Alert>}
      {uploadError && <Alert variant="danger">{uploadError}</Alert>}
      {patientFiles.length > 0 && (
        <div className="mt-4">
          <h4>Uploaded Files</h4>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>File Name</th>
                </tr>
              </thead>
              <tbody>
                {patientFiles.map((file, index) => (
                  <tr key={index}>
                    <td>{file.name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadMedicalHistory;
