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
import { Container, Row, Col } from "react-bootstrap";
import recipesJson from "./data/recipes.json";
import reviewsJson from "./data/reviews.json";
import shopItemsJson from "./data/shopItems.json";

const API_ENDPOINT = "http://127.0.0.1:8000";

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [recipes, setRecipes] = useState(recipesJson);
  const [shopItems, setShopItems] = useState(shopItemsJson);
  const [reviews, setReviews] = useState(reviewsJson);
  const [cartItems, setCartItems] = useState([]);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
  
    if (existingItem) {
      setCartItems((prevItems) =>
        prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity:
                  cartItem.quantity < cartItem.maxQuantity
                    ? cartItem.quantity + 1
                    : cartItem.quantity,
              }
            : cartItem
        )
      );
    } else {
      setCartItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
    }
  
    console.log("Added to cart:", item);
  };

  const onQuantityChange = (item, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: parseInt(quantity) } : cartItem
      )
    );
  }

  const removeFromCart = (itemToRemove) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemToRemove.id)
    );
  };

  const onCheckout = () => {
    alert("Thank you for your purchase!");
    console.log("Checkout:", cartItems);
    setCartItems([]);
  };

  const handleLogoutClick = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignUp(false);
    console.log("Login button clicked");
  };

  const handleSignupClick = () => {
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
        api={API_ENDPOINT}
        show={showSignUp}
        onShowLogin={handleLoginClick}
        handleClose={handleClose}
        setUser={setUser}
      />
      <Login
        api={API_ENDPOINT}
        show={showLogin}
        onShowSignUp={handleSignupClick}
        handleClose={handleClose}
        setUser={setUser}
      />
      <Contact user={user} show={showContact} handleClose={handleClose} />
      <Container fluid>
        <Row>
          <Col xs={12} md={11} lg={10}>
            <Hero />
            <Recipe api={API_ENDPOINT} user={user} recipes={recipes} setRecipes={setRecipes} reviews={reviews} setReviews={setReviews} shopItems={shopItems} onShowLogin={handleLoginClick} onAddToCart={addToCart} />
            <Shop api={API_ENDPOINT} shopItems={shopItems} setShopItems={setShopItems} onAddToCart={addToCart} />
            <About />
          </Col>
          {cartItems.length > 0 && (
            <Col xs={12} md={1} lg={2}>
              <Cart api={API_ENDPOINT} user={user} cartItems={cartItems} onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} onRemoveFromCart={removeFromCart} onQuantityChange={onQuantityChange} onCheckout={onCheckout} />
            </Col>
          )}
        </Row>
      </Container>
      <Footer onContactClick={handleContactClick} />
    </div>
  );
}