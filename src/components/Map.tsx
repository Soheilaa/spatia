import React, { useEffect, useRef } from "react";
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
  const TOMTOM_API_KEY = "c29dCbhTSr7TEmewAB46g3cBgppCWWHY";

  useEffect(() => {
    if (!mapRef.current) return;

    const map = tt.map({
      key: TOMTOM_API_KEY,
      container: mapRef.current,
      center: [lon, lat],
      zoom: 15.5,
      dragPan: !isStatic,
      scrollZoom: !isStatic,
      doubleClickZoom: !isStatic,
      dragRotate: !isStatic,
    });

    new tt.Marker().setLngLat([lon, lat]).addTo(map);

    const fetchTomTomParking = async () => {
      try {
        const res = await axios.get(
          `https://api.tomtom.com/search/2/poiSearch/parking.json?key=${TOMTOM_API_KEY}&lat=${lat}&lon=${lon}&radius=500`
        );

        res.data.results.forEach((spot: any) => {
          const { position, poi } = spot;
          const name = poi.name || "Parking";
          const isFree =
            name.toLowerCase().includes("free") ||
            name.toLowerCase().includes("gratis");

          const popupHtml = `
          <strong>${name}</strong><br/>
          🟡 Parking
          `;

          new tt.Marker({ color: "yellow" })
            .setLngLat([position.lon, position.lat])
            .setPopup(new tt.Popup().setHTML(popupHtml))
            .addTo(map);
        });
      } catch (error) {
        console.error("Error fetching TomTom parking spots:", error);
      }
    };

    const fetchGoteborgPrivateParking = async () => {
      try {
        const goteborgUrl = `https://data.goteborg.se/ParkingService/v2.3/PrivateTollParkings/887ee9f1-5211-42dd-98f9-2c6e2cb96b04?latitude=${lat}&longitude=${lon}&radius=500&format=Json`;

        const res = await axios.get(goteborgUrl);
        console.log("got", res);
        res.data.forEach((spot: any) => {
          const { Name, WKT, ParkingCost } = spot;
          const [lonStr, latStr] = WKT.replace("POINT (", "")
            .replace(")", "")
            .split(" ");
          const lat = parseFloat(latStr);
          const lon = parseFloat(lonStr);

          const parkingPricePerHour = ParkingCost.match(/\b\d+\s*kr\/tim\b/);
          const time = ParkingCost.match(/\b\d{1,2}-\d{1,2}\b/);

          const markerElement = document.createElement("div");
          markerElement.style.width = "34px";
          markerElement.style.height = "36px";
          markerElement.style.backgroundColor = "rgb(156, 23, 23)";
          markerElement.style.borderRadius = "50%";
          markerElement.style.border = "2px solid  rgb(139, 0, 0)";
          markerElement.style.boxShadow = "0 0 4px rgba(0,0,0,0.3)";
          markerElement.style.display = "flex";
          markerElement.style.flexDirection = "column";
          markerElement.style.alignItems = "center";
          markerElement.style.justifyContent = "center";
          markerElement.style.color = "white";
          markerElement.style.fontSize = "10px";
          markerElement.style.fontWeight = "bold";
          markerElement.style.textAlign = "center";
          markerElement.style.lineHeight = "1.1";

          markerElement.innerHTML = `${parkingPricePerHour}<br/>${time}`;

          const popupHtml = `
            <strong>${Name}</strong><br/>
            🔴 Private Toll Parking
          `;

          new tt.Marker({ element: markerElement })
            .setLngLat([lon, lat])
            .setPopup(new tt.Popup().setHTML(popupHtml))
            .addTo(map);
        });
      } catch (error) {
        console.error("Error fetching Göteborg parking spots:", error);
      }
    };

    const fetchGoteborgPublicTimeParking = async () => {
      try {
        const goteborgPublicUrl = `https://data.goteborg.se/ParkingService/v2.3/PublicTimeParkings/887ee9f1-5211-42dd-98f9-2c6e2cb96b04?latitude=${lat}&longitude=${lon}&radius=500&format=Json`;

        const res = await axios.get(goteborgPublicUrl);
        console.log("gotPUB", res.data);

        res.data.forEach((spot: any) => {
          const { Name, WKT, MaxParkingTime } = spot;
          console.log("p", MaxParkingTime);

          if (!WKT || !WKT.startsWith("LINESTRING")) return;

          const coordsString = WKT.replace("LINESTRING (", "")
            .replace(")", "")
            .trim();
          const firstPair = coordsString.split(",")[0].trim(); // "11.940234 57.707342"
          const [lonStr, latStr] = firstPair.split(" ");

          const latNum = parseFloat(latStr);
          const lonNum = parseFloat(lonStr);

          if (isNaN(latNum) || isNaN(lonNum)) {
            console.warn("Invalid coordinate:", WKT);
            return;
          }

          const markerElement = document.createElement("div");
          markerElement.style.width = "32px";
          markerElement.style.height = "32px";
          markerElement.style.backgroundColor = "blue";
          markerElement.style.borderRadius = "50%";
          markerElement.style.border = "2px solid white";
          markerElement.style.boxShadow = "0 0 4px rgba(0,0,0,0.3)";
          markerElement.style.display = "flex";
          markerElement.style.flexDirection = "column";
          markerElement.style.alignItems = "center";
          markerElement.style.justifyContent = "center";
          markerElement.style.color = "white";
          markerElement.style.fontSize = "10px";
          markerElement.style.fontWeight = "bold";
          markerElement.style.textAlign = "center";
          markerElement.style.lineHeight = "1.1";

          markerElement.innerHTML = MaxParkingTime.replace(" ", "<br/>");

          const popupHtml = `
          <strong>${Name}</strong><br/>
          🔵 Private Toll Parking
          `;

          new tt.Marker({ element: markerElement })
            .setLngLat([lonNum, latNum])
            .setPopup(new tt.Popup().setHTML(popupHtml))
            .addTo(map);
        });
      } catch (error) {
        console.error("Error fetching Göteborg parking spots:", error);
      }
    };

    const fetchGoteborgPublicTollParking = async () => {
      try {
        const goteborgPublicUrl = `https://data.goteborg.se/ParkingService/v2.3/PublicTollParkings/887ee9f1-5211-42dd-98f9-2c6e2cb96b04?latitude=${lat}&longitude=${lon}&radius=500&format=Json`;

        const res = await axios.get(goteborgPublicUrl);
        console.log("gotPUBToll", res.data);

        res.data.forEach((spot: any) => {
          const { Name, WKT, ParkingCost } = spot;

          const parkingPricePerHour = ParkingCost.match(/\b\d+\s*kr\/tim\b/);
          const time = ParkingCost.match(/\b\d{1,2}-\d{1,2}\b/);

          if (!WKT || !WKT.startsWith("LINESTRING")) return;

          const coordsString = WKT.replace("LINESTRING (", "")
            .replace(")", "")
            .trim();
          const firstPair = coordsString.split(",")[0].trim(); // "11.940234 57.707342"
          const [lonStr, latStr] = firstPair.split(" ");

          const latNum = parseFloat(latStr);
          const lonNum = parseFloat(lonStr);

          if (isNaN(latNum) || isNaN(lonNum)) {
            console.warn("Invalid coordinate:", WKT);
            return;
          }

          const markerElement = document.createElement("div");
          markerElement.style.width = "34px";
          markerElement.style.height = "36px";
          markerElement.style.backgroundColor = "rgb(156, 23, 23)";
          markerElement.style.borderRadius = "50%";
          markerElement.style.border = "2px solid  rgb(139, 0, 0)";
          markerElement.style.boxShadow = "0 0 4px rgba(0,0,0,0.3)";
          markerElement.style.display = "flex";
          markerElement.style.flexDirection = "column";
          markerElement.style.alignItems = "center";
          markerElement.style.justifyContent = "center";
          markerElement.style.color = "white";
          markerElement.style.fontSize = "10px";
          markerElement.style.fontWeight = "bold";
          markerElement.style.textAlign = "center";
          markerElement.style.lineHeight = "1.1";

          markerElement.innerHTML = `${parkingPricePerHour}<br/>${time}`;

          const popupHtml = `
          <strong>${Name}</strong><br/>
         🟢  Public Toll Parking
          `;

          new tt.Marker({ element: markerElement })
            .setLngLat([lonNum, latNum])
            .setPopup(new tt.Popup().setHTML(popupHtml))
            .addTo(map);
        });
      } catch (error) {
        console.error("Error fetching Göteborg parking spots:", error);
      }
    };

    fetchTomTomParking();
    fetchGoteborgPrivateParking();
    fetchGoteborgPublicTimeParking();
    fetchGoteborgPublicTollParking();

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
