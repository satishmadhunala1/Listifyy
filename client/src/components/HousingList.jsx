// src/components/HousingList.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Bed,
  Search,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  ChevronDown,
  ChevronRight as ChevronRightSmall,
  Filter,
  Heart,
  Star,
} from "lucide-react";

function HousingList() {
  // Sample Housing Data (same as your original)
  const housingData = [
    {
      id: 1,
      title: "Luxury 3-Bedroom Apartment in Downtown",
      description:
        "Beautiful modern apartment with stunning city views. Recently renovated with high-end finishes. Close to shopping and restaurants.",
      price: 3200,
      type: "rent",
      location: "Manhattan, New York",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1200,
      propertyType: "apartment",
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
      ],
      posted: "2 hours ago",
      contactEmail: "agent@luxuryhomes.com",
      amenities: ["wifi", "ac", "furnished", "gym", "pool"],
    },
    {
      id: 2,
      title: "Cozy 2-Bedroom House for Sale",
      description:
        "Charming family home in quiet neighborhood. Large backyard, updated kitchen, and hardwood floors throughout.",
      price: 450000,
      type: "sale",
      location: "Brooklyn, New York",
      bedrooms: 2,
      bathrooms: 1,
      sqft: 1500,
      propertyType: "house",
      images: [
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400",
      ],
      posted: "1 day ago",
      contactEmail: "seller@familyhomes.com",
      amenities: ["garden", "parking", "furnished"],
    },
    {
      id: 3,
      title: "Modern Studio Apartment",
      description:
        "Compact and efficient studio perfect for students or young professionals. All utilities included.",
      price: 1500,
      type: "rent",
      location: "Queens, New York",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 600,
      propertyType: "studio",
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      ],
      posted: "3 hours ago",
      contactEmail: "manager@cityapartments.com",
      amenities: ["wifi", "ac", "furnished"],
    },
    {
      id: 4,
      title: "Spacious 4-Bedroom Villa",
      description:
        "Luxury villa with private pool and garden. Perfect for large families or entertaining guests.",
      price: 850000,
      type: "sale",
      location: "Long Island, New York",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2800,
      propertyType: "villa",
      images: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400",
      ],
      posted: "5 days ago",
      contactEmail: "villa@luxuryestates.com",
      amenities: ["pool", "garden", "parking", "ac", "furnished"],
    },
    {
      id: 5,
      title: "Downtown Loft with Exposed Brick",
      description:
        "Industrial-style loft with high ceilings and exposed brick walls. In the heart of the arts district.",
      price: 2800,
      type: "rent",
      location: "Manhattan, New York",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 900,
      propertyType: "loft",
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
      ],
      posted: "6 hours ago",
      contactEmail: "lofts@urbanliving.com",
      amenities: ["wifi", "ac", "furnished"],
    },
    {
      id: 6,
      title: "Family Townhouse in Suburbs",
      description:
        "Beautiful townhouse in family-friendly neighborhood. Great schools and parks nearby.",
      price: 550000,
      type: "sale",
      location: "Westchester, New York",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      propertyType: "townhouse",
      images: [
        "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400",
      ],
      posted: "2 days ago",
      contactEmail: "townhomes@suburban.com",
      amenities: ["parking", "garden"],
    },
    {
      id: 7,
      title: "Luxury Penthouse with Rooftop Access",
      description:
        "Stunning penthouse with private rooftop terrace and panoramic city views. High-end appliances and finishes.",
      price: 5500,
      type: "rent",
      location: "Manhattan, New York",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1600,
      propertyType: "penthouse",
      images: [
        "https://images.unsplash.com/photo-1540518614846-7eded1027f2b?w=400",
      ],
      posted: "1 hour ago",
      contactEmail: "penthouse@luxury.com",
      amenities: ["wifi", "ac", "furnished", "gym", "pool", "parking"],
    },
    {
      id: 8,
      title: "Cozy Cabin Retreat",
      description:
        "Peaceful cabin in the woods perfect for nature lovers. Recently updated with modern amenities.",
      price: 320000,
      type: "sale",
      location: "Upstate New York",
      bedrooms: 2,
      bathrooms: 1,
      sqft: 1100,
      propertyType: "cabin",
      images: [
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400",
      ],
      posted: "1 week ago",
      contactEmail: "cabins@nature.com",
      amenities: ["garden", "parking"],
    },
  ];

  // Popular cities for searches
  const popularCities = ["Kozhikode", "Mumbai"];

  // === State Management ===
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyTypesSelected, setPropertyTypesSelected] = useState(new Set()); // e.g. apartment, house, villa...
  const [locationsSelected, setLocationsSelected] = useState(new Set());
  const [bedroomsSelected, setBedroomsSelected] = useState(new Set()); // strings like "1","2","3","4+"
  const [bathroomsSelected, setBathroomsSelected] = useState(new Set()); // strings like "1","2","3","4+"
  const [maxPrice, setMaxPrice] = useState("");
  const [listingType, setListingType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [savedHouses, setSavedHouses] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [openSections, setOpenSections] = useState({
    categories: true,
    locations: true,
    bhk: true,
    bathrooms: true,
  });

  const itemsPerPage = 8;

  // === Derived filter option lists ===
  const locationOptions = useMemo(() => {
    const s = new Set(housingData.map((h) => h.location));
    return Array.from(s);
  }, [housingData]);

  const propertyTypeOptions = useMemo(() => {
    const s = new Set(housingData.map((h) => h.propertyType));
    return Array.from(s);
  }, [housingData]);

  // bedroom and bathroom option labels we want to show (OLX-like)
  const bedroomOptionLabels = ["1", "2", "3", "4+"];
  const bathroomOptionLabels = ["1", "2", "3", "4+"];

  // compute counts for each option (to show numbers like OLX)
  const counts = useMemo(() => {
    const c = {
      propertyTypes: {},
      locations: {},
      bedrooms: {},
      bathrooms: {},
    };

    housingData.forEach((h) => {
      // property types
      c.propertyTypes[h.propertyType] =
        (c.propertyTypes[h.propertyType] || 0) + 1;
      // locations
      c.locations[h.location] = (c.locations[h.location] || 0) + 1;
      // bedrooms
      const bKey = h.bedrooms >= 4 ? "4+" : String(h.bedrooms);
      c.bedrooms[bKey] = (c.bedrooms[bKey] || 0) + 1;
      // bathrooms
      const baKey = h.bathrooms >= 4 ? "4+" : String(h.bathrooms);
      c.bathrooms[baKey] = (c.bathrooms[baKey] || 0) + 1;
    });

    return c;
  }, [housingData]);

  // === Effects ===
  useEffect(() => {
    setCurrentPage(1);
  }, [
    propertyTypesSelected,
    bedroomsSelected,
    bathroomsSelected,
    maxPrice,
    locationsSelected,
    listingType,
    searchTerm,
    sortBy,
  ]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedHouses") || "[]");
    setSavedHouses(saved);
  }, []);

  // === Handlers for checkbox toggles ===
  const toggleSetItem = (setState, setObj, value) => {
    setObj((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const togglePropertyType = (value) =>
    toggleSetItem(propertyTypesSelected, setPropertyTypesSelected, value);
  const toggleLocation = (value) =>
    toggleSetItem(locationsSelected, setLocationsSelected, value);
  const toggleBedroom = (value) =>
    toggleSetItem(bedroomsSelected, setBedroomsSelected, value);
  const toggleBathroom = (value) =>
    toggleSetItem(bathroomsSelected, setBathroomsSelected, value);

  const toggleSave = (house) => {
    let newSaved;
    const isSaved = savedHouses.some((h) => h.id === house.id);
    if (isSaved) {
      newSaved = savedHouses.filter((h) => h.id !== house.id);
    } else {
      newSaved = [...savedHouses, house];
    }
    setSavedHouses(newSaved);
    localStorage.setItem("savedHouses", JSON.stringify(newSaved));
  };

  const resetFilters = () => {
    setPropertyTypesSelected(new Set());
    setBedroomsSelected(new Set());
    setBathroomsSelected(new Set());
    setMaxPrice("");
    setLocationsSelected(new Set());
    setListingType("all");
    setSearchTerm("");
    setSortBy("newest");
  };

  // === Filtering logic (now using sets) ===
  const filteredHouses = housingData.filter((house) => {
    const matchesSearch =
      searchTerm === "" ||
      house.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.location.toLowerCase().includes(searchTerm.toLowerCase());

    // property type check (if any selected, must match at least one)
    const propertyTypeMatch =
      propertyTypesSelected.size === 0 ||
      propertyTypesSelected.has(house.propertyType);

    // bedrooms check (if any selected: house must match at least one selected option)
    let bedroomsMatch = true;
    if (bedroomsSelected.size > 0) {
      bedroomsMatch = false;
      for (const sel of bedroomsSelected) {
        if (sel === "4+" && house.bedrooms >= 4) bedroomsMatch = true;
        else if (String(house.bedrooms) === sel) bedroomsMatch = true;
      }
    }

    // bathrooms check
    let bathroomsMatch = true;
    if (bathroomsSelected.size > 0) {
      bathroomsMatch = false;
      for (const sel of bathroomsSelected) {
        if (sel === "4+" && house.bathrooms >= 4) bathroomsMatch = true;
        else if (String(house.bathrooms) === sel) bathroomsMatch = true;
      }
    }

    // price
    const matchesPrice = maxPrice === "" || house.price <= parseFloat(maxPrice);
    // listing type
    const matchesListingType =
      listingType === "all" || house.type === listingType;
    // location
    const matchesLocation =
      locationsSelected.size === 0 || locationsSelected.has(house.location);

    return (
      matchesSearch &&
      propertyTypeMatch &&
      bedroomsMatch &&
      bathroomsMatch &&
      matchesPrice &&
      matchesListingType &&
      matchesLocation
    );
  });

  // === Sort logic ===
  const sortedHouses = [...filteredHouses].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
      default:
        return b.id - a.id;
    }
  });

  // === Pagination ===
  const indexOfLastHouse = currentPage * itemsPerPage;
  const indexOfFirstHouse = indexOfLastHouse - itemsPerPage;
  const currentHouses = sortedHouses.slice(indexOfFirstHouse, indexOfLastHouse);
  const totalPages = Math.ceil(sortedHouses.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // small helper to show count with fallback 0
  const cnt = (obj, key) => (obj && obj[key]) || 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
            <Link to="/" className="hover:text-[#002f34]">
              Home
            </Link>
            <ChevronRightSmall className="w-4 h-4" />
            <Link to="/categories" className="hover:text-[#002f34]">
              Properties
            </Link>
            <ChevronRightSmall className="w-4 h-4" />
            <span className="text-gray-900 font-medium">
              {listingType === "all"
                ? "For Rent & Sale: Houses & Apartments"
                : listingType === "rent"
                ? "For Rent: Houses & Apartments"
                : "For Sale: Houses & Apartments"}
            </span>
          </div>

          {/* Simple Popular Searches - just text */}
          <div className="mb-4">
            <span className="text-sm text-gray-600">
              <span className="text-black text-bold">Popular Searches:</span> {popularCities.join(", ")}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Properties for{" "}
                {listingType === "all" ? "Rent & Sale" : listingType}
              </h1>
              <p className="text-gray-600 text-sm">
                {sortedHouses.length} properties found
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top filter bar */}
      <div className="bg-white border-b border-gray-200 sticky top-24 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4 py-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm lg:hidden"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#002f34] ml-auto"
            >
              <option value="newest">Latest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main container: Sidebar + Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar - shown on lg as left column; on mobile it's a sliding panel when showFilters */}
        <aside
          className={`lg:col-span-3 ${
            showFilters ? "block" : "hidden"
          } lg:block`}
        >
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Filters</h3>
              <button
                className="text-xs text-gray-500 lg:hidden"
                onClick={() => setShowFilters(false)}
              >
                Close
              </button>
            </div>

            {/* Listing Type */}
            <div className="border-t border-gray-100 pt-3">
              <button
                className="w-full flex items-center justify-between text-left"
                onClick={() =>
                  setOpenSections((prev) => ({
                    ...prev,
                    listingType: !prev.listingType,
                  }))
                }
              >
                <span className="text-sm font-medium">Listing Type</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openSections.listingType ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.listingType && (
                <div className="mt-3">
                  {["all", "rent", "sale"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center py-2 text-sm text-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="listingType"
                          checked={listingType === type}
                          onChange={() => setListingType(type)}
                          className="w-4 h-4 border-gray-300 rounded-sm"
                        />
                        <span className="capitalize">
                          {type === "all"
                            ? "All Listings"
                            : type === "rent"
                            ? "For Rent"
                            : "For Sale"}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="border-t border-gray-100 pt-3 mt-3">
              <button
                className="w-full flex items-center justify-between text-left"
                onClick={() =>
                  setOpenSections((prev) => ({
                    ...prev,
                    priceRange: !prev.priceRange,
                  }))
                }
              >
                <span className="text-sm font-medium">Price Range</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openSections.priceRange ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.priceRange && (
                <div className="mt-3">
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#002f34]"
                  >
                    <option value="">Any Price</option>
                    <option value="1000">Under $1,000</option>
                    <option value="2000">Under $2,000</option>
                    <option value="3000">Under $3,000</option>
                    <option value="5000">Under $5,000</option>
                    <option value="100000">Under $100,000</option>
                    <option value="200000">Under $200,000</option>
                    <option value="500000">Under $500,000</option>
                    <option value="1000000">Under $1,000,000</option>
                  </select>
                </div>
              )}
            </div>

            {/* Categories / Property Types */}
            <div className="border-t border-gray-100 pt-3 mt-3">
              <button
                className="w-full flex items-center justify-between text-left"
                onClick={() =>
                  setOpenSections((prev) => ({
                    ...prev,
                    categories: !prev.categories,
                  }))
                }
              >
                <span className="text-sm font-medium">Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openSections.categories ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.categories && (
                <div className="mt-3">
                  {propertyTypeOptions.map((pt) => (
                    <label
                      key={pt}
                      className="flex items-center justify-between py-2 text-sm text-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={propertyTypesSelected.has(pt)}
                          onChange={() => togglePropertyType(pt)}
                          className="w-4 h-4 border-gray-300 rounded-sm"
                        />
                        <span className="capitalize">{pt}</span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        ({cnt(counts.propertyTypes, pt)})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Locations */}
            <div className="border-t border-gray-100 pt-3 mt-3">
              <button
                className="w-full flex items-center justify-between text-left"
                onClick={() =>
                  setOpenSections((prev) => ({
                    ...prev,
                    locations: !prev.locations,
                  }))
                }
              >
                <span className="text-sm font-medium">Locations</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openSections.locations ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.locations && (
                <div className="mt-3 max-h-48 overflow-auto pr-2">
                  {locationOptions.map((loc) => (
                    <label
                      key={loc}
                      className="flex items-center justify-between py-2 text-sm text-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={locationsSelected.has(loc)}
                          onChange={() => toggleLocation(loc)}
                          className="w-4 h-4 border-gray-300 rounded-sm"
                        />
                        <span className="line-clamp-1">{loc}</span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        ({cnt(counts.locations, loc)})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* BHK / Bedrooms */}
            <div className="border-t border-gray-100 pt-3 mt-3">
              <button
                className="w-full flex items-center justify-between text-left"
                onClick={() =>
                  setOpenSections((prev) => ({ ...prev, bhk: !prev.bhk }))
                }
              >
                <span className="text-sm font-medium">BHK</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openSections.bhk ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.bhk && (
                <div className="mt-3">
                  {bedroomOptionLabels.map((b) => (
                    <label
                      key={b}
                      className="flex items-center justify-between py-2 text-sm text-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={bedroomsSelected.has(b)}
                          onChange={() => toggleBedroom(b)}
                          className="w-4 h-4 border-gray-300 rounded-sm"
                        />
                        <span>{b} BHK</span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        ({cnt(counts.bedrooms, b)})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Bathrooms */}
            <div className="border-t border-gray-100 pt-3 mt-3">
              <button
                className="w-full flex items-center justify-between text-left"
                onClick={() =>
                  setOpenSections((prev) => ({
                    ...prev,
                    bathrooms: !prev.bathrooms,
                  }))
                }
              >
                <span className="text-sm font-medium">Bathrooms</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openSections.bathrooms ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.bathrooms && (
                <div className="mt-3">
                  {bathroomOptionLabels.map((b) => (
                    <label
                      key={b}
                      className="flex items-center justify-between py-2 text-sm text-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={bathroomsSelected.has(b)}
                          onChange={() => toggleBathroom(b)}
                          className="w-4 h-4 border-gray-300 rounded-sm"
                        />
                        <span>{b} Bathrooms</span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        ({cnt(counts.bathrooms, b)})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Reset */}
            <div className="border-t border-gray-100 pt-3 mt-3">
              <button
                onClick={resetFilters}
                className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Content area */}
        <main className="lg:col-span-9">
          {/* Properties Grid */}
          {sortedHouses.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or filters
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#002f34] text-white px-6 py-2 rounded-lg hover:bg-[#001a1c] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-8">
                {currentHouses.map((house) => {
                  const isSaved = savedHouses.some((h) => h.id === house.id);

                  return (
                    <div
                      key={house.id}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative">
                        <img
                          src={house.images[0]}
                          alt={house.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              house.type === "rent"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {house.type === "rent" ? "For Rent" : "For Sale"}
                          </span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                            {house.posted}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSave(house);
                          }}
                          className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isSaved
                                ? "fill-red-600 text-red-600"
                                : "text-gray-400 hover:text-red-500"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="p-3">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 text-sm leading-tight">
                          {house.title}
                        </h3>

                        <div className="flex items-center text-gray-500 mb-2 text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="line-clamp-1">{house.location}</span>
                        </div>

                        <div className="flex items-center justify-between text-gray-500 mb-2 text-xs">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <Bed className="w-3 h-3 mr-1" />
                              <span>{house.bedrooms} bed</span>
                            </div>
                            <div className="flex items-center">
                              <span>•</span>
                              <span className="ml-1">
                                {house.bathrooms} bath
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span>•</span>
                              <span className="ml-1">{house.sqft} sqft</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-[#002f34]">
                            {house.type === "rent"
                              ? `$${house.price.toLocaleString()}/mo`
                              : `$${house.price.toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center text-gray-700 text-sm"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded transition-colors font-medium text-sm ${
                          currentPage === page
                            ? "bg-[#002f34] text-white"
                            : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center text-gray-700 text-sm"
                  >
                    Next
                    <ChevronRightSmall className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default HousingList;
