// src/App.jsx
import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Categories from "./components/Categories";
import HeroSection from './components/HeroSection.jsx';
import FreshRecommendations from "./pages/FreshRecom.jsx";
import "./App.css";
import "./App.css";
import Profile from "./components/UserProfile/Profile";
import Footer from "./pages/Footer";
// Assuming you have these components; import them as needed
// import SignIn from "./components/SignIn";
// import SignUp from "./components/SignUp";

import HousingList from "./components/HousingList";
import "./App.css";

function App() {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const location = useLocation();

  const handleToggleAll = () => setShowAllCategories(!showAllCategories);
  const handleHideAll = () => setShowAllCategories(false);

  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';
  const isNoFooterPage = isAuthPage || location.pathname === '/profile';

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
            <Route path="/" element={
              <>
                <HeroSection />
                <FreshRecommendations />
              </>
            } />
            {/* Category Pages */}
            <Route path="/housing" element={<HousingList />} />
            <Route path="/community" element={<Community />} />
            <Route path="/for-sale" element={<ForSale />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gigs" element={<Gigs />} />
            <Route path="/discussion-forums" element={<DiscussionForums />} />
            <Route path="/resumes" element={<Resumes />} />
            
            {/* Individual Listing Pages */}
            <Route path="/categories/houses/:id" element={<HousingDetail />} />
            
            {/* User Pages */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved" element={<SavedItems />} />
            <Route path="/sell" element={<SellForm />} />
            
            {/* Auth Pages */}
            <Route path="/signin" element={
              // <SignIn />
              <div>Sign In Page Placeholder</div>
            } />
            <Route path="/signup" element={
              // <SignUp />
              <div>Sign Up Page Placeholder</div>
            } />
            
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
const Community = () => (
  <div className="min-h-screen pt-24">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Community</h1>
      <p>Community page coming soon...</p>
    </div>
  </div>
);

const ForSale = () => (
  <div className="min-h-screen pt-24">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">For Sale</h1>
      <p>For Sale page coming soon...</p>
    </div>
  </div>
);

const Jobs = () => (
  <div className="min-h-screen pt-24">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Jobs</h1>
      <p>Jobs page coming soon...</p>
    </div>
  </div>
);

const Services = () => (
  <div className="min-h-screen pt-24">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Services</h1>
      <p>Services page coming soon...</p>
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

const HousingDetail = () => (
  <div className="min-h-screen pt-24">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Housing Detail Page</h1>
      <p>Individual housing listing page coming soon...</p>
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

const SellForm = () => (
  <div className="min-h-screen pt-24">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Sell an Item</h1>
      <p>Sell form page coming soon...</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen pt-24 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
        Go Back Home
      </a>
    </div>
  </div>
);

export default App;