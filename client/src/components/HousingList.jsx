// src/components/HousingList.jsx
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Bed,
  Search,
  ChevronLeft,
  ChevronDown,
  ChevronRight as ChevronRightSmall,
  Filter,
  Heart,
} from "lucide-react";
import { housingData } from "../jsonData/index.js";
import { locationData } from "../jsonData/locations.js";

function HousingList() {
  const navigate = useNavigate();
  const { category } = useParams(); // Get the category from URL params

  // Use housing data from JSON file
  const allHouses = housingData.houses;

  // Housing subcategory mapping
  const housingSubcategories = {
    "apts-for-rent": {
      name: "Apts/Housing for Rent",
      filter: (house) =>
        house.type === "rent" && house.propertyType === "apartment",
    },
    "housing-swap": {
      name: "Housing Swap",
      filter: (house) => house.type === "swap",
    },
    "housing-wanted": {
      name: "Housing Wanted",
      filter: (house) => house.type === "wanted",
    },
    "office-commercial": {
      name: "Office/Commercial",
      filter: (house) =>
        house.propertyType === "commercial" || house.propertyType === "office",
    },
    "parking-storage": {
      name: "Parking & Storage",
      filter: (house) =>
        house.propertyType === "parking" || house.propertyType === "storage",
    },
    "real-estate": {
      name: "Real Estate",
      filter: (house) => house.propertyType !== "apartment",
    },
    "real-estate-for-sale": {
      name: "Real Estate for Sale",
      filter: (house) =>
        house.type === "sale" && house.propertyType !== "apartment",
    },
    "real-estate-wanted": {
      name: "Real Estate Wanted",
      filter: (house) =>
        house.type === "wanted" && house.propertyType !== "apartment",
    },
    "rooms-temporary": {
      name: "Rooms & Temporary",
      filter: (house) =>
        house.propertyType === "room" || house.propertyType === "shared",
    },
    "vacation-rentals": {
      name: "Vacation Rentals",
      filter: (house) =>
        house.propertyType === "vacation" || house.type === "vacation",
    },
  };

  // Get current category info
  const currentCategory = housingSubcategories[category] || {
    name: "Housing",
    filter: () => true,
  };

  // Popular cities for searches - adjust based on category
  const popularCities = useMemo(() => {
    const cities = ["Kozhikode", "Mumbai", "Delhi", "Bangalore", "Chennai"];
    return category === "vacation-rentals"
      ? ["Goa", "Manali", "Kerala", "Himachal", "Rajasthan"]
      : cities;
  }, [category]);

  // === State Management ===
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyTypesSelected, setPropertyTypesSelected] = useState(new Set());
  const [bedroomsSelected, setBedroomsSelected] = useState(new Set());
  const [bathroomsSelected, setBathroomsSelected] = useState(new Set());
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [listingType, setListingType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [savedHouses, setSavedHouses] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [openSections, setOpenSections] = useState({
    listingType: true,
    priceRange: true,
    categories: true,
    locations: true,
    bhk: true,
    bathrooms: true,
  });

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedSubLocation, setSelectedSubLocation] = useState(null);

  const [openCountries, setOpenCountries] = useState(new Set());
  const [openStates, setOpenStates] = useState(new Set());
  const [openCities, setOpenCities] = useState(new Set());

  const itemsPerPage = 8;

  // Price range computation
  const priceRange = useMemo(() => {
    const categoryHouses = allHouses.filter(currentCategory.filter);
    const prices = categoryHouses.map((h) => h.price).filter(Boolean);
    if (prices.length === 0) return { min: 0, max: 1000000 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [allHouses, currentCategory]);

  // Set initial min/max prices
  useEffect(() => {
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
  }, [priceRange.min, priceRange.max]);

  // === Derived filter option lists ===
  const propertyTypeOptions = useMemo(() => {
    const categoryHouses = allHouses.filter(currentCategory.filter);
    const s = new Set(categoryHouses.map((h) => h.propertyType));
    return Array.from(s);
  }, [allHouses, currentCategory]);

  // bedroom and bathroom option labels
  const bedroomOptionLabels = ["1", "2", "3", "4+"];
  const bathroomOptionLabels = ["1", "2", "3", "4+"];

  // compute counts for each option
  const counts = useMemo(() => {
    const categoryHouses = allHouses.filter(currentCategory.filter);
    const c = {
      propertyTypes: {},
      locations: {},
      bedrooms: {},
      bathrooms: {},
    };

    categoryHouses.forEach((h) => {
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
  }, [allHouses, currentCategory]);

  // Toggle open functions
  const toggleOpenCountry = (id) => {
    setOpenCountries((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleOpenState = (id) => {
    setOpenStates((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleOpenCity = (id) => {
    setOpenCities((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Effect to open path to selected
  useEffect(() => {
    if (selectedCountry) {
      setOpenCountries((prev) => new Set([...prev, selectedCountry.id]));
    }
    if (selectedState) {
      setOpenStates((prev) => new Set([...prev, selectedState.id]));
    }
    if (selectedCity) {
      setOpenCities((prev) => new Set([...prev, selectedCity.id]));
    }
  }, [selectedCountry, selectedState, selectedCity]);

  // === Effects ===
  useEffect(() => {
    setCurrentPage(1);
  }, [
    propertyTypesSelected,
    bedroomsSelected,
    bathroomsSelected,
    minPrice,
    maxPrice,
    selectedCountry,
    selectedState,
    selectedCity,
    selectedSubLocation,
    listingType,
    searchTerm,
    sortBy,
  ]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedHouses") || "[]");
    setSavedHouses(saved);
  }, []);

  // === Handlers for checkbox toggles ===
  const toggleSetItem = (setObj, value) => {
    setObj((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const togglePropertyType = (value) =>
    toggleSetItem(setPropertyTypesSelected, value);
  const toggleBedroom = (value) => toggleSetItem(setBedroomsSelected, value);
  const toggleBathroom = (value) => toggleSetItem(setBathroomsSelected, value);

  const toggleSave = (house, e) => {
    e.stopPropagation();
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
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
    setListingType("all");
    setSearchTerm("");
    setSortBy("newest");
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedSubLocation(null);
  };

  // MultiRangeSlider Component
  const MultiRangeSlider = ({ min, max, value, onChange }) => {
    const { min: minVal, max: maxVal } = value;
    const minValRef = useRef(null);
    const maxValRef = useRef(null);
    const range = useRef(null);

    // Convert to percentage
    const getPercent = useCallback(
      (value) => Math.round(((value - min) / (max - min)) * 100),
      [min, max]
    );

    // Set width of the range to decrease from the left side
    useEffect(() => {
      if (maxValRef.current) {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(Number(maxValRef.current.value));

        if (range.current) {
          range.current.style.left = `${minPercent}%`;
          range.current.style.width = `${maxPercent - minPercent}%`;
        }
      }
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
      if (minValRef.current) {
        const minPercent = getPercent(Number(minValRef.current.value));
        const maxPercent = getPercent(maxVal);

        if (range.current) {
          range.current.style.width = `${maxPercent - minPercent}%`;
        }
      }
    }, [maxVal, getPercent]);

    const zIndexClass =
      minVal > max - 100 ? "thumb--zindex-5" : "thumb--zindex-3";

    return (
      <div className="slider mb-4">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
        <div className="slider__left-value">${minVal.toLocaleString()}</div>
        <div className="slider__right-value">${maxVal.toLocaleString()}</div>

        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          ref={minValRef}
          onChange={(event) => {
            const newValue = Math.min(Number(event.target.value), maxVal - 1);
            onChange({ min: newValue, max: maxVal });
          }}
          className={`thumb ${zIndexClass}`}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          ref={maxValRef}
          onChange={(event) => {
            const newValue = Math.max(Number(event.target.value), minVal + 1);
            onChange({ min: minVal, max: newValue });
          }}
          className="thumb thumb--zindex-4"
        />
      </div>
    );
  };

  // === Filtering logic ===
  const filteredHouses = allHouses.filter((house) => {
    // First apply category filter
    if (!currentCategory.filter(house)) return false;

    const matchesSearch =
      searchTerm === "" ||
      house.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.location.toLowerCase().includes(searchTerm.toLowerCase());

    // property type check
    const propertyTypeMatch =
      propertyTypesSelected.size === 0 ||
      propertyTypesSelected.has(house.propertyType);

    // bedrooms check
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
    const matchesPrice = house.price >= minPrice && house.price <= maxPrice;
    // listing type
    const matchesListingType =
      listingType === "all" || house.type === listingType;
    // location - hierarchical
    let matchesLocation = true;
    if (selectedSubLocation) {
      matchesLocation = house.location === selectedSubLocation;
    } else if (selectedCity) {
      matchesLocation = selectedCity.subLocations.includes(house.location);
    } else if (selectedState) {
      const allSublocsInState = selectedState.cities.flatMap(
        (c) => c.subLocations
      );
      matchesLocation = allSublocsInState.includes(house.location);
    } else if (selectedCountry) {
      const allSublocsInCountry = selectedCountry.states.flatMap((s) =>
        s.cities.flatMap((c) => c.subLocations)
      );
      matchesLocation = allSublocsInCountry.includes(house.location);
    }

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

  // Handle card click to navigate to details
  const handleCardClick = (houseId) => {
    navigate(`/housing/${houseId}`);
  };

  // small helper to show count with fallback 0
  const cnt = (obj, key) => (obj && obj[key]) || 0;

  // Slider CSS
  const sliderCSS = `
    .slider {
      position: relative;
      width: 100%;
    }
    .slider__track,
    .slider__range {
      border-radius: 3px;
      height: 5px;
      position: absolute;
    }
    .slider__track {
      background-color: #d1d5db;
      width: 100%;
      z-index: 1;
    }
    .slider__range {
      background-color: #2563EB;
      z-index: 2;
    }
    /* Removing the default appearance */
    .thumb,
    .thumb::-webkit-slider-thumb {
      -webkit-appearance: none;
      -webkit-tap-highlight-color: transparent;
    }
    .thumb {
      pointer-events: none;
      position: absolute;
      height: 0;
      width: 100%;
      outline: none;
    }
    .thumb--zindex-3 {
      z-index: 3;
    }
    .thumb--zindex-4 {
      z-index: 4;
    }
    .thumb--zindex-5 {
      z-index: 5;
    }
    /* For Chrome browsers */
    .thumb::-webkit-slider-thumb {
      background-color: #ffffff;
      border: none;
      border-radius: 50%;
      box-shadow: 0 0 1px 1px #d1d5db;
      cursor: pointer;
      height: 18px;
      width: 18px;
      margin-top: 4px;
      pointer-events: all;
      position: relative;
    }
    /* For Firefox browsers */
    .thumb::-moz-range-thumb {
      background-color: #ffffff;
      border: none;
      border-radius: 50%;
      box-shadow: 0 0 1px 1px #d1d5db;
      cursor: pointer;
      height: 18px;
      width: 18px;
      margin-top: 4px;
      pointer-events: all;
      position: relative;
    }
    .slider__left-value,
    .slider__right-value {
      color: #4b5563;
      font-size: 12px;
      margin-top: 20px;
      position: absolute;
    }
    .slider__left-value {
      left: 0;
    }
    .slider__right-value {
      right: 0;
    }
  `;

  return (
    <>
      <style>{sliderCSS}</style>
      <div className="max-w-7xl mx-auto bg-white pt-24 mt-10   ">
        {/* Header */}
          <div className=" px-4 py-4">
            {/* Breadcrumb Navigation */}
         

            {/* Simple Popular Searches - just text */}
            {/* <div className="mb-3">
              <span className="text-sm text-gray-600">
                <span className="text-black font-medium">
                  Popular Searches:
                </span>{" "}
                {popularCities.join(", ")}
              </span>
            </div> */}

            {/* Title Section */}
            {/* <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {category ? currentCategory.name : "Flats for Rent"}: Houses,
                Apartments and Flats{" "}
                {category === "apts-for-rent"
                  ? "for rent"
                  : category === "real-estate-for-sale"
                  ? "for sale"
                  : "available"}{" "}
                in Kerala
              </h1>
            </div> */}
        </div>

        {/* Top filter bar */}
        <div className=" flex  sticky top-24 z-30">
          <div className=" px-4">
            <div className="flex flex-wrap items-end justify-end py-3">
              {/* <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Properties for{" "}
                  {listingType === "all" ? "Rent & Sale" : listingType}
                </span>
                <span className="text-sm text-gray-600">
                  {sortedHouses.length} properties found
                </span>
              </div> */}

              



            </div>
          </div>
        </div>


<div className="flex items-center justify-between  w-full gap-4">


     <div className="flex items-center space-x-2 text-md">
              <Link to="/" className="hover:text-[#2563EB]">
                Home
              </Link>
              <ChevronRightSmall className="w-4 h-4" />
              <Link to="/housing" className="hover:text-[#2563EB]">
                Housing
              </Link>
              {category && (
                <>
                  <ChevronRightSmall className="w-4 h-4" />
                  <span className="text-gray-900 font-medium capitalize">
                    {currentCategory.name}
                  </span>
                </>
              )}
            </div>
               <div>
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
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="newest">Latest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
               </div>
              </div>


        {/* Main container: Sidebar + Content */}
        <div className=" px-4 py-6 lg:flex gap-6">
          {/* Sidebar - shown on lg as left column; on mobile it's a sliding panel when showFilters */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block lg:flex-none lg:basis-[25%]`}
          >
            <div className=" rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Filters</h3>
                <button
                  className="text-xs text-gray-500 lg:hidden"
                  onClick={() => setShowFilters(false)}
                >
                  Close
                </button>
              </div>


               {/* Categories / Property Types */}
              <div className="border-t border-gray-100 pt-7 mt-3">
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
                  <div className="mt-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
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

              <div className="bg-gray-400 w-full h-[1px] my-5" />

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
                    <MultiRangeSlider
                      min={priceRange.min}
                      max={priceRange.max}
                      value={{ min: minPrice, max: maxPrice }}
                      onChange={({ min, max }) => {
                        setMinPrice(min);
                        setMaxPrice(max);
                      }}
                    />
                  </div>
                )}
              </div>



              <div className="bg-gray-400 w-full h-[1px] my-5" />

              {/* Locations - Tree View */}
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
                  <div className="mt-3 space-y-1 max-h-60 overflow-y-auto">
                    {locationData.countries.map((country) => (
                      <div key={country.id}>
                        <div
                          className={`flex items-center justify-between py-1 cursor-pointer rounded hover:bg-gray-50 ${
                            selectedCountry?.id === country.id
                              ? "bg-blue-50 text-[#2563EB] font-medium"
                              : "text-gray-700"
                          }`}
                          onClick={() => {
                            setSelectedCountry(country);
                            setSelectedState(null);
                            setSelectedCity(null);
                            setSelectedSubLocation(null);
                            toggleOpenCountry(country.id);
                          }}
                        >
                          <span className="text-sm">{country.name}</span>
                          {country.states.length > 0 && (
                            <ChevronDown
                              className={`w-4 h-4 transform transition-transform ${
                                openCountries.has(country.id)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          )}
                        </div>
                        {openCountries.has(country.id) &&
                          country.states.map((state) => (
                            <div
                              key={state.id}
                              className="ml-4 border-l border-gray-200 pl-3"
                            >
                              <div
                                className={`flex items-center justify-between py-1 cursor-pointer rounded hover:bg-gray-50 ${
                                  selectedState?.id === state.id
                                    ? "bg-blue-50 text-[#2563EB] font-medium"
                                    : "text-gray-700"
                                }`}
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setSelectedState(state);
                                  setSelectedCity(null);
                                  setSelectedSubLocation(null);
                                  toggleOpenState(state.id);
                                }}
                              >
                                <span className="text-sm">{state.name}</span>
                                {state.cities.length > 0 && (
                                  <ChevronDown
                                    className={`w-4 h-4 transform transition-transform ${
                                      openStates.has(state.id)
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                )}
                              </div>
                              {openStates.has(state.id) &&
                                state.cities.map((city) => (
                                  <div
                                    key={city.id}
                                    className="ml-6 border-l border-gray-200 pl-3"
                                  >
                                    <div
                                      className={`flex items-center justify-between py-1 cursor-pointer rounded hover:bg-gray-50 ${
                                        selectedCity?.id === city.id
                                          ? "bg-blue-50 text-[#2563EB] font-medium"
                                          : "text-gray-700"
                                      }`}
                                      onClick={() => {
                                        setSelectedCountry(country);
                                        setSelectedState(state);
                                        setSelectedCity(city);
                                        setSelectedSubLocation(null);
                                        toggleOpenCity(city.id);
                                      }}
                                    >
                                      <span className="text-sm">
                                        {city.name}
                                      </span>
                                      {city.subLocations.length > 0 && (
                                        <ChevronDown
                                          className={`w-4 h-4 transform transition-transform ${
                                            openCities.has(city.id)
                                              ? "rotate-180"
                                              : ""
                                          }`}
                                        />
                                      )}
                                    </div>
                                    {openCities.has(city.id) && (
                                      <div className="ml-8 space-y-1">
                                        {city.subLocations.map((subLoc) => {
                                          const count =
                                            counts.locations[subLoc] || 0;
                                          const isSelected =
                                            selectedSubLocation === subLoc;
                                          return (
                                            <div
                                              key={subLoc}
                                              className={`flex justify-between py-1 cursor-pointer rounded hover:bg-gray-50 text-sm ${
                                                isSelected
                                                  ? "bg-blue-50 text-[#2563EB] font-medium"
                                                  : "text-gray-700"
                                              }`}
                                              onClick={() => {
                                                setSelectedCountry(country);
                                                setSelectedState(state);
                                                setSelectedCity(city);
                                                setSelectedSubLocation(subLoc);
                                              }}
                                            >
                                              <span>{subLoc}</span>
                                              <span className="text-gray-400 text-xs">
                                                ({count.toLocaleString()})
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Clear Location Filter */}
                {(selectedCountry ||
                  selectedState ||
                  selectedCity ||
                  selectedSubLocation) && (
                  <button
                    onClick={() => {
                      setSelectedCountry(null);
                      setSelectedState(null);
                      setSelectedCity(null);
                      setSelectedSubLocation(null);
                    }}
                    className="w-full mt-3 text-sm px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600"
                  >
                    Clear Location Filter
                  </button>
                )}
              </div>

              <div className="bg-gray-400 w-full h-[1px] my-5" />

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

              <div className="bg-gray-400 w-full h-[1px] my-5" />

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
          <main className="lg:flex-1">
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
                  className="bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors"
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
                        onClick={() => handleCardClick(house.id)}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
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
                            onClick={(e) => toggleSave(house, e)}
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
                            <span className="line-clamp-1">
                              {house.location}
                            </span>
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
                            <span className="text-lg font-bold text-[#2563EB]">
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
                              ? "bg-[#2563EB] text-white"
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
    </>
  );
}

export default HousingList;
