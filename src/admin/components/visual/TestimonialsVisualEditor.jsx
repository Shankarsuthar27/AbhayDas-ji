import React, { useState } from 'react';
import { Edit3, Image as ImageIcon, Plus, Trash2, ChevronLeft, ChevronRight, User, Award, Quote } from 'lucide-react';
import VisualImageModal from './VisualImageModal';
import VisualTextModal from './VisualTextModal';

export default function TestimonialsVisualEditor({
  formData,
  updateSection,
  viewport = 'desktop',
  onNotify
}) {
  const testData = formData?.testimonials || {};
  const subheading = testData.subheading || 'WHAT WE DO';
  const title = testData.title || testData.sectionTitle || 'Meet the team behind their success story';
  const items = testData.items && testData.items.length > 0 ? testData.items : [
    {
      id: 't1',
      name: 'Sachin Sharma',
      role: 'General Manager',
      reviewText: 'Managing the operations and nationwide outreach under the guidance of Maharaj Shri.',
      avatar: '',
      status: 'published'
    },
    {
      id: 't2',
      name: 'Vijay Raj Chouhan',
      role: 'PS',
      reviewText: 'Coordinating sacred events, katha dates, and administrative activities for the ashram.',
      avatar: '',
      status: 'published'
    },
    {
      id: 't3',
      name: 'Bhanwar Suthar',
      role: 'IT Head',
      reviewText: 'Heading the digital broadcast, official website, and media outreach for worldwide devotees.',
      avatar: '',
      status: 'published'
    }
  ];

  const [headerModal, setHeaderModal] = useState(false);
  const [avatarModalIdx, setAvatarModalIdx] = useState(null);
  const [memberModalIdx, setMemberModalIdx] = useState(null);

  const handleUpdateHeader = (vals) => {
    updateSection('testimonials', {
      subheading: vals.subheading,
      title: vals.title
    });
    onNotify?.('Updated Team Section Header');
  };

  const handleUpdateMember = (idx, updates) => {
    const list = [...items];
    list[idx] = { ...list[idx], ...updates };
    updateSection('testimonials', { items: list });
    onNotify?.(`Updated Member #${idx + 1}`);
  };

  const handleAddMember = () => {
    const newMember = {
      id: `t_${Date.now()}`,
      name: 'Sevak Name',
      role: 'Seva Coordinator',
      reviewText: 'Dedicated to the mission and service of Sadguru Dham and Pujya Maharaj Ji.',
      avatar: '',
      status: 'published'
    };
    updateSection('testimonials', { items: [...items, newMember] });
    onNotify?.('Added New Team Member');
  };

  const handleDeleteMember = (idx) => {
    if (items.length <= 1) {
      alert('Please keep at least one member.');
      return;
    }
    const filtered = items.filter((_, i) => i !== idx);
    updateSection('testimonials', { items: filtered });
    onNotify?.('Deleted Member');
  };

  const handleMove = (idx, direction) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= items.length) return;
    const list = [...items];
    const temp = list[idx];
    list[idx] = list[newIdx];
    list[newIdx] = temp;
    updateSection('testimonials', { items: list });
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
            Visual Canvas Editor • 9. Testimonials & Team ({items.length} Members)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleAddMember}
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
            <Plus size={13} /> Add Member
          </button>

          <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginLeft: '6px' }}>
            💡 Click any member name, role, or photo to edit
          </span>
        </div>
      </div>

      {/* ── Main Preview matching TeamSection.jsx ── */}
      <section id="team" style={{
        padding: '75px 0 85px',
        backgroundColor: '#fbf8f3' // Warm cream
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header */}
          <div
            onClick={() => setHeaderModal(true)}
            className="visual-editable-item"
            title="Click to edit Subheading & Title"
            style={{
              textAlign: 'center',
              maxWidth: '640px',
              margin: '0 auto 50px',
              cursor: 'pointer',
              padding: '10px 16px',
              borderRadius: '8px'
            }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#fff7ed',
              color: '#fc791a',
              border: '1px solid #ffedd5',
              borderRadius: '20px',
              padding: '6px 18px',
              fontSize: '12px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '12px'
            }}>
              {subheading}
              <Edit3 size={11} color="#fc791a" style={{ marginLeft: '6px', opacity: 0.6 }} />
            </div>

            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: '800',
              color: '#111827',
              margin: 0,
              lineHeight: 1.25,
              whiteSpace: 'pre-line'
            }}>
              {title}
              <Edit3 size={15} color="#0284c7" style={{ marginLeft: '8px', opacity: 0.6 }} />
            </h2>
          </div>

          {/* Team Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewport === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '28px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {items.map((member, idx) => (
              <div
                key={member.id || idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e5e7eb',
                  padding: '28px 22px',
                  textAlign: 'center',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {/* Top Controls */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
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
                    disabled={idx === items.length - 1}
                    style={{ background: 'none', border: 'none', color: idx === items.length - 1 ? '#64748b' : '#ffffff', cursor: idx === items.length - 1 ? 'default' : 'pointer', padding: '2px' }}
                  >
                    <ChevronRight size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteMember(idx)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Avatar */}
                <div
                  className="visual-editable-item"
                  onClick={() => setAvatarModalIdx(idx)}
                  title="Click to change member photo"
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    backgroundColor: '#fff7ed',
                    border: '3px solid #ffedd5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    marginBottom: '16px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={38} color="#fc791a" />
                  )}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                  >
                    <ImageIcon size={16} color="#ffffff" />
                  </div>
                </div>

                {/* Member Details */}
                <div
                  className="visual-editable-item"
                  onClick={() => setMemberModalIdx(idx)}
                  title="Click to edit Name, Role & Bio"
                  style={{ width: '100%', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}
                >
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: '#111827',
                    margin: '0 0 6px 0'
                  }}>
                    {member.name}
                    <Edit3 size={11} color="#fc791a" style={{ marginLeft: '6px', opacity: 0.6 }} />
                  </h3>

                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#f3f4f6',
                    color: '#4b5563',
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '3px 12px',
                    borderRadius: '12px',
                    marginBottom: '12px'
                  }}>
                    {member.role || 'Volunteer'}
                  </div>

                  {member.reviewText && (
                    <p style={{
                      fontSize: '13px',
                      lineHeight: '1.6',
                      color: '#6b7280',
                      margin: 0,
                      fontStyle: 'italic'
                    }}>
                      "{member.reviewText}"
                    </p>
                  )}
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
          title="Edit Team Section Header"
          fields={[
            { name: 'subheading', label: 'Badge / Subheading', value: subheading },
            { name: 'title', label: 'Main Heading Title', value: title }
          ]}
          onSave={handleUpdateHeader}
        />
      )}

      {avatarModalIdx !== null && (
        <VisualImageModal
          isOpen={true}
          onClose={() => setAvatarModalIdx(null)}
          title={`Update Photo for "${items[avatarModalIdx]?.name}"`}
          currentImage={items[avatarModalIdx]?.avatar}
          onSelectImage={(url) => handleUpdateMember(avatarModalIdx, { avatar: url })}
        />
      )}

      {memberModalIdx !== null && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setMemberModalIdx(null)}
          title={`Edit Team Member #${memberModalIdx + 1}`}
          fields={[
            { name: 'name', label: 'Member Full Name', value: items[memberModalIdx]?.name },
            { name: 'role', label: 'Designation / Role', value: items[memberModalIdx]?.role },
            { name: 'reviewText', label: 'Bio / Testimonial Quote', value: items[memberModalIdx]?.reviewText, type: 'textarea', rows: 3 }
          ]}
          onSave={(vals) => handleUpdateMember(memberModalIdx, vals)}
        />
      )}

    </div>
  );
}
