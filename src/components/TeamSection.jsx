import React from 'react';

export default function TeamSection() {
  const teamMembers = [
    {
      id: 2,
      name: "Sachin Sharma",
      role: "General Manager",
      image: "/images/img_32.jpg"
    },
    {
      id: 1,
      name: "Vijay Raj Chouhan",
      role: "PS",
      image: "/images/img_34.jpg"
    },
    {
      id: 3,
      name: "Bhanwar Suthar",
      role: "IT Head",
      image: "/images/img_33.jpg"
    }
  ];

  return (
    <section id="team" style={{
      padding: '75px 0 85px',
      backgroundColor: '#fbf8f3' // Warm cream matching user reference screenshot
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

        {/* 3 Arch-bottom Cards matching user screenshot */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '35px',
          maxWidth: '1050px',
          margin: '0 auto'
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
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Capsule / Arch-top Image Container */}
              <div style={{
                width: '260px',
                height: '320px',
                borderRadius: '130px 130px 20px 20px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                border: '1px solid #f3f4f6',
                position: 'relative'
              }}>
                <img
                  src={member.image}
                  alt={member.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/images/img_32.jpg';
                  }}
                />
              </div>

              {/* Green Curved Border Frame & Share Icon matching screenshot */}
              <div style={{
                marginTop: '-35px',
                width: '230px',
                backgroundColor: '#ffffff',
                borderRadius: '0 0 115px 115px',
                border: '2px solid #10b981', // Emerald green border arch from screenshot
                borderTop: 'none',
                padding: '24px 16px 28px',
                position: 'relative',
                zIndex: 2,
                boxShadow: '0 10px 25px rgba(0,0,0,0.06)'
              }}>
                {/* Floating Share / Plus Circle Button on Border */}
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
                  fontSize: '16px',
                  fontWeight: '800',
                  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)'
                }}>
                  🔗
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: '6px 0 4px 0' }}>
                  {member.name}
                </h3>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#6b7280' }}>
                  {member.role}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
