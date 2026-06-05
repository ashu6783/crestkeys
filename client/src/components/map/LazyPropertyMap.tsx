import { useEffect, useRef, useState, type ComponentType } from "react";
import { MapPin } from "lucide-react";

export interface MapItem {
  id: string;
  title: string;
  img: string;
  price: number;
  bedroom: number;
  latitude: number;
  longitude: number;
}

interface LazyPropertyMapProps {
  items: MapItem[];
  className?: string;
}

export default function LazyPropertyMap({ items, className = "h-64" }: LazyPropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [MapComponent, setMapComponent] = useState<ComponentType<{ items: MapItem[] }> | null>(
    null
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad || MapComponent) return;

    import("./Map").then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, [shouldLoad, MapComponent]);

  return (
    <div ref={containerRef} className={`w-full relative ${className}`}>
      {MapComponent ? (
        <MapComponent items={items} />
      ) : (
        <div className="flex h-full min-h-[16rem] items-center justify-center rounded-lg bg-gray-100 text-gray-500">
          <MapPin className="mr-2 h-5 w-5 animate-pulse" />
          <span className="text-sm">Loading map...</span>
        </div>
      )}
    </div>
  );
}
