import Map from './components/Map';
import SearchBar from './components/SearchBar';
import LastSearchButton from './components/LastSearchButton';
import FavoriteButton from './components/FavoriteButton';
import MenuIcon from './components/MenuIcon';

import './App.css';

function App() {
  return (
    <>
      <MenuIcon />

      <div className="actions-wrapper">
        <SearchBar />
        <LastSearchButton />
        <FavoriteButton />
      </div>

      <Map />
    </>

  );
}

export default App;
