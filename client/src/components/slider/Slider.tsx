import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface SliderProps {
  images: string[];
}

export default function Slider({ images }: SliderProps) {
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const isModalOpen = modalIndex !== null;

  // Slide change handler
 const changeSlide = useCallback(
  (direction: "left" | "right") => {
    const length = images.length;

    if (isModalOpen) {
      setModalIndex((prev: number | null) => {
        const safePrev = prev ?? 0; // fallback to 0 if null
        return direction === "left"
          ? (safePrev - 1 + length) % length
          : (safePrev + 1) % length;
      });
    } else {
      setCurrentSlide((prev: number) =>
        direction === "left"
          ? (prev - 1 + length) % length
          : (prev + 1) % length
      );
    }
  },
  [images.length, isModalOpen]
);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") changeSlide("left");
      if (e.key === "ArrowRight") changeSlide("right");
      if (e.key === "Escape") setModalIndex(null);
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [isModalOpen, changeSlide]);


  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  if (!images.length) {
    return (
      <div className="w-full h-[350px] bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Modal View */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          {/* Close */}
          <button
            onClick={() => setModalIndex(null)}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev */}
          <button
            onClick={() => changeSlide("left")}
            className="absolute left-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image */}
          <div className="max-w-5xl max-h-full flex items-center justify-center p-4">
            <img
              src={images[modalIndex!]}
              alt={`Slide ${modalIndex! + 1}`}
              decoding="async"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>

          {/* Next */}
          <button
            onClick={() => changeSlide("right")}
            className="absolute right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <span className="bg-black/50 px-4 py-2 rounded-full text-white text-sm">
              {modalIndex! + 1} / {images.length}
            </span>
          </div>
        </div>
      )}

      {/* Main Slider */}
      <div className="h-[350px] md:h-[450px] rounded-lg overflow-hidden relative">
        {images.length > 1 && (
          <button
            onClick={() => changeSlide("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div
          className="w-full h-full cursor-pointer"
          onClick={() => setModalIndex(currentSlide)}
        >
          <img
            src={images[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentSlide + 1} / {images.length}
          </div>
        </div>

        {images.length > 1 && (
          <button
            onClick={() => changeSlide("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <>
          {/* Desktop */}
          <div className="hidden md:flex gap-2 mt-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                  idx === currentSlide
                    ? "border-teal-500"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-20 h-20 object-cover"
                />
              </div>
            ))}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden gap-2 mt-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`flex-shrink-0 w-16 h-16 cursor-pointer rounded-md overflow-hidden border-2 ${
                  idx === currentSlide
                    ? "border-teal-500"
                    : "border-transparent opacity-70"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
