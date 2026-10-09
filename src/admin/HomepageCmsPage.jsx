import React, { useState, useEffect, useRef } from 'react';
import { useCms } from '../context/CmsContext';
import CmsImageUploader from './components/CmsImageUploader';
import CmsSectionPreview from './components/CmsSectionPreview';
import { compressImage } from './utils/helpers';
import {
  Sliders,
  Image as ImageIcon,
  Heart,
  Video,
  Calendar,
  Newspaper,
  Users,
  PhoneCall,
  Layout,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  Link2,
  UploadCloud,
  Monitor,
  Tablet,
  Smartphone,
  X
} from 'lucide-react';
import './Admin.css';

// Section Navigation Tab Definitions
const CMS_SECTIONS = [
  { id: 'hero', label: 'Hero Section', shortLabel: 'Hero', icon: Sliders, badge: 'Main Banner' },
  { id: 'about', label: 'Brief Introduction', shortLabel: 'Introduction', icon: Layout, badge: 'About Us' },
  { id: 'kathas', label: 'Spiritual Katha', shortLabel: 'Spiritual Katha', icon: Sparkles, badge: 'Katha Cards' },
  { id: 'donations', label: 'Donation Section', shortLabel: 'Donation', icon: Heart, badge: 'Campaigns' },
  { id: 'gallery', label: 'Gallery Section', shortLabel: 'Gallery', icon: ImageIcon, badge: 'Photos' },
  { id: 'recentKatha', label: 'Recent Katha (Videos)', shortLabel: 'Recent Katha', icon: Video, badge: 'Media Cards' },
  { id: 'testimonials', label: 'Testimonials / Team', shortLabel: 'Testimonials', icon: Users, badge: 'Reviews' },
  { id: 'contact', label: 'Contact CTA Banner', shortLabel: 'Contact', icon: PhoneCall, badge: 'Orange Strip' },
  { id: 'footer', label: 'Footer Settings', shortLabel: 'Footer', icon: Layout, badge: 'Links & Social' }
];

export default function HomepageCmsPage() {
  const { cms, saveCms, resetDefaults, loading } = useCms();
  const [activeSection, setActiveSection] = useState('hero');
  const [formData, setFormData] = useState(cms);
  const [saving, setSaving] = useState(false);
  const [published, setPublished] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [dirty, setDirty] = useState(false);
  const [viewMode, setViewMode] = useState('preview'); // Default full-width visual canvas editor (same to same like Hero)
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [fullPagePreviewOpen, setFullPagePreviewOpen] = useState(false);

  const currentSecMeta = CMS_SECTIONS.find(s => s.id === activeSection) || CMS_SECTIONS[0];

  const handleAddHeroSlide = () => {
    setDirty(true);
    const existingSlides = formData.hero?.slides || [];
    const newSlide = {
      id: `hs_${Date.now()}`,
      title: 'Preserving Heritage, Inspiring Generations',
      badge: 'Divine guidance · Dharma',
      desc: 'Celebrating timeless wisdom, culture, and community for generations to come.',
      image: '/images/img_4.jpg',
      status: 'published'
    };
    updateSection('hero', { slides: [...existingSlides, newSlide] });
    setActiveHeroSlide(existingSlides.length);
    showToast('success', `Added Slide #${existingSlides.length + 1}`);
  };

  // Sync formData with incoming CMS data on load or external sync
  useEffect(() => {
    if (cms && !dirty) {
      setFormData(cms);
    }
  }, [cms, dirty]);

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  // Helper to update deeply nested section data
  const updateSection = (sectionKey, updates) => {
    setDirty(true);
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        ...updates
      }
    }));
  };

  // Bulk Gallery Upload Handler
  const bulkGalleryInputRef = useRef(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const handleBulkGalleryUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setBulkProcessing(true);
    setDirty(true);
    try {
      const newItems = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        try {
          const dataUrl = await compressImage(file, { maxWidth: 1280, maxHeight: 850, quality: 0.82 });
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          newItems.push({
            id: `g_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
            src: dataUrl,
            url: dataUrl,
            title: cleanName || `Sacred Photo ${(formData.gallery.images || []).length + i + 1}`,
            status: 'published'
          });
        } catch (err) {
          console.warn('Error compressing gallery file:', file.name, err);
        }
      }
      if (newItems.length > 0) {
        setFormData((prev) => ({
          ...prev,
          gallery: {
            ...prev.gallery,
            images: [...(prev.gallery.images || []), ...newItems]
          }
        }));
        showToast('success', `Added ${newItems.length} photos to gallery! Click "Publish Changes" to save live.`);
      }
    } finally {
      setBulkProcessing(false);
      if (e.target) e.target.value = '';
    }
  };

  // Save All Changes to Firestore and LocalStorage
  const handleSave = async () => {
    setSaving(true);
    try {
      await saveCms(formData);
      setDirty(false);
      setPublished(true);
      setTimeout(() => setPublished(false), 2400);
      showToast('success', 'All homepage changes saved and published live!');
    } catch (err) {
      console.error('Save failed:', err);
      showToast('error', `Failed to save changes: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Reset to Factory Defaults
  const handleReset = async () => {
    const confirmReset = window.confirm(
      'Are you sure you want to restore factory default homepage content? This will reset all sections.'
    );
    if (!confirmReset) return;

    setSaving(true);
    try {
      await resetDefaults();
      setDirty(false);
      showToast('success', 'Homepage content restored to defaults!');
    } catch (err) {
      showToast('error', `Reset failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Generic List Operations
  const moveItem = (listKey, parentKey, index, direction) => {
    setDirty(true);
    setFormData((prev) => {
      const list = [...prev[parentKey][listKey]];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return {
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [listKey]: list
        }
      };
    });
  };

  const removeItem = (listKey, parentKey, index) => {
    setDirty(true);
    setFormData((prev) => {
      const list = prev[parentKey][listKey].filter((_, idx) => idx !== index);
      return {
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [listKey]: list
        }
      };
    });
  };

  const toggleStatus = (listKey, parentKey, index) => {
    setDirty(true);
    setFormData((prev) => {
      const list = [...prev[parentKey][listKey]];
      const current = list[index].status || 'published';
      list[index] = {
        ...list[index],
        status: current === 'published' ? 'draft' : 'published'
      };
      return {
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [listKey]: list
        }
      };
    });
  };

  if (loading) {
    return (
      <div className="admin-loading-indicator">
        <div className="admin-spinner" />
        <span>Loading Homepage CMS...</span>
      </div>
    );
  }

  return (
    <div className="admin-page-container" style={{ paddingBottom: '96px' }}>
      {/* Exact Page Head from Screenshot */}
      <section className="page-head">
        <div className="eyebrow">HOMEPAGE CMS</div>
        <div className="title-row">
          <div>
            <h1>Live Editor</h1>
            <p>Configure every element on your homepage.</p>
          </div>
          <button
            type="button"
            className="preview-button"
            onClick={() => setFullPagePreviewOpen(true)}
          >
            <Eye size={16} />
            Preview
          </button>
        </div>
      </section>

      {/* Exact Horizontal Section Nav from Screenshot */}
      <nav className="section-nav" aria-label="Homepage sections">
        {CMS_SECTIONS.map((sec, idx) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              className={`section-chip ${isActive ? 'active' : ''}`}
              onClick={() => setActiveSection(sec.id)}
            >
              <span>{String(idx + 1).padStart(2, '0')}</span>
              {sec.shortLabel || sec.label.replace(' Section', '').replace(' Settings', '')}
            </button>
          );
        })}
      </nav>

      {/* Feedback Alert if any */}
      {feedback.message && (
        <div className={`admin-alert ${feedback.type}`} style={{ margin: '0 14px 14px' }} role="alert">
          {feedback.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Workspace Card (Exact Match to Screenshot) */}
      <section className="workspace">
        <div className="workspace-top">
          <div className="canvas-title">
            <span className="live-pulse" />
            Visual canvas
          </div>
          <div className="synced">
            <CheckCircle2 size={13} />
            Draft synced
          </div>
        </div>

        <div className="mode-row">
          <div className="device-switch">
            <button
              type="button"
              className={`device-option ${viewport === 'desktop' ? 'active' : ''}`}
              onClick={() => setViewport('desktop')}
              title="Desktop View"
            >
              <Monitor size={15} />
            </button>
            <button
              type="button"
              className={`device-option ${viewport === 'mobile' ? 'active' : ''}`}
              onClick={() => setViewport('mobile')}
              title="Mobile View"
            >
              <Smartphone size={15} />
              Mobile
            </button>
          </div>

          <button
            type="button"
            className="replace-button"
            onClick={() => {
              if (activeSection === 'hero') {
                window.dispatchEvent(new CustomEvent('cms-replace-hero-image'));
              } else {
                showToast('info', 'Click on any image inside the canvas to edit or replace.');
              }
            }}
          >
            <ImageIcon size={15} />
            Replace
          </button>
        </div>

        {activeSection === 'hero' && (
          <div className="slide-tabs">
            <span>Slide</span>
            {(formData.hero?.slides || [0, 1, 2, 3]).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`slide-tab ${activeHeroSlide === idx ? 'active' : ''}`}
                onClick={() => setActiveHeroSlide(idx)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              type="button"
              className="add-tab"
              onClick={handleAddHeroSlide}
            >
              + Add
            </button>
          </div>
        )}

        {/* Live Interactive Visual Canvas directly in Workspace */}
        <div className="workspace-canvas-body">
          <CmsSectionPreview
            sectionId={activeSection}
            formData={formData}
            updateSection={updateSection}
            viewport={viewport}
            activeSlideIdx={activeHeroSlide}
            setActiveSlideIdx={setActiveHeroSlide}
            onNotify={(msg) => showToast('info', msg)}
          />
        </div>
      </section>

          {/* Main Content Layout Container */}
          <div
            className={viewMode === 'split' && activeSection !== 'hero' ? 'cms-split-grid' : ''}
            style={{
              display: viewMode === 'split' && activeSection !== 'hero' ? 'grid' : 'flex',
              flexDirection: 'column',
              gap: '24px',
              alignItems: 'start'
            }}
          >
            {/* Form Column - Hidden for Hero section since it uses the full interactive visual canvas */}
            {activeSection !== 'hero' && (
              <div
                style={{
                  display: viewMode === 'preview' ? 'none' : 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  minWidth: 0,
                  width: '100%'
                }}
              >

          {/* ========================================================================= */}
          {/* SECTION 2: BRIEF INTRODUCTION SECTION                                     */}
          {/* ========================================================================= */}
          {activeSection === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">2. Brief Introduction Section</h2>
                <p className="admin-page-desc">Configure the introductory about block, portrait images, and biography text.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Section Label</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.about.sectionLabel}
                    onChange={(e) => updateSection('about', { sectionLabel: e.target.value })}
                    placeholder="About Us"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Main Heading</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.about.mainHeading}
                    onChange={(e) => updateSection('about', { mainHeading: e.target.value })}
                    placeholder="Brief Introduction"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Descriptive Paragraph Text</label>
                <textarea
                  rows={5}
                  className="admin-textarea-control"
                  value={formData.about.paragraph}
                  onChange={(e) => updateSection('about', { paragraph: e.target.value })}
                  placeholder="Pujya Abhaydas Ji Maharaj Shri is a spiritual guru..."
                />
              </div>

              {/* Two Image Uploaders */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <CmsImageUploader
                  label="Artwork Image (Top / Background Card)"
                  value={formData.about.artworkImage}
                  onChange={(url) => updateSection('about', { artworkImage: url })}
                  maxSizeMB={5}
                />
                <CmsImageUploader
                  label="Portrait Image (Maharaj Ji Photo Card)"
                  value={formData.about.portraitImage}
                  onChange={(url) => updateSection('about', { portraitImage: url })}
                  maxSizeMB={5}
                />
              </div>

              {/* Button & Video URL */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">"Read More" Button Text &amp; Destination</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.about.readMoreButtonText}
                    onChange={(e) => updateSection('about', { readMoreButtonText: e.target.value })}
                    placeholder="Read More"
                  />
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.about.readMoreButtonUrl}
                    onChange={(e) => updateSection('about', { readMoreButtonUrl: e.target.value })}
                    placeholder="/about"
                    style={{ marginTop: '6px' }}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Floating Play Video URL</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.about.videoUrl}
                    onChange={(e) => updateSection('about', { videoUrl: e.target.value })}
                    placeholder="YouTube Video Link"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 3: SPIRITUAL KATHA (CAROUSEL / GRID)                             */}
          {/* ========================================================================= */}
          {activeSection === 'kathas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">3. Spiritual Katha (Carousel / Grid)</h2>
                <p className="admin-page-desc">Manage katha card titles, arch images, links, and publication visibility.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Subheading</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.spiritualKathas.subheading}
                    onChange={(e) => updateSection('spiritualKathas', { subheading: e.target.value })}
                    placeholder="DEVOTIONAL DISCOURSES"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Main Title</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.spiritualKathas.mainTitle}
                    onChange={(e) => updateSection('spiritualKathas', { mainTitle: e.target.value })}
                    placeholder="Spiritual Katha'"
                  />
                </div>
              </div>

              {/* Repeatable Katha Cards Manager */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label className="admin-label" style={{ margin: 0 }}>
                    Katha Cards ({formData.spiritualKathas.items.length})
                  </label>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => {
                      setDirty(true);
                      const newId = `k_${Date.now()}`;
                      setFormData((prev) => ({
                        ...prev,
                        spiritualKathas: {
                          ...prev.spiritualKathas,
                          items: [
                            ...prev.spiritualKathas.items,
                            { id: newId, title: 'New Katha Card', image: '/images/img_11.jpg', link: '/kathas', status: 'published' }
                          ]
                        }
                      }));
                    }}
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                  >
                    <Plus size={13} /> Add Katha Card
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {formData.spiritualKathas.items.map((katha, idx) => (
                    <div
                      key={katha.id}
                      style={{
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                          Card #{idx + 1}: {katha.title}
                        </span>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => toggleStatus('items', 'spiritualKathas', idx)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700',
                              border: 'none',
                              cursor: 'pointer',
                              backgroundColor: katha.status === 'published' ? '#ecfdf5' : '#f1f5f9',
                              color: katha.status === 'published' ? '#059669' : '#64748b'
                            }}
                          >
                            {katha.status === 'published' ? 'Published' : 'Draft'}
                          </button>

                          <button
                            type="button"
                            onClick={() => moveItem('items', 'spiritualKathas', idx, -1)}
                            disabled={idx === 0}
                            style={{ padding: '4px', border: 'none', background: 'none' }}
                          >
                            <ChevronUp size={15} color={idx === 0 ? '#cbd5e1' : '#475569'} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem('items', 'spiritualKathas', idx, 1)}
                            disabled={idx === formData.spiritualKathas.items.length - 1}
                            style={{ padding: '4px', border: 'none', background: 'none' }}
                          >
                            <ChevronDown size={15} color={idx === formData.spiritualKathas.items.length - 1 ? '#cbd5e1' : '#475569'} />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeItem('items', 'spiritualKathas', idx)}
                            style={{ padding: '4px', border: 'none', background: 'none', color: '#ef4444' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="admin-form-group">
                          <label className="admin-label">Katha Title</label>
                          <input
                            type="text"
                            className="admin-input-control"
                            value={katha.title}
                            onChange={(e) => {
                              setDirty(true);
                              const list = [...formData.spiritualKathas.items];
                              list[idx].title = e.target.value;
                              updateSection('spiritualKathas', { items: list });
                            }}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Destination Link</label>
                          <input
                            type="text"
                            className="admin-input-control"
                            value={katha.link}
                            onChange={(e) => {
                              setDirty(true);
                              const list = [...formData.spiritualKathas.items];
                              list[idx].link = e.target.value;
                              updateSection('spiritualKathas', { items: list });
                            }}
                          />
                        </div>
                      </div>

                      <CmsImageUploader
                        label="Katha Arch Poster"
                        value={katha.image}
                        onChange={(url) => {
                          setDirty(true);
                          const list = [...formData.spiritualKathas.items];
                          list[idx].image = url;
                          updateSection('spiritualKathas', { items: list });
                        }}
                        maxSizeMB={5}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 4: DONATION SECTION                                               */}
          {/* ========================================================================= */}
          {activeSection === 'donations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">4. Donation Campaigns Section</h2>
                <p className="admin-page-desc">
                  Manage fundraising campaigns, target goal amounts, raised amounts, and automated progress calculations.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Subheading</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.donations.subheading}
                    onChange={(e) => updateSection('donations', { subheading: e.target.value })}
                    placeholder="HELP THE NEEDY"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Main Title</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.donations.mainTitle}
                    onChange={(e) => updateSection('donations', { mainTitle: e.target.value })}
                    placeholder="Find The Popular Cause And Donate Them"
                  />
                </div>
              </div>

              {/* Repeatable Campaign Cards */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label className="admin-label" style={{ margin: 0 }}>
                    Campaign Cards ({formData.donations.campaigns.length})
                  </label>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => {
                      setDirty(true);
                      const newId = `c_${Date.now()}`;
                      setFormData((prev) => ({
                        ...prev,
                        donations: {
                          ...prev.donations,
                          campaigns: [
                            ...prev.donations.campaigns,
                            {
                              id: newId,
                              title: 'New Donation Cause',
                              image: '/images/img_14.avif',
                              goal: 50000,
                              raised: 0,
                              donateUrl: '#donate',
                              status: 'published'
                            }
                          ]
                        }
                      }));
                    }}
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                  >
                    <Plus size={13} /> Add Campaign
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {formData.donations.campaigns.map((camp, idx) => {
                    const percent = camp.goal > 0 ? Math.min(100, Math.round((camp.raised / camp.goal) * 100)) : 0;

                    return (
                      <div
                        key={camp.id}
                        style={{
                          padding: '18px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                            Campaign #{idx + 1}: {camp.title}
                          </span>

                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {/* Live Calculated Progress Badge */}
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '800',
                              color: '#059669',
                              backgroundColor: '#ecfdf5',
                              padding: '3px 8px',
                              borderRadius: '4px'
                            }}>
                              Progress: {percent}%
                            </span>

                            <button
                              type="button"
                              onClick={() => toggleStatus('campaigns', 'donations', idx)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '700',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: camp.status === 'published' ? '#ecfdf5' : '#f1f5f9',
                                color: camp.status === 'published' ? '#059669' : '#64748b'
                              }}
                            >
                              {camp.status === 'published' ? 'Published' : 'Draft'}
                            </button>

                            <button
                              type="button"
                              onClick={() => moveItem('campaigns', 'donations', idx, -1)}
                              disabled={idx === 0}
                              style={{ padding: '4px', border: 'none', background: 'none' }}
                            >
                              <ChevronUp size={15} color={idx === 0 ? '#cbd5e1' : '#475569'} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItem('campaigns', 'donations', idx, 1)}
                              disabled={idx === formData.donations.campaigns.length - 1}
                              style={{ padding: '4px', border: 'none', background: 'none' }}
                            >
                              <ChevronDown size={15} color={idx === formData.donations.campaigns.length - 1 ? '#cbd5e1' : '#475569'} />
                            </button>

                            <button
                              type="button"
                              onClick={() => removeItem('campaigns', 'donations', idx)}
                              style={{ padding: '4px', border: 'none', background: 'none', color: '#ef4444' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="admin-form-group">
                          <label className="admin-label">Campaign Title</label>
                          <input
                            type="text"
                            className="admin-input-control"
                            value={camp.title}
                            onChange={(e) => {
                              setDirty(true);
                              const list = [...formData.donations.campaigns];
                              list[idx].title = e.target.value;
                              updateSection('donations', { campaigns: list });
                            }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                          <div className="admin-form-group">
                            <label className="admin-label">Raised Amount (₹ Numeric)</label>
                            <input
                              type="number"
                              className="admin-input-control"
                              value={camp.raised}
                              onChange={(e) => {
                                setDirty(true);
                                const list = [...formData.donations.campaigns];
                                list[idx].raised = Number(e.target.value) || 0;
                                updateSection('donations', { campaigns: list });
                              }}
                            />
                          </div>

                          <div className="admin-form-group">
                            <label className="admin-label">Target Goal Amount (₹ Numeric)</label>
                            <input
                              type="number"
                              className="admin-input-control"
                              value={camp.goal}
                              onChange={(e) => {
                                setDirty(true);
                                const list = [...formData.donations.campaigns];
                                list[idx].goal = Number(e.target.value) || 0;
                                updateSection('donations', { campaigns: list });
                              }}
                            />
                          </div>

                          <div className="admin-form-group">
                            <label className="admin-label">"Donate Now" URL Destination</label>
                            <input
                              type="text"
                              className="admin-input-control"
                              value={camp.donateUrl}
                              onChange={(e) => {
                                setDirty(true);
                                const list = [...formData.donations.campaigns];
                                list[idx].donateUrl = e.target.value;
                                updateSection('donations', { campaigns: list });
                              }}
                            />
                          </div>
                        </div>

                        <CmsImageUploader
                          label="Campaign Cover Image"
                          value={camp.image}
                          onChange={(url) => {
                            setDirty(true);
                            const list = [...formData.donations.campaigns];
                            list[idx].image = url;
                            updateSection('donations', { campaigns: list });
                          }}
                          maxSizeMB={5}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 5: GALLERY SECTION                                                */}
          {/* ========================================================================= */}
          {activeSection === 'gallery' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">5. Gallery Section</h2>
                <p className="admin-page-desc">Manage the center-aligned heading, photo gallery grid, and view more button.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Center-Aligned Heading</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.gallery.heading}
                    onChange={(e) => updateSection('gallery', { heading: e.target.value })}
                    placeholder="Shrimad Bhagwad Katha * Ram Katha"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">"View More" Button Link</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.gallery.viewMoreUrl}
                    onChange={(e) => updateSection('gallery', { viewMoreUrl: e.target.value })}
                    placeholder="/gallery"
                  />
                </div>
              </div>

              {/* Media Grid & Bulk Upload Manager */}
              <div>
                {/* Bulk Image Uploader Dropzone */}
                <div
                  style={{
                    padding: '24px 20px',
                    backgroundColor: '#f8fafc',
                    border: '2px dashed #93c5fd',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginBottom: '20px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                  onClick={() => bulkGalleryInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleBulkGalleryUpload({ target: { files: e.dataTransfer.files } });
                    }
                  }}
                >
                  <input
                    ref={bulkGalleryInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleBulkGalleryUpload}
                  />
                  <UploadCloud size={36} color="#0284c7" style={{ margin: '0 auto 10px', display: 'block' }} />
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                    {bulkProcessing ? 'Processing & Optimizing Photos...' : 'Bulk Upload Multiple Photos (Drag & Drop or Click to Browse)'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '6px' }}>
                    Select multiple JPG, PNG, or WebP images to automatically upload and add them to this section.
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <label className="admin-label" style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>
                    Gallery Photos ({formData.gallery.images.length})
                  </label>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => {
                      setDirty(true);
                      const newId = `g_${Date.now()}`;
                      setFormData((prev) => ({
                        ...prev,
                        gallery: {
                          ...prev.gallery,
                          images: [
                            ...prev.gallery.images,
                            { id: newId, src: '/images/img_17.jpg', url: '/images/img_17.jpg', title: 'New Photo', status: 'published' }
                          ]
                        }
                      }));
                    }}
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    <Plus size={14} /> Add Single Photo Card
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px'
                }}>
                  {formData.gallery.images.map((img, idx) => (
                    <div
                      key={img.id || idx}
                      style={{
                        padding: '14px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>
                          Photo #{idx + 1}
                        </span>

                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => toggleStatus('images', 'gallery', idx)}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '700',
                              border: 'none',
                              cursor: 'pointer',
                              backgroundColor: img.status === 'published' ? '#ecfdf5' : '#f1f5f9',
                              color: img.status === 'published' ? '#059669' : '#64748b'
                            }}
                          >
                            {img.status === 'published' ? 'Published' : 'Draft'}
                          </button>

                          <button
                            type="button"
                            onClick={() => moveItem('images', 'gallery', idx, -1)}
                            disabled={idx === 0}
                            style={{ padding: '2px', border: 'none', background: 'none' }}
                            title="Move Left/Up"
                          >
                            <ChevronUp size={15} color={idx === 0 ? '#cbd5e1' : '#475569'} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem('images', 'gallery', idx, 1)}
                            disabled={idx === formData.gallery.images.length - 1}
                            style={{ padding: '2px', border: 'none', background: 'none' }}
                            title="Move Right/Down"
                          >
                            <ChevronDown size={15} color={idx === formData.gallery.images.length - 1 ? '#cbd5e1' : '#475569'} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem('images', 'gallery', idx)}
                            style={{ padding: '2px', border: 'none', background: 'none', color: '#ef4444' }}
                            title="Delete Photo"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Photo Image Uploader with Preview & Replace */}
                      <CmsImageUploader
                        label="Photo Image"
                        value={img.src || img.url}
                        onChange={(url) => {
                          setDirty(true);
                          const list = [...formData.gallery.images];
                          list[idx].src = url;
                          list[idx].url = url;
                          updateSection('gallery', { images: list });
                        }}
                        maxSizeMB={5}
                      />

                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label" style={{ fontSize: '11.5px', marginBottom: '3px' }}>
                          Photo Title / Description
                        </label>
                        <input
                          type="text"
                          value={img.title || ''}
                          onChange={(e) => {
                            setDirty(true);
                            const list = [...formData.gallery.images];
                            list[idx].title = e.target.value;
                            updateSection('gallery', { images: list });
                          }}
                          placeholder="Photo Title"
                          className="admin-input-control"
                          style={{ fontSize: '12.5px', padding: '6px 10px' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 6: RECENT KATHA (VIDEOS)                                         */}
          {/* ========================================================================= */}
          {activeSection === 'recentKatha' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">6. Recent Katha (Video &amp; Audio Cards)</h2>
                <p className="admin-page-desc">Manage repeatable video cards with thumbnails, timestamps, and streaming links.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Section Title</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.recentKatha.title}
                    onChange={(e) => updateSection('recentKatha', { title: e.target.value })}
                    placeholder="Recent Katha"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">"View All" Button Destination</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.recentKatha.viewAllUrl}
                    onChange={(e) => updateSection('recentKatha', { viewAllUrl: e.target.value })}
                    placeholder="/kathas"
                  />
                </div>
              </div>

              {/* Repeatable Video Cards Manager */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label className="admin-label" style={{ margin: 0 }}>
                    Media Cards ({formData.recentKatha.mediaCards.length})
                  </label>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => {
                      setDirty(true);
                      const newId = `rk_${Date.now()}`;
                      setFormData((prev) => ({
                        ...prev,
                        recentKatha: {
                          ...prev.recentKatha,
                          mediaCards: [
                            ...prev.recentKatha.mediaCards,
                            {
                              id: newId,
                              title: 'New Katha Video',
                              thumbnail: '/images/img_25.jpg',
                              dateText: '10:00 / 1:30:00',
                              mediaUrl: 'https://youtube.com',
                              status: 'published'
                            }
                          ]
                        }
                      }));
                    }}
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                  >
                    <Plus size={13} /> Add Video Card
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {formData.recentKatha.mediaCards.map((card, idx) => (
                    <div
                      key={card.id}
                      style={{
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                          Video #{idx + 1}: {card.title}
                        </span>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => toggleStatus('mediaCards', 'recentKatha', idx)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700',
                              border: 'none',
                              cursor: 'pointer',
                              backgroundColor: card.status === 'published' ? '#ecfdf5' : '#f1f5f9',
                              color: card.status === 'published' ? '#059669' : '#64748b'
                            }}
                          >
                            {card.status === 'published' ? 'Published' : 'Draft'}
                          </button>

                          <button
                            type="button"
                            onClick={() => moveItem('mediaCards', 'recentKatha', idx, -1)}
                            disabled={idx === 0}
                            style={{ padding: '4px', border: 'none', background: 'none' }}
                          >
                            <ChevronUp size={15} color={idx === 0 ? '#cbd5e1' : '#475569'} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem('mediaCards', 'recentKatha', idx, 1)}
                            disabled={idx === formData.recentKatha.mediaCards.length - 1}
                            style={{ padding: '4px', border: 'none', background: 'none' }}
                          >
                            <ChevronDown size={15} color={idx === formData.recentKatha.mediaCards.length - 1 ? '#cbd5e1' : '#475569'} />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeItem('mediaCards', 'recentKatha', idx)}
                            style={{ padding: '4px', border: 'none', background: 'none', color: '#ef4444' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                        <div className="admin-form-group">
                          <label className="admin-label">Video Title</label>
                          <input
                            type="text"
                            className="admin-input-control"
                            value={card.title}
                            onChange={(e) => {
                              setDirty(true);
                              const list = [...formData.recentKatha.mediaCards];
                              list[idx].title = e.target.value;
                              updateSection('recentKatha', { mediaCards: list });
                            }}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Date / Duration Timestamp</label>
                          <input
                            type="text"
                            className="admin-input-control"
                            value={card.dateText}
                            onChange={(e) => {
                              setDirty(true);
                              const list = [...formData.recentKatha.mediaCards];
                              list[idx].dateText = e.target.value;
                              updateSection('recentKatha', { mediaCards: list });
                            }}
                            placeholder="9:41 / 2:56:26"
                          />
                        </div>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">YouTube or Media Video URL</label>
                        <input
                          type="text"
                          className="admin-input-control"
                          value={card.mediaUrl}
                          onChange={(e) => {
                            setDirty(true);
                            const list = [...formData.recentKatha.mediaCards];
                            list[idx].mediaUrl = e.target.value;
                            updateSection('recentKatha', { mediaCards: list });
                          }}
                        />
                      </div>

                      <CmsImageUploader
                        label="Video Thumbnail Image"
                        value={card.thumbnail}
                        onChange={(url) => {
                          setDirty(true);
                          const list = [...formData.recentKatha.mediaCards];
                          list[idx].thumbnail = url;
                          updateSection('recentKatha', { mediaCards: list });
                        }}
                        maxSizeMB={5}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}


          {/* ========================================================================= */}
          {/* SECTION 7: TESTIMONIALS / SUCCESS STORIES                                */}
          {/* ========================================================================= */}
          {activeSection === 'testimonials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">7. Testimonials / Success Stories Section</h2>
                <p className="admin-page-desc">Manage reviews and management team stories behind Maharaj Ji's mission.</p>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Section Heading</label>
                <input
                  type="text"
                  className="admin-input-control"
                  value={formData.testimonials.title}
                  onChange={(e) => updateSection('testimonials', { title: e.target.value })}
                  placeholder="Meet the team behind their success story"
                />
              </div>

              {/* Repeatable Reviews / Team Items */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label className="admin-label" style={{ margin: 0 }}>
                    Items ({formData.testimonials.items.length})
                  </label>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => {
                      setDirty(true);
                      const newId = `t_${Date.now()}`;
                      setFormData((prev) => ({
                        ...prev,
                        testimonials: {
                          ...prev.testimonials,
                          items: [
                            ...prev.testimonials.items,
                            {
                              id: newId,
                              name: 'New Person / Reviewer',
                              role: 'Devotee / Coordinator',
                              reviewText: 'Review or description of contribution...',
                              avatar: '',
                              status: 'published'
                            }
                          ]
                        }
                      }));
                    }}
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                  >
                    <Plus size={13} /> Add Review / Member
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {formData.testimonials.items.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                          #{idx + 1}: {item.name} ({item.role})
                        </span>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => toggleStatus('items', 'testimonials', idx)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700',
                              border: 'none',
                              cursor: 'pointer',
                              backgroundColor: item.status === 'published' ? '#ecfdf5' : '#f1f5f9',
                              color: item.status === 'published' ? '#059669' : '#64748b'
                            }}
                          >
                            {item.status === 'published' ? 'Published' : 'Draft'}
                          </button>

                          <button
                            type="button"
                            onClick={() => moveItem('items', 'testimonials', idx, -1)}
                            disabled={idx === 0}
                            style={{ padding: '4px', border: 'none', background: 'none' }}
                          >
                            <ChevronUp size={15} color={idx === 0 ? '#cbd5e1' : '#475569'} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem('items', 'testimonials', idx, 1)}
                            disabled={idx === formData.testimonials.items.length - 1}
                            style={{ padding: '4px', border: 'none', background: 'none' }}
                          >
                            <ChevronDown size={15} color={idx === formData.testimonials.items.length - 1 ? '#cbd5e1' : '#475569'} />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeItem('items', 'testimonials', idx)}
                            style={{ padding: '4px', border: 'none', background: 'none', color: '#ef4444' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="admin-form-group">
                          <label className="admin-label">Name</label>
                          <input
                            type="text"
                            className="admin-input-control"
                            value={item.name}
                            onChange={(e) => {
                              setDirty(true);
                              const list = [...formData.testimonials.items];
                              list[idx].name = e.target.value;
                              updateSection('testimonials', { items: list });
                            }}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Designation / Role</label>
                          <input
                            type="text"
                            className="admin-input-control"
                            value={item.role}
                            onChange={(e) => {
                              setDirty(true);
                              const list = [...formData.testimonials.items];
                              list[idx].role = e.target.value;
                              updateSection('testimonials', { items: list });
                            }}
                          />
                        </div>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Review / Description Text</label>
                        <textarea
                          rows={2}
                          className="admin-textarea-control"
                          value={item.reviewText}
                          onChange={(e) => {
                            setDirty(true);
                            const list = [...formData.testimonials.items];
                            list[idx].reviewText = e.target.value;
                            updateSection('testimonials', { items: list });
                          }}
                        />
                      </div>

                      <CmsImageUploader
                        label="Optional Avatar Photo"
                        value={item.avatar}
                        onChange={(url) => {
                          setDirty(true);
                          const list = [...formData.testimonials.items];
                          list[idx].avatar = url;
                          updateSection('testimonials', { items: list });
                        }}
                        maxSizeMB={5}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 8: CONTACT CTA BANNER                                            */}
          {/* ========================================================================= */}
          {activeSection === 'contact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">8. Contact CTA Banner (Orange Ribbon)</h2>
                <p className="admin-page-desc">Configure the details shown in the prominent orange contact strip.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Phone Number</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.contactBanner.phone}
                    onChange={(e) => updateSection('contactBanner', { phone: e.target.value })}
                    placeholder="+91 94142 84180"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Email Address</label>
                  <input
                    type="email"
                    className="admin-input-control"
                    value={formData.contactBanner.email}
                    onChange={(e) => updateSection('contactBanner', { email: e.target.value })}
                    placeholder="info@shreeabhaydas.com"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Physical Location</label>
                <input
                  type="text"
                  className="admin-input-control"
                  value={formData.contactBanner.location}
                  onChange={(e) => updateSection('contactBanner', { location: e.target.value })}
                  placeholder="Takhatgarh Dham, Rajasthan, India"
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 9: FOOTER SETTINGS                                               */}
          {/* ========================================================================= */}
          {activeSection === 'footer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">9. Footer Settings</h2>
                <p className="admin-page-desc">
                  Manage footer brand logo, description, link columns, social profiles, and news widget toggle.
                </p>
              </div>

              <CmsImageUploader
                label="Footer Brand Logo"
                value={formData.footer.logo}
                onChange={(url) => updateSection('footer', { logo: url })}
                maxSizeMB={5}
              />

              <div className="admin-form-group">
                <label className="admin-label">Short Organizational Description</label>
                <textarea
                  rows={3}
                  className="admin-textarea-control"
                  value={formData.footer.description}
                  onChange={(e) => updateSection('footer', { description: e.target.value })}
                />
              </div>

              {/* Dynamic Feeds Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                    Show "Latest News" Thumbnail Widget in Footer
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                    Toggle visibility of latest blog cards in the right column of the footer.
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={formData.footer.showNewsWidget !== false}
                  onChange={(e) => updateSection('footer', { showNewsWidget: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              {/* Quick Links List Manager */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label className="admin-label" style={{ margin: 0 }}>
                    Quick Links Column ({(formData.footer.quickLinks || []).length})
                  </label>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => {
                      setDirty(true);
                      const newId = `ql_${Date.now()}`;
                      setFormData((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          quickLinks: [...(prev.footer.quickLinks || []), { id: newId, label: 'New Link', url: '/', status: 'published' }]
                        }
                      }));
                    }}
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                  >
                    <Plus size={13} /> Add Quick Link
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(formData.footer.quickLinks || []).map((item, idx) => (
                    <div
                      key={item.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    >
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', width: '20px' }}>
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          setDirty(true);
                          const list = [...(formData.footer.quickLinks || [])];
                          list[idx].label = e.target.value;
                          updateSection('footer', { quickLinks: list });
                        }}
                        placeholder="Link Label"
                        className="admin-input-control"
                        style={{ flex: 1, padding: '6px 10px' }}
                      />
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => {
                          setDirty(true);
                          const list = [...(formData.footer.quickLinks || [])];
                          list[idx].url = e.target.value;
                          updateSection('footer', { quickLinks: list });
                        }}
                        placeholder="Destination Link"
                        className="admin-input-control"
                        style={{ flex: 1, padding: '6px 10px' }}
                      />

                      {/* Status Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleStatus('quickLinks', 'footer', idx)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: item.status === 'published' ? '#ecfdf5' : '#f1f5f9',
                          color: item.status === 'published' ? '#059669' : '#64748b'
                        }}
                      >
                        {item.status === 'published' ? <Eye size={12} /> : <EyeOff size={12} />}
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </button>

                      {/* Reorder Buttons */}
                      <button
                        type="button"
                        onClick={() => moveItem('quickLinks', 'footer', idx, -1)}
                        disabled={idx === 0}
                        style={{ padding: '4px', border: 'none', background: 'none' }}
                      >
                        <ChevronUp size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem('quickLinks', 'footer', idx, 1)}
                        disabled={idx === (formData.footer.quickLinks || []).length - 1}
                        style={{ padding: '4px', border: 'none', background: 'none' }}
                      >
                        <ChevronDown size={15} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeItem('quickLinks', 'footer', idx)}
                        style={{ padding: '4px', border: 'none', background: 'none', color: '#ef4444' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Our Services List Manager */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label className="admin-label" style={{ margin: 0 }}>
                    Our Services Column ({(formData.footer.ourServices || []).length})
                  </label>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => {
                      setDirty(true);
                      const newId = `os_${Date.now()}`;
                      setFormData((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          ourServices: [...(prev.footer.ourServices || []), { id: newId, label: 'New Service', url: '#donate', status: 'published' }]
                        }
                      }));
                    }}
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                  >
                    <Plus size={13} /> Add Service Link
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(formData.footer.ourServices || []).map((item, idx) => (
                    <div
                      key={item.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    >
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', width: '20px' }}>
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          setDirty(true);
                          const list = [...(formData.footer.ourServices || [])];
                          list[idx].label = e.target.value;
                          updateSection('footer', { ourServices: list });
                        }}
                        placeholder="Service Label"
                        className="admin-input-control"
                        style={{ flex: 1, padding: '6px 10px' }}
                      />
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => {
                          setDirty(true);
                          const list = [...(formData.footer.ourServices || [])];
                          list[idx].url = e.target.value;
                          updateSection('footer', { ourServices: list });
                        }}
                        placeholder="Destination Link"
                        className="admin-input-control"
                        style={{ flex: 1, padding: '6px 10px' }}
                      />

                      {/* Status Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleStatus('ourServices', 'footer', idx)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: item.status === 'published' ? '#ecfdf5' : '#f1f5f9',
                          color: item.status === 'published' ? '#059669' : '#64748b'
                        }}
                      >
                        {item.status === 'published' ? <Eye size={12} /> : <EyeOff size={12} />}
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </button>

                      {/* Reorder Buttons */}
                      <button
                        type="button"
                        onClick={() => moveItem('ourServices', 'footer', idx, -1)}
                        disabled={idx === 0}
                        style={{ padding: '4px', border: 'none', background: 'none' }}
                      >
                        <ChevronUp size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem('ourServices', 'footer', idx, 1)}
                        disabled={idx === (formData.footer.ourServices || []).length - 1}
                        style={{ padding: '4px', border: 'none', background: 'none' }}
                      >
                        <ChevronDown size={15} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeItem('ourServices', 'footer', idx)}
                        style={{ padding: '4px', border: 'none', background: 'none', color: '#ef4444' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <label className="admin-label">Social Media Profile URLs</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.footer.socialLinks.facebook}
                    onChange={(e) => {
                      setDirty(true);
                      setFormData((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          socialLinks: { ...prev.footer.socialLinks, facebook: e.target.value }
                        }
                      }));
                    }}
                    placeholder="Facebook URL"
                  />
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.footer.socialLinks.youtube}
                    onChange={(e) => {
                      setDirty(true);
                      setFormData((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          socialLinks: { ...prev.footer.socialLinks, youtube: e.target.value }
                        }
                      }));
                    }}
                    placeholder="YouTube URL"
                  />
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.footer.socialLinks.instagram}
                    onChange={(e) => {
                      setDirty(true);
                      setFormData((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          socialLinks: { ...prev.footer.socialLinks, instagram: e.target.value }
                        }
                      }));
                    }}
                    placeholder="Instagram URL"
                  />
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.footer.socialLinks.twitter}
                    onChange={(e) => {
                      setDirty(true);
                      setFormData((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          socialLinks: { ...prev.footer.socialLinks, twitter: e.target.value }
                        }
                      }));
                    }}
                    placeholder="Twitter / X URL"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Copyright Disclaimer</label>
                <input
                  type="text"
                  className="admin-input-control"
                  value={formData.footer.copyright}
                  onChange={(e) => updateSection('footer', { copyright: e.target.value })}
                  placeholder="© 2026 Shree Abhaydas Ji Maharaj. All Rights Reserved."
                />
              </div>
            </div>
          )}

          {/* Bottom Sticky Action Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0',
            marginTop: '10px'
          }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              {dirty ? '⚠️ You have unsaved changes.' : '✓ All changes in sync.'}
            </span>

            <button
              type="button"
              className="admin-btn-primary"
              onClick={handleSave}
              disabled={saving}
              style={{ backgroundColor: '#0284c7', borderColor: '#0284c7', padding: '10px 24px' }}
            >
              <Save size={15} /> {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>
      )}
          </div>

  {/* Full Page Live Preview Modal (All 9 Sections) */}
  {fullPagePreviewOpen && (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Modal Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        borderBottom: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="cms-live-pulse-dot" />
          <span style={{ fontSize: '15px', fontWeight: '700' }}>
            Full Homepage Live Preview (All 9 Sections)
          </span>
          <span className="cms-preview-badge">Live Draft Sync</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="cms-viewport-group">
            <button
              type="button"
              className={`cms-viewport-btn ${viewport === 'desktop' ? 'active' : ''}`}
              onClick={() => setViewport('desktop')}
            >
              <Monitor size={12} /> Desktop
            </button>
            <button
              type="button"
              className={`cms-viewport-btn ${viewport === 'tablet' ? 'active' : ''}`}
              onClick={() => setViewport('tablet')}
            >
              <Tablet size={12} /> Tablet
            </button>
            <button
              type="button"
              className={`cms-viewport-btn ${viewport === 'mobile' ? 'active' : ''}`}
              onClick={() => setViewport('mobile')}
            >
              <Smartphone size={12} /> Mobile
            </button>
          </div>

          <button
            type="button"
            onClick={() => setFullPagePreviewOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex'
            }}
            title="Close Full Preview"
          >
            <X size={20} color="#ffffff" />
          </button>
        </div>
      </div>

      {/* Modal Scrollable Body */}
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f1f5f9' }}>
        <CmsSectionPreview
          sectionId="all"
          formData={formData}
          updateSection={updateSection}
          viewport={viewport}
          onNotify={(msg) => showToast('info', msg)}
        />
      </div>
    </div>
  )}

      {/* Fixed bottom bar (Exact match to screenshot) */}
      <div className="bottom-bar">
        <div>
          <div className="changes-label">
            {dirty ? 'Unsaved changes' : 'Draft synced'}
          </div>
          <div className="changes-meta">
            {dirty ? `${currentSecMeta?.shortLabel || currentSecMeta?.label || 'Hero'} section updated` : 'Hero section updated'}
          </div>
        </div>
        <button
          type="button"
          className="publish-button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <div className="admin-spinner-small" style={{ borderColor: '#ffffff', borderTopColor: 'transparent', width: '13px', height: '13px' }} />
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Publish</span>
            </>
          )}
        </button>
      </div>

      {/* Toast Notification */}
      {published && (
        <div className="toast">
          <span>✓</span>
          Changes published
        </div>
      )}
    </div>
  );
}
