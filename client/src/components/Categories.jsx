import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { craigslistCategories } from "../data/categories";

const Categories = ({ onClose }) => {
  const categoriesRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Close categories on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={categoriesRef} className="fixed top-[128px] left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto scrollbar-hide shadow-2xl mt-4 max-w-7xl mx-auto rounded-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-4 space-y-6">
          {/* Map sections */}
          {Object.entries(craigslistCategories).map(([section, subs]) => (
            <div key={section} className="min-w-[180px]">
              <h2 className="text-base font-semibold text-[#33a3ff] mb-3 capitalize">
                {section.replace("/", " / ")}
              </h2>
              <ul className="space-y-1.5">
                {subs.map((sub) => (
                  <li key={sub}>
                    <Link
                      to={`/${section}/${sub}`}
                      className="block text-sm text-gray-800 hover:text-[#33a3ff] transition-colors duration-200"
                      onClick={onClose}
                    >
                      {sub.replace("&", "& ").replace("+", "+ ")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Optional close button (top-right corner) */}
      
    </div>
  );
};

export default Categories;