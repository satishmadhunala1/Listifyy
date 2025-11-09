// src/components/CommunityDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import {
  MapPin,
  Mail,
  Heart,
  Share2,
  Calendar,
  Star,
  ArrowLeft,
  ExternalLink,
  Users,
  Clock,
  CheckCircle,
  ChevronRight as ChevronRightSmall,
} from "lucide-react";
import { communityData } from "../jsonData/index.js";

function CommunityDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [currentEventType, setCurrentEventType] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const foundEvent = communityData.events.find(
          (event) => event.id === parseInt(id)
        );

        if (!foundEvent) {
          setError("Event not found");
        } else {
          setEvent(foundEvent);
          setSelectedImage(getEventImage(foundEvent));
          // Extract event type for breadcrumb
          const eventType = extractEventType(foundEvent);
          setCurrentEventType(eventType);
        }
      } catch (err) {
        setError("Failed to load event data");
        console.error("Error fetching event data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedEvents") || "[]");
    setSavedEvents(saved);
  }, [id]);

  // Enhanced event type extraction with fallback
  const extractEventType = (event) => {
    if (event.category) return event.category;

    const title = event.title.toLowerCase();
    const description = event.description.toLowerCase();

    if (title.includes("garden") || description.includes("garden"))
      return "gardening";
    if (
      title.includes("book") ||
      description.includes("book") ||
      title.includes("education")
    )
      return "education";
    if (
      title.includes("cleanup") ||
      description.includes("clean") ||
      title.includes("volunteer")
    )
      return "volunteer";
    if (
      title.includes("art") ||
      description.includes("workshop") ||
      title.includes("craft")
    )
      return "arts";
    if (
      title.includes("dance") ||
      description.includes("music") ||
      title.includes("movie")
    )
      return "entertainment";
    if (
      title.includes("run") ||
      description.includes("fitness") ||
      title.includes("sports")
    )
      return "sports";
    if (
      title.includes("food") ||
      description.includes("cook") ||
      title.includes("restaurant")
    )
      return "food";
    if (
      title.includes("social") ||
      description.includes("meetup") ||
      description.includes("gathering")
    )
      return "social";

    return "community";
  };

  const isSaved = savedEvents.some((h) => h.id === event?.id);

  const toggleSave = () => {
    if (!event) return;
    let newSaved;
    if (isSaved) {
      newSaved = savedEvents.filter((h) => h.id !== event.id);
    } else {
      newSaved = [...savedEvents, event];
    }
    setSavedEvents(newSaved);
    localStorage.setItem("savedEvents", JSON.stringify(newSaved));
  };

  const shareEvent = () => {
    if (!event) return;

    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareMenu(false);
  };

  // Get event type badge color
  const getEventTypeColor = (eventType) => {
    if (!eventType) return "bg-gray-100 text-gray-800 border border-gray-200";

    switch (eventType) {
      case "gardening":
        return "bg-green-100 text-green-800 border border-green-200";
      case "education":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "volunteer":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "arts":
        return "bg-pink-100 text-pink-800 border border-pink-200";
      case "entertainment":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "sports":
        return "bg-red-100 text-red-800 border border-red-200";
      case "social":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      case "food":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Different images for different event types
  const getEventImage = (event) => {
    const eventType = extractEventType(event);

    switch (eventType) {
      case "gardening":
        return "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "education":
        return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "volunteer":
        return "https://images.unsplash.com/photo-1549923746-7c0bdf0955bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "arts":
        return "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "entertainment":
        return "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "sports":
        return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "social":
        return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "food":
        return "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      default:
        return "https://images.unsplash.com/photo-1551135049-8a33b5883817?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";

    try {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return "Invalid date";
    }
  };

  // Extract features from description
  const extractFeatures = (description) => {
    if (!description)
      return ["Community Event", "Social Gathering", "All Ages Welcome"];

    const features = [];
    if (description.toLowerCase().includes("family"))
      features.push("Family Friendly");
    if (description.toLowerCase().includes("free")) features.push("Free Event");
    if (description.toLowerCase().includes("outdoor"))
      features.push("Outdoor Activity");
    if (description.toLowerCase().includes("indoor"))
      features.push("Indoor Activity");
    if (description.toLowerCase().includes("workshop"))
      features.push("Hands-on Workshop");
    if (description.toLowerCase().includes("networking"))
      features.push("Networking Opportunity");
    if (description.toLowerCase().includes("educational"))
      features.push("Educational");
    if (description.toLowerCase().includes("fun"))
      features.push("Fun & Engaging");
    if (description.toLowerCase().includes("community"))
      features.push("Community Building");
    if (description.toLowerCase().includes("beginner"))
      features.push("Beginner Friendly");

    // Add default features if none found
    if (features.length === 0) {
      features.push(
        "Community Event",
        "Social Gathering",
        "All Ages Welcome",
        "Local Participation"
      );
    }

    return features.slice(0, 6);
  };

  // Get similar events (exclude current event)
  const getSimilarEvents = () => {
    if (!event) return [];
    return communityData.events.filter((e) => e.id !== event.id).slice(0, 6);
  };

  // Extract event details
  const extractEventDetails = (event) => {
    return {
      duration: event.duration || "2-3 hours",
      capacity: event.capacity || "50-100 people",
      ageGroup: event.ageGroup || "All Ages",
      requirements: event.requirements || "None",
      organizer: event.organizer || "Community Center",
      contact: event.contactEmail || "community@example.com",
    };
  };

  // Safe category display function
  const getCategoryDisplay = (category) => {
    if (!category) return "Community Event";
    return category.charAt(0).toUpperCase() + category.slice(1) + " Event";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The event you're looking for doesn't exist.
          </p>
          <Link
            to="/community"
            className="bg-[#2563EB] text-white px-6 py-3 rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const eventTypeColor = getEventTypeColor(event.category);
  const features = extractFeatures(event.description);
  const eventDetails = extractEventDetails(event);
  const similarEvents = getSimilarEvents();

  // Create multiple image thumbnails using the same main image
  const displayImages = [
    getEventImage(event),
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1549923746-7c0bdf0955bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1551135049-8a33b5883817?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  ];

  return (
    <div className="max-w-7xl mx-auto pt-24 mt-10">
      {/* Header - Enhanced Breadcrumb Navigation */}
      <div className="flex items-center mt-4 justify-between">
        {/* Enhanced Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-md text-gray-500">
          <Link to="/" className="hover:text-[#2563EB]">
            Home
          </Link>
          <ChevronRightSmall className="w-4 h-4" />
          <Link to="/community" className="hover:text-[#2563EB]">
            Community
          </Link>
          {currentEventType && (
            <>
              <ChevronRightSmall className="w-4 h-4" />
              <Link
                to="/community"
                onClick={(e) => {
                  e.preventDefault();
                  // This would navigate back to the filtered view in a real app
                  // For now, just go to community page
                  window.history.back();
                }}
                className="hover:text-[#2563EB] capitalize"
              >
                {currentEventType}
              </Link>
            </>
          )}
          <ChevronRightSmall className="w-4 h-4" />
          <span className="text-gray-900 font-medium line-clamp-1 max-w-xs">
            {event.title}
          </span>
        </div>

        {/* Header Navigation with share/save */}
        <div className="flex items-center gap-3">
          <button
            onClick={shareEvent}
            className="p-2 text-gray-600 hover:text-[#2563EB] transition-colors relative"
          >
            <Share2 className="w-5 h-5" />
            {showShareMenu && (
              <div className="absolute top-full right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={copyLink}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-t-lg flex items-center gap-3"
                >
                  <ExternalLink className="w-4 h-4" />
                  Copy Link
                </button>
                <button className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-b-lg flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  Share via Email
                </button>
              </div>
            )}
          </button>

          <button
            onClick={toggleSave}
            className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
              isSaved
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? "fill-red-600" : ""}`} />
            <span className="hidden sm:inline font-medium">
              {isSaved ? "Saved" : "Save"}
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 pt-4">
        {/* Main Content - 2/3 width */}
        <div className="lg:w-2/3">
          {/* Image Gallery - Modern Style */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="relative">
              <img
                src={selectedImage}
                alt={event.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-4 left-4">
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${eventTypeColor}`}
                >
                  {getCategoryDisplay(event.category)}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="p-4 grid grid-cols-4 gap-3">
              {displayImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? "border-[#2563EB] ring-2 ring-[#2563EB] ring-opacity-20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${event.title} - ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header with Title */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {event.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">{event.location}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-[#2563EB] mb-1">
                    {event.isFree ? "Free" : `$${event.price || 0}`}
                  </div>
                  <div className="text-sm text-gray-500">Registration</div>
                </div>
              </div>

              {/* Enhanced Event Stats */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-center">
                  {/* Date */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                      <Calendar className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Date</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {formatDate(event.date)}
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                      <Clock className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Time</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {event.time || "To be announced"}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                      <Users className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Duration</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {eventDetails.duration}
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                      <Star className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Capacity</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {eventDetails.capacity}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Event Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <Users className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Age Group</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {eventDetails.ageGroup}
                  </div>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Requirements</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {eventDetails.requirements}
                  </div>
                </div>
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Organizer</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {eventDetails.organizer}
                  </div>
                </div>
                <div className="text-center">
                  <Mail className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Contact</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {eventDetails.contact}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="px-6 flex space-x-8 overflow-x-auto">
                {["overview", "location", "details"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors capitalize ${
                      activeTab === tab
                        ? "border-[#2563EB] text-[#2563EB]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Event Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {event.description || "No description available."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Event Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "location" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Event Location
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {event.location || "Location not specified"}
                    </p>

                    <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200">
                      <iframe
                        title="Event Location Map"
                        width="100%"
                        height="100%"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          event.location || "United States"
                        )}&output=embed&zoom=15`}
                        className="border-0"
                      ></iframe>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Event Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Event Type</span>
                          <span className="font-medium capitalize">
                            {event.category || "Community"}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Date</span>
                          <span className="font-medium">
                            {formatDate(event.date)}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Time</span>
                          <span className="font-medium">
                            {event.time || "TBA"}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium">
                            {eventDetails.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Participation Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Age Group</span>
                          <span className="font-medium">
                            {eventDetails.ageGroup}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Capacity</span>
                          <span className="font-medium">
                            {eventDetails.capacity}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Requirements</span>
                          <span className="font-medium">
                            {eventDetails.requirements}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Cost</span>
                          <span className="font-medium text-green-600">
                            {event.isFree ? "Free" : `$${event.price || 0}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="lg:w-1/3 space-y-6">
          {/* Contact Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Organizer
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <img
                src="https://www.shutterstock.com/image-photo/confident-smiling-middle-aged-business-260nw-2451544833.jpg"
                alt={event.sellerName || "Organizer"}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {event.sellerName || "Community Organizer"}
                </h4>
                <p className="text-gray-600 text-sm">
                  Community Event Organizer
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-[#FFD700] text-[#FFD700]"
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    (18 reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={`mailto:${
                  event.contactEmail || "community@example.com"
                }?subject=Inquiry about ${event.title}`}
                className="w-full bg-[#2563EB] text-white py-3 px-4 rounded-lg cursor-pointer hover:bg-[#1D4ED8] transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Organizer
              </a>

              <button className="w-full border border-[#2563EB] text-[#2563EB] py-3 px-4 rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                <FaComments className="w-4 h-4" />
                Chat with Organizer
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 inline mr-1" />
                Posted {event.posted || "recently"}
              </div>
            </div>
          </div>

          {/* Join Event Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Join This Event
            </h3>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-semibold text-green-800">
                      {event.isFree
                        ? "Free to Join"
                        : `$${event.price || 0} Registration`}
                    </div>
                    <div className="text-sm text-green-600">
                      {event.isFree
                        ? "No registration fee required"
                        : "Includes all materials and resources"}
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                <Users className="w-5 h-5" />
                Register for Event
              </button>

              <p className="text-sm text-gray-600 text-center">
                By registering, you'll receive event reminders and updates
              </p>
            </div>
          </div>

          {/* Similar Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#2563EB]" />
                Similar Events ({similarEvents.length})
              </h3>
            </div>

            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {similarEvents.map((similarEvent) => {
                const similarEventTypeColor = getEventTypeColor(
                  similarEvent.category
                );

                return (
                  <Link
                    key={similarEvent.id}
                    to={`/community/${similarEvent.id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex gap-3">
                      <img
                        src={getEventImage(similarEvent)}
                        alt={similarEvent.title}
                        className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                            {similarEvent.title}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${similarEventTypeColor}`}
                          >
                            {getCategoryDisplay(similarEvent.category)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-600 truncate">
                            {similarEvent.location?.split(",")[0] ||
                              similarEvent.location}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(similarEvent.date)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#2563EB] text-sm">
                            {similarEvent.isFree
                              ? "Free"
                              : `$${similarEvent.price || 0}`}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {similarEvent.posted || "recently"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <Link
                to="/community"
                className="w-full text-center text-[#2563EB] font-medium hover:text-[#1D4ED8] transition-colors text-sm inline-flex items-center justify-center gap-1"
              >
                View All Events
                <ArrowLeft className="w-4 h-4 transform rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityDetails;
