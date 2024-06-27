import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import RecipeDetail from "./RecipeDetail";
import AddRecipe from "./AddRecipe";
import EditRecipe from "./EditRecipe";
import { Container, Row, Col, Button } from "react-bootstrap";

const Recipe = ({
  api,
  user,
  reviews,
  shopItems,
  onShowLogin,
  onAddToCart,
}) => {
  const [recipes, setRecipes] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const recipesPerPage = 6;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${api}/get_all_recipes`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      }
    };

    fetchRecipes();
  }, [api]);

  // calculate the total number of pages
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  // get current recipes
  const currentRecipes = Array.isArray(recipes)
    ? recipes.slice(
        currentPage * recipesPerPage,
        (currentPage + 1) * recipesPerPage
      )
    : [];

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

  const handleAddRecipe = async (newRecipe) => {
    console.log("New recipe added:", newRecipe);

    try {
      const response = await fetch(`${api}/new_recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecipe),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdRecipe = await response.json();
      setRecipes([...recipes, createdRecipe]);
    } catch (error) {
      console.error("Failed to create the recipe:", error);
    }
  };

  const handleEdit = (recipe) => {
    setShowDetailsModal(false);
    setSelectedRecipe(recipe);
    setShowEditModal(true);
  };

  const handleUpdateRecipe = async (updatedRecipe) => {
    console.log("Updated recipe:", updatedRecipe);

    try {
      const response = await fetch(`${api}/recipes/edit/${updatedRecipe.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRecipe),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedRecipes = recipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      );
      setRecipes(updatedRecipes);
    } catch (error) {
      console.error("Failed to update the recipe:", error);
    }

    setShowEditModal(false);
    setShowDetailsModal(true);
  };

  const handleDelete = async (recipeId) => {
    console.log("Deleted recipe with id:", recipeId);

    try {
      const response = await fetch(`${api}/delete_recipe/${recipeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const filteredRecipes = recipes.filter(
        (recipe) => recipe.id !== recipeId
      );
      setRecipes(filteredRecipes);
    } catch (error) {
      console.error("Failed to delete the recipe:", error);
    }
  };

  return (
    <Container id="recipes">
      <h2 className="text-center my-4">Alchemy Recipes</h2>
      {user && (
        <Col className="d-flex justify-content-start my-3">
          <Button variant="secondary" onClick={() => setShowAddModal(true)}>
            Add Recipe
          </Button>
        </Col>
      )}
      <AddRecipe
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleAddRecipe={handleAddRecipe}
      />
      <Row>
        {currentRecipes.map((recipe, index) => (
          <Col
            xs={12}
            md={6}
            lg={4}
            className="mb-3 d-flex justify-content-center"
            key={recipe.id}
          >
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
            api={api}
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
