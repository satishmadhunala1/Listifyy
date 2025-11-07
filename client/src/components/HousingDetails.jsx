// src/components/HousingDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import {
  MapPin,
  Mail,
  Bed,
  Square,
  Heart,
  Share2,
  Calendar,
  Star,
  Home,
  Bath,
  Car,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  Users,
  Building,
  Ruler,
  Shield,
} from "lucide-react";
import { housingData } from "../jsonData/index.js";

function HousingDetails() {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedHouses, setSavedHouses] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchHouseData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundHouse = housingData.houses.find(
          (house) => house.id === parseInt(id)
        );
        
        if (!foundHouse) {
          setError("House not found");
        } else {
          setHouse(foundHouse);
          setSelectedImage(foundHouse.images[0]);
        }
      } catch (err) {
        setError("Failed to load house data");
        console.error("Error fetching house data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseData();
  }, [id]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedHouses") || "[]");
    setSavedHouses(saved);
  }, [id]);

  const isSaved = savedHouses.some((h) => h.id === house?.id);

  const toggleSave = () => {
    if (!house) return;
    let newSaved;
    if (isSaved) {
      newSaved = savedHouses.filter((h) => h.id !== house.id);
    } else {
      newSaved = [...savedHouses, house];
    }
    setSavedHouses(newSaved);
    localStorage.setItem("savedHouses", JSON.stringify(newSaved));
  };

  const shareProperty = () => {
    if (navigator.share) {
      navigator.share({
        title: house.title,
        text: house.description,
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

  // Extract features from description
  const extractFeatures = (description) => {
    const features = [];
    if (description.toLowerCase().includes("parking")) features.push("Parking");
    if (description.toLowerCase().includes("garden") || description.toLowerCase().includes("yard"))
      features.push("Garden");
    if (description.toLowerCase().includes("balcony")) features.push("Balcony");
    if (description.toLowerCase().includes("pool"))
      features.push("Swimming Pool");
    if (description.toLowerCase().includes("security"))
      features.push("Security");
    if (description.toLowerCase().includes("furnished"))
      features.push("Furnished");
    if (description.toLowerCase().includes("air conditioning") || description.toLowerCase().includes("ac"))
      features.push("Air Conditioning");
    if (description.toLowerCase().includes("laundry")) features.push("Laundry");
    if (description.toLowerCase().includes("modern"))
      features.push("Modern Design");
    if (description.toLowerCase().includes("renovated"))
      features.push("Recently Renovated");
    if (description.toLowerCase().includes("view")) features.push("Great View");
    if (description.toLowerCase().includes("storage"))
      features.push("Storage Space");

    // Add default features if none found
    if (features.length === 0) {
      features.push(
        "Modern Kitchen",
        "Hardwood Floors",
        "Natural Light",
        "Energy Efficient",
        "Smart Home"
      );
    }

    return features.slice(0, 8);
  };

  // Get similar properties (exclude current house)
  const getSimilarProperties = () => {
    if (!house) return [];
    return housingData.houses.filter((h) => h.id !== house.id).slice(0, 6);
  };

  // Extract property details from description
  const extractPropertyDetails = (description) => {
    const details = {
      bedrooms: house?.bedrooms || 4,
      bathrooms: house?.bathrooms || 3,
      parking: "Indoor",
      area: `${house?.sqft || "1,024"} ft`,
      safety: "Gated",
      yearBuilt: 2020,
      propertyType: house?.propertyType || "Villa",
      lotSize: "0.25 acres",
      heating: "Central",
      cooling: "Central Air",
      appliances: "Included",
    };

    return details;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !house) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The property you're looking for doesn't exist.
          </p>
          <Link
            to="/housing"
            className="bg-[#2563EB] text-white px-6 py-3 rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const features = extractFeatures(house.description);
  const propertyDetails = extractPropertyDetails(house.description);
  const similarProperties = getSimilarProperties();
  const displayImages = [
    house.images[0],
    "https://images.unsplash.com/photo-1740446565402-9d976b6a82dd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
    "https://plus.unsplash.com/premium_photo-1682377521741-66b111791809?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171",
    "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/housing"
              className="inline-flex items-center text-[#2563EB] font-medium hover:text-[#1D4ED8] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Properties
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={shareProperty}
                className="p-2 text-gray-600 hover:text-[#2563EB] transition-colors relative"
              >
                <Share2 className="w-5 h-5" />
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
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
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:w-2/3">
            {/* Image Gallery - Modern Style */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt={house.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      house.type === "rent"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-green-100 text-green-800 border border-green-200"
                    }`}
                  >
                    {house.type === "rent" ? "For Rent" : "For Sale"}
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
                      alt={`${house.title} - ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header with Price and Title */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {house.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{house.location}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#2563EB] mb-1">
                      {house.type === "rent"
                        ? `$${house.price}/month`
                        : `$${house.price.toLocaleString()}`}
                    </div>
                    {house.type === "sale" && (
                      <div className="text-sm text-gray-500">Sale Price</div>
                    )}
                  </div>
                </div>

                {/* Enhanced Property Stats */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="grid lg:grid-cols-9 md:grid-cols-3 grid-cols-2 text-center">
                    {/* Bedroom */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Bed className="w-6 h-6 text-[#2563EB]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Bedroom</div>
                      <div className="font-semibold text-gray-900">
                        {propertyDetails.bedrooms}
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden md:flex items-center justify-center">
                      <div className="w-px h-12 bg-gray-300"></div>
                    </div>

                    {/* Bathroom */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Bath className="w-6 h-6 text-[#2563EB]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Bathroom</div>
                      <div className="font-semibold text-gray-900">
                        {propertyDetails.bathrooms}
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden md:flex items-center justify-center">
                      <div className="w-px h-12 bg-gray-300"></div>
                    </div>

                    {/* Area */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Square className="w-6 h-6 text-[#2563EB]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Area</div>
                      <div className="font-semibold text-gray-900">
                        {propertyDetails.area}
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden md:flex items-center justify-center">
                      <div className="w-px h-12 bg-gray-300"></div>
                    </div>

                    {/* Parking */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Car className="w-6 h-6 text-[#2563EB]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Parking</div>
                      <div className="font-semibold text-gray-900">
                        {propertyDetails.parking}
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden md:flex items-center justify-center">
                      <div className="w-px h-12 bg-gray-300"></div>
                    </div>

                    {/* Area Safety */}
                    <div className="flex flex-col items-center col-span-2 md:col-span-1 mt-4 md:mt-0">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Shield className="w-6 h-6 text-[#2563EB]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        Area Safety
                      </div>
                      <div className="font-semibold text-gray-900">
                        {propertyDetails.safety}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Property Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <Building className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Type</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {propertyDetails.propertyType}
                    </div>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Year Built</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {propertyDetails.yearBuilt}
                    </div>
                  </div>
                  <div className="text-center">
                    <Ruler className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Lot Size</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {propertyDetails.lotSize}
                    </div>
                  </div>
                  <div className="text-center">
                    <Users className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Furnished</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      Yes
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="px-6 flex space-x-8 overflow-x-auto">
                  {["overview", "features", "location", "details"].map(
                    (tab) => (
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
                    )
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Property Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {house.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Key Features
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

                {activeTab === "features" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Property Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Property Type</span>
                            <span className="font-medium">
                              {propertyDetails.propertyType}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Year Built</span>
                            <span className="font-medium">
                              {propertyDetails.yearBuilt}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Lot Size</span>
                            <span className="font-medium">
                              {propertyDetails.lotSize}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Stories</span>
                            <span className="font-medium">2</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Interior Features
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Heating</span>
                            <span className="font-medium">
                              {propertyDetails.heating}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Cooling</span>
                            <span className="font-medium">
                              {propertyDetails.cooling}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Appliances</span>
                            <span className="font-medium">
                              {propertyDetails.appliances}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Flooring</span>
                            <span className="font-medium">Hardwood</span>
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
                        Neighborhood Information
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Located in a peaceful residential area with easy access
                        to schools, shopping centers, and public transportation.
                        The neighborhood offers a perfect blend of suburban
                        tranquility and urban convenience.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-[#2563EB]">
                            0.5 mi
                          </div>
                          <div className="text-sm text-gray-600">
                            Elementary School
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-[#2563EB]">
                            1.2 mi
                          </div>
                          <div className="text-sm text-gray-600">
                            Shopping Mall
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-[#2563EB]">
                            0.3 mi
                          </div>
                          <div className="text-sm text-gray-600">City Park</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-[#2563EB]">
                            0.8 mi
                          </div>
                          <div className="text-sm text-gray-600">
                            Public Transport
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Map Location
                      </h3>
                      <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200">
                        <iframe
                          title="Property Location Map"
                          width="100%"
                          height="100%"
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(
                            house.location
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
                          Financial Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Price</span>
                            <span className="font-medium text-[#2563EB]">
                              {house.type === "rent"
                                ? `$${house.price}/month`
                                : `$${house.price.toLocaleString()}`}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Property Tax</span>
                            <span className="font-medium">$3,200/year</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">HOA Fees</span>
                            <span className="font-medium">$150/month</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Insurance</span>
                            <span className="font-medium">$800/year</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Additional Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">MLS Number</span>
                            <span className="font-medium">
                              #{house.id}12345
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Listed Date</span>
                            <span className="font-medium">{house.posted}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Property ID</span>
                            <span className="font-medium">
                              PROP{house.id}00
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Status</span>
                            <span className="font-medium text-green-600">
                              Active
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
                Contact Agent
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
                  alt={house.sellerName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {house.sellerName}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Licensed Real Estate Agent
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-[#FFD700] text-[#FFD700]"
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      (24 reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:${house.contactEmail}?subject=Inquiry about ${house.title}`}
                  className="w-full bg-[#2563EB] text-white py-3 px-4 rounded-lg cursor-pointer hover:bg-[#1D4ED8] transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Agent
                </a>

                <button className="w-full border border-[#2563EB] text-[#2563EB] py-3 px-4 rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                  <FaComments className="w-4 h-4" />
                  Chat with Agent
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Listed {house.posted}
                </div>
              </div>
            </div>

            {/* Similar Properties */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Home className="w-5 h-5 text-[#2563EB]" />
                  Similar Properties ({similarProperties.length})
                </h3>
              </div>

              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {similarProperties.map((similarHouse) => (
                  <Link
                    key={similarHouse.id}
                    to={`/property/${similarHouse.id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex gap-3">
                      <img
                        src={similarHouse.images[0]}
                        alt={similarHouse.title}
                        className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                            {similarHouse.title}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                              similarHouse.type === "rent"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {similarHouse.type === "rent" ? "Rent" : "Sale"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-600 truncate">
                            {similarHouse.location.split(",")[0]}
                          </p>
                        </div>

                        {/* Property Features */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <div className="flex items-center gap-1">
                            <Bed className="w-3 h-3" />
                            <span>{similarHouse.bedrooms} beds</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="w-3 h-3" />
                            <span>{similarHouse.bathrooms} baths</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="w-3 h-3" />
                            <span>{similarHouse.sqft} sqft</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#2563EB] text-sm">
                            {similarHouse.type === "rent"
                              ? `$${similarHouse.price}/mo`
                              : `$${similarHouse.price.toLocaleString()}`}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {similarHouse.posted}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <Link
                  to="/housing"
                  className="w-full text-center text-[#2563EB] font-medium hover:text-[#1D4ED8] transition-colors text-sm inline-flex items-center justify-center gap-1"
                >
                  View All Properties
                  <ArrowLeft className="w-4 h-4 transform rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HousingDetails;