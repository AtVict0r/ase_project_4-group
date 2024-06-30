import React from "react";
import { Modal, Button } from "react-bootstrap";
import Review from "./Review";

const RecipeDetail = ({
  recipe,
  reviews,
  show,
  shopItems,
  onHide,
  user,
  onShowLogin,
  onAddToCart,
  onEdit,
  onDelete,
  api,
}) => {
  const shopItemNames = new Set(shopItems.map((item) => item.name));
  const recipeReviews = reviews.filter(
    (review) => review.recipeId === recipe.id
  );

  // Ensure ingredients and instructions are arrays
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : recipe.ingredients.split("\n");
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : recipe.instructions.split("\n");

  const addReview = async (review) => {
    console.log("Adding review:", review);

    try {
      const response = await fetch(`${api}/api/reviews/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  const handleMouseEnter = (e) => {
    e.target.textContent = "Add to Cart";
  };

  const handleMouseLeave = (e) => {
    e.target.textContent = "+";
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{recipe.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Description</h4>
        <p>{recipe.description}</p>
        <h4>Ingredients</h4>
        <ul>
          {ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient}{" "}
              {shopItemNames.has(ingredient) && (
                <Button
                  variant="primary"
                  size="sm"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => onAddToCart(ingredient)}
                >
                  +
                </Button>
              )}
            </li>
          ))}
        </ul>
        <h4>Instructions</h4>
        <ol>
          {instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
        <Review
          reviews={recipeReviews}
          user={user}
          onShowLogin={onShowLogin}
          onAddReview={addReview}
        />
      </Modal.Body>
      <Modal.Footer>
        {user && (
          <>
            <Button variant="info" onClick={() => onEdit(recipe)}>
              Edit Recipe
            </Button>
            <Button variant="danger" onClick={() => onDelete(recipe.id)}>
              Delete Recipe
            </Button>
          </>
        )}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RecipeDetail;
