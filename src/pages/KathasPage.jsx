import React, { useEffect } from 'react';
import './KathasPage.css';

// Interlocking Double Hearts Line-Art Icon matching live reference design
const DoubleHeartsIcon = () => (
  <svg
    viewBox="0 0 100 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="katha-card-hearts"
    aria-hidden="true"
  >
    {/* First / Back Heart */}
    <path
      d="M32 64 C20 52 6 38 6 25 C6 14 15 6 25 6 C32 6 37 10 40 16 C43 10 48 6 55 6 C65 6 74 14 74 25 C74 38 60 52 48 64 L40 73 Z"
      stroke="#fc791a"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      transform="translate(0, 10) scale(0.85)"
      opacity="0.8"
    />
    {/* Second / Front Overlapping Heart */}
    <path
      d="M32 64 C20 52 6 38 6 25 C6 14 15 6 25 6 C32 6 37 10 40 16 C43 10 48 6 55 6 C65 6 74 14 74 25 C74 38 60 52 48 64 L40 73 Z"
      stroke="#ea580c"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      transform="translate(22, 0) scale(1) rotate(6 40 40)"
      opacity="0.95"
    />
  </svg>
);

export default function KathasPage({ onNavigate, onOpenVideo }) {
  useEffect(() => {
    document.title = "Kathas – Shree Abhay Das Ji Maharaj | Spiritual Discourses";
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const kathasData = [
    {
      id: "bhagwad",
      title: "Shreemad Bhagwad Katha",
      image: "/images/katha/Shreemad-Bhagwad-Katha.jpg",
      description: "A discourse based on the divine leelas, teachings, and devotion of Bhagwan Shri Krishna. Through this katha, Maharaj Ji guides listeners towards faith, purity, and surrender to the divine."
    },
    {
      id: "ramkatha",
      title: "Shree Ram Katha",
      image: "/images/katha/lord-ram_1570508775.avif",
      description: "A discourse based on the life, ideals, and values of Bhagwan Shri Ram. This katha emphasizes maryada, duty, compassion, righteousness, and ideal conduct in life."
    },
    {
      id: "mayra",
      title: "Nani Bai Ka Mayra",
      image: "/images/katha/Nani-Bai-Ro-Mayro-800x800-1.jpg",
      description: "A devotional narration celebrating faith, divine grace, and the deep bond between devotee and the divine. It connects listeners with the beauty of surrender and the power of pure bhakti."
    },
    {
      id: "meera",
      title: "Meera Katha",
      image: "/images/katha/mira-bhakti-katha.webp",
      description: "A discourse that celebrates the unconditional devotion of devotee Meera, inspiring listeners with love and devotion, faith, surrender, and devotion in everyday life."
    }
  ];

  const highlightsList = [
    "Simple & Relatable Teachings",
    "Devotional Inspiration",
    "Scriptural Depth",
    "Emotional Connection with Devotees",
    "Practical Guidance for Righteous Living"
  ];

  return (
    <div className="kathas-page-container" id="kathas-page-surface">
      
      {/* ====================================================================
          Section 1: Hero / Introduction (Spiritual Discourses & Kathas)
          Left: Heading + Paragraphs | Right: Organic Arched Photo
          ==================================================================== */}
      <section className="kathas-intro-section" aria-labelledby="kathas-hero-heading">
        <div className="kathas-intro-grid">
          
          {/* Left Text */}
          <div className="kathas-intro-content">
            <h1 id="kathas-hero-heading" className="kathas-intro-title">
              Spiritual Discourses & Kathas
            </h1>

            <p className="kathas-intro-text">
              HH Pujya Acharya Swami Shri Abhaydas Ji Maharaj shares the profound message of bhakti (devotion), dharma (righteousness), and spiritual wisdom through deeply inspiring kathas (spiritual discourses) and pravachan. Rooted in the eternal wisdom of Sanatan Dharma, his discourses are delivered in a simple yet captivating manner, helping people of all ages connect with spiritual knowledge, discipline, and right living.
            </p>

            <p className="kathas-intro-text">
              Through stories from sacred scriptures, saint traditions, and life lessons, Maharaj Ji brings timeless spiritual wisdom to life in a way that is easily relatable and meaningful for modern life.
            </p>
          </div>

          {/* Right Organic Shape Image matching user exact spec */}
          <div style={{ textAlign: 'center' }}>
            <img
              src="/images/katha/ChatGPT-Image-Mar-21-2026-12_57_41-AM.png"
              alt="HH Pujya Acharya Swami Shri Abhaydas Ji Maharaj sharing divine spiritual wisdom"
              className="attachment-large size-large wp-image-1083"
              fetchPriority="high"
              decoding="async"
              loading="eager"
            />
          </div>

        </div>
      </section>

      {/* ====================================================================
          Section 2: 4 Kathas Cards with Decorative Outline & Interlocking Hearts
          ==================================================================== */}
      <section className="kathas-list-section" aria-label="Sacred Katha Discourses">
        <div className="kathas-cards-wrapper">
          {kathasData.map((katha) => (
            <article
              key={katha.id}
              className="katha-card"
              tabIndex={0}
              onClick={() => {
                if (katha.id === 'mayra') {
                  if (onNavigate) {
                    onNavigate('/kathas/nani-bai-ka-mayra');
                  } else {
                    window.location.href = '/kathas/nani-bai-ka-mayra';
                  }
                } else if (katha.id === 'bhagwad') {
                  if (onNavigate) {
                    onNavigate('/kathas/shrimad-bhagwat-katha');
                  } else {
                    window.location.href = '/kathas/shrimad-bhagwat-katha';
                  }
                }
              }}
              style={{
                cursor: (katha.id === 'mayra' || katha.id === 'bhagwad') ? 'pointer' : 'default'
              }}
            >
              {/* Left Column: Arched Image Frame */}
              <div className="katha-card-thumb-wrapper">
                <img
                  src={katha.image}
                  alt={katha.title}
                  className="katha-card-thumb"
                  loading="lazy"
                />
              </div>

              {/* Center Column: Title & Discourse Narrative (.e-con-inner spec) */}
              <div className="katha-card-content e-con-inner">
                <h2 className="katha-card-title elementor-heading-title">
                  {katha.title}
                </h2>
                <p className="katha-card-desc">
                  {katha.description}
                </p>
              </div>

              {/* Right Column: Interlocking Double Hearts Line-Art Icon */}
              <DoubleHeartsIcon />
            </article>
          ))}
        </div>
      </section>

      {/* ====================================================================
          Section 3: Essence of Maharaj Ji's Pravachan
          Matches reference design: Cream background, checklist, Vyaspeeth arch
          ==================================================================== */}
      <section className="kathas-essence-section" aria-labelledby="kathas-essence-heading">
        
        {/* Background Topographic Wave Contours */}
        <svg className="kathas-essence-bg-curves" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M -100 200 C 300 100, 600 350, 1000 150 C 1300 0, 1500 200, 1600 250"
            stroke="#eddcc4"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M -100 320 C 250 220, 650 480, 1050 280 C 1350 120, 1500 300, 1600 350"
            stroke="#f0e2cd"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M -100 440 C 200 340, 700 580, 1100 400 C 1380 250, 1520 420, 1600 460"
            stroke="#f4e8d8"
            strokeWidth="1"
            fill="none"
          />
        </svg>

        {/* Right Saffron Texture Accent */}
        <div className="kathas-essence-brush-right" aria-hidden="true">
          <svg viewBox="0 0 200 200" fill="none">
            <path
              d="M40 30 C90 10, 160 30, 180 80 C200 130, 170 180, 110 185 C50 190, 10 150, 20 90 C25 60, 10 40, 40 30 Z"
              fill="rgba(248, 152, 56, 0.16)"
            />
            <path
              d="M60 50 C100 35, 150 55, 165 95 C180 135, 145 165, 100 168 C60 170, 35 140, 42 95 Z"
              fill="rgba(252, 121, 26, 0.12)"
            />
          </svg>
        </div>

        <div className="kathas-essence-grid">
          
          {/* Left Column: Badge, Heading, Lead, Checklist */}
          <div className="kathas-essence-content">
            <div className="kathas-badge-tag">
              <span role="img" aria-label="Heart">🧡</span>
              <span>Spiritual Discourses & Kathas</span>
              <span role="img" aria-label="Heart">🧡</span>
            </div>

            <h2 id="kathas-essence-heading" className="kathas-essence-heading">
              Essence of Maharaj Ji's<br />
              Pravachan
            </h2>

            <p className="kathas-essence-lead">
              The teachings of HH Pujya Acharya Swami Shri Abhaydas Ji Maharaj connect timeless spiritual wisdom with everyday practical life. His discourses (pravachans) are a blend of devotion, deep scriptural depth, and gentle guidance, drawing seekers on their spiritual journey.
            </p>

            <ul className="kathas-checklist" role="list">
              {highlightsList.map((item, idx) => (
                <li key={idx} className="kathas-check-item">
                  <span className="kathas-check-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#02A95C" />
                      <polyline points="7.5 12 10.5 15 16.5 9" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Arched Podium Frame */}
          <div className="kathas-arch-container">
            {/* Outer Concentric Arch Outline */}
            <div className="kathas-arch-outer-ring" aria-hidden="true" />

            {/* Inner Arched Photo Frame */}
            <div className="kathas-arch-frame">
              <img
                src="/images/about_maharajji_podium.jpg"
                alt="HH Pujya Swami Shri Abhaydas Ji Maharaj delivering divine Ram Katha on the vyaspeeth"
                className="kathas-arch-photo"
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
