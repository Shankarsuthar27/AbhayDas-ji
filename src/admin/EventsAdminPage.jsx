import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Calendar, 
  RotateCw, 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import './Admin.css';

export default function EventsAdminPage() {
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Form Fields
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // Fetch all events from Firestore
  const fetchEvents = async () => {
    setLoading(true);
    try {
      let eventsQuery;
      try {
        eventsQuery = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
      } catch (e) {
        eventsQuery = collection(db, 'events');
      }

      const snapshot = await getDocs(eventsQuery);
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      setEventsList(items);
    } catch (err) {
      console.error('Error fetching events from Firestore:', err);
      try {
        const snap = await getDocs(collection(db, 'events'));
        setEventsList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (fallbackErr) {
        setFeedback({
          type: 'error',
          message: `Unable to load events: ${fallbackErr.message}. Make sure Firestore rules allow read access.`
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4500);
  };

  // Add new event to Firestore
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!eventName.trim() || !date.trim() || !location.trim() || !description.trim()) {
      showToast('error', 'Please fill in Event Name, Date, Location, and Description.');
      return;
    }

    setSubmitting(true);
    try {
      const cleanSlug = eventName
        .trim()
        .toLowerCase()
        .replace(/[^\w\u0900-\u097F\-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const newDoc = {
        name: eventName.trim(),
        title: eventName.trim(),
        slug: cleanSlug || `event-${Date.now()}`,
        date: date.trim(),
        location: location.trim(),
        venue: location.trim(),
        description: description.trim(),
        status: 'Upcoming',
        author: 'admin2233',
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'events'), newDoc);
      showToast('success', `Event created in Firestore! (ID: ${docRef.id.slice(0, 6)}...)`);

      // Reset form
      setEventName('');
      setLocation('');
      setDescription('');

      // Refresh list
      fetchEvents();
    } catch (err) {
      console.error('Error creating event in Firestore:', err);
      showToast('error', `Failed to create event: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id, itemTitle) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this event?\n"${itemTitle}"`);
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'events', id));
      showToast('success', 'Event removed from Firestore.');
      setEventsList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
      showToast('error', `Failed to delete event: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-heading">Events &amp; Yatras</h1>
          <p className="admin-page-desc">
            Schedule upcoming gatherings, kathas, and events stored in the Firestore database.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-secondary"
          onClick={fetchEvents}
          disabled={loading}
        >
          <RotateCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Alert / Feedback */}
      {feedback.message && (
        <div className={`admin-alert ${feedback.type}`} role="alert">
          {feedback.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Form: Add Event */}
      <div className="admin-form-card">
        <h2 className="admin-card-title">Schedule New Upcoming Event</h2>
        <form onSubmit={handleAddEvent} className="admin-crud-form">
          <div className="admin-form-row">
            <div className="admin-form-group flex-2">
              <label className="admin-label">Event Name / Title *</label>
              <input
                type="text"
                className="admin-input-control"
                placeholder="e.g. Shrimad Bhagwat Katha - Takhatgarh Dham"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Event Date *</label>
              <input
                type="date"
                className="admin-input-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Location / Venue *</label>
              <input
                type="text"
                className="admin-input-control"
                placeholder="e.g. Trikam Das Ji Dham, Pali"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Event Description &amp; Details *</label>
            <textarea
              rows={4}
              className="admin-textarea-control"
              placeholder="Enter schedule times, guest speakers, accommodation info, or yatra highlights..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving to Firestore...' : (
                <>
                  <Plus size={15} /> Schedule Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* List: Existing Events */}
      <div className="admin-list-card">
        <div className="admin-list-header">
          <h2 className="admin-card-title">
            Existing Events ({eventsList.length})
          </h2>
          <span className="admin-badge-count">{eventsList.length} Items</span>
        </div>

        {loading ? (
          <div className="admin-loading-indicator">
            <div className="admin-spinner" />
            <span>Fetching events from Firestore...</span>
          </div>
        ) : eventsList.length === 0 ? (
          <div className="admin-empty-state">
            <Calendar size={32} className="admin-empty-icon-svg" />
            <h3>No scheduled events yet</h3>
            <p>Use the form above to add upcoming events to the database.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Event Name</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Description Preview</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {eventsList.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="admin-table-title">{item.name || item.title}</div>
                      <div className="admin-table-id">ID: {item.id.slice(0, 8)}...</div>
                    </td>
                    <td>
                      <span className="admin-table-date">{item.date}</span>
                    </td>
                    <td>
                      <span className="admin-table-location">
                        <MapPin size={13} className="inline mr-1" />
                        {item.location}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-desc-preview">
                        {item.description}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="admin-btn-delete"
                        onClick={() => handleDeleteEvent(item.id, item.name || item.title)}
                        disabled={deletingId === item.id}
                        title="Delete from Firestore"
                      >
                        <Trash2 size={13} />
                        {deletingId === item.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
