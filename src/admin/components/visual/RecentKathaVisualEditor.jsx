import React, { useState } from 'react';
import { Edit3, Image as ImageIcon, Plus, Trash2, ChevronLeft, ChevronRight, Play, Video, Link2 } from 'lucide-react';
import VisualImageModal from './VisualImageModal';
import VisualTextModal from './VisualTextModal';

export default function RecentKathaVisualEditor({
  formData,
  updateSection,
  viewport = 'desktop',
  onNotify
}) {
  const vidData = formData?.recentKatha || {};
  const title = vidData.title || 'Recent Katha';
  const viewAllText = vidData.viewAllText || 'View All';
  const viewAllUrl = vidData.viewAllUrl || '/kathas';
  const mediaCards = vidData.mediaCards && vidData.mediaCards.length > 0 ? vidData.mediaCards : [
    {
      id: 'rk1',
      title: 'श्री अभयदास जी महाराज श्रीमद् भागवत कथा',
      thumbnail: '/images/img_25.jpg',
      dateText: '9:41 / 2:56:26',
      mediaUrl: 'https://www.youtube.com/live/X0UPcFj_ZNQ?si=4ePCh00jF7hwtkOp',
      status: 'published'
    },
    {
      id: 'rk2',
      title: 'यशस्वी प्रधानमंत्री श्री Narendra Modi Ji को जन्मदिन की हार्दिक शुभकामनाएँ।',
      thumbnail: '/images/img_22.jpg',
      dateText: '1:15 / 15:42',
      mediaUrl: 'https://youtu.be/McOEP5OqUfs?si=kUsE_tcWbFowqFUu',
      status: 'published'
    },
    {
      id: 'rk3',
      title: 'Abhaydas Ji Maharaj ने हरिजन बस्ती में भिक्षा लेने का कारण बताया',
      thumbnail: '/images/img_23.jpg',
      dateText: '3:40 / 24:18',
      mediaUrl: 'https://youtu.be/8NbRkLdLR7s?si=BmBKRguTatBeID3d',
      status: 'published'
    },
    {
      id: 'rk4',
      title: 'Meera Bhajan – मुरली वाला आजा म्हारे देश । Abhaydas ji maharaj',
      thumbnail: '/images/img_24.webp',
      dateText: '2:08 / 18:05',
      mediaUrl: 'https://youtu.be/DDT8ydNRGnE?si=gyJqxaqOcf4RD9Qv',
      status: 'published'
    }
  ];

  const [headerModal, setHeaderModal] = useState(false);
  const [imageModalIdx, setImageModalIdx] = useState(null);
  const [cardModalIdx, setCardModalIdx] = useState(null);

  const handleUpdateHeader = (vals) => {
    updateSection('recentKatha', {
      title: vals.title,
      viewAllText: vals.viewAllText,
      viewAllUrl: vals.viewAllUrl
    });
    onNotify?.('Updated Recent Katha Header');
  };

  const handleUpdateCard = (idx, updates) => {
    const list = [...mediaCards];
    list[idx] = { ...list[idx], ...updates };
    updateSection('recentKatha', { mediaCards: list });
    onNotify?.(`Updated Video #${idx + 1}`);
  };

  const handleAddVideo = () => {
    const newVideo = {
      id: `rk_${Date.now()}`,
      title: 'New Katha Satsang Video',
      thumbnail: '/images/img_25.jpg',
      dateText: 'Katha Satsang',
      mediaUrl: 'https://www.youtube.com/live/X0UPcFj_ZNQ',
      status: 'published'
    };
    updateSection('recentKatha', { mediaCards: [...mediaCards, newVideo] });
    onNotify?.('Added New Video Card');
  };

  const handleDeleteVideo = (idx) => {
    if (mediaCards.length <= 1) {
      alert('Please keep at least one video card.');
      return;
    }
    const filtered = mediaCards.filter((_, i) => i !== idx);
    updateSection('recentKatha', { mediaCards: filtered });
    onNotify?.('Deleted Video Card');
  };

  const handleMove = (idx, direction) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= mediaCards.length) return;
    const list = [...mediaCards];
    const temp = list[idx];
    list[idx] = list[newIdx];
    list[newIdx] = temp;
    updateSection('recentKatha', { mediaCards: list });
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
            Visual Canvas Editor • 6. Recent Katha Videos ({mediaCards.length} Videos)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleAddVideo}
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
            <Plus size={13} /> Add New Video
          </button>

          <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginLeft: '6px' }}>
            💡 Click any video card to edit title, thumbnail, or YouTube link
          </span>
        </div>
      </div>

      {/* ── Main Preview matching VideoSection.jsx ── */}
      <section id="recent-katha" style={{
        padding: '75px 0 90px',
        backgroundColor: '#f8fafc',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Section Header */}
          <div
            onClick={() => setHeaderModal(true)}
            className="visual-editable-item"
            title="Click to edit Section Title & View All Button"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '36px',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px'
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#fc791a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                ✦ SACRED SATSANG DISCOURSES
              </div>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: '800',
                color: '#0d2820',
                margin: 0,
                fontFamily: "'Playfair Display', Georgia, serif"
              }}>
                {title}
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
              <span>{viewAllText}</span>
              <Edit3 size={11} color="#ffffff" style={{ opacity: 0.7 }} />
            </div>
          </div>

          {/* Video Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewport === 'mobile' ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {mediaCards.map((video, idx) => (
              <div
                key={video.id || idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
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
                    disabled={idx === mediaCards.length - 1}
                    style={{ background: 'none', border: 'none', color: idx === mediaCards.length - 1 ? '#64748b' : '#ffffff', cursor: idx === mediaCards.length - 1 ? 'default' : 'pointer', padding: '2px' }}
                  >
                    <ChevronRight size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteVideo(idx)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Thumbnail Area */}
                <div
                  className="visual-editable-item"
                  onClick={() => setImageModalIdx(idx)}
                  title="Click to change video thumbnail"
                  style={{
                    position: 'relative',
                    height: '180px',
                    backgroundColor: '#0f172a',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={video.thumbnail || '/images/img_25.jpg'}
                    alt={video.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: '#ff0000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(255,0,0,0.4)'
                    }}>
                      <Play size={18} fill="#ffffff" style={{ marginLeft: '2px' }} />
                    </div>
                  </div>

                  {/* Duration Tag */}
                  {video.dateText && (
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(0,0,0,0.85)',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {video.dateText}
                    </div>
                  )}

                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#ffffff',
                    fontSize: '10.5px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <ImageIcon size={10} color="#38bdf8" /> Change Thumb
                  </div>
                </div>

                {/* Content Details */}
                <div
                  className="visual-editable-item"
                  onClick={() => setCardModalIdx(idx)}
                  title="Click to edit Video Title, YouTube URL, Duration"
                  style={{
                    padding: '16px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <h3 style={{
                      fontSize: '14.5px',
                      fontWeight: '700',
                      color: '#0f172a',
                      lineHeight: '1.4',
                      margin: '0 0 10px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {video.title}
                    </h3>

                    <div style={{
                      fontSize: '11px',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      <Link2 size={11} /> {video.mediaUrl}
                    </div>
                  </div>

                  <div style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: '700' }}>
                      YouTube Discourse
                    </span>
                    <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '600' }}>
                      <Edit3 size={10} style={{ display: 'inline', marginRight: '2px' }} /> Edit Details
                    </span>
                  </div>
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
          title="Edit Recent Katha Header"
          fields={[
            { name: 'title', label: 'Section Title', value: title },
            { name: 'viewAllText', label: 'View All Button Text', value: viewAllText },
            { name: 'viewAllUrl', label: 'Destination URL', value: viewAllUrl }
          ]}
          onSave={handleUpdateHeader}
        />
      )}

      {imageModalIdx !== null && (
        <VisualImageModal
          isOpen={true}
          onClose={() => setImageModalIdx(null)}
          title={`Update Thumbnail for "${mediaCards[imageModalIdx]?.title}"`}
          currentImage={mediaCards[imageModalIdx]?.thumbnail}
          onSelectImage={(url) => handleUpdateCard(imageModalIdx, { thumbnail: url })}
        />
      )}

      {cardModalIdx !== null && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setCardModalIdx(null)}
          title={`Edit Video Card #${cardModalIdx + 1}`}
          fields={[
            { name: 'title', label: 'Video Title', value: mediaCards[cardModalIdx]?.title },
            { name: 'mediaUrl', label: 'YouTube Video Link', value: mediaCards[cardModalIdx]?.mediaUrl, placeholder: 'https://youtube.com/...' },
            { name: 'dateText', label: 'Duration / Timestamp Tag', value: mediaCards[cardModalIdx]?.dateText || 'Katha Satsang' }
          ]}
          onSave={(vals) => handleUpdateCard(cardModalIdx, vals)}
        />
      )}

    </div>
  );
}
