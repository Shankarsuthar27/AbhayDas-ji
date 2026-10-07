import React, { useState, useEffect, useRef } from 'react';
import { newsArticles } from '../data/newsData';
import { subscribeNews } from '../services/contentService';

export default function NewsSection({ onNavigate }) {
  const [articles, setArticles] = useState(newsArticles);
  const [activeArticle, setActiveArticle] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const unsub = subscribeNews((updated) => {
      if (updated && updated.length > 0) {
        setArticles(updated);
      }
    });
    return () => unsub();
  }, []);

  // Quick responsive scroll navigation
  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    // Scroll by width of one card + gap (~560px on desktop)
    const cardWidth = container.firstElementChild?.firstElementChild?.clientWidth || 520;
    const scrollAmount = (cardWidth + 30) * direction;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleSelectArticle = (item) => {
    if (onNavigate) {
      onNavigate(`/news/${item.slug}`);
    } else {
      window.history.pushState({}, '', `/news/${item.slug}`);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  return (
    <section
      id="news"
      style={{
        padding: '70px 0 85px',
        backgroundColor: '#ffffff',
        position: 'relative'
      }}
      aria-label="Latest News And Articles"
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '36px'
        }}>
          <div>
            <div style={{
              color: '#fc791a',
              fontSize: '13px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              marginBottom: '6px'
            }}>
              Blog &amp; News
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: '800',
              color: '#111827',
              margin: 0,
              lineHeight: 1.2
            }}>
              Latest News And Articles
            </h2>
          </div>

          {/* Action Controls: View All + Snappy Arrow Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => {
                if (onNavigate) {
                  onNavigate('/news');
                } else {
                  window.history.pushState({}, '', '/news');
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
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: 'translateZ(0)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              <span>📄 View All</span>
            </button>

            {!isExpanded && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => scroll(-1)}
                  aria-label="Previous articles"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    color: '#1f2937',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fc791a';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = '#fc791a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.color = '#1f2937';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => scroll(1)}
                  aria-label="Next articles"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    color: '#1f2937',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fc791a';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = '#fc791a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.color = '#1f2937';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Responsive Click & Scroll Container */}
        {isExpanded ? (
          /* Grid View when 'View All' is active */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '30px'
          }}>
            {articles.map((item) => (
              <NewsCard key={item.id} item={item} onSelect={handleSelectArticle} />
            ))}
          </div>
        ) : (
          /* High-Speed Hardware-Accelerated Snap Scroll Carousel */
          <div
            ref={scrollContainerRef}
            style={{
              display: 'flex',
              gap: '30px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              padding: '6px 4px 20px',
              margin: '-6px -4px -20px',
              cursor: 'grab'
            }}
          >
            {articles.map((item) => (
              <div
                key={item.id}
                style={{
                  flex: '0 0 calc(50% - 15px)',
                  minWidth: '320px',
                  maxWidth: '580px',
                  scrollSnapAlign: 'start',
                  boxSizing: 'border-box'
                }}
              >
                <NewsCard item={item} onSelect={handleSelectArticle} />
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Article Reader Modal (Quick Open & Close) */}
      {activeArticle && (
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
            onClick={() => setActiveArticle(null)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.72)',
              backdropFilter: 'blur(5px)'
            }}
          />
          <div style={{
            position: 'relative',
            zIndex: 1,
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '88vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            animation: 'articleModalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <style>{`
              @keyframes articleModalPop {
                from { opacity: 0; transform: scale(0.95) translateY(12px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
              }
            `}</style>
            <div style={{ position: 'relative', height: '280px' }}>
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                aria-label="Close article"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.65)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fc791a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.65)'}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '32px' }}>
              <div style={{ fontSize: '13px', color: '#059669', fontWeight: '800', marginBottom: '10px' }}>
                📅 {activeArticle.date} • {activeArticle.category} • {activeArticle.author}
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', lineHeight: '1.4', marginBottom: '18px' }}>
                {activeArticle.title}
              </h2>
              <div style={{ fontSize: '15.5px', lineHeight: '1.85', color: '#374151', whiteSpace: 'pre-line' }}>
                {activeArticle.fullContent}
              </div>
              <div style={{ marginTop: '30px', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  style={{
                    backgroundColor: '#111827',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '11px 28px',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fc791a'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#111827'}
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

// Reusable News Card with Snappy Click & Hover States
function NewsCard({ item, onSelect }) {
  return (
    <article
      onClick={() => onSelect(item)}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #f3f4f6',
        boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: 'translateZ(0)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)';
      }}
    >
      {/* Thumbnail Frame with Date Badge */}
      <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
        <img
          src={item.image}
          alt={item.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onError={(e) => {
            e.target.src = '/images/img_3.jpg';
          }}
        />

        {/* Date Box on top of image matching theme */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          backgroundColor: '#fc791a',
          color: '#ffffff',
          borderRadius: '10px',
          padding: '6px 12px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(252, 121, 26, 0.4)',
          lineHeight: '1.2'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '800' }}>{item.day}</div>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>{item.month}</div>
        </div>
      </div>

      {/* Body Content */}
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Meta Line: Author and Comments */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontSize: '12px',
          color: '#6b7280',
          marginBottom: '10px'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            👤 {item.author}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            💬 {item.comments}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '18.5px',
          fontWeight: '800',
          color: '#111827',
          lineHeight: '1.45',
          margin: '0 0 16px 0',
          flex: 1,
          transition: 'color 0.2s ease'
        }}>
          {item.title}
        </h3>

        {/* Read More Link */}
        <div style={{
          color: '#fc791a',
          fontWeight: '800',
          fontSize: '14px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: 'auto'
        }}>
          Read More <span>→</span>
        </div>
      </div>
    </article>
  );
}
