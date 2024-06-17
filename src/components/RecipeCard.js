import React from 'react';
import { Card, Image, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <Card>
      <Image src={recipe.imageUrl || 'placeholder.jpg'} alt={recipe.name} fluid />
      <Card.Body>
        <Card.Title>
          <Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link>
        </Card.Title>
        <Card.Text>
          {recipe.description && recipe.description.substring(0, 100)}{' '}
          {recipe.description && recipe.description.length > 100 && '...'}
        </Card.Text>
        {recipe.category && (
          <Badge bg="primary" variant="light">
            {recipe.category}
          </Badge>
        )}
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;