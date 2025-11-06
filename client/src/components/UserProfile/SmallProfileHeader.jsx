// components/SmallProfileHeader.jsx
import React from "react";
import { ChevronDown } from "lucide-react";

const SmallProfileHeader = ({ profilePic }) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-green-500"></div>
      <span className="text-sm text-green-600 font-medium hidden sm:block">Available</span>
    </div>
    <img 
      src={profilePic} 
      alt="Profile" 
      className="w-8 h-8 rounded-full object-cover flex-shrink-0" 
    />
    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
  </div>
);

export default SmallProfileHeader;