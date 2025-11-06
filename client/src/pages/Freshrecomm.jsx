import React, { useState } from "react";
import { FaRegHeart, FaStar, FaRegStar, FaHeart } from "react-icons/fa";

// ✅ Complete sample data with working images
const listingsData = [
  {
    id: 1,
    title: "Maruti Suzuki Ciaz Smart Hybrid Alpha",
    price: "₹ 7,80,000",
    year: "2019",
    km: "30,666 km",
    location: "Nerul, Navi Mumbai",
    date: "2024-01-12",
    featured: true,
    img: "https://images.unsplash.com/photo-1621135802920-133df2871bef?auto=format&fit=crop&w=600&h=400&q=80",
    rating: 4,
  },
  {
    id: 2,
    title: "Ford Endeavour 2.2 Titanium AT 4X2",
    price: "₹ 21,00,000",
    year: "2017",
    km: "83,000 km",
    location: "Kolhapur, Maharashtra",
    date: "2024-01-11",
    featured: true,
    img: "https://images.unsplash.com/photo-1605559424843-9e4c9a1a0f67?auto=format&fit=crop&w=600&h=400&q=80",
    rating: 5,
  },
  {
    id: 3,
    title: "Tata Nexon EV Max",
    price: "₹ 16,50,000",
    year: "2022",
    km: "12,200 km",
    location: "Pune, Maharashtra",
    date: "2024-01-10",
    featured: false,
    img: "https://images.unsplash.com/photo-1588776814546-79a7d8c7db7d?auto=format&fit=crop&w=600&h=400&q=80",
    rating: 4,
  },
  {
    id: 4,
    title: "Hyundai Creta SX (O) Diesel",
    price: "₹ 13,40,000",
    year: "2021",
    km: "18,000 km",
    location: "Bengaluru, Karnataka",
    date: "2024-01-09",
    featured: true,
    img: "https://images.unsplash.com/photo-1606144042614-4d9a38cb1e8b?auto=format&fit=crop&w=600&h=400&q=80",
    rating: 5,
  },
  {
    id: 5,
    title: "Honda City V CVT",
    price: "₹ 9,50,000",
    year: "2020",
    km: "25,500 km",
    location: "Hyderabad, Telangana",
    date: "2024-01-08",
    featured: false,
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&h=400&q=80",
    rating: 4,
  },
  {
    id: 6,
    title: "Mahindra XUV700 AX7",
    price: "₹ 22,00,000",
    year: "2023",
    km: "8,000 km",
    location: "Delhi, NCR",
    date: "2024-01-07",
    featured: true,
    img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&h=400&q=80",
    rating: 5,
  },
  {
    id: 7,
    title: "Kia Seltos HTK Plus",
    price: "₹ 10,75,000",
    year: "2021",
    km: "22,300 km",
    location: "Chennai, Tamil Nadu",
    date: "2024-01-06",
    featured: false,
    img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=600&h=400&q=80",
    rating: 4,
  },
  {
    id: 8,
    title: "Toyota Innova Crysta",
    price: "₹ 18,50,000",
    year: "2018",
    km: "45,000 km",
    location: "Kolkata, West Bengal",
    date: "2024-01-05",
    featured: true,
    img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&h=400&q=80",
    rating: 5,
  },
  {
    id: 9,
    title: "Renault Duster RXS",
    price: "₹ 6,90,000",
    year: "2016",
    km: "55,000 km",
    location: "Ahmedabad, Gujarat",
    date: "2024-01-04",
    featured: false,
    img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&h=400&q=80",
    rating: 3,
  },
  {
    id: 10,
    title: "MG Hector Sharp",
    price: "₹ 17,20,000",
    year: "2022",
    km: "15,000 km",
    location: "Lucknow, Uttar Pradesh",
    date: "2024-01-03",
    featured: true,
    img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=600&h=400&q=80",
    rating: 4,
  },
  {
    id: 11,
    title: "Skoda Slavia Style",
    price: "₹ 14,80,000",
    year: "2023",
    km: "5,000 km",
    location: "Chandigarh, Punjab",
    date: "2024-01-02",
    featured: false,
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&h=400&q=80",
    rating: 5,
  },
  {
    id: 12,
    title: "Volkswagen Taigun Topline",
    price: "₹ 15,90,000",
    year: "2022",
    km: "12,500 km",
    location: "Jaipur, Rajasthan",
    date: "2024-01-01",
    featured: true,
    img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&h=400&q=80",
    rating: 4,
  },
  {
    id: 13,
    title: "BMW 3 Series Luxury",
    price: "₹ 42,00,000",
    year: "2021",
    km: "22,000 km",
    location: "Gurgaon, Haryana",
    date: "2023-12-31",
    featured: true,
    img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&h=400&q=80",
    rating: 5,
  },
  {
    id: 14,
    title: "Audi A4 Premium",
    price: "₹ 38,50,000",
    year: "2020",
    km: "28,000 km",
    location: "Mumbai, Maharashtra",
    date: "2023-12-30",
    featured: false,
    img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&h=400&q=80",
    rating: 4,
  },
  {
    id: 15,
    title: "Mercedes C-Class",
    price: "₹ 45,00,000",
    year: "2022",
    km: "15,000 km",
    location: "Delhi, NCR",
    date: "2023-12-29",
    featured: true,
    img: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&h=400&q=80",
    rating: 5,
  },
  {
    id: 16,
    title: "Jaguar XE",
    price: "₹ 52,00,000",
    year: "2021",
    km: "18,500 km",
    location: "Bengaluru, Karnataka",
    date: "2023-12-28",
    featured: true,
    img: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&h=400&q=80",
    rating: 5,
  },
];

// ✅ Date format helper
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ✅ Rating stars component
function Stars({ count }) {
  return (
    <div className="flex text-[#FFD700] text-sm">
      {Array.from({ length: 5 }).map((_, i) =>
        i < count ? <FaStar key={i} /> : <FaRegStar key={i} />
      )}
    </div>
  );
}

// ✅ Image component with error handling
const ListingImage = ({ src, alt, title }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1621135802920-133df2871bef?auto=format&fit=crop&w=600&h=400&q=80";

  return (
    <div className="relative w-full h-48 bg-gray-200 rounded-t-xl overflow-hidden">
      <img
        src={imageError ? fallbackImage : src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onError={() => setImageError(true)}
        onLoad={() => setImageLoaded(true)}
      />
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      )}
    </div>
  );
};

// ✅ Listing Card Component
const ListingCard = ({ item, onToggleFavorite, favorites }) => {
  const isFavorite = favorites.includes(item.id);

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      {/* Image */}
      <div className="relative">
        <ListingImage src={item.img} alt={item.title} title={item.title} />

        {/* Featured Tag */}
        {item.featured && (
          <div className="absolute top-3 left-3 bg-[#FFCE32] text-[#1F2937] text-xs font-bold px-3 py-1 rounded-sm">
            FEATURED
          </div>
        )}

        {/* Heart Icon */}
        <button
          onClick={() => onToggleFavorite(item.id)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:scale-110 transition-all duration-200"
        >
          {isFavorite ? (
            <FaHeart className="w-4 h-4 text-red-500" />
          ) : (
            <FaRegHeart className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Card Details */}
      <div className="p-4">
        <p className="text-xl font-bold text-[#1F2937] mb-1">{item.price}</p>
        <p className="text-sm text-[#6B7280] mb-2">
          {item.year} • {item.km}
        </p>
        <h3 className="text-sm font-medium text-[#2563EB] truncate mb-2 hover:text-blue-700 transition-colors">
          {item.title}
        </h3>

        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-[#6B7280] uppercase truncate max-w-[120px]">
            📍 {item.location}
          </p>
          <p className="text-xs text-[#6B7280]">{formatDate(item.date)}</p>
        </div>

        {/* Rating Stars */}
        <Stars count={item.rating} />
      </div>
    </div>
  );
};

const FreshRecommendations = () => {
  const [visible, setVisible] = useState(8); // Show 2 rows initially
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const showMoreItems = () => {
    setVisible((prev) => prev + 8); // Add 2 more rows
  };

  const showLessItems = () => {
    setVisible(8); // Reset to initial 2 rows
  };

  const visibleItems = listingsData.slice(0, visible);
  const hasMoreItems = visible < listingsData.length;
  const hasExtraItems = visible > 8;

  return (
    <section className="bg-[#F9FAFB] text-[#1F2937] py-14 px-4 sm:px-6 lg:px-8">
      {/* Section Heading */}
      <div className="max-w-7xl mx-auto mb-10">
        <h2 className="text-3xl font-bold text-[#2563EB]">
          Fresh Recommendations
        </h2>
        <p className="text-gray-600 mt-1">
          Discover amazing deals in your area
        </p>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 cursor-pointer">
          {visibleItems.map((item) => (
            <ListingCard
              key={item.id}
              item={item}
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
            />
          ))}
        </div>

        {/* Load More / Show Less Buttons */}
        <div className="flex justify-center mt-12 gap-4">
          {hasMoreItems && (
            <button
              onClick={showMoreItems}
              className="bg-[#FFCE32] hover:bg-[#FFD84D] text-[#1F2937] font-semibold px-8 py-3 rounded-xl text-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-100 cursor-pointer min-w-[140px]"
            >
              Load More
            </button>
          )}

          {hasExtraItems && (
            <button
              onClick={showLessItems}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-xl text-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-100 cursor-pointer min-w-[140px]"
            >
              Show Less
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="text-center mt-6 text-gray-600">
          Showing {visibleItems.length} of {listingsData.length} listings
        </div>
      </div>
    </section>
  );
};

export default FreshRecommendations;
