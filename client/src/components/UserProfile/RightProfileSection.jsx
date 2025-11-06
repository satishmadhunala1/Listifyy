// components/RightProfileSection.jsx
import React from "react";
import { ChevronDown, FileText } from "lucide-react";
import PropertyCard from "./PropertyCard";

const RightProfileSection = ({ user, profilePic, myPosts, onToggleSave }) => (
  <aside className="hidden lg:block lg:w-80 bg-white rounded-2xl shadow-xl p-6 space-y-6 mt-20">
    {/* Profile Card */}
    <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
      <img 
        src={profilePic} 
        alt="Profile" 
        className="w-12 h-12 rounded-full object-cover flex-shrink-0" 
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
        <p className="text-xs text-gray-500 truncate">{user.email}</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span className="text-xs text-green-600 font-medium">Available</span>
        <ChevronDown className="w-3 h-3 text-gray-400 ml-1" />
      </div>
    </div>

    {/* My Posts */}
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 flex items-center justify-between">
        My Posts
        <span className="text-sm text-gray-500">({myPosts.length})</span>
      </h3>
      <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
        {myPosts.length === 0 ? (
          <div className="text-center py-4">
            <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No posts yet</p>
          </div>
        ) : (
          myPosts.map((post) => (
            <PropertyCard 
              key={post.id} 
              property={post} 
              isMyPost={true}
              onToggleSave={onToggleSave}
            />
          ))
        )}
      </div>
    </div>
  </aside>
);

export default RightProfileSection;