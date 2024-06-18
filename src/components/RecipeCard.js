import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  return (
    <Card style={{ width: '18rem', marginBottom: '15px' }}>
      <Card.Img variant="top" src={recipe.image} />
      <Card.Body>
        <Card.Title>{recipe.title}</Card.Title>
        <Card.Text>
          {recipe.description}
        </Card.Text>
        <Link to={`/recipe/${recipe.id}`}>
          <Button variant="primary">View Recipe</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default RecipeCard;