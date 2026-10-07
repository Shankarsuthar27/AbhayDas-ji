import React, { useEffect } from 'react';
import ContactBar from '../components/ContactBar';
import './NaniBaiKaMayraPage.css';

export default function NaniBaiKaMayraPage({ onNavigate }) {
  useEffect(() => {
    document.title = "Nani Bai Ka Mayra – Shree Abhay Das Ji Maharaj";
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
    <div className="nani-bai-page" id="nani-bai-ka-mayra-content">
      {/* ── 1. Hero Banner with Maharaj Ji & Breadcrumb Pill ── */}
      <section
        className="nani-bai-hero"
        style={{
          backgroundImage: "url('/images/WhatsApp-Image-2026-08-03-at-3.17.58-AM-1.jpeg')"
        }}
        aria-label="Nani Bai Ka Mayra Banner"
      >
        <div className="nani-bai-hero-overlay" />
        
        <div className="nani-bai-hero-inner">
          <h1 className="nani-bai-hero-title">Nani Bai Ka Mayra</h1>
          
          <div className="nani-bai-breadcrumb-pill">
            <a
              href="/"
              onClick={handleHomeClick}
              className="nani-bai-breadcrumb-link"
            >
              Home
            </a>
            <span className="nani-bai-breadcrumb-separator">/</span>
            <span className="nani-bai-breadcrumb-active">Nani Bai Ka Mayra</span>
          </div>
        </div>
      </section>

      {/* ── 2. Full Article Content Section ── */}
      <main className="nani-bai-content-container">
        <article className="nani-bai-article">
          <h1 className="nani-bai-article-title">Nani Bai Ka Mayra</h1>

          <h2>Experience the Divine Grace of Nani Bai Ka Mayra Katha</h2>
          <p>
            <strong>Pujya Abhaydas Ji Maharaj</strong> beautifully narrates the sacred{' '}
            <strong>Nani Bai Ka Mayra Katha</strong>, a cherished devotional tradition that reflects the limitless compassion of{' '}
            <strong>Lord Shri Krishna</strong> toward His true devotees. This inspiring katha conveys the timeless message that sincere devotion, unwavering faith, and complete surrender to God are always rewarded by His divine grace.
          </p>
          <p>
            Deeply rooted in the spiritual heritage of Sanatan Dharma,{' '}
            <strong>Nani Bai Ka Mayra</strong> is especially popular in Rajasthan, Gujarat, and many parts of India. It is a powerful reminder that the Lord never abandons those who remember Him with a pure heart.
          </p>

          <h2>The Story of Nani Bai Ka Mayra</h2>
          <p>
            Nani Bai, the devoted daughter of the great saint{' '}
            <strong>Bhakta Narsinh Mehta</strong>, was known for her deep faith in Lord Krishna. According to the sacred tradition, when the time came for her{' '}
            <strong>Mayra</strong> (the customary gifts and offerings presented by the maternal family during a daughter’s special family ceremony), her family faced financial hardship and was unable to fulfill the social customs.
          </p>
          <p>
            With complete faith in Lord Krishna, Nani Bai and her father placed all their trust in Him. Moved by their unwavering devotion,{' '}
            <strong>Lord Shri Krishna Himself appeared in a divine form and fulfilled every responsibility of the Mayra</strong>, blessing the family with honor, abundance, and grace.
          </p>
          <p>
            This miraculous event symbolizes that when worldly support fails, divine grace never does. The story continues to inspire millions of devotees to place complete faith in God during life’s most challenging moments.
          </p>

          <h2>Spiritual Significance of Nani Bai Ka Mayra</h2>
          <p>The sacred katha teaches invaluable lessons for every devotee:</p>
          <ul className="nani-bai-list">
            <li>
              <p>Unwavering faith in Lord Krishna always brings divine blessings.</p>
            </li>
            <li>
              <p>True devotion is more valuable than material wealth.</p>
            </li>
            <li>
              <p>God protects and honors those who surrender with a pure heart.</p>
            </li>
            <li>
              <p>Humility, compassion, and righteousness are the foundations of a meaningful life.</p>
            </li>
            <li>
              <p>Divine grace can transform even the most difficult situations into moments of joy and celebration.</p>
            </li>
          </ul>

          <h2>Discourses by Pujya Abhaydas Ji Maharaj</h2>
          <p>
            With profound scriptural knowledge and heartfelt devotion,{' '}
            <strong>Pujya Abhaydas Ji Maharaj</strong> presents Nani Bai Ka Mayra Katha in a simple, engaging, and spiritually uplifting manner. His discourses combine sacred storytelling, devotional bhajans, and practical life lessons that inspire audiences of all ages.
          </p>
          <p>
            Each katha creates an atmosphere of devotion, emotional connection, and spiritual awakening, encouraging devotees to strengthen their relationship with Lord Krishna.
          </p>

          <h2>Book Nani Bai Ka Mayra Katha</h2>
          <p>
            Devotees, temples, spiritual organizations, and families can invite{' '}
            <strong>Pujya Abhaydas Ji Maharaj</strong> to conduct{' '}
            <strong>Nani Bai Ka Mayra Katha</strong> for religious gatherings, family celebrations, spiritual events, and cultural programs across India and internationally.
          </p>
          <p>
            Our team is dedicated to making every katha a meaningful spiritual experience filled with devotion, divine wisdom, and the blessings of Lord Krishna.
          </p>

          <h2>Our Mission</h2>
          <p>
            Through the divine narration of <strong>Nani Bai Ka Mayra Katha</strong>, our mission is to spread the eternal values of{' '}
            <strong>Sanatan Dharma</strong>, inspire unwavering devotion to Lord Krishna, preserve India’s rich spiritual traditions, and help people experience faith, hope, and inner peace.
          </p>
          <p>
            May the divine story of <strong>Nani Bai Ka Mayra</strong> inspire every heart to trust in the boundless mercy of Lord Krishna and to walk the path of devotion, humility, and righteousness.
          </p>
        </article>
      </main>

      {/* ── 3. Orange Contact Bar above Footer ── */}
      <ContactBar />
    </div>
  );
}
