import React, { useState } from "react";
import RecipeCard from "./RecipeCard";
import RecipeDetail from "./RecipeDetail";
import AddRecipe from "./AddRecipe";
import EditRecipe from "./EditRecipe";
import { Container, Row, Col, Button } from "react-bootstrap";

const Recipe = ({ user, recipes, reviews, shopItems, onShowLogin, onAddToCart }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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

  const showDetails = (recipe) => {
    setSelectedRecipe(recipe);
    setShowDetailsModal(true);
  };

  const handleAddRecipe = (newRecipe) => {
    // Logic to add the new recipe to the list
    console.log("New recipe added:", newRecipe);
    // Update the state or perform API call to save the new recipe
  };

  const handleEdit = (recipe) => {
    setShowDetailsModal(false);
    setSelectedRecipe(recipe);
    setShowEditModal(true);
  };

  const handleUpdateRecipe = (updatedRecipe) => {
    // Logic to update the recipe in the list
    console.log("Updated recipe:", updatedRecipe);
    // Close the edit modal
    setShowEditModal(false);
    setShowDetailsModal(true);
  };

  const handleDelete = (recipeId) => {
    // Logic to delete the recipe from the list
    console.log("Deleted recipe with id:", recipeId);
  };

  return (
    <Container id="recipes">
      <h2 className="text-center my-4">Alchemy Recipes</h2>
      {user && (<Col className="d-flex justify-content-start my-3">
        <Button variant="secondary" onClick={() => setShowAddModal(true)}>
          Add Recipe
        </Button>
      </Col>)}
      <AddRecipe
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleAddRecipe={handleAddRecipe}
      />
      <Row>
        {currentRecipes.map((recipe, index) => (
          <Col xs={12} md={6} lg={4} className="mb-3 d-flex justify-content-center" key={recipe.id}>
            <RecipeCard
              user={user}
              recipe={recipe}
              onShowDetails={showDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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
      {selectedRecipe &&
        (showDetailsModal ? (
          <RecipeDetail
            user={user}
            recipe={selectedRecipe}
            reviews={reviews}
            show={showDetailsModal}
            shopItems={shopItems}
            onHide={() => {
              setSelectedRecipe(null);
              setShowDetailsModal(false);
            }}
            onShowLogin={onShowLogin}
            onAddToCart={onAddToCart}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : showEditModal ? (
          <EditRecipe
            show={showEditModal}
            onHide={() => {
              setShowEditModal(false);
              setShowDetailsModal(true);
            }}
            recipe={selectedRecipe}
            handleUpdateRecipe={handleUpdateRecipe}
          />
        ) : null)}
    </Container>
  );
};

export default Recipe;