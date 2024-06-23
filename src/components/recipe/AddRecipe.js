import React, { useState } from "react";
import { Form, Button, Alert, Modal } from "react-bootstrap";
import ThankYou from "./ThankYou";

const AddRecipe = ({ show, handleClose, handleAddRecipe }) => {
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    description: "",
    imageUrl: null,
    category: "",
    ingredients: [""],
    instructions: [""],
  });
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.name = newRecipe.name ? "" : "Name is required.";
    tempErrors.description = newRecipe.description
      ? ""
      : "Description is required.";
    tempErrors.category = newRecipe.category ? "" : "Category is required.";
    tempErrors.ingredients = newRecipe.ingredients.every((i) => i)
      ? ""
      : "All ingredient fields must be filled.";
    tempErrors.instructions = newRecipe.instructions.every((i) => i)
      ? ""
      : "All instruction fields must be filled.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e, index, field) => {
    if (field === "ingredients" || field === "instructions") {
      const updatedList = [...newRecipe[field]];
      updatedList[index] = e.target.value;
      setNewRecipe({ ...newRecipe, [field]: updatedList });
    } else {
      const { name, value } = e.target;
      if (name === "imageUrl") {
        setNewRecipe({ ...newRecipe, [name]: e.target.files[0] });
      } else {
        setNewRecipe({ ...newRecipe, [name]: value });
      }
    }
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleAddField = (field) => {
    setNewRecipe({ ...newRecipe, [field]: [...newRecipe[field], ""] });
  };

  const handleRemoveField = (index, field) => {
    const updatedList = [...newRecipe[field]];
    updatedList.splice(index, 1);
    setNewRecipe({ ...newRecipe, [field]: updatedList });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleAddRecipe(newRecipe);
      setShowAlert(true);
      setShowThankYou(true);
      setTimeout(() => {
        setShowAlert(false);
        handleClose();
      }, 2000);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Alchemy Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showAlert && (
          <Alert variant="success">Recipe added successfully!</Alert>
        )}
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newRecipe.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={newRecipe.description}
              onChange={handleChange}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file" // Change this to 'file'
              name="imageUrl"
              onChange={handleChange}
              isInvalid={!!errors.imageUrl}
            />
            <Form.Control.Feedback type="invalid">
              {errors.imageUrl}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={newRecipe.category}
              onChange={handleChange}
              isInvalid={!!errors.category}
            />
            <Form.Control.Feedback type="invalid">
              {errors.category}
            </Form.Control.Feedback>
          </Form.Group>
          <div>
            {newRecipe.ingredients.map((ingredient, index) => (
              <Form.Group className="mb-3" key={index}>
                <Form.Label>Ingredient {index + 1}</Form.Label>
                <Form.Control
                  type="text"
                  name="ingredients"
                  value={ingredient}
                  onChange={(e) => handleChange(e, index, "ingredients")}
                  isInvalid={!!errors.ingredients}
                />
                {newRecipe.ingredients.length > 1 && (
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveField(index, "ingredients")}
                  >
                    Remove
                  </Button>
                )}
              </Form.Group>
            ))}
            <Button onClick={() => handleAddField("ingredients")}>
              Add Ingredient
            </Button>
          </div>
          <div>
            {newRecipe.instructions.map((instruction, index) => (
              <Form.Group className="mb-3" key={index}>
                <Form.Label>Instruction {index + 1}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="instructions"
                  value={instruction}
                  onChange={(e) => handleChange(e, index, "instructions")}
                  isInvalid={!!errors.instructions}
                />
                {newRecipe.instructions.length > 1 && (
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveField(index, "instructions")}
                  >
                    Remove
                  </Button>
                )}
              </Form.Group>
            ))}
            <Button onClick={() => handleAddField("instructions")}>
              Add Instruction
            </Button>
          </div>
          <Button
            variant="primary"
            type="submit"
            className="mt-4" // This adds a margin-top of 1.5rem (Bootstrap spacing scale)
          >
            Add Recipe
          </Button>
        </Form>
      </Modal.Body>
      {showThankYou && <ThankYou />}
    </Modal>
  );
};

export default AddRecipe;