import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCms } from '../context/CmsContext';

export default function HeroSlider({ onOpenDonate, onOpenVolunteer }) {
  const { cms } = useCms();
  const heroData = cms?.hero || {};

  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [direction, setDirection] = useState('next'); // 'next' | 'prev'
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHoveringPrev, setIsHoveringPrev] = useState(false);
  const [isHoveringNext, setIsHoveringNext] = useState(false);

  const isAnimatingRef = useRef(false);
  const currentSlideRef = useRef(0);
  const timerRef = useRef(null);
  const animTimeoutRef = useRef(null);

  const defaultSlides = [
    {
      id: 0,
      badge: heroData.badge || "A Journey of Devotion, Dharma & Divine Guidance",
      titleLine1: heroData.headingLine1 || "Swami Shri",
      titleLine2: heroData.headingLine2 || "Abhaydas Ji Maharaj",
      desc: heroData.paragraph || "Welcome to the official spiritual platform of HH Pujya Acharya Swami Shri Abhaydas Ji Maharaj, dedicated to Sanatan values, sacred discourses, seva, and cultural awakening.",
      image: heroData.backgroundMedia || "/images/img_4.jpg",
      objectPosition: "center 32%"
    },
    {
      id: 1,
      badge: "Sacred Kathas & Pravachans",
      titleLine1: "Spreading the Light",
      titleLine2: "of Sanatan Wisdom",
      desc: "Discover the spiritual teachings of Maharaj Ji through Shreemad Bhagwad Katha, Shree Ram Katha, Meera Katha, Bhaktmaal Katha, and other devotional discourses that inspire faith and inner strength.",
      image: "/images/img_5.jpg",
      objectPosition: "center 28%"
    },
    {
      id: 2,
      badge: "Seva • Sanskar • Parampara",
      titleLine1: "Preserving Heritage,",
      titleLine2: "Inspiring Generations",
      desc: "Rooted in sacred parampara and guided by service, the mission of Maharaj Ji reflects devotion, Gurukul values, cultural preservation, and spiritual upliftment for society.",
      image: "/images/img_3.jpg",
      objectPosition: "center 28%"
    }
  ];

  const slides = (heroData.slides && heroData.slides.length > 0)
    ? heroData.slides
        .filter(s => s.status !== 'draft')
        .map((s, idx) => ({
          id: s.id || idx,
          badge: s.badge || heroData.badge || "Sanatan Parampara",
          titleLine1: s.title || heroData.headingLine1 || "Preserving Heritage,",
          titleLine2: s.titleLine2 || (s.title ? '' : (heroData.headingLine2 || "Inspiring Generations")),
          desc: s.desc || heroData.paragraph || "",
          image: s.image || heroData.backgroundMedia || "/images/img_4.jpg",
          objectPosition: "center 30%"
        }))
    : defaultSlides;

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  const handleNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsAnimating(true);
    setDirection('next');

    const curr = currentSlideRef.current;
    const next = (curr + 1) % slides.length;

    setPrevSlide(curr);
    setCurrentSlide(next);
    currentSlideRef.current = next;

    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    animTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      isAnimatingRef.current = false;
      setPrevSlide(null);
    }, 2550);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsAnimating(true);
    setDirection('prev');

    const curr = currentSlideRef.current;
    const prev = (curr - 1 + slides.length) % slides.length;

    setPrevSlide(curr);
    setCurrentSlide(prev);
    currentSlideRef.current = prev;

    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    animTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      isAnimatingRef.current = false;
      setPrevSlide(null);
    }, 2550);
  }, [slides.length]);

  // Automatic slide change every 6.5 seconds; pause when hovering around navigation buttons
  useEffect(() => {
    if (isHoveringPrev || isHoveringNext) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      handleNext();
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handleNext, isHoveringPrev, isHoveringNext, currentSlide]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  const activeSlideData = slides[currentSlide];
  const showNavButtons = isHoveringPrev || isHoveringNext;

  return (
    <section id="hero" className="hero-slider-section" style={{ padding: '54px 0 75px', backgroundColor: '#ffffff' }}>
      <div style={{ maxWidth: '1560px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Big, Expansive Hero Banner Card */}
        <div className="hero-slider-card" style={{
          position: 'relative',
          borderRadius: '38px',
          overflow: 'hidden',
          minHeight: 'clamp(850px, 94vh, 1040px)',
          backgroundColor: '#0b231c',
          boxShadow: '0 24px 60px -12px rgba(0,0,0,0.32)'
        }}>

          {/* Top-Left Diagonal Overlay Layer (layer-1.png) - Scaled Up */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 'clamp(480px, 52vw, 820px)',
            height: 'clamp(500px, 56vw, 880px)',
            backgroundImage: 'url(/images/layer-1.png)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top left',
            backgroundSize: 'contain',
            zIndex: 3,
            pointerEvents: 'none',
            opacity: 0.95
          }} />

          {/* Bottom-Right Diagonal Overlay Layer (layer-2.png) - Scaled Up */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 'clamp(400px, 44vw, 680px)',
            height: 'clamp(420px, 48vw, 720px)',
            backgroundImage: 'url(/images/layer-2.png)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom right',
            backgroundSize: 'contain',
            zIndex: 3,
            pointerEvents: 'none',
            opacity: 0.95
          }} />

          {/* Background Images Slide Track with Ultra-Smooth Slower Horizontal Slide Transitions (2.5s) */}
          {slides.map((slide, index) => {
            const isCurrent = index === currentSlide;
            const isPrev = index === prevSlide;

            // Only render current active and exiting previous slide during animation
            if (!isCurrent && !isPrev) return null;

            let transform = 'translateX(0)';
            let transition = 'transform 2.5s cubic-bezier(0.16, 1, 0.3, 1)';
            let zIndex = 1;

            if (isCurrent && isAnimating) {
              zIndex = 2;
              transform = 'translateX(0)';
            } else if (isPrev && isAnimating) {
              zIndex = 1;
              transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
            }

            return (
              <div
                key={slide.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transform: transform,
                  transition: transition,
                  zIndex: zIndex,
                  animation: (isCurrent && isAnimating)
                    ? (direction === 'next' ? 'slideInFromRight 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'slideInFromLeft 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards')
                    : 'none'
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.titleLine1 + ' ' + slide.titleLine2}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: slide.objectPosition,
                    display: 'block'
                  }}
                />

                {/* Dark Vignette Overlay for High Contrast Text */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, rgba(11, 35, 28, 0.96) 0%, rgba(11, 35, 28, 0.84) 48%, rgba(11, 35, 28, 0.32) 82%, transparent 100%)'
                }} />
              </div>
            );
          })}

          {/* Text Overlay Container Positioned in Bottom-Left Quadrant */}
          <div
            key={currentSlide}
            className="hero-slider-content-wrap"
            style={{
              position: 'absolute',
              bottom: 'clamp(28px, 4.2vw, 55px)',
              left: 'clamp(32px, 5vw, 80px)',
              zIndex: 5,
              maxWidth: '660px',
              animation: 'textFadeSlideUp 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            {/* Colored Sub-heading Badge */}
            <div className="hero-slider-badge" style={{
              display: 'inline-block',
              border: '1.5px solid #fc791a',
              borderRadius: '50px',
              padding: '7px 20px',
              color: '#fc791a',
              fontSize: 'clamp(12px, 1.1vw, 13.5px)',
              fontWeight: '700',
              letterSpacing: '0.3px',
              marginBottom: '16px',
              backgroundColor: 'rgba(11, 35, 28, 0.55)',
              backdropFilter: 'blur(5px)',
              animation: 'textFadeSlideUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both'
            }}>
              {activeSlideData.badge}
            </div>

            {/* Main Heading - Smaller, Elegant Typography */}
            <h1 className="hero-slider-heading" style={{
              fontSize: 'clamp(32px, 3.8vw, 48px)',
              fontWeight: '800',
              lineHeight: '1.2',
              color: '#ffffff',
              margin: '0 0 16px 0',
              letterSpacing: '-0.3px',
              textShadow: '0 4px 16px rgba(0,0,0,0.65)',
              animation: 'textFadeSlideUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both'
            }}>
              {activeSlideData.titleLine1}
              <br />
              {activeSlideData.titleLine2}
            </h1>

            {/* Description Paragraph - Smaller & Compact */}
            <p className="hero-slider-desc" style={{
              fontSize: 'clamp(13.5px, 1.2vw, 15.5px)',
              lineHeight: '1.65',
              color: '#e2e8f0',
              margin: '0 0 28px 0',
              maxWidth: '580px',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              animation: 'textFadeSlideUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both'
            }}>
              {activeSlideData.desc}
            </p>

            {/* Action Buttons Row */}
            <div className="hero-slider-actions-row" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              animation: 'textFadeSlideUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both'
            }}>
              {/* Notice Box / CTA with Yellow Vertical Bar & Alert Icon */}
              {/* Dynamic Primary Button */}
              {heroData.primaryBtnText === 'The form is not published.' ? (
                <div
                  onClick={onOpenDonate}
                  title="Click to Donate"
                  className="hero-slider-notice-box"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    borderRadius: '4px',
                    height: '38px',
                    paddingRight: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    border: 'none',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
                  }}
                >
                  <div style={{
                    position: 'relative',
                    height: '100%',
                    width: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '2.5px',
                      backgroundColor: '#f59e0b'
                    }} />
                    <div style={{
                      position: 'relative',
                      zIndex: 2,
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#f59e0b',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '800'
                    }}>
                      !
                    </div>
                  </div>

                  <span style={{
                    color: '#475569',
                    fontSize: '13.5px',
                    fontWeight: '600',
                    letterSpacing: '-0.1px',
                    whiteSpace: 'nowrap',
                    marginLeft: '6px'
                  }}>
                    The form is not published.
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (heroData.primaryBtnUrl && heroData.primaryBtnUrl !== '#donate' && !heroData.primaryBtnUrl.startsWith('#')) {
                      window.location.href = heroData.primaryBtnUrl;
                    } else if (onOpenDonate) {
                      onOpenDonate();
                    }
                  }}
                  className="hero-slider-notice-box"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: '#fc791a',
                    color: '#ffffff',
                    borderRadius: '4px',
                    height: '38px',
                    padding: '0 22px',
                    cursor: 'pointer',
                    fontSize: '14.5px',
                    fontWeight: '700',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(252, 121, 26, 0.4)',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ea580c';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fc791a';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {heroData.primaryBtnText || 'Donate Now'}
                </button>
              )}

              {/* Dynamic Secondary Action (Watch Video / Volunteer) */}
              <button
                onClick={() => {
                  if (heroData.watchVideoUrl) {
                    window.open(heroData.watchVideoUrl, '_blank');
                  } else if (onOpenVolunteer) {
                    onOpenVolunteer();
                  }
                }}
                className="hero-slider-volunteer-btn"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: '6px 2px',
                  textDecoration: 'underline',
                  textUnderlineOffset: '5px',
                  textDecorationThickness: '1.5px',
                  transition: 'color 0.2s ease, transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fc791a';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                {heroData.watchVideoText || 'Become a Volunteer'}
              </button>
            </div>
          </div>

          {/* Left Navigation Zone (Around Previous Button) */}
          <div
            className="hero-nav-zone-left"
            onMouseEnter={() => setIsHoveringPrev(true)}
            onMouseLeave={() => setIsHoveringPrev(false)}
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '160px',
              height: '260px',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '32px',
              zIndex: 15,
              pointerEvents: 'auto'
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous slide"
              className="hero-slider-nav-btn"
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                border: 'none',
                color: '#0f172a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isHoveringPrev
                  ? '0 8px 24px rgba(252, 121, 26, 0.35)'
                  : '0 6px 22px rgba(0,0,0,0.35)',
                opacity: showNavButtons ? 1 : 0,
                visibility: showNavButtons ? 'visible' : 'hidden',
                pointerEvents: showNavButtons ? 'auto' : 'none',
                transform: showNavButtons ? 'scale(1)' : 'scale(0.85)',
                transition: 'opacity 0.35s ease, visibility 0.35s ease, transform 0.35s ease, background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fc791a';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#0f172a';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
          </div>

          {/* Right Navigation Zone (Around Next Button) */}
          <div
            className="hero-nav-zone-right"
            onMouseEnter={() => setIsHoveringNext(true)}
            onMouseLeave={() => setIsHoveringNext(false)}
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '160px',
              height: '260px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '32px',
              zIndex: 15,
              pointerEvents: 'auto'
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next slide"
              className="hero-slider-nav-btn"
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                border: 'none',
                color: '#0f172a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isHoveringNext
                  ? '0 8px 24px rgba(252, 121, 26, 0.35)'
                  : '0 6px 22px rgba(0,0,0,0.35)',
                opacity: showNavButtons ? 1 : 0,
                visibility: showNavButtons ? 'visible' : 'hidden',
                pointerEvents: showNavButtons ? 'auto' : 'none',
                transform: showNavButtons ? 'scale(1)' : 'scale(0.85)',
                transition: 'opacity 0.35s ease, visibility 0.35s ease, transform 0.35s ease, background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fc791a';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#0f172a';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

        </div>

      </div>

      {/* Global Slide & Text Animation Keyframes (2.5s smooth sweep) */}
      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes textFadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .hero-nav-zone-left:hover .hero-slider-nav-btn,
        .hero-nav-zone-right:hover .hero-slider-nav-btn {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          transform: scale(1) !important;
        }
        @media (max-width: 768px) {
          .hero-slider-nav-btn {
            opacity: 0.9 !important;
            visibility: visible !important;
            pointer-events: auto !important;
            transform: scale(0.9) !important;
          }
        }
      `}</style>
    </section>
  );
}
