import React, { useState } from 'react';

export default function SpiritualKathas({ onOpenVideo, onNavigate }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  const kathaCards = [
    {
      id: "bhagwat",
      title: "Shrimad Bhagwad Katha",
      image: "/images/img_11.jpg",
      videoId: "X0UPcFj_ZNQ",
      link: "/kathas/shrimad-bhagwat-katha",
      isCenter: false
    },
    {
      id: "mayra",
      title: "Nani Bai Ka Mayra",
      image: "/images/img_12.jpg",
      videoId: "DDT8ydNRGnE",
      link: "/kathas/nani-bai-ka-mayra",
      isCenter: true // Center active card matching reference screenshot
    },
    {
      id: "ramdev",
      title: "Baba Ramdev Katha",
      image: "/images/img_13.png",
      videoId: "kW-T1J5QFdY",
      link: "/kathas/baba-ramdev-ji-katha",
      isCenter: false
    }
  ];

  const handleCardClick = (card) => {
    if (card.link) {
      if (onNavigate) {
        onNavigate(card.link);
      } else {
        window.history.pushState({}, '', card.link);
        window.dispatchEvent(new Event('popstate'));
      }
    } else if (onOpenVideo) {
      onOpenVideo(card.videoId);
    }
  };

  return (
    <section
      id="kathas"
      style={{
        padding: '95px 0 110px',
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        width: '100%'
      }}
    >
      {/* Top-Left Decorative Doodle (bg-16.png: Green thought bubble with yellow cracked heart) */}
      <div
        style={{
          position: 'absolute',
          top: '65px',
          left: 'clamp(18px, 6vw, 95px)',
          width: 'clamp(75px, 6.8vw, 105px)',
          zIndex: 1,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        <img
          src="/images/bg-16.png"
          alt=""
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onError={(e) => {
            // Fallback SVG if image not found
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Bottom-Right Decorative Contour Waves (bg-23.png) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 'clamp(150px, 16vw, 210px)',
          zIndex: 1,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        <img
          src="/images/bg-23.png"
          alt=""
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          
          {/* Subheading: 🧡 What We do 🧡 */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#FC791A',
              fontSize: '14.5px',
              fontWeight: '700',
              letterSpacing: '0.2px',
              marginBottom: '10px'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#FC791A">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>What We do</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#FC791A">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          {/* Main Title: Spiritual katha' */}
          <h2
            style={{
              fontSize: 'clamp(34px, 4vw, 47px)',
              fontWeight: '800',
              color: '#17342F',
              lineHeight: '1.2',
              margin: 0,
              letterSpacing: '-0.4px',
              fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
            }}
          >
            Spiritual katha'
          </h2>
        </div>

        {/* 3 Temple-Arched Cards Grid matching reference image */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: 'clamp(24px, 3.2vw, 38px)',
            maxWidth: '1140px',
            margin: '0 auto',
            alignItems: 'start'
          }}
        >
          {kathaCards.map((card) => {
            const isHovered = hoveredCard === card.id;
            const isGreenButton = card.isCenter || isHovered;
            const hasGreenOverlay = card.isCenter || isHovered;

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  maxWidth: '360px',
                  width: '100%',
                  margin: '0 auto',
                  transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Arched Photo Card Container */}
                <div
                  style={{
                    position: 'relative',
                    height: 'clamp(410px, 40vw, 455px)',
                    borderRadius: '500px 500px 0 0',
                    overflow: 'hidden',
                    backgroundColor: '#f3f4f6',
                    boxShadow: isHovered
                      ? '0 20px 42px rgba(0, 0, 0, 0.12)'
                      : '0 8px 24px rgba(0, 0, 0, 0.06)',
                    transition: 'box-shadow 0.4s ease'
                  }}
                >
                  {/* Photo with subtle zoom on hover */}
                  <img
                    src={card.image}
                    alt={card.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      display: 'block',
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onError={(e) => {
                      e.target.src = '/images/img_3.jpg';
                    }}
                  />

                  {/* Subtle Emerald Green Tint Overlay (active on Card 2, appears on hover for Cards 1 & 3) */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#02A95C',
                      opacity: hasGreenOverlay ? 0.22 : 0,
                      transition: 'opacity 0.4s ease',
                      pointerEvents: 'none',
                      zIndex: 2
                    }}
                  />

                  {/* Orange Brush Splash Banner across the bottom */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '102px',
                      pointerEvents: 'none',
                      zIndex: 3
                    }}
                  >
                    <svg
                      viewBox="0 0 360 102"
                      preserveAspectRatio="none"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      {/* Main Solid Brush Body */}
                      <path
                        d="M 0,102 
                           L 360,102 
                           L 360,42 
                           C 352,38 340,46 332,38 
                           C 324,30 315,35 304,26 
                           C 292,16 280,24 266,20 
                           C 252,16 242,26 230,19 
                           C 216,12 202,22 188,14 
                           C 174,6  160,18 146,12 
                           C 132,6  120,20 106,14 
                           C 92,8   80,22 68,18 
                           C 54,14  42,28 30,22 
                           C 18,16  8,32 0,38 
                           Z"
                        fill="#FC791A"
                      />

                      {/* Organic Dry Brush / Paint Splatter Bristles along top and edges */}
                      <path
                        d="M 6,36 Q 22,24 45,28 T 92,16 T 142,10 T 194,15 T 248,12 T 298,22 T 348,34"
                        stroke="#FC791A"
                        strokeWidth="3.6"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.9"
                      />
                      <path
                        d="M 18,34 Q 50,18 85,22 T 136,8 T 184,18 T 235,10 T 285,18 T 338,30"
                        stroke="#FC791A"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.8"
                      />
                      <path
                        d="M 32,32 Q 68,14 110,18 T 165,12 T 218,14 T 270,16 T 322,26"
                        stroke="#FC791A"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.75"
                      />

                      {/* Small paint splatter droplets matching reference image */}
                      <circle cx="24" cy="20" r="1.8" fill="#FC791A" />
                      <circle cx="38" cy="14" r="1.2" fill="#FC791A" />
                      <circle cx="75" cy="10" r="1.6" fill="#FC791A" />
                      <circle cx="122" cy="7" r="1.4" fill="#FC791A" />
                      <circle cx="168" cy="5" r="2.0" fill="#FC791A" />
                      <circle cx="214" cy="9" r="1.3" fill="#FC791A" />
                      <circle cx="258" cy="8" r="1.7" fill="#FC791A" />
                      <circle cx="312" cy="16" r="1.8" fill="#FC791A" />
                      <circle cx="334" cy="22" r="1.4" fill="#FC791A" />
                      <circle cx="350" cy="28" r="1.9" fill="#FC791A" />
                      {/* Left and right splatter marks */}
                      <path d="M 0,42 Q 6,38 12,45" stroke="#FC791A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                      <path d="M 348,42 Q 355,48 360,40" stroke="#FC791A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                    </svg>

                    {/* Katha Title inside Orange Banner */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '26px',
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        zIndex: 4,
                        padding: '0 16px'
                      }}
                    >
                      <h3
                        style={{
                          color: '#ffffff',
                          fontSize: 'clamp(17px, 1.45vw, 19.5px)',
                          fontWeight: '700',
                          lineHeight: '1.25',
                          margin: 0,
                          letterSpacing: '-0.2px',
                          textShadow: '0 1px 3px rgba(0, 0, 0, 0.16)',
                          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
                        }}
                      >
                        {card.title}
                      </h3>
                    </div>
                  </div>

                </div>

                {/* Overlapping Bottom Circular Arrow Button */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-22px',
                    left: '50%',
                    transform: isHovered
                      ? 'translateX(-50%) scale(1.1)'
                      : 'translateX(-50%) scale(1)',
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: isGreenButton ? '#02A95C' : '#ffffff',
                    color: isGreenButton ? '#ffffff' : '#17342F',
                    boxShadow: isGreenButton
                      ? '0 6px 18px rgba(2, 169, 92, 0.42)'
                      : '0 4px 14px rgba(0, 0, 0, 0.11)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(card);
                  }}
                  title={card.link ? `Read ${card.title}` : `Watch ${card.title}`}
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <polyline points="13 5 20 12 13 19" />
                  </svg>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
