import React, { useState, useEffect, useCallback } from "react";
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
  const [recipes, setRecipes] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showContact, setShowContact] = useState(false);

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
        imageurl: recipe.imageurl || recipesJson[0].imageurl, // Default image fallback
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

  const fetchShopItems = useCallback(async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/shop-items`);
      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();
      console.log("API response data for shop items:", data);
      if (!Array.isArray(data)) throw new Error("API returned non-array data");
      const formattedData = data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));
      setShopItems(formattedData);
    } catch (error) {
      console.error("API call failed:", error);
      setShopItems(shopItemsJson);
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/reviews/all`);
      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();
      console.log("API response data for reviews:", data);
      if (!Array.isArray(data)) throw new Error("API returned non-array data");
      const formattedData = data.map((review) => ({
        id: review.id,
        user: review.user,
        comment: review.comment,
        liked: review.liked,
      }));
      setReviews(formattedData);
    } catch (error) {
      console.error("API call failed:", error);
      setReviews(reviewsJson);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_ENDPOINT}/orders/user_id=${user.id}`);
      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("API call failed:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchRecipes();
    fetchShopItems();
    fetchReviews();
    if (user) {
      fetchOrders();
    }
  }, [user, fetchRecipes, fetchShopItems, fetchReviews, fetchOrders]);

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
      setCartItems((prevItems) => [
        ...prevItems,
        { ...item, quantity: 1, userId: user?.id },
      ]);
    }

    console.log("Added to cart:", item);
  };

  const onQuantityChange = (item, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: parseInt(quantity) }
          : cartItem
      )
    );
  };

  const removeFromCart = (itemToRemove) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemToRemove.id)
    );
  };

  const onCheckout = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItems),
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }
    } catch (error) {
      console.error("API call failed:", error);
    }

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
        recipes={recipes}
        setRecipes={setRecipes}
        shopItems={shopItems}
        setShopItems={setShopItems}
        setSearch={setSearch}
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
            {!search && <Hero />}
            <Recipe
              api={API_ENDPOINT}
              user={user}
              recipes={recipes}
              setRecipes={setRecipes}
              reviews={reviews}
              setReviews={setReviews}
              shopItems={shopItems}
              onShowLogin={handleLoginClick}
              onAddToCart={addToCart}
            />
            <Shop
              api={API_ENDPOINT}
              shopItems={shopItems}
              setShopItems={setShopItems}
              onAddToCart={addToCart}
            />
            {!search && <About />}
          </Col>
          {cartItems.length > 0 && (
            <Col xs={12} md={1} lg={2}>
              <Cart
                api={API_ENDPOINT}
                user={user}
                cartItems={cartItems}
                onLoginClick={handleLoginClick}
                onSignupClick={handleSignupClick}
                onRemoveFromCart={removeFromCart}
                onQuantityChange={onQuantityChange}
                onCheckout={onCheckout}
              />
            </Col>
          )}
        </Row>
      </Container>
      <Footer onContactClick={handleContactClick} />
    </div>
  );
}
