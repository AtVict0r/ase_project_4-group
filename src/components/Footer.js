import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3">
      <Container>
        <Row>
          <Col xs={12} className="text-center">
            <p>&copy; {new Date().getFullYear()} Alchemy Recipes</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;