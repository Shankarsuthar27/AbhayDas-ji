import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Newspaper, 
  Calendar, 
  Image as ImageIcon, 
  PenLine, 
  CalendarPlus, 
  UploadCloud, 
  ArrowRight,
  Database,
  ShieldCheck,
  HardDrive,
  Sliders
} from 'lucide-react';
import './Admin.css';

export default function DashboardPage({ onNavigate }) {
  const [stats, setStats] = useState({
    newsCount: 0,
    eventsCount: 0,
    galleryCount: 0,
    loading: true
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      try {
        const [newsSnap, eventsSnap, gallerySnap] = await Promise.allSettled([
          getDocs(collection(db, 'news')),
          getDocs(collection(db, 'events')),
          getDocs(collection(db, 'gallery'))
        ]);

        if (isMounted) {
          setStats({
            newsCount: newsSnap.status === 'fulfilled' ? newsSnap.value.size : 0,
            eventsCount: eventsSnap.status === 'fulfilled' ? eventsSnap.value.size : 0,
            galleryCount: gallerySnap.status === 'fulfilled' ? gallerySnap.value.size : 0,
            loading: false
          });
        }
      } catch (err) {
        if (isMounted) {
          setStats((prev) => ({ ...prev, loading: false }));
        }
      }
    }

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleGo = (path) => {
    if (onNavigate) onNavigate(path);
    else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  return (
    <div className="admin-page-container">
      {/* Clean Minimal Header */}
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-heading">Dashboard</h1>
          <p className="admin-page-desc">
            Overview and quick management of portal content and media.
          </p>
        </div>
      </div>

      {/* Minimal Metric Cards */}
      <div className="admin-metrics-grid">
        {/* News Card */}
        <div className="admin-metric-card" onClick={() => handleGo('/wp-admin/news')}>
          <div className="admin-metric-top">
            <div className="admin-metric-icon-box">
              <Newspaper size={18} />
            </div>
            <span className="admin-metric-tag">News</span>
          </div>
          <div className="admin-metric-value">
            {stats.loading ? '—' : stats.newsCount}
          </div>
          <div className="admin-metric-label">Published Articles</div>
          <div className="admin-metric-link">
            <span>Manage articles</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Events Card */}
        <div className="admin-metric-card" onClick={() => handleGo('/wp-admin/events')}>
          <div className="admin-metric-top">
            <div className="admin-metric-icon-box">
              <Calendar size={18} />
            </div>
            <span className="admin-metric-tag">Events</span>
          </div>
          <div className="admin-metric-value">
            {stats.loading ? '—' : stats.eventsCount}
          </div>
          <div className="admin-metric-label">Scheduled Yatras &amp; Events</div>
          <div className="admin-metric-link">
            <span>Manage events</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Gallery Card */}
        <div className="admin-metric-card" onClick={() => handleGo('/wp-admin/gallery')}>
          <div className="admin-metric-top">
            <div className="admin-metric-icon-box">
              <ImageIcon size={18} />
            </div>
            <span className="admin-metric-tag">Gallery</span>
          </div>
          <div className="admin-metric-value">
            {stats.loading ? '—' : stats.galleryCount}
          </div>
          <div className="admin-metric-label">Uploaded Photos</div>
          <div className="admin-metric-link">
            <span>Manage photos</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Two Column Grid: Quick Actions & Backend Info */}
      <div className="admin-grid-two-col">
        {/* Quick Actions Card */}
        <div className="admin-panel-card">
          <h3 className="admin-panel-title">Quick Actions</h3>
          <p className="admin-panel-subtitle">Create and manage content with one click</p>
          <div className="admin-shortcuts-list">
            <button
              type="button"
              className="admin-shortcut-btn"
              onClick={() => handleGo('/wp-admin/homepage')}
              style={{ borderLeft: '4px solid #f97316' }}
            >
              <div className="admin-shortcut-icon-box" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
                <Sliders size={17} />
              </div>
              <div className="admin-shortcut-info">
                <strong>Homepage CMS (All 12 Sections)</strong>
                <span>Edit hero, kathas, donations, gallery, footer & more</span>
              </div>
              <ArrowRight size={15} className="admin-shortcut-arrow" />
            </button>

            <button
              type="button"
              className="admin-shortcut-btn"
              onClick={() => handleGo('/wp-admin/news')}
            >
              <div className="admin-shortcut-icon-box">
                <PenLine size={17} />
              </div>
              <div className="admin-shortcut-info">
                <strong>Write New Article</strong>
                <span>Add headline, rich story content, and cover image</span>
              </div>
              <ArrowRight size={15} className="admin-shortcut-arrow" />
            </button>

            <button
              type="button"
              className="admin-shortcut-btn"
              onClick={() => handleGo('/wp-admin/events')}
            >
              <div className="admin-shortcut-icon-box">
                <CalendarPlus size={17} />
              </div>
              <div className="admin-shortcut-info">
                <strong>Schedule Event</strong>
                <span>Set date, location, venue, and descriptions</span>
              </div>
              <ArrowRight size={15} className="admin-shortcut-arrow" />
            </button>

            <button
              type="button"
              className="admin-shortcut-btn"
              onClick={() => handleGo('/wp-admin/gallery')}
            >
              <div className="admin-shortcut-icon-box">
                <UploadCloud size={17} />
              </div>
              <div className="admin-shortcut-info">
                <strong>Upload Gallery Media</strong>
                <span>Add photos to Firebase Storage CDN</span>
              </div>
              <ArrowRight size={15} className="admin-shortcut-arrow" />
            </button>
          </div>
        </div>

        {/* Backend Info Card */}
        <div className="admin-panel-card">
          <h3 className="admin-panel-title">System Status</h3>
          <p className="admin-panel-subtitle">Firebase cloud infrastructure details</p>
          <div className="admin-info-table">
            <div className="admin-info-row">
              <span className="admin-info-key">
                <Database size={14} /> Database
              </span>
              <code className="admin-info-val">Firestore (NoSQL)</code>
            </div>
            <div className="admin-info-row">
              <span className="admin-info-key">
                <HardDrive size={14} /> Project ID
              </span>
              <code className="admin-info-val">shreeabhaydas-41b39</code>
            </div>
            <div className="admin-info-row">
              <span className="admin-info-key">
                <ShieldCheck size={14} /> Access
              </span>
              <span className="admin-info-val admin-badge-clean">Administrator</span>
            </div>
            <div className="admin-info-row">
              <span className="admin-info-key">Admin User</span>
              <span className="admin-info-val">admin2233</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
