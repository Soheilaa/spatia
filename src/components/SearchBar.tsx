// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const SearchBar = () => {
//   const [input, setInput] = useState(() => {
//     return localStorage.getItem('searchInput') || '';
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     localStorage.setItem('searchInput', input);
//   }, [input]);

//   const handleSearch = async () => {
//     if (!input) return;

//     try {
//       const res = await axios.get(
//         `https://api.tomtom.com/search/2/geocode/${input}.json?key=c29dCbhTSr7TEmewAB46g3cBgppCWWHY`
//       );
//       const position = res.data.results[0].position;
//       navigate(`/location/${position.lat}/${position.lon}`);
//     } catch (error) {
//       alert('Location not found');
//     }
//   };

//   return (
//     <div className="search-bar glass">
//       <span className="material-icons" onClick={handleSearch}>search</span>
//       <input
//         type="text"
//         placeholder="Search Location..."
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//       />
//     </div>
//   );
// };

// export default SearchBar;
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = "c29dCbhTSr7TEmewAB46g3cBgppCWWHY";

  const navigate = useNavigate();

  // Debounced search function
  const fetchResults = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.tomtom.com/search/2/search/${encodeURIComponent(
            searchQuery
          )}.json?key=${API_KEY}`
        );
        console.log(response);
        setResults(response.data.results || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 900),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    fetchResults(searchQuery); // Trigger the debounced function
  };

  return (
    <div>
      <div className="search-bar">
      <span className="material-icons">search</span>
      <input
        type="text"
        placeholder="Search destination..."
        value={query}
        onChange={handleSearch}
      />
      </div>
      {loading && <p>Loading...</p>}
      <ul className="search-results">
        {results.map((result, index) => (
          <li key={index}>
            <button
              onClick={() => navigate(`/location/${result.position.lat}/${result.position.lon}`)}
            >
              {result.address.freeformAddress}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
