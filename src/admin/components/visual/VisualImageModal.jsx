import React, { useState, useRef } from 'react';
import { Upload, Link2, Sparkles, X, ImageIcon, Check } from 'lucide-react';
import { compressImage } from '../../utils/helpers';

export const ALL_PRESETS = [
  { url: '/images/img_4.jpg', label: 'Maharaj Ji Spiritual Portrait (Main)', category: 'portrait' },
  { url: '/images/img_3.jpg', label: 'Takhatgarh Ashram Parampara', category: 'portrait' },
  { url: '/images/img_5.jpg', label: 'Sanatan Wisdom Stage Darshan', category: 'portrait' },
  { url: '/images/img_10.jpg', label: 'Sacred Temple Artwork', category: 'artwork' },
  { url: '/images/img_11.jpg', label: 'Katha Pravachan Discourse', category: 'katha' },
  { url: '/images/img_12.jpg', label: 'Nani Bai Ka Mayra Discourse', category: 'katha' },
  { url: '/images/img_13.png', label: 'Baba Ramdev Ji Katha Artwork', category: 'katha' },
  { url: '/images/img_14.avif', label: 'Better Life Seva Campaign', category: 'donation' },
  { url: '/images/img_15.jpg', label: 'Clean Water & Nutrition Seva', category: 'donation' },
  { url: '/images/img_16.jpg', label: 'Gurukulam Tribal Education', category: 'donation' },
  { url: '/images/img_17.jpg', label: 'Sacred Gaushala Shelter', category: 'donation' },
  { url: '/images/img_18.jpg', label: 'Devotee Pranam & Blessings', category: 'gallery' },
  { url: '/images/img_19.jpg', label: 'Spiritual Guidance Session', category: 'gallery' },
  { url: '/images/img_20.jpg', label: 'Evening Bhajan Sandhya', category: 'gallery' },
  { url: '/images/img_21.jpg', label: 'National Honor Ceremony', category: 'gallery' },
  { url: '/images/img_22.jpg', label: 'Takhatgarh Dham Seva Assembly', category: 'gallery' },
  { url: '/images/img_25.jpg', label: 'Bhagwat Katha Video Thumbnail', category: 'video' },
  { url: '/images/img_30.png', label: 'Gurukulam News Article', category: 'news' },
  { url: '/images/img_31.webp', label: 'Gaushala News Article', category: 'news' },
  { url: '/images/img_32.jpg', label: 'Dharmasabha News Article', category: 'news' },
  { url: '/images/img_1.png', label: 'Official Gold Logo', category: 'logo' }
];

export default function VisualImageModal({
  isOpen,
  onClose,
  title = 'Change Image',
  currentImage = '',
  onSelectImage,
  presets = ALL_PRESETS
}) {
  const [tab, setTab] = useState('upload');
  const [customUrl, setCustomUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await compressImage(file, { maxWidth: 1600, maxHeight: 1100, quality: 0.84 });
      onSelectImage(result.dataUrl);
      onClose();
    } catch (err) {
      console.error('Image compression failed:', err);
      alert(`Image upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleApplyUrl = () => {
    if (!customUrl.trim()) return;
    onSelectImage(customUrl.trim());
    setCustomUrl('');
    onClose();
  };

  const handleSelectPreset = (url) => {
    onSelectImage(url);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.72)',
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
        {/* Header */}
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
            <strong style={{ fontSize: '14px' }}>{title}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
          >
            <X size={18} color="#ffffff" />
          </button>
        </div>

        {/* Current Image Preview Strip if available */}
        {currentImage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 20px',
            backgroundColor: '#f1f5f9',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '6px',
              overflow: 'hidden',
              backgroundColor: '#e2e8f0',
              flexShrink: 0
            }}>
              <img src={currentImage} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>CURRENT IMAGE</div>
              <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentImage.startsWith('data:') ? 'Custom Uploaded Data Image' : currentImage}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          padding: '4px 12px 0'
        }}>
          <button
            type="button"
            onClick={() => setTab('upload')}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: tab === 'upload' ? '2px solid #0284c7' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: tab === 'upload' ? '#0284c7' : '#64748b',
              fontWeight: '700',
              fontSize: '12.5px',
              cursor: 'pointer'
            }}
          >
            <Upload size={13} style={{ display: 'inline', marginRight: '6px' }} /> Upload New Image
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: tab === 'url' ? '2px solid #0284c7' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: tab === 'url' ? '#0284c7' : '#64748b',
              fontWeight: '700',
              fontSize: '12.5px',
              cursor: 'pointer'
            }}
          >
            <Link2 size={13} style={{ display: 'inline', marginRight: '6px' }} /> Enter URL
          </button>
          <button
            type="button"
            onClick={() => setTab('presets')}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: tab === 'presets' ? '2px solid #0284c7' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: tab === 'presets' ? '#0284c7' : '#64748b',
              fontWeight: '700',
              fontSize: '12.5px',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={13} style={{ display: 'inline', marginRight: '6px' }} /> Choose Preset
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {tab === 'upload' && (
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
                onClick={() => !uploading && fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: '36px 20px',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  cursor: uploading ? 'wait' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {uploading ? (
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

          {tab === 'url' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="admin-label">Image URL or Relative Path</label>
                <input
                  type="url"
                  className="admin-input-control"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg or /images/img_10.jpg"
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="admin-btn-primary"
                  onClick={handleApplyUrl}
                  disabled={!customUrl.trim()}
                  style={{ backgroundColor: '#0284c7', borderColor: '#0284c7' }}
                >
                  <Check size={14} /> Apply Image
                </button>
              </div>
            </div>
          )}

          {tab === 'presets' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '12px',
              maxHeight: '340px',
              overflowY: 'auto',
              paddingRight: '4px'
            }}>
              {presets.map((preset) => (
                <div
                  key={preset.url}
                  onClick={() => handleSelectPreset(preset.url)}
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: '#ffffff'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0284c7'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ height: '75px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                    <img
                      src={preset.url}
                      alt={preset.label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{
                    padding: '6px 8px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#0f172a',
                    lineHeight: '1.25',
                    maxHeight: '34px',
                    overflow: 'hidden'
                  }}>
                    {preset.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
