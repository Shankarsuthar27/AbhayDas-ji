import React, { useEffect } from 'react';
import './AboutPage.css';

export default function AboutPage({ onNavigate, onOpenDonate, onOpenVolunteer }) {
  useEffect(() => {
    // Update document title for SEO & Accessibility
    document.title = "About Us – Shree Abhay Das Ji Maharaj | Official Website";
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const kathasList = [
    { id: 'bhagwad', name: 'Shreemad Bhagwad Katha' },
    { id: 'ramkatha', name: 'Shree Ram Katha' },
    { id: 'mayra', name: 'Nani Bai Ka Mayra' },
    { id: 'meera', name: 'Meera Katha' },
    { id: 'bhaktmaal', name: 'Shree Bhaktmaal Katha' }
  ];


  return (
    <div className="about-page-container" id="about-main-surface">
      


      {/* ====================================================================
          Section 1: Hero Profile (Matches uploaded reference image)
          Left: Maharaj Ji with mic photo
          Right: "About Us", Heading, and two bio paragraphs
          ==================================================================== */}
      <section className="about-profile-section" aria-labelledby="section-profile-heading">
        <div className="about-profile-grid">
          
          {/* Left Column: Image with soft rounded corners */}
          <div className="about-mic-photo-wrapper">
            <img
              src="/images/about_maharajji_mic.jpg"
              alt="HH Pujya Acharya Swami Shri Abhaydas Ji Maharaj delivering a divine spiritual discourse"
              className="about-mic-photo"
              loading="eager"
            />
          </div>

          {/* Right Column: Title and Bio */}
          <div className="about-profile-content">
            <div className="about-badge-tag">
              <span className="about-heart-icon" role="img" aria-label="Heart">🧡</span>
              <span>About Us</span>
              <span className="about-heart-icon" role="img" aria-label="Heart">🧡</span>
            </div>

            <h2 id="section-profile-heading" className="about-main-heading">
              <span>HH Pujya Acharya</span><br />
              <span>Swami Shri Abhaydas Ji</span><br />
              <span>Maharaj</span>
            </h2>

            <p className="about-bio-text">
              HH Pujya Acharya Swami Shri Abhaydas Ji Maharaj is a spiritual guide devoted to spreading the light of Sanatan Dharma, devotion, and righteous living. His journey began at a very early age, when he embraced the path of Sannyasa, dedicating his life to spirituality, discipline, and service to society.
            </p>

            <p className="about-bio-text">
              From childhood itself, Maharaj Ji has been engaged in sharing divine wisdom through kathas, satsangs, and spiritual guidance, helping people connect with faith, values, and inner peace.
            </p>
          </div>

          {/* Decorative Right Contour Curve Wave */}
          <svg className="about-contour-accent-right" viewBox="0 0 130 280" fill="none" aria-hidden="true">
            <path
              d="M130 20 C60 50, 40 100, 70 150 C100 200, 50 250, 130 270"
              stroke="#fcd4b8"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M130 50 C80 80, 60 120, 90 160 C120 200, 80 230, 130 250"
              stroke="#fae0cb"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

        </div>
      </section>

      {/* ====================================================================
          Section 2: Sacred Tradition & Lineage (Matches uploaded reference image)
          Centered container with pink/peach top border notch
          ==================================================================== */}
      <section className="about-tradition-section" aria-label="Spiritual Lineage & Social Upliftment">
        <div className="about-tradition-container">
          
          {/* Centered Top Tab / Notch */}
          <div className="about-divider-notch" aria-hidden="true">
            <svg viewBox="0 0 38 18">
              <path
                d="M 1 0 C 12 0, 14 14, 19 16 C 24 14, 26 0, 37 0"
                fill="#ffffff"
                stroke="#f3d7d7"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          <div className="about-tradition-content">
            <p>
              and seva, Maharaj Ji is associated with the revered <strong>Sadguru Trikam Das Ji Dham tradition</strong> of <strong>Takhatgarh, Rajasthan</strong>, a sacred spiritual lineage that has guided devotees for generations. As the <strong>fifth Acharya</strong> in this parampara, he carries forward the values of <strong>bhakti, niyam, seva, and sanskar</strong>, and continues to guide society through spiritual teachings and devotion. This parampara is not only a lineage of gurus, but also a living tradition of spiritual wisdom, discipline, and cultural values passed from guru to disciple over many years.
            </p>

            <p>
              Along with his spiritual journey, Maharaj Ji is also connected with <strong>service and social upliftment</strong>. His work reflects care for society through efforts such as <strong>Gurukul-style education for children</strong>, support for people in <strong>remote and tribal regions</strong>, and the promotion of <strong>value-based learning and cultural awareness</strong>. His belief is that true spirituality is not limited to worship alone, but must also include service, compassion, and responsibility toward society.
            </p>

            <p>
              Maharaj Ji’s vision is deeply connected with the preservation of <strong>Indian culture, Sanatan values, and spiritual heritage</strong>.
            </p>

            <p>
              His larger mission is to inspire people to live with <strong>faith, devotion, discipline, and moral strength</strong>, while staying rooted in their traditions. Through <strong>katha, satsang</strong>, he continues to spread a simple but powerful message: a life guided by <strong>dharma, devotion, and values</strong> leads to peace, purpose, and fulfillment. His mission is to spread the light of <strong>Sanatan Dharma</strong> and serve society through spiritual guidance, education, and cultural preservation, while his vision is to help build a society rooted in <strong>faith, compassion, and righteous living</strong>.
            </p>
          </div>

        </div>
      </section>

      {/* ====================================================================
          Section 3: A Life Dedicated to Dharma & Katha List
          Matches uploaded reference image:
          Warm cream bg, topographic curves, rosette bullets, arch photo
          ==================================================================== */}
      <section className="about-dharma-section" aria-labelledby="dharma-section-heading">
        
        {/* Background Topographic Wave Contours */}
        <svg className="about-dharma-bg-curves" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true">
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

        {/* Left Devotional Sketch Watermark */}
        <div className="about-dharma-sketch-left" aria-hidden="true">
          <svg viewBox="0 0 200 200" fill="none" stroke="#bfa382" strokeWidth="1.2">
            <circle cx="100" cy="100" r="70" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="50" />
            <path d="M100 30 L100 170 M30 100 L170 100" strokeWidth="0.8" />
            <polygon points="100,45 115,85 155,100 115,115 100,155 85,115 45,100 85,85" fill="rgba(191,163,130,0.08)" />
          </svg>
        </div>

        {/* Right Saffron Texture Splash */}
        <div className="about-dharma-brush-right" aria-hidden="true">
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

        <div className="about-dharma-grid">
          
          {/* Left Column: Heading & Katha Offerings */}
          <div className="about-dharma-content">
            <div className="about-badge-tag">
              <span className="about-heart-icon" role="img" aria-label="Heart">🧡</span>
              <span>Join Us Now</span>
              <span className="about-heart-icon" role="img" aria-label="Heart">🧡</span>
            </div>

            <h2 id="dharma-section-heading" className="about-dharma-heading">
              <span>A Life Dedicated to</span><br />
              <span>Dharma</span>
            </h2>

            <p className="about-dharma-lead">
              Maharaj Ji’s teachings are rooted in timeless scriptures and saint traditions. Through his discourses, he brings spiritual knowledge to life in a simple and relatable way.
            </p>

            <h3 className="about-katha-subhead">
              He is known for delivering:
            </h3>

            <ul className="about-katha-list" role="list">
              {kathasList.map((katha) => (
                <li key={katha.id} className="about-katha-item">
                  {/* Rosette / Dharmachakra Icon matching screenshot */}
                  <span className="about-katha-chakra-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm1 2.06a8.03 8.03 0 0 1 4.94 2.88L15 8.94V6.5a1 1 0 0 0-2 0v-2.44zM8.06 6.94A8.03 8.03 0 0 1 13 4.06V6.5a1 1 0 0 0 2 0V4.06a8.026 8.026 0 0 1 4.94 2.88l-1.94 1.94a4.015 4.015 0 0 0-2.82-1.18c-.37 0-.73.05-1.07.14L13 6.5a1 1 0 0 0-2 0l-1.07 7.84a4.01 4.01 0 0 0-1.87 2.6L6.06 15.06a8.03 8.03 0 0 1 2-8.12zM6.06 17.06l1.94-1.94c.32.74.8 1.38 1.41 1.88l-1.41 1.41a8.05 8.05 0 0 1-1.94-1.35zm11.88 0a8.05 8.05 0 0 1-1.94 1.35l-1.41-1.41c.61-.5 1.09-1.14 1.41-1.88l1.94 1.94zM12 14a2 2 0 1 1 2-2 2.002 2.002 0 0 1-2 2z" />
                    </svg>
                  </span>
                  <span>{katha.name}</span>
                </li>
              ))}
            </ul>

            <div className="about-action-group">
              <button
                type="button"
                className="btn-about-primary"
                onClick={() => {
                  if (onOpenDonate) onOpenDonate('katha-seva');
                }}
                id="btn-about-seva"
              >
                <span>Support Dharma Seva</span>
                <span aria-hidden="true">→</span>
              </button>

              <button
                type="button"
                className="btn-about-secondary"
                onClick={() => {
                  if (onOpenVolunteer) onOpenVolunteer();
                }}
                id="btn-about-volunteer"
              >
                <span>Join as Volunteer</span>
              </button>
            </div>
          </div>

          {/* Right Column: Arched Frame Portrait of Ramkatha Podium */}
          <div className="about-arch-container">
            {/* Outer Concentric Arch Outline */}
            <div className="about-arch-outer-ring" aria-hidden="true" />

            {/* Inner Arched Photo Frame */}
            <div className="about-arch-frame">
              <img
                src="/images/about_maharajji_podium.jpg"
                alt="HH Pujya Swami Shri Abhaydas Ji Maharaj delivering Ram Katha with both hands raised at the holy vyaspeeth"
                className="about-arch-photo"
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
