import React from "react";
import { Card, Button } from "react-bootstrap";

const ShopItemCard = ({ item, onAddToCart, onShowDetails }) => {
  return (
    <Card className="alchemy-card" style={{ width: "18rem" }}>
      <Card.Img variant="top" src={item.image} />
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>{item.description}</Card.Text>
        <Card.Text>${item.price}</Card.Text>
        <Button variant="info" onClick={() => onShowDetails(item)}>
          Show Detail
        </Button>
        <Button variant="warning" onClick={() => onAddToCart(item)} disabled={!item.in_stock} >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ShopItemCard;
