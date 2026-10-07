import React, { useEffect } from 'react';
import ContactBar from '../components/ContactBar';
import './NaniBaiKaMayraPage.css';

export default function ShrimadBhagwatKathaPage({ onNavigate }) {
  useEffect(() => {
    document.title = "Shrimad Bhagwat Katha – Shree Abhay Das Ji Maharaj";
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
    <div className="nani-bai-page" id="shrimad-bhagwat-katha-content">
      {/* ── 1. Hero Banner with Maharaj Ji & Breadcrumb Pill ── */}
      <section
        className="nani-bai-hero"
        style={{
          backgroundImage: "url('/images/WhatsApp-Image-2026-08-03-at-3.17.58-AM-1.jpeg')"
        }}
        aria-label="Shrimad Bhagwat Katha Banner"
      >
        <div className="nani-bai-hero-overlay" />
        
        <div className="nani-bai-hero-inner">
          <h1 className="nani-bai-hero-title">Shrimad Bhagwat Katha</h1>
          
          <div className="nani-bai-breadcrumb-pill">
            <a
              href="/"
              onClick={handleHomeClick}
              className="nani-bai-breadcrumb-link"
            >
              Home
            </a>
            <span className="nani-bai-breadcrumb-separator">/</span>
            <span className="nani-bai-breadcrumb-active">Shrimad Bhagwat Katha</span>
          </div>
        </div>
      </section>

      {/* ── 2. Full Article Content Section ── */}
      <main className="nani-bai-content-container">
        <article className="nani-bai-article">
          <h1 className="nani-bai-article-title">Shrimad Bhagwat Katha</h1>

          <h2>Experience the Divine Wisdom of Shrimad Bhagwat Mahapuran</h2>
          <p>
            <strong>Pujya Abhaydas Ji Maharaj</strong> is a renowned spiritual orator dedicated to spreading the timeless teachings of{' '}
            <strong>Shrimad Bhagwat Mahapuran</strong>. Through his soulful discourses, he inspires devotees to embrace devotion, righteousness, compassion, and the eternal path of Sanatan Dharma.
          </p>
          <p>
            Shrimad Bhagwat Mahapuran is regarded as the essence of the Vedas and Puranas. It beautifully narrates the divine pastimes of Lord Shri Krishna, the lives of great devotees, and the supreme message of Bhakti (devotion), Jnana (wisdom), and Vairagya (detachment). Listening to the sacred Bhagwat Katha purifies the heart, strengthens faith, and brings inner peace.
          </p>

          <h2>The Significance of Shrimad Bhagwat Katha</h2>
          <p>
            The sacred discourse of Shrimad Bhagwat Mahapuran is a spiritual journey that transforms lives by awakening devotion and divine consciousness. It helps devotees:
          </p>
          <ul className="nani-bai-list">
            <li>
              <p>Develop unwavering devotion to Lord Shri Krishna.</p>
            </li>
            <li>
              <p>Experience inner peace, happiness, and spiritual fulfillment.</p>
            </li>
            <li>
              <p>Understand the true purpose of life through the teachings of Sanatan Dharma.</p>
            </li>
            <li>
              <p>Strengthen moral values, compassion, and righteous living.</p>
            </li>
            <li>
              <p>Foster harmony, love, and positive values within families and society.</p>
            </li>
          </ul>

          <h2>Highlights of Pujya Abhaydas Ji Maharaj’s Discourses</h2>
          <p>
            Pujya Abhaydas Ji Maharaj presents the timeless wisdom of Shrimad Bhagwat Mahapuran in a simple, engaging, and inspiring manner. His discourses include:
          </p>
          <ul className="nani-bai-list">
            <li>
              <p>Divine narrations of the sacred pastimes of Lord Shri Krishna.</p>
            </li>
            <li>
              <p>Authentic explanations based on Vedic scriptures.</p>
            </li>
            <li>
              <p>Practical spiritual guidance for everyday life.</p>
            </li>
            <li>
              <p>Devotional bhajans and kirtans that create a deeply spiritual atmosphere.</p>
            </li>
            <li>
              <p>Inspirational teachings suitable for devotees of all ages.</p>
            </li>
          </ul>

          <h2>Bhagwat Katha Booking</h2>
          <p>
            Pujya Abhaydas Ji Maharaj is available to conduct <strong>Shrimad Bhagwat Katha</strong> at temples, ashrams, spiritual organizations, community events, and religious gatherings across India and abroad.
          </p>
          <p>
            If you wish to organize a Bhagwat Katha at your location, our team will assist you with the necessary arrangements and scheduling.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to spread the divine message of <strong>Shrimad Bhagwat Mahapuran</strong>, inspire devotion to Lord Shri Krishna, preserve the values of Sanatan Dharma, and guide people toward a life of peace, righteousness, and spiritual awakening.
          </p>
          <p style={{ fontStyle: 'italic', color: '#4b5563', borderLeft: '3px solid #fc791a', paddingLeft: '16px', margin: '24px 0' }}>
            “Shrimad Bhagwat is the ripened fruit of the wish-fulfilling tree of the Vedas. Those who sincerely hear its divine message experience the nectar of devotion and attain spiritual bliss.”
          </p>
          <p>
            Join us in this sacred journey of devotion and experience the eternal wisdom of <strong>Shrimad Bhagwat Katha</strong> through the enlightening discourses of <strong>Pujya Abhaydas Ji Maharaj</strong>.
          </p>
        </article>
      </main>

      {/* ── 3. Orange Contact Bar above Footer ── */}
      <ContactBar />
    </div>
  );
}
