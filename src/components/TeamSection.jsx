import React from 'react';

export default function TeamSection() {
  const teamMembers = [
    {
      id: 2,
      name: "Sachin Sharma",
      role: "General Manager"
    },
    {
      id: 1,
      name: "Vijay Raj Chouhan",
      role: "PS"
    },
    {
      id: 3,
      name: "Bhanwar Suthar",
      role: "IT Head"
    }
  ];

  return (
    <section id="team" style={{
      padding: '75px 0 85px',
      backgroundColor: '#fbf8f3' // Warm cream matching original theme
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 50px' }}>
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
            margin: 0
          }}>
            Meet the team behind<br />their success story
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

              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: '4px 0 6px 0' }}>
                {member.name}
              </h3>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#6b7280' }}>
                {member.role}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
