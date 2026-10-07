import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { processGalleryImage, compressImage } from './utils/helpers';
import { NEWS_MEDIA_PRESETS } from './utils/mediaPresets';
import { 
  Image as ImageIcon, 
  RotateCw, 
  UploadCloud, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  X,
  Plus,
  Copy,
  Check,
  Eye,
  Search,
  Layers,
  Link2,
  Sparkles,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Admin.css';

// Gallery Categories
const GALLERY_CATEGORIES = [
  { id: 'Darshan', label: 'Darshan (दिव्य दर्शन)' },
  { id: 'Satsang', label: 'Satsang (सत्संग एवं कथा)' },
  { id: 'Gurukulam', label: 'Gurukulam (गुरुकुलम एवं वेद अध्ययन)' },
  { id: 'Seva', label: 'Gau Seva & Charity (गौ सेवा एवं जनसेवा)' },
  { id: 'Festival', label: 'Festival & Mahotsav (उत्सव एवं महाआरती)' },
  { id: 'Ashram', label: 'Dham & Temple (पावन धाम व आश्रम)' },
  { id: 'General', label: 'General (सामान्य)' }
];

export default function GalleryAdminPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [deletingId, setDeletingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Upload Source Tab: 'file' | 'url' | 'presets'
  const [activeTab, setActiveTab] = useState('file');

  // Multi-file & Single File Queue State
  const [dragActive, setDragActive] = useState(false);
  const [filesQueue, setFilesQueue] = useState([]);
  const [commonCategory, setCommonCategory] = useState('Darshan');
  const fileInputRef = useRef(null);

  // URL Mode State
  const [urlInput, setUrlInput] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [urlCategory, setUrlCategory] = useState('Darshan');
  const [urlPreviewValid, setUrlPreviewValid] = useState(false);

  // Preset Mode State
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [presetTitle, setPresetTitle] = useState('');
  const [presetCategory, setPresetCategory] = useState('Darshan');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Lightbox Modal for Admin Preview
  const [previewModalItem, setPreviewModalItem] = useState(null);

  // Fetch gallery images from Firestore
  const fetchGallery = async () => {
    setLoading(true);
    try {
      let gQuery;
      try {
        gQuery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      } catch (e) {
        gQuery = collection(db, 'gallery');
      }

      const snapshot = await getDocs(gQuery);
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));

      // Sort in memory by createdAt descending if Firestore query was unindexed
      items.sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dbTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dbTime - da;
      });

      setGalleryItems(items);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      try {
        const snap = await getDocs(collection(db, 'gallery'));
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        items.sort((a, b) => {
          const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dbTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dbTime - da;
        });
        setGalleryItems(items);
      } catch (fallbackErr) {
        toast.error(`Unable to load gallery: ${fallbackErr.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Format file size nicely
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Convert raw file into queue item with preview & auto-title
  const processFilesForQueue = (rawFiles) => {
    const validFiles = Array.from(rawFiles).filter((f) => f.type && f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      toast.error('Please select valid image files (PNG, JPG, WebP).');
      return;
    }

    const newQueueItems = validFiles.map((file) => {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        file,
        name: file.name,
        sizeFormatted: formatBytes(file.size),
        previewUrl: URL.createObjectURL(file),
        title: cleanName || 'Shree Abhaydas Ji Darshan',
        category: commonCategory
      };
    });

    setFilesQueue((prev) => [...prev, ...newQueueItems]);
    toast.success(`${validFiles.length} photo${validFiles.length > 1 ? 's' : ''} added to upload queue!`);
  };

  // File Input Change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFilesForQueue(e.target.files);
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
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFilesForQueue(e.dataTransfer.files);
    }
  };

  // Remove an item from the file queue
  const handleRemoveFromQueue = (id) => {
    setFilesQueue((prev) => {
      const item = prev.find((x) => x.id === id);
      if (item && item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((x) => x.id !== id);
    });
  };

  // Update item title or category in queue
  const handleUpdateQueueItem = (id, field, value) => {
    setFilesQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Apply common category to all items in queue
  const handleApplyCommonCategory = (cat) => {
    setCommonCategory(cat);
    setFilesQueue((prev) => prev.map((item) => ({ ...item, category: cat })));
  };

  // Clear all items in queue
  const handleClearQueue = () => {
    filesQueue.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setFilesQueue([]);
  };

  // Execute Upload for File Queue (Single or Batch)
  const handleUploadQueue = async (e) => {
    e.preventDefault();
    if (filesQueue.length === 0) {
      toast.error('No photos in queue to upload.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    const total = filesQueue.length;
    setBatchProgress({ current: 1, total });

    let successCount = 0;
    const errors = [];

    for (let i = 0; i < total; i++) {
      const item = filesQueue[i];
      setBatchProgress({ current: i + 1, total });

      try {
        // Resilient image processing (Compresses locally, uploads to storage or falls back to direct data URL)
        const processed = await processGalleryImage(item.file, (pct) => {
          const overall = Math.round(((i + pct / 100) / total) * 100);
          setUploadProgress(overall);
        });

        // Save metadata record in Firestore collection 'gallery'
        const newDoc = {
          title: item.title.trim() || item.name,
          caption: item.title.trim() || '',
          category: item.category || 'Darshan',
          url: processed.url,
          storagePath: processed.storagePath || '',
          fileName: processed.originalName || item.file.name,
          fileSize: item.file.size,
          dimensions: processed.dimensions || '',
          author: 'admin2233',
          createdAt: new Date().toISOString()
        };

        await addDoc(collection(db, 'gallery'), newDoc);
        successCount++;
      } catch (err) {
        console.error(`Failed to upload ${item.name}:`, err);
        errors.push(`${item.name}: ${err.message}`);
      }
    }

    setUploadProgress(100);
    setUploading(false);

    if (successCount > 0) {
      toast.success(
        successCount === 1
          ? 'Photo added to Gallery successfully!'
          : `Successfully uploaded ${successCount} photos to Gallery!`
      );
      handleClearQueue();
      fetchGallery();
    }

    if (errors.length > 0) {
      toast.error(`Some uploads encountered errors: ${errors.join(', ')}`);
    }
  };

  // Execute Upload for Image URL Mode
  const handleUploadUrl = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      toast.error('Please enter an image URL.');
      return;
    }

    setUploading(true);
    try {
      const cleanTitle = urlTitle.trim() || 'Darshan Photo';
      const newDoc = {
        title: cleanTitle,
        caption: cleanTitle,
        category: urlCategory || 'Darshan',
        url: urlInput.trim(),
        storagePath: '',
        fileName: 'web_image.jpg',
        fileSize: 0,
        author: 'admin2233',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'gallery'), newDoc);
      toast.success('Photo added to Gallery from URL!');
      setUrlInput('');
      setUrlTitle('');
      setUrlPreviewValid(false);
      fetchGallery();
    } catch (err) {
      console.error('Error adding photo from URL:', err);
      toast.error(`Failed to add photo: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Execute Upload for Ashram Presets Mode
  const handleUploadPreset = async (e) => {
    e.preventDefault();
    if (!selectedPreset) {
      toast.error('Please click on a preset photo to select it.');
      return;
    }

    setUploading(true);
    try {
      const newDoc = {
        title: presetTitle.trim() || selectedPreset.title,
        caption: presetTitle.trim() || selectedPreset.description || selectedPreset.title,
        category: presetCategory || selectedPreset.category || 'Darshan',
        url: selectedPreset.url,
        storagePath: '',
        fileName: `${selectedPreset.id}.jpg`,
        fileSize: 0,
        author: 'admin2233',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'gallery'), newDoc);
      toast.success(`"${selectedPreset.title}" added to Gallery!`);
      setSelectedPreset(null);
      setPresetTitle('');
      fetchGallery();
    } catch (err) {
      console.error('Error adding preset photo:', err);
      toast.error(`Failed to add preset: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Delete photo from Firestore & Storage
  const handleDeleteImage = async (id, storagePath, title) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this photo?\n"${title || 'Untitled'}"`);
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'gallery', id));

      if (storagePath) {
        try {
          const fileRef = ref(storage, storagePath);
          await deleteObject(fileRef);
        } catch (storageErr) {
          console.warn('Storage cleanup note:', storageErr.message);
        }
      }

      toast.success('Photo removed from Gallery.');
      setGalleryItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting photo:', err);
      toast.error(`Failed to delete: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Copy photo link to clipboard
  const handleCopyLink = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success('Photo link copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      toast.error('Unable to copy link.');
    }
  };

  // Filter gallery items by search keyword and category
  const filteredGallery = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        filterCategory === 'All' ||
        (item.category && item.category.toLowerCase() === filterCategory.toLowerCase());

      return matchesSearch && matchesCat;
    });
  }, [galleryItems, searchQuery, filterCategory]);

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-heading">Photo Gallery Manager</h1>
          <p className="admin-page-desc">
            Upload and organize darshan photos for the live public gallery.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-secondary"
          onClick={fetchGallery}
          disabled={loading}
        >
          <RotateCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Upload Manager Card */}
      <div className="admin-form-card">
        {/* Source Tabs */}
        <div className="admin-upload-tabs">
          <button
            type="button"
            className={`admin-upload-tab-btn ${activeTab === 'file' ? 'active' : ''}`}
            onClick={() => setActiveTab('file')}
          >
            <UploadCloud size={15} /> Upload Files (Batch / Drag & Drop)
          </button>
          <button
            type="button"
            className={`admin-upload-tab-btn ${activeTab === 'url' ? 'active' : ''}`}
            onClick={() => setActiveTab('url')}
          >
            <Link2 size={15} /> Image URL
          </button>
          <button
            type="button"
            className={`admin-upload-tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => setActiveTab('presets')}
          >
            <Sparkles size={15} /> Ashram Library Presets
          </button>
        </div>

        {/* =========================================================================
            TAB 1: File Upload (Supports Single & Multi-File Drag & Drop Batch)
            ========================================================================= */}
        {activeTab === 'file' && (
          <form onSubmit={handleUploadQueue} className="admin-crud-form">
            {/* Drag & Drop Zone */}
            <div
              className={`admin-upload-dropzone ${dragActive ? 'drag-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="gallery-file-input"
                className="admin-file-hidden"
                accept="image/png, image/jpeg, image/webp"
                multiple
                onChange={handleFileInputChange}
              />
              <label htmlFor="gallery-file-input" className="admin-dropzone-label">
                <UploadCloud size={32} className="text-slate-400" />
                <span className="admin-dropzone-main-text">
                  Choose photos or drag &amp; drop files here
                </span>
                <span className="admin-dropzone-sub-text">
                  Select single or multiple files • Auto-compressed • PNG, JPG, WebP
                </span>
              </label>
            </div>

            {/* Batch Upload Queue */}
            {filesQueue.length > 0 && (
              <div style={{ marginTop: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                      Ready to Upload ({filesQueue.length} {filesQueue.length === 1 ? 'photo' : 'photos'})
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="admin-btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '11.5px' }}
                    >
                      <Plus size={12} /> Add More
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select
                      className="admin-input-control"
                      style={{ padding: '4px 8px', fontSize: '12px', width: 'auto' }}
                      value={commonCategory}
                      onChange={(e) => handleApplyCommonCategory(e.target.value)}
                      title="Set common category for all queued photos"
                    >
                      {GALLERY_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          All as {c.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleClearQueue}
                      className="admin-btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '11.5px', color: '#dc2626' }}
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="admin-batch-queue">
                  {filesQueue.map((item) => (
                    <div key={item.id} className="admin-batch-item">
                      <img src={item.previewUrl} alt="Queue thumbnail" className="admin-batch-thumb" />
                      <div className="admin-batch-details">
                        <input
                          type="text"
                          className="admin-batch-input"
                          value={item.title}
                          onChange={(e) => handleUpdateQueueItem(item.id, 'title', e.target.value)}
                          placeholder="Photo Caption / Title"
                        />
                        <div className="admin-batch-sub">
                          <span>{item.name}</span>
                          <span>•</span>
                          <span>{item.sizeFormatted}</span>
                          <span>•</span>
                          <select
                            style={{
                              border: 'none',
                              background: '#e2e8f0',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              fontSize: '11px',
                              fontWeight: 500
                            }}
                            value={item.category}
                            onChange={(e) => handleUpdateQueueItem(item.id, 'category', e.target.value)}
                          >
                            {GALLERY_CATEGORIES.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.id}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="admin-batch-remove-btn"
                        onClick={() => handleRemoveFromQueue(item.id)}
                        title="Remove from queue"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress Bar */}
            {uploading && (
              <div className="admin-progress-container">
                <div className="admin-progress-label">
                  <span>
                    Uploading photo {batchProgress.current} of {batchProgress.total}...
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="admin-progress-track">
                  <div className="admin-progress-fill" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-btn-primary"
                disabled={uploading || filesQueue.length === 0}
              >
                {uploading ? (
                  `Uploading (${uploadProgress}%)...`
                ) : (
                  <>
                    <UploadCloud size={15} />
                    {filesQueue.length > 1
                      ? `Upload All (${filesQueue.length}) Photos`
                      : 'Upload Photo to Gallery'}
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 2: Image URL
            ========================================================================= */}
        {activeTab === 'url' && (
          <form onSubmit={handleUploadUrl} className="admin-crud-form">
            <div className="admin-upload-grid">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Image Web / Public URL *</label>
                  <input
                    type="url"
                    className="admin-input-control"
                    placeholder="https://example.com/photo.jpg or /images/..."
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      setUrlPreviewValid(true);
                    }}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Photo Caption / Title (Optional)</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    placeholder="e.g. Takhatgarh Dham Darshan"
                    value={urlTitle}
                    onChange={(e) => setUrlTitle(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <select
                    className="admin-input-control"
                    value={urlCategory}
                    onChange={(e) => setUrlCategory(e.target.value)}
                  >
                    {GALLERY_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview Box */}
              <div className="admin-upload-preview-box">
                {urlInput && urlPreviewValid ? (
                  <div className="admin-preview-img-wrap">
                    <img
                      src={urlInput}
                      alt="URL preview"
                      className="admin-preview-img"
                      onError={() => setUrlPreviewValid(false)}
                    />
                    <button
                      type="button"
                      className="admin-preview-remove"
                      onClick={() => {
                        setUrlInput('');
                        setUrlPreviewValid(false);
                      }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <span className="admin-preview-placeholder">Live URL Preview</span>
                )}
              </div>
            </div>

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-btn-primary"
                disabled={uploading || !urlInput.trim()}
              >
                <Plus size={15} /> Add URL to Gallery
              </button>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 3: Ashram Library Presets
            ========================================================================= */}
        {activeTab === 'presets' && (
          <form onSubmit={handleUploadPreset} className="admin-crud-form">
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 10px 0' }}>
              Select a curated photo from the Shree Abhaydas Portal media archive to add directly into the live gallery.
            </p>

            <div className="admin-presets-grid">
              {NEWS_MEDIA_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className={`admin-preset-card ${selectedPreset?.id === preset.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedPreset(preset);
                    setPresetTitle(preset.title);
                    setPresetCategory(preset.category || 'Darshan');
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <img src={preset.url} alt={preset.title} className="admin-preset-img" />
                  <div className="admin-preset-info">
                    <div className="admin-preset-title" title={preset.title}>
                      {preset.title}
                    </div>
                    <div className="admin-preset-cat">{preset.category}</div>
                  </div>
                </div>
              ))}
            </div>

            {selectedPreset && (
              <div style={{ marginTop: '14px', padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div className="admin-form-row">
                  <div className="admin-form-group flex-2">
                    <label className="admin-label">Selected Photo Title</label>
                    <input
                      type="text"
                      className="admin-input-control"
                      value={presetTitle}
                      onChange={(e) => setPresetTitle(e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Category</label>
                    <select
                      className="admin-input-control"
                      value={presetCategory}
                      onChange={(e) => setPresetCategory(e.target.value)}
                    >
                      {GALLERY_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-btn-primary"
                disabled={uploading || !selectedPreset}
              >
                <Plus size={15} /> Add Preset to Gallery
              </button>
            </div>
          </form>
        )}
      </div>

      {/* =========================================================================
          Gallery Items List & Management
          ========================================================================= */}
      <div className="admin-list-card">
        <div className="admin-list-header">
          <h2 className="admin-card-title">
            Published Gallery Photos ({filteredGallery.length}
            {filteredGallery.length !== galleryItems.length ? ` of ${galleryItems.length}` : ''})
          </h2>
          <span className="admin-badge-count">{galleryItems.length} Total Photos</span>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="admin-gallery-filter-bar">
          <div className="admin-filter-search-wrap">
            <Search size={15} className="admin-filter-search-icon" />
            <input
              type="text"
              className="admin-filter-search-input"
              placeholder="Search gallery photos by title, caption, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="admin-filter-chips">
            <button
              type="button"
              className={`admin-filter-chip ${filterCategory === 'All' ? 'active' : ''}`}
              onClick={() => setFilterCategory('All')}
            >
              All ({galleryItems.length})
            </button>
            {GALLERY_CATEGORIES.map((c) => {
              const count = galleryItems.filter(
                (item) => item.category && item.category.toLowerCase() === c.id.toLowerCase()
              ).length;
              if (count === 0 && filterCategory !== c.id) return null;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`admin-filter-chip ${filterCategory === c.id ? 'active' : ''}`}
                  onClick={() => setFilterCategory(c.id)}
                >
                  {c.id} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="admin-loading-indicator">
            <div className="admin-spinner" />
            <span>Fetching gallery photos from Firestore...</span>
          </div>
        ) : filteredGallery.length === 0 ? (
          <div className="admin-empty-state">
            <ImageIcon size={36} className="admin-empty-icon-svg" />
            <h3>No photos found</h3>
            <p>
              {searchQuery || filterCategory !== 'All'
                ? 'Try clearing your search query or category filter.'
                : 'Upload photos using the form above to display them on the live gallery.'}
            </p>
          </div>
        ) : (
          <div className="admin-gallery-grid">
            {filteredGallery.map((item) => (
              <div key={item.id} className="admin-gallery-card">
                <div className="admin-gallery-thumb-wrap">
                  <img
                    src={item.url}
                    alt={item.title || 'Gallery'}
                    className="admin-gallery-thumb"
                    loading="lazy"
                  />
                  <div className="admin-gallery-overlay">
                    {/* View Full Lightbox Modal */}
                    <button
                      type="button"
                      className="admin-gallery-view-btn"
                      onClick={() => setPreviewModalItem(item)}
                      title="Enlarge Photo"
                    >
                      <Eye size={13} />
                    </button>

                    {/* Copy Link */}
                    <button
                      type="button"
                      className="admin-gallery-view-btn"
                      onClick={() => handleCopyLink(item.url, item.id)}
                      title="Copy Photo URL"
                    >
                      {copiedId === item.id ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                    </button>

                    {/* Open in new tab */}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-gallery-view-btn"
                      title="Open in new window"
                    >
                      <ExternalLink size={13} />
                    </a>

                    {/* Delete */}
                    <button
                      type="button"
                      className="admin-gallery-delete-btn"
                      onClick={() => handleDeleteImage(item.id, item.storagePath, item.title)}
                      disabled={deletingId === item.id}
                      title="Delete photo"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="admin-gallery-card-body">
                  <h4 className="admin-gallery-card-title" title={item.title}>
                    {item.title || 'Untitled'}
                  </h4>
                  <div className="admin-gallery-card-meta">
                    <span className="admin-gallery-card-cat">
                      {item.category || 'Darshan'}
                    </span>
                    <span className="admin-gallery-card-date">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          Admin Lightbox Preview Modal
          ========================================================================= */}
      {previewModalItem && (
        <div className="admin-modal-backdrop" onClick={() => setPreviewModalItem(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {previewModalItem.title || 'Gallery Darshan'}
              </h3>
              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setPreviewModalItem(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <img
                src={previewModalItem.url}
                alt={previewModalItem.title}
                className="admin-modal-img"
              />
            </div>

            <div className="admin-modal-footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="admin-cat-badge">{previewModalItem.category || 'Darshan'}</span>
                {previewModalItem.dimensions && <span>{previewModalItem.dimensions}</span>}
                {previewModalItem.createdAt && (
                  <span>Uploaded {new Date(previewModalItem.createdAt).toLocaleDateString()}</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '12px' }}
                  onClick={() => handleCopyLink(previewModalItem.url, previewModalItem.id)}
                >
                  <Copy size={12} /> Copy URL
                </button>
                <a
                  href={previewModalItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '12px', textDecoration: 'none' }}
                >
                  <ExternalLink size={12} /> Full Size
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
