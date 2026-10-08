import React, { useState, useRef, useEffect } from 'react';
import { useCms } from '../context/CmsContext';

export default function CampaignsSection({ onOpenDonate }) {
  const { cms } = useCms();
  const donationsData = cms?.donations || {};
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const defaultCards = [
    {
      id: "better-life",
      title: "Your small help can bring a Better Life to Everyone",
      image: "/images/img_14.avif",
      percent: 0,
      raisedText: "₹0",
      goalText: "₹50,000.00",
      donateUrl: "#donate"
    },
    {
      id: "water-food",
      title: "Clean water, healthy food and nutrition for rural villages",
      image: "/images/img_15.jpg",
      percent: 37,
      raisedText: "₹18,500.00",
      goalText: "₹50,000.00",
      donateUrl: "#donate"
    },
    {
      id: "gurukulam",
      title: "Takhatgarh Gurukulam education for tribal & needy children",
      image: "/images/img_16.jpg",
      percent: 46,
      raisedText: "₹35,000.00",
      goalText: "₹75,000.00",
      donateUrl: "#donate"
    },
    {
      id: "gau-seva",
      title: "Sacred Gaushala healthcare, nutrition & protective shelter",
      image: "/images/img_17.jpg",
      percent: 0,
      raisedText: "₹0",
      goalText: "₹50,000.00",
      donateUrl: "#donate"
    }
  ];

  const donationCards = (donationsData.campaigns && donationsData.campaigns.length > 0)
    ? donationsData.campaigns
        .filter(c => c.status !== 'draft')
        .map((c, idx) => {
          const target = Number(c.goal !== undefined ? c.goal : c.targetGoal) || 50000;
          const raised = Number(c.raised !== undefined ? c.raised : c.raisedAmount) || 0;
          const pct = Math.min(100, Math.round((raised / target) * 100));
          return {
            id: c.id || `campaign-${idx}`,
            title: c.title,
            image: c.image || c.src || c.url || '/images/img_14.avif',
            percent: pct,
            raisedText: `₹${raised.toLocaleString('en-IN')}`,
            goalText: `₹${target.toLocaleString('en-IN')}`,
            donateUrl: c.donateUrl || '#donate'
          };
        })
    : defaultCards;

  const subheading = donationsData.subheading || "HELP THE NEEDY";
  const mainTitle = donationsData.mainTitle || donationsData.title || "Find The Popular Cause And Donate Them";

  // Scroll carousel left or right
  const scroll = (direction) => {
    if (sliderRef.current) {
      const cardWidth = 350 + 24; // card width (350px) + gap (24px)
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Scroll to a specific card dot
  const scrollToIndex = (index) => {
    if (sliderRef.current) {
      const cardWidth = 350 + 24;
      sliderRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  // Track active card while scrolling
  const handleScroll = () => {
    if (sliderRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft;
      const cardWidth = 350 + 24;
      const index = Math.round(scrollLeft / cardWidth);
      if (index >= 0 && index < donationCards.length && index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  return (
    <section
      id="campaigns"
      className="relative bg-[#FCFAFA] py-20 overflow-hidden"
      style={{
        backgroundColor: '#FCFAFA',
        position: 'relative',
        padding: '85px 0 95px',
        overflow: 'hidden'
      }}
    >
      {/* Abstract geometric angled shape in soft peach/orange on top right */}
      <div
        className="absolute top-0 right-0 w-80 md:w-[480px] h-72 md:h-96 pointer-events-none overflow-hidden z-0"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 'clamp(280px, 35vw, 480px)',
          height: 'clamp(240px, 30vw, 380px)',
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0
        }}
      >
        <svg
          viewBox="0 0 500 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <linearGradient id="peachAngleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffedd5" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#fed7aa" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffedd5" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="peachPolygonGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fc791a" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#ffedd5" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <polygon points="110,0 500,0 500,320 270,400" fill="url(#peachAngleGrad)" />
          <polygon points="260,0 500,0 500,230" fill="url(#peachPolygonGrad)" />
        </svg>
      </div>

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12" style={{ textAlign: 'center', marginBottom: '46px' }}>
          <div
            className="inline-flex items-center gap-2 text-[#fc791a] text-sm font-bold tracking-wide uppercase mb-2.5"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#fc791a',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '10px'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#fc791a">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>{subheading}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#fc791a">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-gray-900 tracking-tight"
            style={{
              fontSize: 'clamp(32px, 3.8vw, 42px)',
              fontWeight: '800',
              color: '#111827',
              margin: 0,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            {mainTitle}
          </h2>
        </div>

        {/* Carousel Outer Wrapper containing floating navigation arrows */}
        <div className="relative group" style={{ position: 'relative' }}>
          
          {/* Floating Left Arrow (solid white circle with gray left chevron) */}
          <button
            onClick={() => scroll('left')}
            aria-label="Previous campaign"
            className="absolute -left-2 sm:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:scale-110 transition-transform duration-200 cursor-pointer"
            style={{
              position: 'absolute',
              left: '-16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
              border: '1px solid #f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4b5563',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Floating Right Arrow (solid green circle with white right chevron) */}
          <button
            onClick={() => scroll('right')}
            aria-label="Next campaign"
            className="absolute -right-2 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-green-500 shadow-md flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 cursor-pointer"
            style={{
              position: 'absolute',
              right: '-16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              boxShadow: '0 6px 18px rgba(34, 197, 94, 0.35)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Slider Flex Container with Smooth Scroll-Snap */}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide py-4 px-2"
            style={{
              display: 'flex',
              gap: '24px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              padding: '16px 8px',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
          >
            {donationCards.map((card) => (
              <div
                key={card.id}
                className="w-[86vw] sm:w-[340px] md:w-[345px] lg:w-[350px] shrink-0 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 snap-center md:snap-start overflow-hidden flex flex-col border border-gray-100"
                style={{
                  width: '350px',
                  maxWidth: '90vw',
                  flexShrink: 0,
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
                  scrollSnapAlign: 'start',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #f3f4f6',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                {/* Landscape Image at Top with matching rounded top corners */}
                <div
                  className="w-full h-48 sm:h-52 overflow-hidden bg-gray-100 rounded-t-2xl"
                  style={{
                    width: '100%',
                    height: '210px',
                    overflow: 'hidden',
                    backgroundColor: '#f3f4f6',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px'
                  }}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover rounded-t-2xl transition-transform duration-500 hover:scale-105"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.src = '/images/img_3.jpg';
                    }}
                  />
                </div>

                {/* Card Body */}
                <div
                  className="p-5 flex-1 flex flex-col justify-between"
                  style={{
                    padding: '20px 22px 24px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Progress Section */}
                  <div className="w-full mb-3" style={{ width: '100%', marginBottom: '14px' }}>
                    {/* Green Square Badge sitting flush on left of progress track */}
                    <div className="flex items-center mb-1.5" style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                      <span
                        className="bg-green-500 text-white text-xs font-bold rounded-sm px-1 py-0.5 leading-none inline-block shadow-xs"
                        style={{
                          backgroundColor: '#22c55e',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: '700',
                          borderRadius: '2px',
                          padding: '3px 6px',
                          lineHeight: 1,
                          display: 'inline-block'
                        }}
                      >
                        {card.percent}%
                      </span>
                    </div>

                    {/* Thin Light Grey Progress Track (h-1) with Green Fill */}
                    <div
                      className="w-full bg-gray-200 h-1 rounded-full overflow-hidden"
                      style={{
                        width: '100%',
                        backgroundColor: '#e5e7eb',
                        height: '4px',
                        borderRadius: '9999px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        className="bg-green-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${card.percent}%`,
                          backgroundColor: '#22c55e',
                          height: '100%',
                          borderRadius: '9999px'
                        }}
                      />
                    </div>

                    {/* Raised & Goal text flexed between */}
                    <div
                      className="flex justify-between items-center mt-2 text-xs text-gray-500 font-medium"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '8px',
                        fontSize: '11px',
                        color: '#6b7280'
                      }}
                    >
                      <span>
                        Raised: <span style={{ color: '#111827', fontWeight: '600' }}>{card.raisedText}</span>
                      </span>
                      <span>
                        Goal: <span style={{ color: '#111827', fontWeight: '600' }}>{card.goalText}</span>
                      </span>
                    </div>
                  </div>

                  {/* Campaign Title wrapped to exactly two lines */}
                  <h3
                    className="text-gray-900 text-lg font-semibold leading-snug line-clamp-2 my-2"
                    title={card.title}
                    style={{
                      color: '#111827',
                      fontSize: '17px',
                      fontWeight: '600',
                      lineHeight: '1.4',
                      margin: '8px 0 18px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '48px',
                      fontFamily: "'Plus Jakarta Sans', sans-serif"
                    }}
                  >
                    {card.title}
                  </h3>

                  {/* Pill-shaped Button aligned to left (bg-blue-600 with white circle icon container) */}
                  <button
                    onClick={() => {
                      if (card.donateUrl && card.donateUrl !== '#donate' && !card.donateUrl.startsWith('#')) {
                        window.open(card.donateUrl, '_blank');
                      } else if (onOpenDonate) {
                        onOpenDonate(card.id);
                      }
                    }}
                    className="self-start rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm inline-flex items-center py-2.5 px-5 shadow-sm transition-colors duration-200 cursor-pointer"
                    style={{
                      alignSelf: 'flex-start',
                      borderRadius: '9999px',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      fontWeight: '500',
                      fontSize: '14px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '9px 20px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                      transition: 'background-color 0.2s ease, transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1d4ed8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                    }}
                  >
                    {/* Circular white icon container on left with blue right chevron */}
                    <span
                      className="w-5 h-5 rounded-full bg-white flex items-center justify-center mr-2.5 shrink-0"
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '10px',
                        flexShrink: 0
                      }}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                    <span>Donate Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Centered Pagination Dots */}
        <div
          className="flex justify-center items-center gap-2 mt-8"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '36px'
          }}
        >
          {donationCards.map((_, dotIdx) => {
            const isActive = dotIdx === activeIndex;
            return (
              <button
                key={dotIdx}
                onClick={() => scrollToIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-6 h-2 bg-green-500 rounded-full'
                    : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                }`}
                style={{
                  width: isActive ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: isActive ? '#22c55e' : '#d1d5db',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}
