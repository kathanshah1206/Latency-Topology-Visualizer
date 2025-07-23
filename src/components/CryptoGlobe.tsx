"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef, useMemo, FormEvent } from "react";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface CryptoRegionProperties {
  ADMIN: string;
  ISO_A2: string;
  POP_EST: string;
}

interface CryptoRegion {
  type: "Feature";
  properties: CryptoRegionProperties;
  geometry: {
    type: string;
    coordinates: any;
  };
}

interface SearchCity {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
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
  const [cities, setCities] = useState<SearchCity[]>([]);
  const [showLegend, setShowLegend] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState<number>(-1);

  const globeRef = useRef<any>(null);

  useEffect(() => {
    fetch("/datasets/modified_crypto_exchange_countries.geojson")
      .then((res) => res.json())
      .then((data) => setPlaces(data?.features || []))
      .catch((err) =>
        console.error("Failed to load crypto exchange geojson:", err)
      );
  }, []);

  useEffect(() => {
    fetch("/datasets/searchable_cities.json")
      .then((res) => res.json())
      .then((data: SearchCity[]) => setCities(data || []))
      .catch((err) => console.error("Failed to load searchable cities:", err));
  }, []);

  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.trim().toLowerCase();

    const matches = cities.filter((c) => {
      const city = c.name?.toLowerCase() ?? "";
      const country = c.country?.toLowerCase() ?? "";
      return city.includes(term) || country.includes(term);
    });

    // Rank: name startsWith gets priority
    matches.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aStarts = aName.startsWith(term) ? 0 : 1;
      const bStarts = bName.startsWith(term) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      return aName.localeCompare(bName);
    });

    return matches.slice(0, 8);
  }, [searchTerm, cities]);

  const [selectedCityLabel, setSelectedCityLabel] = useState<SearchCity | null>(
    null
  );

  const flyTo = (city: SearchCity, altitude = 1.2) => {
    globeRef.current?.pointOfView(
      { lat: city.latitude, lng: city.longitude, altitude },
      1500 // ms
    );
    setSelectedCityLabel(city);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIdx((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIdx((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestionIdx >= 0) {
        flyTo(suggestions[activeSuggestionIdx]);
      } else if (suggestions.length) {
        flyTo(suggestions[0]);
      } else {
        alert("No matching city/region found.");
      }
    } else if (e.key === "Escape") {
      setActiveSuggestionIdx(-1);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Globe */}
      <Globe
        ref={globeRef}
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg"
        hexPolygonsData={places}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonUseDots={true}
        hexPolygonColor={(d) => {
          const props = (d as any).properties as CryptoRegionProperties;
          return cryptoColors[props?.POP_EST] || "#999999";
        }}
        hexPolygonLabel={(d) => {
          const props = (d as any).properties as CryptoRegionProperties;
          const [exchange, city = ""] = props.POP_EST.split("-").map((s) =>
            s.trim()
          );
          return `
            <div>
              <div><b>${props.ADMIN} (${props.ISO_A2})</b></div>
              <div>Major Crypto: <i>${exchange}</i></div>
              <div>Exchange location: <i>${city}</i></div>
            </div>
          `;
        }}
        labelsData={selectedCityLabel ? [selectedCityLabel] : []}
        labelLat={(d) => (d as SearchCity).latitude}
        labelLng={(d) => (d as SearchCity).longitude}
        labelText={(d) => (d as SearchCity).name}
        labelSize={() => 2}
        labelDotRadius={() => 0.5}
        labelColor={() => "rgba(255, 64, 0, 1)"}
        labelResolution={100}
      />

      <form className="d-flex search-drop flex-column align-items-stretch">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search city or country"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setActiveSuggestionIdx(-1);
            }}
            onKeyDown={handleSearchKeyDown}
            className="form-control"
            aria-label="Search city or country"
          />
        </div>

        {/* Suggestion dropdown */}
        {searchTerm.trim() && suggestions.length > 0 && (
          <ul
            className="list-group mt-1"
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              cursor: "pointer",
            }}
          >
            {suggestions.map((s, idx) => (
              <li
                key={`${s.name}-${s.country}`}
                className={`list-group-item list-group-item-action ${
                  idx === activeSuggestionIdx ? "active" : ""
                }`}
                onMouseEnter={() => setActiveSuggestionIdx(idx)}
                onClick={() => {
                  flyTo(s);
                  setSearchTerm(`${s.name}, ${s.country}`);
                  setActiveSuggestionIdx(-1);
                }}
              >
                <strong>{s.name}</strong>
                <span className="text-muted ms-1">({s.country})</span>
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* Toggle Button for Small Screens */}
      <button
        className="btn btn-warning d-lg-none text-center"
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          width: "280px",
        }}
        onClick={() => setShowLegend(!showLegend)}
      >
        {showLegend ? "Hide Legend" : "Show Legend"}
      </button>

      {/* Legend */}
      <div
        className={`legend-box ${showLegend ? "d-block" : "d-none"} d-lg-block`}
      >
        <h5 style={{ marginTop: 0 }}>Crypto Exchange Legend</h5>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {Object.entries(cryptoColors).map(([exchange, color]) => (
            <li key={exchange} className="d-flex align-items-center mb-1">
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
