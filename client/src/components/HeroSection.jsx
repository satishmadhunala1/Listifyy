import React, { useState, useEffect, useRef } from "react";

const categories = [
  {
    name: "Community",
    img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1500&q=80",
    description: "Connect with local communities and events around you",
    offer: "Join Local Groups",
    gradient: "from-blue-600/90 to-purple-600/90",
  },
  {
    name: "Housing",
    img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1500&q=80",
    description: "Find apartments, houses, and rental properties",
    offer: "Premium Listings",
    gradient: "from-green-600/90 to-teal-600/90",
  },
  {
    name: "Jobs",
    img: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1500&q=80",
    description: "Discover career opportunities and employment",
    offer: "1000+ New Jobs",
    gradient: "from-orange-600/90 to-red-600/90",
  },
  {
    name: "Services",
    img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1500&q=80",
    description: "Professional services for all your needs",
    offer: "Trusted Pros",
    gradient: "from-purple-600/90 to-indigo-600/90",
  },
  {
    name: "For Sale",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1500&q=80",
    description: "Buy and sell items locally with great deals",
    offer: "Hot Deals",
    gradient: "from-red-600/90 to-pink-600/90",
  },
  {
    name: "Discussion Forums",
    img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1500&q=80",
    description: "Join conversations and share knowledge",
    offer: "Active Community",
    gradient: "from-indigo-600/90 to-blue-600/90",
  },
  {
    name: "Gigs",
      img: "/gigs.jpg",
    // img: "/gigs-bg.png",
    description: "Find freelance work and short-term projects",
    offer: "Quick Jobs",
    gradient: "from-teal-600/90 to-green-600/90",
  },
  {
    name: "Resumes & CVs",
    img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1500&q=80",
    description: "Build and share your professional profile",
    offer: "Career Boost",
    gradient: "from-gray-600/90 to-blue-600/90",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);

  // Auto slide every 5 seconds with progress tracking
  useEffect(() => {
    let startTime;
    let animationFrame;
    let interval;

    const updateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progressPercent = (elapsed / 5000) * 100;

      setProgress(Math.min(progressPercent, 100));

      if (elapsed < 5000) {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    const startAutoSlide = () => {
      setProgress(0);
      startTime = null;
      animationFrame = requestAnimationFrame(updateProgress);
    };

    const handleAutoSlide = () => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent((prev) => (prev + 1) % categories.length);
      setTimeout(() => {
        setIsAnimating(false);
        startAutoSlide();
      }, 700);
    };

    startAutoSlide();
    interval = setInterval(handleAutoSlide, 5000);

    return () => {
      clearInterval(interval);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [current, isAnimating]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setProgress(0);
    setCurrent((prev) => (prev + 1) % categories.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setProgress(0);
    setCurrent((prev) => (prev - 1 + categories.length) % categories.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === current) return;
    setIsAnimating(true);
    setProgress(0);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Carousel Container */}
      <section className="relative w-full h-[55vh] mt-30 overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-200">
        {/* Enhanced Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 transform -translate-y-1/2 z-30 bg-white/50 hover:bg-white/70 w-10 h-10 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 border border-gray-300  backdrop-blur-sm cursor-pointer"
          aria-label="Previous slide"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Enhanced Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30 bg-white/50 hover:bg-white/70 w-10 h-10 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 border border-gray-300  backdrop-blur-sm cursor-pointer"
          aria-label="Next slide"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Carousel Container with Full-width Background */}
        <div className="relative w-full h-full">
          {categories.map((cat, index) => (
            <div
              key={cat.name}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === current
                  ? "opacity-100 z-20 translate-x-0"
                  : index < current
                  ? "opacity-0 z-10 -translate-x-8"
                  : "opacity-0 z-10 translate-x-8"
              }`}
            >
              {/* Full-width Background Image with Gradient Overlay */}
              <div className="absolute inset-0">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                {/* Dynamic Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${cat.gradient} via-black/40 to-transparent`}
                ></div>
              </div>

              {/* Content Container - Right Side Text */}
              <div className="relative z-10 h-full flex items-center justify-end">
                <div className="text-white max-w-2xl mr-16 ml-auto">
                  {/* Offer Badge */}
                  <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-lg font-bold mb-6 shadow-2xl border border-white/20  duration-300">
                    <span className="mr-2">⭐</span>
                    {cat.offer}
                  </div>

                  {/* Main Heading */}
                  <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                    {cat.name}
                  </h1>

                  {/* Description */}
                  <p className="text-2xl text-white/90 mb-8 leading-relaxed drop-shadow-lg max-w-lg">
                    {cat.description}
                  </p>

                  {/* CTA Button Group */}
                  <div className="flex gap-4 mb-8">
                    <button className="bg-white hover:bg-gray-100 text-blue-600 px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl cursor-pointer">
                      Explore Now →
                    </button>
                    <button className="bg-transparent hover:bg-white/20 text-white border-2 border-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm cursor-pointer">
                      Learn More
                    </button>
                  </div>

                  {/* Stats & Trust Indicators */}
                  <div className="flex items-center gap-8 text-white/80">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm font-medium">
                        1M+ Active Users
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm font-medium">
                        Verified Listings
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm font-medium">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Optimization - Touch Swipe Area */}
        <div
          className="absolute inset-0 z-20 lg:hidden"
          onTouchStart={(e) => {
            const touchDown = e.touches[0].clientX;
            const handleTouchMove = (moveEvent) => {
              const touchUp = moveEvent.touches[0].clientX;
              if (touchDown - touchUp > 50) {
                handleNext();
              }
              if (touchDown - touchUp < -50) {
                handlePrev();
              }
            };
            document.addEventListener("touchmove", handleTouchMove, {
              once: true,
            });
          }}
        />
      </section>

      {/* External Progress Indicators - Dots with Current as Horizontal Progress */}
      <div className="mt-8 px-2">
        <div className="flex justify-center items-center gap-6">
          {categories.map((cat, index) => (
            <button
              key={cat.name}
              onClick={() => goToSlide(index)}
              className="flex flex-col items-center group transition-all duration-300"
              aria-label={`Go to ${cat.name}`}
            >
              {/* Indicator Container */}
              <div className="flex items-center justify-center mb-2">
                {index === current ? (
                  // Current Slide - Horizontal Progress Bar
                  <div className="flex items-center">
                    <div className="w-10 h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  // Other Slides - Simple Dot
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index < current
                        ? "bg-gray-400 group-hover:bg-gray-500"
                        : "bg-gray-300 group-hover:bg-gray-400"
                    }`}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
