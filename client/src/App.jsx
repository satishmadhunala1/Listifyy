// src/App.jsx
import React from "react";
import { useState } from "react";
import MergedNavbar from "./components/MergedNavbar";
import Categories from "./components/Categories";
import HeroSection from "./components/HeroSection.jsx";
import FreshRecommendations from "./pages/Freshrecomm.jsx";
import "./App.css";
import Footer from "./pages/Footer";

function App() {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const handleToggleAll = () => setShowAllCategories(!showAllCategories);
  const handleHideAll = () => setShowAllCategories(false);

  return (
    <div className="App">
      <MergedNavbar onToggleAll={handleToggleAll} onHideAll={handleHideAll} />
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
