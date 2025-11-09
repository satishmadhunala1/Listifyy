// src/App.jsx
import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Categories from "./components/Categories";
import HeroSection from "./components/HeroSection.jsx";
import FreshRecommendations from "./pages/FreshRecom.jsx";
import Profile from "./components/UserProfile/Profile";
import Sell from "./components/Sell";
import Footer from "./pages/Footer";

// Import Housing Components
import HousingList from "./components/HousingList";
import HousingDetails from "./components/HousingDetails";

// Import Community Components
import CommunityList from "./components/CommunityList";
import CommunityDetails from "./components/CommunityDetails";

// Import Discussion Components
import DiscussionList from "./components/DiscussionList";
import DiscussionDetails from "./components/DiscussionDetails";

import ForSale from "./components/ForSale";
import SalesDetails from "./components/SalesDetails";
// Import Services Components
import ServicesList from "./components/ServicesList";
import ServicesDetails from "./components/ServicesDetails";

import "./App.css";

function App() {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const location = useLocation();

  // Auto-scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  const handleToggleAll = () => setShowAllCategories(!showAllCategories);
  const handleHideAll = () => setShowAllCategories(false);

  const isAuthPage =
    location.pathname === "/signin" || location.pathname === "/signup";
  const isNoFooterPage = isAuthPage || location.pathname === "/profile";

  return (
    <div className="App">
      {!isAuthPage && (
        <Navbar
          onToggleAll={handleToggleAll}
          onHideAll={handleHideAll}
          isCategoriesPageOpen={showAllCategories}
        />
      )}

      {/* Full Categories Page Overlay */}
      {showAllCategories && (
        <div className="min-h-screen">
          <Categories onClose={() => setShowAllCategories(false)} />
        </div>
      )}

      {/* Main Routes - Only show when categories page is NOT open */}
      {!showAllCategories && (
        <>
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <FreshRecommendations />
                </>
              }
            />

            {/* Housing Category Pages */}
            <Route path="/housing" element={<HousingList />} />
            <Route
              path="/housing/apts-for-rent"
              element={<HousingList category="apts-for-rent" />}
            />
            <Route
              path="/housing/housing-swap"
              element={<HousingList category="housing-swap" />}
            />
            <Route
              path="/housing/housing-wanted"
              element={<HousingList category="housing-wanted" />}
            />
            <Route
              path="/housing/office-commercial"
              element={<HousingList category="office-commercial" />}
            />
            <Route
              path="/housing/parking-storage"
              element={<HousingList category="parking-storage" />}
            />
            <Route
              path="/housing/real-estate"
              element={<HousingList category="real-estate" />}
            />
            <Route
              path="/housing/real-estate-for-sale"
              element={<HousingList category="real-estate-for-sale" />}
            />
            <Route
              path="/housing/real-estate-wanted"
              element={<HousingList category="real-estate-wanted" />}
            />
            <Route
              path="/housing/rooms-temporary"
              element={<HousingList category="rooms-temporary" />}
            />
            <Route
              path="/housing/vacation-rentals"
              element={<HousingList category="vacation-rentals" />}
            />

            {/* Community Category Pages */}
            <Route path="/community" element={<CommunityList />} />
            <Route
              path="/community/community-events"
              element={<CommunityList category="community-events" />}
            />
            <Route
              path="/community/volunteer-opportunities"
              element={<CommunityList category="volunteer-opportunities" />}
            />
            <Route
              path="/community/classes-workshops"
              element={<CommunityList category="classes-workshops" />}
            />
            <Route
              path="/community/activities-groups"
              element={<CommunityList category="activities-groups" />}
            />
            <Route
              path="/community/lost-found"
              element={<CommunityList category="lost-found" />}
            />
            <Route
              path="/community/local-news"
              element={<CommunityList category="local-news" />}
            />
            <Route
              path="/community/general-community"
              element={<CommunityList category="general-community" />}
            />

            {/* Discussion Forums Category Pages */}
            <Route path="/discussions" element={<DiscussionList />} />
            <Route
              path="/discussions/outdoors"
              element={<DiscussionList category="outdoors" />}
            />
            <Route
              path="/discussions/food-drink"
              element={<DiscussionList category="food-drink" />}
            />
            <Route
              path="/discussions/fitness"
              element={<DiscussionList category="fitness" />}
            />
            <Route
              path="/discussions/arts-crafts"
              element={<DiscussionList category="arts-crafts" />}
            />
            <Route
              path="/discussions/entertainment"
              element={<DiscussionList category="entertainment" />}
            />
            <Route
              path="/discussions/education"
              element={<DiscussionList category="education" />}
            />
            <Route
              path="/discussions/community"
              element={<DiscussionList category="community" />}
            />

            {/* Services Category Pages */}
            <Route path="/services" element={<ServicesList />} />
            <Route
              path="/services/home-services"
              element={<ServicesList category="home-services" />}
            />
            <Route
              path="/services/professional-services"
              element={<ServicesList category="professional-services" />}
            />
            <Route
              path="/services/health-fitness"
              element={<ServicesList category="health-fitness" />}
            />
            <Route
              path="/services/pet-services"
              element={<ServicesList category="pet-services" />}
            />
            <Route
              path="/services/creative-services"
              element={<ServicesList category="creative-services" />}
            />
            <Route
              path="/services/technical-services"
              element={<ServicesList category="technical-services" />}
            />
            <Route
              path="/services/general-services"
              element={<ServicesList category="general-services" />}
            />

            {/* Individual Listing Pages */}
            <Route path="/housing/:id" element={<HousingDetails />} />
            <Route path="/community/:id" element={<CommunityDetails />} />
            <Route path="/discussions/:id" element={<DiscussionDetails />} />
            <Route path="/services/:id" element={<ServicesDetails />} />

            {/* Other Category Pages */}
            <Route path="/for-sale" element={<ForSale />} />
            <Route path="/for-sale/:id" element={<SalesDetails />} />

            
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/gigs" element={<Gigs />} />
            <Route path="/discussion-forums" element={<DiscussionList />} />
            <Route path="/resumes" element={<Resumes />} />
            <Route path="/sell" element={<Sell />} />

            {/* User Pages */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved" element={<SavedItems />} />

            {/* Auth Pages */}
            <Route
              path="/signin"
              element={<div>Sign In Page Placeholder</div>}
            />
            <Route
              path="/signup"
              element={<div>Sign Up Page Placeholder</div>}
            />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {!isNoFooterPage && <Footer />}
        </>
      )}
    </div>
  );
}

// Placeholder components for routes that don't exist yet
const Jobs = () => (
  <div className="min-h-screen pt-24">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Jobs</h1>
      <p>Jobs page coming soon...</p>
    </div>
  </div>
);

const Gigs = () => (
  <div className="min-h-screen pt-24">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Gigs</h1>
      <p>Gigs page coming soon...</p>
    </div>
  </div>
);

const DiscussionForums = () => (
  <div className="min-h-screen pt-24">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Discussion Forums</h1>
      <p>Discussion Forums page coming soon...</p>
    </div>
  </div>
);

const Resumes = () => (
  <div className="min-h-screen pt-24">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Resumes</h1>
      <p>Resumes page coming soon...</p>
    </div>
  </div>
);

const SavedItems = () => (
  <div className="min-h-screen pt-24">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Saved Items</h1>
      <p>Saved items page coming soon...</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen pt-24 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a
        href="/"
        className="bg-[#2563EB] text-white px-6 py-3 rounded-lg hover:bg-[#1D4ED8] transition-colors"
      >
        Go Back Home
      </a>
    </div>
  </div>
);

export default App;