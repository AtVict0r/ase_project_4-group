import React from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';

function Footer() {
  return (
    <Navbar fixed="bottom" bg="light">
      <Container>
        <Row>
          <Col className="text-center py-3">
            Alchemic Recipes © 2024
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default Footer;