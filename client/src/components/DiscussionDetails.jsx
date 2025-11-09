// src/components/DiscussionDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  MessageCircle,
  Eye,
  ThumbsUp,
  User,
} from "lucide-react";
import data from "../data/data.json";

function DiscussionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedDiscussions, setSavedDiscussions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [currentDiscussionType, setCurrentDiscussionType] = useState(null);

  useEffect(() => {
    const fetchDiscussionData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const foundDiscussion = data.discussionForums.find(
          (discussion) => discussion.id === parseInt(id)
        );

        if (!foundDiscussion) {
          setError("Discussion not found");
        } else {
          setDiscussion(foundDiscussion);
          // Set initial image
          if (foundDiscussion.images && foundDiscussion.images.length > 0) {
            setSelectedImage(foundDiscussion.images[0]);
          } else {
            setSelectedImage(getDiscussionImage(foundDiscussion));
          }
          // Extract discussion type for breadcrumb
          const discussionType = extractDiscussionType(foundDiscussion);
          setCurrentDiscussionType(discussionType);
        }
      } catch (err) {
        setError("Failed to load discussion data");
        console.error("Error fetching discussion data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussionData();
  }, [id]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedDiscussions") || "[]");
    setSavedDiscussions(saved);
  }, [id]);

  // Enhanced discussion type extraction
  const extractDiscussionType = (discussion) => {
    const topic = discussion.topic.toLowerCase();

    if (
      topic.includes("park") ||
      topic.includes("hiking") ||
      topic.includes("garden") ||
      topic.includes("trail")
    )
      return "outdoors";
    if (
      topic.includes("restaurant") ||
      topic.includes("food") ||
      topic.includes("brewery") ||
      topic.includes("cooking")
    )
      return "food-drink";
    if (
      topic.includes("running") ||
      topic.includes("fitness") ||
      topic.includes("yoga") ||
      topic.includes("sports")
    )
      return "fitness";
    if (
      topic.includes("art") ||
      topic.includes("craft") ||
      topic.includes("pottery") ||
      topic.includes("photography")
    )
      return "arts-crafts";
    if (
      topic.includes("music") ||
      topic.includes("theater") ||
      topic.includes("event") ||
      topic.includes("movie")
    )
      return "entertainment";
    if (
      topic.includes("book") ||
      topic.includes("tech") ||
      topic.includes("coding") ||
      topic.includes("workshop")
    )
      return "education";

    return "community";
  };

  const isSaved = savedDiscussions.some((d) => d.id === discussion?.id);

  const toggleSave = () => {
    if (!discussion) return;
    let newSaved;
    if (isSaved) {
      newSaved = savedDiscussions.filter((d) => d.id !== discussion.id);
    } else {
      newSaved = [...savedDiscussions, discussion];
    }
    setSavedDiscussions(newSaved);
    localStorage.setItem("savedDiscussions", JSON.stringify(newSaved));
  };

  const shareDiscussion = () => {
    if (!discussion) return;

    if (navigator.share) {
      navigator.share({
        title: discussion.topic,
        text: discussion.topic,
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

  // Get discussion type badge color
  const getDiscussionTypeColor = (discussionType) => {
    switch (discussionType) {
      case "outdoors":
        return "bg-green-100 text-green-800 border border-green-200";
      case "food-drink":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "fitness":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "arts-crafts":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "entertainment":
        return "bg-pink-100 text-pink-800 border border-pink-200";
      case "education":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Get discussion image
  const getDiscussionImage = (discussion) => {
    if (discussion.images && discussion.images.length > 0) {
      return discussion.images[0];
    }

    const discussionType = extractDiscussionType(discussion);
    switch (discussionType) {
      case "outdoors":
        return "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "food-drink":
        return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "fitness":
        return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "arts-crafts":
        return "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "entertainment":
        return "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "education":
        return "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
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

  // Extract features from topic
  const extractFeatures = (topic) => {
    const features = [];
    if (!topic) return features;

    if (
      topic.toLowerCase().includes("community") ||
      topic.toLowerCase().includes("group")
    )
      features.push("Active Community");
    if (
      topic.toLowerCase().includes("best") ||
      topic.toLowerCase().includes("professional")
    )
      features.push("Expert Recommendations");
    if (
      topic.toLowerCase().includes("support") ||
      topic.toLowerCase().includes("help")
    )
      features.push("Supportive Environment");
    if (
      topic.toLowerCase().includes("learn") ||
      topic.toLowerCase().includes("education")
    )
      features.push("Learning Opportunity");
    if (
      topic.toLowerCase().includes("network") ||
      topic.toLowerCase().includes("connect")
    )
      features.push("Networking");
    if (
      topic.toLowerCase().includes("discuss") ||
      topic.toLowerCase().includes("talk")
    )
      features.push("Open Discussion");

    // Add default features if none found
    if (features.length === 0) {
      features.push(
        "Friendly Community",
        "Knowledge Sharing",
        "Respectful Dialogue",
        "Diverse Perspectives"
      );
    }

    return features.slice(0, 6);
  };

  // Get similar discussions (exclude current discussion)
  const getSimilarDiscussions = () => {
    if (!discussion) return [];
    return data.discussionForums
      .filter((d) => d.id !== discussion.id)
      .slice(0, 6);
  };

  // Generate engagement metrics
  const getEngagementMetrics = (discussion) => {
    // Generate consistent metrics based on discussion ID for demo
    const baseViews = (discussion.id % 300) * 50 + 500;
    const baseLikes = (discussion.id % 100) + 10;

    return {
      views: baseViews,
      likes: baseLikes,
      comments: discussion.comments || 0,
    };
  };

  // Safe category display function
  const getCategoryDisplay = (discussionType) => {
    if (!discussionType) return "Community Discussion";
    return (
      discussionType.charAt(0).toUpperCase() +
      discussionType.slice(1).replace("-", " ") +
      " Discussion"
    );
  };

  // Generate description
  const generateDescription = (discussion) => {
    return `Join the discussion about ${discussion.topic.toLowerCase()}. This community brings together people interested in sharing experiences, recommendations, and knowledge about this topic. With ${
      discussion.comments
    } comments already, it's an active community waiting for your input!`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading discussion details...</p>
        </div>
      </div>
    );
  }

  if (error || !discussion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Discussion Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The discussion you're looking for doesn't exist.
          </p>
          <Link
            to="/discussions"
            className="bg-[#2563EB] text-white px-6 py-3 rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Discussions
          </Link>
        </div>
      </div>
    );
  }

  const discussionTypeColor = getDiscussionTypeColor(
    extractDiscussionType(discussion)
  );
  const features = extractFeatures(discussion.topic);
  const similarDiscussions = getSimilarDiscussions();
  const engagement = getEngagementMetrics(discussion);
  const description = generateDescription(discussion);

  // Create multiple image thumbnails
  const displayImages = [
    selectedImage,
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
          <Link to="/discussions" className="hover:text-[#2563EB]">
            Discussions
          </Link>
          {currentDiscussionType && (
            <>
              <ChevronRightSmall className="w-4 h-4" />
              <Link
                to="/discussions"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.back();
                }}
                className="hover:text-[#2563EB] capitalize"
              >
                {currentDiscussionType.replace("-", " ")}
              </Link>
            </>
          )}
          <ChevronRightSmall className="w-4 h-4" />
          <span className="text-gray-900 font-medium line-clamp-1 max-w-xs">
            {discussion.topic}
          </span>
        </div>

        {/* Header Navigation with share/save */}
        <div className="flex items-center gap-3">
          <button
            onClick={shareDiscussion}
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
                alt={discussion.topic}
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-4 left-4">
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${discussionTypeColor}`}
                >
                  {getCategoryDisplay(extractDiscussionType(discussion))}
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
                    alt={`${discussion.topic} - ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Discussion Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header with Title */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {discussion.topic}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="font-medium">By {discussion.author}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-[#2563EB] mb-1">
                    {engagement.comments}+
                  </div>
                  <div className="text-sm text-gray-500">Active Comments</div>
                </div>
              </div>

              {/* Enhanced Discussion Stats */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-center">
                  {/* Comments */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                      <MessageCircle className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Comments</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {engagement.comments}
                    </div>
                  </div>

                  {/* Views */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                      <Eye className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Views</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {engagement.views}
                    </div>
                  </div>

                  {/* Likes */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                      <ThumbsUp className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Likes</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {engagement.likes}
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                      <Users className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Activity</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      High
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Discussion Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Posted</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {formatDate(discussion.posted)}
                  </div>
                </div>
                <div className="text-center">
                  <Star className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Rating</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    4.8/5
                  </div>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Participants</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    250+
                  </div>
                </div>
                <div className="text-center">
                  <Clock className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Status</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    Active
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="px-6 flex space-x-8 overflow-x-auto">
                {["overview", "discussion", "community"].map((tab) => (
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
                      Discussion Topic
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Community Features
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

              {activeTab === "discussion" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Discussion Guidelines
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Be Respectful</span>
                        <span className="font-medium">Always</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Stay on Topic</span>
                        <span className="font-medium">Required</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">No Spam</span>
                        <span className="font-medium">Strictly Enforced</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Share Knowledge</span>
                        <span className="font-medium">Encouraged</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Recent Activity
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Last Comment</span>
                        <span className="font-medium">2 hours ago</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">New Members</span>
                        <span className="font-medium">15 this week</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Discussion Pace</span>
                        <span className="font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "community" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Community Information
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Join our vibrant community of like-minded individuals who
                      share interests in{" "}
                      {extractDiscussionType(discussion).replace("-", " ")}.
                      This discussion is moderated to ensure quality
                      conversations and a welcoming environment for all
                      participants.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-[#2563EB]">
                          250+
                        </div>
                        <div className="text-sm text-gray-600">
                          Active Members
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-[#2563EB]">
                          1.2K
                        </div>
                        <div className="text-sm text-gray-600">Total Posts</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-[#2563EB]">
                          98%
                        </div>
                        <div className="text-sm text-gray-600">
                          Positive Rating
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Community Guidelines
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Respect All Members
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Treat everyone with respect and kindness
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Share Knowledge
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Contribute valuable insights and experiences
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Stay on Topic
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Keep discussions relevant to the forum theme
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            No Self-Promotion
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Focus on helping others, not promoting yourself
                          </p>
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
              Discussion Creator
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {discussion.author?.charAt(0) || "U"}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {discussion.author}
                </h4>
                <p className="text-gray-600 text-sm">Discussion Starter</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-[#FFD700] text-[#FFD700]"
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    (45 reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-[#2563EB] text-white py-3 px-4 rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                <MessageCircle className="w-4 h-4" />
                Join Discussion
              </button>

              <button className="w-full border border-[#2563EB] text-[#2563EB] py-3 px-4 rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                <Mail className="w-4 h-4" />
                Message Creator
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 inline mr-1" />
                Started {formatDate(discussion.posted)}
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2563EB]" />
              Community Stats
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Members</span>
                <span className="font-semibold text-gray-900">250+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Now</span>
                <span className="font-semibold text-green-600">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Today</span>
                <span className="font-semibold text-blue-600">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Discussion Rating</span>
                <span className="font-semibold text-yellow-600">4.8/5</span>
              </div>
            </div>
          </div>

          {/* Similar Discussions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#2563EB]" />
                Similar Discussions ({similarDiscussions.length})
              </h3>
            </div>

            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {similarDiscussions.map((similarDiscussion) => {
                const similarDiscussionTypeColor = getDiscussionTypeColor(
                  extractDiscussionType(similarDiscussion)
                );
                const similarEngagement =
                  getEngagementMetrics(similarDiscussion);

                return (
                  <Link
                    key={similarDiscussion.id}
                    to={`/discussions/${similarDiscussion.id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex gap-3">
                      <img
                        src={getDiscussionImage(similarDiscussion)}
                        alt={similarDiscussion.topic}
                        className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                            {similarDiscussion.topic}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${similarDiscussionTypeColor}`}
                          >
                            {getCategoryDisplay(
                              extractDiscussionType(similarDiscussion)
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 mb-2">
                          <User className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-600 truncate">
                            {similarDiscussion.author}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(similarDiscussion.posted)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#2563EB] text-sm">
                            {similarEngagement.comments} comments
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {similarDiscussion.posted}
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
                to="/discussions"
                className="w-full text-center text-[#2563EB] font-medium hover:text-[#1D4ED8] transition-colors text-sm inline-flex items-center justify-center gap-1"
              >
                View All Discussions
                <ArrowLeft className="w-4 h-4 transform rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscussionDetails;
