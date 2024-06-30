import React from "react";
import Button from "react-bootstrap/Button";

const CartItem = ({ item, onRemoveFromCart, onQuantityChange }) => {
  const handleIncrement = () => {
    if (item.quantity < item.maxQuantity) {
      onQuantityChange(item, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onQuantityChange(item, item.quantity - 1);
    }
  };

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} />
      <div>
        <h4>{item.name}</h4>
        <div className="form-group">
          <input type="button" value="-" onClick={handleDecrement} disabled={item.quantity <= 1} />
          <input
            type="number"
            min="1"
            max={item.maxQuantity}
            value={item.quantity}
            onChange={(e) => {
              if (e.target.value <= e.target.min) { 
                e.target.value = e.target.min;
              } else if (e.target.value >= e.target.max) { 
                e.target.value = e.target.max;
              }

              onQuantityChange(item, e.target.value);
            }}
          />
          <input type="button" value="+" onClick={handleIncrement} disabled={item.quantity >= item.maxQuantity} />
          </div>
      </div>
      <Button variant="danger" onClick={() => onRemoveFromCart(item)}>
        Remove
      </Button>
    </div>
  );
};

export default CartItem;
