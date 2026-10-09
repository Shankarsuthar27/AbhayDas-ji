import React, { useState, useEffect, useMemo } from 'react';
import { newsArticles as staticNews } from '../data/newsData';
import { subscribeNews } from '../services/contentService';
import ContactBar from '../components/ContactBar';
import './NewsPage.css';

export default function NewsPage({ onNavigate, articleSlug }) {
  // Live dynamic articles from Firestore merged with static articles
  const [articles, setArticles] = useState(staticNews);

  // Subscribe to real-time updates from Firestore
  useEffect(() => {
    const unsub = subscribeNews((liveList) => {
      if (liveList && liveList.length > 0) {
        setArticles(liveList);
      }
    });
    return () => unsub();
  }, []);

  // Determine initial active article from props, path or query params
  const [selectedArticle, setSelectedArticle] = useState(() => {
    const slugToFind = articleSlug || (() => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const paramArticle = urlParams.get('article') || urlParams.get('id');
        if (paramArticle) return paramArticle;

        const pathParts = window.location.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 2 && (pathParts[0] === 'news' || pathParts[0] === 'blog')) {
          return pathParts[1];
        }
      }
      return null;
    })();

    if (slugToFind) {
      const found = staticNews.find(
        (a) => (a?.slug && a.slug.toLowerCase() === slugToFind.toLowerCase()) || String(a?.id) === String(slugToFind)
      );
      if (found) return found;
    }
    return null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [toastMessage, setToastMessage] = useState('');

  // Comment Form state
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Synchronize if articleSlug or articles list updates
  useEffect(() => {
    const slugToFind = articleSlug || (() => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const paramArticle = urlParams.get('article') || urlParams.get('id');
        if (paramArticle) return paramArticle;

        const pathParts = window.location.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 2 && (pathParts[0] === 'news' || pathParts[0] === 'blog')) {
          return pathParts[1];
        }
      }
      return null;
    })();

    if (slugToFind) {
      const found = articles.find(
        (a) => (a?.slug && a.slug.toLowerCase() === slugToFind.toLowerCase()) || String(a?.id) === String(slugToFind)
      );
      if (found) {
        setSelectedArticle(found);
      }
    }
  }, [articleSlug, articles]);

  // Update document title and scroll to top
  useEffect(() => {
    if (selectedArticle) {
      document.title = `${selectedArticle.title} – Shree Abhay Das Ji Maharaj`;
    } else {
      document.title = "News And Articles – Shree Abhay Das Ji Maharaj";
    }
  }, [selectedArticle]);

  // Select an article and update browser URL without full reload
  const handleSelectArticle = (article) => {
    setSelectedArticle(article);
    if (article) {
      const newUrl = `/news/${article.slug}`;
      window.history.pushState({ articleSlug: article.slug }, '', newUrl);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState({}, '', '/news');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Listen for back/forward browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2 && (pathParts[0] === 'news' || pathParts[0] === 'blog')) {
        const pathSlug = pathParts[1].toLowerCase();
        const found = articles.find(
          (a) => (a?.slug && a.slug.toLowerCase() === pathSlug) || String(a?.id) === pathSlug
        );
        setSelectedArticle(found || null);
      } else {
        setSelectedArticle(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [articles]);

  // Compute unique categories and counts dynamically
  const categoriesList = useMemo(() => {
    const cats = {};
    articles.forEach((a) => {
      const c = a.category || 'General';
      cats[c] = (cats[c] || 0) + 1;
    });
    return Object.entries(cats);
  }, [articles]);

  // Filter articles for archive view
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        (article.title && article.title.toLowerCase().includes(q)) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(q)) ||
        (article.fullContent && article.fullContent.toLowerCase().includes(q)) ||
        (article.content && article.content.toLowerCase().includes(q));

      const matchesCategory =
        activeCategory === 'all' ||
        (article.category && article.category.toLowerCase() === activeCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, activeCategory]);

  // Share article link
  const handleShare = async (platform) => {
    const currentUrl = window.location.href;
    const shareTitle = selectedArticle ? selectedArticle.title : 'News - Shree Abhay Das Ji Maharaj';

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
    } else if (platform === 'pinterest') {
      window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&description=${encodeURIComponent(shareTitle)}`, '_blank');
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);
        showToast("Article link copied to clipboard!");
      } catch (err) {
        showToast("Link: " + currentUrl);
      }
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Submit comment handler
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentEmail.trim() || !commentText.trim()) {
      showToast("Please fill in all required fields.");
      return;
    }
    setCommentSuccess(true);
    setCommentText('');
    showToast("Thank you! Your comment has been submitted for review.");
    setTimeout(() => setCommentSuccess(false), 5000);
  };

  return (
    <div className="news-page-container" id="news-page-top">
      
      {/* ====================================================================
          1. Hero Banner Section
          For Single Post: Matches screenshot with dark overlay & breadcrumb
          For Archive Grid: Shows "News And Articles" header
          ==================================================================== */}
      <header
        className={`news-hero-banner ${selectedArticle ? 'news-hero-banner-single' : ''}`}
        style={{
          backgroundImage: `url(${selectedArticle ? '/images/news_single_banner.jpg' : '/images/breadcrumb-03.jpg'})`
        }}
      >
        <div className="news-hero-overlay" />

        <div className="news-hero-content">
          {!selectedArticle ? (
            <>
              <h1 className="news-hero-title">News And Articles</h1>
              <p className="news-hero-subtitle">
                Charity activities are taken place around the world.
              </p>
              <nav className="news-breadcrumb" aria-label="Breadcrumb">
                <span
                  className="news-breadcrumb-link"
                  onClick={() => onNavigate ? onNavigate('/') : (window.location.href = '/')}
                  role="button"
                  tabIndex={0}
                >
                  Home
                </span>
                <span className="news-breadcrumb-sep">/</span>
                <span className="news-breadcrumb-current">News And Articles</span>
              </nav>
            </>
          ) : (
            /* Single Article Breadcrumb Bar exactly matching user screenshot */
            <nav className="news-breadcrumb news-breadcrumb-pill" aria-label="Breadcrumb">
              <span
                className="news-breadcrumb-link"
                onClick={() => onNavigate ? onNavigate('/') : (window.location.href = '/')}
                role="button"
                tabIndex={0}
              >
                Home
              </span>
              <span className="news-breadcrumb-sep">/</span>
              <span
                className="news-breadcrumb-link"
                onClick={() => handleSelectArticle(null)}
                role="button"
                tabIndex={0}
              >
                News
              </span>
              <span className="news-breadcrumb-sep">/</span>
              <span className="news-breadcrumb-current">{selectedArticle.category || 'Uncategorized'}</span>
            </nav>
          )}
        </div>
      </header>

      {/* ====================================================================
          2. Content Section
          Conditionally renders:
          A. SINGLE ARTICLE DETAIL VIEW (2 columns matching screenshot)
          B. NEWS ARCHIVE GRID (3 columns)
          ==================================================================== */}
      {selectedArticle ? (
        /* ==================================================================
           A. SINGLE ARTICLE 2-COLUMN DETAIL LAYOUT
           Matches reference screenshot pixel-for-pixel
           ================================================================== */
        <div className="news-single-wrapper">
          <div className="news-single-container">
            
            {/* Left Column: Full News Post Story */}
            <article className="news-single-main" aria-label={selectedArticle.title}>
              
              {/* Back to archive link */}
              <div className="news-back-bar">
                <button
                  type="button"
                  className="news-back-btn"
                  onClick={() => handleSelectArticle(null)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  <span>Back to All News</span>
                </button>
              </div>

              {/* 1. Large Featured Post Image */}
              <div className="news-single-featured-wrap">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="news-single-featured-img"
                />
              </div>

              {/* 2. Meta Bar below image (Author & Category / Comments) */}
              <div className="news-single-meta">
                <span className="news-single-meta-item">
                  <svg className="news-single-meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#02a95c" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>By {selectedArticle.author}</span>
                </span>

                <span className="news-single-meta-item">
                  <svg className="news-single-meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#02a95c" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>{selectedArticle.commentsCount || '0 Comments'}</span>
                </span>

                <span className="news-single-meta-item">
                  <svg className="news-single-meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#02a95c" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{selectedArticle.date}</span>
                </span>
              </div>

              {/* 3. Main Bold Headline */}
              <h1 className="news-single-title">
                {selectedArticle.title}
              </h1>

              {/* 4. In-depth Article Content with Subheadings or Rich TipTap Content */}
              <div className="news-single-body">
                {selectedArticle.content ? (
                  <div
                    className="news-single-rich-content tiptap-prose"
                    style={{ padding: 0 }}
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                  />
                ) : selectedArticle.sections ? (
                  selectedArticle.sections.map((section, idx) => (
                    <div key={idx} className="news-single-section">
                      {section.heading && (
                        <h3 className="news-single-subheading">{section.heading}</h3>
                      )}
                      {section.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="news-single-paragraph">{p}</p>
                      ))}
                    </div>
                  ))
                ) : (
                  (selectedArticle.fullContent || selectedArticle.description || '').split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="news-single-paragraph">{paragraph}</p>
                  ))
                )}
              </div>

              {/* 5. Secondary Photo (Placed after the article text) */}
              {selectedArticle.secondaryImage && (
                <div className="news-single-secondary-img-wrap">
                  <img
                    src={selectedArticle.secondaryImage}
                    alt={`${selectedArticle.title} - Ceremony`}
                    className="news-single-secondary-img"
                    loading="lazy"
                  />
                </div>
              )}

              {/* 6. Event / Article Photo Gallery (if additional images exist beyond secondary image) */}
              {(() => {
                const remainingGallery = (selectedArticle.galleryImages || []).filter(
                  (url) => url && url !== selectedArticle.secondaryImage && url !== selectedArticle.image
                );
                if (remainingGallery.length === 0) return null;
                return (
                  <div className="news-single-gallery-section">
                    <h3 className="news-single-gallery-heading">
                      <span>कार्यक्रम छायाचित्र (Photo Gallery)</span>
                    </h3>
                    <div className="news-single-gallery-grid">
                      {remainingGallery.map((imgUrl, gIdx) => (
                        <div key={gIdx} className="news-single-gallery-card">
                          <img src={imgUrl} alt={`${selectedArticle.title} - Photo ${gIdx + 2}`} loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* 6. Social Share Row (Facebook, Twitter, LinkedIn, Pinterest) */}
              <div className="news-single-share-bar">
                <button
                  type="button"
                  className="news-share-pill"
                  onClick={() => handleShare('link')}
                  title="Share link"
                  aria-label="Share"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                </button>

                <button
                  type="button"
                  className="news-share-pill"
                  onClick={() => handleShare('facebook')}
                  title="Share on Facebook"
                  aria-label="Facebook"
                >
                  <span className="share-letter">f</span>
                </button>

                <button
                  type="button"
                  className="news-share-pill"
                  onClick={() => handleShare('twitter')}
                  title="Share on Twitter"
                  aria-label="Twitter"
                >
                  <span className="share-letter">t</span>
                </button>

                <button
                  type="button"
                  className="news-share-pill"
                  onClick={() => handleShare('linkedin')}
                  title="Share on LinkedIn"
                  aria-label="LinkedIn"
                >
                  <span className="share-letter">in</span>
                </button>

                <button
                  type="button"
                  className="news-share-pill"
                  onClick={() => handleShare('pinterest')}
                  title="Share on Pinterest"
                  aria-label="Pinterest"
                >
                  <span className="share-letter">p</span>
                </button>
              </div>

              {/* 7. Author Profile Box */}
              <div className="news-single-author-card">
                <div className="news-author-avatar">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#9ca3af">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div className="news-author-info">
                  <h4 className="news-author-name">{selectedArticle.author}</h4>
                  <p className="news-author-desc">
                    Official Communication &amp; Media Desk of Shree Samarth Sevak Samaj Trust.
                  </p>
                </div>
              </div>

              {/* 8. "Add a Comment" Section */}
              <section className="news-single-comment-section" aria-labelledby="comment-title">
                <div className="news-section-header-wrap">
                  <h3 id="comment-title" className="news-comment-title">Add a Comment</h3>
                  <div className="news-comment-line" />
                </div>
                <p className="news-comment-subtitle">
                  Your email address will not be published. Required fields are marked *
                </p>

                {commentSuccess && (
                  <div className="news-comment-alert-success" role="alert">
                    ✓ Your comment has been received and is pending moderation. Thank you!
                  </div>
                )}

                <form onSubmit={handleCommentSubmit} className="news-comment-form">
                  <div className="news-form-row">
                    <div className="news-form-group">
                      <input
                        type="text"
                        className="news-form-input"
                        placeholder="Your Name *"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        required
                        aria-label="Your Name"
                      />
                    </div>
                    <div className="news-form-group">
                      <input
                        type="email"
                        className="news-form-input"
                        placeholder="Email *"
                        value={commentEmail}
                        onChange={(e) => setCommentEmail(e.target.value)}
                        required
                        aria-label="Email"
                      />
                    </div>
                  </div>

                  <div className="news-form-checkbox-wrap">
                    <label className="news-form-checkbox-label">
                      <input
                        type="checkbox"
                        checked={saveInfo}
                        onChange={(e) => setSaveInfo(e.target.checked)}
                        className="news-form-checkbox"
                      />
                      <span>Save my name, email, and website in this browser for the next time I comment.</span>
                    </label>
                  </div>

                  <div className="news-form-group">
                    <textarea
                      rows={5}
                      className="news-form-textarea"
                      placeholder="Write Your Comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                      aria-label="Comment"
                    />
                  </div>

                  <div className="news-form-action">
                    <button type="submit" className="news-form-submit-btn">
                      Post Comment
                    </button>
                  </div>
                </form>
              </section>

            </article>

            {/* Right Column: Sidebar Widgets */}
            <aside className="news-single-sidebar" aria-label="News Sidebar">
              
              {/* Widget 1: RECENT POSTS */}
              <div className="news-widget news-widget-recent">
                <div className="news-widget-title-wrap">
                  <h3 className="news-widget-title">RECENT POSTS</h3>
                  <div className="news-widget-line" />
                </div>

                <div className="news-widget-recent-list">
                  {articles.slice(0, 5).map((article) => {
                    const isCurrent = selectedArticle && (article.id === selectedArticle.id || article.slug === selectedArticle.slug);
                    return (
                      <div
                        key={article.id}
                        className={`news-widget-recent-item ${isCurrent ? 'active' : ''}`}
                        onClick={() => handleSelectArticle(article)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="news-widget-thumb-wrap">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="news-widget-thumb"
                            loading="lazy"
                          />
                        </div>
                        <div className="news-widget-item-content">
                          <div className="news-widget-item-date">{article.date}</div>
                          <h4 className="news-widget-item-title" title={article.title}>
                            {article.title}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Widget 2: ALL CATEGORIES */}
              <div className="news-widget news-widget-categories">
                <div className="news-widget-title-wrap">
                  <h3 className="news-widget-title">ALL CATEGORIES</h3>
                  <div className="news-widget-line" />
                </div>

                <ul className="news-widget-cat-list">
                  <li
                    className={`news-widget-cat-item ${activeCategory === 'all' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveCategory('all');
                      handleSelectArticle(null);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <span>All Categories</span>
                    <span className="news-widget-cat-count">({articles.length})</span>
                  </li>
                  {categoriesList.map(([catName, count]) => (
                    <li
                      key={catName}
                      className={`news-widget-cat-item ${activeCategory.toLowerCase() === catName.toLowerCase() ? 'active' : ''}`}
                      onClick={() => {
                        setActiveCategory(catName);
                        handleSelectArticle(null);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <span>{catName}</span>
                      <span className="news-widget-cat-count">({count})</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Widget 3: "Get Free Consultations" Promo Card */}
              <div
                className="news-promo-card"
                style={{
                  backgroundImage: `url('/images/promo_consultation.jpg')`
                }}
              >
                <div className="news-promo-overlay" />
                <div className="news-promo-inner">
                  <h3 className="news-promo-title">Get Free Consultations</h3>
                  <p className="news-promo-subtitle">
                    Specialist in Seva &amp; Spiritual Guidance for your family
                  </p>
                  <button
                    type="button"
                    className="news-promo-cta-btn"
                    onClick={() => onNavigate ? onNavigate('/contact') : (window.location.href = '/#contact')}
                  >
                    <span className="news-promo-cta-circle">›</span>
                    <span className="news-promo-cta-text">Get Quotes</span>
                  </button>
                </div>
              </div>

            </aside>

          </div>
        </div>
      ) : (
        /* ==================================================================
           B. NEWS ARCHIVE GRID (When no article is selected)
           Clean 3-column card grid matching reference design
           ================================================================== */
        <main className="news-main-section">
          
          {/* News Toolbar: Search & Count */}
          <div className="news-toolbar">
            <div className="news-count-badge">
              <span className="news-badge-icon">📰</span>
              <span>Latest Updates:</span>
              <span className="news-count-number">{filteredArticles.length} Articles</span>
            </div>

            <div className="news-search-box">
              <span className="news-search-icon">🔍</span>
              <input
                type="text"
                className="news-search-input"
                placeholder="Search news & announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search news"
              />
              {searchQuery && (
                <button
                  className="news-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 3-Column News Card Grid */}
          {filteredArticles.length > 0 ? (
            <div className="news-grid" role="region" aria-label="News articles grid">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="news-card"
                  onClick={() => handleSelectArticle(article)}
                >
                  {/* Card Thumbnail Area with Top-Left Date Badge */}
                  <div className="news-card-thumbnail">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="news-card-img"
                      loading="lazy"
                    />
                    
                    {/* Orange Date Badge (Day + Month) */}
                    <div className="news-date-badge">
                      <span className="news-date-day">{article.day}</span>
                      <span className="news-date-month">{article.month}</span>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="news-card-body">
                    {/* Meta: Author & Category */}
                    <div className="news-card-meta">
                      <span className="news-meta-item news-meta-author">
                        <svg
                          className="news-meta-icon"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>By {article.author}</span>
                      </span>

                      <span className="news-meta-item news-meta-category">
                        <svg
                          className="news-meta-icon"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                          <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                        <span>{article.category}</span>
                      </span>
                    </div>

                    {/* Hindi Article Title */}
                    <h2 className="news-card-title" title={article.title}>
                      {article.title}
                    </h2>

                    {/* Card Footer: Read More Link with Green Arrow */}
                    <div className="news-card-footer">
                      <span className="news-read-more-link">
                        <span>Read More</span>
                        <svg
                          className="news-read-more-arrow"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#02a95c"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="news-empty-state">
              <div className="news-empty-icon">📰</div>
              <h3 className="news-empty-title">No articles found</h3>
              <p className="news-empty-text">
                Try adjusting your search terms to explore latest activities and updates.
              </p>
              <button
                className="news-empty-btn"
                onClick={() => setSearchQuery('')}
              >
                Show All Articles
              </button>
            </div>
          )}

        </main>
      )}

      {/* ====================================================================
          3. Bright Orange Contact Banner
          Matches bottom of user screenshot
          ==================================================================== */}
      <ContactBar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="news-toast" role="status">
          {toastMessage}
        </div>
      )}

    </div>
  );
}
