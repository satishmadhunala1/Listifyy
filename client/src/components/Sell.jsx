import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaTools,
  FaBriefcase,
  FaCalendarAlt,
  FaComments,
  FaFileAlt,
  FaUserTie,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaShieldAlt,
  FaRocket,
  FaExclamationTriangle,
  FaGlobeAmericas,
  FaDollarSign,
  FaTag,
} from "react-icons/fa";

const Sell = ({ data, setData }) => {
  const [formData, setFormData] = useState({
    postType: "",
    intent: "offering",
    title: "",
    city: "",
    zipcode: "",
    description: "",
    email: "",
    phone: "",
    price: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepDirection, setStepDirection] = useState("forward");
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Color Scheme - Using only primary color for everything
  const colors = {
    primary: "#2F3A63",     // Deep navy blue - main color for everything
    secondary: "#4A5FC1",   // Bright blue for accents
    accent: "#FF6B35",      // Coral orange for CTAs
    success: "#10B981",     // Emerald green for success
    warning: "#F59E0B",     // Amber for warnings
    error: "#EF4444",       // Red for errors
  };

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsVisible(true);
  }, [currentStep]);

  // Initial page load animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categoryOptions = [
    {
      value: "houses",
      label: "Houses",
      icon: FaHome,
      desc: "Properties & rentals",
    },
    {
      value: "sales",
      label: "For Sale",
      icon: FaShoppingCart,
      desc: "Items & merchandise",
    },
    {
      value: "services",
      label: "Services",
      icon: FaTools,
      desc: "Professional services",
    },
    {
      value: "gigs",
      label: "Gigs",
      icon: FaBriefcase,
      desc: "Short-term work",
    },
    {
      value: "jobs",
      label: "Jobs",
      icon: FaUserTie,
      desc: "Employment opportunities",
    },
    {
      value: "community",
      label: "Events",
      icon: FaCalendarAlt,
      desc: "Community events",
    },
    {
      value: "forums",
      label: "Discussion",
      icon: FaComments,
      desc: "Forums & talks",
    },
    {
      value: "resumes",
      label: "Resumes",
      icon: FaFileAlt,
      desc: "Job seekers",
    },
  ];

  const steps = [
    { number: 1, title: "Category", icon: FaTag },
    { number: 2, title: "Details", icon: FaFileAlt },
    { number: 3, title: "Location", icon: FaMapMarkerAlt },
    { number: 4, title: "Contact", icon: FaPhone },
  ];

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.postType) newErrors.postType = "Please select a category";
        if (!formData.intent) newErrors.intent = "Please select post intent";
        break;
      case 2:
        if (!formData.title?.trim()) newErrors.title = "Title is required";
        if (!formData.description?.trim())
          newErrors.description = "Description is required";
        if (formData.description?.length > 500)
          newErrors.description =
            "Description must be less than 500 characters";
        break;
      case 3:
        if (!formData.city?.trim()) newErrors.city = "City is required";
        if (!formData.zipcode?.trim())
          newErrors.zipcode = "ZIP code is required";
        break;
      case 4:
        if (!formData.email?.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = "Please enter a valid email address";
        if (!formData.phone?.trim())
          newErrors.phone = "Phone number is required";
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategorySelect = (value) => {
    setFormData((prev) => ({ ...prev, postType: value }));
    if (errors.postType) {
      setErrors((prev) => ({ ...prev, postType: "" }));
    }
  };

  const handleIntentSelect = (value) => {
    setFormData((prev) => ({ ...prev, intent: value }));
    if (errors.intent) {
      setErrors((prev) => ({ ...prev, intent: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const maxExistingId = Math.max(
        ...Object.values(data)
          .flat()
          .map((item) => item.id),
        0
      );
      const newId = maxExistingId + 1;

      const categoryMap = {
        houses: "houses",
        sales: "sales",
        services: "services",
        gigs: "gigs",
        jobs: "jobs",
        community: "community",
        forums: "forums",
        resumes: "resumes",
      };

      const category = categoryMap[formData.postType] || "houses";

      const newItem = {
        id: newId,
        title: formData.title,
        type: formData.postType,
        intent: formData.intent,
        price: formData.price ? parseInt(formData.price) : 0,
        description: formData.description,
        location: `${formData.city}, ${formData.zipcode}`,
        contactEmail: formData.email,
        sellerName: "You",
        sellerPhone: formData.phone,
        sellerImage: "https://randomuser.me/api/portraits/men/1.jpg",
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
        ],
        createdAt: new Date().toISOString(),
        status: "active",
      };

      setData((prev) => ({
        ...prev,
        [category]: [...(prev[category] || []), newItem],
      }));

      setIsSubmitting(false);
      navigate(`/categories/${category}/${newId}`);
    } catch (error) {
      setIsSubmitting(false);
      alert("Failed to create post. Please try again.");
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setStepDirection("forward");
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStepDirection("backward");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All progress will be lost."
      )
    ) {
      navigate("/");
    }
  };

  const getStepContent = () => {
    const stepContent = {
      1: (
        <div className="space-y-8 animate-fade-in-up ">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold animate-slide-down" style={{ color: colors.primary }}>
              Select Category
            </h2>
            <p className="text-gray-600 animate-slide-down delay-100">
              Choose the most relevant category for your post
            </p>
          </div>

          {/* Category Selection Grid - Using only primary color */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {categoryOptions.map((item, index) => (
              <div
                key={item.value}
                onClick={() => handleCategorySelect(item.value)}
                className="relative cursor-pointer group transition-all duration-500 animate-stagger-item"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`p-5 rounded-xl border-2 text-center h-full flex flex-col items-center justify-center transition-all duration-500 transform hover: ${
                    formData.postType === item.value
                      ? "border-current bg-opacity-10 shadow-lg ring-2 ring-opacity-20 "
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }`}
                  style={{
                    borderColor: formData.postType === item.value ? colors.primary : undefined,
                    backgroundColor: formData.postType === item.value ? `${colors.primary}10` : undefined,
                    ringColor: formData.postType === item.value ? colors.primary : undefined,
                  }}
                >
                  {/* Checkmark Badge */}
                  {formData.postType === item.value && (
                    <div 
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-bounce-in z-10"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <FaCheck className="text-white text-xs font-bold" />
                    </div>
                  )}

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10">
                  </div>

                  <item.icon
                    className={`text-2xl mb-3 transition-all duration-500 transform  ${
                      formData.postType === item.value
                        ? "text-current animate-pulse-slow"
                        : "text-gray-500 group-hover:text-gray-700"
                    }`}
                    style={{ color: formData.postType === item.value ? colors.primary : undefined }}
                  />
                  <div 
                    className="font-semibold text-sm mb-1 transition-colors duration-300"
                    style={{ color: formData.postType === item.value ? colors.primary : colors.primary }}
                  >
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500 leading-tight transition-colors duration-300 group-hover:text-gray-700">
                    {item.desc}
                  </div>
                </div>

                {/* Subtle glow effect when selected */}
                {formData.postType === item.value && (
                  <div 
                    className="absolute inset-0 rounded-xl animate-pulse-gentle opacity-20 -z-10"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {errors.postType && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg border border-red-200 animate-shake">
              <FaExclamationTriangle className="flex-shrink-0 animate-pulse" />
              {errors.postType}
            </div>
          )}

          {/* Post Type Selection */}
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm animate-slide-up">
            <h3 className="font-semibold mb-4 flex items-center gap-2 animate-slide-right" style={{ color: colors.primary }}>
              <FaGlobeAmericas className="animate-spin-slow" style={{ color: colors.primary }} />
              Post Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Offering Option */}
              <div
                onClick={() => handleIntentSelect("offering")}
                className="relative cursor-pointer transition-all duration-500 animate-stagger-item"
                style={{ animationDelay: '400ms' }}
              >
                <div
                  className={`p-4 rounded-xl border-2 transition-all duration-500 transform hover: ${
                    formData.intent === "offering"
                      ? "border-current bg-opacity-10 shadow-lg ring-2 ring-opacity-20 "
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }`}
                  style={{
                    borderColor: formData.intent === "offering" ? colors.primary : undefined,
                    backgroundColor: formData.intent === "offering" ? `${colors.primary}10` : undefined,
                    ringColor: formData.intent === "offering" ? colors.primary : undefined,
                  }}
                >
                  {/* Checkmark Badge */}
                  {formData.intent === "offering" && (
                    <div 
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-bounce-in"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <FaCheck className="text-white text-xs font-bold" />
                    </div>
                  )}

                  <div className="flex items-center">
                    <div 
                      className="p-2 rounded-lg mr-3 transition-all duration-300 transform "
                      style={{ 
                        backgroundColor: `${colors.primary}20`,
                        color: colors.primary
                      }}
                    >
                      <FaShoppingCart className="text-sm" />
                    </div>
                    <div>
                      <div className="font-semibold transition-colors duration-300" style={{ color: colors.primary }}>
                        Offering
                      </div>
                      <div className="text-sm text-gray-600 mt-1 transition-colors duration-300 group-hover:text-gray-700">
                        Selling items, providing services, renting
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seeking Option */}
              <div
                onClick={() => handleIntentSelect("hiring")}
                className="relative cursor-pointer transition-all duration-500 animate-stagger-item"
                style={{ animationDelay: '500ms' }}
              >
                <div
                  className={`p-4 rounded-xl border-2 transition-all duration-500 transform hover: ${
                    formData.intent === "hiring"
                      ? "border-current bg-opacity-10 shadow-lg ring-2 ring-opacity-20 "
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }`}
                  style={{
                    borderColor: formData.intent === "hiring" ? colors.primary : undefined,
                    backgroundColor: formData.intent === "hiring" ? `${colors.primary}10` : undefined,
                    ringColor: formData.intent === "hiring" ? colors.primary : undefined,
                  }}
                >
                  {/* Checkmark Badge */}
                  {formData.intent === "hiring" && (
                    <div 
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-bounce-in"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <FaCheck className="text-white text-xs font-bold" />
                    </div>
                  )}

                  <div className="flex items-center">
                    <div 
                      className="p-2 rounded-lg mr-3 transition-all duration-300 transform "
                      style={{ 
                        backgroundColor: `${colors.primary}20`,
                        color: colors.primary
                      }}
                    >
                      <FaBriefcase className="text-sm" />
                    </div>
                    <div>
                      <div className="font-semibold transition-colors duration-300" style={{ color: colors.primary }}>
                        Seeking
                      </div>
                      <div className="text-sm text-gray-600 mt-1 transition-colors duration-300 group-hover:text-gray-700">
                        Looking to hire, buy, or find services
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {errors.intent && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-3 bg-red-50 px-4 py-2 rounded-lg animate-shake">
                <FaExclamationTriangle className="flex-shrink-0 animate-pulse" />
                {errors.intent}
              </div>
            )}
          </div>
        </div>
      ),

      // ... rest of the step content remains the same (steps 2, 3, 4)
      2: (
        <div className="space-y-6 animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold animate-slide-down" style={{ color: colors.primary }}>
              Post Details
            </h2>
            <p className="text-gray-600 animate-slide-down delay-100">
              Provide detailed information about your listing
            </p>
          </div>

          <div className="space-y-6">
            <div className="animate-stagger-item" style={{ animationDelay: '100ms' }}>
              <label className="block font-medium mb-3 animate-fade-in" style={{ color: colors.primary }}>
                Title *
              </label>
              <input
                name="title"
                placeholder="e.g., Professional web development services"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 outline-none transition-all duration-500 transform hover: ${
                  errors.title
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100 animate-shake"
                    : "border-gray-300 focus:border-[#2F3A63] focus:ring-[#2F3A63]/20 hover:border-gray-400"
                }`}
                required
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-2 animate-fade-in">
                  <FaExclamationTriangle className="flex-shrink-0 animate-pulse" />
                  {errors.title}
                </p>
              )}
            </div>

            <div className="animate-stagger-item" style={{ animationDelay: '200ms' }}>
              <label className="block font-medium mb-3 flex items-center gap-2 animate-fade-in" style={{ color: colors.primary }}>
                <FaDollarSign className="text-gray-500 animate-bounce-slow" />
                Price (Optional)
              </label>
              <input
                type="number"
                name="price"
                placeholder="Enter amount in USD"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[#2F3A63] focus:ring-2 focus:ring-[#2F3A63]/20 outline-none transition-all duration-500 transform hover: hover:border-gray-400"
              />
            </div>

            <div className="animate-stagger-item" style={{ animationDelay: '300ms' }}>
              <label className="block font-medium mb-3 animate-fade-in" style={{ color: colors.primary }}>
                Description *
              </label>
              <textarea
                name="description"
                placeholder="Describe your post in detail. Include important information, requirements, or specifications..."
                value={formData.description}
                onChange={handleInputChange}
                rows="6"
                className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 outline-none transition-all duration-500 transform hover: resize-none ${
                  errors.description
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100 animate-shake"
                    : "border-gray-300 focus:border-[#2F3A63] focus:ring-[#2F3A63]/20 hover:border-gray-400"
                }`}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <div>
                  {errors.description ? (
                    <span className="text-red-600 text-sm flex items-center gap-2 animate-fade-in">
                      <FaExclamationTriangle className="flex-shrink-0 animate-pulse" />
                      {errors.description}
                    </span>
                  ) : (
                    <span
                      className={`text-sm transition-colors duration-300 ${
                        formData.description.length > 450
                          ? "text-amber-600 animate-pulse"
                          : "text-gray-500"
                      }`}
                    >
                      {formData.description.length}/500 characters
                    </span>
                  )}
                </div>
                {formData.description.length > 450 && !errors.description && (
                  <span className="text-amber-600 text-sm flex items-center gap-2 animate-pulse">
                    <FaExclamationTriangle className="flex-shrink-0" />
                    Approaching character limit
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ),

      3: (
        <div className="space-y-6 animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold animate-slide-down" style={{ color: colors.primary }}>
              Location Information
            </h2>
            <p className="text-gray-600 animate-slide-down delay-100">Where is this located?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="animate-stagger-item" style={{ animationDelay: '100ms' }}>
              <label className="block font-medium mb-3 animate-fade-in" style={{ color: colors.primary }}>
                City *
              </label>
              <input
                name="city"
                placeholder="Enter city name"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 outline-none transition-all duration-500 transform hover: ${
                  errors.city
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100 animate-shake"
                    : "border-gray-300 focus:border-[#2F3A63] focus:ring-[#2F3A63]/20 hover:border-gray-400"
                }`}
                required
              />
              {errors.city && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-2 animate-fade-in">
                  <FaExclamationTriangle className="flex-shrink-0 animate-pulse" />
                  {errors.city}
                </p>
              )}
            </div>
            <div className="animate-stagger-item" style={{ animationDelay: '200ms' }}>
              <label className="block font-medium mb-3 animate-fade-in" style={{ color: colors.primary }}>
                ZIP Code *
              </label>
              <input
                name="zipcode"
                placeholder="Enter ZIP code"
                value={formData.zipcode}
                onChange={handleInputChange}
                className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 outline-none transition-all duration-500 transform hover: ${
                  errors.zipcode
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100 animate-shake"
                    : "border-gray-300 focus:border-[#2F3A63] focus:ring-[#2F3A63]/20 hover:border-gray-400"
                }`}
                required
              />
              {errors.zipcode && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-2 animate-fade-in">
                  <FaExclamationTriangle className="flex-shrink-0 animate-pulse" />
                  {errors.zipcode}
                </p>
              )}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-5 bg-gray-50 mt-6 animate-stagger-item" style={{ animationDelay: '300ms' }}>
            <div className="flex items-start gap-4">
              <div 
                className="p-2 rounded-lg mt-1 transition-all duration-300 transform hover:rotate-12"
                style={{ 
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary
                }}
              >
                <FaShieldAlt className="text-lg" />
              </div>
              <div>
                <h4 className="font-medium mb-1 animate-fade-in" style={{ color: colors.primary }}>
                  Your Privacy Matters
                </h4>
                <p className="text-gray-600 text-sm animate-fade-in delay-100">
                  Only the city and ZIP code will be visible to other users.
                  Your exact address remains private and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),

      4: (
        <div className="space-y-6 animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold animate-slide-down" style={{ color: colors.primary }}>
              Contact Details
            </h2>
            <p className="text-gray-600 animate-slide-down delay-100">How should people contact you?</p>
          </div>

          <div className="space-y-6">
            <div className="animate-stagger-item" style={{ animationDelay: '100ms' }}>
              <label className="block font-medium mb-3 flex items-center gap-2 animate-fade-in" style={{ color: colors.primary }}>
                <FaEnvelope className="text-gray-500 animate-bounce-slow" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 outline-none transition-all duration-500 transform hover: ${
                  errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100 animate-shake"
                    : "border-gray-300 focus:border-[#2F3A63] focus:ring-[#2F3A63]/20 hover:border-gray-400"
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-2 animate-fade-in">
                  <FaExclamationTriangle className="flex-shrink-0 animate-pulse" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="animate-stagger-item" style={{ animationDelay: '200ms' }}>
              <label className="block font-medium mb-3 flex items-center gap-2 animate-fade-in" style={{ color: colors.primary }}>
                <FaPhone className="text-gray-500 animate-bounce-slow" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 outline-none transition-all duration-500 transform hover: ${
                  errors.phone
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100 animate-shake"
                    : "border-gray-300 focus:border-[#2F3A63] focus:ring-[#2F3A63]/20 hover:border-gray-400"
                }`}
                required
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-2 animate-fade-in">
                  <FaExclamationTriangle className="flex-shrink-0 animate-pulse" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div 
            className="border rounded-lg p-5 mt-6 animate-stagger-item"
            style={{ 
              borderColor: `${colors.primary}30`,
              backgroundColor: `${colors.primary}10`,
              animationDelay: '300ms'
            }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="p-2 rounded-lg mt-1 transition-all duration-300 transform hover:"
                style={{ 
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary
                }}
              >
                <FaCheck className="text-lg" />
              </div>
              <div>
                <h4 className="font-medium mb-1 animate-fade-in" style={{ color: colors.primary }}>
                  Ready to Publish
                </h4>
                <p className="text-sm animate-fade-in delay-100" style={{ color: colors.primary }}>
                  Review your information carefully. Once published, your
                  listing will be visible to other users.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    };

    return (
      <div
        className={`transition-all duration-700 ease-out ${
          stepDirection === "forward"
            ? "animate-slide-in-right"
            : "animate-slide-in-left"
        }`}
      >
        {stepContent[currentStep]}
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className="bg-white rounded-xl w-full max-w-7xl shadow-2xl overflow-hidden border border-gray-200 animate-scale-in">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 mt-30">
          <div className="flex items-center justify-between mb-6">
            <div className="animate-slide-down">
              <h1 className="text-2xl font-bold" style={{ color: colors.primary }}>
                Create New Post
              </h1>
              <p className="text-gray-600 mt-1 animate-fade-in delay-200">
                Complete all steps to publish your listing
              </p>
            </div>
            <div 
              className="px-3 py-1 rounded-md text-sm font-medium animate-bounce-in"
              style={{ 
                backgroundColor: `${colors.primary}10`,
                color: colors.primary
              }}
            >
              Step {currentStep} of 4
            </div>
          </div>

          {/* Enhanced Progress Steps */}
          <div className="flex justify-between items-center relative px-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                {/* Step Circle */}
                <div className="flex flex-col items-center z-10 relative animate-stagger-item" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="relative">
                    {/* Pulse animation for current step */}
                    {currentStep === step.number && (
                      <div 
                        className="absolute -inset-2 rounded-full animate-pulse-ring"
                        style={{ backgroundColor: `${colors.primary}20` }}
                      ></div>
                    )}

                    <div
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-700 transform hover: ${
                        currentStep >= step.number
                          ? "text-white shadow-lg"
                          : "bg-white border-gray-300 text-gray-400"
                      } ${
                        currentStep === step.number
                          ? "ring-4  animate-pulse-slow"
                          : ""
                      }`}
                      style={{
                        backgroundColor: currentStep >= step.number ? colors.primary : undefined,
                        borderColor: currentStep >= step.number ? colors.primary : undefined,
                        ringColor: currentStep === step.number ? `${colors.primary}20` : undefined,
                      }}
                    >
                      {currentStep > step.number ? (
                        <FaCheck className="text-sm font-bold animate-bounce-in" />
                      ) : (
                        <step.icon className="text-sm transition-transform duration-300 hover:rotate-12" />
                      )}

                      <div
                        className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center transition-all duration-500 transform hover: ${
                          currentStep >= step.number
                            ? "text-white shadow-lg"
                            : "bg-gray-300 text-gray-600"
                        }`}
                        style={{
                          backgroundColor: currentStep >= step.number ? colors.primary : undefined,
                        }}
                      >
                        {step.number}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`mt-3 text-sm font-medium transition-all duration-500 transform hover: ${
                      currentStep >= step.number
                        ? "font-semibold"
                        : "text-gray-500"
                    }`}
                    style={{ color: currentStep >= step.number ? colors.primary : undefined }}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Progress Line between steps */}
                {index < steps.length - 1 && (
                  <div className="flex-1 relative h-2 mx-2">
                    {/* Background Track */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-200 rounded-full animate-pulse-slow"></div>

                    {/* Animated Progress Line */}
                    <div
                      className="absolute top-0 left-0 h-0.5 rounded-full transition-all duration-1000 ease-out transform origin-left"
                      style={{
                        width: currentStep > step.number ? "100%" : currentStep === step.number ? "50%" : "0%",
                        backgroundColor: colors.primary,
                      }}
                    >
                      {/* Moving Dot */}
                      {currentStep === step.number + 1 && (
                        <div 
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full shadow-lg animate-ping-slow"
                          style={{ backgroundColor: colors.primary }}
                        ></div>
                      )}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Progress Bar */}
          <div className="mt-6 lg:hidden animate-fade-in">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Category</span>
              <span>Details</span>
              <span>Location</span>
              <span>Contact</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ 
                  width: `${((currentStep - 1) / 3) * 100}%`,
                  backgroundColor: colors.primary,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit}>
            {getStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200 animate-fade-in-up">
              <button
                type="button"
                onClick={currentStep === 1 ? handleCancel : prevStep}
                disabled={isSubmitting}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover: font-medium disabled:opacity-50 flex items-center gap-2"
              >
                <FaArrowLeft className="text-sm transition-transform duration-300 group-hover:-translate-x-1" />
                {currentStep === 1 ? "Cancel" : "Back"}
              </button>

              <div className="flex gap-3">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 text-white rounded-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:shadow-lg transform hover: active:scale-95"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Continue
                    <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 text-white rounded-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:shadow-lg transform hover: active:scale-95"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <FaRocket className="text-sm transition-transform duration-300 group-hover:-translate-y-1" />
                        Publish Post
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        /* ... (all your existing CSS animations remain the same) */
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-gentle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.1; }
        }

        @keyframes stagger-item {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-right {
          animation: slideInFromRight 0.5s ease-out;
        }

        .animate-slide-in-left {
          animation: slideInFromLeft 0.5s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }

        .animate-slide-right {
          animation: slide-right 0.5s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }

        .animate-stagger-item {
          animation: stagger-item 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in-up 0.4s ease-out forwards;
          opacity: 0;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
};

export default Sell;