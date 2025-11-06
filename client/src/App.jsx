// src/App.jsx
import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Categories from "./components/Categories";
import HeroSection from './components/HeroSection.jsx'
import FreshRecommendations from "./pages/FreshRecom.jsx";
import "./App.css";
import "./App.css";
import Profile from "./components/UserProfile/Profile";
import Footer from "./pages/Footer";
import { Routes, Route } from "react-router-dom";
// Assuming you have these components; import them as needed
// import SignIn from "./components/SignIn";
// import SignUp from "./components/SignUp";


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
            isCategoriesPageOpen={showAllCategories}  // Add this prop
          />
        )}
        {showAllCategories && (
          <div className="min-h-screen">
            <Categories onClose={() => setShowAllCategories(false)} />
          </div>
        )}
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <FreshRecommendations />
            </>
          } />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signin" element={
            // <SignIn />
            <div>Sign In Page Placeholder</div>
          } />
          <Route path="/signup" element={
            // <SignUp />
            <div>Sign Up Page Placeholder</div>
          } />
        </Routes>
        {!isNoFooterPage && <Footer />}
      </div>
  );
}

export default App;