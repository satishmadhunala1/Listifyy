<<<<<<< HEAD
// src/App.jsx
import { useState } from "react";
import MergedNavbar from "./components/MergedNavbar";
import Categories from "./components/Categories";
import "./App.css";

=======
import React from 'react'
import './App.css'
import HeroSection from './components/HeroSection.jsx'
>>>>>>> 9592619fe940fbbab423174fbf75ebf8541597fd
function App() {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const handleToggleAll = () => setShowAllCategories(!showAllCategories);
  const handleHideAll = () => setShowAllCategories(false);

  return (
<<<<<<< HEAD
    <div className="App">
      <MergedNavbar onToggleAll={handleToggleAll} onHideAll={handleHideAll} />
      {showAllCategories && (
        <div className="min-h-screen">
          <Categories onClose={() => setShowAllCategories(false)} />
        </div>
      )}
    </div>
  );
=======
    <>
    <HeroSection/>
    </>
  )
>>>>>>> 9592619fe940fbbab423174fbf75ebf8541597fd
}

export default App;