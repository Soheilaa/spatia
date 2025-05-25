import React, { useEffect, useRef, useState } from "react";
import * as tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import axios from "axios";

type MapProps = {
  lat: number;
  lon: number;
  opacity?: string;
  isStatic?: boolean;
  showMarker?: boolean;
  showParking?: boolean;
  showControls?: boolean;
};

function Map({
  lat,
  lon,
  opacity,
  isStatic,
  showMarker = true,
  showParking = true,
  showControls = true,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState({ lat, lon });
  const [selectedInfo, setSelectedInfo] = useState<any>(null);
  const TOMTOM_API_KEY = "c29dCbhTSr7TEmewAB46g3cBgppCWWHY";

  function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const toRad = (deg: number) => deg * (Math.PI / 180);
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

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

    map.on("moveend", () => {
      const c = map.getCenter();
      setCenter({ lat: c.lat, lon: c.lng });
    });

    if (showMarker) {
      const el = document.createElement("div");
      el.style.cssText = `
        width: 20px;
        height: 20px;
        background: #007aff;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 0 2px rgba(0,122,255,0.3);
      `;
      new tt.Marker({ element: el }).setLngLat([lon, lat]).addTo(map);
    }

    if (showParking) {
      loadParking(center.lat, center.lon);
    }

    if (showControls) {
      map.addControl(new tt.NavigationControl());
    }

    return () => map.remove();

    function loadParking(lat: number, lon: number) {
      fetchGoteborgPrivateParking(lat, lon);
      fetchGoteborgPublicTimeParking(lat, lon);
      fetchGoteborgPublicTollParking(lat, lon);
    }

    async function fetchGoteborgPrivateParking(lat: number, lon: number) {
      try {
        const res = await axios.get(
          `https://data.goteborg.se/ParkingService/v2.3/PrivateTollParkings/887ee9f1-5211-42dd-98f9-2c6e2cb96b04?latitude=${lat}&longitude=${lon}&radius=500&format=Json`
        );
        res.data.forEach((spot: any) => {
          const [lonStr, latStr] = spot.WKT.replace("POINT (", "").replace(")", "").split(" ");
          const latNum = parseFloat(latStr);
          const lonNum = parseFloat(lonStr);
          const dist = haversineDistance(center.lat, center.lon, latNum, lonNum);
          const el = createStyledMarker("#b22222", "#8b0000", spot.ParkingCost?.match(/\d+\skr\/tim/), spot.ParkingCost?.match(/\d{1,2}-\d{1,2}/));
          const marker = new tt.Marker({ element: el })
            .setLngLat([lonNum, latNum])
            .setPopup(new tt.Popup().setHTML(`<strong>${spot.Name}</strong><br/>🔴 Private Paid Parking`))
            .addTo(map);

          el.style.cursor = "pointer";
          el.addEventListener("click", () => {
            setSelectedInfo({
              name: spot.Name,
              type: "Private Paid",
              cost: spot.ParkingCost,
              time: spot.MaxParkingTime,
              info: spot.FreeText,
              distance: dist,
              source: "Goteborg",
            });
          });
        });
      } catch (error) {
        console.error("Private parking error:", error);
      }
    }

    async function fetchGoteborgPublicTimeParking(lat: number, lon: number) {
      try {
        const res = await axios.get(
          `https://data.goteborg.se/ParkingService/v2.3/PublicTimeParkings/887ee9f1-5211-42dd-98f9-2c6e2cb96b04?latitude=${lat}&longitude=${lon}&radius=500&format=Json`
        );
        res.data.forEach((spot: any) => {
          if (!spot.WKT.startsWith("LINESTRING")) return;
          const first = spot.WKT.replace("LINESTRING (", "").replace(")", "").split(",")[0].trim();
          const [lonStr, latStr] = first.split(" ");
          const latNum = parseFloat(latStr);
          const lonNum = parseFloat(lonStr);
          const dist = haversineDistance(center.lat, center.lon, latNum, lonNum);
          const el = createStyledMarker("#4CAF50", "#2e7d32", "Free", spot.MaxParkingTime);
          const marker = new tt.Marker({ element: el })
            .setLngLat([lonNum, latNum])
            .setPopup(new tt.Popup().setHTML(`<strong>${spot.Name}</strong><br/>🟢 Free Parking`))
            .addTo(map);

          el.style.cursor = "pointer";
          el.addEventListener("click", () => {
            setSelectedInfo({
              name: spot.Name,
              type: "Free Public",
              time: spot.MaxParkingTime,
              info: spot.FreeText,
              distance: dist,
              source: "Goteborg",
            });
          });
        });
      } catch (error) {
        console.error("Free public parking error:", error);
      }
    }

    async function fetchGoteborgPublicTollParking(lat: number, lon: number) {
      try {
        const res = await axios.get(
          `https://data.goteborg.se/ParkingService/v2.3/PublicTollParkings/887ee9f1-5211-42dd-98f9-2c6e2cb96b04?latitude=${lat}&longitude=${lon}&radius=500&format=Json`
        );
        res.data.forEach((spot: any) => {
          if (!spot.WKT.startsWith("LINESTRING")) return;
          const first = spot.WKT.replace("LINESTRING (", "").replace(")", "").split(",")[0].trim();
          const [lonStr, latStr] = first.split(" ");
          const latNum = parseFloat(latStr);
          const lonNum = parseFloat(lonStr);
          const dist = haversineDistance(center.lat, center.lon, latNum, lonNum);
          const el = createStyledMarker("#228B22", "#0f5f0f", spot.ParkingCost?.match(/\d+\skr\/tim/), spot.ParkingCost?.match(/\d{1,2}-\d{1,2}/));
          const marker = new tt.Marker({ element: el })
            .setLngLat([lonNum, latNum])
            .setPopup(new tt.Popup().setHTML(`<strong>${spot.Name}</strong><br/>🟢 Public Toll Parking`))
            .addTo(map);

          el.style.cursor = "pointer";
          el.addEventListener("click", () => {
            setSelectedInfo({
              name: spot.Name,
              type: "Public Toll",
              cost: spot.ParkingCost,
              time: spot.MaxParkingTime,
              info: spot.FreeText,
              distance: dist,
              source: "Goteborg",
            });
          });
        });
      } catch (error) {
        console.error("Public toll parking error:", error);
      }
    }

    function createStyledMarker(bg: string, border: string, price: string | null, time: string | null) {
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: auto;
      `;

      const head = document.createElement("div");
      head.style.cssText = `
        background: ${bg};
        border: 2px solid ${border};
        color: white;
        font-weight: bold;
        padding: 4px 8px;
        border-radius: 8px;
        font-size: 12px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        text-align: center;
        line-height: 1.3;
      `;
      head.innerHTML = `<div>${price || "?"}</div><div style="font-size: 10px; opacity: 0.85">${time || ""}</div>`;

      const tail = document.createElement("div");
      tail.style.cssText = `
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 10px solid ${bg};
        margin-top: -1px;
      `;

      wrapper.appendChild(head);
      wrapper.appendChild(tail);
      return wrapper;
    }
  }, [lat, lon, isStatic, showMarker, showParking, showControls]);

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
          opacity: opacity || "1",
        }}
      />
      {selectedInfo && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "300px",
            height: "100vh",
            background: "#fff",
            boxShadow: "-2px 0 6px rgba(0,0,0,0.2)",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <h3>{selectedInfo.name}</h3>
          <p><strong>Type:</strong> {selectedInfo.type}</p>
          {selectedInfo.cost && <p><strong>Cost:</strong> {selectedInfo.cost}</p>}
          {selectedInfo.time && <p><strong>Time:</strong> {selectedInfo.time}</p>}
          {selectedInfo.info && <p><strong>Info:</strong> {selectedInfo.info}</p>}
          {selectedInfo.distance && (
            <p><strong>Distance:</strong> {(selectedInfo.distance / 1000).toFixed(2)} km</p>
          )}
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              style={{ padding: "8px 12px" }}
              onClick={() => {
                const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
                const updated = [...stored, selectedInfo];
                localStorage.setItem("favorites", JSON.stringify(updated));
                alert("Added to favorites!");
              }}
            >
              ⭐ Favorite
            </button>
            <button style={{ padding: "8px 12px" }}>📍 Navigate</button>
            <button style={{ padding: "8px 12px" }}>🔗 Share</button>
          </div>
          <button
            onClick={() => setSelectedInfo(null)}
            style={{
              marginTop: "20px",
              background: "#eee",
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default Map;
