import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProfileSettings = ({ api, user, setUser }) => {
  const [formData, setFormData] = useState({
    email: user.email || "",
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      password: "",
      confirmPassword: "",
    });
  }, [user]);

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.email = formData.email ? "" : "Email is required.";
    tempErrors.first_name = formData.first_name
      ? ""
      : "First name is required.";
    tempErrors.last_name = formData.last_name ? "" : "Last name is required.";
    if (formData.password) {
      tempErrors.password =
        formData.password.length >= 6
          ? ""
          : "Password must be at least 6 characters.";
      tempErrors.confirmPassword =
        formData.password === formData.confirmPassword
          ? ""
          : "Passwords do not match.";
    }
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch(`${api}/api/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "API call failed");
        }

        const updatedUser = await response.json();
        setUser(updatedUser);
        navigate("/profile-settings");
      } catch (error) {
        console.error("API call failed:", error);
        setApiError(error.message || "API call failed");
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Form validation failed:", errors);
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      {apiError && <Alert variant="danger">{apiError}</Alert>}
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

      <Form.Group className="mb-3" controlId="formBasicFirstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          isInvalid={!!errors.first_name}
        />
        <Form.Control.Feedback type="invalid">
          {errors.first_name}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicLastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          isInvalid={!!errors.last_name}
        />
        <Form.Control.Feedback type="invalid">
          {errors.last_name}
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

      <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          isInvalid={!!errors.confirmPassword}
        />
        <Form.Control.Feedback type="invalid">
          {errors.confirmPassword}
        </Form.Control.Feedback>
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        ) : (
          "Update Profile"
        )}
      </Button>
    </Form>
  );
};

export default ProfileSettings;
