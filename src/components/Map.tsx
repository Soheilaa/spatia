import React, { useEffect, useRef, useState } from "react";
import * as tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import axios from "axios";

type MapProps = {
  lat: number;
  lon: number;
  opacity?: string;
  isStatic?: boolean;
};

function Map({ lat, lon, opacity, isStatic }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const API_KEY = "c29dCbhTSr7TEmewAB46g3cBgppCWWHY";

  // Initialize TomTom map once location is available
  useEffect(() => {
    if (!mapRef.current) return;

    // const { lat, lon } = location;

    const map = tt.map({
      key: API_KEY,
      container: mapRef.current,
      center: [lon, lat],
      zoom: 15,
      dragPan: !isStatic,
      scrollZoom: !isStatic,
      doubleClickZoom: !isStatic,
      dragRotate: !isStatic,
    });

    // Add user's location marker
    new tt.Marker().setLngLat([lon, lat]).addTo(map);

    // Fetch nearby parking spots
    const fetchParkingSpots = async () => {
      try {
        const res = await axios.get(
          `https://api.tomtom.com/search/2/poiSearch/parking.json?key=${API_KEY}&lat=${lat}&lon=${lon}&radius=5000`
        );

        console.log(res.data);

        res.data.results.forEach((spot: any) => {
          const { position, poi } = spot;
          const name = poi.name || "Parking";

          const isFree =
            name.toLowerCase().includes("free") ||
            name.toLowerCase().includes("gratis");

          const popupHtml = `
            <strong>${name}</strong><br/>
            ${isFree ? "🟢 Free Parking" : "🔵 Paid Parking"}
          `;

          new tt.Marker({ color: isFree ? "green" : "blue" })
            .setLngLat([position.lon, position.lat])
            .setPopup(new tt.Popup().setHTML(popupHtml))
            .addTo(map);
        });
      } catch (error) {
        console.error("Error fetching parking spots:", error);
      }
    };

    fetchParkingSpots();

    map.addControl(new tt.NavigationControl());

    return () => map.remove();
  }, [lat, lon]);

  return (
    <div>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "90vh", position: "relative" }}
      />
    </div>
  );
}

export default Map;
