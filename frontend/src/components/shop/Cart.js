import React from "react";
import CartItem from "./CartItem";
import { Button, Container, Row, Col } from "react-bootstrap";

const Cart = ({ user, onLoginClick, onSignupClick, cartItems, onRemoveFromCart, onQuantityChange, onCheckout }) => {
  // calculate the total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Container id="cart" fluid >
      <Row>
        <Col xs={12} md={6} >
          <h2>Your Alchemy Cart</h2>
          {cartItems.map((item, index) => (
            <CartItem key={index} item={item} onRemoveFromCart={onRemoveFromCart} onQuantityChange={onQuantityChange} />
          ))}
          <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
          {user ? (
        <Button variant="success" onClick={onCheckout}>
          Checkout
        </Button>
      ) : (
        <>
          <Button variant="primary" onClick={onLoginClick}>
            Sign In to Checkout
          </Button>
          <Button variant="secondary" onClick={onSignupClick}>
            Create Account to Checkout
          </Button>
        </>
      )}
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;