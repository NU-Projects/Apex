import React, { useState, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

// --- Country config ---
const COUNTRY_CONFIG = {
  Pakistan: {
    geoUrl: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
    filterFn: (geo) => geo.properties.name === 'Pakistan',
    projection: 'geoMercator',
    projectionConfig: { center: [69.3, 30.3], scale: 1500 },
    mapWidth: 700,
    mapHeight: 460,
    flag: '🇵🇰',
    // 12 lat/lng positions scattered across Pakistan for role bubbles
    slots: [
      [67.0, 24.9],  // Karachi south
      [68.4, 25.4],  // Hyderabad
      [68.9, 27.7],  // Sukkur
      [66.99, 30.2],  // Quetta
      [71.5, 30.2],  // Multan
      [73.09, 31.4],  // Faisalabad
      [74.35, 31.52], // Lahore
      [74.53, 32.5],  // Sialkot
      [73.04, 33.72], // Islamabad
      [73.2, 34.1],  // Abbottabad
      [71.5, 34.0],  // Peshawar
      [74.3, 35.9],  // Gilgit
    ],
  },
  'United States': {
    geoUrl: 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json',
    filterFn: null,
    projection: 'geoAlbersUsa',
    projectionConfig: { scale: 860 },
    mapWidth: 800,
    mapHeight: 440,
    flag: '🇺🇸',
    slots: [
      [-71.1, 42.4],  // Boston
      [-74.0, 40.7],  // New York
      [-77.0, 38.9],  // DC
      [-80.2, 25.8],  // Miami
      [-84.4, 33.7],  // Atlanta
      [-87.6, 41.9],  // Chicago
      [-96.8, 32.8],  // Dallas
      [-95.4, 29.8],  // Houston
      [-97.7, 30.3],  // Austin
      [-104.9, 39.7],  // Denver
      [-118.2, 34.1],  // Los Angeles
      [-122.3, 47.6],  // Seattle
    ],
  },
};

const ROLE_COLORS = [
  '#2563eb', '#7c3aed', '#0891b2', '#059669',
  '#d97706', '#dc2626', '#9333ea', '#0284c7',
  '#16a34a', '#ca8a04', '#e11d48', '#0d9488',
];

function GeoMap({ country, locationCounts }) {
  const [hoveredLoc, setHoveredLoc] = useState(null);
  const cfg = COUNTRY_CONFIG[country];

  // Slice locations based on slots length
  const validLocations = useMemo(() => {
    return (locationCounts || [])
      .filter(l => l.count > 0 && l.location)
      .slice(0, cfg?.slots?.length || 12);
  }, [locationCounts, cfg]);

  const maxCount = useMemo(() => Math.max(1, ...validLocations.map(l => l.count)), [validLocations]);
  const total = useMemo(() => validLocations.reduce((s, l) => s + l.count, 0), [validLocations]);

  const getBubbleRadius = (count) => {
    if (count === 0) return 0;
    const minR = 18, maxR = 48;
    return minR + ((count / maxCount) ** 0.55) * (maxR - minR);
  };

  const getShortName = (name) => {
    if (!name) return "";
    const parts = name.split(',').map(s=>s.trim());
    const firstPart = parts[0];
    if (firstPart.length > 12) {
      const words = firstPart.split(' ');
      if (words.length > 1) {
        return words.map(w => w[0]).join('').toUpperCase().substring(0, 4);
      }
      return firstPart.substring(0, 3).toUpperCase();
    }
    return firstPart.toUpperCase();
  };

  if (!cfg) return null;

  return (
    <div className="w-full select-none">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-3xl">{cfg.flag}</span>
        <div>
          <h4 className="text-lg font-black text-text-primary tracking-tight">
            {country === 'Pakistan' ? 'Pakistan' : 'United States'} - Job Demand Map
          </h4>
          <p className="text-xs text-text-muted font-semibold">
            Bubble size = job count · Hover for details
          </p>
        </div>
      </div>

      {/* Map container */}
      <div
        className="relative w-full rounded-3xl overflow-hidden border border-border-light shadow-2xl"
        style={{
          background: 'linear-gradient(145deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 100%)',
          minHeight: country === 'Pakistan' ? 460 : 440,
        }}
      >
        {/* subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <ComposableMap
          projection={cfg.projection}
          projectionConfig={cfg.projectionConfig}
          width={cfg.mapWidth}
          height={cfg.mapHeight}
          style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
        >
          {/* Country / States geography */}
          <Geographies geography={cfg.geoUrl}>
            {({ geographies }) => {
              const filtered = cfg.filterFn
                ? geographies.filter(cfg.filterFn)
                : geographies;
              return filtered.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: '#bfdbfe', stroke: '#93c5fd', strokeWidth: 0.7, outline: 'none' },
                    hover: { fill: '#bfdbfe', stroke: '#93c5fd', strokeWidth: 0.7, outline: 'none' },
                    pressed: { fill: '#bfdbfe', outline: 'none' },
                  }}
                />
              ));
            }}
          </Geographies>

          {/* Location bubbles */}
          {validLocations.map((loc, i) => {
            const slot = cfg.slots[i];
            if (!slot) return null;
            const r = getBubbleRadius(loc.count);
            const color = ROLE_COLORS[i % ROLE_COLORS.length];
            const isHovered = hoveredLoc === loc.location;

            return (
              <Marker key={loc.location} coordinates={slot}>
                <g
                  onMouseEnter={() => setHoveredLoc(loc.location)}
                  onMouseLeave={() => setHoveredLoc(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Invisible hover catcher to prevent jitter */}
                  <circle r={r + 15} fill="transparent" />

                  {/* Glow ring on hover */}
                  {isHovered && (
                    <circle
                      r={r + 8}
                      fill={color}
                      opacity={0.3}
                      style={{ pointerEvents: 'none', transition: 'all 0.3s ease' }}
                    />
                  )}

                  {/* Pulsing ring for top role */}
                  {i === 0 && !isHovered && (
                    <circle
                      r={r + 6}
                      fill={color}
                      opacity={0.15}
                      style={{ animation: 'mapPulse 2.5s ease-out infinite', pointerEvents: 'none' }}
                    />
                  )}

                  {/* Main bubble */}
                  <circle
                    r={isHovered ? r + 3 : r}
                    fill={color}
                    fillOpacity={isHovered ? 0.95 : 0.85}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 3 : 1.5}
                    style={{
                      transition: 'all 0.3s ease',
                      filter: isHovered ? `drop-shadow(0 4px 12px ${color}aa)` : `drop-shadow(0 2px 6px ${color}44)`
                    }}
                  />

                  {/* Short label inside bubble */}
                  {r >= 10 && (
                    <text
                      textAnchor="middle"
                      y={-4}
                      style={{
                        fontSize: r >= 36 ? 8.5 : 7.5,
                        fontWeight: 900,
                        fill: 'white',
                        fontFamily: 'Inter, sans-serif',
                        pointerEvents: 'none',
                        letterSpacing: '-0.2px',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {getShortName(loc.location)}
                    </text>
                  )}
                  {r >= 10 && (
                    <text
                      textAnchor="middle"
                      y={9}
                      style={{
                        fontSize: r >= 36 ? 12 : 10,
                        fontWeight: 900,
                        fill: 'white',
                        fontFamily: 'Inter, sans-serif',
                        pointerEvents: 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {loc.count}
                    </text>
                  )}
                </g>
              </Marker>
            );
          })}
        </ComposableMap>

        {/* Floating tooltip */}
        {hoveredLoc && (() => {
          const loc = validLocations.find(l => l.location === hoveredLoc);
          const idx = validLocations.findIndex(l => l.location === hoveredLoc);
          const color = ROLE_COLORS[idx % ROLE_COLORS.length];
          if (!loc) return null;
          return (
            <div
              key={hoveredLoc}
              className="absolute top-4 left-1/2 z-30 pointer-events-none"
              style={{ transform: 'translateX(-50%)', animation: 'tooltipIn 0.15s ease-out' }}
            >
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white px-5 py-3.5 flex items-center gap-4 min-w-[220px]">
                <div className="w-4 h-4 rounded-full flex-shrink-0 shadow-md" style={{ background: color }} />
                <div>
                  <p className="text-[11px] font-black text-text-primary uppercase tracking-widest leading-none mb-1">{loc.location}</p>
                  <p className="text-2xl font-black leading-none" style={{ color }}>{loc.count}</p>
                  <p className="text-[10px] font-bold text-text-muted mt-0.5">
                    {total > 0 ? ((loc.count / total) * 100).toFixed(1) : 0}% of total · {country}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Legend badge */}
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-border-light shadow-sm flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-300 opacity-70" />
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Few</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Many</span>
          </div>
        </div>
      </div>



      <style>{`
        @keyframes mapPulse {
          0%   { transform: scale(1); opacity: 0.25; }
          70%  { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default GeoMap;
