import React, { useState } from 'react';
import { Edit3, Image as ImageIcon, Plus, Trash2, ChevronLeft, ChevronRight, User, Calendar, ArrowRight } from 'lucide-react';
import VisualImageModal from './VisualImageModal';
import VisualTextModal from './VisualTextModal';

export default function NewsVisualEditor({
  formData,
  updateSection,
  viewport = 'desktop',
  onNotify
}) {
  const newsData = formData?.news || {};
  const title = newsData.title || 'Latest News And Articles';
  const viewAllText = newsData.viewAllText || 'View All';
  const viewAllUrl = newsData.viewAllUrl || '/news';
  const articles = newsData.articles && newsData.articles.length > 0 ? newsData.articles : [
    {
      id: 'n1',
      title: 'तखतगढ़ में 500 बच्चों के लिए आधुनिक गुरुकुलम का भव्य लोकार्पण',
      featuredImage: '/images/img_30.png',
      date: 'Recent',
      author: 'Shree Abhaydas',
      readMoreUrl: '/news',
      status: 'published'
    },
    {
      id: 'n2',
      title: 'मारवाड़ में गौ सेवा एवं संवर्धन हेतु अत्याधुनिक गौशाला का शुभारंभ',
      featuredImage: '/images/img_31.webp',
      date: 'Recent',
      author: 'Shree Abhaydas',
      readMoreUrl: '/news',
      status: 'published'
    },
    {
      id: 'n3',
      title: 'पूज्य अभयदास जी महाराज के पावन सानिध्य में विराट धर्मसभा संपन्न',
      featuredImage: '/images/img_32.jpg',
      date: 'Recent',
      author: 'Shree Abhaydas',
      readMoreUrl: '/news',
      status: 'published'
    }
  ];

  const [headerModal, setHeaderModal] = useState(false);
  const [imageModalIdx, setImageModalIdx] = useState(null);
  const [articleModalIdx, setArticleModalIdx] = useState(null);

  const handleUpdateHeader = (vals) => {
    updateSection('news', {
      title: vals.title,
      viewAllText: vals.viewAllText,
      viewAllUrl: vals.viewAllUrl
    });
    onNotify?.('Updated News Header');
  };

  const handleUpdateArticle = (idx, updates) => {
    const list = [...articles];
    list[idx] = { ...list[idx], ...updates };
    updateSection('news', { articles: list });
    onNotify?.(`Updated Article #${idx + 1}`);
  };

  const handleAddArticle = () => {
    const newArticle = {
      id: `n_${Date.now()}`,
      title: 'नई आध्यात्मिक एवं सामाजिक प्रेरणादायक खबर',
      featuredImage: '/images/img_30.png',
      date: 'Recent',
      author: 'Shree Abhaydas',
      readMoreUrl: '/news',
      status: 'published'
    };
    updateSection('news', { articles: [...articles, newArticle] });
    onNotify?.('Added New News Article');
  };

  const handleDeleteArticle = (idx) => {
    if (articles.length <= 1) {
      alert('Please keep at least one article.');
      return;
    }
    const filtered = articles.filter((_, i) => i !== idx);
    updateSection('news', { articles: filtered });
    onNotify?.('Deleted Article');
  };

  const handleMove = (idx, direction) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= articles.length) return;
    const list = [...articles];
    const temp = list[idx];
    list[idx] = list[newIdx];
    list[newIdx] = temp;
    updateSection('news', { articles: list });
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
            Visual Canvas Editor • 8. News & Articles ({articles.length} Articles)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleAddArticle}
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
            <Plus size={13} /> Add New Article
          </button>

          <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginLeft: '6px' }}>
            💡 Click any headline, image, or date to edit
          </span>
        </div>
      </div>

      {/* ── Main Preview matching NewsSection.jsx ── */}
      <section id="news" style={{
        padding: '75px 0 90px',
        backgroundColor: '#ffffff',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header Row */}
          <div
            onClick={() => setHeaderModal(true)}
            className="visual-editable-item"
            title="Click to edit News Section Title"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '40px',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px'
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#fc791a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                ✦ MEDIA & PRESS RELEASES
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

          {/* Articles Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewport === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '26px'
          }}>
            {articles.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {/* Top Controls */}
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
                    disabled={idx === articles.length - 1}
                    style={{ background: 'none', border: 'none', color: idx === articles.length - 1 ? '#64748b' : '#ffffff', cursor: idx === articles.length - 1 ? 'default' : 'pointer', padding: '2px' }}
                  >
                    <ChevronRight size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteArticle(idx)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Image */}
                <div
                  className="visual-editable-item"
                  onClick={() => setImageModalIdx(idx)}
                  title="Click to replace article image"
                  style={{
                    position: 'relative',
                    height: '210px',
                    backgroundColor: '#e2e8f0',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={item.featuredImage || '/images/img_30.png'}
                    alt={item.title}
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

                  {/* Date badge */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: '#fc791a',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 10px',
                    borderRadius: '10px'
                  }}>
                    {item.date || 'Recent'}
                  </div>
                </div>

                {/* Content */}
                <div
                  className="visual-editable-item"
                  onClick={() => setArticleModalIdx(idx)}
                  title="Click to edit Article Title, Date, Author & Link"
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
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '12px',
                      color: '#64748b',
                      marginBottom: '10px'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} color="#fc791a" /> {item.author || 'Shree Abhaydas'}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: '17px',
                      fontWeight: '800',
                      color: '#0d2820',
                      margin: '0 0 14px 0',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {item.title}
                    </h3>
                  </div>

                  <div style={{
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#fc791a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Read More <ArrowRight size={13} />
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
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
          title="Edit Latest News Header"
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
          title={`Update Photo for "${articles[imageModalIdx]?.title}"`}
          currentImage={articles[imageModalIdx]?.featuredImage}
          onSelectImage={(url) => handleUpdateArticle(imageModalIdx, { featuredImage: url })}
        />
      )}

      {articleModalIdx !== null && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setArticleModalIdx(null)}
          title={`Edit News Article #${articleModalIdx + 1}`}
          fields={[
            { name: 'title', label: 'Article Headline', value: articles[articleModalIdx]?.title },
            { name: 'date', label: 'Date Tag (e.g. 24 OCT)', value: articles[articleModalIdx]?.date || 'Recent' },
            { name: 'author', label: 'Author / Byline', value: articles[articleModalIdx]?.author || 'Shree Abhaydas' },
            { name: 'readMoreUrl', label: 'Article Destination Link', value: articles[articleModalIdx]?.readMoreUrl || '/news' }
          ]}
          onSave={(vals) => handleUpdateArticle(articleModalIdx, vals)}
        />
      )}

    </div>
  );
}
