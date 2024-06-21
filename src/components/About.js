import React, { useState, useEffect } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import faqData from "../data/faq.json"; // Make sure the path to your JSON file is correct

const About = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    // Assuming the FAQ data is small enough to be loaded directly into state
    setFaqs(faqData);
  }, []);

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center">About Alchemic Recipes</h2>
          <p className="text-center">
            Delve into the ancient art of alchemy where we transform ordinary
            ingredients into extraordinary culinary creations. Our recipes are
            more than just food; they're a blend of tradition, magic, and a
            touch of the mystical.
          </p>
          <h3>Frequently Asked Questions</h3>
          <Accordion defaultActiveKey="0">
            {faqs.map((faq, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>{faq.question}</Accordion.Header>
                <Accordion.Body>{faq.answer}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
