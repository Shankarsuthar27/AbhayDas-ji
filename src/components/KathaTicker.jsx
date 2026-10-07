import React, { useState } from 'react';

export default function KathaTicker({ onNavigate }) {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const kathaTitles = [
    "Shrimad Bhagwad Katha",
    "Ram Katha",
    "Nani Bai Ka Mayra",
    "Baba Ramdev Katha"
  ];

  // Repeat items for seamless, gapless infinite loop
  const tickerItems = [...kathaTitles, ...kathaTitles, ...kathaTitles];

  return (
    <section
      className="gsc-marquee relative w-full overflow-hidden bg-white select-none"
      style={{
        backgroundColor: '#ffffff',
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        padding: '30px 0 50px'
      }}
      aria-label="Katha Ticker"
    >
      <style>{`
        @keyframes kathaMarqueeScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333%, 0, 0);
          }
        }
        .marquee-track-animated {
          display: flex;
          align-items: center;
          width: max-content;
          animation: kathaMarqueeScroll 28s linear infinite;
          will-change: transform;
        }
        .marquee-track-animated:hover,
        .marquee-track-paused {
          animation-play-state: paused !important;
        }
        .marquee-title {
          position: relative;
          display: inline;
          font-family: var(--tec-font-family-sans-serif, 'Quicksand', sans-serif);
          font-size: 80px;
          font-weight: 700;
          line-height: 80px;
          color: var(--e-global-color-secondary, rgb(252, 121, 26));
          cursor: crosshair;
          transition: color 0.35s ease, opacity 0.35s ease;
          white-space: nowrap;
        }
        .marquee-title:hover {
          color: var(--e-global-color-primary, #02A95C) !important;
        }
        .marquee-dot-icon {
          display: inline-block;
          width: 25px;
          height: 24px;
          margin: 0 28px;
          background-color: var(--e-global-color-secondary, rgb(252, 121, 26));
          -webkit-mask-image: url(/images/marquee-dot.png);
          mask-image: url(/images/marquee-dot.png);
          -webkit-mask-size: contain;
          mask-size: contain;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
          vertical-align: middle;
          flex-shrink: 0;
        }
        @media (max-width: 1200px) {
          .marquee-title {
            font-size: 65px;
            line-height: 65px;
          }
        }
        @media (max-width: 1024px) {
          .marquee-title {
            font-size: 55px;
            line-height: 55px;
          }
        }
        @media (max-width: 768px) {
          .marquee-title {
            font-size: 42px;
            line-height: 42px;
          }
          .marquee-dot-icon {
            width: 18px;
            height: 18px;
            margin: 0 16px;
          }
        }
      `}</style>

      {/* Marquee Wrapper with soft edge gradient fades */}
      <div
        className="marquee-text flex items-center whitespace-nowrap"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <div className={`marquee-track-animated ${isPaused ? 'marquee-track-paused' : ''}`}>
          {tickerItems.map((title, index) => {
            const isHovered = hoveredIdx === index;

            return (
              <span
                key={`${title}-${index}`}
                className="marquee-item inline-flex items-center"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  position: 'relative'
                }}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Ornamental Marquee Dot Icon (mask image of marquee-dot.png) */}
                <span className="marquee-dot-icon" aria-hidden="true" />

                {/* Authoritative .marquee-title Specification */}
                <span
                  className="marquee-title inline relative font-sans text-[80px] font-bold leading-none text-[#fc791a] whitespace-nowrap"
                  style={{
                    display: 'inline',
                    position: 'relative',
                    fontFamily: "var(--tec-font-family-sans-serif, 'Quicksand', sans-serif)",
                    fontSize: 'clamp(42px, 5.5vw, 80px)',
                    fontWeight: '700',
                    lineHeight: '80px',
                    color: isHovered
                      ? 'var(--e-global-color-primary, #02A95C)'
                      : 'var(--e-global-color-secondary, rgb(252, 121, 26))',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    cursor: (title === "Nani Bai Ka Mayra" || title === "Shrimad Bhagwad Katha" || title === "Baba Ramdev Katha") ? 'pointer' : 'default',
                    transition: 'all 0.35s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onClick={() => {
                    if (title === "Nani Bai Ka Mayra") {
                      if (onNavigate) {
                        onNavigate('/kathas/nani-bai-ka-mayra');
                      } else {
                        window.location.href = '/kathas/nani-bai-ka-mayra';
                      }
                    } else if (title === "Shrimad Bhagwad Katha") {
                      if (onNavigate) {
                        onNavigate('/kathas/shrimad-bhagwat-katha');
                      } else {
                        window.location.href = '/kathas/shrimad-bhagwat-katha';
                      }
                    } else if (title === "Baba Ramdev Katha") {
                      if (onNavigate) {
                        onNavigate('/kathas/baba-ramdev-ji-katha');
                      } else {
                        window.location.href = '/kathas/baba-ramdev-ji-katha';
                      }
                    }
                  }}
                  title={title}
                >
                  {title}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
