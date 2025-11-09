// src/components/ServicesList.jsx
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
  Star,
  Briefcase,
} from "lucide-react";
import { servicesData } from "../jsonData/index.js";
import { locationData } from "../jsonData/locations.js";

function ServicesList() {
  const navigate = useNavigate();
  const { category } = useParams();

  // Use services data from JSON file
  const allServices = servicesData.services;

  // Enhanced services subcategory mapping
  const servicesSubcategories = {
    "home-services": {
      name: "Home Services",
      filter: (service) => ["cleaning", "repair", "moving"].includes(extractServiceType(service)),
    },
    "professional-services": {
      name: "Professional Services",
      filter: (service) => ["technical", "creative", "education"].includes(extractServiceType(service)),
    },
    "health-fitness": {
      name: "Health & Fitness",
      filter: (service) => ["health", "fitness"].includes(extractServiceType(service)),
    },
    "pet-services": {
      name: "Pet Services",
      filter: (service) => extractServiceType(service) === "pet",
    },
    "creative-services": {
      name: "Creative Services",
      filter: (service) => ["creative", "design"].includes(extractServiceType(service)),
    },
    "technical-services": {
      name: "Technical Services",
      filter: (service) => ["technical", "development"].includes(extractServiceType(service)),
    },
    "general-services": {
      name: "General Services",
      filter: () => true,
    },
  };

  // Get current category info
  const currentCategory = servicesSubcategories[category] || {
    name: "Services",
    filter: () => true,
  };

  // Enhanced state management - matching CommunityList functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceTypesSelected, setServiceTypesSelected] = useState(new Set());
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [experienceFilter, setExperienceFilter] = useState("all"); // all, beginner, intermediate, expert
  const [currentPage, setCurrentPage] = useState(1);
  const [savedServices, setSavedServices] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [openSections, setOpenSections] = useState({
    serviceType: true,
    priceRange: true,
    experience: true,
    rating: true,
    locations: true,
  });

  // New state for current service type in breadcrumb and filtering
  const [currentServiceType, setCurrentServiceType] = useState(null);
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

  // Clear service type when category changes
  useEffect(() => {
    setCurrentServiceType(null);
    setBreadcrumbHistory([]);
  }, [category]);

  // Enhanced service type extraction with fallback
  const extractServiceType = (service) => {
    const title = service.title.toLowerCase();
    const description = service.description.toLowerCase();

    if (title.includes("clean") || description.includes("clean")) return "cleaning";
    if (title.includes("repair") || description.includes("repair") || 
        title.includes("fix") || description.includes("fix")) return "repair";
    if (title.includes("dog") || title.includes("pet") || 
        description.includes("dog") || description.includes("pet")) return "pet";
    if (title.includes("design") || title.includes("photo") || 
        title.includes("creative") || description.includes("design")) return "creative";
    if (title.includes("tutor") || title.includes("lesson") || 
        description.includes("learn") || description.includes("teach")) return "education";
    if (title.includes("train") || title.includes("fitness") || 
        title.includes("yoga") || description.includes("fitness")) return "health";
    if (title.includes("web") || title.includes("seo") || 
        title.includes("development") || description.includes("technical")) return "technical";
    if (title.includes("move") || description.includes("moving")) return "moving";
    if (title.includes("garden") || description.includes("landscap")) return "gardening";
    
    return "professional";
  };

  // Extract rating from service (for demo purposes)
  const extractRating = (service) => {
    const ratings = [4.2, 4.5, 4.8, 4.0, 4.7, 4.9, 4.3, 4.6];
    return ratings[service.id % ratings.length];
  };

  // Extract experience level from description
  const extractExperience = (service) => {
    const description = service.description.toLowerCase();
    if (description.includes("expert") || description.includes("professional") || description.includes("certified"))
      return "expert";
    if (description.includes("experienced") || description.includes("intermediate"))
      return "intermediate";
    if (description.includes("beginner") || description.includes("new"))
      return "beginner";
    return "intermediate"; // default
  };

  // Enhanced service type options with counts
  const serviceTypeOptions = useMemo(() => {
    const categoryServices = allServices.filter(currentCategory.filter);
    const types = categoryServices.map(extractServiceType);
    const typeCounts = types.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(typeCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([type, count]) => ({ type, count }));
  }, [allServices, currentCategory]);

  // Enhanced counts computation
  const counts = useMemo(() => {
    const categoryServices = allServices.filter(currentCategory.filter);
    const c = {
      serviceTypes: {},
      locations: {},
      prices: { min: 0, max: 0 },
      experience: { beginner: 0, intermediate: 0, expert: 0 },
      ratings: { high: 0, medium: 0, low: 0 },
    };

    categoryServices.forEach((s) => {
      const serviceType = extractServiceType(s);
      c.serviceTypes[serviceType] = (c.serviceTypes[serviceType] || 0) + 1;
      c.locations[s.location] = (c.locations[s.location] || 0) + 1;

      const experience = extractExperience(s);
      c.experience[experience] = (c.experience[experience] || 0) + 1;

      const rating = extractRating(s);
      if (rating >= 4.5) c.ratings.high++;
      else if (rating >= 4.0) c.ratings.medium++;
      else c.ratings.low++;
    });

    // Calculate price range
    const prices = categoryServices.map((s) => {
      const priceStr = s.pay || "$0";
      return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0;
    }).filter(p => p > 0);
    
    c.prices.min = prices.length ? Math.min(...prices) : 0;
    c.prices.max = prices.length ? Math.max(...prices) : 1000;

    return c;
  }, [allServices, currentCategory]);

  // Initialize price range
  useEffect(() => {
    setPriceRange({
      min: counts.prices.min,
      max: counts.prices.max,
    });
  }, [counts.prices.min, counts.prices.max]);

  // MultiRangeSlider Component (same as CommunityList)
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

    const zIndexClass = minVal > max - 100 ? "thumb--zindex-5" : "thumb--zindex-3";

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

  // Enhanced filtering logic with service type filtering
  const filteredServices = useMemo(() => {
    return allServices.filter((service) => {
      // First apply category filter
      if (!currentCategory.filter(service)) return false;

      // Apply service type filter from breadcrumb
      if (currentServiceType) {
        const serviceType = extractServiceType(service);
        if (serviceType !== currentServiceType) return false;
      }

      const matchesSearch =
        searchTerm === "" ||
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());

      const serviceType = extractServiceType(service);
      const serviceTypeMatch =
        serviceTypesSelected.size === 0 || serviceTypesSelected.has(serviceType);

      // Price filtering
      const servicePrice = parseInt((service.pay || "$0").replace(/[^0-9]/g, ""), 10) || 0;
      const matchesPrice =
        servicePrice >= priceRange.min && servicePrice <= priceRange.max;

      // Experience filtering
      const experience = extractExperience(service);
      const matchesExperience =
        experienceFilter === "all" ||
        (experienceFilter === "beginner" && experience === "beginner") ||
        (experienceFilter === "intermediate" && experience === "intermediate") ||
        (experienceFilter === "expert" && experience === "expert");

      // Rating filtering
      const rating = extractRating(service);
      const matchesRating = true; // Add rating filter logic if needed

      // Location - hierarchical
      let matchesLocation = true;
      if (selectedSubLocation) {
        matchesLocation = service.location === selectedSubLocation;
      } else if (selectedCity) {
        matchesLocation = selectedCity.subLocations.includes(service.location);
      } else if (selectedState) {
        const allSublocsInState = selectedState.cities.flatMap(
          (c) => c.subLocations
        );
        matchesLocation = allSublocsInState.includes(service.location);
      } else if (selectedCountry) {
        const allSublocsInCountry = selectedCountry.states.flatMap((s) =>
          s.cities.flatMap((c) => c.subLocations)
        );
        matchesLocation = allSublocsInCountry.includes(service.location);
      }

      return (
        matchesSearch &&
        serviceTypeMatch &&
        matchesPrice &&
        matchesExperience &&
        matchesRating &&
        matchesLocation
      );
    });
  }, [
    allServices,
    currentCategory,
    currentServiceType,
    searchTerm,
    serviceTypesSelected,
    priceRange,
    experienceFilter,
    selectedCountry,
    selectedState,
    selectedCity,
    selectedSubLocation,
  ]);

  // Enhanced sorting options
  const sortedServices = [...filteredServices].sort((a, b) => {
    const priceA = parseInt((a.pay || "$0").replace(/[^0-9]/g, ""), 10) || 0;
    const priceB = parseInt((b.pay || "$0").replace(/[^0-9]/g, ""), 10) || 0;
    const ratingA = extractRating(a);
    const ratingB = extractRating(b);

    switch (sortBy) {
      case "price-low":
        return priceA - priceB;
      case "price-high":
        return priceB - priceA;
      case "rating":
        return ratingB - ratingA;
      case "newest":
      default:
        return b.id - a.id;
    }
  });

  // Pagination
  const indexOfLastService = currentPage * itemsPerPage;
  const indexOfFirstService = indexOfLastService - itemsPerPage;
  const currentServices = sortedServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(sortedServices.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Enhanced handlers
  const toggleSave = (service, e) => {
    e.stopPropagation();
    let newSaved;
    const isSaved = savedServices.some((h) => h.id === service.id);
    if (isSaved) {
      newSaved = savedServices.filter((h) => h.id !== service.id);
    } else {
      newSaved = [...savedServices, service];
    }
    setSavedServices(newSaved);
    localStorage.setItem("savedServices", JSON.stringify(newSaved));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setServiceTypesSelected(new Set());
    setPriceRange({ min: counts.prices.min, max: counts.prices.max });
    setExperienceFilter("all");
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedSubLocation(null);
    setSortBy("newest");
    setCurrentServiceType(null);
    setBreadcrumbHistory([]);
  };

  // Handle service type click for breadcrumb and filtering
  const handleServiceTypeClick = (serviceType) => {
    setCurrentServiceType(serviceType);
    setCurrentPage(1);
    setBreadcrumbHistory(prev => [...prev, { type: 'serviceType', value: serviceType }]);
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (breadcrumbItem, index) => {
    if (breadcrumbItem.type === 'serviceType') {
      setCurrentServiceType(breadcrumbItem.value);
      setBreadcrumbHistory(prev => prev.slice(0, index));
    }
  };

  // Clear service type filter
  const clearServiceTypeFilter = () => {
    setCurrentServiceType(null);
    setBreadcrumbHistory([]);
  };

  // Handle service card click
  const handleServiceCardClick = (service) => {
    const serviceType = extractServiceType(service);
    setCurrentServiceType(serviceType);
    setBreadcrumbHistory([{ type: 'serviceType', value: serviceType }]);
    navigate(`/services/${service.id}`);
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

  // Get service type badge color
  const getServiceTypeColor = (serviceType) => {
    switch (serviceType) {
      case "cleaning":
        return "bg-blue-100 text-blue-800";
      case "repair":
        return "bg-orange-100 text-orange-800";
      case "pet":
        return "bg-green-100 text-green-800";
      case "creative":
        return "bg-purple-100 text-purple-800";
      case "education":
        return "bg-indigo-100 text-indigo-800";
      case "health":
        return "bg-red-100 text-red-800";
      case "technical":
        return "bg-teal-100 text-teal-800";
      case "moving":
        return "bg-amber-100 text-amber-800";
      case "gardening":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get experience badge color
  const getExperienceColor = (experience) => {
    switch (experience) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= Math.floor(rating)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Different images for different service types
  const getServiceImage = (service) => {
    const serviceType = extractServiceType(service);

    switch (serviceType) {
      case "cleaning":
        return "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "repair":
        return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "pet":
        return "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "creative":
        return "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "education":
        return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "health":
        return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "technical":
        return "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "moving":
        return "https://images.unsplash.com/photo-1541976590-713941681591?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "gardening":
        return "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      default:
        return "https://images.unsplash.com/photo-1551135049-8a33b5883817?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
    }
  };

  // small helper to show count with fallback 0
  const cnt = (obj, key) => (obj && obj[key]) || 0;

  // Slider CSS (same as CommunityList)
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
              <Link to="/services" className="hover:text-[#2563EB]">
                Services
              </Link>
              {category && (
                <>
                  <ChevronRightSmall className="w-4 h-4" />
                  <Link 
                    to={`/services/${category}`}
                    className="hover:text-[#2563EB] capitalize"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentServiceType(null);
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
              {currentServiceType && breadcrumbHistory.length === 0 && (
                <>
                  <ChevronRightSmall className="w-4 h-4" />
                  <span className="text-gray-900 font-medium capitalize">
                    {currentServiceType}
                  </span>
                </>
              )}
            </div>

            {/* Active Filter Badge */}
            {currentServiceType && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Filtered by:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getServiceTypeColor(currentServiceType)}`}>
                  {currentServiceType}
                </span>
                <button
                  onClick={clearServiceTypeFilter}
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
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              <span className="text-black font-medium">Popular Services:</span>{" "}
              {["Cleaning", "Repair", "Tutoring", "Pet Care"].join(", ")}
            </span>
            <span className="text-sm text-gray-600">
              Showing {sortedServices.length} service{sortedServices.length !== 1 ? 's' : ''}
              {currentServiceType && ` in ${currentServiceType}`}
            </span>
          </div>
        </div>

        {/* Main container: Sidebar + Content */}
        <div className="px-4 py-6 lg:flex gap-6">
          {/* Enhanced Sidebar with CommunityList-style filters */}
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
                    placeholder="Search services..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Service Types */}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <button
                  className="w-full flex items-center justify-between text-left"
                  onClick={() =>
                    setOpenSections((prev) => ({
                      ...prev,
                      serviceType: !prev.serviceType,
                    }))
                  }
                >
                  <span className="text-sm font-medium">Service Types</span>
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      openSections.serviceType ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openSections.serviceType && (
                  <div className="mt-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {serviceTypeOptions.map(({ type, count }) => (
                      <div key={type} className="flex items-center justify-between py-2 text-sm text-gray-700">
                        <div className="flex items-center space-x-2 flex-1">
                          <input
                            type="checkbox"
                            checked={serviceTypesSelected.has(type)}
                            onChange={() => {
                              const newSet = new Set(serviceTypesSelected);
                              if (newSet.has(type)) {
                                newSet.delete(type);
                              } else {
                                newSet.add(type);
                              }
                              setServiceTypesSelected(newSet);
                            }}
                            className="w-4 h-4 border-gray-300 rounded-sm"
                          />
                          <button
                            onClick={() => handleServiceTypeClick(type)}
                            className={`capitalize text-left transition-colors flex-1 ${
                              currentServiceType === type 
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

              {/* Experience Level */}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <button
                  className="w-full flex items-center justify-between text-left"
                  onClick={() =>
                    setOpenSections((prev) => ({
                      ...prev,
                      experience: !prev.experience,
                    }))
                  }
                >
                  <span className="text-sm font-medium">Experience Level</span>
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      openSections.experience ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.experience && (
                  <div className="mt-3 space-y-2">
                    {[
                      {
                        value: "all",
                        label: "All Levels",
                        count: sortedServices.length,
                      },
                      {
                        value: "beginner",
                        label: "Beginner",
                        count: cnt(counts.experience, "beginner"),
                      },
                      {
                        value: "intermediate",
                        label: "Intermediate",
                        count: cnt(counts.experience, "intermediate"),
                      },
                      {
                        value: "expert",
                        label: "Expert",
                        count: cnt(counts.experience, "expert"),
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center justify-between py-2 text-sm text-gray-700"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="experience"
                            checked={experienceFilter === option.value}
                            onChange={() => setExperienceFilter(option.value)}
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

              {/* Rating Filter */}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <button
                  className="w-full flex items-center justify-between text-left"
                  onClick={() =>
                    setOpenSections((prev) => ({
                      ...prev,
                      rating: !prev.rating,
                    }))
                  }
                >
                  <span className="text-sm font-medium">Minimum Rating</span>
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      openSections.rating ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.rating && (
                  <div className="mt-3 space-y-2">
                    {[
                      { value: "all", label: "Any Rating", count: sortedServices.length },
                      { value: "4", label: "4+ Stars", count: cnt(counts.ratings, "high") + cnt(counts.ratings, "medium") },
                      { value: "3", label: "3+ Stars", count: sortedServices.length },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center justify-between py-2 text-sm text-gray-700"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="rating"
                            checked={experienceFilter === option.value}
                            onChange={() => setExperienceFilter(option.value)}
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
            {/* Services Grid */}
            {sortedServices.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No services found
                </h3>
                <p className="text-gray-600 mb-6">
                  {currentServiceType 
                    ? `No ${currentServiceType} services match your search criteria`
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
                  {currentServices.map((service) => {
                    const isSaved = savedServices.some((h) => h.id === service.id);
                    const serviceType = extractServiceType(service);
                    const experience = extractExperience(service);
                    const rating = extractRating(service);
                    const reviewCount = Math.floor(Math.random() * 50) + 5; // Random review count for demo

                    return (
                      <div
                        key={service.id}
                        onClick={() => handleServiceCardClick(service)}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="relative">
                          <img
                            src={getServiceImage(service)}
                            alt={service.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 left-2 flex gap-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getServiceTypeColor(
                                serviceType
                              )}`}
                            >
                              {serviceType}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getExperienceColor(
                                experience
                              )}`}
                            >
                              {experience}
                            </span>
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                              {service.posted || "Available"}
                            </span>
                          </div>
                          <button
                            onClick={(e) => toggleSave(service, e)}
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
                            {service.title}
                          </h3>

                          <div className="flex items-center text-gray-500 mb-2 text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1">
                              {service.location}
                            </span>
                          </div>

                          <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                            {service.description}
                          </p>

                          <div className="flex items-center justify-between text-gray-500 mb-2 text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                <Briefcase className="w-3 h-3 mr-1" />
                                <span className="capitalize">{experience}</span>
                              </div>
                              {renderStars(rating)}
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-green-600">
                              {service.pay}
                            </span>
                            <div className="flex items-center text-gray-500 text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              <span>{reviewCount} reviews</span>
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

export default ServicesList;