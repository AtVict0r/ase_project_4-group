import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import RecipeCard from './RecipeCard';
import Search from './Search';
import Filter from './Filter';
import recipesData from '../data/recipes.json'; // Use fallback data

const Home = () => {
  const [recipes, setRecipes] = useState([]); // State for recipes data
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for errors
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filter, setFilter] = useState('all'); // State for category filter

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/recipes'); // Assuming backend endpoint
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError(error); // Store error for display
        setRecipes(recipesData); // Fallback to local data
      } finally {
        setIsLoading(false); // Always set loading to false after fetching
      }
    };

    fetchData();
  }, []); // Empty dependency array: fetch data on component mount

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm) &&
    (filter === 'all' || recipe.category === filter)
  );

  // Pagination functionality (omitted for brevity)

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  // Placeholder handleAddRecipeClick function (replace with your implementation)
  const handleAddRecipeClick = async () => {
    console.log('Add Recipe button clicked!');
    // Implement logic to handle adding a new recipe
    // Assuming a PUT request to '/api/recipes' with new recipe data
    // Replace with your actual API call and data handling
    try {
      const newRecipe = {
        // ... Define properties for the new recipe object
      };
      const response = await axios.put('/api/recipes', newRecipe);
      console.log('New recipe added:', response.data);
      // Update recipes state or handle success message
    } catch (error) {
      console.error('Error adding recipe:', error);
      // Handle error message
    }
  };

  return (
    <Container className="mt-5">
      <h1>Welcome to Alchemy Recipes!</h1>

      {/* Search and Filter components */}
      <Form inline className="mb-3">
        <Search searchTerm={searchTerm} handleSearch={handleSearch} />
        <Filter filter={filter} recipes={recipes} handleFilterChange={handleFilterChange} />
        <Button variant="outline-success" onClick={handleAddRecipeClick}>
          Add Recipe
        </Button>
      </Form>

      <h2>All Recipes</h2>
      {isLoading && <p>Loading recipes...</p>}
      {error && <p className="text-danger">Error fetching recipes: {error.message}</p>}
      {!isLoading && !error && (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <Col key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </Col>
            ))
          ) : (
            <p>No recipes found matching your search criteria.</p>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Home;