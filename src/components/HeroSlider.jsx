'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { useCms } from '../context/CmsContext';

export default function HeroSlider({ onOpenDonate, onOpenVolunteer }) {
  const { cms } = useCms();
  const heroData = cms?.hero || {};

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
        .map((s, idx) => {
          const isFirst = idx === 0;
          return {
            id: s.id || idx,
            badge: (isFirst && heroData.badge) ? heroData.badge : (s.badge || heroData.badge || "Sanatan Parampara"),
            titleLine1: (isFirst && heroData.headingLine1) ? heroData.headingLine1 : (s.title || heroData.headingLine1 || "Preserving Heritage,"),
            titleLine2: (isFirst && heroData.headingLine2) ? heroData.headingLine2 : (s.titleLine2 || ""),
            desc: (isFirst && heroData.paragraph) ? heroData.paragraph : (s.desc || heroData.paragraph || ""),
            image: (isFirst && heroData.backgroundMedia) ? heroData.backgroundMedia : (s.image || s.src || s.url || "/images/img_4.jpg"),
            objectPosition: "center 30%"
          };
        })
    : defaultSlides;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [targetOverride, setTargetOverride] = useState(null);
  const [trackWidth, setTrackWidth] = useState(1400);

  const prevIndex = (targetOverride && targetOverride.dir < 0)
    ? targetOverride.index
    : (currentSlide - 1 + slides.length) % slides.length;
  const nextIndex = (targetOverride && targetOverride.dir > 0)
    ? targetOverride.index
    : (currentSlide + 1) % slides.length;

  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const containerRef = useRef(null);
  const controls = useAnimationControls();
  const isTransitioningRef = useRef(false);
  const currentSlideRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  // Keep track of exact pixel width for 1:1 responsive drag calculations
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setTrackWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();

    const ro = new ResizeObserver(updateWidth);
    ro.observe(containerRef.current);
    window.addEventListener('resize', updateWidth);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Navigate to next or previous slide with fluid spring-based snapping animation
  const paginate = useCallback(async (direction, targetIndex = null) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const width = trackWidth || containerRef.current?.offsetWidth || 1400;
    const targetX = direction > 0 ? -width : width;
    const curr = currentSlideRef.current;
    const next = targetIndex !== null
      ? targetIndex
      : (curr + direction + slides.length) % slides.length;

    if (targetIndex !== null) {
      setTargetOverride({ dir: direction, index: targetIndex });
    }

    try {
      await controls.start({
        x: targetX,
        transition: {
          type: 'spring',
          stiffness: 240,
          damping: 28,
          mass: 0.8
        }
      });
    } catch {
      // Handled if animation is interrupted
    }

    controls.set({ x: 0 });
    setCurrentSlide(next);
    currentSlideRef.current = next;
    setTargetOverride(null);

    isTransitioningRef.current = false;
  }, [slides.length, controls, trackWidth]);

  // Autoplay functionality - pauses on hover and drag
  useEffect(() => {
    if (isHovering || isDragging) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      paginate(1);
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paginate, isHovering, isDragging]);

  const activeSlideData = slides[currentSlide] || slides[0];

  return (
    <section
      id="hero"
      className="hero-slider-section w-full py-12 md:py-[54px] pb-16 md:pb-[75px] bg-white relative overflow-hidden"
    >
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6">
        
        {/* Hero Card Container with Grab Cursors */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setIsDragging(false);
          }}
          className={`hero-slider-card relative rounded-[28px] md:rounded-[38px] overflow-hidden min-h-[clamp(750px,90vh,1000px)] bg-[#0b231c] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.32)] select-none ${
            isDragging ? 'is-dragging cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            touchAction: 'pan-y',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >

          {/* 1. Static Diagonal Overlay Layers (Angled color blocks remaining fixed over images) */}
          {/* Top-Left Diagonal Overlay Layer (layer-1.png) */}
          <div
            className="absolute top-0 left-0 w-[clamp(480px,52vw,820px)] h-[clamp(500px,56vw,880px)] pointer-events-none z-10 opacity-95 bg-no-repeat bg-contain"
            style={{
              backgroundImage: 'url(/images/layer-1.png)',
              backgroundPosition: 'top left'
            }}
          />

          {/* Bottom-Right Diagonal Overlay Layer (layer-2.png) */}
          <div
            className="absolute bottom-0 right-0 w-[clamp(400px,44vw,680px)] h-[clamp(420px,48vw,720px)] pointer-events-none z-10 opacity-95 bg-no-repeat bg-contain"
            style={{
              backgroundImage: 'url(/images/layer-2.png)',
              backgroundPosition: 'bottom right'
            }}
          />

          {/* 2. Responsive Mouse-Draggable Slide Track with Framer Motion */}
          <motion.div
            animate={controls}
            drag="x"
            dragConstraints={{ left: -trackWidth, right: trackWidth }}
            dragElastic={0.2}
            onDragStart={() => {
              setIsDragging(true);
            }}
            onDragEnd={async (event, info) => {
              setIsDragging(false);
              const { offset, velocity } = info;
              const threshold = 60; // 50px - 100px snap threshold
              const velocityThreshold = 250;

              if (offset.x < -threshold || velocity.x < -velocityThreshold) {
                // Pulled Left past threshold -> pull next image all the way into center
                paginate(1);
              } else if (offset.x > threshold || velocity.x > velocityThreshold) {
                // Pulled Right past threshold -> pull prev image all the way into center
                paginate(-1);
              } else {
                // Short drag -> Spring back to center position!
                controls.start({
                  x: 0,
                  transition: {
                    type: 'spring',
                    stiffness: 350,
                    damping: 26
                  }
                });
              }
            }}
            className={`hero-drag-track absolute inset-0 w-full h-full z-0 select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
          >
            {/* Slot -1: Previous Slide (Positioned directly to the left for 1:1 panning) */}
            <div
              className="absolute top-0 w-full h-full"
              style={{ left: '-100%' }}
            >
              {slides[prevIndex] && (
                <div className="relative w-full h-full">
                  <img
                    src={slides[prevIndex].image}
                    alt={slides[prevIndex].titleLine1 + ' ' + slides[prevIndex].titleLine2}
                    draggable={false}
                    className="w-full h-full object-cover select-none pointer-events-none block"
                    style={{ objectPosition: slides[prevIndex].objectPosition }}
                  />
                  {/* High Contrast Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0b231c]/95 via-[#0b231c]/80 via-48% to-transparent pointer-events-none" />
                </div>
              )}
            </div>

            {/* Slot 0: Center / Active Slide */}
            <div
              className="absolute top-0 w-full h-full"
              style={{ left: '0%' }}
            >
              {slides[currentSlide] && (
                <div className="relative w-full h-full">
                  <img
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].titleLine1 + ' ' + slides[currentSlide].titleLine2}
                    draggable={false}
                    className="w-full h-full object-cover select-none pointer-events-none block"
                    style={{ objectPosition: slides[currentSlide].objectPosition }}
                  />
                  {/* High Contrast Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0b231c]/95 via-[#0b231c]/80 via-48% to-transparent pointer-events-none" />
                </div>
              )}
            </div>

            {/* Slot +1: Next Slide (Positioned directly to the right for 1:1 panning) */}
            <div
              className="absolute top-0 w-full h-full"
              style={{ left: '100%' }}
            >
              {slides[nextIndex] && (
                <div className="relative w-full h-full">
                  <img
                    src={slides[nextIndex].image}
                    alt={slides[nextIndex].titleLine1 + ' ' + slides[nextIndex].titleLine2}
                    draggable={false}
                    className="w-full h-full object-cover select-none pointer-events-none block"
                    style={{ objectPosition: slides[nextIndex].objectPosition }}
                  />
                  {/* High Contrast Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0b231c]/95 via-[#0b231c]/80 via-48% to-transparent pointer-events-none" />
                </div>
              )}
            </div>
          </motion.div>

          {/* 3. Floating Content Box (Remains in fixed position, smoothly cross-fades text data) */}
          <div className="hero-slider-content-wrap absolute bottom-[clamp(28px,4.2vw,55px)] left-[clamp(24px,5vw,80px)] z-20 max-w-[660px] pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none flex flex-col items-start"
              >
                {/* Colored Sub-heading Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 }}
                  className="hero-slider-badge inline-block border-[1.5px] border-[#fc791a] rounded-full px-5 py-1.5 text-[#fc791a] text-[clamp(12px,1.1vw,13.5px)] font-bold tracking-[0.3px] mb-4 bg-[#0b231c]/60 backdrop-blur-sm shadow-sm select-none"
                >
                  {activeSlideData.badge}
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.15 }}
                  className="hero-slider-heading text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.2] text-white m-0 mb-4 tracking-[-0.3px] drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)] select-none"
                >
                  {activeSlideData.titleLine1}
                  <br />
                  {activeSlideData.titleLine2}
                </motion.h1>

                {/* Description Paragraph */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.22 }}
                  className="hero-slider-desc text-[clamp(13.5px,1.2vw,15.5px)] leading-[1.65] text-slate-200 m-0 mb-7 max-w-[580px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] select-none"
                >
                  {activeSlideData.desc}
                </motion.p>

                {/* Action Buttons Row */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.28 }}
                  className="hero-slider-actions-row flex items-center gap-5 flex-wrap pointer-events-auto"
                >
                  {/* Dynamic Primary Button */}
                  {heroData.primaryBtnText === 'The form is not published.' ? (
                    <div
                      onClick={onOpenDonate}
                      title="Click to Donate"
                      className="hero-slider-notice-box inline-flex items-center bg-white rounded h-[38px] pr-4 cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                    >
                      <div className="relative h-full w-8 flex items-center justify-center shrink-0">
                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2.5px] bg-[#f59e0b]" />
                        <div className="relative z-10 w-5 h-5 rounded-full bg-[#f59e0b] text-white flex items-center justify-center text-xs font-extrabold">
                          !
                        </div>
                      </div>
                      <span className="text-slate-600 text-[13.5px] font-semibold tracking-[-0.1px] whitespace-nowrap ml-1.5">
                        The form is not published.
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (heroData.primaryBtnUrl && heroData.primaryBtnUrl !== '#donate' && !heroData.primaryBtnUrl.startsWith('#')) {
                          window.location.href = heroData.primaryBtnUrl;
                        } else if (onOpenDonate) {
                          onOpenDonate();
                        }
                      }}
                      className="hero-slider-primary-btn inline-flex items-center bg-[#fc791a] hover:bg-[#ea580c] text-white rounded h-[38px] px-6 cursor-pointer text-[14.5px] font-bold border-none shadow-[0_4px_16px_rgba(252,121,26,0.4)] hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {heroData.primaryBtnText || 'Donate Now'}
                    </button>
                  )}

                  {/* Dynamic Secondary Action */}
                  <button
                    type="button"
                    onClick={() => {
                      if (heroData.watchVideoUrl) {
                        window.open(heroData.watchVideoUrl, '_blank');
                      } else if (onOpenVolunteer) {
                        onOpenVolunteer();
                      }
                    }}
                    className="hero-slider-volunteer-btn bg-transparent border-none text-white hover:text-[#fc791a] text-[15px] font-bold cursor-pointer py-1 px-1 underline underline-offset-[5px] decoration-[1.5px] hover:translate-x-0.5 transition-all duration-200"
                  >
                    {heroData.watchVideoText || 'Become a Volunteer'}
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 4. Circular Left/Right Navigation Arrow Buttons */}
          {/* Circular Left Arrow Button */}
          <div className="hero-nav-arrow-left absolute left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                paginate(-1);
              }}
              aria-label="Previous slide"
              className="hero-slider-nav-btn w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/95 hover:bg-[#fc791a] text-slate-800 hover:text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border-none outline-none group"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
          </div>

          {/* Circular Right Arrow Button */}
          <div className="hero-nav-arrow-right absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                paginate(1);
              }}
              aria-label="Next slide"
              className="hero-slider-nav-btn w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/95 hover:bg-[#fc791a] text-slate-800 hover:text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border-none outline-none group"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* 5. Pagination Indicator Dots / Pills */}
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-10 z-30 flex items-center gap-2 pointer-events-auto">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (idx === currentSlide) return;
                  paginate(idx > currentSlide ? 1 : -1, idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 border-none outline-none cursor-pointer ${
                  idx === currentSlide
                    ? 'w-8 bg-[#fc791a] shadow-[0_2px_8px_rgba(252,121,26,0.6)]'
                    : 'w-2.5 bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Global CSS guarantees grab/grabbing cursor states across all browsers */}
      <style>{`
        .hero-slider-card {
          cursor: grab;
        }
        .hero-slider-card:active,
        .hero-slider-card.is-dragging {
          cursor: grabbing !important;
        }
        .hero-slider-card.is-dragging * {
          cursor: grabbing !important;
        }
        .hero-drag-track {
          cursor: grab;
        }
        .hero-drag-track:active,
        .hero-drag-track.cursor-grabbing {
          cursor: grabbing !important;
        }
        .hero-slider-nav-btn {
          cursor: pointer !important;
        }
      `}</style>
    </section>
  );
}
