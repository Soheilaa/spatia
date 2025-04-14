import React, { useEffect, useRef } from 'react';
import * as tt from '@tomtom-international/web-sdk-maps';
import axios from 'axios';

type MapProps = {
  lat?: number;
  lon?: number;
  opacity?: string;
  isStatic?: boolean;
};

const Map = ({
  lat = 52.372,
  lon = 4.899,
  opacity = '50%',
  isStatic = false,
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const map = tt.map({
      key: 'c29dCbhTSr7TEmewAB46g3cBgppCWWHY',
      container: mapRef.current!,
      center: [lon, lat],
      zoom: 13,
      dragPan: !isStatic,
      scrollZoom: !isStatic,
      doubleClickZoom: !isStatic,
      dragRotate: !isStatic,
    });

    if (!isStatic) {
      new tt.Marker().setLngLat([lon, lat]).addTo(map);

      // Fetch & Show Parking Spots
      const fetchParkingSpots = async () => {
        try {
          const res = await axios.get(
            `https://api.tomtom.com/search/2/poiSearch/parking.json?key=c29dCbhTSr7TEmewAB46g3cBgppCWWHY&lat=${lat}&lon=${lon}&radius=5000`
          );

          res.data.results.forEach((spot: any) => {
            const { position, poi } = spot;
            const name = poi.name || 'Parking';

            // Basic check for free parking
            const isFree = name.toLowerCase().includes('free') || name.toLowerCase().includes('gratis');

            const popupHtml = `
              <strong>${name}</strong><br/>
              ${isFree ? '🟢 Free Parking' : '🔵 Paid Parking'}
            `;

            new tt.Marker({ color: isFree ? 'green' : 'blue' })
              .setLngLat([position.lon, position.lat])
              .setPopup(new tt.Popup().setHTML(popupHtml))
              .addTo(map);
          });
        } catch (error) {
          console.error('Error fetching parking spots:', error);
        }
      };

      fetchParkingSpots();
      map.addControl(new tt.NavigationControl());
    }

    return () => map.remove();
  }, [lat, lon, isStatic]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100vh', opacity: opacity }}
    ></div>
  );
};

export default Map;
