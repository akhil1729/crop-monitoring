"use client"; //initial

import { useState } from "react";
import Image from "next/image";
import GlobeSection from "@/components/GlobeSection";

export default function Home() {
  const [state, setState] = useState("California");
  const [year, setYear] = useState(2024);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const fetchRisk = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ state, year });
      const res = await fetch(
        `http://localhost:8000/api/risk?${params.toString()}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch risk data");
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("Could not load risk data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem 1.5rem 3rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        background:
          "radial-gradient(circle at top, #0f172a 0, #020617 40%, #000 100%)",
        color: "#e5e7eb",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1100px" }}>
        {/* HERO: Text + 3D Globe */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)",
            gap: "1.75rem",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.3rem 0.8rem",
                borderRadius: "999px",
                background: "rgba(148,163,184,0.12)",
                border: "1px solid rgba(148,163,184,0.4)",
                fontSize: "0.75rem",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: "#22c55e",
                  marginRight: "0.4rem",
                }}
              />
              Real-time satellite insights (demo)
            </div>
            <h1
              style={{
                fontSize: "2.4rem",
                lineHeight: 1.1,
                marginBottom: "0.75rem",
              }}
            >
              Geospatial Machine Learning Platform for{" "}
              <span
                style={{
                  background:
                    "linear-gradient(to right, #22c55e, #22d3ee, #6366f1)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Wildfire Risk &amp; Crop Health
              </span>
            </h1>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#9ca3af",
                maxWidth: "32rem",
                marginBottom: "1.5rem",
              }}
            >
              Explore climate-sensitive regions across the globe with modeled
              risk overlays derived from satellite imagery, climate
              reanalysis, and machine learning predictions. This demo connects
              a FastAPI backend to a Next.js visualization layer.
            </p>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                onClick={fetchRisk}
                disabled={loading}
                style={{
                  padding: "0.8rem 1.6rem",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  background: loading
                    ? "#4b5563"
                    : "linear-gradient(to right, #22c55e, #22d3ee)",
                  color: "#020617",
                  fontSize: "0.9rem",
                }}
              >
                {loading ? "Loading risk…" : "Run Risk Prediction"}
              </button>
              <button
                type="button"
                style={{
                  padding: "0.8rem 1.6rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(148,163,184,0.6)",
                  background: "transparent",
                  color: "#e5e7eb",
                  fontSize: "0.9rem",
                }}
              >
                View methodology
              </button>
            </div>
          </div>

          {/* 3D Rotating Globe */}
          <GlobeSection />
        </section>

        {/* MAIN DASHBOARD: Controls + World Map + Results */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)",
            gap: "1.5rem",
          }}
        >
          {/* Left: Controls + Results */}
          <div
            style={{
              background: "rgba(15,23,42,0.95)",
              borderRadius: "1.25rem",
              padding: "1.5rem",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
              border: "1px solid rgba(148,163,184,0.3)",
            }}
          >
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.4rem" }}>
              Region & Scenario
            </h2>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#9ca3af",
                marginBottom: "1.1rem",
              }}
            >
              Select a region and year, then run the model to view the
              predicted wildfire or crop stress risk across analysis tiles.
            </p>

            {/* Filters */}
            <div style={{ display: "grid", gap: "0.9rem" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.25rem",
                    fontSize: "0.85rem",
                    color: "#9ca3af",
                  }}
                >
                  Region / State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  style={{
                    padding: "0.6rem",
                    borderRadius: "0.6rem",
                    width: "100%",
                    border: "1px solid #4b5563",
                    background: "#020617",
                    color: "#e5e7eb",
                    fontSize: "0.9rem",
                  }}
                >
                  <option value="California">California</option>
                  <option value="Oregon">Oregon</option>
                  <option value="Washington">Washington</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.25rem",
                    fontSize: "0.85rem",
                    color: "#9ca3af",
                  }}
                >
                  Year
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  style={{
                    padding: "0.6rem",
                    borderRadius: "0.6rem",
                    width: "100%",
                    border: "1px solid #4b5563",
                    background: "#020617",
                    color: "#e5e7eb",
                    fontSize: "0.9rem",
                  }}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p style={{ marginTop: "0.75rem", color: "#fca5a5" }}>{error}</p>
            )}

            {/* Results */}
            {results && (
              <div style={{ marginTop: "1.5rem" }}>
                <h3
                  style={{
                    marginBottom: "0.3rem",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  Risk summary for {results.state} ({results.year})
                </h3>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#9ca3af",
                    marginBottom: "0.7rem",
                  }}
                >
                  Each tile corresponds to a spatial unit in the study area.
                  Risk scores are normalized from 0 (low) to 1 (high).
                </p>

                {results.results.map((item, idx) => {
                  let level = "Low";
                  if (item.risk_score > 0.7) level = "High";
                  else if (item.risk_score > 0.4) level = "Medium";

                  const borderColor =
                    level === "High"
                      ? "#ef4444"
                      : level === "Medium"
                      ? "#facc15"
                      : "#22c55e";

                  return (
                    <div
                      key={idx}
                      style={{
                        marginBottom: "0.75rem",
                        padding: "0.75rem",
                        borderRadius: "0.9rem",
                        background: "#020617",
                        borderLeft: `4px solid ${borderColor}`,
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                        {item.region}
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "#9ca3af",
                          marginTop: "0.15rem",
                        }}
                      >
                        Risk score: {item.risk_score.toFixed(2)} ({level})
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!results && !error && (
              <p
                style={{
                  marginTop: "1.1rem",
                  fontSize: "0.8rem",
                  color: "#6b7280",
                }}
              >
                No results yet. Run a prediction from the hero section or click
                &ldquo;Run Risk Prediction&rdquo; to fetch demo data from the
                FastAPI backend.
              </p>
            )}
          </div>

          {/* Right: World map / context panel */}
          <div
            style={{
              background:
                "radial-gradient(circle at top, rgba(56,189,248,0.12), transparent 60%), rgba(15,23,42,0.96)",
              borderRadius: "1.25rem",
              padding: "1.2rem",
              border: "1px solid rgba(148,163,184,0.35)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <h2 style={{ fontSize: "1rem", marginBottom: "0.1rem" }}>
              Global coverage
            </h2>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#9ca3af",
                marginBottom: "0.4rem",
              }}
            >
              The platform is designed to extend from the US West Coast to
              global wildfire corridors and agricultural regions. Layers can
              incorporate land cover, vegetation indices, climate anomalies,
              and historical fire fronts.
            </p>

            {/* World map illustration — add any world map image to /public/world-map.png */}
            <div
              style={{
                position: "relative",
                flexGrow: 1,
                minHeight: "180px",
                borderRadius: "1rem",
                overflow: "hidden",
                background:
                  "radial-gradient(circle at center, #020617 0, #020617 40%, #000 100%)",
                border: "1px solid rgba(51,65,85,0.9)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.22,
                  backgroundImage:
                    "radial-gradient(circle at 20% 20%, #22d3ee 0, transparent 40%), radial-gradient(circle at 80% 60%, #22c55e 0, transparent 40%)",
                }}
              />
              {/* Optional: replace with a real world map asset */}
              <div
                style={{
                  position: "absolute",
                  inset: "18% 10%",
                  borderRadius: "999px",
                  border: "1px dashed rgba(148,163,184,0.5)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: "26% 18%",
                  borderRadius: "999px",
                  border: "1px dashed rgba(148,163,184,0.3)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  textAlign: "center",
                  maxWidth: "13rem",
                }}
              >
                World map / layer preview.
                <br />
                You can replace this block with an interactive map (Leaflet,
                Mapbox, deck.gl) later.
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                gap: "0.5rem",
                marginTop: "0.5rem",
                fontSize: "0.75rem",
              }}
            >
              <div
                style={{
                  padding: "0.6rem",
                  borderRadius: "0.75rem",
                  background: "#020617",
                  border: "1px solid rgba(34,197,94,0.55)",
                }}
              >
                <div style={{ fontWeight: 600 }}>Wildfire risk</div>
                <div style={{ color: "#9ca3af", marginTop: "0.15rem" }}>
                  Modeled using vegetation, temperature, and drought indices.
                </div>
              </div>
              <div
                style={{
                  padding: "0.6rem",
                  borderRadius: "0.75rem",
                  background: "#020617",
                  border: "1px solid rgba(56,189,248,0.55)",
                }}
              >
                <div style={{ fontWeight: 600 }}>Crop health</div>
                <div style={{ color: "#9ca3af", marginTop: "0.15rem" }}>
                  NDVI / EVI-based stress indicators from multispectral data.
                </div>
              </div>
              <div
                style={{
                  padding: "0.6rem",
                  borderRadius: "0.75rem",
                  background: "#020617",
                  border: "1px solid rgba(129,140,248,0.55)",
                }}
              >
                <div style={{ fontWeight: 600 }}>Future work</div>
                <div style={{ color: "#9ca3af", marginTop: "0.15rem" }}>
                  Add temporal sliders, uncertainty bands, and scenario
                  simulations.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
