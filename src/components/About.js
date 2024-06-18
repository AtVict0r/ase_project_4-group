import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md="auto">
          <Image src="about.jpg" alt="About Alchemy Recipes" fluid />
        </Col>
        <Col md="auto">
          <h1>Welcome to Alchemy Recipes!</h1>
          <p>
            Alchemy Recipes is a website dedicated to the art and science of
            alchemy. Here, you can explore a collection of alchemical recipes,
            learn about the history and philosophy of alchemy, and even submit
            your own recipes to share with the community.
          </p>
          <p>
            Alchemy was an ancient practice that combined elements of
            philosophy, chemistry, medicine, astrology, and mysticism.
            Alchemists believed that they could transform base metals into
            gold, create an elixir of immortality, and unlock the secrets of the
            universe.
          </p>
          <p>
            While the literal goals of alchemy may not have been achieved,
            the practice laid the foundation for modern chemistry and scientific
            methodology. Today, alchemy continues to inspire artists, writers,
            and scientists alike.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default About;