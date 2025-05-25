import { useParams, useNavigate } from "react-router-dom";
import Map from "../components/Map";
import "./LocationPage.css";

const LocationPage = () => {
  const { lat, lon } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="location-page-container">
      <button className="back-button" onClick={handleBack}>
        <span className="material-icons">arrow_back</span>
        Back
      </button>

      <Map
        lat={Number(lat)}
        lon={Number(lon)}
        opacity="1"
        isStatic={false}
        showMarker={true}
        showParking={true}
        showControls={true}
      />
    </div>
  );
};

export default LocationPage;
