import React, { useEffect } from 'react';
import ContactBar from '../components/ContactBar';
import './NaniBaiKaMayraPage.css';

export default function BabaRamdevJiKathaPage({ onNavigate }) {
  useEffect(() => {
    document.title = "Baba Ramdev ji Katha – Shree Abhay Das Ji Maharaj";
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('/');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="nani-bai-page" id="baba-ramdev-ji-katha-content">
      {/* ── 1. Hero Banner with Maharaj Ji & Breadcrumb Pill ── */}
      <section
        className="nani-bai-hero"
        style={{
          backgroundImage: "url('/images/WhatsApp-Image-2026-08-03-at-3.17.58-AM-1.jpeg')"
        }}
        aria-label="Baba Ramdev Ji Katha Banner"
      >
        <div className="nani-bai-hero-overlay" />
        
        <div className="nani-bai-hero-inner">
          <h1 className="nani-bai-hero-title">Baba Ramdev Ji Katha</h1>
          
          <div className="nani-bai-breadcrumb-pill">
            <a
              href="/"
              onClick={handleHomeClick}
              className="nani-bai-breadcrumb-link"
            >
              Home
            </a>
            <span className="nani-bai-breadcrumb-separator">/</span>
            <span className="nani-bai-breadcrumb-active">Baba Ramdev ji Katha</span>
          </div>
        </div>
      </section>

      {/* ── 2. Full Article Content Section ── */}
      <main className="nani-bai-content-container">
        <article className="nani-bai-article">
          <h1 className="nani-bai-article-title">Baba Ramdev ji Katha</h1>

          <h2>Experience the Divine Glory of Baba Ramdev Ji Maharaj</h2>
          <p>
            <strong>Pujya Abhaydas Ji Maharaj</strong> delivers the sacred{' '}
            <strong>Baba Ramdev Ji (Ramsa Pir) Katha</strong>, sharing the inspiring life, teachings, and divine miracles of one of India’s most revered folk deities. Popularly known as{' '}
            <strong>Baba Ramdev Ji of Runicha (Ramdevra)</strong> and lovingly worshipped as <strong>Ramsa Pir</strong>, Baba Ramdev Ji is remembered as a symbol of devotion, equality, compassion, truth, and selfless service to humanity.
          </p>
          <p>
            His divine life continues to inspire millions of devotees across India and around the world. Through this sacred katha, devotees experience the timeless values of faith, righteousness, humility, and unwavering devotion to God.
          </p>

          <h2>Who is Baba Ramdev Ji?</h2>
          <p>
            Baba Ramdev Ji Maharaj was born in <strong>Runicha (Ramdevra), Rajasthan</strong>, and is revered as a great saint, spiritual reformer, and protector of the poor and the oppressed. According to devotional tradition, he dedicated his life to serving humanity, removing social discrimination, and guiding people toward the path of truth, compassion, and devotion.
          </p>
          <p>
            He is widely worshipped by people from different communities and backgrounds. Hindus revere him as a divine incarnation associated with Lord Krishna, while many devotees respectfully honor him as{' '}
            <strong>Ramsa Pir</strong>, reflecting his message of harmony, unity, and universal brotherhood.
          </p>

          <h2>The Significance of Baba Ramdev Ji Katha</h2>
          <p>
            The <strong>Baba Ramdev Ji Katha</strong> is a sacred narration that highlights the divine life, miracles, and teachings of Baba Ramdev Ji Maharaj. It reminds devotees that sincere faith, selfless service, and righteous living always receive divine blessings.
          </p>
          <p>The katha inspires people to:</p>
          <ul className="nani-bai-list">
            <li>
              <p>Develop unwavering faith in God.</p>
            </li>
            <li>
              <p>Live a life of truth, humility, and compassion.</p>
            </li>
            <li>
              <p>Practice selfless service toward humanity.</p>
            </li>
            <li>
              <p>Respect all people regardless of caste, religion, or social status.</p>
            </li>
            <li>
              <p>Preserve the spiritual and cultural values of Sanatan Dharma.</p>
            </li>
            <li>
              <p>Face life’s challenges with courage and complete trust in the Divine.</p>
            </li>
          </ul>

          <h2>The Divine Legacy of Ramsa Pir</h2>
          <p>
            Baba Ramdev Ji, affectionately known as <strong>Ramsa Pir</strong>, is a symbol of communal harmony and spiritual unity. His message transcends social and religious boundaries, teaching that God’s love is available to everyone who approaches with sincerity and devotion.
          </p>
          <p>
            Every year, millions of devotees visit <strong>Ramdevra (Runicha Dham)</strong> to seek his blessings, offer prayers, and express gratitude for his divine grace. His life continues to inspire generations with the ideals of equality, service, faith, and compassion.
          </p>

          <h2>Discourses by Pujya Abhaydas Ji Maharaj</h2>
          <p>
            With deep scriptural knowledge and heartfelt devotion,{' '}
            <strong>Pujya Abhaydas Ji Maharaj</strong> presents Baba Ramdev Ji Katha in a simple, engaging, and spiritually uplifting manner. His discourses beautifully combine devotional storytelling, traditional bhajans, and practical spiritual wisdom that touches the hearts of devotees of all ages.
          </p>
          <p>
            Each katha creates a sacred atmosphere filled with devotion, inspiration, and the blessings of Baba Ramdev Ji Maharaj.
          </p>

          <h2>Book Baba Ramdev Ji (Ramsa Pir) Katha</h2>
          <p>
            Devotees, temples, spiritual organizations, families, and cultural institutions can invite{' '}
            <strong>Pujya Abhaydas Ji Maharaj</strong> to conduct{' '}
            <strong>Baba Ramdev Ji (Ramsa Pir) Katha</strong> for religious gatherings, festivals, spiritual events, and community celebrations across India and internationally.
          </p>
          <p>
            Our team is committed to making every katha a spiritually enriching experience that spreads devotion, cultural values, and divine blessings.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to spread the inspiring teachings of{' '}
            <strong>Baba Ramdev Ji Maharaj (Ramsa Pir)</strong>, promote the eternal values of{' '}
            <strong>Sanatan Dharma</strong>, and inspire people to live with faith, compassion, equality, and selfless service. Through the divine discourses of{' '}
            <strong>Pujya Abhaydas Ji Maharaj</strong>, we strive to preserve India’s rich spiritual heritage and strengthen the bond between devotees and the Divine.
          </p>
          <p style={{ fontWeight: 600, color: '#1f2937', margin: '24px 0 0' }}>
            Join us in the sacred journey of Baba Ramdev Ji (Ramsa Pir) Katha and experience the timeless message of faith, service, unity, and divine grace that continues to guide millions of devotees around the world.
          </p>
        </article>
      </main>

      {/* ── 3. Orange Contact Bar above Footer ── */}
      <ContactBar />
    </div>
  );
}
