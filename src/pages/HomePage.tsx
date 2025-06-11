import { useNavigate } from "react-router-dom";
import MenuIcon from "../components/MenuIcon";
import SearchBar from "../components/SearchBar";
import LastSearchButton from "../components/LastSearchButton";
import FavoriteButton from "../components/FavoriteButton";
import Map from "../components/Map";
import "./HomePage.css";

type HomePageProps = {
  lat: number;
  lon: number;
};

const HomePage = ({ lat, lon }: HomePageProps) => {
  const navigate = useNavigate();

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        localStorage.setItem("lastSearch", JSON.stringify({
          lat: latitude,
          lon: longitude,
        }));
        navigate(`/location/${latitude}/${longitude}`);
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Could not retrieve location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
    
  };

  return (
    <div className="homepage-container">
      <Map
        lat={lat}
        lon={lon}
        opacity="0.5"
        isStatic={true}
        showMarker={false}
        showParking={false}
        showControls={false}
      />

      <MenuIcon />

      <div className="actions-wrapper">
        <SearchBar />
        <LastSearchButton />
        <FavoriteButton />
        <button className="search-style-button" onClick={handleUseMyLocation}>
          <span className="material-icons">my_location</span>
          Use My Location
        </button>
      </div>
    </div>
  );
};

export default HomePage;
