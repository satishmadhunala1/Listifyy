// src/components/ForSale.jsx
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
  Search,
  ChevronLeft,
  ChevronDown,
  ChevronRight as ChevronRightSmall,
  Filter,
  Heart,
} from "lucide-react";
import data from "../data/data.json";

function ForSale() {
  const navigate = useNavigate();
  const { category } = useParams(); // Get the category from URL params

  // Use marketplace data from JSON file
  const allItems = Array.isArray(data?.marketplace) ? data.marketplace : [];

  // Marketplace subcategory mapping
  const marketplaceSubcategories = {
    "electronics": {
      name: "Electronics",
      filter: (item) => item.category === "electronics",
    },
    "clothing": {
      name: "Clothing",
      filter: (item) => item.category === "clothing",
    },
    "furniture": {
      name: "Furniture",
      filter: (item) => item.category === "furniture",
    },
    "all": {
      name: "All Items",
      filter: () => true,
    },
  };

  // Get current category info
  const currentCategory = marketplaceSubcategories[category] || marketplaceSubcategories["all"];

  // Popular searches for searches - adjust based on category
  const popularSearches = useMemo(() => {
    const searches = ["Electronics", "Clothing", "Books", "Furniture", "Sports"];
    return category === "furniture"
      ? ["Sofa", "Table", "Chair", "Bed", "Desk"]
      : searches;
  }, [category]);

  // === State Management ===
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriesSelected, setCategoriesSelected] = useState(new Set());
  const [conditionsSelected, setConditionsSelected] = useState(new Set());
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [listingType, setListingType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [savedItems, setSavedItems] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [openSections, setOpenSections] = useState({
    listingType: true,
    priceRange: true,
    categories: true,
    locations: true,
    conditions: true,
  });

  const [selectedLocation, setSelectedLocation] = useState(null);

  const itemsPerPage = 8;

  // Parse price safely
  const parsePrice = useCallback((priceString) => {
    if (!priceString || priceString === "Free" || priceString === "Negotiable") return 0;
    try {
      return parseInt(priceString.replace(/[$,]/g, ""), 10) || 0;
    } catch {
      return 0;
    }
  }, []);

  // Price range computation
  const priceRange = useMemo(() => {
    const categoryItems = allItems.filter(currentCategory.filter);
    const prices = categoryItems.map((item) => parsePrice(item.price)).filter(p => p > 0);
    if (prices.length === 0) return { min: 0, max: 10000 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [allItems, currentCategory, parsePrice]);

  // Set initial min/max prices
  useEffect(() => {
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
  }, [priceRange.min, priceRange.max]);

  // === Derived filter option lists ===
  const categoryOptions = useMemo(() => {
    const categoryItems = allItems.filter(currentCategory.filter);
    const s = new Set(categoryItems.map((item) => item.category));
    return Array.from(s).filter(Boolean);
  }, [allItems, currentCategory]);

  // condition option labels
  const conditionOptionLabels = ["New", "Like New", "Good", "Fair", "Poor"];

  // compute counts for each option
  const counts = useMemo(() => {
    const categoryItems = allItems.filter(currentCategory.filter);
    const c = {
      categories: {},
      locations: {},
      conditions: {},
    };

    categoryItems.forEach((item) => {
      // categories
      if (item.category) c.categories[item.category] = (c.categories[item.category] || 0) + 1;
      // locations
      if (item.location) c.locations[item.location] = (c.locations[item.location] || 0) + 1;
      // conditions
      if (item.condition) c.conditions[item.condition] = (c.conditions[item.condition] || 0) + 1;
    });

    return c;
  }, [allItems, currentCategory]);

  // === Effects ===
  useEffect(() => {
    setCurrentPage(1);
  }, [
    categoriesSelected,
    conditionsSelected,
    minPrice,
    maxPrice,
    selectedLocation,
    listingType,
    searchTerm,
    sortBy,
  ]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedItems") || "[]");
    setSavedItems(saved);
  }, []);

  useEffect(() => {
    const loadSaved = () => {
      const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
      setSavedItems(saved);
    };
    window.addEventListener('savedItemsChanged', loadSaved);
    return () => window.removeEventListener('savedItemsChanged', loadSaved);
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

  const toggleCategory = (value) => toggleSetItem(setCategoriesSelected, value);
  const toggleCondition = (value) => toggleSetItem(setConditionsSelected, value);

  const toggleSave = (item, e) => {
    e.stopPropagation();
    let newSaved;
    const isSaved = savedItems.some((i) => i.id === item.id);
    if (isSaved) {
      newSaved = savedItems.filter((i) => i.id !== item.id);
    } else {
      newSaved = [...savedItems, item];
    }
    setSavedItems(newSaved);
    localStorage.setItem("savedItems", JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent('savedItemsChanged'));
  };

  const resetFilters = () => {
    setCategoriesSelected(new Set());
    setConditionsSelected(new Set());
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
    setListingType("all");
    setSearchTerm("");
    setSortBy("newest");
    setSelectedLocation(null);
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
  const filteredItems = allItems.filter((item) => {
    // First apply category filter
    if (!currentCategory.filter(item)) return false;

    const matchesSearch =
      searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchTerm.toLowerCase());

    // category check
    const categoryMatch =
      categoriesSelected.size === 0 ||
      categoriesSelected.has(item.category);

    // conditions check
    let conditionsMatch = true;
    if (conditionsSelected.size > 0) {
      conditionsMatch = conditionsSelected.has(item.condition);
    }

    // price
    const itemPrice = parsePrice(item.price);
    const matchesPrice = itemPrice >= minPrice && itemPrice <= maxPrice;
    // listing type
    const matchesListingType =
      listingType === "all" || item.type === listingType;
    // location
    const matchesLocation = !selectedLocation || item.location === selectedLocation;

    return (
      matchesSearch &&
      categoryMatch &&
      conditionsMatch &&
      matchesPrice &&
      matchesListingType &&
      matchesLocation
    );
  });

  // === Sort logic ===
  const sortedItems = [...filteredItems].sort((a, b) => {
    const priceA = parsePrice(a.price);
    const priceB = parsePrice(b.price);
    switch (sortBy) {
      case "price-low":
        return priceA - priceB;
      case "price-high":
        return priceB - priceA;
      case "condition":
        const conditionOrder = {
          New: 5,
          "Like New": 4,
          Good: 3,
          Fair: 2,
          Poor: 1,
        };
        return (
          (conditionOrder[b.condition] || 0) -
          (conditionOrder[a.condition] || 0)
        );
      case "newest":
      default:
        return b.id - a.id;
    }
  });

  // === Pagination ===
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle card click to navigate to details
  const handleCardClick = (itemId) => {
    navigate(`/for-sale/${itemId}`);
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

  // Get condition badge color
  const getConditionColor = (condition) => {
    switch (condition) {
      case "New":
        return "bg-green-100 text-green-800";
      case "Like New":
        return "bg-blue-100 text-blue-800";
      case "Good":
        return "bg-emerald-100 text-emerald-800";
      case "Fair":
        return "bg-yellow-100 text-yellow-800";
      case "Poor":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get type badge color and text
  const getTypeInfo = (type) => {
    switch (type) {
      case "sale":
        return { color: "bg-red-100 text-red-800", text: "For Sale" };
      case "free":
        return { color: "bg-green-100 text-green-800", text: "Free" };
      case "wanted":
        return { color: "bg-purple-100 text-purple-800", text: "Wanted" };
      default:
        return { color: "bg-gray-100 text-gray-800", text: type };
    }
  };

  // Different images for different item types
  const getItemImage = (item) => {
    const itemType = item.type || "sale";
    const itemTitle = item.title || "";
    // Different image categories based on item type and title
    if (itemType === "sale") {
      if (
        itemTitle.toLowerCase().includes("jeans") ||
        itemTitle.toLowerCase().includes("clothing")
      ) {
        return "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("phone") ||
        itemTitle.toLowerCase().includes("electronic")
      ) {
        return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80";
      } else if (itemTitle.toLowerCase().includes("book")) {
        return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("furniture") ||
        itemTitle.toLowerCase().includes("table") ||
        itemTitle.toLowerCase().includes("sofa")
      ) {
        return "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("game") ||
        itemTitle.toLowerCase().includes("console")
      ) {
        return "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("sport") ||
        itemTitle.toLowerCase().includes("basketball") ||
        itemTitle.toLowerCase().includes("tennis")
      ) {
        return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("car") ||
        itemTitle.toLowerCase().includes("tire") ||
        itemTitle.toLowerCase().includes("motorcycle")
      ) {
        return "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (itemTitle.toLowerCase().includes("plant")) {
        return "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else {
        return "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      }
    } else if (itemType === "free") {
      return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    } else if (itemType === "wanted") {
      return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    }
    return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
  };

  return (
    <>
      <style>{sliderCSS}</style>
      <div className="max-w-7xl mx-auto bg-white pt-14 ">
        {/* Header */}
          <div className=" px-4 py-4">
            {/* Breadcrumb Navigation */}
         

            {/* Simple Popular Searches - just text */}
            <div className="mb-3">
              <span className="text-sm text-gray-600">
                <span className="text-black font-medium">
                  Popular Searches:
                </span>{" "}
                {popularSearches.join(", ")}
              </span>
            </div>

            {/* Title Section */}
            {/* <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {category ? currentCategory.name : "Marketplace"} Items
              </h1>
            </div> */}
        </div>

        {/* Top filter bar */}
        <div className=" flex  sticky  z-30">
            <div className="flex flex-wrap items-end justify-end py-3">
              {/* <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Items for{" "}
                  {listingType === "all" ? "Sale & Free" : listingType}
                </span>
                <span className="text-sm text-gray-600">
                  {sortedItems.length} items found
                </span>
              </div> */}
            </div>
        </div>


<div className="  flex items-center justify-between  w-full gap-4  px-8 ">
     <div className="flex items-center space-x-2 text-md">
              <Link to="/" className="hover:text-[#2563EB]">
                Home
              </Link>
              <ChevronRightSmall className="w-4 h-4" />
              <Link to="/for-sale" className="hover:text-[#2563EB]">
                Marketplace
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
                  <option value="condition">Best Condition</option>
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
                    {categoryOptions.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center justify-between py-2 text-sm text-gray-700"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={categoriesSelected.has(cat)}
                            onChange={() => toggleCategory(cat)}
                            className="w-4 h-4 border-gray-300 rounded-sm"
                          />
                          <span className="capitalize">{cat}</span>
                        </div>
                        <span className="text-gray-400 text-xs">
                          ({cnt(counts.categories, cat)})
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
                    {["all", "sale", "free"].map((type) => (
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
                              : type === "sale"
                              ? "For Sale"
                              : "Free"}
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
                    {[...new Set(allItems.map(item => item.location).filter(Boolean))].map((loc) => (
                      <div
                        key={loc}
                        className={`flex justify-between py-1 cursor-pointer rounded hover:bg-gray-50 ${
                          selectedLocation === loc
                            ? "bg-blue-50 text-[#2563EB] font-medium"
                            : "text-gray-700"
                        }`}
                        onClick={() => {
                          setSelectedLocation(selectedLocation === loc ? null : loc);
                        }}
                      >
                        <span className="text-sm">{loc}</span>
                        <span className="text-gray-400 text-xs">
                          ({cnt(counts.locations, loc)})
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Clear Location Filter */}
                {selectedLocation && (
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="w-full mt-3 text-sm px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600"
                  >
                    Clear Location Filter
                  </button>
                )}
              </div>

              <div className="bg-gray-400 w-full h-[1px] my-5" />

              {/* Conditions */}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <button
                  className="w-full flex items-center justify-between text-left"
                  onClick={() =>
                    setOpenSections((prev) => ({ ...prev, conditions: !prev.conditions }))
                  }
                >
                  <span className="text-sm font-medium">Condition</span>
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      openSections.conditions ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.conditions && (
                  <div className="mt-3">
                    {conditionOptionLabels.map((cond) => (
                      <label
                        key={cond}
                        className="flex items-center justify-between py-2 text-sm text-gray-700"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={conditionsSelected.has(cond)}
                            onChange={() => toggleCondition(cond)}
                            className="w-4 h-4 border-gray-300 rounded-sm"
                          />
                          <span>{cond}</span>
                        </div>
                        <span className="text-gray-400 text-xs">
                          ({cnt(counts.conditions, cond)})
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
            {/* Items Grid */}
            {sortedItems.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No items found
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
                  {currentItems.map((item) => {
                    const typeInfo = getTypeInfo(item.type);
                    const isSaved = savedItems.some((i) => i.id === item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleCardClick(item.id)}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="relative">
                          <img
                            src={getItemImage(item)}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${typeInfo.color}`}
                            >
                              {typeInfo.text}
                            </span>
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                              {item.posted || "Unknown"}
                            </span>
                          </div>
                          <button
                            onClick={(e) => toggleSave(item, e)}
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
                            {item.title}
                          </h3>

                          <div className="flex items-center text-gray-500 mb-2 text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1">
                              {item.location}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className={`text-lg font-bold text-[#2563EB]`}>
                              {item.price}
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

export default ForSale;