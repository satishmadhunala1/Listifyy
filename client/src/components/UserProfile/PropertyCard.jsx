// components/PropertyCard.jsx
import React from "react";
import { Heart, MapPin, Bed, Bath, Square } from "lucide-react";

const PropertyCard = ({ property, onToggleSave, isMyPost = false, showSaveButton = true }) => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-all duration-300 group">
    <div className="relative overflow-hidden">
      <img
        src={property.images[0]}
        alt={property.title}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-3 left-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          property.type === "rent"
            ? "bg-blue-600 text-white"
            : "bg-green-500 text-white"
        }`}>
          {property.type === "rent" ? "For Rent" : "For Sale"}
        </span>
      </div>
      {showSaveButton && (
        <button
          onClick={() => onToggleSave(property)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white hover:bg-gray-50 transition-all border border-gray-200"
        >
          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
        </button>
      )}
      {isMyPost && (
        <span className="absolute top-3 right-3 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
          Posted by You
        </span>
      )}
      <div className="absolute bottom-3 left-3">
        <span className="bg-black/60 text-white px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
          {property.posted}
        </span>
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
        {property.title}
      </h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {property.description}
      </p>
      <div className="flex items-center text-gray-500 mb-3 text-sm">
        <MapPin className="w-4 h-4 mr-1 text-blue-600" />
        <span className="line-clamp-1">{property.location}</span>
      </div>
      {property.bedrooms && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-gray-500 mb-3 text-sm gap-2 sm:gap-0">
          <div className="flex items-center">
            <Bed className="w-3 h-3 mr-1 text-blue-600" />
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-3 h-3 mr-1 text-blue-600" />
            <span>{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center">
            <Square className="w-3 h-3 mr-1 text-blue-600" />
            <span>{property.sqft} sqft</span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-2xl font-bold text-blue-600">
          {property.type === "rent"
            ? `$${property.price}/mo`
            : `$${property.price.toLocaleString()}`}
        </span>
        <button className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border border-blue-600 flex-shrink-0 ${
          isMyPost 
            ? "bg-blue-600 text-white hover:bg-blue-700" 
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}>
          {isMyPost ? "Edit Ad" : "View Details"}
        </button>
      </div>
    </div>
  </div>
);

export default PropertyCard;