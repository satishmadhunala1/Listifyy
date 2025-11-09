// src/components/SalesDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Heart,
  Share2,
  MessageCircle,
  Phone,
  Calendar,
  Star,
  Package,
  Shield,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  ChevronRight as ChevronRightSmall,
} from "lucide-react";
import data from "../data/data.json";

function SalesDetails() {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Get item image function
  const getItemImage = (item) => {
    const itemType = item.type || "sale";
    const itemTitle = item.title || "";
    if (itemType === "sale") {
      if (
        itemTitle.toLowerCase().includes("jeans") ||
        itemTitle.toLowerCase().includes("clothing")
      ) {
        return "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("phone") ||
        itemTitle.toLowerCase().includes("electronic")
      ) {
        return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80";
      } else if (itemTitle.toLowerCase().includes("book")) {
        return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("furniture") ||
        itemTitle.toLowerCase().includes("table") ||
        itemTitle.toLowerCase().includes("sofa")
      ) {
        return "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("game") ||
        itemTitle.toLowerCase().includes("console")
      ) {
        return "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("sport") ||
        itemTitle.toLowerCase().includes("basketball") ||
        itemTitle.toLowerCase().includes("tennis")
      ) {
        return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("car") ||
        itemTitle.toLowerCase().includes("tire") ||
        itemTitle.toLowerCase().includes("motorcycle")
      ) {
        return "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (itemTitle.toLowerCase().includes("plant")) {
        return "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else {
        return "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      }
    } else if (itemType === "free") {
      return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    } else if (itemType === "wanted") {
      return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    }
    return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
  };

  useEffect(() => {
    try {
      setLoading(true);
      // Simulate API call delay
      const timer = setTimeout(() => {
        const foundSale = data.marketplace.find((s) => s.id === parseInt(id));
        if (!foundSale) {
          setError("Item not found");
        } else {
          setSale(foundSale);
          const primaryImage = foundSale.images?.[0] || getItemImage(foundSale);
          setSelectedImage(primaryImage);
        }
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } catch (err) {
      setError("Failed to load item data");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedItems") || "[]");
    setSavedItems(saved);
  }, [id]);

  useEffect(() => {
    const loadSaved = () => {
      const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
      setSavedItems(saved);
    };
    window.addEventListener('savedItemsChanged', loadSaved);
    return () => window.removeEventListener('savedItemsChanged', loadSaved);
  }, []);

  const isSaved = savedItems.some((h) => h.id === sale?.id);

  const toggleSave = () => {
    if (!sale) return;
    let newSaved;
    if (isSaved) {
      newSaved = savedItems.filter((h) => h.id !== sale.id);
    } else {
      newSaved = [...savedItems, sale];
    }
    setSavedItems(newSaved);
    localStorage.setItem("savedItems", JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent('savedItemsChanged'));
  };

  const shareProperty = () => {
    if (navigator.share) {
      navigator.share({
        title: sale.title,
        text: sale.description,
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

  // Get type badge color and text
  const getTypeInfo = (type) => {
    switch (type) {
      case "sale":
        return { color: "bg-red-100 text-red-800", text: "For Sale" };
      case "free":
        return { color: "bg-green-100 text-green-800", text: "Free" };
      case "wanted":
        return { color: "bg-purple-100 text-purple-800", text: "Wanted" };
      default:
        return { color: "bg-gray-100 text-gray-800", text: type };
    }
  };

  // Get condition badge color
  const getConditionColor = (condition) => {
    switch (condition) {
      case "New":
        return "bg-green-100 text-green-800";
      case "Like New":
        return "bg-blue-100 text-blue-800";
      case "Good":
        return "bg-emerald-100 text-emerald-800";
      case "Fair":
        return "bg-yellow-100 text-yellow-800";
      case "Poor":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Extract features from description
  const extractFeatures = (description) => {
    const features = [];
    if (!description) return features;
    if (
      description.toLowerCase().includes("brand new") ||
      description.toLowerCase().includes("new")
    )
      features.push("Brand New");
    if (
      description.toLowerCase().includes("excellent") ||
      description.toLowerCase().includes("perfect")
    )
      features.push("Excellent Condition");
    if (
      description.toLowerCase().includes("rare") ||
      description.toLowerCase().includes("limited")
    )
      features.push("Rare Item");
    if (
      description.toLowerCase().includes("authentic") ||
      description.toLowerCase().includes("original")
    )
      features.push("Authentic");
    if (description.toLowerCase().includes("warranty"))
      features.push("Warranty Included");
    if (
      description.toLowerCase().includes("delivery") ||
      description.toLowerCase().includes("shipping")
    )
      features.push("Delivery Available");
    if (description.toLowerCase().includes("negotiable"))
      features.push("Price Negotiable");
    if (
      description.toLowerCase().includes("urgent") ||
      description.toLowerCase().includes("quick")
    )
      features.push("Quick Sale");
    // Add default features if none found
    if (features.length === 0) {
      features.push(
        "Good Condition",
        "Well Maintained",
        "Clean Item",
        "Ready to Use"
      );
    }
    return features.slice(0, 8);
  };

  // Get similar items (exclude current item)
  const getSimilarItems = () => {
    if (!sale) return [];
    return data.marketplace
      .filter((item) => item.id !== sale.id && item.type === sale.type)
      .slice(0, 6);
  };

  // Extract item details from description
  const extractItemDetails = (description) => {
    const details = {
      condition: sale?.condition || "Good",
      priceType: getTypeInfo(sale?.type || "sale").text,
      listedDate: sale?.posted || "Today",
      itemId: `#${sale?.id || 0}`,
      sellerType: "Individual",
      responseTime: "Within 24 hours",
      meetup: "Public Location",
      delivery: "Available",
    };

    return details;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center ">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center ">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Item Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The item you're looking for doesn't exist.
          </p>
          <Link
            to="/categories/sales"
            className="bg-[#2563EB] text-white px-6 py-3 rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const features = extractFeatures(sale.description);
  const itemDetails = extractItemDetails(sale.description);
  const similarItems = getSimilarItems();
  const typeInfo = getTypeInfo(sale.type);
  const conditionColor = getConditionColor(sale.condition);
  const displayImages =
    sale.images && sale.images.length > 0
      ? sale.images.length < 4
        ? [
            ...sale.images,
            ...Array(4 - sale.images.length).fill(sale.images[0]),
          ]
        : sale.images.slice(0, 4)
      : [
          getItemImage(sale),
          getItemImage(sale),
          getItemImage(sale),
          getItemImage(sale),
        ];

  return (
    <div className="max-w-7xl mx-auto pt-24 mt-10   ">
      {/* Header - Breadcrumb Navigation (matching HousingList style) */}
      <div className="flex items-center mt-4 justify-between  ">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-md text-gray-500">
            <Link to="/" className="hover:text-[#2563EB]">
              Home
            </Link>
            <ChevronRightSmall className="w-4 h-4" />
            <Link to="/categories" className="hover:text-[#2563EB]">
              Marketplace
            </Link>
            <ChevronRightSmall className="w-4 h-4" />
            <span className="text-gray-900 font-medium line-clamp-1">
              {sale.title}
            </span>
        </div>

      {/* Header Navigation (existing, with share/save) */}
            <div className="flex items-center gap-3">
              <button
                onClick={shareProperty}
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
                  alt={sale.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${typeInfo.color}`}
                  >
                    {typeInfo.text}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${conditionColor}`}>
                    {sale.condition || "Unknown"}
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
                      alt={`${sale.title} - ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Item Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header with Price and Title */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {sale.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{sale.location}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-3xl font-bold text-[#2563EB] mb-1 ${
                      sale.price === "Free"
                        ? "text-green-600"
                        : sale.price === "Negotiable"
                        ? "text-blue-600"
                        : ""
                    }`}>
                      {sale.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      {sale.type === "free"
                        ? "Free Item"
                        : sale.type === "wanted"
                        ? "Price Negotiable"
                        : "Sale Price"}
                    </div>
                  </div>
                </div>

                {/* Enhanced Item Stats */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 text-center">
                    {/* Condition */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Shield className="w-6 h-6 text-[#2563EB]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Condition</div>
                      <div className="font-semibold text-gray-900">
                        {itemDetails.condition}
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden md:flex items-center justify-center">
                      <div className="w-px h-12 bg-gray-300"></div>
                    </div>

                    {/* Category */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Package className="w-6 h-6 text-[#2563EB]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Category</div>
                      <div className="font-semibold text-gray-900">
                        {sale.category || "General"}
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden md:flex items-center justify-center">
                      <div className="w-px h-12 bg-gray-300"></div>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <CheckCircle className="w-6 h-6 text-[#2563EB]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Status</div>
                      <div className="font-semibold text-gray-900">
                        Available
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden md:flex items-center justify-center">
                      <div className="w-px h-12 bg-gray-300"></div>
                    </div>

                    {/* Type */}
                    <div className="flex flex-col items-center col-span-2 md:col-span-1 mt-4 md:mt-0">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Package className="w-6 h-6 text-[#2563EB]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Type</div>
                      <div className="font-semibold text-gray-900">
                        {itemDetails.priceType}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Item Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <Calendar className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Listed</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {itemDetails.listedDate}
                    </div>
                  </div>
                  <div className="text-center">
                    <MapPin className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Location</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {sale.location.split(",")[0] || sale.location}
                    </div>
                  </div>
                  <div className="text-center">
                    <Package className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Item ID</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {itemDetails.itemId}
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
                        Item Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {sale.description}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "features" && (
                  <div className="space-y-6">
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

                {activeTab === "location" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Pickup Location
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {sale.location}. The seller prefers to meet in a public
                        location for safety. Contact the seller to arrange a
                        convenient meeting time and place.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-[#2563EB]">
                            Public
                          </div>
                          <div className="text-sm text-gray-600">
                            Meeting Place
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-[#2563EB]">
                            Flexible
                          </div>
                          <div className="text-sm text-gray-600">Timings</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-[#2563EB]">
                            Safe
                          </div>
                          <div className="text-sm text-gray-600">
                            Transaction
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
                          title="Item Location Map"
                          width="100%"
                          height="100%"
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(
                            sale.location
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
                          Item Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Condition</span>
                            <span className="font-medium">
                              {itemDetails.condition}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Price Type</span>
                            <span className="font-medium">{itemDetails.priceType}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Listed Date</span>
                            <span className="font-medium">{itemDetails.listedDate}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Item ID</span>
                            <span className="font-medium">{itemDetails.itemId}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Seller Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Seller Type</span>
                            <span className="font-medium">
                              {itemDetails.sellerType}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Response Time</span>
                            <span className="font-medium">
                              {itemDetails.responseTime}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Meetup</span>
                            <span className="font-medium">
                              {itemDetails.meetup}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Delivery</span>
                            <span className="font-medium">
                              {itemDetails.delivery}
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
                Contact Seller
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#2563EB] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {sale.sellerName?.charAt(0) || "S"}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {sale.sellerName || "Seller"}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Marketplace Seller
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      (12 reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-[#2563EB] text-white py-3 px-4 rounded-lg cursor-pointer hover:bg-[#1D4ED8] transition-colors font-medium flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Message Seller
                </button>

                <button className="w-full border border-[#2563EB] text-[#2563EB] py-3 px-4 rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                  <Phone className="w-4 h-4" />
                  Call Seller
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Listed {sale.posted}
                </div>
              </div>
            </div>

            {/* Similar Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#2563EB]" />
                  Similar Items ({similarItems.length})
                </h3>
              </div>

              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {similarItems.map((similarItem) => {
                  const similarTypeInfo = getTypeInfo(similarItem.type);

                  return (
                    <Link
                      key={similarItem.id}
                      to={`/categories/sales/${similarItem.id}`}
                      className="block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex gap-3">
                        <img
                          src={similarItem.images?.[0] || getItemImage(similarItem)}
                          alt={similarItem.title}
                          className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                              {similarItem.title}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${similarTypeInfo.color}`}
                            >
                              {similarTypeInfo.text}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-600 truncate">
                              {similarItem.location.split(",")[0] || similarItem.location}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className={`font-bold text-[#2563EB] text-sm ${
                              similarItem.price === "Free"
                                ? "text-green-600"
                                : similarItem.price === "Negotiable"
                                ? "text-blue-600"
                                : ""
                            }`}>
                              {similarItem.price}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {similarItem.posted}
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
                  to="/categories/sales"
                  className="w-full text-center text-[#2563EB] font-medium hover:text-[#1D4ED8] transition-colors text-sm inline-flex items-center justify-center gap-1"
                >
                  View All Items
                  <ArrowLeft className="w-4 h-4 transform rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default SalesDetails;