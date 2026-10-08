import React from 'react';
import { useCms } from '../context/CmsContext';

export default function TeamSection() {
  const { cms } = useCms();
  const testData = cms?.testimonials || {};

  const defaultMembers = [
    {
      id: 2,
      name: "Sachin Sharma",
      role: "General Manager",
      reviewText: "",
      avatar: ""
    },
    {
      id: 1,
      name: "Vijay Raj Chouhan",
      role: "PS",
      reviewText: "",
      avatar: ""
    },
    {
      id: 3,
      name: "Bhanwar Suthar",
      role: "IT Head",
      reviewText: "",
      avatar: ""
    }
  ];

  const teamMembers = (testData.items && testData.items.length > 0)
    ? testData.items
        .filter(item => item.status !== 'draft')
        .map((item, idx) => ({
          id: item.id || idx,
          name: item.name,
          role: item.role,
          reviewText: item.reviewText || '',
          avatar: item.avatar || ''
        }))
    : defaultMembers;

  const sectionTitle = testData.sectionTitle || "Meet the team behind their success story";

  return (
    <section id="team" style={{
      padding: '75px 0 85px',
      backgroundColor: '#fbf8f3' // Warm cream matching original theme
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#fff7ed',
            color: '#fc791a',
            border: '1px solid #ffedd5',
            borderRadius: '20px',
            padding: '6px 18px',
            fontSize: '12px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '12px'
          }}>
            WHAT WE DO
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            fontWeight: '800',
            color: '#111827',
            margin: 0,
            lineHeight: 1.25,
            whiteSpace: 'pre-line'
          }}>
            {sectionTitle}
          </h2>
        </div>

        {/* Compact Name & Role Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '35px',
          maxWidth: '960px',
          margin: '0 auto',
          paddingTop: '15px'
        }}>
          {teamMembers.map((member) => (
            <div
              key={member.id}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                border: '2px solid #10b981', // Emerald green border matching original design
                padding: '36px 24px 30px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(16, 185, 129, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.06)';
              }}
            >
              {/* Floating Share / Link Circle Button */}
              <div style={{
                position: 'absolute',
                top: '-18px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px',
                fontWeight: '800',
                boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)'
              }}>
                🔗
              </div>

              {/* Optional Avatar */}
              {member.avatar && (
                <div style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginBottom: '14px',
                  border: '3px solid #10b981',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                }}>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: '4px 0 6px 0' }}>
                {member.name}
              </h3>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#6b7280', marginBottom: member.reviewText ? '12px' : '0' }}>
                {member.role}
              </div>

              {/* Optional Review Text / Quote */}
              {member.reviewText && (
                <p style={{
                  fontSize: '13.5px',
                  lineHeight: '1.6',
                  color: '#4b5563',
                  fontStyle: 'italic',
                  margin: '10px 0 0 0',
                  paddingTop: '10px',
                  borderTop: '1px dashed #e5e7eb'
                }}>
                  "{member.reviewText}"
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
