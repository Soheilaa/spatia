import React, { useEffect, useRef } from 'react';
import * as tt from '@tomtom-international/web-sdk-maps';

type MapProps = {
  lat?: number;
  lon?: number;
  opacity?: string;
  isStatic?: boolean;
};

const Map = ({ lat = 52.372, lon = 4.899, opacity = '50%',  isStatic = false }: MapProps) => {
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
      dragRotate: !isStatic
    });

    if (!isStatic) {
      new tt.Marker().setLngLat([lon, lat]).addTo(map);
    }
  
    map.addControl(new tt.NavigationControl());
  
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
