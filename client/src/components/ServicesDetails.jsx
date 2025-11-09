// src/components/ServicesDetails.jsx
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
  Briefcase,
  Award,
  Shield,
  DollarSign,
} from "lucide-react";
import { servicesData } from "../jsonData/index.js";

function ServicesDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedServices, setSavedServices] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [currentServiceType, setCurrentServiceType] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const foundService = servicesData.services.find(
          (service) => service.id === parseInt(id)
        );

        if (!foundService) {
          setError("Service not found");
        } else {
          setService(foundService);
          setSelectedImage(foundService.images?.[0] || getServiceImage(foundService));
          // Extract service type for breadcrumb
          const serviceType = extractServiceType(foundService);
          setCurrentServiceType(serviceType);
        }
      } catch (err) {
        setError("Failed to load service data");
        console.error("Error fetching service data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedServices") || "[]");
    setSavedServices(saved);
  }, [id]);

  // Enhanced service type extraction with fallback
  const extractServiceType = (service) => {
    const title = service.title.toLowerCase();
    const description = service.description.toLowerCase();

    if (title.includes("clean") || description.includes("clean")) return "cleaning";
    if (title.includes("repair") || description.includes("repair") || 
        title.includes("fix") || description.includes("fix")) return "repair";
    if (title.includes("dog") || title.includes("pet") || 
        description.includes("dog") || description.includes("pet")) return "pet";
    if (title.includes("design") || title.includes("photo") || 
        title.includes("creative") || description.includes("design")) return "creative";
    if (title.includes("tutor") || title.includes("lesson") || 
        description.includes("learn") || description.includes("teach")) return "education";
    if (title.includes("train") || title.includes("fitness") || 
        title.includes("yoga") || description.includes("fitness")) return "health";
    if (title.includes("web") || title.includes("seo") || 
        title.includes("development") || description.includes("technical")) return "technical";
    if (title.includes("move") || description.includes("moving")) return "moving";
    if (title.includes("garden") || description.includes("landscap")) return "gardening";
    
    return "professional";
  };

  const isSaved = savedServices.some((h) => h.id === service?.id);

  const toggleSave = () => {
    if (!service) return;
    let newSaved;
    if (isSaved) {
      newSaved = savedServices.filter((h) => h.id !== service.id);
    } else {
      newSaved = [...savedServices, service];
    }
    setSavedServices(newSaved);
    localStorage.setItem("savedServices", JSON.stringify(newSaved));
  };

  const shareService = () => {
    if (!service) return;

    if (navigator.share) {
      navigator.share({
        title: service.title,
        text: service.description,
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

  // Get service type badge color
  const getServiceTypeColor = (serviceType) => {
    if (!serviceType) return "bg-gray-100 text-gray-800 border border-gray-200";

    switch (serviceType) {
      case "cleaning":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "repair":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "pet":
        return "bg-green-100 text-green-800 border border-green-200";
      case "creative":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "education":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      case "health":
        return "bg-red-100 text-red-800 border border-red-200";
      case "technical":
        return "bg-teal-100 text-teal-800 border border-teal-200";
      case "moving":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "gardening":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Different images for different service types
  const getServiceImage = (service) => {
    const serviceType = extractServiceType(service);

    switch (serviceType) {
      case "cleaning":
        return "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "repair":
        return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "pet":
        return "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "creative":
        return "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "education":
        return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "health":
        return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "technical":
        return "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "moving":
        return "https://images.unsplash.com/photo-1541976590-713941681591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "gardening":
        return "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      default:
        return "https://images.unsplash.com/photo-1551135049-8a33b5883817?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    }
  };

  // Extract features from description
  const extractFeatures = (description) => {
    if (!description)
      return ["Professional Service", "Quality Guaranteed", "Customer Satisfaction"];

    const features = [];
    if (description.toLowerCase().includes("professional")) features.push("Professional Service");
    if (description.toLowerCase().includes("experienced")) features.push("Experienced Provider");
    if (description.toLowerCase().includes("quality")) features.push("Quality Guaranteed");
    if (description.toLowerCase().includes("affordable")) features.push("Affordable Pricing");
    if (description.toLowerCase().includes("reliable")) features.push("Reliable Service");
    if (description.toLowerCase().includes("quick") || description.toLowerCase().includes("fast")) features.push("Quick Service");
    if (description.toLowerCase().includes("licensed")) features.push("Licensed Professional");
    if (description.toLowerCase().includes("insured")) features.push("Fully Insured");
    if (description.toLowerCase().includes("free")) features.push("Free Consultation");
    if (description.toLowerCase().includes("emergency")) features.push("Emergency Service Available");

    // Add default features if none found
    if (features.length === 0) {
      features.push(
        "Professional Quality",
        "Customer Satisfaction",
        "Timely Service",
        "Competitive Pricing"
      );
    }

    return features.slice(0, 6);
  };

  // Get similar services (exclude current service)
  const getSimilarServices = () => {
    if (!service) return [];
    return servicesData.services.filter((s) => s.id !== service.id).slice(0, 6);
  };

  // Extract service details
  const extractServiceDetails = (service) => {
    return {
      experience: "5+ years",
      availability: "Flexible",
      responseTime: "Within 24 hours",
      rating: "4.8/5",
      jobsCompleted: "150+",
      guarantee: "30-day warranty",
      paymentMethods: "Cash, Credit, Digital",
      travel: "Up to 20 miles",
    };
  };

  // Safe category display function
  const getCategoryDisplay = (category) => {
    if (!category) return "Professional Service";
    return category.charAt(0).toUpperCase() + category.slice(1) + " Service";
  };

  // Extract rating for display
  const extractRating = (service) => {
    const ratings = [4.2, 4.5, 4.8, 4.0, 4.7, 4.9, 4.3, 4.6];
    return ratings[service.id % ratings.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Service Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The service you're looking for doesn't exist.
          </p>
          <Link
            to="/services"
            className="bg-[#2563EB] text-white px-6 py-3 rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const serviceTypeColor = getServiceTypeColor(service.category);
  const features = extractFeatures(service.description);
  const serviceDetails = extractServiceDetails(service);
  const similarServices = getSimilarServices();
  const rating = extractRating(service);

  // Create multiple image thumbnails
  const displayImages = service.images && service.images.length >= 4 
    ? service.images.slice(0, 4)
    : [
        getServiceImage(service),
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
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
          <Link to="/services" className="hover:text-[#2563EB]">
            Services
          </Link>
          {currentServiceType && (
            <>
              <ChevronRightSmall className="w-4 h-4" />
              <Link
                to="/services"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.back();
                }}
                className="hover:text-[#2563EB] capitalize"
              >
                {currentServiceType}
              </Link>
            </>
          )}
          <ChevronRightSmall className="w-4 h-4" />
          <span className="text-gray-900 font-medium line-clamp-1 max-w-xs">
            {service.title}
          </span>
        </div>

        {/* Header Navigation with share/save */}
        <div className="flex items-center gap-3">
          <button
            onClick={shareService}
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
                alt={service.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-4 left-4">
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${serviceTypeColor}`}
                >
                  {getCategoryDisplay(service.category)}
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
                    alt={`${service.title} - ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header with Title */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">{service.location}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {service.pay}
                  </div>
                  <div className="text-sm text-gray-500">Service Rate</div>
                </div>
              </div>

              {/* Enhanced Service Stats */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-center">
                  {/* Experience */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                      <Award className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Experience</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {serviceDetails.experience}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                      <Star className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Rating</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {rating.toFixed(1)}/5
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                      <Clock className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Response</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {serviceDetails.responseTime}
                    </div>
                  </div>

                  {/* Jobs Completed */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                      <Briefcase className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Jobs Done</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {serviceDetails.jobsCompleted}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Service Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <Shield className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Guarantee</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {serviceDetails.guarantee}
                  </div>
                </div>
                <div className="text-center">
                  <DollarSign className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Payment</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    Multiple
                  </div>
                </div>
                <div className="text-center">
                  <MapPin className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Travel Range</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {serviceDetails.travel}
                  </div>
                </div>
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Availability</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {serviceDetails.availability}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="px-6 flex space-x-8 overflow-x-auto">
                {["overview", "details", "location"].map((tab) => (
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
                      Service Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Service Features
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

              {activeTab === "details" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Service Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Service Type</span>
                          <span className="font-medium capitalize">
                            {service.category || "professional"}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Experience</span>
                          <span className="font-medium">
                            {serviceDetails.experience}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Rating</span>
                          <span className="font-medium">
                            {rating.toFixed(1)}/5
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Jobs Completed</span>
                          <span className="font-medium">
                            {serviceDetails.jobsCompleted}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Service Terms
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Availability</span>
                          <span className="font-medium">
                            {serviceDetails.availability}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Response Time</span>
                          <span className="font-medium">
                            {serviceDetails.responseTime}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Guarantee</span>
                          <span className="font-medium">
                            {serviceDetails.guarantee}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Travel Range</span>
                          <span className="font-medium">
                            {serviceDetails.travel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "location" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Service Area
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.location}
                    </p>

                    <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200">
                      <iframe
                        title="Service Location Map"
                        width="100%"
                        height="100%"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          service.location
                        )}&output=embed&zoom=15`}
                        className="border-0"
                      ></iframe>
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
              Contact Provider
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
                alt={service.sellerName || "Service Provider"}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {service.sellerName || "Professional Service Provider"}
                </h4>
                <p className="text-gray-600 text-sm">
                  Service Professional
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-[#FFD700] text-[#FFD700]"
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    (32 reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={`mailto:${service.contactEmail || "provider@example.com"}?subject=Inquiry about ${service.title}`}
                className="w-full bg-[#2563EB] text-white py-3 px-4 rounded-lg cursor-pointer hover:bg-[#1D4ED8] transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Provider
              </a>

              <button className="w-full border border-[#2563EB] text-[#2563EB] py-3 px-4 rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                <FaComments className="w-4 h-4" />
                Chat with Provider
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 inline mr-1" />
                Posted {service.posted || "recently"}
              </div>
            </div>
          </div>

          {/* Service Pricing Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Service Pricing
            </h3>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {service.pay}
                  </div>
                  <div className="text-sm text-green-700">Standard Rate</div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Free Consultation</span>
                  <span className="text-green-600 font-medium">Included</span>
                </div>
                <div className="flex justify-between">
                  <span>Travel Fee</span>
                  <span className="text-gray-900 font-medium">Waived</span>
                </div>
                <div className="flex justify-between">
                  <span>Materials</span>
                  <span className="text-gray-900 font-medium">Extra</span>
                </div>
              </div>

              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                <DollarSign className="w-5 h-5" />
                Get Free Quote
              </button>

              <p className="text-sm text-gray-600 text-center">
                Custom pricing available for larger projects
              </p>
            </div>
          </div>

          {/* Similar Services */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#2563EB]" />
                Similar Services ({similarServices.length})
              </h3>
            </div>

            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {similarServices.map((similarService) => {
                const similarServiceType = extractServiceType(similarService);
                const similarServiceTypeColor = getServiceTypeColor(similarServiceType);

                return (
                  <Link
                    key={similarService.id}
                    to={`/services/${similarService.id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex gap-3">
                      <img
                        src={getServiceImage(similarService)}
                        alt={similarService.title}
                        className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                            {similarService.title}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${similarServiceTypeColor}`}
                          >
                            {similarServiceType}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-600 truncate">
                            {similarService.location?.split(",")[0] ||
                              similarService.location}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <DollarSign className="w-3 h-3" />
                          <span className="font-semibold text-green-600">
                            {similarService.pay}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#2563EB] text-sm">
                            {similarService.pay}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {similarService.posted || "recently"}
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
                to="/services"
                className="w-full text-center text-[#2563EB] font-medium hover:text-[#1D4ED8] transition-colors text-sm inline-flex items-center justify-center gap-1"
              >
                View All Services
                <ArrowLeft className="w-4 h-4 transform rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesDetails;