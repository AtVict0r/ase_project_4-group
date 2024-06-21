import React from "react";
import CartItem from "./CartItem";
import Button from "react-bootstrap/Button";

const Cart = ({ cartItems, showCart, onRemoveFromCart }) => {
  // calculate the total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className={`cart ${showCart ? "show" : ""}`}>
      <h2>Your Alchemy Cart</h2>
      {cartItems.map((item, index) => (
        <CartItem key={index} item={item} onRemoveFromCart={onRemoveFromCart} />
      ))}
      <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
      <Button variant="success">Checkout</Button>
    </div>
  );
};

export default Cart;
