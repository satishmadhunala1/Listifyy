// components/RecentMessages.jsx
import React from "react";

const RecentMessages = ({ messages }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 mb-6 sm:p-6">
    <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
      Recent Messages
      <span className="text-sm text-gray-500">11:01</span>
    </h3>
    <div className="space-y-3">
      {messages.map((msg, index) => (
        <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
          <img 
            src={msg.avatar} 
            alt={msg.name} 
            className="w-10 h-10 rounded-full object-cover flex-shrink-0" 
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-900 truncate">{msg.name}</p>
              <span className={`text-xs ${msg.unread ? 'text-[#2F3A63] font-medium' : 'text-gray-500'}`}>
                {msg.time}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate">{msg.preview}</p>
            {msg.unread && <div className="w-2 h-2 bg-[#2F3A63] rounded-full mt-1 ml-auto"></div>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RecentMessages;