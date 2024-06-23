import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = ({ onContactClick }) => {
  return (
    <footer className="bg-dark text-white mt-5">
      <Container fluid className="py-3">
        <Row>
          <Col md={4} sm={12} className="mb-3">
            <h5>Alchemic Recipes</h5>
            <p>
              Embark on a culinary journey through the mystical arts of alchemy.
            </p>
          </Col>
          <Col md={4} sm={12} className="mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#home" className="text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#recipes" className="text-white">
                  Recipes
                </a>
              </li>
              <li>
                <a href="#shop" className="text-white">
                  Shop
                </a>
              </li>
              <li>
                <a href="#about" className="text-white">
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={onContactClick}
                  className="text-white"
                >
                  Contact
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4} sm={12} className="mb-3">
            <h5>Connect With Us</h5>
            <p>
              For inquiries or potion requests, send us an owl or use the
              contact form on our site.
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-3">
            © 2024 Alchemic Recipes - All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
