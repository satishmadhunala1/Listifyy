// src/App.jsx
import { useState } from "react";
import MergedNavbar from "./components/MergedNavbar";
import Categories from "./components/Categories";
import "./App.css";

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
    </div>
  );
}

export default App;