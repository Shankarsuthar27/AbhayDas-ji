import React, { useState } from 'react';
import { Edit3, Plus, Trash2, ChevronUp, ChevronDown, Clock, MapPin, Calendar } from 'lucide-react';
import VisualTextModal from './VisualTextModal';

export default function EventsVisualEditor({
  formData,
  updateSection,
  viewport = 'desktop',
  onNotify
}) {
  const evData = formData?.events || {};
  const title = evData.title || 'Upcoming Event Schedule';
  const viewAllText = evData.viewAllText || 'Events All';
  const viewAllUrl = evData.viewAllUrl || '/events';
  const items = evData.items && evData.items.length > 0 ? evData.items : [
    {
      id: 'ev1',
      day: '28',
      month: 'MAR',
      title: 'तखतगढ़ धाम भजन संध्या - 28 मार्च',
      time: '8:00 PM Onwards',
      location: 'Takhatgarh Dham, Pali',
      detailsUrl: '/events',
      status: 'published'
    },
    {
      id: 'ev2',
      day: '27',
      month: 'MAR',
      title: 'तखतगढ़ धाम दिव्य महोत्सव - 27 मार्च',
      time: '8:00 PM Onwards',
      location: 'Takhatgarh Dham, Pali',
      detailsUrl: '/events',
      status: 'published'
    },
    {
      id: 'ev3',
      day: '15',
      month: 'APR',
      title: 'वार्षिक पाटोत्सव एवं महाआरती',
      time: '7:00 PM Onwards',
      location: 'Sadguru Trikam Das Ji Dham',
      detailsUrl: '/events',
      status: 'published'
    }
  ];

  const [headerModal, setHeaderModal] = useState(false);
  const [eventModalIdx, setEventModalIdx] = useState(null);

  const handleUpdateHeader = (vals) => {
    updateSection('events', {
      title: vals.title,
      viewAllText: vals.viewAllText,
      viewAllUrl: vals.viewAllUrl
    });
    onNotify?.('Updated Events Header');
  };

  const handleUpdateEvent = (idx, updates) => {
    const list = [...items];
    list[idx] = { ...list[idx], ...updates };
    updateSection('events', { items: list });
    onNotify?.(`Updated Event #${idx + 1}`);
  };

  const handleAddEvent = () => {
    const newEvent = {
      id: `ev_${Date.now()}`,
      day: '01',
      month: 'NOV',
      title: 'नया धार्मिक सत्संग एवं प्रवचन',
      time: '8:00 PM Onwards',
      location: 'तखतगढ़ धाम, राजस्थान',
      detailsUrl: '/events',
      status: 'published'
    };
    updateSection('events', { items: [...items, newEvent] });
    onNotify?.('Added New Event');
  };

  const handleDeleteEvent = (idx) => {
    if (items.length <= 1) {
      alert('Please keep at least one event.');
      return;
    }
    const filtered = items.filter((_, i) => i !== idx);
    updateSection('events', { items: filtered });
    onNotify?.('Deleted Event');
  };

  const handleMove = (idx, direction) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= items.length) return;
    const list = [...items];
    const temp = list[idx];
    list[idx] = list[newIdx];
    list[newIdx] = temp;
    updateSection('events', { items: list });
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
            Visual Canvas Editor • 7. Upcoming Events ({items.length} Events)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleAddEvent}
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
            <Plus size={13} /> Add New Event
          </button>

          <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginLeft: '6px' }}>
            💡 Click any event, date, or venue to edit
          </span>
        </div>
      </div>

      {/* ── Main Preview matching EventsSection.jsx ── */}
      <section id="events" style={{
        padding: '80px 0 90px',
        backgroundColor: '#0b231c', // Deep forest green
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Wave decoration */}
        <svg style={{
          position: 'absolute',
          bottom: 0,
          right: '-20px',
          width: '320px',
          height: '180px',
          opacity: 0.35,
          pointerEvents: 'none'
        }} viewBox="0 0 300 150" fill="none">
          <path d="M10 80 Q 75 10, 150 80 T 290 80" stroke="#10b981" strokeWidth="4" fill="none" />
          <path d="M30 110 Q 95 40, 170 110 T 310 110" stroke="#10b981" strokeWidth="3" fill="none" />
        </svg>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          
          {/* Header Row */}
          <div
            onClick={() => setHeaderModal(true)}
            className="visual-editable-item"
            title="Click to edit Events Section Title"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '40px',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px'
            }}
          >
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#f59e0b',
                fontSize: '13px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '6px'
              }}>
                <span>✦</span> WHAT WE DO
              </div>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 42px)',
                fontWeight: '800',
                color: '#ffffff',
                margin: 0
              }}>
                {title}
                <Edit3 size={15} color="#38bdf8" style={{ marginLeft: '10px', opacity: 0.6 }} />
              </h2>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '50px',
              fontSize: '13.5px',
              fontWeight: '700'
            }}>
              <span>{viewAllText}</span>
              <Edit3 size={11} color="#ffffff" style={{ opacity: 0.8 }} />
            </div>
          </div>

          {/* Events List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map((event, idx) => (
              <div
                key={event.id || idx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  flexWrap: 'wrap',
                  position: 'relative'
                }}
              >
                {/* Left block: Date + Details */}
                <div
                  className="visual-editable-item"
                  onClick={() => setEventModalIdx(idx)}
                  title="Click to edit Day, Month, Title, Time & Venue"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    flex: 1,
                    minWidth: '260px',
                    cursor: 'pointer'
                  }}
                >
                  {/* Date Badge */}
                  <div style={{
                    width: '68px',
                    height: '68px',
                    backgroundColor: '#fc791a',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                    boxShadow: '0 4px 14px rgba(252, 121, 26, 0.35)'
                  }}>
                    <span style={{ fontSize: '24px', fontWeight: '800', lineHeight: '1' }}>
                      {event.day || '28'}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>
                      {event.month || 'MAR'}
                    </span>
                  </div>

                  {/* Text details */}
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '800',
                      color: '#ffffff',
                      margin: '0 0 8px 0',
                      lineHeight: '1.3'
                    }}>
                      {event.title}
                      <Edit3 size={12} color="#38bdf8" style={{ marginLeft: '8px', opacity: 0.6 }} />
                    </h3>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      flexWrap: 'wrap',
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.75)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={13} color="#fc791a" />
                        <span>{event.time || '8:00 PM Onwards'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={13} color="#fc791a" />
                        <span>{event.location || 'Takhatgarh Dham'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right controls & action button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '20px',
                    fontSize: '12.5px',
                    fontWeight: '700'
                  }}>
                    View Details →
                  </div>

                  {/* Move Up/Down & Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, -1)}
                      disabled={idx === 0}
                      title="Move Up"
                      style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: idx === 0 ? '#475569' : '#ffffff', cursor: idx === 0 ? 'default' : 'pointer', padding: '6px', borderRadius: '6px' }}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 1)}
                      disabled={idx === items.length - 1}
                      title="Move Down"
                      style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: idx === items.length - 1 ? '#475569' : '#ffffff', cursor: idx === items.length - 1 ? 'default' : 'pointer', padding: '6px', borderRadius: '6px' }}
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(idx)}
                      title="Delete Event"
                      style={{ background: 'rgba(239,68,68,0.2)', border: 'none', color: '#f87171', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                    >
                      <Trash2 size={14} />
                    </button>
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
          title="Edit Upcoming Events Header"
          fields={[
            { name: 'title', label: 'Section Title', value: title },
            { name: 'viewAllText', label: 'View All Button Text', value: viewAllText },
            { name: 'viewAllUrl', label: 'Destination URL', value: viewAllUrl }
          ]}
          onSave={handleUpdateHeader}
        />
      )}

      {eventModalIdx !== null && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setEventModalIdx(null)}
          title={`Edit Event Schedule #${eventModalIdx + 1}`}
          fields={[
            { name: 'day', label: 'Day (e.g. 28)', value: items[eventModalIdx]?.day || '28' },
            { name: 'month', label: 'Month (e.g. MAR)', value: items[eventModalIdx]?.month || 'MAR' },
            { name: 'title', label: 'Event Title', value: items[eventModalIdx]?.title },
            { name: 'time', label: 'Timing', value: items[eventModalIdx]?.time || '8:00 PM Onwards' },
            { name: 'location', label: 'Venue / Location', value: items[eventModalIdx]?.location || 'Takhatgarh Dham, Pali' },
            { name: 'detailsUrl', label: 'Details Link', value: items[eventModalIdx]?.detailsUrl || '/events' }
          ]}
          onSave={(vals) => handleUpdateEvent(eventModalIdx, vals)}
        />
      )}

    </div>
  );
}
