// components/StatsCard.jsx
import React from "react";
import { Heart, FileText, Bell } from "lucide-react";

const StatsCard = ({ title, value, color, icon: Icon, badge }) => (
  <div className={`${color} rounded-2xl p-4 shadow-md border border-gray-200/50 sm:p-6`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 sm:text-3xl">{value}</p>
      </div>
      <Icon className="w-6 h-6 text-gray-500 mt-1 flex-shrink-0" />
    </div>
    {badge && <span className="text-xs text-gray-500 block mt-1">{badge}</span>}
  </div>
);

export default StatsCard;