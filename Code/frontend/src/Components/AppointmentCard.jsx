import React from "react";
import { Card, Table, CardBody } from "react-bootstrap";
import CancelAppointmentButtom from "../Components/CancelAppointmentButton";

const AppointmentCard = ({ data, onCancel }) => {
  return (
    <Card>
      <CardBody>
        <Table responsive>
          <thead>
            {/* Table Row */}
            <tr>
              {data.headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
              {onCancel && <th>Actions</th>}
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {data.rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
                {onCancel && (
                  <td>
                    <CancelAppointmentButtom
                      onCancel={onCancel}
                      rowId={row.id}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default AppointmentCard;
