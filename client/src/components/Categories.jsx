import { Link } from "react-router-dom";
import { craigslistCategories } from "../data/categories";

const Categories = ({ onClose }) => {
  return (
    <div className="w-full bg-white shadow-lg  ">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-4 border border-gray-200 ">
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
                  >
                    {sub.replace("&", "& ").replace("+", "+ ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Optional close button (top-right corner) */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-8 top-4 text-gray-500 hover:text-[#33a3ff] text-2xl font-bold transition"
          aria-label="Close categories"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Categories;
