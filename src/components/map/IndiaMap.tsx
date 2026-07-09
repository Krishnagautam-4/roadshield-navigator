import { useMemo, useRef } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import type { Feature, FeatureCollection } from "geojson";
import type { Layer, Path } from "leaflet";
import { useTheme } from "@/hooks/useTheme";
import { formatNumber, slugify, type StateSummary } from "@/lib/roadshield";

interface Props {
  geo: FeatureCollection;
  states: StateSummary[];
  onStateClick: (slug: string) => void;
}

const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";
const LIGHT_TILES = "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";

export default function IndiaMap({ geo, states, onStateClick }: Props) {
  const { isDark } = useTheme();
  const byName = useMemo(() => new Map(states.map((s) => [s.name, s])), [states]);
  const max = useMemo(() => Math.max(...states.map((s) => s.totalAccidents), 1), [states]);
  const clickRef = useRef(onStateClick);
  clickRef.current = onStateClick;

  const baseStyle = (feature?: Feature) => {
    const name = (feature?.properties as { name?: string })?.name ?? "";
    const s = byName.get(name);
    const intensity = s ? 0.18 + 0.55 * Math.sqrt(s.totalAccidents / max) : 0.15;
    return {
      color: "var(--map-stroke)",
      weight: 1,
      fillColor: "var(--primary)",
      fillOpacity: intensity,
      className: "state-path",
    };
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    const name = (feature.properties as { name?: string })?.name ?? "";
    const s = byName.get(name);
    layer.bindTooltip(
      `<div style="font-weight:600">${name}</div><div style="font-size:11px;opacity:.75">${
        s ? `${formatNumber(s.totalAccidents)} accidents · ${s.hotspots} hotspots` : ""
      }</div>`,
      { sticky: true, direction: "top", opacity: 0.95 },
    );
    layer.on({
      mouseover: () => (layer as Path).setStyle({ fillOpacity: 0.85, weight: 2 }),
      mouseout: () => (layer as Path).setStyle(baseStyle(feature)),
      click: () => clickRef.current(slugify(name)),
    });
  };

  return (
    <MapContainer
      center={[22.8, 80.5]}
      zoom={5}
      minZoom={4}
      maxZoom={8}
      scrollWheelZoom
      className="h-full w-full"
      attributionControl={false}
    >
      <TileLayer key={isDark ? "dark" : "light"} url={isDark ? DARK_TILES : LIGHT_TILES} />
      <GeoJSON data={geo} style={baseStyle} onEachFeature={onEachFeature} />
    </MapContainer>
  );
}
