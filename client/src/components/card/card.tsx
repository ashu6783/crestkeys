import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Heart, MessageCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";

type CardProps = {
  item: {
    id: string;
    title: string;
    address: string;
    price: number;
    bedroom: number;
    bathroom: number;
    images: string[];
    img?: string;
    type?: string;
  };
  className?: string;
};

const PROPERTY_PLACEHOLDER =
  "https://res.cloudinary.com/ashuudev/image/upload/v1747387453/posts/qmr4ozxybox5wwc5adg6.jpg";

function Card({ item, className = "" }: CardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const imageSource =
    item.images && item.images.length > 0
      ? item.images[0]
      : item.img || PROPERTY_PLACEHOLDER;

  return (
    <motion.div
      className={`bg-white rounded-xl overflow-hidden flex flex-col h-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      {/* Image Container */}
      <Link to={`/${item.id}`} className="block relative">
        <div className="relative w-full h-60 overflow-hidden bg-gray-100 flex items-center justify-center">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <motion.img
            src={imageSource}
            alt={item.title || "Property"}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.5 }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = PROPERTY_PLACEHOLDER;
              setImageLoaded(true);
            }}
            loading="lazy"
          />

          {/* Property type badge */}
          {item.type && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-4 left-4 bg-[#B8860B] text-white px-3 py-1 rounded-full text-xs font-medium"
            >
              {item.type}
            </motion.div>
          )}

          {/* Price badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-gray-800 shadow-sm"
          >
            ${formatPrice(item.price)}
          </motion.div>
        </div>
      </Link>

      {/* Text Content */}
      <div className="p-5 flex flex-col gap-4 flex-grow">
        <div>
          <motion.h2
            className="text-lg font-bold text-gray-800 line-clamp-1"
            whileHover={{ color: "#3b82f6" }}
          >
            <Link to={`/${item.id}`}>{item.title}</Link>
          </motion.h2>
          <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
            <MapPin size={16} className="text-[#B8860B]" />
            <span className="truncate">{item.address}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <motion.div
            className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg"
            whileHover={{ backgroundColor: "#f0f9ff" }}
          >
            <Bed size={16} className="text-[#B8860B]" />
            <span>
              {item.bedroom} {item.bedroom === 1 ? "bed" : "beds"}
            </span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg"
            whileHover={{ backgroundColor: "#f0f9ff" }}
          >
            <Bath size={16} className="text-[#B8860B]" />
            <span>
              {item.bathroom} {item.bathroom === 1 ? "bath" : "baths"}
            </span>
          </motion.div>
        </div>

        <div className="flex justify-between items-center pt-3 mt-auto border-t border-gray-100">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={`/${item.id}`}
              className="text-sm bg-[#B8860B] text-white font-medium px-4 py-2 rounded-lg inline-block"
            >
              View details
            </Link>
          </motion.div>
          <div className="flex gap-2">
            <motion.button
              className={`p-2 rounded-full ${
                isLiked
                  ? "bg-red-50 text-red-500"
                  : "bg-gray-50 text-gray-500"
              }`}
              onClick={() => setIsLiked(!isLiked)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            </motion.button>
            <motion.button
              className="p-2 rounded-full bg-gray-50 text-gray-500"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageCircle size={18} />
            </motion.button>
            <motion.button
              className="p-2 rounded-full bg-gray-50 text-gray-500"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Card;
