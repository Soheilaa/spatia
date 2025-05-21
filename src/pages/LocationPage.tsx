import { useParams } from "react-router-dom";
import Map from "../components/Map";
<link
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
  rel="stylesheet"
/>;

const LocationPage = () => {
  const { lat, lon } = useParams();

  return <Map lat={Number(lat)} lon={Number(lon)} opacity="100%" />;
};

export default LocationPage;
