import React, { useState, useEffect } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import faqData from "../data/faq.json";

const About = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    setFaqs(faqData);
  }, []);

  return (
    <Container id="about" className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center">About Alchemic Recipes</h2>
          <p>
            Alchemic Recipes is a website dedicated to the art and science of
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
          <p>
            Delve into the ancient art of alchemy where we transform ordinary
            ingredients into extraordinary culinary creations. Our recipes are
            more than just food; they're a blend of tradition, magic, and a
            touch of the mystical.
          </p>
        </Col>
        <Col md={8}>
          <h3><u>Frequently Asked Questions</u></h3>
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
