import React, { useState, useEffect, useCallback } from "react";
import RecipeCard from "./RecipeCard";
import RecipeDetail from "./RecipeDetail";
import AddRecipe from "./AddRecipe";
import EditRecipe from "./EditRecipe";
import { Container, Row, Col, Button } from "react-bootstrap";
import recipesJson from "../../data/recipes.json";

const API_ENDPOINT = "http://127.0.0.1:8000";

const getCSRFToken = () => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name.trim() === "csrftoken") {
      return decodeURIComponent(value);
    }
  }
  return null;
};

const csrfToken = getCSRFToken();

const Recipe = ({
  api = API_ENDPOINT,
  user,
  reviews,
  setReviews,
  shopItems,
  onShowLogin,
  onAddToCart,
}) => {
  const [recipes, setRecipes] = useState(recipesJson);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const recipesPerPage = 6;

  const fetchRecipes = useCallback(async () => {
    try {
      console.log("Fetching recipes...");
      const response = await fetch(`${API_ENDPOINT}/recipes/get_all`);
      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error("API returned non-array data");
        throw new Error("API returned non-array data");
      }
      const formatted = data.map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        imageurl: recipe.imageurl || recipe.imagurl || recipesJson[0].imageurl, // Default image fallback
        category: recipe.category,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      }));
      setRecipes(formatted);
    } catch (error) {
      console.error("API call failed:", error);
      setRecipes(recipesJson); // Fallback to local JSON data
    }
  }, []);

  useEffect(() => {
    fetchRecipes(); // Fetch recipes initially
  }, [fetchRecipes]);

  useEffect(() => {
    if (!recipes || !Array.isArray(recipes)) {
      setRecipes(recipesJson); // Ensure recipes is always an array and fallback to local JSON data
    }
  }, [recipes]);

  const totalPages = Math.ceil(recipes.length / recipesPerPage);
  const currentRecipes = recipes.slice(
    currentPage * recipesPerPage,
    (currentPage + 1) * recipesPerPage
  );

  const paginate = (direction) => {
    setCurrentPage((prevPage) => {
      let nextPage = prevPage + direction;
      if (nextPage < 0) nextPage = totalPages - 1;
      if (nextPage >= totalPages) nextPage = 0;
      return nextPage;
    });
  };

  const showDetails = (recipe) => {
    setSelectedRecipe(recipe);
    setShowDetailsModal(true);
  };

  const handleAddRecipe = async (newRecipe) => {
    try {
      const response = await fetch(`${api}/recipes/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(newRecipe),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      await fetchRecipes(); // Re-fetch the recipes
      setShowAddModal(false); // Close the add recipe modal
    } catch (error) {
      console.error("Failed to create the recipe:", error);
    }
  };

  const handleEdit = (recipe) => {
    setShowDetailsModal(false);
    setSelectedRecipe(recipe);
    setShowEditModal(true);
  };

  const handleUpdateRecipe = async (recipeId, updatedRecipe) => {
    try {
      const response = await fetch(`${api}/recipes/update/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(updatedRecipe),
      });

      if (!response.ok) {
        if (response.status === 403) throw new Error("Unauthorized");
        if (response.status === 404) throw new Error("Recipe not found");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      await fetchRecipes(); // Re-fetch the recipes
      setShowEditModal(false); // Close the edit recipe modal
    } catch (error) {
      console.error("Failed to update the recipe:", error);
    }
  };

  const handleDelete = async (recipeId) => {
    try {
      const response = await fetch(`${api}/recipes/delete/${recipeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      });

      if (!response.ok) {
        if (response.status === 403) throw new Error("Unauthorized");
        if (response.status === 404) throw new Error("Recipe not found");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchRecipes(); // Re-fetch the recipes
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
        {currentRecipes.length > 0 ? (
          currentRecipes.map((recipe) => {
            if (!recipe) return null; // Check for undefined recipe
            return (
              <Col
                xs={12}
                md={6}
                lg={4}
                className="mb-3 d-flex justify-content-center"
                key={recipe.id} // Ensure each item has a unique key
              >
                <RecipeCard
                  user={user}
                  recipe={recipe}
                  onShowDetails={showDetails}
                  onEdit={handleEdit}
                  onDelete={() => handleDelete(recipe.id)}
                />
              </Col>
            );
          })
        ) : (
          <div>No recipes available</div>
        )}
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
              setShowDetailsModal(false);
            }}
            recipe={selectedRecipe}
            handleUpdateRecipe={handleUpdateRecipe}
          />
        ) : null)}
    </Container>
  );
};

export default Recipe;
