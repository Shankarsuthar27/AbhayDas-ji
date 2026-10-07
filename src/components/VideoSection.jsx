import React, { useState, useEffect, useRef } from 'react';

// Default source URLs including newly added links from user
const DEFAULT_VIDEO_URLS = [
  "https://www.youtube.com/live/X0UPcFj_ZNQ?si=4ePCh00jF7hwtkOp",
  "https://youtu.be/McOEP5OqUfs?si=kUsE_tcWbFowqFUu",
  "https://youtu.be/8NbRkLdLR7s?si=BmBKRguTatBeID3d",
  "https://youtu.be/DDT8ydNRGnE?si=gyJqxaqOcf4RD9Qv",
  "https://youtu.be/kW-T1J5QFdY?si=wZO6y2j_upjftCr8",
  "https://youtu.be/kW-T1J5QFdY?si=uXEs2zQ9D6xhtD2P",
  "https://youtu.be/8NbRkLdLR7s?si=d__3aK0flnGeE7Bb"
];

// Rich metadata lookup for the video items
const VIDEO_METADATA = {
  "X0UPcFj_ZNQ": {
    title: "श्री अभयदास जी महाराज श्रीमद् भागवत कथा",
    channel: "Shree Abhaydas",
    duration: "2:56:26",
    timestamp: "9:41 / 2:56:26",
    fallbackThumb: "/images/img_25.jpg"
  },
  "McOEP5OqUfs": {
    title: "यशस्वी प्रधानमंत्री श्री Narendra Modi Ji को जन्मदिन की हार्दिक शुभकामनाएँ।",
    channel: "Shree Abhaydas",
    duration: "15:42",
    timestamp: "1:15 / 15:42",
    fallbackThumb: "/images/img_22.jpg"
  },
  "8NbRkLdLR7s": {
    title: "Abhaydas Ji Maharaj ने हरिजन बस्ती में भिक्षा लेने का कारण बताया",
    channel: "Shree Abhaydas",
    duration: "24:18",
    timestamp: "3:40 / 24:18",
    fallbackThumb: "/images/img_23.jpg"
  },
  "DDT8ydNRGnE": {
    title: "Meera Bhajan – मुरली वाला आजा म्हारे देश । Abhaydas ji maharaj",
    channel: "Shree Abhaydas",
    duration: "18:05",
    timestamp: "2:08 / 18:05",
    fallbackThumb: "/images/img_24.webp"
  },
  "kW-T1J5QFdY": {
    title: "न्याय तो श्री कृष्ण और श्री राम के साथ भी नहीं हुआ.. युवाचार्य Shree Abhaydas जी",
    channel: "Shree Abhaydas",
    duration: "32:10",
    timestamp: "5:22 / 32:10",
    fallbackThumb: "/images/img_25.jpg"
  }
};

/**
 * Automatically extracts the YouTube video ID from various URL formats
 */
export function extractYouTubeId(url) {
  if (!url) return '';
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|shorts\/)|youtube\.com\/(?:.*[?&]v=))([^#&?]*)/
  );
  return match && match[1] ? match[1] : url.trim();
}

export default function VideoSection({ videoUrls = DEFAULT_VIDEO_URLS, onOpenVideo }) {
  const [displayVideos, setDisplayVideos] = useState([]);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [hoveredCardKey, setHoveredCardKey] = useState(null);
  const sliderRef = useRef(null);

  // Randomize video order on mount/render and include all parsed items for sliding
  useEffect(() => {
    const urlsToUse = (videoUrls && videoUrls.length > 0) ? videoUrls : DEFAULT_VIDEO_URLS;
    
    const parsedVideos = urlsToUse.map((url, index) => {
      const id = extractYouTubeId(url);
      const meta = VIDEO_METADATA[id] || {
        title: "Pujya Swami Abhaydas Ji Maharaj Katha",
        channel: "Shree Abhaydas",
        duration: "Katha Satsang",
        timestamp: "0:00 / 15:00",
        fallbackThumb: "/images/img_3.jpg"
      };

      return {
        uniqueKey: `${id}-${index}`,
        id,
        url,
        title: meta.title,
        channel: meta.channel,
        duration: meta.duration,
        timestamp: meta.timestamp,
        fallbackThumb: meta.fallbackThumb,
        hqThumb: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        maxThumb: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
      };
    });

    const shuffled = [...parsedVideos];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setDisplayVideos(shuffled);
  }, [videoUrls]);

  // Smooth slide to the left
  const handleSlideLeft = () => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const card = container.querySelector('.recent-katha-card-col');
      const cardWidth = card ? card.offsetWidth : 320;
      const scrollAmount = cardWidth + 24;

      if (container.scrollLeft <= 15) {
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Smooth slide to the right
  const handleSlideRight = () => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const card = container.querySelector('.recent-katha-card-col');
      const cardWidth = card ? card.offsetWidth : 320;
      const scrollAmount = cardWidth + 24;

      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 20) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handlePlayVideo = (videoId) => {
    setPlayingVideoId(videoId);
    if (onOpenVideo) {
      // Optional parent notification
    }
  };

  return (
    <section
      id="videos"
      style={{
        position: 'relative',
        backgroundColor: '#fcfaf6',
        padding: '85px 0 100px',
        overflow: 'hidden'
      }}
      aria-label="Recent Katha"
    >
      <style>{`
        /* Staggered entrance animation for video cards */
        @keyframes kathaCardEntrance {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.96);
          }
          60% {
            opacity: 0.9;
            transform: translateY(-5px) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* YouTube play button pulsing glow animation */
        @keyframes pulsePlayGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.75);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 18px rgba(255, 0, 0, 0);
            transform: scale(1.15);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
            transform: scale(1);
          }
        }

        /* Watch More button gentle breathing animation */
        @keyframes watchMorePulse {
          0%, 100% {
            box-shadow: 0 6px 20px rgba(255, 0, 0, 0.35);
          }
          50% {
            box-shadow: 0 10px 30px rgba(255, 0, 0, 0.6);
          }
        }

        /* Underline expand animation */
        @keyframes lineExpand {
          0% { width: 0px; opacity: 0; }
          100% { opacity: 1; }
        }

        .recent-katha-cards-row {
          display: flex !important;
          overflow-x: auto;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 14px 6px 28px;
          gap: 24px;
        }

        .recent-katha-cards-row::-webkit-scrollbar {
          display: none;
        }

        /* 4 cards visible on desktop with larger size */
        .recent-katha-card-col {
          width: calc((100% - 72px) / 4);
          min-width: 305px;
          flex-shrink: 0;
          scroll-snap-align: start;
          animation: kathaCardEntrance 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
        }

        @media (max-width: 1260px) {
          .recent-katha-card-col {
            width: calc((100% - 48px) / 3);
            min-width: 295px;
          }
        }

        @media (max-width: 900px) {
          .recent-katha-card-col {
            width: calc((100% - 24px) / 2);
            min-width: 280px;
          }
        }

        @media (max-width: 600px) {
          .recent-katha-card-col {
            width: 88%;
            min-width: 270px;
          }
        }

        /* Side Navigation Arrow Buttons with Smooth Float & Nudge */
        .katha-slider-arrow {
          position: absolute;
          top: 45%;
          transform: translateY(-50%);
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.16);
          border: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #17342f;
          cursor: pointer;
          z-index: 25;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .katha-slider-arrow:hover {
          background: #ff0000;
          color: #ffffff;
          border-color: #ff0000;
          box-shadow: 0 12px 32px rgba(255, 0, 0, 0.45);
          transform: translateY(-50%) scale(1.14);
        }

        .katha-slider-arrow.prev:hover svg {
          transform: translateX(-4px);
        }

        .katha-slider-arrow.next:hover svg {
          transform: translateX(4px);
        }

        .katha-slider-arrow svg {
          transition: transform 0.25s ease;
        }

        .katha-slider-arrow:active {
          transform: translateY(-50%) scale(0.92);
        }

        .katha-slider-arrow.prev {
          left: -24px;
        }

        .katha-slider-arrow.next {
          right: -24px;
        }

        @media (max-width: 1420px) {
          .katha-slider-arrow.prev {
            left: 6px;
          }
          .katha-slider-arrow.next {
            right: 6px;
          }
        }

        /* Card Hover Micro-Interactions */
        .recent-katha-card-col:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 22px 46px -12px rgba(0, 0, 0, 0.16);
          border-color: rgba(252, 121, 26, 0.3) !important;
        }

        .recent-katha-card-col:hover .katha-video-thumb-img {
          transform: scale(1.08);
        }

        .recent-katha-card-col:hover .katha-play-btn-pill {
          animation: pulsePlayGlow 1.8s infinite;
          background-color: #ff0000 !important;
        }

        .recent-katha-card-col:hover .katha-card-title {
          color: #fc791a !important;
        }
      `}</style>

      {/* Topographic Contour Lines Background Pattern */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.05,
          pointerEvents: 'none',
          zIndex: 0
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
      >
        <path
          d="M0,120 C320,180 420,40 720,100 C1020,160 1180,60 1440,120 L1440,0 L0,0 Z"
          fill="none"
          stroke="#17342f"
          strokeWidth="1.6"
        />
        <path
          d="M0,240 C380,310 520,140 840,220 C1140,290 1260,190 1440,250"
          fill="none"
          stroke="#17342f"
          strokeWidth="1.3"
        />
        <path
          d="M0,380 C300,440 600,300 900,380 C1200,450 1320,340 1440,400"
          fill="none"
          stroke="#17342f"
          strokeWidth="1.3"
        />
      </svg>

      {/* Warm Peach/Orange Organic Gradient Accent in Top Right with Subtle Float */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '460px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(254, 215, 170, 0.55) 0%, rgba(253, 186, 116, 0.3) 45%, rgba(252, 250, 246, 0) 75%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        
        {/* Larger Header Area: Divine Presence, Recent Katha, Watch More Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '42px'
          }}
        >
          <div>
            {/* Prominent 'Divine Presence' Subtitle */}
            <div
              style={{
                color: '#fc791a',
                fontSize: '16px',
                fontWeight: '800',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                marginBottom: '6px',
                fontFamily: "var(--donatm-font-sans-serif, 'Plus Jakarta Sans', sans-serif)"
              }}
            >
              Divine Presence
            </div>

            {/* Bolder, Larger 'Recent Katha' Main Title */}
            <h2
              style={{
                fontSize: 'clamp(34px, 4.2vw, 48px)',
                fontWeight: '900',
                color: '#17342f',
                margin: 0,
                lineHeight: 1.15,
                letterSpacing: '-0.5px',
                fontFamily: "var(--donatm-heading-font-family, 'Quicksand', sans-serif)"
              }}
            >
              Recent Katha
            </h2>

            {/* Expanded Decorative Dual-Color Accent Underline (Orange + Green) */}
            <div style={{ position: 'relative', marginTop: '12px', height: '8px', width: '120px' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '46px',
                  height: '4px',
                  backgroundColor: '#fc791a',
                  borderRadius: '3px',
                  animation: 'lineExpand 0.6s ease-out both'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '5px',
                  left: 0,
                  width: '120px',
                  height: '4px',
                  backgroundColor: '#02A95C',
                  borderRadius: '3px',
                  animation: 'lineExpand 0.85s ease-out both'
                }}
              />
            </div>
          </div>

          {/* Prominent Larger Red 'Watch More' Button on the Right Side */}
          <a
            href="https://www.youtube.com/@shreeabhaydas"
            target="_blank"
            rel="noreferrer"
            className="katha-header-watch-more-btn"
            style={{
              backgroundColor: '#ff0000',
              color: '#ffffff',
              padding: '13px 32px',
              borderRadius: '50px',
              fontWeight: '800',
              fontSize: '15.5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(255, 0, 0, 0.35)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              animation: 'watchMorePulse 3.5s ease-in-out infinite',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#cc0000';
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(204, 0, 0, 0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ff0000';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 0, 0, 0.35)';
            }}
          >
            {/* Larger YouTube Play Icon */}
            <svg width="24" height="18" viewBox="0 0 24 18" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Watch More
          </a>
        </div>

        {/* Carousel Container with Side Slide Buttons */}
        <div style={{ position: 'relative' }}>

          {/* Left Side Slide Button */}
          <button
            type="button"
            className="katha-slider-arrow prev"
            onClick={handleSlideLeft}
            aria-label="Slide previous videos"
            title="Slide previous videos"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Right Side Slide Button */}
          <button
            type="button"
            className="katha-slider-arrow next"
            onClick={handleSlideRight}
            aria-label="Slide next videos"
            title="Slide next videos"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Scrollable Video Cards Track with Staggered Entrance Animation */}
          <div ref={sliderRef} className="recent-katha-cards-row">
            {displayVideos.map((video, index) => {
              const isPlaying = playingVideoId === video.id;

              return (
                <div
                  key={video.uniqueKey}
                  className="recent-katha-card-col"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    boxShadow: '0 10px 28px rgba(0, 0, 0, 0.06)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    padding: '12px 12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    animationDelay: `${index * 0.09}s`
                  }}
                  onMouseEnter={() => setHoveredCardKey(video.uniqueKey)}
                  onMouseLeave={() => setHoveredCardKey(null)}
                >
                  {/* Video Embed Player Area with Rounded Corners & Dark Background */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '16 / 9.6',
                      backgroundColor: '#000000',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      cursor: isPlaying ? 'default' : 'pointer'
                    }}
                    onClick={() => !isPlaying && handlePlayVideo(video.id)}
                  >
                    {isPlaying ? (
                      /* Active Live YouTube Embed Player */
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          borderRadius: '18px'
                        }}
                      />
                    ) : (
                      /* Standard YouTube Embedded Player Thumbnail Mockup */
                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        
                        {/* High-Resolution Video Thumbnail Image with Zoom Transition */}
                        <img
                          className="katha-video-thumb-img"
                          src={video.maxThumb}
                          alt={video.title}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                          onError={(e) => {
                            if (!e.target.dataset.triedHq) {
                              e.target.dataset.triedHq = 'true';
                              e.target.src = video.hqThumb;
                            } else {
                              e.target.src = video.fallbackThumb;
                            }
                          }}
                        />

                        {/* Top & Bottom Cinematic Shadow Gradients */}
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(180deg, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.12) 60%, rgba(0,0,0,0.88) 100%)',
                            pointerEvents: 'none',
                            transition: 'opacity 0.3s ease'
                          }}
                        />

                        {/* Top Bar: Channel Avatar, Video Title, Audio/CC/Settings Icons */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '11px',
                            left: '14px',
                            right: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                            zIndex: 2,
                            color: '#ffffff',
                            textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                            <img
                              src="/images/img_1.png"
                              alt="Channel Avatar"
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                backgroundColor: '#ffffff',
                                border: '1px solid rgba(255,255,255,0.75)',
                                flexShrink: 0
                              }}
                              onError={(e) => {
                                e.target.src = '/images/img_3.jpg';
                              }}
                            />
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: '13px',
                                  fontWeight: '700',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '150px',
                                  lineHeight: 1.2
                                }}
                              >
                                {video.title}
                              </div>
                              <div style={{ fontSize: '10.5px', opacity: 0.85, lineHeight: 1 }}>
                                {video.channel}
                              </div>
                            </div>
                          </div>

                          {/* Top-Right Player Controls */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.92, flexShrink: 0 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                            </svg>
                            <span style={{ fontSize: '10.5px', fontWeight: '800', border: '1px solid currentColor', borderRadius: '2px', padding: '0 2.5px' }}>
                              CC
                            </span>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                            </svg>
                          </div>
                        </div>

                        {/* Center: Iconic YouTube Red Play Button with Glow Pulse */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 3
                          }}
                        >
                          <div
                            className="katha-play-btn-pill"
                            style={{
                              width: '62px',
                              height: '42px',
                              backgroundColor: '#ff0000',
                              borderRadius: '13px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 8px 22px rgba(0, 0, 0, 0.45)',
                              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease'
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                              <polygon points="6 3 20 12 6 21 6 3" />
                            </svg>
                          </div>
                        </div>

                        {/* Bottom Controls Overlay */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '9px',
                            left: '14px',
                            right: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            zIndex: 2,
                            color: '#ffffff'
                          }}
                        >
                          {/* Left Action Icons & Duration */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', opacity: 0.9 }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                              <polyline points="16 6 12 2 8 6" />
                              <line x1="12" y1="2" x2="12" y2="15" />
                            </svg>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.2px', opacity: 0.85 }}>
                              {video.timestamp}
                            </span>
                          </div>

                          {/* 'Watch on YouTube' Button at Bottom Right with Hover Transition */}
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              backdropFilter: 'blur(5px)',
                              border: '1px solid rgba(255, 255, 255, 0.25)',
                              borderRadius: '5px',
                              padding: '4px 9px',
                              color: '#ffffff',
                              fontSize: '11.5px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              textDecoration: 'none',
                              transition: 'all 0.25s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.92)';
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <span>Watch on</span>
                            <svg width="15" height="11" viewBox="0 0 24 18" fill="#ff0000">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            <span style={{ fontWeight: '800' }}>YouTube</span>
                          </a>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Brief Title / Description Below Embedded Video with Transition */}
                  <div style={{ padding: '14px 8px 4px', textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h4
                      className="katha-card-title"
                      style={{
                        fontSize: '14.5px',
                        fontWeight: '700',
                        color: '#1f2937',
                        lineHeight: '1.45',
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontFamily: "var(--donatm-font-sans-serif, 'Plus Jakarta Sans', sans-serif)",
                        transition: 'color 0.25s ease'
                      }}
                      title={video.title}
                    >
                      {video.title}
                    </h4>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Centered Watch More Button for Mobile / All matching reference */}
        <div className="katha-bottom-watch-more-wrap" style={{ textAlign: 'center', marginTop: '28px' }}>
          <a
            href="https://www.youtube.com/@shreeabhaydas"
            target="_blank"
            rel="noreferrer"
            className="katha-bottom-watch-more-btn"
            style={{
              backgroundColor: '#ff0000',
              color: '#ffffff',
              padding: '11px 26px',
              borderRadius: '50px',
              fontWeight: '800',
              fontSize: '14.5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(255, 0, 0, 0.35)',
              cursor: 'pointer'
            }}
          >
            <svg width="22" height="16" viewBox="0 0 24 18" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span>Watch More Videos</span>
          </a>
        </div>

      </div>
    </section>
  );
}
