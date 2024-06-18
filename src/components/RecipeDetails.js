import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

function RecipeDetails({ recipes }) {
  const { id } = useParams();
  const recipe = recipes.find((recipe) => recipe.id === Number(id));

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <Card style={{ width: '18rem', margin: 'auto' }}>
      <Card.Img variant="top" src={recipe.image} />
      <Card.Body>
        <Card.Title>{recipe.title}</Card.Title>
        <Card.Text>
          {recipe.description}
        </Card.Text>
      </Card.Body>
      <ListGroup variant="flush">
        <ListGroup.Item><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</ListGroup.Item>
        <ListGroup.Item><strong>Instructions:</strong> {recipe.instructions}</ListGroup.Item>
      </ListGroup>
    </Card>
  );
}

export default RecipeDetails;