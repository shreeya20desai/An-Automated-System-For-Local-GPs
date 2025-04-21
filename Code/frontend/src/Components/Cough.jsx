import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Cough from "../Assets/Cough.jpeg";

// https://www.nhs.uk/conditions/cough/
// https://my.clevelandclinic.org/health/symptoms/17755-cough

const CoughPage = () => {
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
          Cough
        </Card.Title>
        <Card.Img
          variant="top"
          src={Cough}
          style={{ height: "200px", objectFit: "contain" }}
        />
        <Card.Body>
          <Card.Text>
            A cough is action that is reflex which helps to clear the throat of
            mucus. The cough could be dry, chronic or wet.However , the cough
            could be acute(would last less than 3 weeks),sub-acute( 3 to 8
            weeks) or serious(last longer than 8 weeks).
          </Card.Text>

          <Card.Subtitle className="mb-2 text-muted">
            General Symptoms.
          </Card.Subtitle>
          <ul>
            <li>Irritation in the throat.</li>
            <li>
              The cough might produce mucus or phelgm(thick mucus), which can be
              white, yellow or clear.
            </li>
            <li>Cough with Red-blood with mucus.</li>
          </ul>

          <Card.Subtitle className="mb-2 text-muted">
            Precaution that can be taken at home at early stage.
          </Card.Subtitle>
          <ul>
            <li>Stay Hydrated: Drink as much as fluids.</li>
            <li>Take rest</li>
            <li>Stay in a clean environment, avoid smoke and dust.</li>
            <li>Can consume Honey.</li>
          </ul>

          <Card.Subtitle className="mb-2 ">
            If incase any major issues. Kindly see a GP.
          </Card.Subtitle>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CoughPage;
