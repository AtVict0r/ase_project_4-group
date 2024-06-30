import React from "react";
import { Button, Modal } from "react-bootstrap";

const ItemInfo = ({ item, show, onHide, onAddToCart }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-alchemical">{item.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="item-info-details">
          <p>{item.description}</p>
          <ul className="list-unstyled">
            <li>
              <span className="material-symbols-outlined">Avaliability:</span>
              {item.in_stock ? `In Stock (${item.maxQuantity})` : "Out of Stock"} 
            </li>
            <li>
              <span className="material-symbols-outlined">Weight:</span>
              {item.weight} kg
            </li>
            {item.rarity && (
              <li>
                <span className="material-symbols-outlined">Rarity:</span>
                {item.rarity}
              </li>
            )}
            {item.effects && (
              <li>
                <span className="material-symbols-outlined">Effects:</span>
                {item.effects.join(", ")}
              </li>
            )}
            {item.uses && (
              <li>
                <span className="material-symbols-outlined">Uses:</span>
                {item.uses} Uses Remaining
              </li>
            )}
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={() => onAddToCart(item)} disabled={!item.in_stock} >
          Add to Cart
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ItemInfo;