import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { useTheme } from "@/hooks/useTheme";
import { riskVar, type Hotspot } from "@/lib/roadshield";

interface Props {
  center: [number, number];
  zoom?: number;
  hotspots: Hotspot[];
  onSelect?: (hotspot: Hotspot) => void;
}

const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const LIGHT_TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

export default function StateHotspotMap({ center, zoom = 6, hotspots, onSelect }: Props) {
  const { isDark } = useTheme();

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="h-full w-full"
      attributionControl={false}
    >
      <TileLayer key={isDark ? "dark" : "light"} url={isDark ? DARK_TILES : LIGHT_TILES} />
      {hotspots.map((h) => (
        <CircleMarker
          key={h.id}
          center={[h.lat, h.lng]}
          radius={7 + Math.min(7, h.accidents / 50)}
          pathOptions={{
            color: riskVar[h.riskLevel],
            fillColor: riskVar[h.riskLevel],
            fillOpacity: 0.55,
            weight: 2,
          }}
          eventHandlers={{ click: () => onSelect?.(h) }}
        >
          <Popup>
            <div className="min-w-44 space-y-1 text-sm">
              <p className="font-display font-bold">{h.location}</p>
              <p className="text-xs opacity-75">
                {h.district} · {h.riskLevel} Risk
              </p>
              <p className="text-xs">
                <span className="font-semibold">{h.accidents}</span> accidents ·{" "}
                <span className="font-semibold">{h.fatalities}</span> fatalities
              </p>
              <p className="text-xs">Major cause: {h.majorCause}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
