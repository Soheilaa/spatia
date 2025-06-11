import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LastSearchButton.css";

const LastSearchButton = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const lastSearches = JSON.parse(localStorage.getItem("lastSearches") || "[]");

  const handleSelect = (lat: number, lon: number) => {
    setShowDropdown(false); // hide dropdown
    navigate(`/location/${lat}/${lon}`); // go to map page
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button
        className="search-style-button glass"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        <span className="material-icons">history</span>
        Last Search Result
      </button>

      {showDropdown && (
        <div className="dropdown-menu">
          {lastSearches.length === 0 ? (
            <p className="empty-message">No previous searches</p>
          ) : (
            lastSearches.map((item: any, index: number) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => handleSelect(item.lat, item.lon)}
              >
                {item.address}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LastSearchButton;
