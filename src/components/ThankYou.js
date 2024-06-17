import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const ThankYou = () => {
  return (
    <Container className="text-center mt-5">
      <Row>
        <Col xs={12}>
          {/* Success Icon */}
          <i className="fas fa-check-circle text-success mb-3" style={{ fontSize: '4rem' }}></i>
          <h1>Thank You!</h1>
          <p>Your recipe has been submitted successfully.</p>
          <Button variant="primary" href="/">
            Go Back to Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ThankYou;