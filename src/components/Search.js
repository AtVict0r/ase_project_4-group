import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function Search({ setSearchedRecipes, recipes }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const searchedRecipes = recipes.filter(recipe => recipe.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchedRecipes(searchedRecipes);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="search">
        <Form.Label>Search Recipes</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter search term"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Search
      </Button>
    </Form>
  );
}

export default Search;