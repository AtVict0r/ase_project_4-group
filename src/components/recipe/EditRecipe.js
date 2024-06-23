import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const EditRecipe = ({ show, onHide, recipe, handleUpdateRecipe }) => {
  const [editedRecipe, setEditedRecipe] = useState({ ...recipe });

  const handleChange = (e, index, field) => {
    if (field === "ingredients" || field === "instructions") {
      const updatedList = [...editedRecipe[field]];
      updatedList[index] = e.target.value;
      setEditedRecipe({ ...editedRecipe, [field]: updatedList });
    } else {
      const { name, value } = e.target;
      if (name === "imageUrl") {
        setEditedRecipe({ ...editedRecipe, [name]: e.target.files[0] }); 
      } else {
        setEditedRecipe({ ...editedRecipe, [name]: value });
      }
    }
  };

  const handleAddField = (field) => {
    setEditedRecipe({ ...editedRecipe, [field]: [...editedRecipe[field], ""] });
  };

  const handleRemoveField = (index, field) => {
    const updatedList = [...editedRecipe[field]];
    if (updatedList.length > 1) {
      updatedList.splice(index, 1);
      setEditedRecipe({ ...editedRecipe, [field]: updatedList });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateRecipe(editedRecipe);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={editedRecipe.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={editedRecipe.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file" // Change this to 'file'
              name="imageUrl"
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={editedRecipe.category}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div>
          {editedRecipe.ingredients.map((ingredient, index) => (
            <Form.Group className="mb-3" key={`ingredient-${index}`}>
              <Form.Label>Ingredient {index + 1}</Form.Label>
              <Form.Control
                type="text"
                name="ingredients"
                value={ingredient}
                onChange={(e) => handleChange(e, index, "ingredients")}
                required
              />
              {editedRecipe.ingredients.length > 1 && (
                <Button
                  variant="danger"
                  onClick={() => handleRemoveField(index, "ingredients")}
                >
                  Remove
                </Button>
              )}
            </Form.Group>
          ))}
          <Button
            variant="secondary"
            onClick={() => handleAddField("ingredients")}
          >
            Add Ingredient
          </Button>
          </div>

          <div>
          {editedRecipe.instructions.map((instruction, index) => (
            <Form.Group className="mb-3" key={`instruction-${index}`}>
              <Form.Label>Instruction {index + 1}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="instructions"
                value={instruction}
                onChange={(e) => handleChange(e, index, "instructions")}
                required
              />
              {editedRecipe.instructions.length > 1 && (
                <Button
                  variant="danger"
                  onClick={() => handleRemoveField(index, "instructions")}
                >
                  Remove
                </Button>
              )}
            </Form.Group>
          ))}
          <Button
            variant="secondary"
            onClick={() => handleAddField("instructions")}
          >
            Add Instruction
          </Button>
          </div>

          <Button variant="primary" type="submit" className="mt-4">
            Update Recipe
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditRecipe;