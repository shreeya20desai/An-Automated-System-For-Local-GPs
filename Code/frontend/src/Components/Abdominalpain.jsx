import React from "react";
import { Container, Card } from "react-bootstrap";
import AbdominalPain from "../Assets/Abdominalpain.jpg";
// https://my.clevelandclinic.org/health/symptoms/4167-abdominal-pain
// https://www.nhs.uk/conditions/stomach-ache/

const Abdonimalpain = () => {
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
          Abdominal Pain
        </Card.Title>
        <Card.Img
          variant="top"
          src={AbdominalPain}
          alt="Cold"
          style={{ height: "200px", objectFit: "contain" }}
        />
        <Card.Body>
          <Card.Text>
            Abdominal pain also said as stomach ache, which can be both
            non-serious and serious.
          </Card.Text>

          <Card.Subtitle className="mb-2 text-muted">
            General Symptoms.
          </Card.Subtitle>
          <ul>
            <li>Diarrhea.</li>
            <li>Stomach Bloating.</li>
            <li>Cramps.</li>
            <li>Vomitting.</li>
          </ul>

          <Card.Subtitle className="mb-2 text-muted">
            Precaution that can be taken at home at early stage.
          </Card.Subtitle>
          <ul>
            <li>Stay Hydrated: Drink as much as fluids.</li>
            <li>Eat light meals. Avoid food that is hard to digest.</li>
            <li>Take Rest as much as possible.</li>
          </ul>

          <Card.Subtitle className="mb-2 ">
            If incase any major issues. Kindly see a GP.
          </Card.Subtitle>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Abdonimalpain;
