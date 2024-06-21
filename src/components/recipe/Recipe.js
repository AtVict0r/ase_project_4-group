import React, { useState } from "react";
import RecipeCard from "./RecipeCard";
import RecipeDetail from "./RecipeDetail";
import { Container, Row, Col, Button } from "react-bootstrap";
import recipes from "./recipes.json"; // assuming the recipes.json file is in the same directory

const Recipe = ({ onShowLogin, onAddToCart }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const recipesPerPage = 6;

  // calculate the total number of pages
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  // get current recipes
  const currentRecipes = recipes.slice(
    currentPage * recipesPerPage,
    (currentPage + 1) * recipesPerPage
  );

  // change page
  const paginate = (direction) => {
    setCurrentPage((prevPage) => {
      let nextPage = prevPage + direction;
      if (nextPage < 0) nextPage = totalPages - 1; // loop back to last page
      if (nextPage >= totalPages) nextPage = 0; // loop back to first page
      return nextPage;
    });
  };

  // show recipe details
  const showDetails = (recipe) => {
    setSelectedRecipe(recipe);
  };

  // hide recipe details
  const hideDetails = () => {
    setSelectedRecipe(null);
  };

  return (
    <Container id="recipes">
      <h2 className="text-center my-4">Alchemy Recipes</h2>
      <Row>
        {currentRecipes.map((recipe, index) => (
          <Col md={4} key={index}>
            <RecipeCard recipe={recipe} onShowDetails={showDetails} />
          </Col>
        ))}
      </Row>
      <Row className="justify-content-center my-4">
        <Col md={2} className="text-center">
          <Button onClick={() => paginate(-1)}>Previous</Button>
        </Col>
        <Col md={2} className="text-center">
          <Button onClick={() => paginate(1)}>Next</Button>
        </Col>
      </Row>
      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          show={!!selectedRecipe}
          onHide={hideDetails}
          onShowLogin={onShowLogin}
          onAddToCart={onAddToCart}
        />
      )}
    </Container>
  );
};

export default Recipe;
