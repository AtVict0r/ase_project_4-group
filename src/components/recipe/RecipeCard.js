import React from "react";
import { Card, Button } from "react-bootstrap";

const RecipeCard = ({ user, recipe, onShowDetails, onEdit, onDelete }) => {
  return (
    <Card className="recipe-card">
      <Card.Img variant="top" src={recipe.imageurl} alt={recipe.name} />
      <Card.Body>
        <Card.Title>{recipe.name}</Card.Title>
        <Card.Text>{recipe.description}</Card.Text>
        <Button variant="primary" onClick={() => onShowDetails(recipe)}>
          View Details
        </Button>
        {user && (
          <>
            <Button variant="secondary" onClick={() => onEdit(recipe)}>
              Edit
            </Button>
            <Button variant="danger" onClick={() => onDelete(recipe.id)}>
              Delete
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;
