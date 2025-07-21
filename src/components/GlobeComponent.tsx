"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
interface GeoJsonFeature {
  type: "Feature";
  properties: {
    name: string;
    latitude: number;
    longitude: number;
    pop_max: number;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
}

// Importing 'react-globe.gl' dynamically to ensure it runs client-side only
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const GlobeComponent = () => {
  //   const apiKey = "0c5fccae-52e1-413d-835c-ceb916d0bdb9";
  //   const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map";

  //   fetch(`${url}`, {
  //     method: "GET",
  //     headers: {
  //       Accepts: "application/json",
  //       "X-CMC_PRO_API_KEY": apiKey,
  //     },
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log("Cryptocurrencies:", data.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });

  const [places, setPlaces] = useState<GeoJsonFeature[]>([]);
  const globeEl = useRef<any>(null);

  useEffect(() => {
    // Load the GeoJSON from public folder
    fetch("/datasets/ne_110m_populated_places_simple.geojson")
      .then((res) => res.json())
      .then((data) => {
        setPlaces(data.features as GeoJsonFeature[]);
      });
  }, []);

  return (
    <div>
      <Globe
        ref={globeEl}
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
        labelsData={places}
        labelLat={(d) => (d as GeoJsonFeature).properties.latitude}
        labelLng={(d) => (d as GeoJsonFeature).properties.longitude}
        labelText={(d) => (d as GeoJsonFeature).properties.name}
        labelSize={(d) =>
          Math.sqrt((d as GeoJsonFeature).properties.pop_max) * 4e-4
        }
        labelDotRadius={(d) =>
          Math.sqrt((d as GeoJsonFeature).properties.pop_max) * 4e-4
        }
        labelColor={() => "rgba(255, 165, 0, 0.75)"}
        labelResolution={2}
      />
    </div>
  );
};

export default GlobeComponent;
