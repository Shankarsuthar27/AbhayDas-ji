import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { NewsEditor } from './NewsEditor';
import {
  Plus,
  Search,
  RotateCw,
  Edit3,
  Trash2,
  ExternalLink,
  Calendar,
  Tag,
  Clock,
  Sparkles,
  FileText,
  CheckCircle2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import './Admin.css';
import './editor/Editor.css';

export default function NewsAdminPage({ onNavigate }) {
  // Modes: 'list' | 'create' | 'edit'
  const [viewMode, setViewMode] = useState('list');
  const [editingId, setEditingId] = useState(null);

  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Fetch all news items from Firestore
  const fetchNews = async () => {
    setLoading(true);
    try {
      let newsQuery;
      try {
        newsQuery = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
      } catch (e) {
        newsQuery = collection(db, 'news');
      }

      const snapshot = await getDocs(newsQuery);
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      setNewsList(items);
    } catch (err) {
      console.error('Error fetching news from Firestore:', err);
      try {
        const snap = await getDocs(collection(db, 'news'));
        setNewsList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (fallbackErr) {
        toast.error(`Unable to load news: ${fallbackErr.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Delete article
  const handleDeleteNews = async (id, itemTitle) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this article?\n"${itemTitle}"`);
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'news', id));
      toast.success('News article removed from Firestore.');
      setNewsList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting news:', err);
      toast.error(`Failed to delete: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // If in create or edit mode, show the full Notion-style NewsEditor
  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="admin-page-container">
        <Toaster position="top-right" />
        <NewsEditor
          editId={viewMode === 'edit' ? editingId : null}
          onBack={() => {
            setViewMode('list');
            setEditingId(null);
            fetchNews();
          }}
          onSaved={() => {
            setViewMode('list');
            setEditingId(null);
            fetchNews();
          }}
        />
      </div>
    );
  }

  // Filter items
  const filteredNews = newsList.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.slug && item.slug.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      filterCategory === 'all' ||
      (item.category && item.category.toLowerCase().includes(filterCategory.toLowerCase())) ||
      (item.categoryId && item.categoryId.toLowerCase().includes(filterCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  const featuredCount = newsList.filter((n) => n.featured).length;

  return (
    <div className="admin-page-container">
      <Toaster position="top-right" />

      {/* Top Header */}
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-heading">News &amp; Press Releases</h1>
          <p className="admin-page-desc">
            Manage official announcements, spiritual news, and media releases for <strong>shreeabhaydas.com</strong>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={fetchNews}
            disabled={loading}
          >
            <RotateCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={() => {
              setEditingId(null);
              setViewMode('create');
            }}
          >
            <Plus size={16} /> Write New Article
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="admin-metrics-grid" style={{ marginBottom: '24px' }}>
        <div className="admin-metric-card">
          <div className="admin-metric-top">
            <div className="admin-metric-icon-box">
              <FileText size={18} />
            </div>
            <span className="admin-metric-tag">Total</span>
          </div>
          <div className="admin-metric-value">{newsList.length}</div>
          <div className="admin-metric-label">Published Articles</div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-top">
            <div className="admin-metric-icon-box">
              <Sparkles size={18} />
            </div>
            <span className="admin-metric-tag">Featured</span>
          </div>
          <div className="admin-metric-value">{featuredCount}</div>
          <div className="admin-metric-label">Homepage Featured</div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-top">
            <div className="admin-metric-icon-box">
              <Tag size={18} />
            </div>
            <span className="admin-metric-tag">Editor</span>
          </div>
          <div className="admin-metric-value" style={{ fontSize: '20px', paddingTop: '6px' }}>
            TipTap + AI
          </div>
          <div className="admin-metric-label">Rich Story Canvas</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '260px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '8px 14px',
              width: '100%'
            }}
          >
            <Search size={15} color="#64748b" />
            <input
              type="text"
              placeholder="Search by article title, headline, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '13px',
                width: '100%',
                color: '#0f172a'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '9px 14px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '12.5px',
              color: '#0f172a',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Categories</option>
            <option value="spiritual">Spiritual</option>
            <option value="gurukulam">Gurukulam &amp; Education</option>
            <option value="social">Social Welfare</option>
            <option value="press">Press Release</option>
            <option value="events">Events &amp; Kathas</option>
          </select>

          {(searchTerm || filterCategory !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
              }}
              style={{
                padding: '8px 12px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '8px',
                fontSize: '11.5px',
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Articles Table Card */}
      <div className="admin-list-card">
        <div className="admin-list-header">
          <h2 className="admin-card-title">
            Articles in Firestore ({filteredNews.length})
          </h2>
          <span className="admin-badge-count">{filteredNews.length} Filtered</span>
        </div>

        {loading ? (
          <div className="admin-loading-indicator">
            <div className="admin-spinner" />
            <span>Fetching articles from Firestore 'news' collection...</span>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="admin-empty-state">
            <span className="admin-empty-icon">📰</span>
            <h3>No articles found</h3>
            <p>
              {searchTerm || filterCategory !== 'all'
                ? 'Try adjusting your search criteria.'
                : 'Click "Write New Article" above to create your first article.'}
            </p>
            <button
              type="button"
              className="admin-btn-primary"
              onClick={() => setViewMode('create')}
              style={{
                marginTop: '12px',
                background: 'linear-gradient(135deg, #0891b2 0%, #0ea5e9 100%)'
              }}
            >
              <Plus size={15} /> Write New Article
            </button>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '42%' }}>Article Headline</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date &amp; Read Time</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNews.map((item) => {
                  const coverImg = item.featuredImage || item.image || item.url || item.imageUrl;
                  return (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          {coverImg ? (
                            <img
                              src={coverImg}
                              alt=""
                              style={{
                                width: '56px',
                                height: '42px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                flexShrink: 0
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '56px',
                                height: '42px',
                                background: '#f1f5f9',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                flexShrink: 0
                              }}
                            >
                              📰
                            </div>
                          )}

                          <div>
                            <div className="admin-table-title" style={{ fontSize: '14px', fontWeight: '700' }}>
                              {item.title}
                              {item.featured && (
                                <span
                                  style={{
                                    marginLeft: '6px',
                                    fontSize: '10px',
                                    padding: '2px 6px',
                                    background: '#fef3c7',
                                    color: '#d97706',
                                    borderRadius: '6px',
                                    fontWeight: '700'
                                  }}
                                >
                                  ⭐ Featured
                                </span>
                              )}
                            </div>
                            <div className="admin-table-id" style={{ marginTop: '2px' }}>
                              {item.slug ? `/news/${item.slug}` : `ID: ${item.id.slice(0, 8)}...`}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-tag-pill">
                          {item.category || item.categoryId || 'General'}
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            background: item.status === 'draft' ? '#f1f5f9' : '#ecfeff',
                            color: item.status === 'draft' ? '#64748b' : '#0891b2',
                            border: `1px solid ${item.status === 'draft' ? '#e2e8f0' : '#cffafe'}`
                          }}
                        >
                          <span
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              background: item.status === 'draft' ? '#64748b' : '#0891b2'
                            }}
                          />
                          {item.status || 'published'}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: '600' }}>
                          {item.date || (item.createdAt ? item.createdAt.split('T')[0] : '—')}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} /> {item.readingTime || '1 min read'}
                        </div>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(item.id);
                              setViewMode('edit');
                            }}
                            className="admin-btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '12px' }}
                            title="Edit with TipTap Editor"
                          >
                            <Edit3 size={13} /> Edit
                          </button>

                          <a
                            href="/news"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '12px', textDecoration: 'none' }}
                            title="View on public site"
                          >
                            <ExternalLink size={13} />
                          </a>

                          <button
                            type="button"
                            className="admin-btn-delete"
                            onClick={() => handleDeleteNews(item.id, item.title)}
                            disabled={deletingId === item.id}
                            title="Delete from Firestore"
                            style={{ padding: '6px 10px' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
