import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import RecipeDetail from "./RecipeDetail";
import AddRecipe from "./AddRecipe";
import EditRecipe from "./EditRecipe";
import { Container, Row, Col, Button } from "react-bootstrap";

const API_ENDPOINT = "http://127.0.0.1:8000";

const Recipe = ({
  api,
  user,
  recipes,
  setRecipes,
  reviews,
  setReviews,
  shopItems,
  onShowLogin,
  onAddToCart,
}) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [formattedData, setFormattedData] = useState([]);
  const recipesPerPage = 6;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/get_all_recipes`);
        if (!response.ok) throw new Error("API call failed");
        const data = await response.json();
        console.log("API response data for recipes:", data);
        if (!Array.isArray(data.recipes))
          throw new Error("API returned non-array data");
        const formatted = data.recipes.map((recipes) => ({
          id: recipes.id,
          name: recipes.name,
          description: recipes.description,
          imageurl: recipes.imageurl,
          category: recipes.category,
          ingredients: recipes.ingredients,
          instructions: recipes.instructions,
        }));
        setRecipes(formatted);
        setFormattedData(formatted);
      } catch (error) {
        console.error("API call failed:", error);
      }
    };

    fetchRecipes();
  }, [setRecipes]);

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
      const formattedRecipe = {
        name: newRecipe.name,
        description: newRecipe.description,
        imageurl: newRecipe.imageurl || "https://example.com/default-image.jpg",
        category: newRecipe.category,
        ingredients: newRecipe.ingredients.join("\n"),
        instructions: newRecipe.instructions.join("\n"),
      };

      const response = await fetch(`${API_ENDPOINT}/recipes/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedRecipe),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log("Recipe added successfully:", data);
      setRecipes((prevRecipes) => [...prevRecipes, data]);
      setFormattedData((prevData) => [...prevData, data]);
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
      const response = await fetch(
        `${API_ENDPOINT}/recipes/edit/${updatedRecipe.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRecipe),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) => (recipe.id === data.id ? data : recipe))
      );
      setFormattedData((prevData) =>
        prevData.map((recipe) => (recipe.id === data.id ? data : recipe))
      );
    } catch (error) {
      console.error("Failed to update the recipe:", error);
    }

    setShowEditModal(false);
    setShowDetailsModal(true);
  };

  const handleDelete = async (recipe) => {
    if (!recipe || !recipe.id) {
      console.error("Recipe or Recipe ID is undefined");
      return;
    }

    console.log("Deleting recipe with id:", recipe.id);

    try {
      const response = await fetch(
        `${API_ENDPOINT}/delete_recipe/${recipe.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setRecipes((prevRecipes) =>
        prevRecipes.filter((r) => r.id !== recipe.id)
      );
      setFormattedData((prevData) =>
        prevData.filter((r) => r.id !== recipe.id)
      );
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
        {currentRecipes.map((recipe) => (
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
              onDelete={() => handleDelete(recipe)}
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
