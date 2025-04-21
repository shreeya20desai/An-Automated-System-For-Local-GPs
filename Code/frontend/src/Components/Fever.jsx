import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import Fever from "../Assets/Fever.jpg";
import { Link } from "react-router-dom";

// https://www.nhs.uk/conditions/fever-in-adults/
// https://www.mayoclinic.org/diseases-conditions/fever/symptoms-causes/syc-20352759

const FeverPage = () => {
  return (
    <Container className="mt-3">
      <Card
        style={{
          maxWidth: "500px",
          maxHeight: "80vh",
          overflowY: "auto", //vertical scrolling
        }}
      >
        <Card.Title
          style={{ textAlign: "center", fontWeight: "bold", fontSize: "35px" }}
        >
          Fever
        </Card.Title>
        <Card.Img
          variant="top"
          src={Fever}
          style={{ height: "200px", objectFit: "contain" }}
          className="img-fluid"
        />
        <Card.Body>
          <Card.Text>
            A Fever is an increase in body temperature apart from the nomal
            temperature.The fever can be caused by infections. The average body
            temperature is said be around 98.0°F. If incase the Body temperature
            is 100°F or higher then a fever can arise in the body.
          </Card.Text>

          <Card.Subtitle className="mb-2 text-muted">
            {" "}
            General Symptoms.
          </Card.Subtitle>
          <ul>
            <li>Body Shivering</li>
            <li>Headache</li>
            <li>Nausea</li>
            <li>General Weakness</li>
            <li>Weakness</li>
          </ul>

          <Card.Subtitle className="mb-2 text-muted">
            Precaution that can be taken at home at early stage.
          </Card.Subtitle>
          <ul>
            <li>Stay Hydrated: Drink as much as fluids.</li>
            <li>Eat light Meals.</li>
            <li>Monitor the Body Temperature.</li>
            <li>Take Rest as much as possible.</li>
            <li>Wear Comfortable Clothes. </li>
          </ul>

          <Card.Subtitle className="mb-2 ">
            If incase any major issues. Kindly see a GP.
          </Card.Subtitle>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FeverPage;
