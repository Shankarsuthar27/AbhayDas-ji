import React, { useState, useRef } from 'react';
import { Edit3, Image as ImageIcon, Plus, Trash2, ChevronLeft, ChevronRight, UploadCloud, Link2 } from 'lucide-react';
import VisualImageModal from './VisualImageModal';
import VisualTextModal from './VisualTextModal';
import { compressImage } from '../../utils/helpers';

export default function GalleryVisualEditor({
  formData,
  updateSection,
  viewport = 'desktop',
  onNotify
}) {
  const galData = formData?.gallery || {};
  const heading = galData.heading || 'Shrimad Bhagwad Katha * Ram Katha';
  const viewMoreText = galData.viewMoreText || 'View More Gallery';
  const viewMoreUrl = galData.viewMoreUrl || '/gallery';
  const images = galData.images && galData.images.length > 0 ? galData.images : [
    { id: 'g1', src: '/images/img_17.jpg', title: 'Pujya Maharaj Ji with Saints & Devotees', status: 'published' },
    { id: 'g2', src: '/images/img_18.jpg', title: 'Devotee Offering Pranam & Sacred Blessings', status: 'published' },
    { id: 'g3', src: '/images/img_19.jpg', title: 'Spiritual Discourse & Guidance Session', status: 'published' },
    { id: 'g4', src: '/images/img_20.jpg', title: 'Evening Satsang & Devotional Bhajan Sandhya', status: 'published' },
    { id: 'g5', src: '/images/img_21.jpg', title: 'National Honor & Sacred Felicitation Ceremony', status: 'published' },
    { id: 'g6', src: '/images/img_22.jpg', title: 'Takhatgarh Dham Seva & Community Assembly', status: 'published' }
  ];

  const [headerModal, setHeaderModal] = useState(false);
  const [imageModalIdx, setImageModalIdx] = useState(null);
  const [captionModalIdx, setCaptionModalIdx] = useState(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const bulkInputRef = useRef(null);

  const handleUpdateHeader = (vals) => {
    updateSection('gallery', {
      heading: vals.heading,
      viewMoreText: vals.viewMoreText,
      viewMoreUrl: vals.viewMoreUrl
    });
    onNotify?.('Updated Gallery Header');
  };

  const handleUpdateImage = (idx, updates) => {
    const list = [...images];
    list[idx] = { ...list[idx], ...updates };
    updateSection('gallery', { images: list });
    onNotify?.(`Updated Photo #${idx + 1}`);
  };

  const handleAddPhoto = () => {
    const newPhoto = {
      id: `g_${Date.now()}`,
      src: '/images/img_17.jpg',
      url: '/images/img_17.jpg',
      title: `Sacred Photo ${images.length + 1}`,
      status: 'published'
    };
    updateSection('gallery', { images: [...images, newPhoto] });
    onNotify?.('Added New Gallery Photo');
  };

  const handleDeletePhoto = (idx) => {
    if (images.length <= 1) {
      alert('Please keep at least one photo.');
      return;
    }
    const filtered = images.filter((_, i) => i !== idx);
    updateSection('gallery', { images: filtered });
    onNotify?.('Deleted Photo');
  };

  const handleMove = (idx, direction) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= images.length) return;
    const list = [...images];
    const temp = list[idx];
    list[idx] = list[newIdx];
    list[newIdx] = temp;
    updateSection('gallery', { images: list });
  };

  const handleBulkUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setBulkUploading(true);
    try {
      const newItems = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        try {
          const res = await compressImage(file, { maxWidth: 1280, maxHeight: 850, quality: 0.82 });
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          newItems.push({
            id: `g_${Date.now()}_${i}`,
            src: res.dataUrl,
            url: res.dataUrl,
            title: cleanName || `Sacred Photo ${images.length + i + 1}`,
            status: 'published'
          });
        } catch (err) {
          console.warn('Bulk compress error:', err);
        }
      }
      if (newItems.length > 0) {
        updateSection('gallery', { images: [...images, ...newItems] });
        onNotify?.(`Added ${newItems.length} photos to gallery!`);
      }
    } finally {
      setBulkUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="visual-editor-section-root" style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      
      {/* ── Top Visual Control Bar ── */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#38bdf8',
            display: 'inline-block'
          }} />
          <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#93c5fd' }}>
            Visual Canvas Editor • 5. Photo Gallery ({images.length} Photos)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <input
            ref={bulkInputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleBulkUpload}
          />

          <button
            type="button"
            onClick={() => bulkInputRef.current?.click()}
            disabled={bulkUploading}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#1e293b',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '600',
              cursor: bulkUploading ? 'wait' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <UploadCloud size={13} color="#38bdf8" />
            {bulkUploading ? 'Compressing Photos...' : 'Bulk Upload Photos'}
          </button>

          <button
            type="button"
            onClick={handleAddPhoto}
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
            <Plus size={13} /> Add Single Photo
          </button>

          <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginLeft: '6px' }}>
            💡 Click any photo or caption to edit
          </span>
        </div>
      </div>

      {/* ── Main Gallery Preview matching GallerySection.jsx ── */}
      <section id="gallery" style={{
        padding: '75px 0 90px',
        backgroundColor: '#ffffff',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1420px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Section Header */}
          <div
            onClick={() => setHeaderModal(true)}
            className="visual-editable-item"
            title="Click to edit Gallery Heading & View More Button"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '40px',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px'
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#fc791a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                ✦ SACRED PHOTO GALLERY
              </div>
              <h2 style={{
                fontSize: 'clamp(26px, 3.2vw, 38px)',
                fontWeight: '800',
                color: '#0d2820',
                margin: 0,
                fontFamily: "'Playfair Display', Georgia, serif"
              }}>
                {heading}
                <Edit3 size={15} color="#0284c7" style={{ marginLeft: '10px', opacity: 0.6 }} />
              </h2>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#0d2820',
              color: '#ffffff',
              padding: '10px 22px',
              borderRadius: '24px',
              fontSize: '13px',
              fontWeight: '700'
            }}>
              <span>{viewMoreText}</span>
              <Edit3 size={11} color="#ffffff" style={{ opacity: 0.7 }} />
            </div>
          </div>

          {/* Photo Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewport === 'mobile' ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px'
          }}>
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#f1f5f9',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  height: '240px',
                  border: '1px solid #e2e8f0'
                }}
              >
                {/* Image */}
                <img
                  src={img.src || img.url || '/images/img_17.jpg'}
                  alt={img.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Floating Top Controls */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  padding: '3px 6px',
                  borderRadius: '14px'
                }}>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, -1)}
                    disabled={idx === 0}
                    style={{ background: 'none', border: 'none', color: idx === 0 ? '#64748b' : '#ffffff', cursor: idx === 0 ? 'default' : 'pointer', padding: '2px' }}
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 1)}
                    disabled={idx === images.length - 1}
                    style={{ background: 'none', border: 'none', color: idx === images.length - 1 ? '#64748b' : '#ffffff', cursor: idx === images.length - 1 ? 'default' : 'pointer', padding: '2px' }}
                  >
                    <ChevronRight size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(idx)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Bottom Caption Overlay (Clickable to edit caption) */}
                <div
                  className="visual-editable-item"
                  onClick={() => setCaptionModalIdx(idx)}
                  title="Click to edit Photo Title / Caption"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '12px 14px',
                    background: 'linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.7) 70%, transparent 100%)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    lineHeight: '1.25',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {img.title || `Photo #${idx + 1}`}
                  </span>
                  <Edit3 size={11} color="#38bdf8" style={{ flexShrink: 0 }} />
                </div>

                {/* Center Replace Photo Badge */}
                <div
                  onClick={() => setImageModalIdx(idx)}
                  title="Click to replace image"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ImageIcon size={11} color="#38bdf8" /> Replace Photo
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Modals ── */}
      {headerModal && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setHeaderModal(false)}
          title="Edit Gallery Section Header"
          fields={[
            { name: 'heading', label: 'Section Heading', value: heading },
            { name: 'viewMoreText', label: 'View More Button Text', value: viewMoreText },
            { name: 'viewMoreUrl', label: 'Destination URL', value: viewMoreUrl }
          ]}
          onSave={handleUpdateHeader}
        />
      )}

      {imageModalIdx !== null && (
        <VisualImageModal
          isOpen={true}
          onClose={() => setImageModalIdx(null)}
          title={`Replace Photo #${imageModalIdx + 1}`}
          currentImage={images[imageModalIdx]?.src || images[imageModalIdx]?.url}
          onSelectImage={(url) => handleUpdateImage(imageModalIdx, { src: url, url })}
        />
      )}

      {captionModalIdx !== null && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setCaptionModalIdx(null)}
          title={`Edit Caption for Photo #${captionModalIdx + 1}`}
          fields={[
            { name: 'title', label: 'Photo Caption / Title', value: images[captionModalIdx]?.title }
          ]}
          onSave={(vals) => handleUpdateImage(captionModalIdx, { title: vals.title })}
        />
      )}

    </div>
  );
}
