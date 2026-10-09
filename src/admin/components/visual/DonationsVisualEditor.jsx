import React, { useState } from 'react';
import { Edit3, Image as ImageIcon, Plus, Trash2, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import VisualImageModal from './VisualImageModal';
import VisualTextModal from './VisualTextModal';

export default function DonationsVisualEditor({
  formData,
  updateSection,
  viewport = 'desktop',
  onNotify
}) {
  const donData = formData?.donations || {};
  const subheading = donData.subheading || 'HELP THE NEEDY';
  const mainTitle = donData.mainTitle || donData.title || 'Find The Popular Cause And Donate Them';
  const campaigns = donData.campaigns && donData.campaigns.length > 0 ? donData.campaigns : [
    { id: 'c1', title: 'Your small help can bring a Better Life to Everyone', image: '/images/img_14.avif', goal: 50000, raised: 0, donateUrl: '#donate', status: 'published' },
    { id: 'c2', title: 'Clean water, healthy food and nutrition for rural villages', image: '/images/img_15.jpg', goal: 50000, raised: 18500, donateUrl: '#donate', status: 'published' },
    { id: 'c3', title: 'Takhatgarh Gurukulam education for tribal & needy children', image: '/images/img_16.jpg', goal: 75000, raised: 35000, donateUrl: '#donate', status: 'published' },
    { id: 'c4', title: 'Sacred Gaushala healthcare, nutrition & protective shelter', image: '/images/img_17.jpg', goal: 50000, raised: 0, donateUrl: '#donate', status: 'published' }
  ];

  const [headerModal, setHeaderModal] = useState(false);
  const [imageModalIdx, setImageModalIdx] = useState(null);
  const [cardModalIdx, setCardModalIdx] = useState(null);

  const handleUpdateHeader = (vals) => {
    updateSection('donations', {
      subheading: vals.subheading,
      mainTitle: vals.mainTitle
    });
    onNotify?.('Updated Donation Header');
  };

  const handleUpdateCard = (idx, updates) => {
    const list = [...campaigns];
    list[idx] = { ...list[idx], ...updates };
    updateSection('donations', { campaigns: list });
    onNotify?.(`Updated Cause #${idx + 1}`);
  };

  const handleAddCampaign = () => {
    const newCampaign = {
      id: `c_${Date.now()}`,
      title: 'New Sacred Seva Initiative',
      image: '/images/img_14.avif',
      goal: 50000,
      raised: 0,
      donateUrl: '#donate',
      status: 'published'
    };
    updateSection('donations', { campaigns: [...campaigns, newCampaign] });
    onNotify?.('Added New Donation Cause');
  };

  const handleDeleteCampaign = (idx) => {
    if (campaigns.length <= 1) {
      alert('Please keep at least one donation campaign.');
      return;
    }
    const filtered = campaigns.filter((_, i) => i !== idx);
    updateSection('donations', { campaigns: filtered });
    onNotify?.('Deleted Donation Cause');
  };

  const handleMove = (idx, direction) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= campaigns.length) return;
    const list = [...campaigns];
    const temp = list[idx];
    list[idx] = list[newIdx];
    list[newIdx] = temp;
    updateSection('donations', { campaigns: list });
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
            Visual Canvas Editor • 4. Donation Section ({campaigns.length} Causes)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleAddCampaign}
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
            <Plus size={13} /> Add New Cause
          </button>

          <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginLeft: '6px' }}>
            💡 Click any title, amount, or photo to edit
          </span>
        </div>
      </div>

      {/* ── Main Preview matching CampaignsSection.jsx ── */}
      <section id="campaigns" style={{
        padding: '80px 0 95px',
        backgroundColor: '#fbfbfd',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header Row */}
          <div
            onClick={() => setHeaderModal(true)}
            className="visual-editable-item"
            title="Click to edit Subheading & Title"
            style={{
              textAlign: 'center',
              maxWidth: '680px',
              margin: '0 auto 45px',
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
              fontSize: 'clamp(28px, 3.8vw, 42px)',
              fontWeight: '800',
              color: '#0d2820',
              margin: 0,
              fontFamily: "'Playfair Display', Georgia, serif"
            }}>
              {mainTitle}
              <Edit3 size={16} color="#0284c7" style={{ marginLeft: '10px', opacity: 0.6 }} />
            </h2>
          </div>

          {/* Campaigns Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewport === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {campaigns.map((camp, idx) => {
              const goal = Number(camp.goal) || 50000;
              const raised = Number(camp.raised) || 0;
              const pct = Math.min(100, Math.round((raised / goal) * 100));

              return (
                <div
                  key={camp.id || idx}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                >
                  {/* Top Floating Controls */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    padding: '4px 8px',
                    borderRadius: '16px'
                  }}>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, -1)}
                      disabled={idx === 0}
                      style={{ background: 'none', border: 'none', color: idx === 0 ? '#64748b' : '#ffffff', cursor: idx === 0 ? 'default' : 'pointer', padding: '2px' }}
                    >
                      <ChevronLeft size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 1)}
                      disabled={idx === campaigns.length - 1}
                      style={{ background: 'none', border: 'none', color: idx === campaigns.length - 1 ? '#64748b' : '#ffffff', cursor: idx === campaigns.length - 1 ? 'default' : 'pointer', padding: '2px' }}
                    >
                      <ChevronRight size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCampaign(idx)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Image area */}
                  <div
                    className="visual-editable-item"
                    onClick={() => setImageModalIdx(idx)}
                    title="Click to replace image"
                    style={{
                      height: '210px',
                      backgroundColor: '#e2e8f0',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                  >
                    <img
                      src={camp.image || '/images/img_14.avif'}
                      alt={camp.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
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

                  {/* Content area */}
                  <div
                    className="visual-editable-item"
                    onClick={() => setCardModalIdx(idx)}
                    title="Click to edit Title, Goal, Raised & Donate Link"
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
                        fontSize: '17px',
                        fontWeight: '800',
                        color: '#0d2820',
                        margin: '0 0 16px 0',
                        lineHeight: '1.35'
                      }}>
                        {camp.title}
                      </h3>

                      {/* Progress bar */}
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{
                          height: '8px',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          marginBottom: '8px'
                        }}>
                          <div style={{
                            width: `${pct}%`,
                            height: '100%',
                            backgroundColor: '#fc791a',
                            borderRadius: '4px',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}>
                          <span style={{ color: '#fc791a' }}>Raised: ₹{raised.toLocaleString('en-IN')}</span>
                          <span style={{ color: '#64748b' }}>Goal: ₹{goal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '14px',
                      borderTop: '1px solid #f1f5f9'
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#fc791a',
                        color: '#ffffff',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        padding: '6px 14px',
                        borderRadius: '20px'
                      }}>
                        <Heart size={12} fill="#ffffff" /> Donate Now
                      </div>

                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                        <Edit3 size={10} style={{ display: 'inline', marginRight: '3px' }} /> Edit Details
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── Modals ── */}
      {headerModal && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setHeaderModal(false)}
          title="Edit Donation Section Header"
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
          title={`Update Photo for "${campaigns[imageModalIdx]?.title}"`}
          currentImage={campaigns[imageModalIdx]?.image}
          onSelectImage={(url) => handleUpdateCard(imageModalIdx, { image: url })}
        />
      )}

      {cardModalIdx !== null && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setCardModalIdx(null)}
          title={`Edit Campaign Cause #${cardModalIdx + 1}`}
          fields={[
            { name: 'title', label: 'Campaign Title', value: campaigns[cardModalIdx]?.title },
            { name: 'goal', label: 'Target Goal Amount (₹)', value: campaigns[cardModalIdx]?.goal || 50000, type: 'number' },
            { name: 'raised', label: 'Raised Amount (₹)', value: campaigns[cardModalIdx]?.raised || 0, type: 'number' },
            { name: 'donateUrl', label: 'Donation Destination Link', value: campaigns[cardModalIdx]?.donateUrl || '#donate' }
          ]}
          onSave={(vals) => handleUpdateCard(cardModalIdx, {
            title: vals.title,
            goal: Number(vals.goal) || 50000,
            raised: Number(vals.raised) || 0,
            donateUrl: vals.donateUrl
          })}
        />
      )}

    </div>
  );
}
