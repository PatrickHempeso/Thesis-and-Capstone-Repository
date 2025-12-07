import React, { useState } from 'react';

function SearchFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    searchTerm: '',
    program: 'All Programs'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="search-filter">
      <input 
        type="text" 
        placeholder="Search projects..." 
        className="searchbar"
        value={filters.searchTerm}
        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
      />
      <select 
        className="filter-dropdown"
        value={filters.program}
        onChange={(e) => handleFilterChange('program', e.target.value)}
      >
        <option>All Programs</option>
        <option>BSIT-IS</option>
        <option>BSIT-BTM</option>
        <option>BSCS</option>
        <option>DIT</option>
        <option>MIT</option>
      </select>
      <select className="sort-dropdown">
        <option>Sort by: Newest</option>
        <option>Sort by: Oldest</option>
      </select>
    </div>
  );
}

export default SearchFilter;