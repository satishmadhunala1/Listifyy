import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Bell, 
  X, 
  Menu,
  FileText,
  Heart,
  MapPin
} from "lucide-react";

import Sidebar from "../UserProfile/Sidebar";
import RightProfileSection from "../UserProfile/RightProfileSection";
import HomeSection from "../UserProfile/HomeSection";
import MessagesSection from "../UserProfile/MessagesSection";
import PersonalDetailsSection from "../UserProfile/PersonalDetailsSection";
import PropertyCard from "../UserProfile/PropertyCard";
import SmallProfileHeader from "../UserProfile/SmallProfileHeader";

export default function ModernProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeSection, setActiveSection] = useState(
    location.state?.activeSection || "home"
  );
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, San Francisco, CA",
    isLoggedIn: true,
    status: "Available"
  });
  const [savedHouses, setSavedHouses] = useState([]);
  const [myPosts, setMyPosts] = useState([
    { id: 1, title: "Cozy Apartment in Downtown", description: "A beautiful and cozy apartment located in the heart of the city.", type: "rent", price: 2500, location: "San Francisco, CA", images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"], category: "apartments" },
    { id: 2, title: "Spacious Suburban House", description: "A spacious house perfect for families, located in a quiet suburb.", type: "sale", price: 550000, location: "San Jose, CA", images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"], category: "houses" }
    ]);
  const [myAlerts, setMyAlerts] = useState([]);
  const [messages, setMessages] = useState([
    { name: "Alice Brown", preview: "Interested in the downtown apartment...", time: "11:01", unread: true, avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" },
    { name: "Bob Smith", preview: "Thanks for the update on villa...", time: "09:38", unread: false, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
    { name: "Carol Johnson", preview: "Scheduling a viewing...", time: "09:38", unread: false, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load user details from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.profilePic) {
          setProfilePicPreview(parsedUser.profilePic);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }
  }, []);

  // Load saved items from localStorage
  useEffect(() => {
    const loadSavedItems = () => {
      try {
        const savedItems = JSON.parse(localStorage.getItem("savedItems") || "[]");
        setSavedHouses(savedItems);
      } catch (error) {
        console.error('Error loading saved items:', error);
        setSavedHouses([]);
      }
    };

    loadSavedItems();
    
    // Listen for changes to saved items
    const handleSavedItemsChange = () => {
      loadSavedItems();
    };

    window.addEventListener("savedItemsChanged", handleSavedItemsChange);
    
    return () => {
      window.removeEventListener("savedItemsChanged", handleSavedItemsChange);
    };
  }, []);

  useEffect(() => {
    setEditData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
    });
  }, [user]);

  // Update activeSection when location state changes
  useEffect(() => {
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
      // Clear the state after using it to prevent sticking on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreview = reader.result;
        setProfilePicPreview(newPreview);
        setEditData({ ...editData, profilePic: newPreview });
        // Update user in localStorage
        const updatedUser = { ...user, profilePic: newPreview };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...editData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
  };

  const toggleSave = (house) => {
    const updatedSavedHouses = savedHouses.filter(h => h.id !== house.id);
    setSavedHouses(updatedSavedHouses);
    
    // Also update localStorage
    localStorage.setItem("savedItems", JSON.stringify(updatedSavedHouses));
    window.dispatchEvent(new CustomEvent("savedItemsChanged"));
  };

  const counts = {
    posts: myPosts.length,
    saved: savedHouses.length,
    alerts: myAlerts.length
  };

  // Mock data for home section
  const agendaEvents = {
    2: [ // Wednesday
      { title: "Group Viewing Tour", time: "12:30-1:30", group: true, avatars: ["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=20&h=20", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=20&h=20", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=20&h=20"] },
      { title: "Viewing with T. Morgan", time: "1:40-1:45", client: "T. Morgan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face" }
    ],
    3: [ // Thursday
      { title: "Viewing with S. Green", time: "1:30-1:45", client: "S. Green", avatar: "https://images.unsplash.com/photo-1524504388940-b8e918bb7c5c?w=24&h=24&fit=crop&crop=face" }
    ]
  };

  const viewingRequests = [
    { client: "James Patel", time: "Today, 3:00", type: "Apartment Viewing", status: "Approved", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
    { client: "Hannah Collins", time: "Tomorrow, 6:30", type: "Villa Tour", status: "Pending", avatar: "https://images.unsplash.com/photo-1524504388940-b8e918bb7c5c?w=40&h=40&fit=crop&crop=face" },
    { client: "Sara Kim", time: "Fri, 10:00", type: "Property Inspection", status: "Declined", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" }
  ];

  const handleViewAll = (section) => {
    setActiveSection(section);
  };

  // Helper functions for saved items display
  const getPriceDisplay = (item) => {
    if (!item.price) return "Price not specified";
    const price = typeof item.price === "number" ? item.price : parseFloat(item.price.replace(/[^\d.]/g, ""));
    if (isNaN(price)) return "Price not specified";
    return item.type === "rent" ? `$${price}/mo` : `$${price.toLocaleString()}`;
  };

  const getTypeDisplay = (item) => {
    return item.type === "rent" ? "For Rent" : item.type === "sale" ? "For Sale" : item.type || "Item";
  };

  const getLocationDisplay = (item) => item.location ? item.location.split(",")[0] : "N/A";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {/* <header className="fixed top-0 left-0 w-full z-40 bg-white shadow-sm border-b border-gray-200 px-1 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
            <h1 
              className="text-xl font-bold text-blue-700 sm:text-2xl flex-shrink-0 cursor-pointer hover:text-blue-800 transition-colors"
              onClick={() => navigate('/')}
            >
              Listify
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveSection('alerts')}
              className="relative p-2 rounded-full hover:bg-gray-50 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {counts.alerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {counts.alerts > 99 ? '99+' : counts.alerts}
                </span>
              )}
            </button>
            <SmallProfileHeader profilePic={profilePicPreview} />
          </div>
        </div>
      </header> */}

      <div className="pt-16 container mx-auto px-1 py-6 mt-4">
        <div className="lg:flex gap-6">
          <Sidebar 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            counts={counts}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          
          <main className="flex-1 lg:mr-6 space-y-6 w-full">
            {activeSection === "home" && (
              <HomeSection
                savedHouses={savedHouses}
                myPosts={myPosts}
                myAlerts={myAlerts}
                messages={messages}
                agendaEvents={agendaEvents}
                viewingRequests={viewingRequests}
                onViewAll={handleViewAll}
              />
            )}

            {activeSection === "messages" && (
              <MessagesSection messages={messages} />
            )}

            {activeSection === "personal" && (
              <PersonalDetailsSection
                user={user}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editData={editData}
                setEditData={setEditData}
                profilePicPreview={profilePicPreview}
                handleProfilePicChange={handleProfilePicChange}
                handleSave={handleSave}
                handleCancel={handleCancel}
              />
            )} 

            {activeSection === "saved" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Saved Items</h2>
                  <p className="text-sm text-gray-500 mt-1">{savedHouses.length} properties saved</p>
                </div>
                {savedHouses.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved items yet</h3>
                    <p className="text-gray-600 mb-6">Start saving properties you love!</p>
                    <button 
                      onClick={() => navigate('/categories')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium border border-blue-600"
                    >
                      Browse Properties
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {savedHouses.map((house) => (
                      <div
                        key={house.id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-all duration-300"
                      >
                        <div className="relative">
                          <img
                            src={
                              house.images?.[0] ||
                              "https://via.placeholder.com/300x200?text=No+Image"
                            }
                            alt={house.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                house.type === "rent"
                                  ? "bg-blue-100 text-blue-800"
                                  : house.type === "sale"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {getTypeDisplay(house)}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <button
                              onClick={() => toggleSave(house)}
                              className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors border border-gray-200"
                            >
                              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                            {house.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                            {house.description}
                          </p>
                          <div className="flex items-center text-gray-500 mb-3 text-sm">
                            <MapPin className="w-4 h-4 mr-1 text-blue-600" />
                            <span>{getLocationDisplay(house)}</span>
                          </div>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xl font-bold text-green-600">
                              {getPriceDisplay(house)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/${house.category || "houses"}/${house.id}`)}
                              className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm border border-blue-600"
                            >
                              View Details
                            </button>
                            <a
                              href={`mailto:${house.contactEmail || "contact@example.com"}?subject=Inquiry about ${house.title}`}
                              className="flex-1 border border-blue-600 text-blue-600 text-center py-2 px-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-medium text-sm"
                            >
                              Contact
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

           {activeSection === "posts" && (
              <div>
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Posts ({myPosts.length})</h2>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium border border-blue-600 w-full sm:w-auto">
                    Post New Ad
                  </button>
                </div>
                {myPosts.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-6">Create your first listing!</p>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium border border-blue-600">
                      Post New Ad
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {myPosts.map((post) => (
                      <PropertyCard 
                        key={post.id} 
                        property={post} 
                        isMyPost={true}
                        onToggleSave={() => {}}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "settings" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Settings</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates about new listings</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

             {activeSection === "alerts" && (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No alerts yet</h3>
                <p className="text-gray-600 mb-6">Set up alerts for new listings!</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium border border-blue-600">
                  Set Up Alert
                </button>
              </div>
            )}

             {activeSection === "activity" && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:text-3xl">Account Activity</h2>
                <p className="text-gray-600">Recent activity will be shown here.</p>
              </div>
            )} 

           {activeSection === "security" && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:text-3xl">Security</h2>
                <p className="text-gray-600">Security settings will be managed here.</p>
              </div>
            )} 
          </main>

          {/* Right Profile Section */}
          <RightProfileSection 
            user={user} 
            profilePic={profilePicPreview} 
            myPosts={myPosts} 
            onToggleSave={toggleSave} 
          />
        </div>
      </div>
    </div>
  );
}