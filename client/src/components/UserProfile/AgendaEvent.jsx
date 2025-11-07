// components/AgendaEvent.jsx
import React from "react";

const AgendaEvent = ({ event, day }) => (
  <div className={`rounded-lg p-3 mt-1 border border-gray-200 ${event.group ? 'bg-blue-50 border-blue-200' : 'bg-blue-50 border-blue-100'}`}>
    <div className="flex items-center justify-between text-xs text-gray-600">
      <span className="truncate">{event.time}</span>
      {event.group ? (
        <div className="flex -space-x-2">
          {event.avatars.map((src, i) => (
            <img key={i} src={src} alt="" className="w-5 h-5 rounded-full object-cover border-2 border-white" />
          ))}
        </div>
      ) : (
        <img src={event.avatar} alt={event.client} className="w-6 h-6 rounded-full object-cover" />
      )}
    </div>
    <p className="text-sm font-medium text-gray-900 mt-1 truncate">{event.title}</p>
    {event.client && <p className="text-xs text-gray-500 truncate">{event.client}</p>}
  </div>
);

export default AgendaEvent;