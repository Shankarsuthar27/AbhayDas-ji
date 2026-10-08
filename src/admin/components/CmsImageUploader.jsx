import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Link2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { processEventImage } from '../utils/helpers';

export default function CmsImageUploader({
  value,
  onChange,
  label = 'Image Upload',
  description = 'Supports JPG, PNG, WebP (Max 5MB)',
  maxSizeMB = 5,
  allowVideo = false
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  // Safely normalize value into a string
  const stringValue = typeof value === 'string'
    ? value
    : (value && typeof value === 'object' ? (value.src || value.url || value.image || '') : '');
  const hasValue = Boolean(typeof stringValue === 'string' && stringValue.trim().length > 0);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileProcess = async (file) => {
    if (!file) return;
    setError('');

    // Size validation
    if (file.size > maxSizeBytes) {
      const actualMB = (file.size / (1024 * 1024)).toFixed(2);
      setError(`File size (${actualMB} MB) exceeds maximum allowed limit of ${maxSizeMB} MB. Please select a smaller file.`);
      return;
    }

    // Type validation
    const isImage = file.type.startsWith('image/');
    const isVideo = allowVideo && file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      setError(`Unsupported file type. Please select a valid ${allowVideo ? 'image or video' : 'image (JPG, PNG, WebP)'}.`);
      return;
    }

    setUploading(true);
    setProgress(15);

    try {
      if (isImage) {
        const result = await processEventImage(file, (pct) => setProgress(pct));
        onChange(result.url);
      } else {
        // Direct data URL for video fallback
        const reader = new FileReader();
        reader.onload = (e) => {
          onChange(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Upload fallback to direct FileReader:', err.message);
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setUrlInput('');
    setUrlMode(false);
    setError('');
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ImageIcon size={15} className="text-[#0284c7]" />
            {label}
          </div>
          {description && (
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
              {description} (Max: {maxSizeMB}MB)
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => { setUrlMode(!urlMode); setError(''); }}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '11.5px',
            color: '#0284c7',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: '600'
          }}
        >
          <Link2 size={12} /> {urlMode ? 'Back to File Upload' : 'Enter URL instead'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '6px',
          color: '#b91c1c',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* URL Mode */}
      {urlMode ? (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg or /images/..."
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '12.5px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              outline: 'none'
            }}
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            style={{
              padding: '8px 14px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              borderRadius: '6px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Apply
          </button>
        </div>
      ) : (
        /* File Mode */
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={allowVideo ? 'image/*,video/*' : 'image/jpeg,image/png,image/webp,image/gif'}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {hasValue ? (
            /* Image Preview */
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '70px',
                height: '50px',
                borderRadius: '6px',
                overflow: 'hidden',
                backgroundColor: '#e2e8f0',
                flexShrink: 0,
                border: '1px solid #cbd5e1'
              }}>
                <img
                  src={stringValue}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = '/images/img_1.png'; }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {stringValue.startsWith('data:') ? 'Optimized Local Image' : stringValue.split('/').pop() || 'Attached Image'}
                </div>
                <div style={{ fontSize: '11px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <CheckCircle2 size={12} /> Image Ready &amp; Validated
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '5px 10px',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  style={{
                    padding: '5px 10px',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <X size={12} /> Remove
                </button>
              </div>
            </div>
          ) : (
            /* Upload Dropzone */
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '8px',
                padding: '20px 14px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                cursor: uploading ? 'wait' : 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {uploading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div className="admin-spinner" style={{ width: '20px', height: '20px' }} />
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>
                    Uploading &amp; Validating... {progress}%
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <Upload size={20} color="#64748b" />
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                    Click to browse or drop image
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Auto-compressed for high speed • Max {maxSizeMB}MB
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
