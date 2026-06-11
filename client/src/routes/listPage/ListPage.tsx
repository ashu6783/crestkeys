import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Map as MapIcon, Loader, X, } from "lucide-react";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/card";
import Map from "../../components/map/Map";
import { useGetPostsQuery, IPost } from "../../state/api";
import { parseCoordinate } from "../../lib/utils";

interface MapItem {
  id: string;
  title: string;
  img: string;
  price: number;
  bedroom: number;
  bathroom: number;
  latitude: number;
  longitude: number;
}

function ListPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const [mapLoading, setMapLoading] = useState(true);

  const { data: posts = [], isLoading: isPostsLoading, error } = useGetPostsQuery(filters);

  const [showMobileMap, setShowMobileMap] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMobileMap ? "hidden" : "auto";
  }, [showMobileMap]);

  const mapItems: MapItem[] = useMemo(
    () =>
      posts.flatMap((post: IPost) => {
        const latitude = parseCoordinate(post.latitude);
        const longitude = parseCoordinate(post.longitude);
        if (latitude === null || longitude === null) return [];

        return [
          {
            id: post._id || "unknown-id",
            title: post.title || "Untitled",
            img: post.images?.[0] || "https://via.placeholder.com/200x120?text=No+Image",
            price: post.price || 0,
            bedroom: post.bedroom || 0,
            bathroom: post.bathroom || 0,
            latitude,
            longitude,
          },
        ];
      }),
    [posts]
  );

  /** Loading State */
  if (isPostsLoading) {
    return (
      <main className="flex items-center justify-center h-screen bg-gradient-to-br from-[#171b2c] to-[#4d4b1e]">
        <div className="flex flex-col items-center">
          <Loader size={40} className="animate-spin text-amber-300 mb-4" />
          <p className="text-gray-200 text-lg font-medium">Finding your perfect place...</p>
        </div>
      </main>
    );
  }

  /** Error State */
  if (error) {
    return (
      <main className="flex items-center justify-center h-screen bg-gradient-to-br from-[#171b2c] to-[#4d4b1e]">
        <section className="bg-red-50 text-red-700 p-4 rounded-lg">
          <p>Error loading properties. Please try again later.</p>
        </section>
      </main>
    );
  }

  /** Grid View */
  const renderGrid = () =>
    posts.length > 0 ? (
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {posts.map((post: IPost) => (
          <Card
            key={post._id || "unknown-id"}
            item={{
              id: post._id || "unknown-id",
              title: post.title || "Untitled Property",
              address: post.address || "Address unavailable",
              price: post.price || 0,
              bedroom: post.bedroom || 0,
              bathroom: post.bathroom || 0,
              images: Array.isArray(post.images) ? post.images : [],
              img: post.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image",
            }}
          />
        ))}
      </section>
    ) : (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-xl font-medium text-gray-200 mb-2">No properties found</p>
        <p className="text-gray-400">Try adjusting your search filters.</p>
      </div>
    );

  /** Map View */
const renderMap = () => (
  <div className="relative h-full w-full p-4">
    {/* Box Container */}
    <div className="relative w-full h-full rounded-2xl shadow-lg border border-gray-200 overflow-hidden bg-white">
      {mapLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Loader size={40} className="animate-spin text-blue-500" />
          <p className="ml-3 text-gray-700 font-medium">Loading map...</p>
        </div>
      )}

      {mapItems.length > 0 ? (
        <Map items={mapItems} onLoad={() => setMapLoading(false)} />
      ) : (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50">
          <MapIcon size={40} className="text-gray-400 mb-4" />
          <p className="text-xl font-medium text-gray-700 mb-2">No valid map data</p>
          <p className="text-gray-500">No properties with valid coordinates found.</p>
        </div>
      )}
    </div>
  </div>
);

  return (
    <main className="flex flex-col h-screen bg-gradient-to-br from-[#171b2c] to-[#4d4b1e]">
      <section className="flex flex-1 h-full overflow-hidden">
        {/* Left Panel (List/Grid) */}
        <div className="w-full md:w-3/5 flex flex-col">
          <header className="px-4 md:px-8 pt-4 pb-2">
            <Filter onFilter={setFilters} />
            <div className="mt-4 flex justify-between items-center">
              <p className="text-white">
                <span className="font-semibold">{posts.length}</span> properties found{" "}
                {searchParams.get("city") && (
                  <>
                    in <span className="font-semibold text-[#B8860B]">{searchParams.get("city")}</span>
                  </>
                )}
              </p>

              {/* Mobile Map Button */}
              {isMobile && (
                <button
                  onClick={() => setShowMobileMap(true)}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-[#886B0B] rounded-lg text-sm font-medium"
                >
                  <MapIcon size={16} /> Map View
                </button>
              )}
            </div>
          </header>

          {/* Grid/List */}
          <div className="flex-1 overflow-y-auto  hidden- px-4 md:px-8 pb-8 scrollbar-none">{renderGrid()}</div>
        </div>

        {/* Right Panel (Desktop Map) */}
        {!isMobile && <div className="h-full w-2/5">{renderMap()}
        </div>}
      </section>

      {/* Mobile Map Fullscreen */}
      {isMobile && showMobileMap && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <header className="p-4 flex justify-between items-center border-b">
            <h3 className="font-semibold">Map View</h3>
            <button
              onClick={() => setShowMobileMap(false)}
              className="p-2 rounded-full bg-gray-100"
            >
              <X size={20} />
            </button>
          </header>
          <div className="flex-1">{renderMap()}</div>
        </div>
      )}
    </main>
  );
}

export default ListPage;
