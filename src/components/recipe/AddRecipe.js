import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddRecipe = ({ show, handleClose, handleAddRecipe }) => {
  const initialRecipeState = {
    name: "",
    description: "",
    category: "",
    ingredients: [""],
    instructions: [""],
    imageurl: "",
  };

  const [newRecipe, setNewRecipe] = useState(initialRecipeState);

  const handleChange = (e, index, field) => {
    if (field === "ingredients" || field === "instructions") {
      const updatedList = [...newRecipe[field]];
      updatedList[index] = e.target.value;
      setNewRecipe({ ...newRecipe, [field]: updatedList });
    } else {
      const { name, value } = e.target;
      setNewRecipe({ ...newRecipe, [name]: value });
    }
  };

  const handleAddField = (field) => {
    setNewRecipe({ ...newRecipe, [field]: [...newRecipe[field], ""] });
  };

  const handleRemoveField = (index, field) => {
    const updatedList = [...newRecipe[field]];
    if (updatedList.length > 1) {
      updatedList.splice(index, 1);
      setNewRecipe({ ...newRecipe, [field]: updatedList });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedRecipe = {
      ...newRecipe,
      ingredients: newRecipe.ingredients.join("\n"),
      instructions: newRecipe.instructions.join("\n"),
    };
    handleAddRecipe(formattedRecipe);
    setNewRecipe(initialRecipeState);
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        handleClose();
        setNewRecipe(initialRecipeState);
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newRecipe.name}
              onChange={(e) => handleChange(e, null, null)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={newRecipe.description}
              onChange={(e) => handleChange(e, null, null)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              name="imageurl"
              value={newRecipe.imageurl}
              onChange={(e) => handleChange(e, null, null)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={newRecipe.category}
              onChange={(e) => handleChange(e, null, null)}
              required
            />
          </Form.Group>

          <div>
            {newRecipe.ingredients.map((ingredient, index) => (
              <Form.Group className="mb-3" key={`ingredient-${index}`}>
                <Form.Label>Ingredient {index + 1}</Form.Label>
                <Form.Control
                  type="text"
                  name="ingredients"
                  value={ingredient}
                  onChange={(e) => handleChange(e, index, "ingredients")}
                  required
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
            <Button
              variant="secondary"
              onClick={() => handleAddField("ingredients")}
            >
              Add Ingredient
            </Button>
          </div>

          <div>
            {newRecipe.instructions.map((instruction, index) => (
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
            <Button
              variant="secondary"
              onClick={() => handleAddField("instructions")}
            >
              Add Instruction
            </Button>
          </div>

          <Button variant="primary" type="submit" className="mt-4">
            Add Recipe
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddRecipe;
