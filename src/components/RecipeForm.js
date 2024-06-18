import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function RecipeForm({ addRecipe }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    addRecipe({
      title,
      description,
      ingredients: ingredients.split(',').map(ingredient => ingredient.trim()),
      instructions
    });
    setTitle('');
    setDescription('');
    setIngredients('');
    setInstructions('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="ingredients">
        <Form.Label>Ingredients</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter ingredients, separated by commas"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="instructions">
        <Form.Label>Instructions</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default RecipeForm;