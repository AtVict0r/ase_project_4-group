import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './components/About';
import Home from './components/Home';
import ThankYou from './components/ThankYou';
import NotFound from './NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import RecipeDetails from './components/RecipeDetails'

function App() {
  return (
    <Router>
      <Header /> {/* Include the Header component */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/recipes/:recipeId" element={<RecipeDetails />} />  {/* Dynamic route for recipe details */}
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="*" element={<NotFound />} />  {/* Catches all other routes */}
      </Routes>
      <Footer /> {/* Include the Footer component */}
    </Router>
  );
}

export default App;