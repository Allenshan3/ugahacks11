// ResizeFix.js
import { useMap } from "react-leaflet";
import { useEffect } from "react";

export default function MapResize() {
  const map = useMap();

useEffect(() => {
  setTimeout(() => {
    map.invalidateSize();
  }, 100);
}, [map]);

  return null;
}
