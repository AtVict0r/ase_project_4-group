import React from 'react';
import { Jumbotron, Container } from 'react-bootstrap';
import RecipeCard from './components/RecipeCard';

function Home({ recipes }) {
  return (
    <div>
      <Jumbotron fluid>
        <Container>
          <h1>Welcome to Alchemic Recipes!</h1>
          <p>
            Discover the magic of alchemy with our collection of unique and exciting recipes.
          </p>
        </Container>
      </Jumbotron>

      <h2>Featured Recipes</h2>
      <div className="d-flex flex-wrap justify-content-around">
        {recipes.map((recipe, index) => (
          <RecipeCard key={index} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default Home;