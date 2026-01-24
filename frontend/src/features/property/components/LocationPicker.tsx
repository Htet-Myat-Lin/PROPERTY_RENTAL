import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css"; 
import type { LeafletMouseEvent } from "leaflet"; 
import L from "leaflet";

// Fix for default Leaflet marker icons not showing in React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type Props = {
  onSelect: (coords: { lat: number; lng: number }) => void;
  defaultValue?: { lat: number; lng: number } | null; // New Prop
};

function LocationMarker({ onSelect, defaultValue }: Props) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMapEvents({
    click(e: LeafletMouseEvent) {
      setPosition(e.latlng);
      onSelect(e.latlng);
    },
  });

  // ✅ THIS FIXES THE RESET PROBLEM
  // When defaultValue changes (e.g., data finishes loading from API),
  // update the marker and fly the map to that location.
  useEffect(() => {
    if (defaultValue) {
      const newPos = new L.LatLng(defaultValue.lat, defaultValue.lng);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPosition(newPos);
      map.flyTo(newPos, map.getZoom()); // Smoothly move map to the property location
    }
  }, [defaultValue, map]);

  return position ? <Marker position={position} /> : null;
}

export function LocationPicker({ onSelect, defaultValue }: Props) {
  // Determine the map center: use defaultValue or fallback to Yangon
  const center: [number, number] = defaultValue 
    ? [defaultValue.lat, defaultValue.lng] 
    : [16.8661, 96.1951];

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: 350, width: "100%", borderRadius: "8px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker onSelect={onSelect} defaultValue={defaultValue} />
    </MapContainer>
  );
}