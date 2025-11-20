"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Simple fallback markers if no tiles yet
const defaultPoints = [
  {
    lat: 34.05,
    lon: -118.25,
    label: "LA Basin – Extreme wildfire risk",
    risk_score: 0.9,
  },
  {
    lat: 38.73,
    lon: -120.84,
    label: "Sierra Foothills – High wildfire risk",
    risk_score: 0.88,
  },
  {
    lat: 36.74,
    lon: -119.79,
    label: "Central Valley – High crop stress",
    risk_score: 0.8,
  },
];

export default function MapPanel({ tiles }) {
  const points =
    tiles && tiles.length
      ? tiles.map((t) => ({
          lat: t.lat,
          lon: t.lon,
          label: `${t.region} (${t.county})`,
          risk_score: t.risk_score,
        }))
      : defaultPoints;

  const center = [37.0, -120.0]; // California-ish

  const getColor = (r) => {
    if (r > 0.85) return "#dc2626"; // extreme
    if (r > 0.7) return "#f97316"; // high
    if (r > 0.5) return "#eab308"; // medium
    return "#22c55e"; // low
  };

  return (
    <div
      style={{
        position: "relative",
        flexGrow: 1,
        minHeight: "220px",
        borderRadius: "1rem",
        overflow: "hidden",
        border: "1px solid rgba(51,65,85,0.9)",
      }}
    >
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p, idx) => (
          <CircleMarker
            key={idx}
            center={[p.lat, p.lon]}
            radius={8}
            pathOptions={{
              color: getColor(p.risk_score),
              fillColor: getColor(p.risk_score),
              fillOpacity: 0.8,
            }}
          >
            <Tooltip direction="top" offset={[0, -4]} opacity={1}>
              <span>
                {p.label}
                <br />
                Risk score: {p.risk_score.toFixed(2)}
              </span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
