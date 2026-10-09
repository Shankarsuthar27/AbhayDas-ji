import React, { useState } from 'react';
import { Edit3, Image as ImageIcon, Play, Sparkles } from 'lucide-react';
import VisualImageModal from './VisualImageModal';
import VisualTextModal from './VisualTextModal';

export default function AboutVisualEditor({
  formData,
  updateSection,
  viewport = 'desktop',
  onNotify
}) {
  const aboutData = formData?.about || {};

  const sectionLabel = aboutData.sectionLabel || 'About Us';
  const mainHeading = aboutData.mainHeading || 'Brief Introduction';
  const paragraph = aboutData.paragraph || 'Pujya Abhaydas Ji Maharaj Shri is a spiritual guru, religious preacher, and social reformer who embraced the path of dharma and humanitarian service from early childhood...';
  const artworkImage = (aboutData.artworkImage && aboutData.artworkImage !== '/images/img_10.jpg') ? aboutData.artworkImage : '/images/img_9.jpg';
  const portraitImage = (aboutData.portraitImage && aboutData.portraitImage !== '/images/img_11.jpg') ? aboutData.portraitImage : '/images/img_10.jpg';
  const readMoreButtonText = aboutData.readMoreButtonText || 'Read More';
  const readMoreButtonUrl = aboutData.readMoreButtonUrl || '/about';
  const videoUrl = aboutData.videoUrl || 'https://www.youtube.com/live/X0UPcFj_ZNQ';

  // Modal states
  const [imageModalTarget, setImageModalTarget] = useState(null); // 'artwork' | 'portrait'
  const [textModalField, setTextModalField] = useState(null); // 'badge' | 'heading' | 'paragraph' | 'button' | 'video'

  const handleUpdate = (field, value) => {
    updateSection('about', { [field]: value });
    onNotify?.(`Updated: ${field}`);
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
            Visual Canvas Editor • 2. Brief Introduction
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setImageModalTarget('artwork')}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#1e293b',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ImageIcon size={12} color="#38bdf8" /> Replace Artwork Image
          </button>

          <button
            type="button"
            onClick={() => setImageModalTarget('portrait')}
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
            <ImageIcon size={12} /> Replace Portrait Photo
          </button>

          <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginLeft: '6px' }}>
            💡 Click any text or image below to edit
          </span>
        </div>
      </div>

      {/* ── Main Section Preview (Exact match to AboutSection.jsx) ── */}
      <section id="about" style={{
        padding: '70px 0 90px',
        backgroundColor: '#ffffff',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1420px', margin: '0 auto', padding: '0 24px' }}>
          <div
            className="about-main-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: viewport === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: 'clamp(30px, 4vw, 56px)',
              alignItems: 'center'
            }}
          >
            {/* Left Column: Beige Card with Curved Top-Right Corner */}
            <div className="about-beige-card" style={{
              backgroundColor: '#faf6ef',
              borderRadius: '0 80px 0 0',
              padding: 'clamp(44px, 5.5vw, 68px) clamp(30px, 4vw, 58px)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
            }}>
              
              {/* Badge: 🧡 About Us 🧡 */}
              <div
                onClick={() => setTextModalField('badge')}
                className="visual-editable-item"
                title="Click to edit Section Badge"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#fc791a',
                  fontSize: '14.5px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  letterSpacing: '0.2px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  marginLeft: '-8px'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#fc791a">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>{sectionLabel}</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#fc791a">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <Edit3 size={12} color="#fc791a" style={{ opacity: 0.6 }} />
              </div>

              {/* Main Heading: Brief Introduction */}
              <h2
                onClick={() => setTextModalField('heading')}
                className="visual-editable-item about-heading-title"
                title="Click to edit Heading"
                style={{
                  fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                  fontSize: 'clamp(36px, 4.2vw, 50px)',
                  fontWeight: '800',
                  color: '#0d2820',
                  lineHeight: '1.18',
                  margin: '0 0 24px 0',
                  letterSpacing: '-0.4px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  marginLeft: '-8px'
                }}
              >
                {mainHeading}
                <Edit3 size={18} color="#0284c7" style={{ marginLeft: '10px', opacity: 0.6 }} />
              </h2>

              {/* Paragraph Text */}
              <p
                onClick={() => setTextModalField('paragraph')}
                className="visual-editable-item about-desc-paragraph"
                title="Click to edit Paragraph Text"
                style={{
                  fontSize: '15px',
                  lineHeight: '1.78',
                  color: '#374151',
                  margin: '0 0 32px 0',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  marginLeft: '-8px'
                }}
              >
                {paragraph}
                <Edit3 size={13} color="#0284c7" style={{ marginLeft: '6px', opacity: 0.6 }} />
              </p>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div
                  onClick={() => setTextModalField('button')}
                  className="visual-editable-item"
                  title="Click to edit Read More Button Text & URL"
                  style={{
                    backgroundColor: '#0d2820',
                    color: '#ffffff',
                    borderRadius: '50px',
                    padding: '14px 34px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{readMoreButtonText}</span>
                  <Edit3 size={12} color="#ffffff" style={{ opacity: 0.8 }} />
                </div>

                <div
                  onClick={() => setTextModalField('video')}
                  className="visual-editable-item"
                  title="Click to edit YouTube Video URL"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#0d2820',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    padding: '8px 12px'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#fc791a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <Play size={14} fill="#ffffff" />
                  </div>
                  <span>Watch Video</span>
                  <Edit3 size={12} color="#fc791a" style={{ opacity: 0.8 }} />
                </div>
              </div>
            </div>

            {/* Right Column: Stacked Artwork & Portrait Photo Cards */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Artwork Card */}
              <div
                className="visual-editable-item"
                onClick={() => setImageModalTarget('artwork')}
                title="Click to change Artwork Image"
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  height: '240px',
                  backgroundColor: '#f1f5f9',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={artworkImage}
                  alt="Temple Artwork"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.9
                }}>
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#0f172a',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    <ImageIcon size={14} color="#0284c7" />
                    <span>Change Artwork Image</span>
                  </div>
                </div>
              </div>

              {/* Portrait Photo Card */}
              <div
                className="visual-editable-item"
                onClick={() => setImageModalTarget('portrait')}
                title="Click to change Portrait Photo"
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  height: '340px',
                  backgroundColor: '#f1f5f9',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={portraitImage}
                  alt="Maharaj Ji Portrait"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(15, 23, 42, 0.88)',
                  backdropFilter: 'blur(6px)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  <ImageIcon size={14} color="#38bdf8" />
                  <span>Change Portrait Photo</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Modals ── */}
      <VisualImageModal
        isOpen={imageModalTarget === 'artwork'}
        onClose={() => setImageModalTarget(null)}
        title="Update Artwork Image"
        currentImage={artworkImage}
        onSelectImage={(url) => handleUpdate('artworkImage', url)}
      />

      <VisualImageModal
        isOpen={imageModalTarget === 'portrait'}
        onClose={() => setImageModalTarget(null)}
        title="Update Portrait Image (Maharaj Ji Photo)"
        currentImage={portraitImage}
        onSelectImage={(url) => handleUpdate('portraitImage', url)}
      />

      {textModalField === 'badge' && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setTextModalField(null)}
          title="Edit Section Badge"
          fields={[{ name: 'sectionLabel', label: 'Section Badge Label', value: sectionLabel }]}
          onSave={(vals) => handleUpdate('sectionLabel', vals.sectionLabel)}
        />
      )}

      {textModalField === 'heading' && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setTextModalField(null)}
          title="Edit Main Heading"
          fields={[{ name: 'mainHeading', label: 'Section Heading', value: mainHeading }]}
          onSave={(vals) => handleUpdate('mainHeading', vals.mainHeading)}
        />
      )}

      {textModalField === 'paragraph' && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setTextModalField(null)}
          title="Edit Descriptive Biography Paragraph"
          fields={[{ name: 'paragraph', label: 'Biography Text', value: paragraph, type: 'textarea', rows: 6 }]}
          onSave={(vals) => handleUpdate('paragraph', vals.paragraph)}
        />
      )}

      {textModalField === 'button' && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setTextModalField(null)}
          title="Edit Action Button"
          fields={[
            { name: 'readMoreButtonText', label: 'Button Text', value: readMoreButtonText },
            { name: 'readMoreButtonUrl', label: 'Target URL', value: readMoreButtonUrl }
          ]}
          onSave={(vals) => {
            updateSection('about', {
              readMoreButtonText: vals.readMoreButtonText,
              readMoreButtonUrl: vals.readMoreButtonUrl
            });
            onNotify?.('Updated Button');
          }}
        />
      )}

      {textModalField === 'video' && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setTextModalField(null)}
          title="Edit Floating Video Link"
          fields={[{ name: 'videoUrl', label: 'YouTube Video Link', value: videoUrl, placeholder: 'https://youtube.com/...' }]}
          onSave={(vals) => handleUpdate('videoUrl', vals.videoUrl)}
        />
      )}

    </div>
  );
}
