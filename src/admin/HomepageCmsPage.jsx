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
  { id: 'hero', label: 'Hero Section', icon: Sliders, badge: 'Main Banner' },
  { id: 'about', label: 'Brief Introduction', icon: Layout, badge: 'About Us' },
  { id: 'kathas', label: 'Spiritual Katha', icon: Sparkles, badge: 'Katha Cards' },
  { id: 'donations', label: 'Donation Section', icon: Heart, badge: 'Campaigns' },
  { id: 'gallery', label: 'Gallery Section', icon: ImageIcon, badge: 'Photos' },
  { id: 'recentKatha', label: 'Recent Katha (Videos)', icon: Video, badge: 'Media Cards' },
  { id: 'events', label: 'Upcoming Events', icon: Calendar, badge: 'Schedules' },
  { id: 'news', label: 'Latest News & Articles', icon: Newspaper, badge: 'Blog Posts' },
  { id: 'testimonials', label: 'Testimonials / Team', icon: Users, badge: 'Reviews' },
  { id: 'contact', label: 'Contact CTA Banner', icon: PhoneCall, badge: 'Orange Strip' },
  { id: 'footer', label: 'Footer Settings', icon: Layout, badge: 'Links & Social' }
];

export default function HomepageCmsPage() {
  const { cms, saveCms, resetDefaults, loading } = useCms();
  const [activeSection, setActiveSection] = useState('hero');
  const [formData, setFormData] = useState(cms);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [dirty, setDirty] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [fullPagePreviewOpen, setFullPagePreviewOpen] = useState(false);

  const currentSecMeta = CMS_SECTIONS.find(s => s.id === activeSection) || CMS_SECTIONS[0];

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
    <div className="admin-page-container">
      {/* Top Banner & Action Controls */}
      <div className="admin-header-row" style={{ alignItems: 'center' }}>
        <div>
          <h1 className="admin-page-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Homepage CMS &amp; Live Editor</span>
            {dirty && (
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                Unsaved Changes
              </span>
            )}
          </h1>
          <p className="admin-page-desc">
            Dynamically configure and edit every element, media asset, navigation link, and card on your homepage.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => window.open('/', '_blank')}
            title="Preview Live Website"
          >
            <ExternalLink size={14} /> Preview Site
          </button>

          <button
            type="button"
            className="admin-btn-secondary"
            onClick={handleReset}
            disabled={saving}
            title="Reset to original template"
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>

          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ backgroundColor: '#0284c7', borderColor: '#0284c7' }}
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Publish Changes'}
          </button>
        </div>
      </div>

      {/* Alert / Feedback message */}
      {feedback.message && (
        <div className={`admin-alert ${feedback.type}`} role="alert">
          {feedback.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main CMS Layout: Left Navigation + Right Editor */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(240px, 280px) 1fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Left Section Navigation Sidebar */}
        <aside style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          position: 'sticky',
          top: '20px'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '800',
            textTransform: 'uppercase',
            color: '#64748b',
            letterSpacing: '0.8px',
            padding: '8px 12px 4px'
          }}>
            Homepage Sections ({CMS_SECTIONS.length})
          </div>

          {CMS_SECTIONS.map((sec, idx) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isActive ? '#0f172a' : 'transparent',
                  color: isActive ? '#ffffff' : '#334155',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '500',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon size={16} style={{ color: isActive ? '#38bdf8' : '#64748b' }} />
                  <span>{sec.label}</span>
                </div>
                <span style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.18)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#64748b',
                  fontWeight: '600'
                }}>
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </aside>

        {/* Right Section Active Editor Panel */}
        <section style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          minWidth: 0
        }}>

          {/* Top Live Preview View Mode Bar */}
          <div className="cms-view-mode-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div className="cms-live-indicator" style={{ color: '#16a34a' }}>
                <span className="cms-live-pulse-dot" />
                <span style={{ fontSize: '12px' }}>Real-Time Live Draft Sync Active</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div className="cms-viewport-group">
                <button
                  type="button"
                  className={`cms-viewport-btn ${viewport === 'desktop' ? 'active' : ''}`}
                  onClick={() => setViewport('desktop')}
                  title="Desktop View (100%)"
                >
                  <Monitor size={12} /> Desktop
                </button>
                <button
                  type="button"
                  className={`cms-viewport-btn ${viewport === 'tablet' ? 'active' : ''}`}
                  onClick={() => setViewport('tablet')}
                  title="Tablet View (768px)"
                >
                  <Tablet size={12} /> Tablet
                </button>
                <button
                  type="button"
                  className={`cms-viewport-btn ${viewport === 'mobile' ? 'active' : ''}`}
                  onClick={() => setViewport('mobile')}
                  title="Mobile View (390px)"
                >
                  <Smartphone size={12} /> Mobile
                </button>
              </div>

              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setFullPagePreviewOpen(true)}
                style={{ padding: '5px 12px', fontSize: '11px', fontWeight: '600' }}
                title="Preview all 11 homepage sections composed together"
              >
                <Sparkles size={12} /> Full Page Preview
              </button>
            </div>
          </div>

          {/* Main Content Layout Container - Pure Full Width Live Preview Display for All Sections */}
          <div style={{ width: '100%', minWidth: 0 }}>
            {/* Live Preview Container (Rendered for all 11 sections in real-time!) */}
            <div
              className="cms-live-preview-card"
              style={{
                width: '100%',
                minWidth: 0,
                marginTop: 0
              }}
            >
              <div className="cms-preview-header">
                <div className="cms-live-indicator">
                  <span className="cms-live-pulse-dot" />
                  <span>Live Preview: {currentSecMeta?.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span className="cms-preview-badge">Live Draft Sync</span>

                  {/* Section Content Customizer Drawer Trigger for sections 2 to 11 */}
                  {activeSection !== 'hero' && (
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => setDrawerOpen(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor: '#334155',
                        color: '#ffffff',
                        borderColor: '#475569',
                        borderRadius: '6px'
                      }}
                    >
                      <Sliders size={13} color="#38bdf8" />
                      <span>Edit {currentSecMeta?.label}</span>
                    </button>
                  )}

                  {/* Dedicated Save & Sync Status for ALL sections */}
                  <span style={{ fontSize: '12px', color: dirty ? '#d97706' : '#16a34a', fontWeight: '600' }}>
                    {dirty ? '⚠️ Unsaved changes' : '✓ All changes in sync.'}
                  </span>
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      backgroundColor: '#0284c7',
                      borderColor: '#0284c7',
                      padding: '6px 16px',
                      fontSize: '12px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Save size={13} /> {saving ? 'Saving...' : 'Save All Changes'}
                  </button>
                </div>
              </div>

              <CmsSectionPreview
                sectionId={activeSection}
                formData={formData}
                updateSection={updateSection}
                viewport={viewport}
                onNotify={(msg) => showToast('info', msg)}
                onOpenEditor={() => setDrawerOpen(true)}
              />
            </div>
          </div>

          {/* Slide-Over Content Customizer Drawer (for Sections 2 to 11) */}
          {drawerOpen && activeSection !== 'hero' && (
            <>
              {/* Semi-transparent Backdrop */}
              <div
                onClick={() => setDrawerOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.45)',
                  backdropFilter: 'blur(3px)',
                  zIndex: 9998,
                  transition: 'opacity 0.2s ease'
                }}
              />

              {/* Drawer Container */}
              <div
                className="cms-customizer-drawer"
                style={{
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: 'min(580px, 94vw)',
                  backgroundColor: '#ffffff',
                  boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.25)',
                  zIndex: 9999,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                {/* Drawer Header */}
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #1e293b'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sliders size={18} color="#38bdf8" />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>
                        Edit {currentSecMeta?.label}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Real-time Live Sync active
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '4px'
                    }}
                    title="Close Drawer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Drawer Scrollable Content */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}>

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
          {/* SECTION 7: UPCOMING EVENT SCHEDULE                                        */}
          {/* ========================================================================= */}
          {activeSection === 'events' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">7. Upcoming Event Schedule Section</h2>
                <p className="admin-page-desc">Manage upcoming gatherings, katha dates, venues, and event details.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Section Title</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.events.title}
                    onChange={(e) => updateSection('events', { title: e.target.value })}
                    placeholder="Upcoming Event Schedule"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">"View All" Button Destination</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.events.viewAllUrl}
                    onChange={(e) => updateSection('events', { viewAllUrl: e.target.value })}
                    placeholder="/events"
                  />
                </div>
              </div>

              {/* Repeatable Event Cards Manager */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label className="admin-label" style={{ margin: 0 }}>
                    Event Schedule Cards ({formData.events.items.length})
                  </label>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => {
                      setDirty(true);
                      const newId = `ev_${Date.now()}`;
                      setFormData((prev) => ({
                        ...prev,
                        events: {
                          ...prev.events,
                          items: [
                            ...prev.events.items,
                            {
                              id: newId,
                              day: '10',
                              month: 'MAY',
                              title: 'New Spiritual Gathering',
                              time: '7:30 PM Onwards',
                              location: 'Sadguru Dham',
                              detailsUrl: '/events',
                              status: 'published'
                            }
                          ]
                        }
                      }));
                    }}
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                  >
                    <Plus size={13} /> Add Event Card
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {formData.events.items.map((ev, idx) => (
                    <div
                      key={ev.id}
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
                          Event #{idx + 1}: {ev.title}
                        </span>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => toggleStatus('items', 'events', idx)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700',
                              border: 'none',
                              cursor: 'pointer',
                              backgroundColor: ev.status === 'published' ? '#ecfdf5' : '#f1f5f9',
                              color: ev.status === 'published' ? '#059669' : '#64748b'
                            }}
                          >
                            {ev.status === 'published' ? 'Published' : 'Draft'}
                          </button>

                          <button
                            type="button"
                            onClick={() => moveItem('items', 'events', idx, -1)}
                            disabled={idx === 0}
                            style={{ padding: '4px', border: 'none', background: 'none' }}
                          >
                            <ChevronUp size={15} color={idx === 0 ? '#cbd5e1' : '#475569'} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem('items', 'events', idx, 1)}
                            disabled={idx === formData.events.items.length - 1}
                            style={{ padding: '4px', border: 'none', background: 'none' }}
                          >
                            <ChevronDown size={15} color={idx === formData.events.items.length - 1 ? '#cbd5e1' : '#475569'} />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeItem('items', 'events', idx)}
                            style={{ padding: '4px', border: 'none', background: 'none', color: '#ef4444' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '80px 100px 1fr', gap: '10px' }}>
                        <div className="admin-form-group">
                          <label className="admin-label">Day</label>
                          <input
                            type="text"
                            className="admin-input-control"
                            value={ev.day}
                            onChange={(e) => {
                              setDirty(true);
                              const list = [...formData.events.items];
                              list[idx].day = e.target.value;
                              updateSection('events', { items: list });
                            }}
                            placeholder="28"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Month</label>
                          <input
                            type="text"
                            className="admin-input-control"
                            value={ev.month}
                            onChange={(e) => {
                              setDirty(true);
                              const list = [...formData.events.items];
                              list[idx].month = e.target.value;
                              updateSection('events', { items: list });
                            }}
                            placeholder="MAR"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Event Title</label>
                          <input
                            type="text"
                            className="admin-input-control"
                            value={ev.title}
                            onChange={(e) => {
                              setDirty(true);
                              const list = [...formData.events.items];
                              list[idx].title = e.target.value;
                              updateSection('events', { items: list });
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <div className="admin-form-group">
                          <label className="admin-label">Time</label>
                          <input
                            type="text"
                            className="admin-input-control"
                            value={ev.time}
                            onChange={(e) => {
                              setDirty(true);
                              const list = [...formData.events.items];
                              list[idx].time = e.target.value;
                              updateSection('events', { items: list });
                            }}
                            placeholder="8:00 PM Onwards"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Location / Venue</label>
                          <input
                            type="text"
                            className="admin-input-control"
                            value={ev.location}
                            onChange={(e) => {
                              setDirty(true);
                              const list = [...formData.events.items];
                              list[idx].location = e.target.value;
                              updateSection('events', { items: list });
                            }}
                            placeholder="Takhatgarh Dham"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">"View Details" URL</label>
                          <input
                            type="text"
                            className="admin-input-control"
                            value={ev.detailsUrl}
                            onChange={(e) => {
                              setDirty(true);
                              const list = [...formData.events.items];
                              list[idx].detailsUrl = e.target.value;
                              updateSection('events', { items: list });
                            }}
                            placeholder="/events"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 8: LATEST NEWS AND ARTICLES                                       */}
          {/* ========================================================================= */}
          {activeSection === 'news' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">8. Latest News &amp; Articles Section</h2>
                <p className="admin-page-desc">Configure the press &amp; news cards on the homepage.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Section Title</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.news.title}
                    onChange={(e) => updateSection('news', { title: e.target.value })}
                    placeholder="Latest News And Articles"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">"View All" Button Destination</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.news.viewAllUrl}
                    onChange={(e) => updateSection('news', { viewAllUrl: e.target.value })}
                    placeholder="/news"
                  />
                </div>
              </div>

              {/* Repeatable Articles Manager */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label className="admin-label" style={{ margin: 0 }}>
                    Blog &amp; News Cards ({formData.news.articles.length})
                  </label>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => {
                      setDirty(true);
                      const newId = `n_${Date.now()}`;
                      setFormData((prev) => ({
                        ...prev,
                        news: {
                          ...prev.news,
                          articles: [
                            ...prev.news.articles,
                            {
                              id: newId,
                              title: 'New Ashram Announcement',
                              featuredImage: '/images/img_30.png',
                              date: 'Recent',
                              author: 'Shree Abhaydas',
                              readMoreUrl: '/news',
                              status: 'published'
                            }
                          ]
                        }
                      }));
                    }}
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                  >
                    <Plus size={13} /> Add News Card
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {formData.news.articles.map((art, idx) => (
                    <div
                      key={art.id}
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
                          Article #{idx + 1}: {art.title}
                        </span>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => toggleStatus('articles', 'news', idx)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700',
                              border: 'none',
                              cursor: 'pointer',
                              backgroundColor: art.status === 'published' ? '#ecfdf5' : '#f1f5f9',
                              color: art.status === 'published' ? '#059669' : '#64748b'
                            }}
                          >
                            {art.status === 'published' ? 'Published' : 'Draft'}
                          </button>

                          <button
                            type="button"
                            onClick={() => moveItem('articles', 'news', idx, -1)}
                            disabled={idx === 0}
                            style={{ padding: '4px', border: 'none', background: 'none' }}
                          >
                            <ChevronUp size={15} color={idx === 0 ? '#cbd5e1' : '#475569'} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem('articles', 'news', idx, 1)}
                            disabled={idx === formData.news.articles.length - 1}
                            style={{ padding: '4px', border: 'none', background: 'none' }}
                          >
                            <ChevronDown size={15} color={idx === formData.news.articles.length - 1 ? '#cbd5e1' : '#475569'} />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeItem('articles', 'news', idx)}
                            style={{ padding: '4px', border: 'none', background: 'none', color: '#ef4444' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Article Headline</label>
                        <input
                          type="text"
                          className="admin-input-control"
                          value={art.title}
                          onChange={(e) => {
                            setDirty(true);
                            const list = [...formData.news.articles];
                            list[idx].title = e.target.value;
                            updateSection('news', { articles: list });
                          }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="admin-form-group">
                          <label className="admin-label">Date</label>
                          <input
                            type="text"
                            className="admin-input-control"
                            value={art.date}
                            onChange={(e) => {
                              setDirty(true);
                              const list = [...formData.news.articles];
                              list[idx].date = e.target.value;
                              updateSection('news', { articles: list });
                            }}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">"Read More" URL Destination</label>
                          <input
                            type="text"
                            className="admin-input-control"
                            value={art.readMoreUrl}
                            onChange={(e) => {
                              setDirty(true);
                              const list = [...formData.news.articles];
                              list[idx].readMoreUrl = e.target.value;
                              updateSection('news', { articles: list });
                            }}
                          />
                        </div>
                      </div>

                      <CmsImageUploader
                        label="Featured Article Image"
                        value={art.featuredImage}
                        onChange={(url) => {
                          setDirty(true);
                          const list = [...formData.news.articles];
                          list[idx].featuredImage = url;
                          updateSection('news', { articles: list });
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
          {/* SECTION 9: TESTIMONIALS / SUCCESS STORIES                                */}
          {/* ========================================================================= */}
          {activeSection === 'testimonials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">9. Testimonials / Success Stories Section</h2>
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
          {/* SECTION 10: CONTACT CTA BANNER                                            */}
          {/* ========================================================================= */}
          {activeSection === 'contact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">10. Contact CTA Banner (Orange Ribbon)</h2>
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
          {/* SECTION 11: FOOTER SETTINGS                                               */}
          {/* ========================================================================= */}
          {activeSection === 'footer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">11. Footer Settings</h2>
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

                </div>

                {/* Drawer Footer */}
                <div style={{
                  padding: '14px 20px',
                  backgroundColor: '#f8fafc',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '12px', color: dirty ? '#d97706' : '#16a34a', fontWeight: '600' }}>
                    {dirty ? '⚠️ Unsaved changes' : '✓ All changes in sync.'}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => setDrawerOpen(false)}
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      Done
                    </button>
                    <button
                      type="button"
                      className="admin-btn-primary"
                      onClick={handleSave}
                      disabled={saving}
                      style={{
                        backgroundColor: '#0284c7',
                        borderColor: '#0284c7',
                        padding: '8px 18px',
                        fontSize: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Save size={13} /> {saving ? 'Saving...' : 'Save All Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

    </section>
  </div>

  {/* Full Page Live Preview Modal (All 11 Sections) */}
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
            Full Homepage Live Preview (All 11 Sections)
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
</div>
  );
}
