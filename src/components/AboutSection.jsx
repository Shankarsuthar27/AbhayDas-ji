import React, { useState } from 'react';
import { websiteData } from '../data/websiteData';

export default function AboutSection({ onOpenDonate, onOpenVideo }) {
  const [showFullBio, setShowFullBio] = useState(false);
  const { about } = websiteData;

  const briefIntroText = "Pujya Abhaydas Ji Maharaj Shri is a spiritual guru, religious preacher, and social reformer who embraced the path of dharma and humanitarian service from early childhood. At the tender age of four, he received spiritual initiation (Diksha) from the pujya Acharya Shri Nirbhaydas Ji Maharaj Shri. Since then, he has been wholly dedicated to the promotion of spirituality, moral values, Indian culture, and spiritual awakening. He is presently seated as the fifth Acharya (heir apparent) of the 150-year-old Sadguru Trikam Das Ji Dham tradition located in Takhatgarh, Pali district, Rajasthan, and continues to carry forward its sacred spiritual legacy";

  return (
    <section id="about" style={{
      padding: '70px 0 90px',
      backgroundColor: '#ffffff',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1420px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Main 2-Column Layout matching Reference Image */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 'clamp(30px, 4vw, 56px)',
          alignItems: 'center'
        }}>
          
          {/* Left Column: Beige Card with Curved Top-Right Corner */}
          <div className="about-beige-card" style={{
            backgroundColor: '#faf6ef',
            borderRadius: '0 80px 0 0',
            padding: 'clamp(44px, 5.5vw, 68px) clamp(30px, 4vw, 58px)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
          }}>
            
            {/* Top Badge: 🧡 About Us 🧡 */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#fc791a',
              fontSize: '14.5px',
              fontWeight: '700',
              marginBottom: '16px',
              letterSpacing: '0.2px'
            }}>
              {/* Orange Heart Icon Left */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#fc791a">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>About Us</span>
              {/* Orange Heart Icon Right */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#fc791a">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>

            {/* Main Heading: Brief Introduction */}
            <h2 className="about-heading-title" style={{
              fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
              fontSize: 'clamp(36px, 4.2vw, 50px)',
              fontWeight: '800',
              color: '#0d2820',
              lineHeight: '1.18',
              margin: '0 0 24px 0',
              letterSpacing: '-0.4px'
            }}>
              Brief Introduction
            </h2>

            {/* Paragraph Text (Exact Match to Reference Image) */}
            <p className="about-desc-paragraph" style={{
              fontSize: '15px',
              lineHeight: '1.78',
              color: '#374151',
              margin: '0 0 32px 0',
              maxWidth: '540px'
            }}>
              {briefIntroText}
            </p>

            {/* Expandable Extended Bio */}
            {showFullBio && (
              <div style={{
                backgroundColor: '#ffffff',
                borderLeft: '4px solid #fc791a',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '28px',
                fontSize: '14px',
                lineHeight: '1.75',
                color: '#374151',
                whiteSpace: 'pre-line',
                boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                animation: 'aboutFadeIn 0.3s ease'
              }}>
                {about.extendedBio}
              </div>
            )}

            {/* CTA Button: [>>] About More */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                aria-label="About More"
                className="about-cta-btn"
                style={{
                  backgroundColor: '#fc791a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '6px 26px 6px 7px',
                  height: '48px',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 6px 20px rgba(252, 121, 26, 0.35)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(252, 121, 26, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(252, 121, 26, 0.35)';
                }}
              >
                {/* White Circle with Orange Double Chevron (>>) */}
                <span style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fc791a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="7 17 12 12 7 7"></polyline>
                    <polyline points="13 17 18 12 13 7"></polyline>
                  </svg>
                </span>
                <span>{showFullBio ? 'Show Less' : 'About More'}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Two Tall Rounded Images with Floating Rotating Badge */}
          <div className="about-images-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '22px',
            alignItems: 'center',
            position: 'relative'
          }}>

            {/* Image 1: Maharaj Ji at Podium with Krishna Backdrop (img_9.jpg) */}
            <div className="about-img-box" style={{
              position: 'relative',
              borderRadius: '26px',
              height: 'clamp(460px, 44vw, 540px)'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '26px',
                overflow: 'hidden',
                boxShadow: '0 14px 38px rgba(0,0,0,0.12)'
              }}>
                <img
                  src="/images/img_9.jpg"
                  alt="Pujya Maharaj Ji with Krishna Bhagwan"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.src = '/images/img_3.jpg';
                  }}
                />
              </div>

              {/* Floating Circular Rotating Play Badge (Overlapping Bottom-Left of Image 1) */}
              <div
                onClick={() => onOpenVideo && onOpenVideo('X0UPcFj_ZNQ')}
                title="Play Pravachan Video"
                className="about-play-badge"
                style={{
                  position: 'absolute',
                  bottom: '34px',
                  left: '-48px',
                  width: '116px',
                  height: '116px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #fc791a',
                  boxShadow: '0 10px 28px rgba(0,0,0,0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.boxShadow = '0 14px 34px rgba(252, 121, 26, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.16)';
                }}
              >
                {/* Rotating Circular Text SVG */}
                <svg
                  viewBox="0 0 120 120"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    animation: 'aboutSpinText 16s linear infinite'
                  }}
                >
                  <defs>
                    <path
                      id="aboutCircleTextPath"
                      d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                    />
                  </defs>
                  <text
                    fill="#1f2937"
                    fontSize="9.6"
                    fontWeight="600"
                    letterSpacing="1.2"
                  >
                    <textPath href="#aboutCircleTextPath" startOffset="0%">
                      HH Pujya Acharya Swami Shri Abhaydas Ji •
                    </textPath>
                  </text>
                </svg>

                {/* Center Orange Play Triangle */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fc791a" style={{ marginLeft: '3px' }}>
                    <polygon points="6,3 20,12 6,21" />
                  </svg>
                </div>
              </div>

            </div>

            {/* Image 2: Maharaj Ji Smiling Portrait with Golden Shawl (img_10.jpg) */}
            <div className="about-img-box" style={{
              position: 'relative',
              borderRadius: '26px',
              overflow: 'hidden',
              height: 'clamp(460px, 44vw, 540px)',
              boxShadow: '0 14px 38px rgba(0,0,0,0.12)'
            }}>
              <img
                src="/images/img_10.jpg"
                alt="Pujya Swami Shri Abhaydas Ji Maharaj"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.src = '/images/img_4.jpg';
                }}
              />
            </div>

          </div>

        </div>

      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes aboutSpinText {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes aboutFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .about-play-badge {
            left: 12px !important;
            bottom: 12px !important;
            width: 86px !important;
            height: 86px !important;
          }
        }
      `}</style>
    </section>
  );
}
