import React, { useState } from "react"; // Ensure useState is imported
import ShopItemCard from "./ShopItemCard";
import ItemInfo from "./ItemInfo";
import { Container, Row, Col, Button } from "react-bootstrap";

const Shop = ({ shopItems = [], onAddToCart }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(shopItems.length / itemsPerPage);

  const currentItems = Array.isArray(shopItems)
    ? shopItems.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    : [];

  const paginate = (direction) => {
    setCurrentPage((prevPage) => {
      let nextPage = prevPage + direction;
      if (nextPage < 0) nextPage = totalPages - 1;
      if (nextPage >= totalPages) nextPage = 0;
      return nextPage;
    });
  };

  const showDetails = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  return (
    <Container id="shop">
      <h2 className="text-center my-4">Alchemy Shop</h2>
      <Row>
        {currentItems.map((item, index) => (
          <Col
            xs={12}
            md={6}
            lg={4}
            className="mb-3 d-flex justify-content-center"
            key={index}
          >
            <ShopItemCard
              item={item}
              onShowDetails={showDetails}
              onAddToCart={onAddToCart}
            />
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
      {selectedItem && showDetailsModal && (
        <ItemInfo
          item={selectedItem}
          show={showDetailsModal}
          onHide={() => {
            setSelectedItem(null);
            setShowDetailsModal(false);
          }}
          onAddToCart={onAddToCart}
        />
      )}
    </Container>
  );
};

export default Shop;
