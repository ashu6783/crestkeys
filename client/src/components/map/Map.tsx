import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { parseCoordinate } from "../../lib/utils";

interface Item {
  id: string;
  title: string;
  img: string;
  price: number;
  bedroom: number;
  latitude: number;
  longitude: number;
}

interface MapProps {
  items: Item[];
  onLoad?: () => void; 
}

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function PropertyMap({ items = [], onLoad }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const itemsKeyRef = useRef("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const itemsKey = items
    .map((item) => `${item.id}:${item.latitude}:${item.longitude}`)
    .join("|");

  const validItems = items.filter(
    (item) =>
      parseCoordinate(item.latitude) !== null && parseCoordinate(item.longitude) !== null
  );

  useEffect(() => {
    if (!mapContainer.current || validItems.length === 0) return;

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/ashu0306/cmet0ybhx002001plh48x8fvg",
        center: [
          parseCoordinate(validItems[0]?.longitude) ?? -122.4194,
          parseCoordinate(validItems[0]?.latitude) ?? 37.7749,
        ],
        zoom: 10,
      });

      mapRef.current.on("load", () => {
        onLoad?.();
      });
    }

    if (itemsKeyRef.current === itemsKey) return;
    itemsKeyRef.current = itemsKey;

    const map = mapRef.current;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    items.forEach((item) => {
      const latitude = parseCoordinate(item.latitude);
      const longitude = parseCoordinate(item.longitude);
      if (latitude === null || longitude === null) return;

      const el = document.createElement("div");
      el.className =
        "custom-marker w-6 h-6 bg-[#B8860B] rounded-full border-2 border-white cursor-pointer";
      el.onclick = () => setSelectedItem(item);

      markersRef.current.push(
        new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(map)
      );
    });

    if (validItems.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      validItems.forEach((item) => {
        const latitude = parseCoordinate(item.latitude);
        const longitude = parseCoordinate(item.longitude);
        if (latitude !== null && longitude !== null) {
          bounds.extend([longitude, latitude]);
        }
      });
      map.fitBounds(bounds, { padding: 50 });
    } else if (validItems.length === 1) {
      const latitude = parseCoordinate(validItems[0].latitude);
      const longitude = parseCoordinate(validItems[0].longitude);
      if (latitude !== null && longitude !== null) {
        map.setCenter([longitude, latitude]);
        map.setZoom(13);
      }
    }
  }, [items, itemsKey, onLoad, validItems]);

  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="w-full h-full relative min-h-[16rem]">
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      {selectedItem && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg p-3 w-56">
          <button
            className="absolute top-1 right-2 text-gray-500"
            onClick={() => setSelectedItem(null)}
          >
            ✕
          </button>
          <img
            src={selectedItem.img}
            alt={selectedItem.title}
            className="w-full h-24 object-cover rounded"
            onError={(e) =>
              ((e.target as HTMLImageElement).src =
                "https://via.placeholder.com/200x120?text=No+Image")
            }
          />
          <h3 className="font-bold text-sm mt-2">{selectedItem.title}</h3>
          <p className="text-blue-600 font-semibold">
            ${new Intl.NumberFormat().format(Math.floor(selectedItem.price))}
          </p>
          <span className="text-gray-600 text-xs">{selectedItem.bedroom} bed</span>
        </div>
      )}
    </div>
  );
}

export default PropertyMap;
