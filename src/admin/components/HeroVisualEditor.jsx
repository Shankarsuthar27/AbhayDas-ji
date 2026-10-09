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
  Sparkles,
  MoreHorizontal,
  ChevronDown
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
  onNotify,
  activeSlideIdx: propSlideIdx,
  setActiveSlideIdx: propSetSlideIdx
}) {
  const heroData = formData?.hero || {};
  const slides = heroData?.slides && heroData.slides.length > 0 ? heroData.slides : [
    {
      id: 'hs1',
      title: heroData.headingLine1 || 'Preserving Heritage, Inspiring Generations',
      badge: heroData.badge || 'Divine guidance · Dharma',
      desc: heroData.paragraph || 'Celebrating timeless wisdom, culture, and community for generations to come.',
      image: heroData.backgroundMedia || '/images/img_4.jpg',
      status: 'published'
    }
  ];

  // Active slide state (synced with parent or local)
  const [localSlideIdx, setLocalSlideIdx] = useState(0);
  const activeSlideIdx = propSlideIdx !== undefined ? propSlideIdx : localSlideIdx;
  const setActiveSlideIdx = propSetSlideIdx || setLocalSlideIdx;
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

  // Listen for external trigger from workspace top bar
  useEffect(() => {
    const handleTriggerReplace = () => {
      setImageModalTarget('slideImage');
      setImageModalUrl('');
    };
    window.addEventListener('cms-replace-hero-image', handleTriggerReplace);
    return () => window.removeEventListener('cms-replace-hero-image', handleTriggerReplace);
  }, []);

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
      


      {/* ── Main Interactive Hero Canvas (Exact Match to Screenshot) ── */}
      <article className="hero-canvas">
        <img
          alt="Hero background"
          className="hero-image"
          src={currentBgImage}
        />
        <div className="hero-shade" />
        <div className="color-ribbon ribbon-one" />
        <div className="color-ribbon ribbon-two" />

        <div className="canvas-tools">
          <span className="editing-pill">
            <Sparkles size={13} />
            Editing
          </span>
          <button
            type="button"
            className="canvas-more"
            onClick={() => { setImageModalTarget('slideImage'); setImageModalUrl(''); }}
            title="Slide Options / Change Image"
          >
            <MoreHorizontal size={17} />
          </button>
        </div>

        <div className="hero-content">
          <button
            type="button"
            className="editable-kicker"
            onClick={() => setActiveField('badge')}
          >
            {currentBadge || 'Divine guidance · Dharma'}
            <Edit3 size={12} />
          </button>
          <h2 onClick={() => setActiveField('headingLine1')}>
            {currentTitle1 || 'Preserving Heritage,'}
            <br />
            {currentTitle2 || 'Inspiring Generations'}
          </h2>
          <p onClick={() => setActiveField('paragraph')}>
            {currentParagraph || 'Celebrating timeless wisdom, culture, and community for generations to come.'}
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="donate-button"
              onClick={() => setActiveField('primaryBtn')}
            >
              {currentPrimaryBtn || 'Donate now'}
              <Edit3 size={13} />
            </button>
            <button
              type="button"
              className="watch-button"
              onClick={() => setActiveField('watchVideo')}
            >
              <Play size={13} />
              {currentWatchText || 'Watch video'}
            </button>
          </div>
        </div>

        <div className="slide-count">{safeIdx + 1} / {slides.length}</div>
        <div className="swipe-hint">
          <span />
          <span className="active" />
          <span />
        </div>
      </article>

      <button
        type="button"
        className="settings-row"
        onClick={() => setActiveField('headingLine1')}
      >
        <span>
          <Edit3 size={17} />
          Edit hero content
        </span>
        <ChevronDown size={17} />
      </button>

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
