import React, { useEffect, useRef, useState } from "react";
import IconComponent from "@/components/ui/Icon";
import API from "@/services/index";

const ProductSearchBar = ({ searchTerm, setSearchTerm, onSearch }) => {
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);

  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      return;
    }

    try {
      const res = await API.private.fetchAllProducts(1, 3, query);
      if (res.data.code === "OK") {
        setSearchSuggestions(res.data.data.products || []);
      }
    } catch {
      setSearchSuggestions([]);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSelect = (product) => {
    setSearchTerm(product.name);
    setShowSuggestions(false);
    onSearch(product.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder="Search by name or code"
        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-accent"
      />
      <IconComponent
        icon="mdi:magnify"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        width={20}
      />
      {showSuggestions && searchSuggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-accent rounded-md shadow mt-1">
          {searchSuggestions.map((product) => (
            <div
              key={product.id}
              onClick={() => handleSelect(product)}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-accent/10 border-b border-gray-100"
            >
              <div className="font-medium">{product.name}</div>
              <div className="text-xs text-gray-500">{product.code}</div>
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export default ProductSearchBar;
