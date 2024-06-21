import { useState } from "react";
import Header from "./components/Header";
import SignUp from "./components/account/SignUp";
import Login from "./components/account/Login";
import Contact from "./components/Contact";
import Hero from "./components/Hero";
import Recipe from "./components/recipe/Recipe";
import Shop from "./components/shop/Shop";
import Cart from "./components/shop/Cart";
import About from "./components/About";
import Footer from "./components/Footer";
import "./styles.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
    console.log("Added to cart:", item);
  };

  const removeFromCart = (itemToRemove) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemToRemove.id)
    );
  };

  const handleLogoutClick = () => {
    // Clear the user state
    setUser(null);
    // Perform other logout actions as needed
  };

  const handleLoginClick = () => {
    // Logic to handle login
    setShowLogin(true);
    setShowSignUp(false);
    console.log("Login button clicked");
  };

  const handleSignupClick = () => {
    // Logic to handle signup
    setShowSignUp(true);
    setShowLogin(false);
    console.log("Signup button clicked");
  };

  const handleContactClick = () => {
    setShowContact(true);
  };

  const handleClose = () => {
    setShowSignUp(false);
    setShowLogin(false);
    setShowContact(false);
  };

  return (
    <div className="App">
      <Header
        user={user}
        onLogoutClick={handleLogoutClick}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onContactClick={handleContactClick}
      />
      <SignUp
        show={showSignUp}
        onShowLogin={handleLoginClick}
        handleClose={handleClose}
        setUser={setUser}
      />
      <Login
        show={showLogin}
        onShowSignUp={handleSignupClick}
        handleClose={handleClose}
        setUser={setUser}
      />
      <Contact show={showContact} handleClose={handleClose} />
      <Hero />
      <Recipe onShowLogin={handleLoginClick} onAddToCart={addToCart} />
      <Shop onAddToCart={addToCart} />
      <Cart cartItems={cartItems} onRemoveFromCart={removeFromCart} />
      <About />
      <Footer onContactClick={handleContactClick} />
    </div>
  );
}
