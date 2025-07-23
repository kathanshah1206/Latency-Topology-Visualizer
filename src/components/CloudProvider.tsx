"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const cloudColors: Record<string, string> = {
  AWS: "#FF9900",
  GCP: "#4285F4",
  Azure: "#0ef012ff",
};

interface RegionFeature {
  type: "Feature";
  properties: {
    provider: string;
    region_code: string;
    server_count: number;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: any;
  };
}

export default function CloudProvider({
  initialRegions,
}: {
  initialRegions: RegionFeature[];
}) {
  const [selectedProviders, setSelectedProviders] = useState<
    Record<string, boolean>
  >({
    AWS: true,
    GCP: true,
    Azure: true,
  });

  const handleCheckboxChange = (provider: string) => {
    setSelectedProviders((prev) => ({
      ...prev,
      [provider]: !prev[provider],
    }));
  };

  const filteredRegions = initialRegions.filter(
    (region) => selectedProviders[region.properties.provider]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Globe
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg"
        hexPolygonsData={filteredRegions as object[]}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonUseDots={true}
        hexPolygonColor={({ properties: d }: any) =>
          cloudColors[d.provider] || "#999999"
        }
        hexPolygonLabel={({ properties: d }: any) => `
          <div>
            <div><b>Provider:</b> ${d.provider}</div>
            <div><b>Region Code:</b> ${d.region_code}</div>
            <div><b>Server Count:</b> ${d.server_count}</div>
          </div>
        `}
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
        <h4 style={{ marginTop: 0, color: "#fff" }}>Cloud Provider Legend</h4>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {Object.entries(cloudColors).map(([provider, color]) => (
            <li
              key={provider}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <input
                type="checkbox"
                checked={selectedProviders[provider]}
                onChange={() => handleCheckboxChange(provider)}
                style={{ marginRight: "8px" }}
              />
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
              {provider}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
