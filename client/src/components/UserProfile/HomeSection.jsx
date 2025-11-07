// components/HomeSection.jsx
import React from "react";
import StatsCard from "./StatsCard";
import RecentMessages from "./RecentMessages";
import MyListings from "./MyListings";
import MyAgenda from "./MyAgenda";
import { Heart, FileText, Bell } from "lucide-react";

const HomeSection = ({ savedHouses, myPosts, myAlerts, messages, agendaEvents, onViewAll }) => (
  <>
    {/* Welcome */}
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Welcome back, User!</h1>
      <p className="text-sm text-gray-600 mt-1">Easily manage your listings and track your activity</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatsCard 
        title="Saved Items" 
        value={savedHouses.length} 
        color="bg-blue-50 border-blue-200" 
        icon={Heart} 
      />
      <StatsCard 
        title="My Posts" 
        value={myPosts.length} 
        color="bg-blue-100 border-blue-300" 
        icon={FileText} 
      />
      <StatsCard 
        title="Active Alerts" 
        value={myAlerts.length} 
        color="bg-blue-50 border-blue-100" 
        icon={Bell} 
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <RecentMessages messages={messages} />
      <div className="space-y-6">
        <MyListings count={myPosts.length} onViewAll={() => onViewAll('posts')} />
        <MyAgenda events={agendaEvents} />
      </div>
    </div>
  </>
);

export default HomeSection;