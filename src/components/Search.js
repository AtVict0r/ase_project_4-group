import React from 'react';
import { FormControl } from 'react-bootstrap';

const Search = ({ searchTerm, handleSearch }) => {
  return (
    <FormControl
      type="text"
      placeholder="Search Recipes"
      className="mr-sm-2"
      value={searchTerm}
      onChange={handleSearch}
    />
  );
};

export default Search;