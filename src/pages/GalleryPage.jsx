import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { galleryData } from '../data/galleryData';
import ContactBar from '../components/ContactBar';
import './GalleryPage.css';

export default function GalleryPage({ onNavigate }) {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [firestoreItems, setFirestoreItems] = useState([]);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  // Set page title for SEO & Accessibility
  useEffect(() => {
    document.title = "Our Gallery – Shree Abhay Das Ji Maharaj | Divine Photo Darshan";
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Fetch dynamic photos uploaded via admin panel
  useEffect(() => {
    let isMounted = true;
    async function fetchDynamicGallery() {
      try {
        let gQuery;
        try {
          gQuery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        } catch (e) {
          gQuery = collection(db, 'gallery');
        }
        const snap = await getDocs(gQuery);
        if (!isMounted) return;
        const docs = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: `fs_${d.id}`,
            thumb: data.url,
            full: data.url,
            title: data.title || data.caption || 'Divine Darshan',
            alt: data.title || 'Pujya Shree Abhay Das Ji Maharaj - Sacred Moment',
            name: data.title || data.caption || 'Divine Darshan',
            caption: data.caption || data.title || '',
            category: data.category || 'Darshan',
            createdAt: data.createdAt
          };
        });

        docs.sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });

        setFirestoreItems(docs);
      } catch (err) {
        console.warn('Dynamic gallery fetch note:', err.message);
      }
    }
    fetchDynamicGallery();
    return () => { isMounted = false; };
  }, []);

  // Combined list: dynamic admin uploads first, followed by static curated gallery
  const combinedGallery = useMemo(() => {
    return [...firestoreItems, ...galleryData];
  }, [firestoreItems]);

  // Filter items by search keyword
  const filteredGallery = useMemo(() => {
    if (!searchTerm.trim()) return combinedGallery;
    const term = searchTerm.toLowerCase();
    return combinedGallery.filter(item =>
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.alt && item.alt.toLowerCase().includes(term)) ||
      (item.category && item.category.toLowerCase().includes(term))
    );
  }, [searchTerm, combinedGallery]);

  // Scroll Reveal Intersection Observer (Fade-in & Slide-up as user scrolls)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '60px 0px -20px 0px',
        threshold: 0.05
      }
    );

    const cards = document.querySelectorAll('.gallery-card');
    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
    };
  }, [filteredGallery]);

  // Open Lightbox
  const handleOpenLightbox = (index) => {
    setActiveLightboxIndex(index);
    setIsZoomed(false);
  };

  // Close Lightbox
  const handleCloseLightbox = useCallback(() => {
    setActiveLightboxIndex(null);
    setIsZoomed(false);
  }, []);

  // Next Image
  const handleNext = useCallback((e) => {
    if (e) e.stopPropagation();
    setIsZoomed(false);
    setActiveLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % filteredGallery.length
    );
  }, [filteredGallery.length]);

  // Previous Image
  const handlePrev = useCallback((e) => {
    if (e) e.stopPropagation();
    setIsZoomed(false);
    setActiveLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + filteredGallery.length) % filteredGallery.length
    );
  }, [filteredGallery.length]);

  // Toggle Zoom on enlarged image
  const handleToggleZoom = (e) => {
    if (e) e.stopPropagation();
    setIsZoomed((prev) => !prev);
  };

  // Toggle Browser Fullscreen
  const handleToggleFullscreen = (e) => {
    if (e) e.stopPropagation();
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {});
        setIsFullscreen(true);
      } else {
        document.exitFullscreen?.().catch(() => {});
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn("Fullscreen toggle error:", err);
    }
  };

  // Share / Copy Link
  const handleShare = async (e) => {
    if (e) e.stopPropagation();
    const currentItem = activeLightboxIndex !== null ? filteredGallery[activeLightboxIndex] : null;
    if (!currentItem) return;

    const shareUrl = window.location.href;
    const shareTitle = currentItem.name || currentItem.title;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Divine Darshan: ${shareTitle}`,
          url: shareUrl
        });
        return;
      } catch (err) {
        // Fall back to clipboard copy if cancelled or unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setToastMessage('Link copied to clipboard!');
      setTimeout(() => setToastMessage(''), 2500);
    } catch (err) {
      setToastMessage('Photo: ' + shareTitle);
      setTimeout(() => setToastMessage(''), 2500);
    }
  };

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation for Lightbox (Left / Right / Escape)
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    // Prevent body scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseLightbox();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeLightboxIndex, handleCloseLightbox, handleNext, handlePrev]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Horizontal swipe threshold: 45px
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    } else if (deltaY > 80 && Math.abs(deltaX) < 40) {
      // Swipe down to close
      handleCloseLightbox();
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Preload adjacent images for smooth instant navigation
  useEffect(() => {
    if (activeLightboxIndex === null || filteredGallery.length === 0) return;
    const nextIdx = (activeLightboxIndex + 1) % filteredGallery.length;
    const prevIdx = (activeLightboxIndex - 1 + filteredGallery.length) % filteredGallery.length;

    const imgNext = new Image();
    imgNext.src = filteredGallery[nextIdx]?.full || filteredGallery[nextIdx]?.thumb;
    const imgPrev = new Image();
    imgPrev.src = filteredGallery[prevIdx]?.full || filteredGallery[prevIdx]?.thumb;
  }, [activeLightboxIndex, filteredGallery]);

  const currentItem = activeLightboxIndex !== null ? filteredGallery[activeLightboxIndex] : null;

  return (
    <div className="gallery-page-container" id="gallery-main-surface">
      
      {/* ====================================================================
          1. Hero Banner Section
          Maharaj Ji namaste banner with "Our Gallery" & breadcrumb
          ==================================================================== */}
      <header
        className="gallery-hero-banner"
        style={{
          backgroundImage: `url('/images/gallery/617853148_18573640189030636_154933284608741714_n.jpg')`
        }}
      >
        <div className="gallery-hero-overlay" />
        
        <div className="gallery-hero-content">
          <h1 className="gallery-hero-title">Our Gallery</h1>
          <p className="gallery-hero-subtitle">
            Charity activities are taken place around the world.
          </p>

          <nav className="gallery-breadcrumb" aria-label="Breadcrumb">
            <span
              className="gallery-breadcrumb-link"
              onClick={() => onNavigate ? onNavigate('/') : (window.location.href = '/')}
              role="button"
              tabIndex={0}
            >
              Home
            </span>
            <span className="gallery-breadcrumb-sep">/</span>
            <span className="gallery-breadcrumb-current">Our Gallery</span>
          </nav>
        </div>
      </header>

      {/* ====================================================================
          2. Main Gallery Section
          5-Column Uniform Square Grid with Scroll Reveal Animation
          ==================================================================== */}
      <main className="gallery-main-section">
        
        {/* Gallery Toolbar: Counter & Search Filter */}
        <div className="gallery-toolbar">
          <div className="gallery-count-badge">
            <span className="gallery-badge-icon">📷</span>
            <span>Divine Darshan:</span>
            <span className="gallery-count-number">{filteredGallery.length} Photos</span>
          </div>

          <div className="gallery-search-box">
            <span className="gallery-search-icon">🔍</span>
            <input
              type="text"
              className="gallery-search-input"
              placeholder="Search darshan moments (e.g., IMG_5724)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search moments"
            />
            {searchTerm && (
              <button
                className="gallery-search-clear"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 5-Column Grid with Scroll-Reveal Fade-in & Slide-up */}
        {filteredGallery.length > 0 ? (
          <div className="gallery-grid" role="region" aria-label="Photo gallery moments">
            {filteredGallery.map((item, index) => (
              <figure
                key={item.id}
                className="gallery-card"
                style={{
                  '--col-delay': `${(index % 5) * 45}ms`
                }}
                onClick={() => handleOpenLightbox(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenLightbox(index);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View ${item.name || item.title}`}
              >
                <img
                  src={item.thumb}
                  alt={item.alt || item.name}
                  className="gallery-card-img"
                  loading="lazy"
                  decoding="async"
                />
                
                <div className="gallery-card-overlay">
                  <div className="gallery-card-zoom-icon" title="View Full Photo">
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
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        ) : (
          <div className="gallery-empty">
            <div className="gallery-empty-title">No matching photos found</div>
            <p className="gallery-empty-desc">
              Try searching with a different keyword or clear your search filter.
            </p>
            <button
              className="gallery-empty-btn"
              onClick={() => setSearchTerm('')}
            >
              Show All Photos
            </button>
          </div>
        )}

      </main>

      {/* ====================================================================
          3. Bright Orange Contact Banner
          Matches bottom of original website design
          ==================================================================== */}
      <ContactBar />

      {/* ====================================================================
          4. Fullscreen Interactive Lightbox Modal (Matches Reference Screenshot)
          Dark semi-transparent backdrop, top-right toolbar, centered scaled image,
          < and > side arrows, centered name caption directly below
          ==================================================================== */}
      {currentItem && (
        <div
          className="gallery-lightbox-backdrop"
          onClick={handleCloseLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged image viewer"
        >
          {/* Top-Right Control Toolbar matching reference screenshot:
              [Fullscreen] [Zoom] [Share] [Close] */}
          <div
            className="gallery-lightbox-header"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fullscreen Toggle */}
            <button
              className="gallery-lightbox-btn"
              onClick={handleToggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
              )}
            </button>

            {/* Zoom In/Out Toggle */}
            <button
              className={`gallery-lightbox-btn ${isZoomed ? 'is-active' : ''}`}
              onClick={handleToggleZoom}
              title={isZoomed ? "Zoom Out" : "Zoom In"}
              aria-label="Toggle Zoom"
            >
              {isZoomed ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              )}
            </button>

            {/* Share / Copy Link */}
            <button
              className="gallery-lightbox-btn"
              onClick={handleShare}
              title="Share photo"
              aria-label="Share photo"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>

            {/* Close Button */}
            <button
              className="gallery-lightbox-btn gallery-lightbox-close"
              onClick={handleCloseLightbox}
              title="Close (Esc)"
              aria-label="Close image viewer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Left Arrow: < */}
          <button
            className="gallery-lightbox-nav gallery-lightbox-prev"
            onClick={handlePrev}
            aria-label="Previous image"
            title="Previous image (Left Arrow)"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Center Stage: Centered Enlarged Image maintaining natural aspect ratio */}
          <div
            className="gallery-lightbox-stage"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`gallery-lightbox-img-wrapper ${isZoomed ? 'is-zoomed-wrapper' : ''}`}
              onClick={handleToggleZoom}
            >
              <img
                key={currentItem.id}
                src={currentItem.full || currentItem.thumb}
                alt={currentItem.alt || currentItem.name}
                className={`gallery-lightbox-img ${isZoomed ? 'is-zoomed' : ''}`}
                title={isZoomed ? "Click to Zoom Out" : "Click to Zoom In"}
                draggable="false"
              />
            </div>

            {/* Centered Caption Directly Below the Image (e.g. IMG_5724) */}
            <div className="gallery-lightbox-caption-area">
              <div className="gallery-lightbox-caption">
                {currentItem.name || currentItem.caption || currentItem.title}
              </div>
              <div className="gallery-lightbox-counter">
                {activeLightboxIndex + 1} / {filteredGallery.length}
              </div>
            </div>
          </div>

          {/* Right Arrow: > */}
          <button
            className="gallery-lightbox-nav gallery-lightbox-next"
            onClick={handleNext}
            aria-label="Next image"
            title="Next image (Right Arrow)"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="gallery-toast" role="status">
          {toastMessage}
        </div>
      )}

    </div>
  );
}
