import React, { useContext, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import RecipeContext from '../context/RecipeContext'; // Replace with your context path

const RecipeDetails = () => {
  const { getRecipeById, deleteRecipe } = useContext(RecipeContext);
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { recipeId } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedRecipe = await getRecipeById(recipeId);
        setRecipe(fetchedRecipe);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getRecipeById, recipeId]); // Dependency array: fetch on recipeId change

  const handleEditClick = () => {
    history.push(`/recipes/${recipeId}/edit`); // Edit route (replace with your path)
  };

  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe(recipeId);
        history.push('/recipes'); // Back to recipe list on delete (replace with your path)
      } catch (error) {
        console.error('Error deleting recipe:', error);
        setError(error);
      }
    }
  };

  if (isLoading) {
    return <p>Loading recipe details...</p>;
  }

  if (error) {
    return (
      <p className="text-danger">Error: {error.message}</p>
    );
  }

  if (!recipe) {
    return <p>Recipe not found.</p>;
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col md={8}>
          <Card>
            <Card.Img variant="top" src={recipe.imageUrl} alt={recipe.name} />
            <Card.Body>
              <Card.Title>{recipe.name}</Card.Title>
              <Card.Text>{recipe.description}</Card.Text>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between">
              <small className="text-muted">Category: {recipe.category}</small>
              <div>
                <Button variant="outline-primary" size="sm" onClick={handleEditClick}>
                  <FaEdit /> Edit
                </Button>
                <Button variant="outline-danger" size="sm" onClick={handleDeleteClick}>
                  <FaTrash /> Delete
                </Button>
              </div>
            </Card.Footer>
          </Card>

          {/* Additional details like ingredients, instructions, etc. (add as needed) */}
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.name} ({ingredient.quantity}{ingredient.unit})</li>
            ))}
          </ul>

          <h2>Instructions</h2>
          <ol>
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </Col>
        <Col md={4}>
          {/* Additional recipe details or related content (optional) */}
        </Col>
      </Row>
    </Container>
  );
};

export default RecipeDetails;