import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTh,
  FaUsers,
  FaShoppingBag,
  FaHome,
  FaBriefcase,
  FaCogs,
  FaGlobe,
  FaUserCircle,
  FaPlusCircle,
  FaMapMarkerAlt,
  FaChevronDown,
  FaCrosshairs,
  FaExclamationCircle,
} from "react-icons/fa";
import { ShimmerButton } from "./ui/shimmer-button";

const mainCategories = [
  { name: "All Categories", icon: FaTh, isAll: true },
  { name: "Community", icon: FaUsers, path: "/community" },
  { name: "For Sale", icon: FaShoppingBag, path: "/for-sale" },
  { name: "Housing", icon: FaHome, path: "/housing" },
  { name: "Jobs", icon: FaBriefcase, path: "/jobs" },
  { name: "Resumes", icon: FaBriefcase, path: "/resumes" },
  { name: "Gigs", icon: FaBriefcase, path: "/gigs" },
  { name: "Discussion Forums", icon: FaBriefcase, path: "/discussion-forums" },
  { name: "Services", icon: FaCogs, path: "/services" },
];

const locationData = [
  {
    country: "India",
    cities: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad"]
  },
  {
    country: "USA", 
    cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"]
  },
  {
    country: "UK",
    cities: ["London", "Manchester", "Birmingham", "Liverpool", "Glasgow"]
  },
  {
    country: "Canada",
    cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"]
  },
  {
    country: "Australia",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"]
  }
];

const languages = ["ENGLISH", "HINDI", "FRENCH"];

// Only the categories will rotate, "Search for" remains fixed
const searchCategories = [
  "Cars, Mobile Phones, Jobs...",
  "Homes, Furniture, Properties...", 
  "Jobs, Resumes, Services...",
  "Bikes, Electronics, Community...",
  "Fashion, Books, Gigs..."
];

const MergedNavbar = ({ onToggleAll, onHideAll }) => {
  const [location, setLocation] = useState("India");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [typedLocation, setTypedLocation] = useState("");

  const [language, setLanguage] = useState("ENGLISH");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState("opacity-100");
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const locationRef = useRef(null);
  const langRef = useRef(null);
  const searchInputRef = useRef(null);

  // Daily date update effect
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(() => {
      setCurrentDate(new Date());
      const interval = setInterval(() => {
        setCurrentDate(new Date());
      }, 24 * 60 * 60 * 1000);

      return () => clearInterval(interval);
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, [currentDate]);

  // Smooth rotating search categories effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setFadeClass("opacity-0");
      
      // After fade out completes, change text and fade in
      setTimeout(() => {
        setCurrentCategoryIndex((prevIndex) => 
          (prevIndex + 1) % searchCategories.length
        );
        setFadeClass("opacity-100");
      }, 500); // Wait for fade out to complete
    }, 3000); // Change every 3 seconds (total cycle: 3.5 seconds)

    return () => clearInterval(interval);
  }, []);

  // Show/hide placeholder based on search input
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setShowPlaceholder(false);
    } else {
      setShowPlaceholder(true);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim() === "") return alert("Please enter a search term!");
    alert(`Searching for: ${searchQuery} in ${location}`);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLangDropdown(false);
  };

  const handleUseCurrentLocation = () => {
    alert("Location blocked. Check browser/phone settings.");
  };

  // Filter locations based on search
  const filteredLocations = locationData.filter(item =>
    item.country.toLowerCase().includes(typedLocation.toLowerCase()) ||
    item.cities.some(city => city.toLowerCase().includes(typedLocation.toLowerCase()))
  );

  // Close location dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    };

    if (showLocationDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLocationDropdown]);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
    };

    if (showLangDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLangDropdown]);

  // Fixed All Categories click handler
  const handleAllCategoriesClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleAll) {
      onToggleAll();
    }
  };

  return (
    <>
      {/* ---------- TOP NAVBAR ---------- */}
      <header className="bg-white text-black shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-200 transition-all duration-300">
        <div className="px-6 h-20 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
          {/* ---- Logo ---- */}
          <div className="flex items-center space-x-3 min-w-[150px]">
            <Link
              to="/"
              className="text-3xl font-extrabold transition-all duration-200"
            >
              Listify
            </Link>
          </div>

          {/* ---- Location Dropdown ---- */}
          <div
            ref={locationRef}
            className="relative flex items-center bg-white border border-gray-300 rounded-full shadow-sm px-3 py-1.5 hover:shadow-md transition-all duration-200 w-[280px]"
          >
            <FaMapMarkerAlt className="mr-10 w-6 h-6 text-black" />
            <input
              type="text"
              value={typedLocation}
              onChange={(e) => setTypedLocation(e.target.value)}
              onFocus={() => setShowLocationDropdown(true)}
              placeholder="Select your location"
              className="w-25 h-10 text-sm bg-transparent outline-none placeholder-gray-500"
            />
            <FaChevronDown
              className={`ml-13 text-gray-600 transition-transform duration-200 w-6 h-6 cursor-pointer ${
                showLocationDropdown ? "rotate-180" : ""
              }`}
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            />

            {showLocationDropdown && (
              <div className="absolute left-0 top-full mt-2 w-[400px] bg-white border border-gray-200 rounded-lg shadow-xl animate-fadeIn z-50 max-h-96 overflow-y-auto">
                {/* Use Current Location */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={handleUseCurrentLocation}
                    className="flex items-center justify-between w-full px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaCrosshairs className="mr-3 text-blue-600 w-4 h-4" />
                      <span>Use current location</span>
                    </div>
                    <div className="flex items-center text-red-500">
                      <FaExclamationCircle className="mr-2 w-4 h-4" />
                      <span className="text-xs">Location blocked</span>
                    </div>
                  </button>
                </div>

                {/* Search Results or Popular Locations */}
                <div className="p-4">
                  {typedLocation ? (
                    // Search Results
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Search Results</h3>
                      {filteredLocations.length > 0 ? (
                        filteredLocations.map((item) => (
                          <div key={item.country} className="mb-4 last:mb-0">
                            <div className="flex items-center mb-2">
                              <FaMapMarkerAlt className="mr-2 text-gray-500 w-4 h-4" />
                              <span className="font-medium text-gray-800">{item.country}</span>
                            </div>
                            <div className="ml-6 space-y-1">
                              {item.cities
                                .filter(city => 
                                  city.toLowerCase().includes(typedLocation.toLowerCase()) ||
                                  item.country.toLowerCase().includes(typedLocation.toLowerCase())
                                )
                                .map((city) => (
                                  <button
                                    key={city}
                                    onClick={() => {
                                      setLocation(`${city}, ${item.country}`);
                                      setTypedLocation(`${city}, ${item.country}`);
                                      setShowLocationDropdown(false);
                                    }}
                                    className="block w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                                  >
                                    {city}
                                  </button>
                                ))
                              }
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No locations found
                        </div>
                      )}
                    </div>
                  ) : (
                    // Popular Locations
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">POPULAR LOCATIONS</h3>
                      {locationData.map((item) => (
                        <div key={item.country} className="mb-4 last:mb-0">
                          <div className="flex items-center mb-2">
                            <FaMapMarkerAlt className="mr-2 text-gray-500 w-4 h-4" />
                            <span className="font-medium text-gray-800">{item.country}</span>
                          </div>
                          <div className="ml-6 space-y-1">
                            {item.cities.map((city) => (
                              <button
                                key={city}
                                onClick={() => {
                                  setLocation(`${city}, ${item.country}`);
                                  setTypedLocation(`${city}, ${item.country}`);
                                  setShowLocationDropdown(false);
                                }}
                                className="block w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                              >
                                {city}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ---- Search Bar ---- */}
          <div className="flex-1 max-w-2xl relative flex items-center bg-white border border-gray-300 rounded-full shadow-sm px-3 py-2 transition-all">
            <div className="flex-1 relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-black px-4 py-2 focus:outline-none text-sm md:text-base w-full"
              />
              {showPlaceholder && (
                <div className="absolute inset-0 flex items-center pointer-events-none">
                  <span className="text-gray-500 px-4 py-2 text-sm md:text-base">
                    Search for{" "}
                    <span className={`text-gray-500 transition-opacity duration-1000 ease-in-out ${fadeClass}`}>
                      {searchCategories[currentCategoryIndex]}
                    </span>
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="text-black px-7 py-3 cursor-pointer rounded-full text-sm bg-[#FFCE32] font-semibold shadow-md transition-all duration-200"
            >
              Search
            </button>
          </div>

          {/* ---- Right: Language, Profile, Sell ---- */}
          <div className="flex items-center space-x-5 relative">
            {/* Language Selector */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center text-sm text-gray-700 transition-all"
              >
                <FaGlobe className="mr-2 w-5 h-5" />
                {language}
                <FaChevronDown
                  className={`ml-1 text-gray-600 transition-transform duration-200 w-5 h-5 ${
                    showLangDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showLangDropdown && (
                <div className="absolute right-1 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg animate-fadeIn overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`block w-full text-left px-4 py-2 text-sm cursor-pointer transition-colors duration-200 ${
                        lang === language 
                          ? "bg-blue-50 text-blue-600 font-medium" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <Link to="/profile" className="text-gray-700 transition-all">
              <FaUserCircle size={30} />
            </Link>

            {/* Sell Button */}
            <ShimmerButton className="flex items-center gap-3">
              <FaPlusCircle size={20} className="" />
              <p className="text-[16px]">Sell</p>
            </ShimmerButton>
          </div>
        </div>
      </header>

      {/* ---------- CATEGORY BAR ---------- */}
      <nav className="bg-white mt-20 shadow-sm transition-all duration-300 absolute -top-1 z-40 w-full fixed">
        <div className="px-5 flex items-center justify-start overflow-x-auto scrollbar-hide ">
          <div className="flex py-3 gap-1">
            {mainCategories.map(({ name, icon: Icon, path, isAll }) =>
              isAll ? (
                <button
                  key={name}
                  onClick={handleAllCategoriesClick}
                  className="flex items-center space-x-2 text-sm md:text-base font-medium text-gray-800 px-5 py-2 rounded-full transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#33a3ff] hover:bg-gray-100"
                >
                  <span>{name}</span>
                  <FaChevronDown className="ml-1 w-4 h-4 text-gray-600" />
                </button>
              ) : (
                <Link
                  key={name}
                  to={path}
                  onClick={onHideAll}
                  className="flex items-center space-x-2 text-sm md:text-base font-medium text-gray-800 px-5 py-2 rounded-full transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#33a3ff] hover:bg-gray-100"
                >
                  <Icon className="w-5 h-5" />
                  <span>{name}</span>
                </Link>
              )
            )}

            {/* Vertical line separator */}
            <div className="border-l border-gray-300 h-6 my-auto mx-2"></div>

            {/* Time display */}
            <div className="flex items-center text-sm text-gray-600 px-3 py-2 whitespace-nowrap">
              {currentDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MergedNavbar;