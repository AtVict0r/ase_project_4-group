import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import usersJson from "./users.json"

const Login = ({ api, show, onShowSignUp, handleClose, setUser }) => {
  const [savedUser, setSavedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.email = formData.email ? "" : "Email is required.";
    tempErrors.password = formData.password ? "" : "Password is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
      // Make a POST request to the API
      const response = await fetch(`${api}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      setUser(data);
      setSavedUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("API call failed:", error);
      setSavedUser(usersJson.find(
        (user) =>
          user.email === formData.email && user.password === formData.password
      ));
      if (
        savedUser &&
        savedUser.email === formData.email &&
        savedUser.password === formData.password
      ) {
        console.log("Form data submitted:", formData);
        setUser(savedUser);
        localStorage.setItem("user", JSON.stringify(savedUser));
        handleClose();
      } else {
        alert("Invalid email or password");
      }
    }
  }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Alchemist's Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit">
            Login
          </Button>
          <Button variant="link" onClick={onShowSignUp}>
            Don't have an account? Sign Up
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Login;
