import { useState } from "react";
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
} from "react-icons/fa";

const mainCategories = [
  { name: "All Categories", icon: FaTh, isAll: true },
  { name: "Community", icon: FaUsers, path: "/community" },
  { name: "For Sale", icon: FaShoppingBag, path: "/for-sale" },
  { name: "Housing", icon: FaHome, path: "/housing" },
  { name: "Jobs", icon: FaBriefcase, path: "/jobs" },
  {name: "Resumes", icon: FaBriefcase, path: "/resumes" },
  {name: "Gigs", icon: FaBriefcase, path: "/gigs" },
  {name: "Discussion Forums", icon: FaBriefcase, path: "/discussion-forums" },
  { name: "Services", icon: FaCogs, path: "/services" },
];

const locationOptions = ["India", "USA", "UK", "Canada", "Australia"];
const languages = ["EN", "HI", "FR", "ES"];

const MergedNavbar = ({ onToggleAll, onHideAll }) => {
  const [location, setLocation] = useState("India");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [typedLocation, setTypedLocation] = useState("");

  const [language, setLanguage] = useState("EN");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim() === "") return alert("Please enter a search term!");
    alert(`Searching for: ${searchQuery} in ${location}`);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLangDropdown(false);
  };

  const filteredLocations = locationOptions.filter((loc) =>
    loc.toLowerCase().includes(typedLocation.toLowerCase())
  );

  return (
    <>
      {/* ---------- TOP NAVBAR ---------- */}
      <header className="bg-white text-black shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-200 transition-all duration-300">
        <div className="   px-6 h-20 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
          {/* ---- Logo ---- */}
          <div className="flex items-center space-x-3 min-w-[150px]">
            <Link
              to="/"
              className="text-3xl font-extrabold   transition-all duration-200"
            >
              Listify
            </Link>
          </div>

          {/* ---- Location Dropdown ---- */}
          <div className="relative flex items-center bg-white border border-gray-300 rounded-full shadow-sm px-4 py-1.5 hover:shadow-md transition-all duration-200 w-[200px]">
            <FaMapMarkerAlt className="mr-2 w-5 h-5 text-black" />
            <input
              type="text"
              value={typedLocation}
              onChange={(e) => setTypedLocation(e.target.value)}
              onFocus={() => setShowLocationDropdown(true)}
              placeholder={location}
              className="w-full text-sm bg-transparent outline-none placeholder-gray-500"
            />
            <FaChevronDown
              className={`ml-2 text-gray-600 transition-transform duration-200 w-4 h-4 cursor-pointer ${
                showLocationDropdown ? "rotate-180" : ""
              }`}
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            />

            {showLocationDropdown && (
              <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg animate-fadeIn z-50">
                {filteredLocations.length ? (
                  filteredLocations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocation(loc);
                        setTypedLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {loc}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No matches found
                  </div>
                )}
              </div>
            )}
          </div>


          {/* ---- Search Bar ---- */}
          <div className="flex-1 max-w-2xl relative flex items-center bg-white border border-gray-300 rounded-full shadow-sm px-3 py-2 transition-all">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Cars, Properties, Jobs..."
              className="flex-1 bg-transparent text-black px-4 py-2 focus:outline-none text-sm md:text-base"
            />
            <button
              onClick={handleSearch}
              className=" text-black px-6 py-2.5 rounded-full text-sm font-semibold shadow-md transition-all duration-200"
            >
              Search
            </button>
          </div>

          {/* ---- Right: Language, Profile, Sell ---- */}
          <div className="flex items-center space-x-5 relative">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center text-sm text-gray-700  transition-all"
              >
                <FaGlobe className="mr-2  w-5 h-5" />
                {language}
                <FaChevronDown
                  className={`ml-1 text-gray-600 transition-transform duration-200 w-5 h-5 ${
                    showLangDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-lg animate-fadeIn overflow-hidden ">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`block w-full text-left px-4 py-2 text-sm   ${
                        lang === language ? "" : ""
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <Link
              to="/profile"
              className="text-gray-700 transition-all"
            >
              <FaUserCircle size={30} />
            </Link>

            {/* Sell Button */}
            <button className="flex items-center  text-black font-semibold px-6 py-2.5 rounded-full text-lg md:text-base shadow-md transition-all duration-200 ">
              <FaPlusCircle className="mr-2 text-lg w-5 h-5" />
              Sell
            </button>
          </div>
        </div>
      </header>

      {/* ---------- CATEGORY BAR ---------- */}
      <nav className="bg-white mt-20 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-start overflow-x-auto scrollbar-hide px-1">
          <div className="flex  py-3 gap-1">
            {mainCategories.map(({ name, icon: Icon, path, isAll }) =>
              isAll ? (
                <button
                  key={name}
                  onClick={onToggleAll}
                  className="flex items-center space-x-2 text-sm md:text-base font-medium text-gray-800 px-5 py-2 rounded-full transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#33a3ff]"
                >
                  <Icon className="w-5 h-5 " />
                  <span>{name}</span>
                  
                </button>
              ) : (
                <Link
                  key={name}
                  to={path}
                  onClick={onHideAll}
                  className="flex items-center space-x-2 text-sm md:text-base font-medium text-gray-800  px-5 py-2 rounded-full transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#33a3ff]"
                >
                  <Icon className="w-5 h-5" />
                  <span>{name}</span>
                </Link>
              )
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default MergedNavbar;
