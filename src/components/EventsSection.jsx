import React, { useState, useEffect } from 'react';
import { websiteData } from '../data/websiteData';
import { subscribeEvents } from '../services/contentService';
import { useCms } from '../context/CmsContext';

export default function EventsSection({ onOpenVolunteer, onNavigate }) {
  const { cms } = useCms();
  const eventsCms = cms?.events || {};
  const sectionTitle = eventsCms.title || eventsCms.sectionTitle || 'Upcoming Event Schedule';
  const viewAllUrl = eventsCms.viewAllUrl || '/events';

  const [events, setEvents] = useState(websiteData.events);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  useEffect(() => {
    // Always subscribe to real-time Events updates so any added event appears immediately on homepage
    const unsub = subscribeEvents((liveList) => {
      if (liveList && liveList.length > 0) {
        const publishedEvents = liveList.filter((e) => e.status !== 'draft');
        setEvents(publishedEvents);
      }
    });
    return () => unsub();
  }, []);

  const handleRSVP = (e) => {
    e.preventDefault();
    setRsvpSuccess(true);
    setTimeout(() => {
      setRsvpSuccess(false);
      setSelectedEvent(null);
    }, 2500);
  };

  return (
    <section id="events" style={{
      padding: '80px 0 90px',
      backgroundColor: '#0b231c', // Deep forest green matching user reference screenshot
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Green Waves & Squiggles matching user screenshot */}
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
        <path d="M50 140 Q 115 70, 190 140 T 330 140" stroke="#10b981" strokeWidth="2" fill="none" />
      </svg>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        
        {/* Header Row matching user screenshot */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '40px'
        }}>
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
              {sectionTitle}
            </h2>
          </div>

          {/* Green Pill Button matching screenshot: "Events All" */}
          <button
            onClick={() => {
              if (viewAllUrl.startsWith('http')) {
                window.open(viewAllUrl, '_blank');
              } else if (onNavigate) {
                onNavigate(viewAllUrl);
              } else {
                window.history.pushState({}, '', viewAllUrl);
                window.dispatchEvent(new Event('popstate'));
              }
            }}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              padding: '11px 26px',
              borderRadius: '50px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
          >
            <span>📅</span> Events All
          </button>
        </div>

        {/* Event Cards Grid */}
        <div
          className="events-section-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}
        >
          {events.map((evt) => (
            <div
              key={evt.id}
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '20px',
                padding: '24px',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', marginBottom: '16px' }}>
                {/* Date Badge */}
                <div style={{
                  backgroundColor: '#fc791a',
                  color: '#ffffff',
                  borderRadius: '14px',
                  width: '64px',
                  height: '64px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(252, 121, 26, 0.4)'
                }}>
                  <span style={{ fontSize: '22px', fontWeight: '800', lineHeight: 1 }}>{evt.day || '28'}</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>{evt.month || 'MAR'}</span>
                </div>

                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#ffffff', margin: '0 0 6px 0', lineHeight: '1.4' }}>
                    {evt.title}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#a7f3d0' }}>
                    📍 {evt.location || evt.venue || 'Takhatgarh Dham'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                    ⏰ {evt.time || evt.timeStr || '8:00 PM Onwards'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  border: '1px solid #10b981',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  {evt.badge || (evt.status === 'published' ? 'Upcoming' : (evt.status || 'Upcoming'))}
                </span>

                <button
                  onClick={() => {
                    if (evt.detailsUrl && !evt.detailsUrl.startsWith('#')) {
                      if (evt.detailsUrl.startsWith('http')) {
                        window.open(evt.detailsUrl, '_blank');
                      } else if (onNavigate) {
                        onNavigate(evt.detailsUrl);
                      }
                    } else {
                      setSelectedEvent(evt);
                    }
                  }}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#0b231c',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '8px 18px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#10b981';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#0b231c';
                  }}
                >
                  View Details →
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* RSVP Modal */}
      {selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div
            onClick={() => setSelectedEvent(null)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)'
            }}
          />
          <div style={{
            position: 'relative',
            zIndex: 1,
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            maxWidth: '480px',
            width: '100%',
            padding: '30px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            color: '#111827'
          }}>
            <button
              onClick={() => setSelectedEvent(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#f3f4f6',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ✕
            </button>

            <span style={{ color: '#fc791a', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>
              Event Free Entry Pass
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: '4px 0 10px 0' }}>
              {selectedEvent.title}
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
              📍 {selectedEvent.location} • ⏰ {selectedEvent.time}
            </p>

            {/* कार्यक्रम समय सारिणी (Program Schedule) */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '18px'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '800',
                color: '#0f172a',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>🕒</span> कार्यक्रम समय सारिणी (Program Schedule)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(selectedEvent.schedule && selectedEvent.schedule.length > 0 ? selectedEvent.schedule : [
                  { time: '07:30 PM', activity: 'भक्तजनों का आगमन एवं स्वागत' },
                  { time: '08:00 PM', activity: 'दीप प्रज्वलन एवं आशीर्वचन' },
                  { time: '11:00 PM', activity: 'महाआरती एवं प्रसादी वितरण' }
                ]).map((slot, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                    <span style={{
                      fontWeight: '800',
                      color: '#059669',
                      backgroundColor: '#ecfdf5',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      minWidth: '68px',
                      textAlign: 'center',
                      fontSize: '11px'
                    }}>
                      {slot.time}
                    </span>
                    <span style={{ color: '#334155', fontWeight: '600' }}>
                      {slot.activity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {rsvpSuccess ? (
              <div style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '12px',
                padding: '16px',
                color: '#065f46',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                🎉 Your attendance has been confirmed! We look forward to your divine presence.
              </div>
            ) : (
              <form onSubmit={handleRSVP}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
                    Mobile Number (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
                    Attendees
                  </label>
                  <select style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}>
                    <option>1 Person</option>
                    <option>2 - 4 Family Members</option>
                    <option>5+ Devotee Group</option>
                  </select>
                </div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '12px',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Free Pass
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
