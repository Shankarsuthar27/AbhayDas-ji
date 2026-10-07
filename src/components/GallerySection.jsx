import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function GallerySection({ onOpenLightbox, onNavigate }) {
  const galleryItems = [
    {
      id: 1,
      src: "/images/img_17.jpg",
      title: "Pujya Maharaj Ji with Saints & Devotees",
      alt: "Pujya Maharaj Ji with Saints"
    },
    {
      id: 2,
      src: "/images/img_18.jpg",
      title: "Devotee Offering Pranam & Sacred Blessings",
      alt: "Devotee Offering Pranam"
    },
    {
      id: 3,
      src: "/images/img_19.jpg",
      title: "Spiritual Discourse & Guidance Session",
      alt: "Spiritual Discourse"
    },
    {
      id: 4,
      src: "/images/img_20.jpg",
      title: "Evening Satsang & Devotional Bhajan Sandhya",
      alt: "Evening Satsang"
    },
    {
      id: 5,
      src: "/images/img_21.jpg",
      title: "National Honor & Sacred Felicitation Ceremony",
      alt: "National Honors"
    },
    {
      id: 6,
      src: "/images/img_22.jpg",
      title: "Takhatgarh Dham Seva & Community Assembly",
      alt: "Takhatgarh Assembly"
    }
  ];

  // Tripled items for infinite seamless looping
  const displayItems = [...galleryItems, ...galleryItems, ...galleryItems];
  const originalLength = galleryItems.length;

  const containerRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(originalLength); // Start at middle set (index 6)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [containerWidth, setContainerWidth] = useState(1260);

  // Live real-time drag offset state
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const currentDragDeltaRef = useRef(0);
  const wheelLockRef = useRef(false);

  // Measure container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Compute responsive items per view matching data-carousel spec
  let itemsPerView = 5;
  if (containerWidth < 480) {
    itemsPerView = 1;
  } else if (containerWidth < 768) {
    itemsPerView = 2;
  } else if (containerWidth < 992) {
    itemsPerView = 3;
  } else if (containerWidth < 1200) {
    itemsPerView = 4;
  }

  // 30px gap matches space_between: 30
  const gap = 30;
  const usableWidth = Math.max(containerWidth - 30, 280);
  const slideWidth = (usableWidth - (itemsPerView - 1) * gap) / itemsPerView;

  // Real-time transform offset including live dragging for instant tactile feel
  const currentOffset = slideIndex * (slideWidth + gap) - dragOffset;

  // Slide to a specific target index with fast 300ms transition
  const slideTo = useCallback((newIndex) => {
    setIsTransitioning(true);
    setDragOffset(0);
    setSlideIndex(newIndex);
  }, []);

  // Re-enable smooth transition after instant loop wrap
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // Seamless boundary wrap when transition finishes
  const handleTransitionEnd = () => {
    if (slideIndex >= originalLength * 2) {
      setIsTransitioning(false);
      setSlideIndex((prev) => prev - originalLength);
    } else if (slideIndex < originalLength) {
      setIsTransitioning(false);
      setSlideIndex((prev) => prev + originalLength);
    }
  };

  // Immediate Click-to-Slide handler
  const handleCardClick = (targetIndex, e) => {
    // If clicked the zoom action icon, let lightbox open
    if (e.target.closest('.gallery-one__photo')) {
      return;
    }

    // Ignore if drag movement occurred
    if (Math.abs(currentDragDeltaRef.current) > 8) {
      return;
    }

    // If clicking current leading slide, advance forward by 1
    if (targetIndex === slideIndex) {
      slideTo(slideIndex + 1);
    } else {
      // Slide directly so clicked image shifts into view immediately
      slideTo(targetIndex);
    }
  };

  // Previous and Next button handlers
  const handlePrev = (e) => {
    e.stopPropagation();
    slideTo(slideIndex - 1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    slideTo(slideIndex + 1);
  };

  // Responsive Wheel Scroll (Trackpad & Mouse Wheel)
  const handleWheel = (e) => {
    // Determine dominant scroll direction
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    
    if (Math.abs(delta) < 12 || wheelLockRef.current) return;

    wheelLockRef.current = true;
    if (delta > 0) {
      slideTo(slideIndex + 1);
    } else {
      slideTo(slideIndex - 1);
    }

    setTimeout(() => {
      wheelLockRef.current = false;
    }, 220); // quick debounce for fast, responsive multi-wheel flicks
  };

  // Real-time Touch Dragging
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setIsTransitioning(false);
    dragStartXRef.current = e.touches[0].clientX;
    currentDragDeltaRef.current = 0;
  };

  const handleTouchMove = (e) => {
    if (!dragStartXRef.current) return;
    const deltaX = e.touches[0].clientX - dragStartXRef.current;
    currentDragDeltaRef.current = deltaX;
    setDragOffset(deltaX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const delta = currentDragDeltaRef.current;
    dragStartXRef.current = 0;
    currentDragDeltaRef.current = 0;

    if (delta < -30) {
      slideTo(slideIndex + 1);
    } else if (delta > 30) {
      slideTo(slideIndex - 1);
    } else {
      slideTo(slideIndex);
    }
  };

  // Real-time Mouse Dragging
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setIsTransitioning(false);
    dragStartXRef.current = e.clientX;
    currentDragDeltaRef.current = 0;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartXRef.current;
    currentDragDeltaRef.current = deltaX;
    setDragOffset(deltaX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const delta = currentDragDeltaRef.current;
    dragStartXRef.current = 0;
    currentDragDeltaRef.current = 0;

    if (delta < -30) {
      slideTo(slideIndex + 1);
    } else if (delta > 30) {
      slideTo(slideIndex - 1);
    } else {
      slideTo(slideIndex);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  return (
    <section
      id="gallery"
      className="gva-gallery-carousel-section"
      style={{
        padding: '30px 0 60px',
        backgroundColor: '#ffffff',
        position: 'relative',
        width: '100%',
        overflow: 'hidden'
      }}
      aria-label="Photo Gallery"
    >
      <style>{`
        /* Authoritative .init-carousel-swiper Specification */
        .init-carousel-swiper {
          position: relative;
          z-index: 1;
          display: block;
          width: 100%;
          height: 100%;
          font-family: var(--donatm-font-sans-serif, 'Plus Jakarta Sans', sans-serif);
          font-size: 16px;
          line-height: 28.8px;
          font-weight: 400;
          color: var(--e-global-color-text, #676666);
          background-color: rgba(0, 0, 0, 0);
          padding: 0px 15px 0px 15px;
          cursor: grab;
          transition: all 0.25s ease;
          overflow: hidden;
          user-select: none;
          touch-action: pan-y;
        }

        .init-carousel-swiper.is-dragging {
          cursor: grabbing;
        }

        /* ::after preloader when uninitialized */
        .init-carousel-swiper:not(.swiper-initialized)::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0px;
          left: 0px;
          background-color: rgb(255, 255, 255);
          background-image: url("/images/preloader.gif");
          background-repeat: no-repeat;
          background-position: center;
          color: rgb(103, 102, 102);
          font-size: 16px;
          font-weight: 400;
          border-radius: 0px;
          border: 0px none rgb(103, 102, 102);
          opacity: 1;
          z-index: 10;
        }

        .init-carousel-swiper.swiper-initialized::after {
          display: none;
          opacity: 0;
          pointer-events: none;
        }

        /* Gallery Single Card Styling */
        .gallery-one__single {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          height: 275px;
          width: 100%;
          background: #f3f4f6;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
          cursor: pointer;
        }

        .gallery-one__single:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
        }

        .gallery-one__single:active {
          transform: scale(0.985);
        }

        .gallery-one__image {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        .gallery-one__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .gallery-one__single:hover .gallery-one__image img {
          transform: scale(1.06);
        }

        /* Floating Circular Action Link */
        .gallery-one__photo {
          width: 44px;
          height: 44px;
          position: absolute;
          top: 16px;
          right: 16px;
          background-color: var(--e-global-color-primary, #02A95C);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 4;
          cursor: pointer;
          opacity: 0;
          transform: scale(0.7);
          border-radius: 50%;
          border: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(2, 169, 92, 0.35);
          text-decoration: none;
        }

        .gallery-one__single:hover .gallery-one__photo {
          opacity: 1;
          transform: scale(1);
        }

        .gallery-one__photo:hover {
          background-color: var(--e-global-color-secondary, #fc791a);
          color: #ffffff;
          transform: scale(1.12);
        }

        /* Sleek Navigation Arrow Controls */
        .gallery-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);
          border: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #17342f;
          cursor: pointer;
          z-index: 20;
          opacity: 0.92;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gallery-nav-arrow:hover {
          background: #fc791a;
          color: #ffffff;
          border-color: #fc791a;
          box-shadow: 0 8px 24px rgba(252, 121, 26, 0.45);
          transform: translateY(-50%) scale(1.1);
          opacity: 1;
        }

        .gallery-nav-arrow:active {
          transform: translateY(-50%) scale(0.96);
        }

        .gallery-nav-arrow.prev {
          left: 18px;
        }

        .gallery-nav-arrow.next {
          right: 18px;
        }

        @media (max-width: 768px) {
          .gallery-nav-arrow {
            width: 38px;
            height: 38px;
          }
          .gallery-nav-arrow.prev {
            left: 8px;
          }
          .gallery-nav-arrow.next {
            right: 8px;
          }
        }
      `}</style>

      <div
        className="gva-gallery-carousel swiper-slider-wrapper style-1 max-w-[1340px] mx-auto relative group"
        style={{ maxWidth: '1340px', margin: '0 auto', position: 'relative' }}
      >
        {/* Navigation Arrow Controls */}
        <button
          type="button"
          className="gallery-nav-arrow prev"
          onClick={handlePrev}
          aria-label="Previous image"
          title="Previous image"
        >
          <svg
            width="20"
            height="20"
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

        <button
          type="button"
          className="gallery-nav-arrow next"
          onClick={handleNext}
          aria-label="Next image"
          title="Next image"
        >
          <svg
            width="20"
            height="20"
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

        <div className="swiper-content-inner">
          {/* Authoritative .init-carousel-swiper div */}
          <div
            ref={containerRef}
            className={`init-carousel-swiper swiper swiper-initialized swiper-horizontal swiper-pointer-events swiper-watch-progress block relative z-[1] w-full h-full px-[15px] mx-auto font-sans text-base leading-[28.8px] text-[#676666] ${isDragging ? 'is-dragging' : ''}`}
            data-carousel='{"items":5,"items_lg":5,"items_md":4,"items_sm":3,"items_xs":2,"items_xx":1,"effect":"slide","space_between":30,"loop":1,"speed":300,"autoplay":0,"autoplay_delay":4500,"autoplay_hover":1,"navigation":1,"pagination":0,"dynamic_bullets":0,"pagination_type":"bullets"}'
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'block',
              width: '100%',
              minHeight: '280px',
              fontFamily: "var(--donatm-font-sans-serif, 'Plus Jakarta Sans', sans-serif)",
              fontSize: '16px',
              lineHeight: '28.8px',
              fontWeight: 400,
              color: 'var(--e-global-color-text, #676666)',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              padding: '0 15px'
            }}
          >
            {/* Swiper wrapper with quick 300ms transition and live drag response */}
            <div
              className="swiper-wrapper"
              aria-live="polite"
              onTransitionEnd={handleTransitionEnd}
              style={{
                display: 'flex',
                transform: `translate3d(-${currentOffset}px, 0px, 0px)`,
                transition: isTransitioning && !isDragging
                  ? 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)'
                  : 'none',
                willChange: 'transform'
              }}
            >
              {displayItems.map((item, index) => {
                const originalIndex = index % originalLength;
                const isLeading = index === slideIndex;

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className={`swiper-slide item ${isLeading ? 'swiper-slide-active item-active' : ''}`}
                    role="group"
                    aria-label={`${originalIndex + 1} / ${originalLength}`}
                    onClick={(e) => handleCardClick(index, e)}
                    style={{
                      width: `${slideWidth}px`,
                      marginRight: `${gap}px`,
                      flexShrink: 0
                    }}
                  >
                    <div className="gallery-one__single group">
                      <div className="gallery-one__image">
                        <img
                          decoding="async"
                          src={item.src}
                          alt={item.alt || item.title}
                          onError={(e) => {
                            e.target.src = '/images/img_3.jpg';
                          }}
                        />
                      </div>

                      {/* Floating Lightbox Zoom Action Button */}
                      <button
                        type="button"
                        className="gallery-one__photo"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenLightbox) {
                            onOpenLightbox(galleryItems, originalIndex);
                          }
                        }}
                        title={`Enlarge ${item.title}`}
                        aria-label={`Enlarge photo ${item.title}`}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </button>

                      {/* Content Overlay */}
                      <div className="gallery-one__content">
                        <div className="gallery-one__content-inner" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <span className="swiper-notification" aria-live="assertive" aria-atomic="true" />
          </div>

          {/* View Full Gallery Link Button */}
          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <button
              type="button"
              onClick={() => {
                if (onNavigate) {
                  onNavigate('/gallery');
                } else {
                  window.history.pushState({}, '', '/gallery');
                  window.dispatchEvent(new Event('popstate'));
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#fc791a',
                color: '#ffffff',
                border: 'none',
                padding: '13px 32px',
                borderRadius: '30px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 22px rgba(252, 121, 26, 0.35)',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0b231c';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(11, 35, 28, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fc791a';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 22px rgba(252, 121, 26, 0.35)';
              }}
            >
              <span>Explore Full Gallery (171 Moments)</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
