import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const ShopItemCard = ({ item, onAddToCart, onShowItemDetail }) => {
  return (
    <Card className="alchemy-card" style={{ width: "18rem" }}>
      <Card.Img variant="top" src={item.image} />
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>{item.description}</Card.Text>
        <Card.Text>${item.price}</Card.Text>
        <Button variant="info" onClick={() => onShowItemDetail(item)}>
          Show Detail
        </Button>
        <Button variant="warning" onClick={() => onAddToCart(item)}>
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ShopItemCard;
