import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import About from './components/About';
import Filter from './components/Filter';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './components/Home';
import RecipeDetails from './components/RecipeDetails';
import RecipeForm from './components/RecipeForm';
import Search from './components/Search';
import ThankYou from './components/ThankYou';
import NotFound from './NotFound';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/get_recipes')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error: ' + response.statusText);
        }
      })
      .then(data => {
        setRecipes(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        setError(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact>
          <Home recipes={recipes} />
        </Route>
        <Route path="/about" component={About} />
        <Route path="/filter" component={Filter} />
        <Route path="/recipe/:id" component={RecipeDetails} />
        <Route path="/add-recipe" component={RecipeForm} />
        <Route path="/search" component={Search} />
        <Route path="/thank-you" component={ThankYou} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;