import React from 'react';
import { DropdownButton, DropdownItem } from 'react-bootstrap';

const Filter = ({ filter, recipes, handleFilterChange }) => {
  return (
    <DropdownButton variant="outline-primary" title="Filter">
      <DropdownItem onClick={() => handleFilterChange('all')}>All</DropdownItem>
      {recipes.map((recipe) => (
        <DropdownItem key={recipe.category} onClick={() => handleFilterChange(recipe.category)}>
          {recipe.category}
        </DropdownItem>
      ))}
    </DropdownButton>
  );
};

export default Filter;