"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamic import to prevent SSR
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// Define interface for GeoJSON feature properties
interface CryptoRegionProperties {
  ADMIN: string;
  ISO_A2: string;
  POP_EST: string;
}

// Define interface for each GeoJSON Feature
interface CryptoRegion {
  type: "Feature";
  properties: CryptoRegionProperties;
  geometry: {
    type: string;
    coordinates: any;
  };
}

export default function CryptoGlobe() {
  const cryptoColors: Record<string, string> = {
    "Binance - Tokyo": "#FF5733",
    "Coinbase - San Francisco": "#33A1FF",
    "Kraken - Frankfurt": "#33FF57",
    "Bybit - Singapore": "#FF33A8",
    "Bitfinex - Hong Kong": "#FFA533",
    "OKX - Seoul": "#33FFD1",
    "Bitstamp - Luxembourg": "#B733FF",
    "Huobi - Beijing": "#3385FF",
    "KuCoin - Seychelles": "#FF3366",
    "Deribit - Amsterdam": "#A5FF33",
  };

  const [places, setPlaces] = useState<CryptoRegion[]>([]);

  useEffect(() => {
    fetch("/datasets/modified_crypto_exchange_countries.geojson")
      .then((res) => res.json())
      .then((data) => {
        setPlaces(data?.features || []);
      });
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Globe
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg"
        hexPolygonsData={places}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonUseDots={true}
        // hexPolygonColor={({
        //   properties,
        // }: {
        //   properties: CryptoRegionProperties;
        // }) => cryptoColors[properties.POP_EST] || "#999999"}
        // hexPolygonLabel={({
        //   properties,
        // }: {
        //   properties: CryptoRegionProperties;
        // }) => `
        //   <div>
        //     <div><b>${properties.ADMIN} (${properties.ISO_A2})</b></div>
        //     <div>Major Crypto Exchange: <i>${properties.POP_EST}</i></div>
        //   </div>
        // `}
        hexPolygonColor={(d) => {
          const props = (d as any).properties as CryptoRegionProperties;
          return cryptoColors[props?.POP_EST] || "#999999";
        }}
        hexPolygonLabel={(d) => {
          const props = (d as any).properties as CryptoRegionProperties;
          return `
    <div>
      <div><b>${props.ADMIN} (${props.ISO_A2})</b></div>
      <div>Major Crypto: <i>${props.POP_EST.split("-")[0]}</i></div>
      <div>Exchange location: <i>${props.POP_EST.split("-")[1]}</i></div>
    </div>
  `;
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          backgroundColor: "#1a1a1aee",
          padding: "1rem",
          borderRadius: "0.5rem",
          color: "#fff",
          fontSize: "0.9rem",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h4 style={{ marginTop: 0 }}>Crypto Exchange Legend</h4>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {Object.entries(cryptoColors).map(([exchange, color]) => (
            <li
              key={exchange}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: color,
                  display: "inline-block",
                  marginRight: "8px",
                  borderRadius: "3px",
                }}
              ></span>
              {exchange}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
