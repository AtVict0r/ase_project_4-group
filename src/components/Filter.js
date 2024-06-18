import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function Filter() {
  const [filter, setFilter] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the filter logic here
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="filter">
        <Form.Label>Filter Recipes</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter filter criteria"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Apply Filter
      </Button>
    </Form>
  );
}

export default Filter;