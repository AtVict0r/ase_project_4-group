import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

const NotFound = () => {
  return (
    <Container className="text-center mt-5">
      <Row>
        <Col xs={12}>
          {/* Error Image */}
          <Image src="./assets/images/error.png" alt="404 Not Found" fluid width={200} />
          <h1>Oops! Page Not Found</h1>
          <p>
            The page you're looking for doesn't seem to exist. Maybe you mistyped
            the URL or it was removed.
          </p>
          <p>Here are some options:</p>
          <ul>
            <li>
              Go back to the <a href="/">Home Page</a>.
            </li>
            <li>
              Check the URL for any typos and try again.
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;