import React, { useState, useEffect } from 'react';

const Search = ({ setSearch, recipes, setRecipes, shopItems, setShopItems }) => {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (searchText === '') {
      setSearch(false);
      return;
    }

    setSearch(true);

    const lowerCaseSearchText = searchText.toLowerCase();

    const filteredRecipes = recipes.filter(recipe => {
      return (
        recipe.name.toLowerCase().includes(lowerCaseSearchText) ||
        recipe.description.toLowerCase().includes(lowerCaseSearchText) ||
        recipe.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(lowerCaseSearchText)
        ) ||
        recipe.instructions.some(instruction =>
          instruction.toLowerCase().includes(lowerCaseSearchText)
        )
      );
    });

    const filteredShopItems = shopItems.filter(item => {
      return (
        item.name.toLowerCase().includes(lowerCaseSearchText) ||
        item.description.toLowerCase().includes(lowerCaseSearchText)
      );
    });

    setRecipes(filteredRecipes);
    setShopItems(filteredShopItems);
  }, [searchText, recipes, setRecipes, shopItems, setShopItems]);

  return (
    <input
      type="text"
      placeholder="Search..."
      value={searchText}
      onChange={e => setSearchText(e.target.value)}
    />
  );
};

export default Search;