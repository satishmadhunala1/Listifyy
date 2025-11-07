// components/PersonalDetailsSection.jsx
import React from "react";
import { Edit3, Camera } from "lucide-react";

const PersonalDetailsSection = ({
  user,
  isEditing,
  setIsEditing,
  editData,
  setEditData,
  profilePicPreview,
  handleProfilePicChange,
  handleSave,
  handleCancel,
}) => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 mt-20">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Personal Details</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
      </div>
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium border border-blue-600 w-full sm:w-auto"
        >
          <Edit3 className="w-4 h-4" />
          Edit Profile
        </button>
      )}
    </div>

    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 space-y-6">
      {/* Always show profile picture */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
        <div className="relative flex-shrink-0">
          <img
            src={profilePicPreview}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          {isEditing && (
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors border-2 border-white">
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">Profile Picture</p>
          <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 2MB</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
              placeholder="Enter your name"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
              {editData.name}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          {isEditing ? (
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
              placeholder="Enter your email"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
              {editData.email}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          {isEditing ? (
            <input
              type="tel"
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
              placeholder="Enter your phone"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
              {editData.phone}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.address}
              onChange={(e) => setEditData({ ...editData, address: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
              placeholder="Enter your address"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
              {editData.address}
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium border border-blue-600 w-full sm:w-auto"
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  </div>
);

export default PersonalDetailsSection;