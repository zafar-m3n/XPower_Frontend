import React, { useRef, useState } from "react";
import IconComponent from "@/components/ui/Icon";
import API from "@/services/index";

const UserSearchBar = ({ searchTerm, setSearchTerm, onSearch }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);
  const debounceRef = useRef(null);

  const fetchSuggestions = async (q) => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await API.private.fetchAllUsers({ page: 1, limit: 5, q });
      if (res.data.code === "OK") {
        const list = res.data.data?.data || [];
        setSuggestions(list);
      }
    } catch {
      setSuggestions([]);
    }
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setSearchTerm(v);
    setShow(true);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(v), 300);
  };

  const handleSelect = (user) => {
    setSearchTerm(user.full_name);
    setShow(false);
    onSearch(user.full_name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShow(false);
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 150)}
        placeholder="Search by name or email"
        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-accent"
      />
      <IconComponent
        icon="mdi:magnify"
        width={20}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      />

      {show && suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-accent rounded-md shadow mt-1">
          {suggestions.map((u) => (
            <div
              key={u.id}
              onClick={() => handleSelect(u)}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-accent/10 border-b border-gray-100"
            >
              <div className="font-medium">{u.full_name}</div>
              <div className="text-xs text-gray-500">{u.email}</div>
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export default UserSearchBar;
