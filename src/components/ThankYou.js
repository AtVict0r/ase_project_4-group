import React from 'react';
import { Alert } from 'react-bootstrap';

function ThankYou() {
  return (
    <Alert variant="success">
      <Alert.Heading>Thank You!</Alert.Heading>
      <p>
        Your recipe has been successfully submitted. We appreciate your contribution to our alchemic recipes collection. Check back soon to see your recipe live on our site!
      </p>
    </Alert>
  );
}

export default ThankYou;