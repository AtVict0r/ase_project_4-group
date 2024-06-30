import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Modal } from "react-bootstrap";

const Contact = ({ user, show, handleClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prevState) => ({
        ...prevState,
        name: user.username,
        email: user.email,
      }));
    }
  }, [user]);

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.name = formData.name ? "" : "Name is required.";
    tempErrors.email = formData.email ? "" : "Email is required.";
    tempErrors.message = formData.message ? "" : "Message is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const mailtoLink = `mailto:admin@alchemicrecipes.org?subject=Contact Form Submission from ${formData.name}&body=Reply-To: ${formData.email}%0D%0A%0D%0AMessage: ${formData.message}`;
      window.open(mailtoLink, '_blank');
      setShowAlert(true);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      setTimeout(() => {
        setShowAlert(false);
        handleClose();
      }, 2000);
    }
  };

  return (
    <Modal id="contact" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Contact the Alchemists</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showAlert && (
          <Alert variant="success">
            Your message has been sent successfully!
          </Alert>
        )}
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicMessage">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write your message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              isInvalid={!!errors.message}
            />
            <Form.Control.Feedback type="invalid">
              {errors.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit">
            Send Message
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Contact;
