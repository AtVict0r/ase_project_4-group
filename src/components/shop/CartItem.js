import React from "react";
import Button from "react-bootstrap/Button";

const CartItem = ({ item, onRemoveFromCart }) => {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} />
      <div>
        <h4>{item.name}</h4>
        <p>{item.description}</p>
      </div>
      <Button variant="danger" onClick={() => onRemoveFromCart(item)}>
        Remove from Cart
      </Button>
    </div>
  );
};

export default CartItem;
