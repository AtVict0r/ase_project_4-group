import React from "react";
import { Card, Button } from "react-bootstrap";

const RecipeCard = ({ recipe, onShowDetails }) => {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant="top" src={recipe.image} />
      <Card.Body>
        <Card.Title>{recipe.name}</Card.Title>
        <Card.Text>{recipe.description}</Card.Text>
        <Button variant="primary" onClick={() => onShowDetails(recipe)}>
          Learn More
        </Button>
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;
