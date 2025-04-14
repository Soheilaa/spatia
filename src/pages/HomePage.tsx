import MenuIcon from '../components/MenuIcon';
import SearchBar from '../components/SearchBar';
import LastSearchButton from '../components/LastSearchButton';
import FavoriteButton from '../components/FavoriteButton';
import Map from '../components/Map';
import './HomePage.css';

const HomePage = () => {
  return (
    <>
      <MenuIcon />
      <div className="actions-wrapper">
        <SearchBar />
        <LastSearchButton />
        <FavoriteButton />
      </div>
      <Map opacity="50%" isStatic={true}/>
    </>
  );
};

export default HomePage;
