import React, { useState } from "react";
import ShopItemCard from "./ShopItemCard";
import ItemInfo from "./ItemInfo"; // This component needs to be created
import { Container, Row, Col, Button } from "react-bootstrap";
import shopItems from "./shopItems.json"; // assuming the shopItems.json file is in the same directory

const Shop = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsPerPage = 6;

  // calculate the total number of pages
  const totalPages = Math.ceil(shopItems.length / itemsPerPage);

  // get current items
  const currentItems = shopItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // change page
  const paginate = (direction) => {
    setCurrentPage((prevPage) => {
      let nextPage = prevPage + direction;
      if (nextPage < 0) nextPage = totalPages - 1; // loop back to last page
      if (nextPage >= totalPages) nextPage = 0; // loop back to first page
      return nextPage;
    });
  };

  // handle add to cart
  const addToCart = (item) => {
    setSelectedItem(item);
    // Here you would normally handle adding the item to the cart
  };

  return (
    <Container id="shop">
      <h2 className="text-center my-4">Alchemy Shop</h2>
      <Row>
        {currentItems.map((item, index) => (
          <Col md={4} key={index}>
            <ShopItemCard item={item} onAddToCart={addToCart} />
          </Col>
        ))}
      </Row>
      <Row className="justify-content-center my-4">
        <Col md={2} className="text-center">
          <Button onClick={() => paginate(-1)}>Previous</Button>
        </Col>
        <Col md={2} className="text-center">
          <Button onClick={() => paginate(1)}>Next</Button>
        </Col>
      </Row>
      {selectedItem && (
        <ItemInfo item={selectedItem} onHide={onShowItemDetail} />
      )}
    </Container>
  );
};

export default Shop;
