import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    if (!keyword.trim()) return;
    onSearch(keyword.trim());
    setKeyword('');
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Enter keyword (e.g. climate)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="p-2 border rounded w-full"
      />
      <button
        onClick={handleSearch}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
