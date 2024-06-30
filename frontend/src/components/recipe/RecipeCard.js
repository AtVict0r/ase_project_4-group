import React from "react";
import { Card, Button } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";

const RecipeCard = ({ user, recipe, onShowDetails, onEdit, onDelete }) => {
  const defaultImageUrl = "/assets/images/default-recipe.png"; // Set your default image URL here
  const imageUrl = recipe.imageurl || recipe.imagurl || defaultImageUrl;

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant="top" src={imageUrl} alt={recipe.name} />
      <Card.Body>
        <Card.Title>{recipe.name}</Card.Title>
        <Card.Text>{recipe.description}</Card.Text>
        <Button variant="primary" onClick={() => onShowDetails(recipe)}>
          Learn More
        </Button>
        {user && (
          <>
            <Button variant="outline-secondary" onClick={() => onEdit(recipe)}>
              <PencilSquare />
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => onDelete(recipe.id)}
            >
              <Trash />
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;
