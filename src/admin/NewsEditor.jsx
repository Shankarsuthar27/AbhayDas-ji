import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useAdminAuth } from './AdminAuthContext';
import { 
  slugify, 
  calculateReadingTime, 
  uploadToFirebaseStorage, 
  processNewsImage, 
  compressImage 
} from './utils/helpers';
import { NEWS_MEDIA_PRESETS } from './utils/mediaPresets';
import { TipTapEditor } from './editor/TipTapEditor';
import {
  ArrowLeft,
  Save,
  Sparkles,
  AlertCircle,
  Hash,
  X,
  Upload,
  Loader2,
  ImagePlus,
  Trash2,
  Globe,
  FileText,
  FolderTree,
  Calendar,
  Copy,
  Check,
  Eye,
  CheckCircle2,
  Plus,
  RefreshCw,
  Maximize2,
  Layers,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import './editor/Editor.css';

// Pre-defined categories for Shree Abhaydas Portal
const DEFAULT_CATEGORIES = [
  { id: 'spiritual', name: 'Spiritual & Satsang (आध्यात्मिक)' },
  { id: 'gurukulam', name: 'Gurukulam & Education (गुरुकुलम शिक्षा)' },
  { id: 'social', name: 'Social Welfare & Gau Seva (समाज एवं गौ सेवा)' },
  { id: 'press', name: 'Press Release (प्रेस विज्ञप्ति)' },
  { id: 'events', name: 'Events & Kathas (कथा एवं महोत्सव)' },
  { id: 'general', name: 'General News (सामान्य समाचार)' }
];

// Pre-defined popular tags
const INITIAL_TAGS = [
  'ShreeAbhaydas',
  'Gurukulam',
  'Takhatgarh',
  'GauSeva',
  'TribalWelfare',
  'BhagwatKatha',
  'SanatanDharma',
  'PaliDham'
];

export const NewsEditor = ({ editId = null, onBack, onSaved }) => {
  const isEditMode = Boolean(editId);
  const { currentUser } = useAdminAuth();

  const [loadingInitial, setLoadingInitial] = useState(isEditMode);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [additionalImages, setAdditionalImages] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [availableTags, setAvailableTags] = useState(INITIAL_TAGS);
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);
  const [status, setStatus] = useState('published');
  const [featured, setFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState('1 min read');

  // Cover Image States
  const [imageTab, setImageTab] = useState('upload'); // 'upload' | 'url' | 'presets'
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingMore, setUploadingMore] = useState(false);
  const [moreProgress, setMoreProgress] = useState(0);
  const [imageMeta, setImageMeta] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [imageLoadError, setImageLoadError] = useState(false);

  const [copiedSlug, setCopiedSlug] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const imageInputRef = useRef(null);
  const moreImageInputRef = useRef(null);

  // Load existing article data when editId is provided
  useEffect(() => {
    if (!editId) return;

    let isMounted = true;
    const loadArticle = async () => {
      setLoadingInitial(true);
      try {
        const docRef = doc(db, 'news', editId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && isMounted) {
          const data = docSnap.data();
          setTitle(data.title || '');
          setSlug(data.slug || slugify(data.title || ''));
          setExcerpt(data.excerpt || data.description || '');
          setContent(data.content || `<p>${data.description || ''}</p>`);
          
          const existingImg = data.featuredImage || data.image || data.url || data.imageUrl || '';
          setFeaturedImage(existingImg);
          if (existingImg) {
            setImageMeta({
              fileName: 'Current Cover',
              source: existingImg.startsWith('data:') ? 'direct' : existingImg.startsWith('/') ? 'preset' : 'url'
            });
          }

          // Load additional gallery images
          const addl = data.galleryImages || data.additionalImages || (data.secondaryImage ? [data.secondaryImage] : []);
          setAdditionalImages(Array.isArray(addl) ? addl.filter((url) => url && url !== existingImg) : []);

          setCategoryId(data.categoryId || (data.category ? data.category.toLowerCase() : ''));
          setSelectedTags(data.tags || []);
          setStatus(data.status || 'published');
          setFeatured(Boolean(data.featured));
          setSeoTitle(data.seoTitle || '');
          setSeoDescription(data.seoDescription || '');
          setScheduledAt(data.scheduledAt || '');
        } else if (isMounted) {
          toast.error('Article document not found in Firestore.');
        }
      } catch (err) {
        console.error('Error fetching article for editing:', err);
        if (isMounted) toast.error(`Failed to load article: ${err.message}`);
      } finally {
        if (isMounted) setLoadingInitial(false);
      }
    };

    loadArticle();
    return () => { isMounted = false; };
  }, [editId]);

  // Recalculate reading time on content change
  useEffect(() => {
    const time = calculateReadingTime(content);
    setReadingTime(time);
  }, [content]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditMode || !slug) {
      setSlug(slugify(val));
    }
  };

  // Single file process handler
  const handleProcessFile = async (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WebP, AVIF).');
      return;
    }

    setUploadingImage(true);
    setUploadProgress(15);
    setImageLoadError(false);

    try {
      const result = await processNewsImage(file, (pct) => {
        setUploadProgress(pct);
      });

      setFeaturedImage(result.url);
      setImageMeta({
        dimensions: result.dimensions,
        sizeKB: result.sizeKB,
        fileName: result.originalName,
        source: result.source
      });

      if (result.source === 'storage') {
        toast.success('Cover image uploaded to Firebase Storage!');
      } else {
        toast.success(`Cover image optimized & ready! (${result.dimensions}, ~${result.sizeKB} KB)`);
      }
    } catch (err) {
      console.error('Image processing note:', err);
      try {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setFeaturedImage(ev.target.result);
          setImageMeta({ fileName: file.name, source: 'direct' });
          toast.success('Cover image attached!');
        };
        reader.readAsDataURL(file);
      } catch (fallbackErr) {
        toast.error(`Image upload failed: ${err.message}`);
      }
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  // Multiple files handler (first file is cover, remainder are additional images)
  const handleProcessMultipleFiles = async (filesList) => {
    const files = Array.from(filesList).filter((f) => f.type && f.type.startsWith('image/'));
    if (files.length === 0) {
      toast.error('No supported image files selected.');
      return;
    }

    setUploadingImage(true);
    setUploadProgress(10);
    setImageLoadError(false);

    try {
      const firstFile = files[0];
      const firstResult = await processNewsImage(firstFile, (pct) => {
        setUploadProgress(Math.round(pct / files.length));
      });

      setFeaturedImage(firstResult.url);
      setImageMeta({
        dimensions: firstResult.dimensions,
        sizeKB: firstResult.sizeKB,
        fileName: firstResult.originalName,
        source: firstResult.source
      });

      if (files.length > 1) {
        const remainingUrls = [];
        for (let i = 1; i < files.length; i++) {
          const res = await processNewsImage(files[i], (pct) => {
            const overall = Math.round(((i + pct / 100) / files.length) * 100);
            setUploadProgress(overall);
          });
          remainingUrls.push(res.url);
        }
        setAdditionalImages((prev) => [...prev, ...remainingUrls]);
        toast.success(`Cover image & ${files.length - 1} additional photos attached!`);
      } else {
        toast.success('Cover image attached!');
      }
    } catch (err) {
      console.error('Multi image upload error:', err);
      toast.error(`Image processing failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handleImageFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files.length === 1) {
        handleProcessFile(files[0]);
      } else {
        handleProcessMultipleFiles(files);
      }
      e.target.value = '';
    }
  };

  // Add more images handler
  const handleProcessMoreFiles = async (filesList) => {
    const files = Array.from(filesList).filter((f) => f.type && f.type.startsWith('image/'));
    if (files.length === 0) {
      toast.error('Please select valid image files.');
      return;
    }

    setUploadingMore(true);
    setMoreProgress(10);

    try {
      const newUrls = [];
      for (let i = 0; i < files.length; i++) {
        const res = await processNewsImage(files[i], (pct) => {
          const overall = Math.round(((i + pct / 100) / files.length) * 100);
          setMoreProgress(overall);
        });
        newUrls.push(res.url);
      }
      setAdditionalImages((prev) => [...prev, ...newUrls]);
      toast.success(`${newUrls.length} more image(s) added!`);
    } catch (err) {
      console.error('Error adding more images:', err);
      toast.error('Failed to process additional images: ' + err.message);
    } finally {
      setUploadingMore(false);
      setMoreProgress(0);
    }
  };

  const handleMoreFilesChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleProcessMoreFiles(files);
      e.target.value = '';
    }
  };

  // Promote an additional image to primary cover image
  const handlePromoteToCover = (index) => {
    const selected = additionalImages[index];
    const oldCover = featuredImage;
    const updated = [...additionalImages];
    if (oldCover) {
      updated[index] = oldCover;
    } else {
      updated.splice(index, 1);
    }
    setFeaturedImage(selected);
    setAdditionalImages(updated);
    setImageMeta({
      fileName: `Photo #${index + 2}`,
      source: selected.startsWith('data:') ? 'direct' : selected.startsWith('/') ? 'preset' : 'url'
    });
    toast.success('Image set as main Cover photo!');
  };

  // Remove an additional image
  const handleRemoveAdditional = (index) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    toast('Image removed', { icon: '🗑️' });
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      toast.error('Please enter an image URL');
      return;
    }
    setFeaturedImage(trimmed);
    setImageLoadError(false);
    setImageMeta({
      fileName: 'Web Image',
      source: 'url'
    });
    toast.success('Cover image URL applied!');
  };

  const handleSelectPreset = (preset) => {
    setFeaturedImage(preset.url);
    setImageLoadError(false);
    setImageMeta({
      fileName: preset.title,
      source: 'preset'
    });
    toast.success(`Selected "${preset.title}" as cover image!`);
  };

  const handleRemoveImage = () => {
    // If there are additional images, promote the first one to cover
    if (additionalImages.length > 0) {
      const nextCover = additionalImages[0];
      setFeaturedImage(nextCover);
      setAdditionalImages((prev) => prev.slice(1));
      setImageMeta({
        fileName: 'Cover Photo',
        source: nextCover.startsWith('data:') ? 'direct' : nextCover.startsWith('/') ? 'preset' : 'url'
      });
      toast.success('Previous cover removed; first additional image promoted to cover!');
    } else {
      setFeaturedImage('');
      setImageMeta(null);
      setUrlInput('');
      setImageLoadError(false);
      toast('Cover image removed', { icon: '🗑️' });
    }
  };

  // AI Auto-fill SEO metadata
  const handleAiDescription = () => {
    if (!title.trim()) {
      toast.error('Please enter an article title first');
      return;
    }
    toast.success('AI generating SEO metadata & parameters...', { icon: '🤖' });
    setTimeout(() => {
      const cleanSlug = slugify(title);
      setSlug(cleanSlug);
      setSeoTitle(`${title} | Shree Abhaydas Portal`);
      setSeoDescription(
        excerpt
          ? excerpt.slice(0, 155)
          : `Read the official story on "${title}" from Sadguru Trikam Das Ji Dham and Pujya Swami Shree Abhaydas Ji Maharaj.`
      );
      toast.success('SEO & Slug parameters auto-filled!');
    }, 700);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    const cleaned = customTagInput.trim().replace(/^#/, '');
    if (!cleaned) return;
    if (!availableTags.includes(cleaned)) {
      setAvailableTags((prev) => [...prev, cleaned]);
    }
    if (!selectedTags.includes(cleaned)) {
      setSelectedTags((prev) => [...prev, cleaned]);
    }
    setCustomTagInput('');
    setShowAddTag(false);
  };

  const copyFullUrl = () => {
    const fullUrl = `https://shreeabhaydas.com/news/${slug || 'article'}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(true);
    toast.success('Article URL copied to clipboard!');
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  // Save / Publish to Firestore
  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Article title is required');
      return;
    }
    if (!content.trim() || content === '<p></p>') {
      toast.error('Article story body content is required');
      return;
    }

    setIsSaving(true);
    try {
      const selectedCategoryObj = DEFAULT_CATEGORIES.find((c) => c.id === categoryId);
      const categoryLabel = selectedCategoryObj ? selectedCategoryObj.name.split(' (')[0] : 'Uncategorized';

      const finalSlug = slug || slugify(title);
      const plainTextContent = content.replace(/<[^>]*>/g, ' ').trim();
      const finalExcerpt = excerpt.trim() || plainTextContent.slice(0, 180) + '...';

      const articlePayload = {
        title: title.trim(),
        slug: finalSlug,
        excerpt: finalExcerpt,
        description: finalExcerpt,
        content: content,
        featuredImage: featuredImage || null,
        image: featuredImage || null,
        imageUrl: featuredImage || null,
        url: featuredImage || null,
        secondaryImage: additionalImages.length > 0 ? additionalImages[0] : null,
        galleryImages: additionalImages,
        additionalImages: additionalImages,
        categoryId: categoryId || 'uncategorized',
        category: categoryLabel,
        tags: selectedTags,
        status: status,
        featured: Boolean(featured),
        seoTitle: seoTitle || `${title.trim()} | Shree Abhaydas Portal`,
        seoDescription: seoDescription || finalExcerpt.slice(0, 155),
        readingTime: readingTime,
        date: new Date().toISOString().split('T')[0],
        publishedAt: status === 'published' ? new Date().toISOString() : null,
        scheduledAt: status === 'scheduled' && scheduledAt ? scheduledAt : null,
        author: currentUser?.username || 'admin2233',
        updatedAt: new Date().toISOString()
      };

      if (isEditMode && editId) {
        const docRef = doc(db, 'news', editId);
        await updateDoc(docRef, articlePayload);
        toast.success('Article updated successfully in Firestore!');
      } else {
        articlePayload.createdAt = new Date().toISOString();
        const docRef = await addDoc(collection(db, 'news'), articlePayload);
        toast.success(`Article published to Firestore! (ID: ${docRef.id.slice(0, 6)}...)`);
      }

      if (onSaved) onSaved();
      else if (onBack) onBack();
    } catch (err) {
      console.error('Error saving article to Firestore:', err);
      toast.error(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Publishing readiness checklist
  const checklist = [
    { label: 'Headline Title', done: Boolean(title.trim()) },
    { label: 'Story Body Content', done: Boolean(content.trim() && content !== '<p></p>') },
    { label: 'Cover Image', done: Boolean(featuredImage) },
    { label: 'Category Selected', done: Boolean(categoryId) },
    { label: 'SEO Metadata', done: Boolean(seoTitle || seoDescription) }
  ];
  const completedCount = checklist.filter((item) => item.done).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  if (loadingInitial) {
    return (
      <div className="flex items-center justify-center py-32 text-center" style={{ minHeight: '400px' }}>
        <Loader2 className="animate-spin text-[#0891B2] mx-auto mb-3" size={36} />
        <p className="text-sm text-slate-500 font-medium">Loading article details from Firestore...</p>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSave}
      className="news-editor-container"
    >
      {/* Sticky Upper Control Header */}
      <div className="news-editor-header">
        <div className="news-header-left">
          <button
            type="button"
            onClick={onBack}
            className="news-back-btn"
            title="Back to articles list"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="news-header-title-wrap">
            <div className="news-header-title-row">
              <h1 className="news-header-heading">
                {isEditMode ? 'Edit Article' : 'Write New Article'}
              </h1>
              <span className="news-status-pill">
                <span className="news-status-dot" />
                {status}
              </span>
            </div>
            <p className="news-header-subtitle">
              <span>Create and publish rich content with Firestore backend</span>
              <span>•</span>
              <span className="news-saved-indicator">Auto-ready</span>
            </p>
          </div>
        </div>

        {/* Action Buttons Header */}
        <div className="news-header-actions">
          {slug && (
            <a
              href={`/news`}
              target="_blank"
              rel="noopener noreferrer"
              className="news-btn-preview"
              title="Preview on live website"
            >
              <Eye size={14} /> Preview
            </a>
          )}

          <button
            type="button"
            onClick={() => {
              setStatus('draft');
              toast('Status set to draft', { icon: '📝' });
            }}
            className="news-btn-draft"
          >
            Save Draft
          </button>

          <button
            type="submit"
            disabled={isSaving}
            onClick={() => {
              if (status !== 'scheduled') setStatus('published');
            }}
            className="news-btn-publish"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? 'Saving...' : isEditMode ? 'Update Article' : 'Publish Now'}
          </button>
        </div>
      </div>

      {/* Editor Body 12-Column Grid */}
      <div className="news-editor-grid">
        {/* Main Writing Area (Left 8 Columns) */}
        <div className="news-main-col">
          {/* Frameless Notion-Style Title Input Card */}
          <div className="news-title-card">
            <div>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter article headline..."
                className="news-headline-input"
              />
            </div>
          </div>

          {/* TipTap Rich Text Story Content Editor */}
          <div className="news-story-editor-section">
            <div className="news-story-header-row">
              <label className="news-story-label">
                STORY BODY CONTENT <span className="news-required-star">*</span>
              </label>
              <div className="news-story-badge">
                {wordCount} words · {typeof readingTime === 'number' ? `${readingTime} min read` : readingTime || '1 min read'}
              </div>
            </div>
            <TipTapEditor
              value={content}
              onChange={setContent}
              onWordCountChange={setWordCount}
              status={status}
            />
          </div>
        </div>

        {/* Right Publishing Sidebar (Right 4 Columns) */}
        <div className="news-sidebar-col">
          {/* Publishing Checklist Readiness Card */}
          <div className="news-side-card">
            <div className="news-checklist-header">
              <h3 className="news-side-card-title">
                <CheckCircle2 size={15} className="text-[#0891B2]" /> Publishing Readiness
              </h3>
              <span className="text-xs font-bold text-[#0891B2] font-mono">
                {progressPercent}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="news-progress-bar-bg">
              <div
                className="news-progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Checklist Items */}
            <div className="news-checklist-items">
              {checklist.map((item) => (
                <div key={item.label} className="news-checklist-row">
                  <span className={item.done ? 'news-checklist-done' : 'news-checklist-pending'}>
                    {item.label}
                  </span>
                  <span className={item.done ? 'text-emerald-500 font-bold' : 'text-slate-400 font-mono'}>
                    {item.done ? '✓' : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgraded Multi-Image Cover & Gallery Section */}
          <div className="news-side-card">
            <div className="news-side-card-header-row">
              <h3 className="news-side-card-title">
                <ImagePlus size={15} className="text-[#0891B2]" /> Cover &amp; Photos
              </h3>
              {featuredImage && (
                <span className="news-image-source-badge">
                  {additionalImages.length > 0 ? `${1 + additionalImages.length} Photos` : 'Cover Ready'}
                </span>
              )}
            </div>

            {/* 3-Way Segmented Tabs */}
            <div className="news-image-tabs">
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`news-image-tab-btn ${imageTab === 'upload' ? 'active' : ''}`}
              >
                <Upload size={12} /> Upload File
              </button>
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`news-image-tab-btn ${imageTab === 'url' ? 'active' : ''}`}
              >
                <Globe size={12} /> Image URL
              </button>
              <button
                type="button"
                onClick={() => setImageTab('presets')}
                className={`news-image-tab-btn ${imageTab === 'presets' ? 'active' : ''}`}
              >
                <Sparkles size={12} /> Library ({NEWS_MEDIA_PRESETS.length})
              </button>
            </div>

            {/* TAB 1: File Upload & Drag & Drop */}
            {imageTab === 'upload' && (
              <div>
                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp, image/gif, image/avif"
                  onChange={handleImageFileChange}
                  style={{ display: 'none' }}
                />

                <div
                  className={`news-dropzone-box ${isDragging ? 'dragging' : ''}`}
                  onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                    const files = e.dataTransfer?.files;
                    if (files && files.length > 0) {
                      if (files.length === 1) handleProcessFile(files[0]);
                      else handleProcessMultipleFiles(files);
                    }
                  }}
                  onClick={() => !uploadingImage && imageInputRef.current?.click()}
                  tabIndex={0}
                  onPaste={(e) => {
                    const file = e.clipboardData?.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      e.preventDefault();
                      handleProcessFile(file);
                    }
                  }}
                  title="Click to browse 1 or more images, drag & drop, or paste (Ctrl+V)"
                >
                  {uploadingImage ? (
                    <div className="news-dropzone-uploading-state">
                      <Loader2 size={24} className="animate-spin text-[#0891B2] mb-2" />
                      <div className="news-dropzone-title">Optimizing & Processing Photos...</div>
                      <div className="news-upload-progress-wrap">
                        <div className="news-upload-progress-bar" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <span className="text-[11px] font-mono text-[#0891B2]">{uploadProgress}%</span>
                    </div>
                  ) : (
                    <>
                      <div className="news-dropzone-icon-circle">
                        <Upload size={18} className="text-[#0891B2]" />
                      </div>
                      <div className="news-dropzone-title">
                        {isDragging ? 'Drop Images Here!' : 'Click or Drag Images'}
                      </div>
                      <div className="news-dropzone-subtitle">
                        Select 1 or multiple photos (JPG, PNG, WebP)
                      </div>
                      <div className="news-dropzone-badge">
                        ⚡ Auto-optimized & instant preview
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Image URL Input */}
            {imageTab === 'url' && (
              <div className="news-url-input-block">
                <div className="news-url-input-wrap">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/photo.jpg..."
                    className="news-cover-url-input"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyUrl();
                      }
                    }}
                  />
                  {urlInput && (
                    <button
                      type="button"
                      onClick={() => setUrlInput('')}
                      className="news-url-clear-btn"
                      title="Clear URL"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="news-btn-apply-url"
                >
                  Apply Cover Image URL
                </button>
              </div>
            )}

            {/* TAB 3: Media Presets Grid */}
            {imageTab === 'presets' && (
              <div className="news-presets-container">
                <div className="news-presets-grid">
                  {NEWS_MEDIA_PRESETS.map((preset) => {
                    const isSelected = featuredImage === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`news-preset-card ${isSelected ? 'selected' : ''}`}
                        title={preset.description}
                      >
                        <div className="news-preset-thumb-wrap">
                          <img src={preset.url} alt={preset.title} loading="lazy" />
                          {isSelected && (
                            <div className="news-preset-check-badge">
                              <Check size={11} strokeWidth={3} />
                            </div>
                          )}
                          <span className="news-preset-cat-tag">{preset.category}</span>
                        </div>
                        <div className="news-preset-label">{preset.title}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Primary Cover Image Preview Banner */}
            {featuredImage ? (
              <div className="news-preview-container">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex justify-between items-center">
                  <span>Primary Cover Image</span>
                  <span className="text-[#0891B2] font-semibold">Banner</span>
                </div>
                <div className="news-image-preview-wrap">
                  <img
                    src={featuredImage}
                    alt="Article Cover Preview"
                    onError={() => {
                      setImageLoadError(true);
                      toast.error('Image could not be loaded. Please verify the URL or select another file.');
                    }}
                    onLoad={() => setImageLoadError(false)}
                  />
                  {imageLoadError && (
                    <div className="news-image-error-fallback">
                      <AlertCircle size={20} className="mb-1" />
                      <span>Image Failed to Load</span>
                    </div>
                  )}
                  <div className="news-image-overlay">
                    <button
                      type="button"
                      onClick={() => {
                        setImageTab('upload');
                        imageInputRef.current?.click();
                      }}
                      className="news-img-action-btn replace"
                      title="Upload a new file"
                    >
                      <RefreshCw size={11} /> Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLightboxImage(featuredImage);
                        setShowLightbox(true);
                      }}
                      className="news-img-action-btn view"
                      title="View full image"
                    >
                      <Maximize2 size={11} /> View Full
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="news-img-action-btn remove"
                      title="Remove this cover image"
                    >
                      <Trash2 size={11} /> Remove
                    </button>
                  </div>
                </div>

                {/* Metadata & Quick Copy bar */}
                <div className="news-image-meta-bar">
                  <span className="news-image-meta-text">
                    {imageMeta?.dimensions ? `${imageMeta.dimensions}` : '16:9 Cover'}
                    {imageMeta?.sizeKB ? ` · ${imageMeta.sizeKB} KB` : ''}
                    {imageMeta?.fileName ? ` · ${imageMeta.fileName.slice(0, 16)}...` : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(featuredImage);
                      toast.success('Image link copied!');
                    }}
                    className="news-image-copy-link-btn"
                    title="Copy Image URL"
                  >
                    <Copy size={11} /> Copy Link
                  </button>
                </div>

                {/* Additional Images / More Photos Section */}
                <div className="news-more-images-block">
                  <div className="news-more-images-header">
                    <span className="news-more-images-title">
                      <Layers size={13} className="text-[#0891B2]" /> Additional Photos
                      <span className="news-more-images-count-pill">{additionalImages.length}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => moreImageInputRef.current?.click()}
                      disabled={uploadingMore}
                      className="news-btn-add-more-img"
                      title="Upload more images"
                    >
                      <Plus size={12} /> Add More
                    </button>
                  </div>

                  {/* Hidden file input for additional images */}
                  <input
                    ref={moreImageInputRef}
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/webp, image/gif, image/avif"
                    onChange={handleMoreFilesChange}
                    style={{ display: 'none' }}
                  />

                  {uploadingMore && (
                    <div className="news-dropzone-uploading-state py-2 mb-2">
                      <Loader2 size={18} className="animate-spin text-[#0891B2] mb-1" />
                      <span className="text-[11px] font-semibold text-slate-700">Processing images {moreProgress}%...</span>
                      <div className="news-upload-progress-wrap" style={{ width: '90%', height: '4px' }}>
                        <div className="news-upload-progress-bar" style={{ width: `${moreProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Additional Images Grid */}
                  {additionalImages.length > 0 && (
                    <div className="news-more-grid">
                      {additionalImages.map((imgUrl, idx) => (
                        <div key={idx} className="news-more-card">
                          <img src={imgUrl} alt={`Additional photo ${idx + 1}`} loading="lazy" />
                          <span className="news-more-card-badge">Photo #{idx + 2}</span>
                          <div className="news-more-card-overlay">
                            <button
                              type="button"
                              onClick={() => handlePromoteToCover(idx)}
                              className="news-more-icon-btn cover"
                              title="Set as Main Cover Image"
                            >
                              <Star size={12} fill="currentColor" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLightboxImage(imgUrl);
                                setShowLightbox(true);
                              }}
                              className="news-more-icon-btn view"
                              title="View full image"
                            >
                              <Maximize2 size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveAdditional(idx)}
                              className="news-more-icon-btn remove"
                              title="Remove photo"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add more interactive dropzone box */}
                  <div
                    className="news-more-add-box"
                    onClick={() => !uploadingMore && moreImageInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = e.dataTransfer?.files;
                      if (files && files.length > 0) handleProcessMoreFiles(files);
                    }}
                  >
                    <Plus size={14} className="text-[#0891B2]" />
                    <span>Upload More Photos (Multiple Supported)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="news-preview-empty-state">
                <ImagePlus size={22} className="text-slate-300 mb-1" />
                <span>No cover image selected</span>
                <span className="text-[10px] text-slate-400">Choose an option above to attach photos</span>
              </div>
            )}
          </div>

          {/* Classification & Category Selector Card */}
          <div className="news-side-card">
            <h3 className="news-side-card-title">
              <FolderTree size={15} className="text-[#0891B2]" /> Category &amp; Tags
            </h3>

            {/* Category Select */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="news-select-control"
              >
                <option value="">Select Category</option>
                {DEFAULT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Pills */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Article Tags
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddTag(!showAddTag)}
                  className="news-tag-add-trigger"
                >
                  <Plus size={11} /> Add Tag
                </button>
              </div>

              {showAddTag && (
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                    placeholder="New tag..."
                    className="news-tag-input"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="news-tag-save-btn"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 mt-2">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`news-tag-chip ${isSelected ? 'selected' : ''}`}
                    >
                      <Hash size={11} /> {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Publishing Settings Card */}
          <div className="news-side-card">
            <h3 className="news-side-card-title">
              <Calendar size={15} className="text-[#0891B2]" /> Publishing Status
            </h3>

            {/* Status Selector */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Status
              </label>
              <div className="news-status-toggle-grid">
                {['published', 'draft', 'scheduled'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`news-status-toggle-btn ${status === st ? 'active' : ''}`}
                  >
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Scheduled Date Picker */}
            {status === 'scheduled' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Publish Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="news-cover-url-input"
                />
              </div>
            )}

            {/* Featured Article Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="featuredCheck"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#0891B2] accent-[#0891B2] cursor-pointer"
              />
              <label htmlFor="featuredCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Feature on Homepage Carousel
              </label>
            </div>

            {/* Custom URL Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  URL Slug
                </label>
                <button
                  type="button"
                  onClick={copyFullUrl}
                  className="news-slug-copy-btn"
                  title="Copy preview link"
                >
                  {copiedSlug ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                  <span>{copiedSlug ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="news-slug-input-wrap">
                <span className="news-slug-prefix">/news/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="custom-article-slug"
                  className="news-slug-input"
                />
              </div>
            </div>
          </div>

          {/* SEO Metadata & Quality Card */}
          <div className="news-side-card">
            <div className="flex justify-between items-center">
              <h3 className="news-side-card-title">SEO Metadata</h3>
              <button
                type="button"
                onClick={handleAiDescription}
                className="news-ai-btn"
              >
                <Sparkles size={11} /> AI Auto-Fill
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="SEO page title..."
                className="news-cover-url-input"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Meta Description
              </label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="SEO search engine summary description..."
                rows={3}
                className="news-excerpt-textarea"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal for Any Image */}
      {showLightbox && (lightboxImage || featuredImage) && (
        <div className="news-lightbox-backdrop" onClick={() => setShowLightbox(false)}>
          <div className="news-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowLightbox(false)}
              className="news-lightbox-close"
              title="Close image preview"
            >
              <X size={18} />
            </button>
            <img src={lightboxImage || featuredImage} alt="Full Preview" />
          </div>
        </div>
      )}
    </motion.form>
  );
};
export default NewsEditor;
