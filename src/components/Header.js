import React, { props } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const Header = ({
  user,
  onLogoutClick,
  onLoginClick,
  onSignupClick,
  onContactClick,
}) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#home">
          <img
            alt="Alchemy Logo"
            src="..\assets\images\logo\alchemy_logo.jpeg" // Replace with the path to your logo image
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Alchemic Recipes
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#recipes">Recipes</Nav.Link>
            <Nav.Link href="#shop">Shop</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#contact" onClick={onContactClick}>
              Contact
            </Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <Button
                variant="outline-danger"
                onClick={onLogoutClick}
                className="ms-2"
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="outline-success"
                  onClick={onLoginClick}
                  className="ms-2"
                >
                  Login
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={onSignupClick}
                  className="ms-2"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
