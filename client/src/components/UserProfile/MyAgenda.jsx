// components/MyAgenda.jsx
import React from "react";
import { ChevronRight } from "lucide-react";
import AgendaEvent from "./AgendaEvent";

const MyAgenda = ({ events }) => {
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const currentDay = 2; // Wednesday

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-6 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Upcoming Viewings</h3>
        <button className="text-sm text-[#2F3A63] hover:text-[#5669A4] font-medium flex items-center gap-1 transition-colors">
          View all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
        {days.map((day, i) => (
          <div key={i} className={`text-center py-2 px-1 rounded text-xs font-medium transition-colors min-w-[40px] flex-shrink-0 ${
            i === currentDay ? 'bg-[#2F3A63]/10 text-[#2F3A63]' : 'text-gray-500 hover:bg-gray-100'
          }`}>
            {day}
          </div>
        ))}
      </div>
      <div className="space-y-2 h-48 overflow-y-auto">
        {Object.entries(events).map(([day, dayEvents]) => (
          dayEvents.map((event, i) => <AgendaEvent key={i} event={event} day={day} />)
        ))}
      </div>
      <button className="w-full py-2 px-4 bg-[#2F3A63]/10 text-[#2F3A63] rounded-xl hover:bg-[#2F3A63]/20 transition-colors text-sm font-medium mt-3">
        All upcoming events
      </button>
    </div>
  );
};

export default MyAgenda;