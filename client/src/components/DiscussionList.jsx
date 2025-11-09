// src/components/DiscussionList.jsx
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
  MessageCircle,
  User,
  Eye,
  ThumbsUp,
} from "lucide-react";
import data from "../data/data.json";
import { locationData } from "../jsonData/locations.js";

function DiscussionList() {
  const navigate = useNavigate();
  const { category } = useParams();

  // Use discussion data from JSON file
  const allDiscussions = data.discussionForums;

  // Discussion subcategory mapping
  const discussionSubcategories = {
    outdoors: {
      name: "Outdoors & Nature",
      filter: (discussion) =>
        discussion.topic.toLowerCase().includes("park") ||
        discussion.topic.toLowerCase().includes("hiking") ||
        discussion.topic.toLowerCase().includes("garden") ||
        discussion.topic.toLowerCase().includes("trail") ||
        discussion.topic.toLowerCase().includes("beach"),
    },
    "food-drink": {
      name: "Food & Drink",
      filter: (discussion) =>
        discussion.topic.toLowerCase().includes("restaurant") ||
        discussion.topic.toLowerCase().includes("food") ||
        discussion.topic.toLowerCase().includes("brewery") ||
        discussion.topic.toLowerCase().includes("cooking") ||
        discussion.topic.toLowerCase().includes("coffee"),
    },
    fitness: {
      name: "Fitness & Sports",
      filter: (discussion) =>
        discussion.topic.toLowerCase().includes("running") ||
        discussion.topic.toLowerCase().includes("fitness") ||
        discussion.topic.toLowerCase().includes("yoga") ||
        discussion.topic.toLowerCase().includes("sports") ||
        discussion.topic.toLowerCase().includes("gym"),
    },
    "arts-crafts": {
      name: "Arts & Crafts",
      filter: (discussion) =>
        discussion.topic.toLowerCase().includes("art") ||
        discussion.topic.toLowerCase().includes("craft") ||
        discussion.topic.toLowerCase().includes("pottery") ||
        discussion.topic.toLowerCase().includes("photography") ||
        discussion.topic.toLowerCase().includes("dance"),
    },
    entertainment: {
      name: "Entertainment",
      filter: (discussion) =>
        discussion.topic.toLowerCase().includes("music") ||
        discussion.topic.toLowerCase().includes("theater") ||
        discussion.topic.toLowerCase().includes("event") ||
        discussion.topic.toLowerCase().includes("movie") ||
        discussion.topic.toLowerCase().includes("festival"),
    },
    education: {
      name: "Education & Learning",
      filter: (discussion) =>
        discussion.topic.toLowerCase().includes("book") ||
        discussion.topic.toLowerCase().includes("tech") ||
        discussion.topic.toLowerCase().includes("coding") ||
        discussion.topic.toLowerCase().includes("workshop") ||
        discussion.topic.toLowerCase().includes("class"),
    },
    community: {
      name: "General Community",
      filter: (discussion) => true,
    },
  };

  // Get current category info
  const currentCategory = discussionSubcategories[category] || {
    name: "Discussions",
    filter: () => true,
  };

  // Enhanced state management - matching CommunityList functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [discussionTypesSelected, setDiscussionTypesSelected] = useState(
    new Set()
  );
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [popularityFilter, setPopularityFilter] = useState("all"); // all, low, medium, high
  const [currentPage, setCurrentPage] = useState(1);
  const [savedDiscussions, setSavedDiscussions] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [openSections, setOpenSections] = useState({
    discussionType: true,
    dateRange: true,
    popularity: true,
    locations: true,
  });

  // New state for current discussion type in breadcrumb and filtering
  const [currentDiscussionType, setCurrentDiscussionType] = useState(null);
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

  // Clear discussion type when category changes
  useEffect(() => {
    setCurrentDiscussionType(null);
    setBreadcrumbHistory([]);
  }, [category]);

  // Enhanced discussion type extraction
  const extractDiscussionType = (discussion) => {
    const topic = discussion.topic.toLowerCase();

    if (
      topic.includes("park") ||
      topic.includes("hiking") ||
      topic.includes("garden") ||
      topic.includes("trail")
    )
      return "outdoors";
    if (
      topic.includes("restaurant") ||
      topic.includes("food") ||
      topic.includes("brewery") ||
      topic.includes("cooking")
    )
      return "food-drink";
    if (
      topic.includes("running") ||
      topic.includes("fitness") ||
      topic.includes("yoga") ||
      topic.includes("sports")
    )
      return "fitness";
    if (
      topic.includes("art") ||
      topic.includes("craft") ||
      topic.includes("pottery") ||
      topic.includes("photography")
    )
      return "arts-crafts";
    if (
      topic.includes("music") ||
      topic.includes("theater") ||
      topic.includes("event") ||
      topic.includes("movie")
    )
      return "entertainment";
    if (
      topic.includes("book") ||
      topic.includes("tech") ||
      topic.includes("coding") ||
      topic.includes("workshop")
    )
      return "education";

    return "community";
  };

  // Extract popularity level from comments count
  const extractPopularity = (discussion) => {
    const comments = discussion.comments || 0;
    if (comments > 20) return "high";
    if (comments > 10) return "medium";
    return "low";
  };

  // Enhanced discussion type options with counts
  const discussionTypeOptions = useMemo(() => {
    const categoryDiscussions = allDiscussions.filter(currentCategory.filter);
    const types = categoryDiscussions.map(extractDiscussionType);
    const typeCounts = types.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(typeCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([type, count]) => ({ type, count }));
  }, [allDiscussions, currentCategory]);

  // Enhanced counts computation
  const counts = useMemo(() => {
    const categoryDiscussions = allDiscussions.filter(currentCategory.filter);
    const c = {
      discussionTypes: {},
      locations: {},
      popularity: { low: 0, medium: 0, high: 0 },
    };

    categoryDiscussions.forEach((d) => {
      const discussionType = extractDiscussionType(d);
      c.discussionTypes[discussionType] =
        (c.discussionTypes[discussionType] || 0) + 1;

      const popularity = extractPopularity(d);
      c.popularity[popularity] = (c.popularity[popularity] || 0) + 1;
    });

    return c;
  }, [allDiscussions, currentCategory]);

  // Generate description from topic
  const generateDescription = (topic) => {
    return `Join the discussion about ${topic.toLowerCase()}. Share your experiences, ask questions, and connect with others interested in this topic.`;
  };

  // Generate engagement metrics
  const getEngagementMetrics = (discussion) => {
    // Generate consistent metrics based on discussion ID for demo
    const baseViews = (discussion.id % 300) * 50 + 500;
    const baseLikes = (discussion.id % 100) + 10;

    return {
      views: baseViews,
      likes: baseLikes,
      comments: discussion.comments || 0,
    };
  };

  // MultiRangeSlider Component (for potential future use)
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
        <div className="slider__left-value">{minVal}</div>
        <div className="slider__right-value">{maxVal}</div>

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

  // Enhanced filtering logic with discussion type filtering
  const filteredDiscussions = useMemo(() => {
    return allDiscussions.filter((discussion) => {
      // First apply category filter
      if (!currentCategory.filter(discussion)) return false;

      // Apply discussion type filter from breadcrumb
      if (currentDiscussionType) {
        const discussionType = extractDiscussionType(discussion);
        if (discussionType !== currentDiscussionType) return false;
      }

      const matchesSearch =
        searchTerm === "" ||
        discussion.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        generateDescription(discussion.topic)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const discussionType = extractDiscussionType(discussion);
      const discussionTypeMatch =
        discussionTypesSelected.size === 0 ||
        discussionTypesSelected.has(discussionType);

      // Date filtering
      const discussionDate = new Date(discussion.posted);
      const matchesDate =
        !dateRange.start ||
        !dateRange.end ||
        (discussionDate >= new Date(dateRange.start) &&
          discussionDate <= new Date(dateRange.end));

      // Popularity filtering
      const popularity = extractPopularity(discussion);
      const matchesPopularity =
        popularityFilter === "all" ||
        (popularityFilter === "low" && popularity === "low") ||
        (popularityFilter === "medium" && popularity === "medium") ||
        (popularityFilter === "high" && popularity === "high");

      // Location filtering (simplified for discussions)
      let matchesLocation = true;

      return (
        matchesSearch &&
        discussionTypeMatch &&
        matchesDate &&
        matchesPopularity &&
        matchesLocation
      );
    });
  }, [
    allDiscussions,
    currentCategory,
    currentDiscussionType,
    searchTerm,
    discussionTypesSelected,
    dateRange,
    popularityFilter,
  ]);

  // Enhanced sorting options
  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    const dateA = new Date(a.posted);
    const dateB = new Date(b.posted);
    const commentsA = a.comments || 0;
    const commentsB = b.comments || 0;
    const engagementA = getEngagementMetrics(a);
    const engagementB = getEngagementMetrics(b);

    switch (sortBy) {
      case "popular":
        return engagementB.views - engagementA.views;
      case "comments":
        return commentsB - commentsA;
      case "engagement":
        return (
          engagementB.likes +
          engagementB.comments -
          (engagementA.likes + engagementA.comments)
        );
      case "title":
        return a.topic.localeCompare(b.topic);
      case "newest":
      default:
        return dateB - dateA;
    }
  });

  // Pagination
  const indexOfLastDiscussion = currentPage * itemsPerPage;
  const indexOfFirstDiscussion = indexOfLastDiscussion - itemsPerPage;
  const currentDiscussions = sortedDiscussions.slice(
    indexOfFirstDiscussion,
    indexOfLastDiscussion
  );
  const totalPages = Math.ceil(sortedDiscussions.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Enhanced handlers
  const toggleSave = (discussion, e) => {
    e.stopPropagation();
    let newSaved;
    const isSaved = savedDiscussions.some((d) => d.id === discussion.id);
    if (isSaved) {
      newSaved = savedDiscussions.filter((d) => d.id !== discussion.id);
    } else {
      newSaved = [...savedDiscussions, discussion];
    }
    setSavedDiscussions(newSaved);
    localStorage.setItem("savedDiscussions", JSON.stringify(newSaved));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDiscussionTypesSelected(new Set());
    setDateRange({ start: "", end: "" });
    setPopularityFilter("all");
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedSubLocation(null);
    setSortBy("newest");
    setCurrentDiscussionType(null);
    setBreadcrumbHistory([]);
  };

  // Handle discussion type click for breadcrumb and filtering
  const handleDiscussionTypeClick = (discussionType) => {
    setCurrentDiscussionType(discussionType);
    setCurrentPage(1);
    setBreadcrumbHistory((prev) => [
      ...prev,
      { type: "discussionType", value: discussionType },
    ]);
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (breadcrumbItem, index) => {
    if (breadcrumbItem.type === "discussionType") {
      setCurrentDiscussionType(breadcrumbItem.value);
      setBreadcrumbHistory((prev) => prev.slice(0, index));
    }
  };

  // Clear discussion type filter
  const clearDiscussionTypeFilter = () => {
    setCurrentDiscussionType(null);
    setBreadcrumbHistory([]);
  };

  // Handle discussion card click - UPDATED TO MATCH ROUTE
  const handleDiscussionCardClick = (discussion) => {
    const discussionType = extractDiscussionType(discussion);
    setCurrentDiscussionType(discussionType);
    setBreadcrumbHistory([{ type: "discussionType", value: discussionType }]);
    navigate(`/discussions/${discussion.id}`);
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

  // Get discussion type badge color
  const getDiscussionTypeColor = (discussionType) => {
    switch (discussionType) {
      case "outdoors":
        return "bg-green-100 text-green-800";
      case "food-drink":
        return "bg-orange-100 text-orange-800";
      case "fitness":
        return "bg-blue-100 text-blue-800";
      case "arts-crafts":
        return "bg-purple-100 text-purple-800";
      case "entertainment":
        return "bg-pink-100 text-pink-800";
      case "education":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get discussion image
  const getDiscussionImage = (discussion) => {
    if (discussion.images && discussion.images.length > 0) {
      return discussion.images[0];
    }

    const discussionType = extractDiscussionType(discussion);
    switch (discussionType) {
      case "outdoors":
        return "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "food-drink":
        return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "fitness":
        return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "arts-crafts":
        return "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "entertainment":
        return "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      case "education":
        return "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      default:
        return "https://images.unsplash.com/photo-1551135049-8a33b5883817?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
    }
  };

  // Get popularity badge color
  const getPopularityColor = (popularity) => {
    switch (popularity) {
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
              <Link to="/discussions" className="hover:text-[#2563EB]">
                Discussions
              </Link>
              {category && (
                <>
                  <ChevronRightSmall className="w-4 h-4" />
                  <Link
                    to={`/discussions/${category}`}
                    className="hover:text-[#2563EB] capitalize"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentDiscussionType(null);
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
              {currentDiscussionType && breadcrumbHistory.length === 0 && (
                <>
                  <ChevronRightSmall className="w-4 h-4" />
                  <span className="text-gray-900 font-medium capitalize">
                    {currentDiscussionType}
                  </span>
                </>
              )}
            </div>

            {/* Active Filter Badge */}
            {currentDiscussionType && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Filtered by:</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getDiscussionTypeColor(
                    currentDiscussionType
                  )}`}
                >
                  {currentDiscussionType}
                </span>
                <button
                  onClick={clearDiscussionTypeFilter}
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
                <option value="popular">Most Popular</option>
                <option value="comments">Most Comments</option>
                <option value="engagement">Most Engagement</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              <span className="text-black font-medium">Popular Topics:</span>{" "}
              {["Parks", "Restaurants", "Fitness", "Local Events"].join(", ")}
            </span>
            <span className="text-sm text-gray-600">
              Showing {sortedDiscussions.length} discussion
              {sortedDiscussions.length !== 1 ? "s" : ""}
              {currentDiscussionType && ` in ${currentDiscussionType}`}
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
                    placeholder="Search discussions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Discussion Types */}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <button
                  className="w-full flex items-center justify-between text-left"
                  onClick={() =>
                    setOpenSections((prev) => ({
                      ...prev,
                      discussionType: !prev.discussionType,
                    }))
                  }
                >
                  <span className="text-sm font-medium">Discussion Types</span>
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      openSections.discussionType ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openSections.discussionType && (
                  <div className="mt-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {discussionTypeOptions.map(({ type, count }) => (
                      <div
                        key={type}
                        className="flex items-center justify-between py-2 text-sm text-gray-700"
                      >
                        <div className="flex items-center space-x-2 flex-1">
                          <input
                            type="checkbox"
                            checked={discussionTypesSelected.has(type)}
                            onChange={() => {
                              const newSet = new Set(discussionTypesSelected);
                              if (newSet.has(type)) {
                                newSet.delete(type);
                              } else {
                                newSet.add(type);
                              }
                              setDiscussionTypesSelected(newSet);
                            }}
                            className="w-4 h-4 border-gray-300 rounded-sm"
                          />
                          <button
                            onClick={() => handleDiscussionTypeClick(type)}
                            className={`capitalize text-left transition-colors flex-1 ${
                              currentDiscussionType === type
                                ? "text-[#2563EB] font-medium"
                                : "hover:text-[#2563EB]"
                            }`}
                          >
                            {type.replace("-", " ")}
                          </button>
                        </div>
                        <span className="text-gray-400 text-xs">({count})</span>
                      </div>
                    ))}
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
                  <span className="text-sm font-medium">Date Posted</span>
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

              {/* Popularity Level */}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <button
                  className="w-full flex items-center justify-between text-left"
                  onClick={() =>
                    setOpenSections((prev) => ({
                      ...prev,
                      popularity: !prev.popularity,
                    }))
                  }
                >
                  <span className="text-sm font-medium">Popularity Level</span>
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      openSections.popularity ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.popularity && (
                  <div className="mt-3 space-y-2">
                    {[
                      {
                        value: "all",
                        label: "All Levels",
                        count: sortedDiscussions.length,
                      },
                      {
                        value: "low",
                        label: "Low Activity",
                        count: cnt(counts.popularity, "low"),
                      },
                      {
                        value: "medium",
                        label: "Medium Activity",
                        count: cnt(counts.popularity, "medium"),
                      },
                      {
                        value: "high",
                        label: "High Activity",
                        count: cnt(counts.popularity, "high"),
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center justify-between py-2 text-sm text-gray-700"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="popularity"
                            checked={popularityFilter === option.value}
                            onChange={() => setPopularityFilter(option.value)}
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
            {/* Discussions Grid */}
            {sortedDiscussions.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No discussions found
                </h3>
                <p className="text-gray-600 mb-6">
                  {currentDiscussionType
                    ? `No ${currentDiscussionType} discussions match your search criteria`
                    : "Try adjusting your search criteria or filters"}
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
                  {currentDiscussions.map((discussion) => {
                    const isSaved = savedDiscussions.some(
                      (d) => d.id === discussion.id
                    );
                    const discussionType = extractDiscussionType(discussion);
                    const popularity = extractPopularity(discussion);
                    const engagement = getEngagementMetrics(discussion);

                    return (
                      <div
                        key={discussion.id}
                        onClick={() => handleDiscussionCardClick(discussion)}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="relative">
                          <img
                            src={getDiscussionImage(discussion)}
                            alt={discussion.topic}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 left-2 flex gap-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getDiscussionTypeColor(
                                discussionType
                              )}`}
                            >
                              {discussionType.replace("-", " ")}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getPopularityColor(
                                popularity
                              )}`}
                            >
                              {popularity}
                            </span>
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                              {formatDate(discussion.posted)}
                            </span>
                          </div>
                          <button
                            onClick={(e) => toggleSave(discussion, e)}
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
                            {discussion.topic}
                          </h3>

                          <div className="flex items-center text-gray-500 mb-2 text-xs">
                            <User className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1">
                              {discussion.author}
                            </span>
                          </div>

                          <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                            {generateDescription(discussion.topic)}
                          </p>

                          <div className="flex items-center justify-between text-gray-500 mb-2 text-xs">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center">
                                <MessageCircle className="w-3 h-3 mr-1 text-blue-500" />
                                <span>{engagement.comments}</span>
                              </div>
                              <div className="flex items-center">
                                <ThumbsUp className="w-3 h-3 mr-1 text-green-500" />
                                <span>{engagement.likes}</span>
                              </div>
                              <div className="flex items-center">
                                <Eye className="w-3 h-3 mr-1 text-purple-500" />
                                <span>{engagement.views}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-[#2563EB]">
                              {engagement.comments} comments
                            </span>
                            <div className="flex items-center text-gray-500 text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{formatDate(discussion.posted)}</span>
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

export default DiscussionList;
