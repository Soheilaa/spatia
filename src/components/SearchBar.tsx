import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchBar = () => {
  const [input, setInput] = useState(() => {
    return localStorage.getItem('searchInput') || '';
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('searchInput', input);
  }, [input]);

  const handleSearch = async () => {
    if (!input) return;

    try {
      const res = await axios.get(
        `https://api.tomtom.com/search/2/geocode/${input}.json?key=c29dCbhTSr7TEmewAB46g3cBgppCWWHY`
      );
      const position = res.data.results[0].position;
      navigate(`/location/${position.lat}/${position.lon}`);
    } catch (error) {
      alert('Location not found');
    }
  };

  return (
    <div className="search-bar glass">
      <span className="material-icons" onClick={handleSearch}>search</span>
      <input
        type="text"
        placeholder="Search Location..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
    </div>
  );
};

export default SearchBar;
