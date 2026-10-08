import React, { useState, useRef, useEffect } from 'react';
import {
  Edit3,
  Image as ImageIcon,
  Upload,
  Link2,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Eye,
  Sliders,
  Play,
  Pause,
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { compressImage } from '../utils/helpers';

// Preset stock images available in the repository
const HERO_PRESET_IMAGES = [
  { url: '/images/img_4.jpg', label: 'Maharaj Ji Spiritual Portrait (Main)' },
  { url: '/images/img_3.jpg', label: 'Takhatgarh Ashram Parampara' },
  { url: '/images/img_5.jpg', label: 'Sanatan Wisdom Stage Darshan' },
  { url: '/images/img_10.jpg', label: 'Sacred Temple Artwork' },
  { url: '/images/img_11.jpg', label: 'Katha Pravachan Discourse' }
];

export default function HeroVisualEditor({
  formData,
  updateSection,
  viewport = 'desktop',
  onNotify
}) {
  const heroData = formData?.hero || {};
  const slides = heroData?.slides && heroData.slides.length > 0 ? heroData.slides : [
    {
      id: 'hs1',
      title: heroData.headingLine1 || 'Preserving Heritage, Inspiring Generations',
      badge: heroData.badge || 'Seva • Sanskar • Parampara',
      desc: heroData.paragraph || 'Rooted in sacred parampara and guided by service...',
      image: heroData.backgroundMedia || '/images/img_4.jpg',
      status: 'published'
    }
  ];

  // Active slide state
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false); // Default paused for comfortable visual editing

  // Active popover / editing modal state
  // field: 'badge' | 'headingLine1' | 'headingLine2' | 'paragraph' | 'primaryBtn' | 'watchVideo' | 'bgMedia' | 'slideImage' | 'slideTitle' | 'slideBadge' | 'slideDesc'
  const [activeField, setActiveField] = useState(null);

  // Image replace modal state
  const [imageModalTarget, setImageModalTarget] = useState(null); // 'heroBg' | 'slideImage'
  const [imageModalUrl, setImageModalUrl] = useState('');
  const [imageModalTab, setImageModalTab] = useState('upload'); // 'upload' | 'url' | 'presets'
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Safe slide index guard
  const safeIdx = Math.min(Math.max(0, activeSlideIdx), slides.length - 1);
  const activeSlide = slides[safeIdx] || slides[0] || {};

  // Auto-play interval when enabled
  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoPlay, slides.length]);

  // Update hero root fields
  const handleUpdateHeroField = (fieldName, value) => {
    updateSection('hero', { [fieldName]: value });
    onNotify?.(`Updated: ${fieldName}`);
  };

  // Update specific slide fields
  const handleUpdateSlideField = (index, fieldName, value) => {
    const updatedSlides = [...slides];
    updatedSlides[index] = {
      ...updatedSlides[index],
      [fieldName]: value
    };
    updateSection('hero', { slides: updatedSlides });
    onNotify?.(`Updated slide #${index + 1}: ${fieldName}`);
  };

  // Handle image upload with compression
  const handleFileUpload = async (file) => {
    if (!file) return;
    setImageUploading(true);
    try {
      const result = await compressImage(file, { maxWidth: 1600, maxHeight: 1100, quality: 0.84 });
      const newUrl = result.dataUrl;

      if (imageModalTarget === 'heroBg') {
        handleUpdateHeroField('backgroundMedia', newUrl);
        onNotify?.('Hero background media updated successfully');
      } else if (imageModalTarget === 'slideImage') {
        handleUpdateSlideField(safeIdx, 'image', newUrl);
        onNotify?.(`Slide #${safeIdx + 1} background image updated`);
      }
      setImageModalTarget(null);
    } catch (err) {
      console.error('Image compression failed:', err);
      onNotify?.(`Image upload error: ${err.message}`);
    } finally {
      setImageUploading(false);
    }
  };

  const applyCustomUrl = () => {
    if (!imageModalUrl.trim()) return;
    const cleanUrl = imageModalUrl.trim();
    if (imageModalTarget === 'heroBg') {
      handleUpdateHeroField('backgroundMedia', cleanUrl);
    } else if (imageModalTarget === 'slideImage') {
      handleUpdateSlideField(safeIdx, 'image', cleanUrl);
    }
    setImageModalUrl('');
    setImageModalTarget(null);
    onNotify?.('Image updated from URL');
  };

  const applyPresetImage = (url) => {
    if (imageModalTarget === 'heroBg') {
      handleUpdateHeroField('backgroundMedia', url);
    } else if (imageModalTarget === 'slideImage') {
      handleUpdateSlideField(safeIdx, 'image', url);
    }
    setImageModalTarget(null);
    onNotify?.('Preset image applied');
  };

  // Add new slide
  const handleAddSlide = () => {
    const newSlide = {
      id: `hs_${Date.now()}`,
      title: 'New Sacred Discourse Slide',
      badge: 'Divine Guidance • Dharma',
      desc: 'Enter description text for this hero slide...',
      image: '/images/img_4.jpg',
      status: 'published'
    };
    const updated = [...slides, newSlide];
    updateSection('hero', { slides: updated });
    setActiveSlideIdx(updated.length - 1);
    onNotify?.('Added new hero carousel slide');
  };

  // Remove current slide
  const handleRemoveSlide = (idxToRemove) => {
    if (slides.length <= 1) {
      onNotify?.('Cannot remove the only slide. Please keep at least one slide.');
      return;
    }
    const updated = slides.filter((_, i) => i !== idxToRemove);
    updateSection('hero', { slides: updated });
    setActiveSlideIdx(Math.max(0, idxToRemove - 1));
    onNotify?.(`Removed slide #${idxToRemove + 1}`);
  };

  // Determine current background image to display
  const currentBgImage = activeSlide.image || heroData.backgroundMedia || '/images/img_4.jpg';

  // Current display texts (first slide blends with hero general data if not overridden)
  const currentBadge = activeSlide.badge || heroData.badge || 'A Journey of Devotion, Dharma & Divine Guidance';
  const currentTitle1 = heroData.headingLine1 || activeSlide.title || 'Preserving Heritage,';
  const currentTitle2 = heroData.headingLine2 || 'Inspiring Generations';
  const currentParagraph = activeSlide.desc || heroData.paragraph || 'Welcome to the official spiritual platform...';
  const currentPrimaryBtn = heroData.primaryBtnText || 'Donate Now';
  const currentPrimaryUrl = heroData.primaryBtnUrl || '#donate';
  const currentWatchText = heroData.watchVideoText || 'Watch Video';
  const currentWatchUrl = heroData.watchVideoUrl || 'https://www.youtube.com/live/X0UPcFj_ZNQ';

  return (
    <div className="hero-visual-editor-root" style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      
      {/* ── WordPress / Elementor Visual Control Bar ── */}
      <div style={{
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid #1e293b'
      }}>
        {/* Left: Indicator & Carousel Slide Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#38bdf8',
              display: 'inline-block'
            }} />
            <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#93c5fd' }}>
              Visual Canvas Editor
            </span>
          </div>

          <div style={{ width: '1px', height: '18px', backgroundColor: '#334155' }} />

          {/* Slide Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginRight: '4px' }}>
              Slide:
            </span>
            {slides.map((s, idx) => (
              <button
                key={s.id || idx}
                type="button"
                onClick={() => setActiveSlideIdx(idx)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backgroundColor: activeSlideIdx === idx ? '#0284c7' : '#1e293b',
                  color: activeSlideIdx === idx ? '#ffffff' : '#94a3b8',
                  transition: 'all 0.15s ease'
                }}
              >
                #{idx + 1}
              </button>
            ))}

            <button
              type="button"
              onClick={handleAddSlide}
              title="Add a new slide"
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px dashed #475569',
                backgroundColor: 'transparent',
                color: '#cbd5e1',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Plus size={11} /> Add
            </button>
          </div>
        </div>

        {/* Right: Quick Controls (Play/Pause, Media Replace, Hint) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setAutoPlay(!autoPlay)}
            title={autoPlay ? 'Pause slider rotation to edit comfortably' : 'Play auto-rotation demo'}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid #334155',
              backgroundColor: autoPlay ? '#059669' : '#1e293b',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {autoPlay ? <Pause size={11} /> : <Play size={11} />}
            {autoPlay ? 'Auto-Slide: ON' : 'Auto-Slide: PAUSED'}
          </button>

          <button
            type="button"
            onClick={() => { setImageModalTarget('heroBg'); setImageModalUrl(''); }}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ImageIcon size={12} /> Replace Hero Image
          </button>

          <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
            💡 Click any text or image below to edit
          </span>
        </div>
      </div>

      {/* ── Main Interactive Hero Canvas ── */}
      <div style={{
        position: 'relative',
        minHeight: viewport === 'mobile' ? '680px' : '760px',
        backgroundColor: '#0b231c',
        backgroundImage: `url(${currentBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        transition: 'background-image 0.4s ease',
        overflow: 'hidden'
      }}>
        {/* Dark Vignette & Gradient Overlays matching original HeroSlider */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(11, 35, 28, 0.96) 0%, rgba(11, 35, 28, 0.65) 45%, rgba(11, 35, 28, 0.25) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 15% 75%, rgba(11, 35, 28, 0.85) 0%, rgba(11, 35, 28, 0.3) 60%, rgba(11, 35, 28, 0) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }} />

        {/* Decorative corner artwork */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 'clamp(280px, 35vw, 550px)',
          height: 'clamp(300px, 40vw, 600px)',
          backgroundImage: 'url(/images/layer-2.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom right',
          backgroundSize: 'contain',
          zIndex: 3,
          pointerEvents: 'none',
          opacity: 0.95
        }} />

        {/* Top-Right Floating Slide Image Replacer Badge */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10,
          display: 'flex',
          gap: '8px'
        }}>
          <button
            type="button"
            onClick={() => { setImageModalTarget('slideImage'); setImageModalUrl(''); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '11.5px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.15s ease'
            }}
          >
            <ImageIcon size={13} color="#38bdf8" />
            <span>Change Slide #{safeIdx + 1} Image</span>
          </button>

          {slides.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveSlide(safeIdx)}
              title="Delete this slide"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.85)',
                border: 'none',
                color: '#ffffff',
                padding: '6px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Trash2 size={12} /> Delete Slide
            </button>
          )}
        </div>

        {/* ── Visual Content Blocks (Clickable & Editable) ── */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(28px, 4vw, 55px)',
          left: 'clamp(24px, 4.5vw, 65px)',
          zIndex: 5,
          maxWidth: '680px',
          paddingRight: '20px'
        }}>
          
          {/* 1. BADGE / SUBTITLE */}
          <div
            onClick={() => setActiveField('badge')}
            className="visual-editable-item"
            title="Click to edit badge text"
            style={{
              position: 'relative',
              display: 'inline-block',
              cursor: 'pointer',
              border: '1.5px solid #fc791a',
              borderRadius: '50px',
              padding: '7px 20px',
              color: '#fc791a',
              fontSize: 'clamp(12px, 1.1vw, 13.5px)',
              fontWeight: '700',
              letterSpacing: '0.3px',
              marginBottom: '16px',
              backgroundColor: 'rgba(11, 35, 28, 0.75)',
              backdropFilter: 'blur(5px)',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              {currentBadge}
              <Edit3 size={12} color="#fc791a" style={{ opacity: 0.7 }} />
            </span>
          </div>

          {/* 2. MAIN HEADINGS (Line 1 & Line 2) */}
          <div style={{ position: 'relative', margin: '0 0 16px 0' }}>
            <h1 style={{
              fontSize: 'clamp(32px, 3.8vw, 48px)',
              fontWeight: '800',
              lineHeight: '1.2',
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.3px',
              textShadow: '0 4px 16px rgba(0,0,0,0.65)'
            }}>
              {/* Line 1 */}
              <span
                onClick={() => setActiveField('headingLine1')}
                className="visual-editable-item"
                title="Click to edit Heading Line 1"
                style={{
                  display: 'inline-block',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  padding: '2px 6px',
                  margin: '-2px -6px',
                  transition: 'background-color 0.15s ease'
                }}
              >
                {currentTitle1}
                <Edit3 size={16} color="#38bdf8" style={{ marginLeft: '8px', opacity: 0.6 }} />
              </span>
              <br />
              {/* Line 2 */}
              <span
                onClick={() => setActiveField('headingLine2')}
                className="visual-editable-item"
                title="Click to edit Heading Line 2"
                style={{
                  display: 'inline-block',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  padding: '2px 6px',
                  margin: '-2px -6px',
                  transition: 'background-color 0.15s ease'
                }}
              >
                {currentTitle2}
                <Edit3 size={16} color="#38bdf8" style={{ marginLeft: '8px', opacity: 0.6 }} />
              </span>
            </h1>
          </div>

          {/* 3. SUPPORTING PARAGRAPH */}
          <p
            onClick={() => setActiveField('paragraph')}
            className="visual-editable-item"
            title="Click to edit description text"
            style={{
              fontSize: 'clamp(13.5px, 1.2vw, 15.5px)',
              lineHeight: '1.65',
              color: '#e2e8f0',
              margin: '0 0 28px 0',
              maxWidth: '580px',
              cursor: 'pointer',
              borderRadius: '6px',
              padding: '6px 8px',
              marginRight: '-8px',
              marginLeft: '-8px',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              transition: 'background-color 0.15s ease'
            }}
          >
            {currentParagraph}
            <Edit3 size={13} color="#38bdf8" style={{ marginLeft: '6px', opacity: 0.6 }} />
          </p>

          {/* 4. ACTION BUTTONS ROW */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            
            {/* Primary Action Button ("Donate Now") */}
            <div
              onClick={() => setActiveField('primaryBtn')}
              className="visual-editable-item"
              title="Click to edit Primary Button Text & Destination URL"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#fc791a',
                color: '#ffffff',
                borderRadius: '4px',
                height: '42px',
                padding: '0 22px',
                cursor: 'pointer',
                fontSize: '14.5px',
                fontWeight: '700',
                boxShadow: '0 4px 16px rgba(252, 121, 26, 0.4)',
                border: '1.5px solid rgba(255,255,255,0.2)'
              }}
            >
              <span>{currentPrimaryBtn}</span>
              <Edit3 size={12} color="#ffffff" style={{ opacity: 0.8 }} />
            </div>

            {/* Secondary Action Button ("Watch Video") */}
            <div
              onClick={() => setActiveField('watchVideo')}
              className="visual-editable-item"
              title="Click to edit Secondary Video Button Text & YouTube URL"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(15, 23, 42, 0.4)',
                backdropFilter: 'blur(4px)',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                padding: '8px 16px'
              }}
            >
              <Play size={12} color="#fc791a" />
              <span>{currentWatchText}</span>
              <Edit3 size={12} color="#ffffff" style={{ opacity: 0.8 }} />
            </div>
          </div>

        </div>

        {/* Bottom Slide Indicators Bar */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '30px',
          zIndex: 8,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <button
            type="button"
            onClick={() => setActiveSlideIdx((prev) => (prev - 1 + slides.length) % slides.length)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
            {safeIdx + 1} / {slides.length}
          </span>

          <button
            type="button"
            onClick={() => setActiveSlideIdx((prev) => (prev + 1) % slides.length)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

      </div>

      {/* ── WordPress Floating Quick-Edit Popover Modal ── */}
      {activeField && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div
            className="visual-edit-popover-content"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #cbd5e1',
              overflow: 'hidden'
            }}
          >
            {/* Popover Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 20px',
              backgroundColor: '#0f172a',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={15} color="#38bdf8" />
                <strong style={{ fontSize: '14px' }}>
                  {activeField === 'badge' && 'Edit Badge / Subtitle'}
                  {activeField === 'headingLine1' && 'Edit Main Heading Line 1'}
                  {activeField === 'headingLine2' && 'Edit Main Heading Line 2'}
                  {activeField === 'paragraph' && 'Edit Supporting Paragraph Text'}
                  {activeField === 'primaryBtn' && 'Edit Primary Action Button'}
                  {activeField === 'watchVideo' && 'Edit Secondary Video Button'}
                </strong>
              </div>
              <button
                type="button"
                onClick={() => setActiveField(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
              >
                <X size={18} color="#ffffff" />
              </button>
            </div>

            {/* Popover Form Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Badge Field */}
              {activeField === 'badge' && (
                <div>
                  <label className="admin-label">Hero Badge / Subtitle</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={heroData.badge || ''}
                    onChange={(e) => handleUpdateHeroField('badge', e.target.value)}
                    placeholder="A Journey of Devotion, Dharma & Divine Guidance"
                    autoFocus
                  />
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '6px' }}>
                    Also update current slide #{safeIdx + 1} badge:
                  </div>
                  <input
                    type="text"
                    className="admin-input-control"
                    style={{ marginTop: '4px' }}
                    value={activeSlide.badge || ''}
                    onChange={(e) => handleUpdateSlideField(safeIdx, 'badge', e.target.value)}
                    placeholder="Slide Badge"
                  />
                </div>
              )}

              {/* Heading Line 1 */}
              {activeField === 'headingLine1' && (
                <div>
                  <label className="admin-label">Main Heading Line 1</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={heroData.headingLine1 || ''}
                    onChange={(e) => {
                      handleUpdateHeroField('headingLine1', e.target.value);
                      handleUpdateSlideField(safeIdx, 'title', e.target.value);
                    }}
                    placeholder="Preserving Heritage,"
                    autoFocus
                  />
                </div>
              )}

              {/* Heading Line 2 */}
              {activeField === 'headingLine2' && (
                <div>
                  <label className="admin-label">Main Heading Line 2</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={heroData.headingLine2 || ''}
                    onChange={(e) => handleUpdateHeroField('headingLine2', e.target.value)}
                    placeholder="Inspiring Generations"
                    autoFocus
                  />
                </div>
              )}

              {/* Paragraph */}
              {activeField === 'paragraph' && (
                <div>
                  <label className="admin-label">Supporting Paragraph Text</label>
                  <textarea
                    rows={4}
                    className="admin-textarea-control"
                    value={heroData.paragraph || ''}
                    onChange={(e) => {
                      handleUpdateHeroField('paragraph', e.target.value);
                      handleUpdateSlideField(safeIdx, 'desc', e.target.value);
                    }}
                    placeholder="Welcome to the official spiritual platform..."
                    autoFocus
                  />
                </div>
              )}

              {/* Primary Action Button */}
              {activeField === 'primaryBtn' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label className="admin-label">Primary Button Text</label>
                    <input
                      type="text"
                      className="admin-input-control"
                      value={heroData.primaryBtnText || ''}
                      onChange={(e) => handleUpdateHeroField('primaryBtnText', e.target.value)}
                      placeholder="Donate Now"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="admin-label">Button Target Destination URL</label>
                    <input
                      type="text"
                      className="admin-input-control"
                      value={heroData.primaryBtnUrl || ''}
                      onChange={(e) => handleUpdateHeroField('primaryBtnUrl', e.target.value)}
                      placeholder="#donate or /donate"
                    />
                  </div>
                </div>
              )}

              {/* Watch Video Button */}
              {activeField === 'watchVideo' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label className="admin-label">Secondary Button Text</label>
                    <input
                      type="text"
                      className="admin-input-control"
                      value={heroData.watchVideoText || ''}
                      onChange={(e) => handleUpdateHeroField('watchVideoText', e.target.value)}
                      placeholder="Watch Video"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="admin-label">Video Destination / YouTube URL</label>
                    <input
                      type="text"
                      className="admin-input-control"
                      value={heroData.watchVideoUrl || ''}
                      onChange={(e) => handleUpdateHeroField('watchVideoUrl', e.target.value)}
                      placeholder="https://www.youtube.com/live/..."
                    />
                  </div>
                </div>
              )}

              {/* Done button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="button"
                  className="admin-btn-primary"
                  onClick={() => setActiveField(null)}
                  style={{ backgroundColor: '#0284c7', borderColor: '#0284c7', padding: '8px 20px' }}
                >
                  <Check size={14} /> Done Editing
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── WordPress Image Replace Modal ── */}
      {imageModalTarget && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(3px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div
            className="visual-edit-popover-content"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '560px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #cbd5e1',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 20px',
              backgroundColor: '#0f172a',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={16} color="#38bdf8" />
                <strong style={{ fontSize: '14px' }}>
                  {imageModalTarget === 'heroBg' ? 'Update Hero Background Media' : `Update Slide #${safeIdx + 1} Image`}
                </strong>
              </div>
              <button
                type="button"
                onClick={() => setImageModalTarget(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
              >
                <X size={18} color="#ffffff" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              padding: '4px 12px 0'
            }}>
              <button
                type="button"
                onClick={() => setImageModalTab('upload')}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  borderBottom: imageModalTab === 'upload' ? '2px solid #0284c7' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: imageModalTab === 'upload' ? '#0284c7' : '#64748b',
                  fontWeight: '700',
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                <Upload size={13} style={{ display: 'inline', marginRight: '6px' }} /> Upload New Image
              </button>
              <button
                type="button"
                onClick={() => setImageModalTab('url')}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  borderBottom: imageModalTab === 'url' ? '2px solid #0284c7' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: imageModalTab === 'url' ? '#0284c7' : '#64748b',
                  fontWeight: '700',
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                <Link2 size={13} style={{ display: 'inline', marginRight: '6px' }} /> Enter URL
              </button>
              <button
                type="button"
                onClick={() => setImageModalTab('presets')}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  borderBottom: imageModalTab === 'presets' ? '2px solid #0284c7' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: imageModalTab === 'presets' ? '#0284c7' : '#64748b',
                  fontWeight: '700',
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={13} style={{ display: 'inline', marginRight: '6px' }} /> Choose Preset
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              
              {/* Tab 1: Upload */}
              {imageModalTab === 'upload' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                        e.target.value = '';
                      }
                    }}
                  />

                  <div
                    onClick={() => !imageUploading && fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #cbd5e1',
                      borderRadius: '12px',
                      padding: '36px 20px',
                      textAlign: 'center',
                      backgroundColor: '#f8fafc',
                      cursor: imageUploading ? 'wait' : 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {imageUploading ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <div className="admin-spinner" style={{ width: '28px', height: '28px' }} />
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                          Optimizing &amp; Compressing Image...
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <Upload size={32} color="#0284c7" />
                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>
                          Click to browse or drop replacement image
                        </strong>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          Supports JPG, PNG, WebP (Auto-compressed to ultra-fast WebP)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: URL */}
              {imageModalTab === 'url' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label className="admin-label">Image or Video URL</label>
                    <input
                      type="url"
                      className="admin-input-control"
                      value={imageModalUrl}
                      onChange={(e) => setImageModalUrl(e.target.value)}
                      placeholder="https://example.com/banner.jpg or /images/img_4.jpg"
                      autoFocus
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => setImageModalTarget(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="admin-btn-primary"
                      onClick={applyCustomUrl}
                      disabled={!imageModalUrl.trim()}
                    >
                      Apply Image URL
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Presets */}
              {imageModalTab === 'presets' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {HERO_PRESET_IMAGES.map((preset) => (
                    <div
                      key={preset.url}
                      onClick={() => applyPresetImage(preset.url)}
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ height: '80px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                        <img
                          src={preset.url}
                          alt={preset.label}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ padding: '6px 8px', fontSize: '11px', fontWeight: '600', color: '#0f172a' }}>
                        {preset.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
