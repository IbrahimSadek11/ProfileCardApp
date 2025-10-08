import { useState, useEffect } from "react";
import "./SearchBar.css";

function SearchBar({ onFilter }) {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      onFilter(searchValue);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchValue, onFilter]);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="search">
      <input
        type="search"
        placeholder="Search profiles..."
        id="search-input"
        name="search"
        value={searchValue}
        onChange={handleChange}
        aria-label="Search profiles"
      />
      <i className="fa-solid fa-magnifying-glass search-icon"></i>
    </div>
  );
}

export default SearchBar;
