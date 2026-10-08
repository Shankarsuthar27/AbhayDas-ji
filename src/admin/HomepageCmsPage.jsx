import React, { useState, useEffect } from 'react';
import { useCms } from '../context/CmsContext';
import CmsImageUploader from './components/CmsImageUploader';
import {
  Compass,
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
  Link2
} from 'lucide-react';
import './Admin.css';

// Section Navigation Tab Definitions
const CMS_SECTIONS = [
  { id: 'header', label: 'Header & Navigation', icon: Compass, badge: 'Nav & Logo' },
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
  const [activeSection, setActiveSection] = useState('header');
  const [formData, setFormData] = useState(cms);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [dirty, setDirty] = useState(false);

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
            Homepage Sections (12)
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
          gap: '24px'
        }}>

          {/* ========================================================================= */}
          {/* SECTION 1: HEADER & NAVIGATION                                            */}
          {/* ========================================================================= */}
          {activeSection === 'header' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">1. Header &amp; Navigation Configuration</h2>
                <p className="admin-page-desc">Manage logo branding, navigation menu links, and primary action button.</p>
              </div>

              {/* Logo Upload */}
              <CmsImageUploader
                label="Website Header Logo"
                description="Upload clean PNG or SVG logo for top navbar"
                value={formData.header.logo}
                onChange={(url) => updateSection('header', { logo: url })}
                maxSizeMB={5}
              />

              {/* Action Button */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Action Button Text</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.header.actionButtonText}
                    onChange={(e) => updateSection('header', { actionButtonText: e.target.value })}
                    placeholder="Donate Now"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Action Button URL Destination</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.header.actionButtonUrl}
                    onChange={(e) => updateSection('header', { actionButtonUrl: e.target.value })}
                    placeholder="#donate or /donate"
                  />
                </div>
              </div>

              {/* Navigation Menu List Manager */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label className="admin-label" style={{ margin: 0 }}>
                    Navigation Menu Items ({formData.header.menuItems.length})
                  </label>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => {
                      setDirty(true);
                      const newId = `m_${Date.now()}`;
                      setFormData((prev) => ({
                        ...prev,
                        header: {
                          ...prev.header,
                          menuItems: [...prev.header.menuItems, { id: newId, label: 'New Link', url: '/', status: 'published' }]
                        }
                      }));
                    }}
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                  >
                    <Plus size={13} /> Add Menu Item
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formData.header.menuItems.map((item, idx) => (
                    <div
                      key={item.id}
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
                          const list = [...formData.header.menuItems];
                          list[idx].label = e.target.value;
                          updateSection('header', { menuItems: list });
                        }}
                        placeholder="Menu Label"
                        className="admin-input-control"
                        style={{ flex: 1, padding: '6px 10px' }}
                      />
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => {
                          setDirty(true);
                          const list = [...formData.header.menuItems];
                          list[idx].url = e.target.value;
                          updateSection('header', { menuItems: list });
                        }}
                        placeholder="Destination Link"
                        className="admin-input-control"
                        style={{ flex: 1, padding: '6px 10px' }}
                      />

                      {/* Status Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleStatus('menuItems', 'header', idx)}
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

                      {/* Reorder */}
                      <div style={{ display: 'flex', gap: '2px' }}>
                        <button
                          type="button"
                          onClick={() => moveItem('menuItems', 'header', idx, -1)}
                          disabled={idx === 0}
                          style={{ padding: '4px', border: 'none', background: 'none', cursor: idx === 0 ? 'default' : 'pointer' }}
                        >
                          <ChevronUp size={14} color={idx === 0 ? '#cbd5e1' : '#475569'} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem('menuItems', 'header', idx, 1)}
                          disabled={idx === formData.header.menuItems.length - 1}
                          style={{ padding: '4px', border: 'none', background: 'none', cursor: idx === formData.header.menuItems.length - 1 ? 'default' : 'pointer' }}
                        >
                          <ChevronDown size={14} color={idx === formData.header.menuItems.length - 1 ? '#cbd5e1' : '#475569'} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeItem('menuItems', 'header', idx)}
                        style={{ padding: '4px', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 2: HERO SECTION                                                   */}
          {/* ========================================================================= */}
          {activeSection === 'hero' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">2. Hero Banner Section</h2>
                <p className="admin-page-desc">Customize the hero background media, typography, and call-to-action buttons.</p>
              </div>

              <CmsImageUploader
                label="Hero Background Media (Image / Video)"
                description="Upload background banner or select video (Max 5MB)"
                value={formData.hero.backgroundMedia}
                onChange={(url) => updateSection('hero', { backgroundMedia: url })}
                maxSizeMB={5}
                allowVideo={true}
              />

              <div className="admin-form-group">
                <label className="admin-label">Hero Badge / Subtitle</label>
                <input
                  type="text"
                  className="admin-input-control"
                  value={formData.hero.badge}
                  onChange={(e) => updateSection('hero', { badge: e.target.value })}
                  placeholder="Seva • Sanskar • Parampara"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Main Heading Line 1</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.hero.headingLine1}
                    onChange={(e) => updateSection('hero', { headingLine1: e.target.value })}
                    placeholder="Preserving Heritage,"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Main Heading Line 2</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.hero.headingLine2}
                    onChange={(e) => updateSection('hero', { headingLine2: e.target.value })}
                    placeholder="Inspiring Generations"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Supporting Paragraph Text</label>
                <textarea
                  rows={3}
                  className="admin-textarea-control"
                  value={formData.hero.paragraph}
                  onChange={(e) => updateSection('hero', { paragraph: e.target.value })}
                  placeholder="Welcome to the official spiritual platform..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Primary Action Button ("Donate Now")</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.hero.primaryBtnText}
                    onChange={(e) => updateSection('hero', { primaryBtnText: e.target.value })}
                    placeholder="Donate Now"
                  />
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.hero.primaryBtnUrl}
                    onChange={(e) => updateSection('hero', { primaryBtnUrl: e.target.value })}
                    placeholder="Destination Link"
                    style={{ marginTop: '6px' }}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Secondary Button ("Watch Video")</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.hero.watchVideoText}
                    onChange={(e) => updateSection('hero', { watchVideoText: e.target.value })}
                    placeholder="Watch Video"
                  />
                  <input
                    type="text"
                    className="admin-input-control"
                    value={formData.hero.watchVideoUrl}
                    onChange={(e) => updateSection('hero', { watchVideoUrl: e.target.value })}
                    placeholder="YouTube Video URL"
                    style={{ marginTop: '6px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 3: BRIEF INTRODUCTION SECTION                                     */}
          {/* ========================================================================= */}
          {activeSection === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">3. Brief Introduction Section</h2>
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
          {/* SECTION 4: SPIRITUAL KATHA (CAROUSEL / GRID)                             */}
          {/* ========================================================================= */}
          {activeSection === 'kathas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">4. Spiritual Katha (Carousel / Grid)</h2>
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
          {/* SECTION 5: DONATION SECTION                                               */}
          {/* ========================================================================= */}
          {activeSection === 'donations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">5. Donation Campaigns Section</h2>
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
          {/* SECTION 6: GALLERY SECTION                                                */}
          {/* ========================================================================= */}
          {activeSection === 'gallery' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">6. Gallery Section</h2>
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

              {/* Media Grid Manager */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label className="admin-label" style={{ margin: 0 }}>
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
                          images: [...prev.gallery.images, { id: newId, src: '/images/img_17.jpg', title: 'New Photo', status: 'published' }]
                        }
                      }));
                    }}
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                  >
                    <Plus size={13} /> Add Photo
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '14px'
                }}>
                  {formData.gallery.images.map((img, idx) => (
                    <div
                      key={img.id}
                      style={{
                        padding: '12px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{
                        height: '110px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        backgroundColor: '#e2e8f0'
                      }}>
                        <img
                          src={img.src}
                          alt={img.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>

                      <input
                        type="text"
                        value={img.title}
                        onChange={(e) => {
                          setDirty(true);
                          const list = [...formData.gallery.images];
                          list[idx].title = e.target.value;
                          updateSection('gallery', { images: list });
                        }}
                        placeholder="Photo Title"
                        className="admin-input-control"
                        style={{ fontSize: '12px', padding: '5px 8px' }}
                      />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => toggleStatus('images', 'gallery', idx)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '10.5px',
                            fontWeight: '700',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: img.status === 'published' ? '#ecfdf5' : '#f1f5f9',
                            color: img.status === 'published' ? '#059669' : '#64748b'
                          }}
                        >
                          {img.status === 'published' ? 'Published' : 'Draft'}
                        </button>

                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => moveItem('images', 'gallery', idx, -1)}
                            disabled={idx === 0}
                            style={{ padding: '2px', border: 'none', background: 'none' }}
                          >
                            <ChevronUp size={14} color={idx === 0 ? '#cbd5e1' : '#475569'} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem('images', 'gallery', idx, 1)}
                            disabled={idx === formData.gallery.images.length - 1}
                            style={{ padding: '2px', border: 'none', background: 'none' }}
                          >
                            <ChevronDown size={14} color={idx === formData.gallery.images.length - 1 ? '#cbd5e1' : '#475569'} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem('images', 'gallery', idx)}
                            style={{ padding: '2px', border: 'none', background: 'none', color: '#ef4444' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 7: RECENT KATHA (VIDEOS)                                         */}
          {/* ========================================================================= */}
          {activeSection === 'recentKatha' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">7. Recent Katha (Video &amp; Audio Cards)</h2>
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
          {/* SECTION 8: UPCOMING EVENT SCHEDULE                                        */}
          {/* ========================================================================= */}
          {activeSection === 'events' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">8. Upcoming Event Schedule Section</h2>
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
          {/* SECTION 9: LATEST NEWS AND ARTICLES                                       */}
          {/* ========================================================================= */}
          {activeSection === 'news' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">9. Latest News &amp; Articles Section</h2>
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
          {/* SECTION 10: TESTIMONIALS / SUCCESS STORIES                                */}
          {/* ========================================================================= */}
          {activeSection === 'testimonials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">10. Testimonials / Success Stories Section</h2>
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
          {/* SECTION 11: CONTACT CTA BANNER                                            */}
          {/* ========================================================================= */}
          {activeSection === 'contact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">11. Contact CTA Banner (Orange Ribbon)</h2>
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
          {/* SECTION 12: FOOTER SETTINGS                                               */}
          {/* ========================================================================= */}
          {activeSection === 'footer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 className="admin-card-title">12. Footer Settings</h2>
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

        </section>
      </div>
    </div>
  );
}
