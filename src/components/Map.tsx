import { useEffect,useRef } from "react";
import * as tt from '@tomtom-international/web-sdk-maps';

const Map = () => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const map = tt.map({
          key: '991Yzgjtn2h4CAkM8Vk2Tis4eARqObdj',
          container: mapRef.current!,
          center: [4.899, 52.372],
          zoom: 12
        });
        map.addControl(new tt.NavigationControl());

        return () => map.remove();
      }, []);

      return <div ref={mapRef} style={{ width: '100%', height: '100vh', opacity:'50%'}}></div>;
    };
    
    export default Map;