// src/App.jsx
import React from "react";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Categories from "./components/Categories";
import HeroSection from './components/HeroSection.jsx'
import FreshRecommendations from "./pages/FreshRecom.jsx";
import "./App.css";
import "./App.css";
import Footer from "./pages/Footer";

function App() {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const handleToggleAll = () => setShowAllCategories(!showAllCategories);
  const handleHideAll = () => setShowAllCategories(false);

  return (
    <div className="App">
      <Navbar 
        onToggleAll={handleToggleAll} 
        onHideAll={handleHideAll} 
        isCategoriesPageOpen={showAllCategories}  // Add this prop
      />
      {showAllCategories && (
        <div className="min-h-screen">
          <Categories onClose={() => setShowAllCategories(false)} />
        </div>
      )}
      <HeroSection />
      <FreshRecommendations />
      <Footer />
    </div>
  );
}

export default App;
