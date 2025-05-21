import MenuIcon from "../components/MenuIcon";
import SearchBar from "../components/SearchBar";
import LastSearchButton from "../components/LastSearchButton";
import FavoriteButton from "../components/FavoriteButton";
import Map from "../components/Map";
import UserCurrentLocation from "../components/UserLocation";
import "./HomePage.css";
import { useState } from "react";

const HomePage = () => {
  const currentLocation = UserCurrentLocation();
  


  if (!currentLocation) {
    return <div>Loading your location...</div>;
  }

  return (
    <>
      <MenuIcon />
      <div className="actions-wrapper">
        <SearchBar />
        <LastSearchButton />
        <FavoriteButton />
      </div>
      <Map
        lat={currentLocation.lat}
        lon={currentLocation.lon}
        opacity="50%"
        isStatic={true}
      />
    </>
  );
};

export default HomePage;
