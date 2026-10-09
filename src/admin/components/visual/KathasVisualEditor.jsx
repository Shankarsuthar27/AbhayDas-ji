import React, { useState } from 'react';
import { Edit3, Image as ImageIcon, Plus, Trash2, ChevronLeft, ChevronRight, Play, Link2 } from 'lucide-react';
import VisualImageModal from './VisualImageModal';
import VisualTextModal from './VisualTextModal';

export default function KathasVisualEditor({
  formData,
  updateSection,
  viewport = 'desktop',
  onNotify
}) {
  const kathaData = formData?.spiritualKathas || {};
  const subheading = kathaData.subheading || 'DEVOTIONAL DISCOURSES';
  const mainTitle = kathaData.mainTitle || kathaData.title || "Spiritual Katha'";
  const items = kathaData.items && kathaData.items.length > 0 ? kathaData.items : [
    { id: 'k1', title: 'Shrimad Bhagwad Katha', image: '/images/img_11.jpg', link: '/kathas/shrimad-bhagwat-katha', videoId: 'X0UPcFj_ZNQ', status: 'published' },
    { id: 'k2', title: 'Nani Bai Ka Mayra', image: '/images/img_12.jpg', link: '/kathas/nani-bai-ka-mayra', videoId: 'DDT8ydNRGnE', status: 'published' },
    { id: 'k3', title: 'Baba Ramdev Katha', image: '/images/img_13.png', link: '/kathas/baba-ramdev-ji-katha', videoId: 'kW-T1J5QFdY', status: 'published' }
  ];

  // Modals state
  const [headerModal, setHeaderModal] = useState(false);
  const [imageModalIdx, setImageModalIdx] = useState(null);
  const [cardModalIdx, setCardModalIdx] = useState(null);

  const handleUpdateHeader = (vals) => {
    updateSection('spiritualKathas', {
      subheading: vals.subheading,
      mainTitle: vals.mainTitle
    });
    onNotify?.('Updated Katha Section Header');
  };

  const handleUpdateCard = (idx, updates) => {
    const list = [...items];
    list[idx] = { ...list[idx], ...updates };
    updateSection('spiritualKathas', { items: list });
    onNotify?.(`Updated Katha #${idx + 1}`);
  };

  const handleAddCard = () => {
    const newCard = {
      id: `k_${Date.now()}`,
      title: 'New Sacred Katha Pravachan',
      image: '/images/img_11.jpg',
      link: '/kathas',
      videoId: 'X0UPcFj_ZNQ',
      status: 'published'
    };
    updateSection('spiritualKathas', { items: [...items, newCard] });
    onNotify?.('Added New Katha Card');
  };

  const handleDeleteCard = (idx) => {
    if (items.length <= 1) {
      alert('Please keep at least one katha card.');
      return;
    }
    const filtered = items.filter((_, i) => i !== idx);
    updateSection('spiritualKathas', { items: filtered });
    onNotify?.('Deleted Katha Card');
  };

  const handleMove = (idx, direction) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= items.length) return;
    const list = [...items];
    const temp = list[idx];
    list[idx] = list[newIdx];
    list[newIdx] = temp;
    updateSection('spiritualKathas', { items: list });
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
            Visual Canvas Editor • 3. Spiritual Katha ({items.length} Cards)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleAddCard}
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
            <Plus size={13} /> Add New Katha Card
          </button>

          <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginLeft: '6px' }}>
            💡 Click any title, button, or photo to edit
          </span>
        </div>
      </div>

      {/* ── Section Preview Canvas matching SpiritualKathas.jsx ── */}
      <section id="kathas" style={{
        padding: '80px 0 100px',
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        width: '100%'
      }}>
        {/* Background Decorative Doodles */}
        <div style={{
          position: 'absolute',
          top: '40px',
          left: 'clamp(20px, 5vw, 80px)',
          width: '80px',
          opacity: 0.6,
          pointerEvents: 'none'
        }}>
          <img src="/images/bg-16.png" alt="" style={{ width: '100%', height: 'auto' }} onError={(e) => e.target.style.display = 'none'} />
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          
          {/* Section Header */}
          <div
            onClick={() => setHeaderModal(true)}
            className="visual-editable-item"
            title="Click to edit Subheading & Title"
            style={{
              textAlign: 'center',
              maxWidth: '680px',
              margin: '0 auto 50px',
              cursor: 'pointer',
              padding: '10px 16px',
              borderRadius: '8px'
            }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#fc791a',
              fontSize: '13px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '8px'
            }}>
              <span>✦</span> {subheading}
              <Edit3 size={12} color="#fc791a" style={{ opacity: 0.6 }} />
            </div>

            <h2 style={{
              fontSize: 'clamp(28px, 3.8vw, 44px)',
              fontWeight: '800',
              color: '#0d2820',
              margin: 0,
              fontFamily: "'Playfair Display', Georgia, serif"
            }}>
              {mainTitle}
              <Edit3 size={16} color="#0284c7" style={{ marginLeft: '10px', opacity: 0.6 }} />
            </h2>
          </div>

          {/* Katha Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewport === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px',
            alignItems: 'stretch'
          }}>
            {items.map((card, idx) => (
              <div
                key={card.id || idx}
                style={{
                  position: 'relative',
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease'
                }}
              >
                {/* Top Card Controls Bar */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(15, 23, 42, 0.82)',
                  backdropFilter: 'blur(6px)',
                  padding: '4px 8px',
                  borderRadius: '16px'
                }}>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, -1)}
                    disabled={idx === 0}
                    title="Move Left"
                    style={{ background: 'none', border: 'none', color: idx === 0 ? '#64748b' : '#ffffff', cursor: idx === 0 ? 'default' : 'pointer', padding: '2px' }}
                  >
                    <ChevronLeft size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMove(idx, 1)}
                    disabled={idx === items.length - 1}
                    title="Move Right"
                    style={{ background: 'none', border: 'none', color: idx === items.length - 1 ? '#64748b' : '#ffffff', cursor: idx === items.length - 1 ? 'default' : 'pointer', padding: '2px' }}
                  >
                    <ChevronRight size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCard(idx)}
                    title="Delete Card"
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Card Image Area */}
                <div
                  className="visual-editable-item"
                  onClick={() => setImageModalIdx(idx)}
                  title="Click to replace this Katha image"
                  style={{
                    position: 'relative',
                    height: '240px',
                    backgroundColor: '#f1f5f9',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={card.image || '/images/img_11.jpg'}
                    alt={card.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(13,40,32,0.85) 0%, transparent 60%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fc791a',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                      <Play size={20} fill="#fc791a" />
                    </div>
                  </div>

                  {/* Floating Change Photo Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <ImageIcon size={11} color="#38bdf8" /> Change Image
                  </div>
                </div>

                {/* Card Content Footer */}
                <div
                  className="visual-editable-item"
                  onClick={() => setCardModalIdx(idx)}
                  title="Click to edit Katha Title, Link & Video ID"
                  style={{
                    padding: '20px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <h3 style={{
                      fontSize: '19px',
                      fontWeight: '800',
                      color: '#0d2820',
                      margin: '0 0 10px 0',
                      lineHeight: '1.3'
                    }}>
                      {card.title}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Link2 size={12} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {card.link || '/kathas'}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#fc791a' }}>
                      Watch Video &amp; Details →
                    </span>
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      fontWeight: '600'
                    }}>
                      <Edit3 size={10} style={{ display: 'inline', marginRight: '3px' }} /> Edit
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
          title="Edit Spiritual Katha Section Header"
          fields={[
            { name: 'subheading', label: 'Section Badge / Subheading', value: subheading },
            { name: 'mainTitle', label: 'Main Section Title', value: mainTitle }
          ]}
          onSave={handleUpdateHeader}
        />
      )}

      {imageModalIdx !== null && (
        <VisualImageModal
          isOpen={true}
          onClose={() => setImageModalIdx(null)}
          title={`Update Photo for "${items[imageModalIdx]?.title}"`}
          currentImage={items[imageModalIdx]?.image}
          onSelectImage={(url) => handleUpdateCard(imageModalIdx, { image: url })}
        />
      )}

      {cardModalIdx !== null && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setCardModalIdx(null)}
          title={`Edit Katha Card #${cardModalIdx + 1}`}
          fields={[
            { name: 'title', label: 'Katha Title', value: items[cardModalIdx]?.title },
            { name: 'link', label: 'Destination Page Link', value: items[cardModalIdx]?.link || '/kathas' },
            { name: 'videoId', label: 'YouTube Video ID or Link', value: items[cardModalIdx]?.videoId || 'X0UPcFj_ZNQ' }
          ]}
          onSave={(vals) => handleUpdateCard(cardModalIdx, vals)}
        />
      )}

    </div>
  );
}
