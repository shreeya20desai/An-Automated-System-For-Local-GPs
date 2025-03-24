import React from "react";
import { Card, Table, CardBody } from "react-bootstrap";

const AppointmentCard = ({ data }) => {
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
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {data.rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default AppointmentCard;
