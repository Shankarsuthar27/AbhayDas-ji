import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import { websiteData } from '../data/websiteData';

export default function ContactBar() {
  return (
    <div style={{ backgroundColor: '#ffffff', padding: '0 0 40px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Bright Orange Ribbon matching Image 4 */}
        <div
          className="contact-bar-card"
          style={{
            backgroundColor: '#fc791a',
            borderRadius: '24px',
            padding: '28px 36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'center',
            boxShadow: '0 15px 35px rgba(252, 121, 26, 0.35)',
            color: '#ffffff'
          }}
        >
          
          {/* Item 1: Location (Address) */}
          <div className="contact-bar-item" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <MapPin size={26} color="#fc791a" strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.88)', marginBottom: '3px' }}>
                Address
              </div>
              <div style={{ fontSize: '15.5px', fontWeight: '800', lineHeight: '1.3' }}>
                Takhatgarh Dham, Rajasthan, India
              </div>
            </div>
          </div>

          {/* Item 2: Email */}
          <div className="contact-bar-item" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Mail size={24} color="#fc791a" strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.88)', marginBottom: '3px' }}>
                Send Email
              </div>
              <a
                href={`mailto:${websiteData.general.email}`}
                style={{ fontSize: '15.5px', fontWeight: '800', color: '#ffffff', textDecoration: 'none', lineHeight: '1.3' }}
              >
                {websiteData.general.email}
              </a>
            </div>
          </div>

          {/* Item 3: Phone (Call Emergency) */}
          <div className="contact-bar-item" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Phone size={24} color="#fc791a" strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.88)', marginBottom: '3px' }}>
                Call Emergency
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <a
                  href="tel:+918696298489"
                  style={{ fontSize: '15.5px', fontWeight: '800', color: '#ffffff', textDecoration: 'none', lineHeight: '1.3' }}
                >
                  +91 8696298489
                </a>
                <a
                  href="tel:+919509587824"
                  style={{ fontSize: '15.5px', fontWeight: '800', color: '#ffffff', textDecoration: 'none', lineHeight: '1.3' }}
                >
                  +919509587824
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
