// src/components/CommunityList.jsx
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
  Calendar,
  Users,
  Clock,
  DollarSign,
} from "lucide-react";
import { communityData } from "../jsonData/index.js";
import { locationData } from "../jsonData/locations.js";

function CommunityList() {
  const navigate = useNavigate();
  const { category } = useParams();

  // Use community data from JSON file
  const allEvents = communityData.events;

  // Enhanced community subcategory mapping
  const communitySubcategories = {
    "community-events": {
      name: "Community Events",
      filter: (event) => event.type === "event" || !event.type,
    },
    "volunteer-opportunities": {
      name: "Volunteer Opportunities",
      filter: (event) => event.type === "volunteer",
    },
    "classes-workshops": {
      name: "Classes & Workshops",
      filter: (event) =>
        event.type === "workshop" || event.category === "education",
    },
    "activities-groups": {
      name: "Activities & Groups",
      filter: (event) =>
        event.type === "activity" || event.category === "social",
    },
    "lost-found": {
      name: "Lost & Found",
      filter: (event) => event.type === "lostfound",
    },
    "local-news": {
      name: "Local News",
      filter: (event) => event.type === "news",
    },
    "general-community": {
      name: "General Community",
      filter: (event) => event.type === "general" || !event.type,
    },
  };

  // Get current category info
  const currentCategory = communitySubcategories[category] || {
    name: "Community",
    filter: () => true,
  };

  // Enhanced state management - matching HousingList functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypesSelected, setEventTypesSelected] = useState(new Set());
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [attendanceFilter, setAttendanceFilter] = useState("all"); // all, low, medium, high
  const [currentPage, setCurrentPage] = useState(1);
  const [savedEvents, setSavedEvents] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [openSections, setOpenSections] = useState({
    eventType: true,
    priceRange: true,
    dateRange: true,
    attendance: true,
    locations: true,
  });

  // New state for current event type in breadcrumb and filtering
  const [currentEventType, setCurrentEventType] = useState(null);
  const [breadcrumbHistory, setBreadcrumbHistory] = useState([]);

  // Location filters
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedSubLocation, setSelectedSubLocation] = useState(null);

  const [openCountries, setOpenCountries] = useState(new Set());
  const [openStates, setOpenStates] = useState(new Set());
  const [openCities, setOpenCities] = useState(new Set());

  const itemsPerPage = 12;

  // Clear event type when category changes
  useEffect(() => {
    setCurrentEventType(null);
    setBreadcrumbHistory([]);
  }, [category]);

  // Enhanced event type extraction with fallback
  const extractEventType = (event) => {
    if (event.category) return event.category;

    const title = event.title.toLowerCase();
    const description = event.description.toLowerCase();

    if (title.includes("garden") || description.includes("garden"))
      return "gardening";
    if (
      title.includes("book") ||
      description.includes("book") ||
      title.includes("education")
    )
      return "education";
    if (
      title.includes("cleanup") ||
      description.includes("clean") ||
      title.includes("volunteer")
    )
      return "volunteer";
    if (
      title.includes("art") ||
      description.includes("workshop") ||
      title.includes("craft")
    )
      return "arts";
    if (
      title.includes("dance") ||
      description.includes("music") ||
      title.includes("movie")
    )
      return "entertainment";
    if (
      title.includes("run") ||
      description.includes("fitness") ||
      title.includes("sports")
    )
      return "sports";
    if (
      title.includes("food") ||
      description.includes("cook") ||
      title.includes("restaurant")
    )
      return "food";
    if (
      title.includes("social") ||
      description.includes("meetup") ||
      description.includes("gathering")
    )
      return "social";

    return "community";
  };

  // Extract attendance level from description
  const extractAttendance = (event) => {
    const description = event.description.toLowerCase();
    if (
      description.includes("large") ||
      description.includes("crowd") ||
      description.includes("hundreds")
    )
      return "high";
    if (description.includes("medium") || description.includes("dozens"))
      return "medium";
    if (
      description.includes("small") ||
      description.includes("intimate") ||
      description.includes("few")
    )
      return "low";
    return "medium"; // default
  };

  // Enhanced event type options with counts
  const eventTypeOptions = useMemo(() => {
    const categoryEvents = allEvents.filter(currentCategory.filter);
    const types = categoryEvents.map(extractEventType);
    const typeCounts = types.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(typeCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([type, count]) => ({ type, count }));
  }, [allEvents, currentCategory]);

  // Enhanced counts computation
  const counts = useMemo(() => {
    const categoryEvents = allEvents.filter(currentCategory.filter);
    const c = {
      eventTypes: {},
      locations: {},
      prices: { min: 0, max: 0 },
      attendance: { low: 0, medium: 0, high: 0 },
    };

    categoryEvents.forEach((e) => {
      const eventType = extractEventType(e);
      c.eventTypes[eventType] = (c.eventTypes[eventType] || 0) + 1;
      c.locations[e.location] = (c.locations[e.location] || 0) + 1;

      const attendance = extractAttendance(e);
      c.attendance[attendance] = (c.attendance[attendance] || 0) + 1;
    });

    // Calculate price range
    const prices = categoryEvents.map((e) => e.price || 0).filter((p) => p > 0);
    c.prices.min = prices.length ? Math.min(...prices) : 0;
    c.prices.max = prices.length ? Math.max(...prices) : 1000;

    return c;
  }, [allEvents, currentCategory]);

  // Initialize price range
  useEffect(() => {
    setPriceRange({
      min: counts.prices.min,
      max: counts.prices.max,
    });
  }, [counts.prices.min, counts.prices.max]);

  // MultiRangeSlider Component (same as HousingList)
  const MultiRangeSlider = ({ min, max, value, onChange }) => {
    const { min: minVal, max: maxVal } = value;
    const minValRef = useRef(null);
    const maxValRef = useRef(null);
    const range = useRef(null);

    const getPercent = useCallback(
      (value) => Math.round(((value - min) / (max - min)) * 100),
      [min, max]
    );

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
        <div className="slider__left-value">${minVal}</div>
        <div className="slider__right-value">${maxVal}</div>

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

  // Enhanced filtering logic with event type filtering
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      // First apply category filter
      if (!currentCategory.filter(event)) return false;

      // Apply event type filter from breadcrumb
      if (currentEventType) {
        const eventType = extractEventType(event);
        if (eventType !== currentEventType) return false;
      }

      const matchesSearch =
        searchTerm === "" ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());

      const eventType = extractEventType(event);
      const eventTypeMatch =
        eventTypesSelected.size === 0 || eventTypesSelected.has(eventType);

      // Price filtering
      const eventPrice = event.price || 0;
      const matchesPrice =
        eventPrice >= priceRange.min && eventPrice <= priceRange.max;

      // Date filtering
      const eventDate = new Date(event.date);
      const matchesDate =
        !dateRange.start ||
        !dateRange.end ||
        (eventDate >= new Date(dateRange.start) &&
          eventDate <= new Date(dateRange.end));

      // Attendance filtering
      const attendance = extractAttendance(event);
      const matchesAttendance =
        attendanceFilter === "all" ||
        (attendanceFilter === "low" && attendance === "low") ||
        (attendanceFilter === "medium" && attendance === "medium") ||
        (attendanceFilter === "high" && attendance === "high");

      // Location - hierarchical
      let matchesLocation = true;
      if (selectedSubLocation) {
        matchesLocation = event.location === selectedSubLocation;
      } else if (selectedCity) {
        matchesLocation = selectedCity.subLocations.includes(event.location);
      } else if (selectedState) {
        const allSublocsInState = selectedState.cities.flatMap(
          (c) => c.subLocations
        );
        matchesLocation = allSublocsInState.includes(event.location);
      } else if (selectedCountry) {
        const allSublocsInCountry = selectedCountry.states.flatMap((s) =>
          s.cities.flatMap((c) => c.subLocations)
        );
        matchesLocation = allSublocsInCountry.includes(event.location);
      }

      return (
        matchesSearch &&
        eventTypeMatch &&
        matchesPrice &&
        matchesDate &&
        matchesAttendance &&
        matchesLocation
      );
    });
  }, [
    allEvents,
    currentCategory,
    currentEventType,
    searchTerm,
    eventTypesSelected,
    priceRange,
    dateRange,
    attendanceFilter,
    selectedCountry,
    selectedState,
    selectedCity,
    selectedSubLocation,
  ]);

  // Enhanced sorting options
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    switch (sortBy) {
      case "date-asc":
        return dateA - dateB;
      case "date-desc":
        return dateB - dateA;
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        return (b.price || 0) - (a.price || 0);
      case "title":
        return a.title.localeCompare(b.title);
      case "newest":
      default:
        return b.id - a.id;
    }
  });

  // Pagination
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Enhanced handlers
  const toggleSave = (event, e) => {
    e.stopPropagation();
    let newSaved;
    const isSaved = savedEvents.some((h) => h.id === event.id);
    if (isSaved) {
      newSaved = savedEvents.filter((h) => h.id !== event.id);
    } else {
      newSaved = [...savedEvents, event];
    }
    setSavedEvents(newSaved);
    localStorage.setItem("savedEvents", JSON.stringify(newSaved));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setEventTypesSelected(new Set());
    setPriceRange({ min: counts.prices.min, max: counts.prices.max });
    setDateRange({ start: "", end: "" });
    setAttendanceFilter("all");
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedSubLocation(null);
    setSortBy("newest");
    setCurrentEventType(null);
    setBreadcrumbHistory([]);
  };

  // Handle event type click for breadcrumb and filtering
  const handleEventTypeClick = (eventType) => {
    setCurrentEventType(eventType);
    setCurrentPage(1); // Reset to first page when filter changes
    // Add to breadcrumb history
    setBreadcrumbHistory(prev => [...prev, { type: 'eventType', value: eventType }]);
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (breadcrumbItem, index) => {
    if (breadcrumbItem.type === 'eventType') {
      // If clicking on event type in breadcrumb, filter by that type
      setCurrentEventType(breadcrumbItem.value);
      // Remove subsequent breadcrumbs
      setBreadcrumbHistory(prev => prev.slice(0, index));
    }
  };

  // Clear event type filter
  const clearEventTypeFilter = () => {
    setCurrentEventType(null);
    setBreadcrumbHistory([]);
  };

  // Handle event card click
  const handleEventCardClick = (event) => {
    const eventType = extractEventType(event);
    setCurrentEventType(eventType);
    setBreadcrumbHistory([{ type: 'eventType', value: eventType }]);
    navigate(`/community/${event.id}`);
  };

  // Helper functions for location tree
  const toggleOpenCountry = (countryId) => {
    const newOpenCountries = new Set(openCountries);
    if (newOpenCountries.has(countryId)) {
      newOpenCountries.delete(countryId);
    } else {
      newOpenCountries.add(countryId);
    }
    setOpenCountries(newOpenCountries);
  };

  const toggleOpenState = (stateId) => {
    const newOpenStates = new Set(openStates);
    if (newOpenStates.has(stateId)) {
      newOpenStates.delete(stateId);
    } else {
      newOpenStates.add(stateId);
    }
    setOpenStates(newOpenStates);
  };

  const toggleOpenCity = (cityId) => {
    const newOpenCities = new Set(openCities);
    if (newOpenCities.has(cityId)) {
      newOpenCities.delete(cityId);
    } else {
      newOpenCities.add(cityId);
    }
    setOpenCities(newOpenCities);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get event type badge color
  const getEventTypeColor = (eventType) => {
    switch (eventType) {
      case "gardening":
        return "bg-green-100 text-green-800";
      case "education":
        return "bg-blue-100 text-blue-800";
      case "volunteer":
        return "bg-purple-100 text-purple-800";
      case "arts":
        return "bg-pink-100 text-pink-800";
      case "entertainment":
        return "bg-yellow-100 text-yellow-800";
      case "sports":
        return "bg-red-100 text-red-800";
      case "social":
        return "bg-indigo-100 text-indigo-800";
      case "food":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Different images for different event types
  const getEventImage = (event) => {
    const eventType = extractEventType(event);

    switch (eventType) {
      case "gardening":
        return "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "education":
        return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "volunteer":
        return "https://images.unsplash.com/photo-1549923746-7c0bdf0955bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "arts":
        return "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "entertainment":
        return "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "sports":
        return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "social":
        return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "food":
        return "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      default:
        return "https://images.unsplash.com/photo-1551135049-8a33b5883817?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
    }
  };

  // Get attendance badge color
  const getAttendanceColor = (attendance) => {
    switch (attendance) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // small helper to show count with fallback 0
  const cnt = (obj, key) => (obj && obj[key]) || 0;

  // Slider CSS (same as HousingList)
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
      <div className="max-w-7xl mx-auto pt-24 mt-10">
        {/* Header */}
        <div className="px-4 py-4">
          {/* Enhanced Breadcrumb Navigation */}
          <div className="flex items-center justify-between w-full gap-4 mb-4">
            <div className="flex items-center space-x-2 text-md">
              <Link to="/" className="hover:text-[#2563EB]">
                Home
              </Link>
              <ChevronRightSmall className="w-4 h-4" />
              <Link to="/community" className="hover:text-[#2563EB]">
                Community
              </Link>
              {category && (
                <>
                  <ChevronRightSmall className="w-4 h-4" />
                  <Link 
                    to={`/community/${category}`}
                    className="hover:text-[#2563EB] capitalize"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentEventType(null);
                      setBreadcrumbHistory([]);
                    }}
                  >
                    {currentCategory.name}
                  </Link>
                </>
              )}
              {breadcrumbHistory.map((item, index) => (
                <React.Fragment key={index}>
                  <ChevronRightSmall className="w-4 h-4" />
                  <button
                    onClick={() => handleBreadcrumbClick(item, index)}
                    className="hover:text-[#2563EB] capitalize font-medium text-gray-900"
                  >
                    {item.value}
                  </button>
                </React.Fragment>
              ))}
              {currentEventType && breadcrumbHistory.length === 0 && (
                <>
                  <ChevronRightSmall className="w-4 h-4" />
                  <span className="text-gray-900 font-medium capitalize">
                    {currentEventType}
                  </span>
                </>
              )}
            </div>

            {/* Active Filter Badge */}
            {currentEventType && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Filtered by:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getEventTypeColor(currentEventType)}`}>
                  {currentEventType}
                </span>
                <button
                  onClick={clearEventTypeFilter}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  × Clear
                </button>
              </div>
            )}

            <div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm lg:hidden mr-4"
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
                <option value="date-asc">Date: Soonest First</option>
                <option value="date-desc">Date: Latest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              <span className="text-black font-medium">Popular Searches:</span>{" "}
              {["Gardening", "Workshops", "Volunteer", "Social Events"].join(
                ", "
              )}
            </span>
            <span className="text-sm text-gray-600">
              Showing {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''}
              {currentEventType && ` in ${currentEventType}`}
            </span>
          </div>
        </div>

        {/* Main container: Sidebar + Content */}
        <div className="px-4 py-6 lg:flex gap-6">
          {/* Enhanced Sidebar with HousingList-style filters */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block lg:flex-none lg:basis-[25%]`}
          >
            <div className="rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Filters</h3>
                <button
                  className="text-xs text-gray-500 lg:hidden"
                  onClick={() => setShowFilters(false)}
                >
                  Close
                </button>
              </div>

              {/* Search Filter */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search events..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Event Types */}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <button
                  className="w-full flex items-center justify-between text-left"
                  onClick={() =>
                    setOpenSections((prev) => ({
                      ...prev,
                      eventType: !prev.eventType,
                    }))
                  }
                >
                  <span className="text-sm font-medium">Event Types</span>
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      openSections.eventType ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openSections.eventType && (
                  <div className="mt-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {eventTypeOptions.map(({ type, count }) => (
                      <div key={type} className="flex items-center justify-between py-2 text-sm text-gray-700">
                        <div className="flex items-center space-x-2 flex-1">
                          <input
                            type="checkbox"
                            checked={eventTypesSelected.has(type)}
                            onChange={() => {
                              const newSet = new Set(eventTypesSelected);
                              if (newSet.has(type)) {
                                newSet.delete(type);
                              } else {
                                newSet.add(type);
                              }
                              setEventTypesSelected(newSet);
                            }}
                            className="w-4 h-4 border-gray-300 rounded-sm"
                          />
                          <button
                            onClick={() => handleEventTypeClick(type)}
                            className={`capitalize text-left transition-colors flex-1 ${
                              currentEventType === type 
                                ? 'text-[#2563EB] font-medium' 
                                : 'hover:text-[#2563EB]'
                            }`}
                          >
                            {type}
                          </button>
                        </div>
                        <span className="text-gray-400 text-xs">({count})</span>
                      </div>
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
                      min={counts.prices.min}
                      max={counts.prices.max}
                      value={priceRange}
                      onChange={setPriceRange}
                    />
                  </div>
                )}
              </div>

              <div className="bg-gray-400 w-full h-[1px] my-5" />

              {/* Date Range */}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <button
                  className="w-full flex items-center justify-between text-left"
                  onClick={() =>
                    setOpenSections((prev) => ({
                      ...prev,
                      dateRange: !prev.dateRange,
                    }))
                  }
                >
                  <span className="text-sm font-medium">Date Range</span>
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      openSections.dateRange ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.dateRange && (
                  <div className="mt-3 space-y-2">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        From
                      </label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) =>
                          setDateRange((prev) => ({
                            ...prev,
                            start: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        To
                      </label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) =>
                          setDateRange((prev) => ({
                            ...prev,
                            end: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-400 w-full h-[1px] my-5" />

              {/* Attendance Level */}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <button
                  className="w-full flex items-center justify-between text-left"
                  onClick={() =>
                    setOpenSections((prev) => ({
                      ...prev,
                      attendance: !prev.attendance,
                    }))
                  }
                >
                  <span className="text-sm font-medium">Attendance Level</span>
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      openSections.attendance ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.attendance && (
                  <div className="mt-3 space-y-2">
                    {[
                      {
                        value: "all",
                        label: "All Sizes",
                        count: sortedEvents.length,
                      },
                      {
                        value: "low",
                        label: "Small (Intimate)",
                        count: cnt(counts.attendance, "low"),
                      },
                      {
                        value: "medium",
                        label: "Medium",
                        count: cnt(counts.attendance, "medium"),
                      },
                      {
                        value: "high",
                        label: "Large (Crowd)",
                        count: cnt(counts.attendance, "high"),
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center justify-between py-2 text-sm text-gray-700"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="attendance"
                            checked={attendanceFilter === option.value}
                            onChange={() => setAttendanceFilter(option.value)}
                            className="w-4 h-4 border-gray-300 rounded-sm"
                          />
                          <span>{option.label}</span>
                        </div>
                        <span className="text-gray-400 text-xs">
                          ({option.count})
                        </span>
                      </label>
                    ))}
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
            {/* Events Grid */}
            {sortedEvents.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-gray-600 mb-6">
                  {currentEventType 
                    ? `No ${currentEventType} events match your search criteria`
                    : "Try adjusting your search criteria or filters"
                  }
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
                  {currentEvents.map((event) => {
                    const isSaved = savedEvents.some((h) => h.id === event.id);
                    const eventType = extractEventType(event);
                    const attendance = extractAttendance(event);

                    return (
                      <div
                        key={event.id}
                        onClick={() => handleEventCardClick(event)}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="relative">
                          <img
                            src={getEventImage(event)}
                            alt={event.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 left-2 flex gap-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getEventTypeColor(
                                eventType
                              )}`}
                            >
                              {eventType}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getAttendanceColor(
                                attendance
                              )}`}
                            >
                              {attendance}
                            </span>
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                              {formatDate(event.date)}
                            </span>
                          </div>
                          <button
                            onClick={(e) => toggleSave(event, e)}
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
                            {event.title}
                          </h3>

                          <div className="flex items-center text-gray-500 mb-2 text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1">
                              {event.location}
                            </span>
                          </div>

                          <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                            {event.description}
                          </p>

                          <div className="flex items-center justify-between text-gray-500 mb-2 text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              {event.price > 0 && (
                                <div className="flex items-center text-green-600 font-medium">
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  <span>${event.price}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-[#2563EB]">
                              {event.price === 0 || !event.price
                                ? "Free"
                                : `$${event.price}`}
                            </span>
                            <div className="flex items-center text-gray-500 text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              <span>{attendance} attendance</span>
                            </div>
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

export default CommunityList;