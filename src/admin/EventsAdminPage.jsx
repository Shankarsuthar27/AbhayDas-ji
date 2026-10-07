import React, { useState, useEffect, useRef } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Calendar, 
  RotateCw, 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  Link2,
  ExternalLink,
  Eye,
  Check,
  Clock
} from 'lucide-react';
import { processEventImage } from './utils/helpers';
import { EVENT_MEDIA_PRESETS } from './utils/mediaPresets';
import './Admin.css';

// Default Program Schedule Template
const DEFAULT_SCHEDULE = [
  { time: '07:30 PM', activity: 'भक्तजनों का आगमन एवं स्वागत' },
  { time: '08:00 PM', activity: 'दीप प्रज्वलन एवं आशीर्वचन' },
  { time: '11:00 PM', activity: 'महाआरती एवं प्रसादी वितरण' }
];

export default function EventsAdminPage() {
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Form Fields
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // Image Upload States
  const [eventImage, setEventImage] = useState('');
  const [imageMeta, setImageMeta] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [imageTab, setImageTab] = useState('upload'); // 'upload' | 'url' | 'presets'
  const [urlInput, setUrlInput] = useState('');
  const [previewModalData, setPreviewModalData] = useState(null);
  const fileInputRef = useRef(null);

  // Program Schedule State (कार्यक्रम समय सारिणी)
  const [scheduleList, setScheduleList] = useState(DEFAULT_SCHEDULE);

  const handleScheduleChange = (index, field, value) => {
    setScheduleList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddScheduleRow = () => {
    setScheduleList((prev) => [...prev, { time: '', activity: '' }]);
  };

  const handleRemoveScheduleRow = (index) => {
    setScheduleList((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const handleResetSchedule = () => {
    setScheduleList(DEFAULT_SCHEDULE);
  };

  // Fetch all events from Firestore
  const fetchEvents = async () => {
    setLoading(true);
    try {
      let eventsQuery;
      try {
        eventsQuery = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
      } catch (e) {
        eventsQuery = collection(db, 'events');
      }

      const snapshot = await getDocs(eventsQuery);
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      setEventsList(items);
    } catch (err) {
      console.error('Error fetching events from Firestore:', err);
      try {
        const snap = await getDocs(collection(db, 'events'));
        setEventsList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (fallbackErr) {
        setFeedback({
          type: 'error',
          message: `Unable to load events: ${fallbackErr.message}. Make sure Firestore rules allow read access.`
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4500);
  };

  // Process and upload file
  const handleProcessFile = async (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      showToast('error', 'Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setUploadingImage(true);
    setUploadProgress(15);

    try {
      const result = await processEventImage(file, (pct) => {
        setUploadProgress(pct);
      });

      setEventImage(result.url);
      setImageMeta({
        dimensions: result.dimensions,
        sizeKB: result.sizeKB,
        fileName: result.originalName || file.name,
        source: result.source
      });

      if (result.source === 'storage') {
        showToast('success', 'Event poster uploaded to Firebase Storage!');
      } else {
        showToast('success', `Event poster optimized & ready! (${result.dimensions}, ~${result.sizeKB} KB)`);
      }
    } catch (err) {
      console.error('Image processing error:', err);
      try {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setEventImage(ev.target.result);
          setImageMeta({ fileName: file.name, source: 'direct' });
          showToast('success', 'Event poster attached!');
        };
        reader.readAsDataURL(file);
      } catch (fallbackErr) {
        showToast('error', `Failed to upload image: ${err.message}`);
      }
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  // URL apply
  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      showToast('error', 'Please enter a valid image URL.');
      return;
    }
    setEventImage(urlInput.trim());
    setImageMeta({
      fileName: urlInput.trim().split('/').pop() || 'External URL',
      source: 'url'
    });
    showToast('success', 'Event image URL applied!');
  };

  // Preset select
  const handleSelectPreset = (preset) => {
    setEventImage(preset.url);
    setImageMeta({
      fileName: preset.title,
      source: 'preset'
    });
    showToast('success', `Selected "${preset.title}" preset image.`);
  };

  const handleRemoveImage = () => {
    setEventImage('');
    setImageMeta(null);
    setUrlInput('');
  };

  // Add new event to Firestore
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!eventName.trim() || !date.trim() || !location.trim() || !description.trim()) {
      showToast('error', 'Please fill in Event Name, Date, Location, and Description.');
      return;
    }

    setSubmitting(true);
    try {
      const cleanSlug = eventName
        .trim()
        .toLowerCase()
        .replace(/[^\w\u0900-\u097F\-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const finalPoster = eventImage.trim() || '/images/event_chhotu_singh_rawna.jpg';

      const validSchedule = scheduleList
        .filter((item) => (item.time && item.time.trim()) || (item.activity && item.activity.trim()))
        .map((item) => ({
          time: item.time.trim() || '08:00 PM',
          activity: item.activity.trim() || 'भक्ति कार्यक्रम'
        }));

      const newDoc = {
        name: eventName.trim(),
        title: eventName.trim(),
        slug: cleanSlug || `event-${Date.now()}`,
        date: date.trim(),
        location: location.trim(),
        venue: location.trim(),
        description: description.trim(),
        image: finalPoster,
        imageUrl: finalPoster,
        schedule: validSchedule.length > 0 ? validSchedule : DEFAULT_SCHEDULE,
        status: 'Upcoming',
        author: 'admin2233',
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'events'), newDoc);
      showToast('success', `Event created in Firestore! (ID: ${docRef.id.slice(0, 6)}...)`);

      // Reset form
      setEventName('');
      setLocation('');
      setDescription('');
      setEventImage('');
      setImageMeta(null);
      setUrlInput('');
      setScheduleList(DEFAULT_SCHEDULE);

      // Refresh list
      fetchEvents();
    } catch (err) {
      console.error('Error creating event in Firestore:', err);
      showToast('error', `Failed to create event: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id, itemTitle) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this event?\n"${itemTitle}"`);
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'events', id));
      showToast('success', 'Event removed from Firestore.');
      setEventsList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
      showToast('error', `Failed to delete event: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-heading">Events &amp; Yatras</h1>
          <p className="admin-page-desc">
            Schedule upcoming gatherings, kathas, and events with posters stored in Firestore.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-secondary"
          onClick={fetchEvents}
          disabled={loading}
        >
          <RotateCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Alert / Feedback */}
      {feedback.message && (
        <div className={`admin-alert ${feedback.type}`} role="alert">
          {feedback.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Form: Add Event */}
      <div className="admin-form-card">
        <h2 className="admin-card-title">Schedule New Upcoming Event</h2>
        <form onSubmit={handleAddEvent} className="admin-crud-form">
          <div className="admin-form-row">
            <div className="admin-form-group flex-2">
              <label className="admin-label">Event Name / Title *</label>
              <input
                type="text"
                className="admin-input-control"
                placeholder="e.g. Shrimad Bhagwat Katha - Takhatgarh Dham"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Event Date *</label>
              <input
                type="date"
                className="admin-input-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Location / Venue *</label>
              <input
                type="text"
                className="admin-input-control"
                placeholder="e.g. Trikam Das Ji Dham, Pali"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Event Description &amp; Details *</label>
            <textarea
              rows={3}
              className="admin-textarea-control"
              placeholder="Enter schedule times, guest speakers, accommodation info, or yatra highlights..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* ============================================================ */}
          {/* UPLOAD EVENT IMAGE SECTION                                   */}
          {/* ============================================================ */}
          <div style={{
            marginTop: '8px',
            padding: '20px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#0f172a'
                }}>
                  <ImageIcon size={17} className="text-[#0891b2]" />
                  Event Poster / Banner Image (कार्यक्रम पोस्टर / फोटो)
                </label>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>
                  Upload a high-quality poster or flyer. Automatically compressed &amp; stored to Firebase.
                </p>
              </div>

              {eventImage && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0'
                }}>
                  <Check size={13} /> Poster Attached
                </span>
              )}
            </div>

            {/* Segmented Mode Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  border: '1px solid',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: imageTab === 'upload' ? '#0f172a' : '#ffffff',
                  color: imageTab === 'upload' ? '#ffffff' : '#64748b',
                  borderColor: imageTab === 'upload' ? '#0f172a' : '#cbd5e1'
                }}
              >
                <Upload size={13} /> Upload File / Drag &amp; Drop
              </button>

              <button
                type="button"
                onClick={() => setImageTab('url')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  border: '1px solid',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: imageTab === 'url' ? '#0f172a' : '#ffffff',
                  color: imageTab === 'url' ? '#ffffff' : '#64748b',
                  borderColor: imageTab === 'url' ? '#0f172a' : '#cbd5e1'
                }}
              >
                <Link2 size={13} /> Image URL
              </button>

              <button
                type="button"
                onClick={() => setImageTab('presets')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  border: '1px solid',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: imageTab === 'presets' ? '#0f172a' : '#ffffff',
                  color: imageTab === 'presets' ? '#ffffff' : '#64748b',
                  borderColor: imageTab === 'presets' ? '#0f172a' : '#cbd5e1'
                }}
              >
                <Sparkles size={13} /> Ashram Library ({EVENT_MEDIA_PRESETS.length})
              </button>
            </div>

            {/* If an image is currently set, display preview card with controls */}
            {eventImage ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  position: 'relative',
                  width: '90px',
                  height: '70px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  flexShrink: 0
                }}>
                  <img
                    src={eventImage}
                    alt="Event Poster Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/images/event_chhotu_singh_rawna.jpg';
                    }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: '180px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '3px' }}>
                    {imageMeta?.fileName || 'Event Poster Image'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {imageMeta?.dimensions && <span>📐 {imageMeta.dimensions}</span>}
                    {imageMeta?.sizeKB && <span>📦 ~{imageMeta.sizeKB} KB</span>}
                    <span style={{ color: '#059669', fontWeight: '600' }}>
                      ● {imageMeta?.source === 'storage' ? 'Stored in Cloud' : 'Ready to Publish'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setPreviewModalImage(eventImage)}
                    className="admin-btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    title="View Full Size"
                  >
                    <Eye size={13} /> Full View
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="admin-btn-delete"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    title="Remove Image"
                  >
                    <X size={13} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              /* When no image is chosen yet */
              <div>
                {/* TAB 1: FILE UPLOAD DROPZONE */}
                {imageTab === 'upload' && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                      onChange={handleFileInputChange}
                      style={{ display: 'none' }}
                    />

                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => !uploadingImage && fileInputRef.current?.click()}
                      style={{
                        position: 'relative',
                        border: dragActive ? '2px dashed #0284c7' : '2px dashed #cbd5e1',
                        borderRadius: '10px',
                        backgroundColor: dragActive ? '#f0f9ff' : '#ffffff',
                        padding: '30px 20px',
                        textAlign: 'center',
                        cursor: uploadingImage ? 'wait' : 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      tabIndex={0}
                      onPaste={(e) => {
                        const file = e.clipboardData?.files?.[0];
                        if (file && file.type.startsWith('image/')) {
                          e.preventDefault();
                          handleProcessFile(file);
                        }
                      }}
                    >
                      {uploadingImage ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div className="admin-spinner" style={{ width: '24px', height: '24px' }} />
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                            Optimizing &amp; Uploading Poster... {uploadProgress}%
                          </div>
                          <div style={{
                            width: '240px',
                            height: '6px',
                            backgroundColor: '#e2e8f0',
                            borderRadius: '10px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${uploadProgress}%`,
                              height: '100%',
                              backgroundColor: '#0f172a',
                              transition: 'width 0.2s ease'
                            }} />
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            backgroundColor: '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0891b2',
                            marginBottom: '4px'
                          }}>
                            <Upload size={22} />
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                            Click to browse or drag &amp; drop event poster
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            Supports JPG, PNG, WebP • Auto-optimized for web • You can also paste (Ctrl+V)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: DIRECT IMAGE URL */}
                {imageTab === 'url' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="url"
                      placeholder="https://example.com/event-poster.jpg or /images/..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="admin-input-control"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="admin-btn-primary"
                      style={{ padding: '0 18px' }}
                    >
                      Apply URL
                    </button>
                  </div>
                )}

                {/* TAB 3: ASHRAM MEDIA PRESETS */}
                {imageTab === 'presets' && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '12px',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    padding: '4px'
                  }}>
                    {EVENT_MEDIA_PRESETS.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#0f172a';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div style={{ height: '75px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                          <img
                            src={preset.url}
                            alt={preset.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ padding: '6px 8px' }}>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#0f172a',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {preset.title}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* कार्यक्रम समय सारिणी (PROGRAM SCHEDULE) SECTION              */}
          {/* ============================================================ */}
          <div style={{
            marginTop: '8px',
            padding: '20px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#0f172a'
                }}>
                  <Clock size={17} className="text-[#fc791a]" />
                  कार्यक्रम समय सारिणी (Program Schedule)
                </label>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>
                  Define program timing and key rituals/activities (समय एवं कार्यक्रम विवरण).
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleResetSchedule}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                  title="Reset to default 3 schedule items"
                >
                  <RotateCw size={12} /> Reset Defaults
                </button>

                <button
                  type="button"
                  onClick={handleAddScheduleRow}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: '1px solid #fc791a',
                    backgroundColor: '#fff7ed',
                    color: '#ea580c',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={13} /> Add Slot / समय जोड़ें
                </button>
              </div>
            </div>

            {/* List of Schedule Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {scheduleList.map((slot, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    flexWrap: 'wrap'
                  }}
                >
                  {/* Slot Number Badge */}
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#e2e8f0',
                    color: '#475569',
                    fontSize: '11px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </span>

                  {/* Time Input */}
                  <div style={{ width: '140px', flexShrink: 0 }}>
                    <input
                      type="text"
                      className="admin-input-control"
                      value={slot.time}
                      onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                      placeholder="e.g. 07:30 PM"
                      style={{
                        padding: '7px 10px',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#ea580c',
                        backgroundColor: '#ffffff'
                      }}
                      required
                    />
                  </div>

                  {/* Activity Input */}
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <input
                      type="text"
                      className="admin-input-control"
                      value={slot.activity}
                      onChange={(e) => handleScheduleChange(index, 'activity', e.target.value)}
                      placeholder="e.g. भक्तजनों का आगमन एवं स्वागत"
                      style={{
                        padding: '7px 10px',
                        fontSize: '13px',
                        color: '#1e293b',
                        backgroundColor: '#ffffff'
                      }}
                      required
                    />
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveScheduleRow(index)}
                    disabled={scheduleList.length <= 1}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: scheduleList.length <= 1 ? '#cbd5e1' : '#ef4444',
                      cursor: scheduleList.length <= 1 ? 'not-allowed' : 'pointer',
                      padding: '6px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Remove slot"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-form-actions" style={{ marginTop: '10px' }}>
            <button
              type="submit"
              className="admin-btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving to Firestore...' : (
                <>
                  <Plus size={15} /> Schedule Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* List: Existing Events */}
      <div className="admin-list-card">
        <div className="admin-list-header">
          <h2 className="admin-card-title">
            Existing Events ({eventsList.length})
          </h2>
          <span className="admin-badge-count">{eventsList.length} Items</span>
        </div>

        {loading ? (
          <div className="admin-loading-indicator">
            <div className="admin-spinner" />
            <span>Fetching events from Firestore...</span>
          </div>
        ) : eventsList.length === 0 ? (
          <div className="admin-empty-state">
            <Calendar size={32} className="admin-empty-icon-svg" />
            <h3>No scheduled events yet</h3>
            <p>Use the form above to add upcoming events with posters and schedules to the database.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>Poster</th>
                  <th style={{ width: '28%' }}>Event Name</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Schedule &amp; Description</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {eventsList.map((item) => {
                  const posterUrl = item.image || item.imageUrl || '/images/event_chhotu_singh_rawna.jpg';
                  const eventSchedule = (Array.isArray(item.schedule) && item.schedule.length > 0)
                    ? item.schedule
                    : DEFAULT_SCHEDULE;

                  return (
                    <tr key={item.id}>
                      {/* Event Poster Thumbnail */}
                      <td>
                        <div
                          onClick={() => setPreviewModalData({
                            image: posterUrl,
                            name: item.name || item.title,
                            schedule: eventSchedule
                          })}
                          style={{
                            width: '54px',
                            height: '42px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer',
                            position: 'relative'
                          }}
                          title="Click to view poster and schedule"
                        >
                          <img
                            src={posterUrl}
                            alt={item.name || item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = '/images/event_chhotu_singh_rawna.jpg';
                            }}
                          />
                        </div>
                      </td>

                      <td>
                        <div className="admin-table-title">{item.name || item.title}</div>
                        <div className="admin-table-id">ID: {item.id.slice(0, 8)}...</div>
                      </td>
                      <td>
                        <span className="admin-table-date">{item.date}</span>
                      </td>
                      <td>
                        <span className="admin-table-location">
                          <MapPin size={13} className="inline mr-1" />
                          {item.location}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table-desc-preview" style={{ marginBottom: '6px' }}>
                          {item.description}
                        </div>

                        {/* Schedule Badges in Table */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {eventSchedule.map((s, idx) => (
                            <div
                              key={idx}
                              style={{
                                fontSize: '11px',
                                fontWeight: '500',
                                backgroundColor: '#f8fafc',
                                color: '#1e293b',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                border: '1px solid #e2e8f0',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                            >
                              <span style={{ color: '#ea580c', fontWeight: '800', minWidth: '65px' }}>{s.time}</span>
                              <span style={{ color: '#475569' }}>{s.activity}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="admin-btn-delete"
                          onClick={() => handleDeleteEvent(item.id, item.name || item.title)}
                          disabled={deletingId === item.id}
                          title="Delete from Firestore"
                        >
                          <Trash2 size={13} />
                          {deletingId === item.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lightbox Modal for Poster Preview & Schedule */}
      {previewModalData && (
        <div
          onClick={() => setPreviewModalData(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              overflow: 'hidden',
              maxWidth: '720px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 20px',
              backgroundColor: '#1e293b',
              color: '#ffffff'
            }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>
                  {previewModalData.name || 'Event Details'}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>
                  Poster &amp; कार्यक्रम समय सारिणी (Program Schedule)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalData(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxHeight: '55vh',
              overflow: 'hidden',
              backgroundColor: '#0b1120'
            }}>
              <img
                src={previewModalData.image}
                alt={previewModalData.name || 'Full Poster'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '50vh',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
            </div>

            {/* Schedule Section inside Modal */}
            <div style={{
              padding: '16px 20px',
              backgroundColor: '#1e293b',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{
                fontSize: '12.5px',
                fontWeight: '700',
                color: '#f59e0b',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Clock size={14} /> कार्यक्रम समय सारिणी (Program Schedule)
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '8px'
              }}>
                {(previewModalData.schedule || DEFAULT_SCHEDULE).map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <span style={{ color: '#34d399', fontWeight: '800', minWidth: '65px' }}>
                      {s.time}
                    </span>
                    <span style={{ color: '#e2e8f0' }}>
                      {s.activity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              padding: '12px 20px',
              backgroundColor: '#0f172a',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <a
                href={previewModalData.image}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '12px',
                  color: '#38bdf8',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: '600'
                }}
              >
                Open poster in new tab <ExternalLink size={12} />
              </a>

              <button
                type="button"
                onClick={() => setPreviewModalData(null)}
                className="admin-btn-secondary"
                style={{ padding: '5px 12px', fontSize: '12px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


