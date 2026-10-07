import React, { useState, useEffect } from 'react';
import { eventsData as staticEvents } from '../data/eventsData';
import { subscribeEvents } from '../services/contentService';
import './EventsPage.css';

export default function EventsPage({
  onNavigate,
  selectedEventId,
  onSelectEvent,
  onOpenDonate,
  onOpenVolunteer
}) {
  const [events, setEvents] = useState(staticEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('list');

  // Subscribe to real-time events updates from Firestore
  useEffect(() => {
    const unsub = subscribeEvents((liveList) => {
      if (liveList && liveList.length > 0) {
        setEvents(liveList);
      }
    });
    return () => unsub();
  }, []);

  const [activeEvent, setActiveEvent] = useState(() => {
    const slugToFind = selectedEventId || (() => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const parts = path.split('/').filter(Boolean);
        if (parts.length >= 2 && parts[0] === 'events') {
          return parts[1];
        }
      }
      return null;
    })();

    if (slugToFind) {
      return staticEvents.find(e => e.id === slugToFind || e.slug === slugToFind) || null;
    }
    return null;
  });

  const [copiedToast, setCopiedToast] = useState(false);

  // Sync with selectedEventId prop or events update
  useEffect(() => {
    const slugToFind = selectedEventId || (() => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const parts = path.split('/').filter(Boolean);
        if (parts.length >= 2 && parts[0] === 'events') {
          return parts[1];
        }
      }
      return null;
    })();

    if (slugToFind) {
      const ev = events.find(e => e.id === slugToFind || e.slug === slugToFind);
      if (ev) setActiveEvent(ev);
    }
  }, [selectedEventId, events]);

  // Update document title for SEO & Accessibility
  useEffect(() => {
    if (activeEvent) {
      document.title = `${activeEvent.title} | Shree Abhaydas Ji Maharaj Events`;
    } else {
      document.title = "Events | Shree Abhay Das Ji Maharaj Official Website";
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeEvent]);

  // Filter events based on search query
  const filteredEvents = events.filter(event => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (event.title && event.title.toLowerCase().includes(q)) ||
      (event.venue && event.venue.toLowerCase().includes(q)) ||
      (event.location && event.location.toLowerCase().includes(q)) ||
      (event.artist && event.artist.toLowerCase().includes(q)) ||
      (event.shortDescription && event.shortDescription.toLowerCase().includes(q)) ||
      (event.description && event.description.toLowerCase().includes(q))
    );
  });

  const handleOpenEvent = (event) => {
    setActiveEvent(event);
    if (onSelectEvent) {
      onSelectEvent(event.slug);
    } else {
      window.history.pushState({}, '', `/events/${event.slug}`);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToList = () => {
    setActiveEvent(null);
    if (onNavigate) {
      onNavigate('/events');
    } else {
      window.history.pushState({}, '', '/events');
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    });
  };

  // Helper to construct Google Calendar link
  const getGoogleCalendarUrl = (event) => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.shortDescription}\n\nSanidhya: ${event.sanidhya}\nArtist: ${event.artist}`);
    const location = encodeURIComponent(event.fullVenue);
    // Dates in UTC format YYYYMMDDTHHmmssZ
    let dates = "20260328T143000Z/20260328T183000Z";
    if (event.day === "27") {
      dates = "20260327T143000Z/20260327T183000Z";
    }
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  // =========================================================================
  // VIEW 1: FULL SINGLE EVENT DETAIL PAGE
  // =========================================================================
  if (activeEvent) {
    const otherEvents = (events || staticEvents).filter(e => e.id !== activeEvent.id);

    return (
      <div className="event-detail-wrapper">
        {/* Navigation Bar */}
        <div className="event-detail-nav-bar">
          <div className="event-detail-nav-inner">
            <button
              type="button"
              className="btn-back-to-events"
              onClick={handleBackToList}
              id="btn-back-to-events"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to All Events</span>
            </button>

            <nav aria-label="Breadcrumb" className="event-breadcrumb">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('/');
                  else window.history.pushState({}, '', '/');
                }}
              >
                Home
              </a>
              <span>/</span>
              <a
                href="/events"
                onClick={(e) => {
                  e.preventDefault();
                  handleBackToList();
                }}
              >
                Events
              </a>
              <span>/</span>
              <span style={{ color: '#111827', fontWeight: '600' }}>
                {activeEvent.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Main Event Detail Container */}
        <div className="event-detail-grid">
          
          {/* Left Column: Full Content */}
          <article className="event-detail-main">
            
            <header className="event-detail-header">
              <div className="event-sanidhya-tag">
                <span>🕉️</span>
                <span>{activeEvent.sanidhya}</span>
              </div>

              <h1 className="event-detail-title">
                {activeEvent.title}
              </h1>

              <div className="event-detail-time-row">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fc791a" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {activeEvent.dateFormatted}
                </span>

                <span>•</span>

                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fc791a" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {activeEvent.timing}
                </span>

                <span>•</span>

                <span style={{ color: '#02A95C', fontWeight: '700' }}>
                  {activeEvent.entry}
                </span>
              </div>
            </header>

            {/* Prominent Full Poster Image Display */}
            <div className="event-full-poster-wrapper">
              <img
                src={activeEvent.image}
                alt={activeEvent.title}
                className="event-full-poster-img"
              />
            </div>

            {/* Description Articles */}
            <div className="event-detail-body">
              <h3 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '22px', fontWeight: '700', color: '#122f2a', margin: '0 0 16px 0' }}>
                कार्यक्रम विवरण (Event Overview)
              </h3>

              {activeEvent.fullDescription.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Schedule Timeline */}
            <div className="event-schedule-block">
              <h4 className="event-schedule-title">
                कार्यक्रम समय सारिणी (Program Schedule)
              </h4>
              <div className="event-schedule-list">
                {activeEvent.schedule.map((item, idx) => (
                  <div key={idx} className="event-schedule-item">
                    <span className="event-schedule-time">{item.time}</span>
                    <span className="event-schedule-desc">{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Share and Calendar Action Buttons */}
            <div className="event-action-buttons-row">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`*${activeEvent.title}*\n${activeEvent.shortDescription}\n\nVenue: ${activeEvent.fullVenue}\nDetails: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-event-action-primary"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Share on WhatsApp</span>
              </a>

              <a
                href={getGoogleCalendarUrl(activeEvent)}
                target="_blank"
                rel="noreferrer"
                className="btn-event-action-secondary"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Add to Google Calendar</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="btn-event-action-secondary"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <span>{copiedToast ? 'Link Copied! ✓' : 'Copy Link'}</span>
              </button>
            </div>

          </article>

          {/* Right Column: Sidebar */}
          <aside className="event-detail-sidebar">
            
            {/* Event Quick Information Card */}
            <div className="event-info-card">
              <h3 className="event-info-card-title">
                आयोजन जानकारी (Details)
              </h3>

              <div className="event-info-rows">
                
                <div className="event-info-row">
                  <span className="event-info-icon">📅</span>
                  <div>
                    <div className="event-info-label">Date</div>
                    <div className="event-info-val">{activeEvent.dateFormatted}</div>
                  </div>
                </div>

                <div className="event-info-row">
                  <span className="event-info-icon">⏰</span>
                  <div>
                    <div className="event-info-label">Time</div>
                    <div className="event-info-val">{activeEvent.timeStr}</div>
                  </div>
                </div>

                <div className="event-info-row">
                  <span className="event-info-icon">🎤</span>
                  <div>
                    <div className="event-info-label">Performer</div>
                    <div className="event-info-val">{activeEvent.artist}</div>
                  </div>
                </div>

                <div className="event-info-row">
                  <span className="event-info-icon">📍</span>
                  <div>
                    <div className="event-info-label">Venue Location</div>
                    <div className="event-info-val">{activeEvent.fullVenue}</div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeEvent.fullVenue)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '13px', color: '#fc791a', textDecoration: 'underline', marginTop: '4px', display: 'inline-block' }}
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>

                <div className="event-info-row">
                  <span className="event-info-icon">📞</span>
                  <div>
                    <div className="event-info-label">Helpline Number</div>
                    <div className="event-info-val">
                      <a href="tel:+918696298489" style={{ color: 'inherit', textDecoration: 'none' }}>+91 8696298489</a>
                    </div>
                  </div>
                </div>

                <div className="event-info-row">
                  <span className="event-info-icon">🎟️</span>
                  <div>
                    <div className="event-info-label">Cost</div>
                    <div className="event-info-val" style={{ color: '#02A95C' }}>
                      {activeEvent.entry}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Other Events Widget */}
            {otherEvents.length > 0 && (
              <div className="other-events-widget">
                <h4 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '18px', fontWeight: '700', color: '#122f2a', margin: '0 0 16px 0' }}>
                  More Events (अन्य आयोजन)
                </h4>

                {otherEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="other-events-item"
                    onClick={() => handleOpenEvent(ev)}
                  >
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="other-events-thumb"
                    />
                    <div className="other-events-info">
                      <h5>{ev.title}</h5>
                      <span>{ev.timeStr}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Support / Seva CTA */}
            <div style={{
              background: 'linear-gradient(135deg, #0b231c 0%, #122f2a 100%)',
              borderRadius: '12px',
              padding: '24px',
              color: '#ffffff',
              boxShadow: '0 6px 20px rgba(11,35,28,0.2)'
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#f59e0b' }}>
                Join Dharmic Seva
              </h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.6' }}>
                Support the divine satsang, Annadan bhandara, and Gau Seva at Takhatgarh Dham.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (onOpenDonate) onOpenDonate('event-seva');
                }}
                style={{
                  backgroundColor: '#fc791a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '50px',
                  fontWeight: '700',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>Support Seva</span>
                <span>→</span>
              </button>
            </div>

          </aside>

        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: EVENTS DIRECTORY (Matches Uploaded Screenshot)
  // =========================================================================
  return (
    <div className="events-page-wrapper">
      <div className="events-page-container">

        {/* 1. Top Search and View Switcher Toolbar */}
        <div className="events-toolbar">
          
          <div className="events-search-box">
            <svg
              className="events-search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="events-search-input"
              placeholder="Search for events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search for events"
            />
          </div>

          <div className="events-toolbar-right">
            <button
              type="button"
              className="btn-find-events"
              onClick={() => {
                // Focus search or filter
              }}
            >
              Find Events
            </button>

            <div className="events-view-switcher" role="tablist">
              <button
                type="button"
                className={`events-view-btn ${activeView === 'list' ? 'active' : ''}`}
                onClick={() => setActiveView('list')}
                role="tab"
                aria-selected={activeView === 'list'}
              >
                List
              </button>
              <button
                type="button"
                className={`events-view-btn ${activeView === 'month' ? 'active' : ''}`}
                onClick={() => setActiveView('month')}
                role="tab"
                aria-selected={activeView === 'month'}
              >
                Month
              </button>
              <button
                type="button"
                className={`events-view-btn ${activeView === 'day' ? 'active' : ''}`}
                onClick={() => setActiveView('day')}
                role="tab"
                aria-selected={activeView === 'day'}
              >
                Day
              </button>
            </div>
          </div>

        </div>

        {/* 2. Subheader Navigation (Arrows, Today, Upcoming dropdown) */}
        <div className="events-subnav">
          <div className="events-subnav-left">
            <button
              type="button"
              className="events-nav-arrow"
              aria-label="Previous Events"
              title="Previous Events"
            >
              &lt;
            </button>
            <button
              type="button"
              className="events-nav-arrow"
              aria-label="Next Events"
              title="Next Events"
            >
              &gt;
            </button>
            <button
              type="button"
              className="events-today-btn"
            >
              Today
            </button>
          </div>

          <div>
            <button
              type="button"
              className="events-upcoming-dropdown-btn"
            >
              <span>Upcoming</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 3. Notice Banner: "There are no upcoming events." */}
        <div className="events-notice-banner" role="status">
          There are no upcoming events.
        </div>

        {/* 4. Section Title: Latest Past Events */}
        <h2 className="events-section-heading">
          Latest Past Events
        </h2>

        {/* 5. Events List Container */}
        <div className="events-list-container">
          {filteredEvents.map((event) => (
            <article
              key={event.id}
              className="events-item-card"
            >
              
              {/* Left Column: Date Block */}
              <div className="event-date-col">
                <span className="event-date-month">{event.month}</span>
                <span className="event-date-day">{event.day}</span>
                <span className="event-date-year">{event.year}</span>
              </div>

              {/* Center Column: Details */}
              <div className="event-content-col">
                <div className="event-time-badge">
                  {event.timeStr}
                </div>

                <h3 className="event-title-heading">
                  <a
                    href={`/events/${event.slug}`}
                    className="event-title-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenEvent(event);
                    }}
                    title={`View details for ${event.title}`}
                  >
                    {event.title}
                  </a>
                </h3>

                <div className="event-venue-text">
                  {event.venue}
                </div>

                <p className="event-excerpt-text">
                  {event.shortDescription}
                </p>

                <button
                  type="button"
                  className="event-readmore-btn"
                  onClick={() => handleOpenEvent(event)}
                >
                  <span>View Full Event Details</span>
                  <span>→</span>
                </button>
              </div>

              {/* Right Column: Poster Image */}
              <div
                className="event-image-col"
                onClick={() => handleOpenEvent(event)}
                title={`Click to open full page for ${event.title}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenEvent(event);
                  }
                }}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-poster-img"
                  loading="lazy"
                />
                <div className="event-image-overlay-badge">
                  <span>🔍</span>
                  <span>Click for Full Page</span>
                </div>
              </div>

            </article>
          ))}

          {filteredEvents.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
              <p style={{ fontSize: '18px', fontWeight: '600' }}>No events found matching "{searchQuery}"</p>
              <button
                type="button"
                className="btn-back-to-events"
                onClick={() => setSearchQuery('')}
                style={{ marginTop: '12px' }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
