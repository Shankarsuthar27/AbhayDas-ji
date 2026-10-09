import React, { useState } from 'react';
import { Edit3, MapPin, Mail, Phone } from 'lucide-react';
import VisualTextModal from './VisualTextModal';

export default function ContactVisualEditor({
  formData,
  updateSection,
  viewport = 'desktop',
  onNotify
}) {
  const banner = formData?.contactBanner || {};
  const phone = banner.phone || '+91 94142 84180';
  const email = banner.email || 'info@shreeabhaydas.com';
  const location = banner.location || 'Takhatgarh Dham, Rajasthan, India';

  const [activeModal, setActiveModal] = useState(null); // 'all' | 'location' | 'email' | 'phone'

  const handleUpdate = (updates) => {
    updateSection('contactBanner', updates);
    onNotify?.('Updated Contact Details');
  };

  return (
    <div className="visual-editor-section-root" style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      
      {/* ── Top Visual Control Bar ── */}
      <div style={{
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid #1e293b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#38bdf8',
            display: 'inline-block'
          }} />
          <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#93c5fd' }}>
            Visual Canvas Editor • 10. Contact CTA Banner Strip
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveModal('all')}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Edit3 size={13} /> Edit All Contact Details
          </button>

          <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginLeft: '6px' }}>
            💡 Click Address, Email, or Phone below to edit
          </span>
        </div>
      </div>

      {/* ── Main Preview matching ContactBar.jsx ── */}
      <div style={{ backgroundColor: '#ffffff', padding: '50px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          
          <div
            className="contact-bar-card"
            style={{
              backgroundColor: '#fc791a',
              borderRadius: '24px',
              padding: '32px 36px',
              display: 'grid',
              gridTemplateColumns: viewport === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              alignItems: 'center',
              boxShadow: '0 15px 35px rgba(252, 121, 26, 0.35)',
              color: '#ffffff'
            }}
          >
            {/* Item 1: Location */}
            <div
              className="visual-editable-item"
              onClick={() => setActiveModal('location')}
              title="Click to edit Ashram Address"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '12px'
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <MapPin size={26} color="#fc791a" strokeWidth={2.4} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.88)', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Address <Edit3 size={11} color="#ffffff" style={{ opacity: 0.7 }} />
                </div>
                <div style={{ fontSize: '15.5px', fontWeight: '800', lineHeight: '1.3' }}>
                  {location}
                </div>
              </div>
            </div>

            {/* Item 2: Email */}
            <div
              className="visual-editable-item"
              onClick={() => setActiveModal('email')}
              title="Click to edit Official Email"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '12px'
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <Mail size={24} color="#fc791a" strokeWidth={2.4} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.88)', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Send Email <Edit3 size={11} color="#ffffff" style={{ opacity: 0.7 }} />
                </div>
                <div style={{ fontSize: '15.5px', fontWeight: '800', lineHeight: '1.3' }}>
                  {email}
                </div>
              </div>
            </div>

            {/* Item 3: Phone */}
            <div
              className="visual-editable-item"
              onClick={() => setActiveModal('phone')}
              title="Click to edit Contact Phone Number"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '12px'
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <Phone size={24} color="#fc791a" strokeWidth={2.4} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.88)', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Emergency Contact <Edit3 size={11} color="#ffffff" style={{ opacity: 0.7 }} />
                </div>
                <div style={{ fontSize: '15.5px', fontWeight: '800', lineHeight: '1.3' }}>
                  {phone}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── Modals ── */}
      {activeModal === 'all' && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Edit All Contact Banner Info"
          fields={[
            { name: 'location', label: 'Ashram Address / Location', value: location },
            { name: 'email', label: 'Official Email', value: email },
            { name: 'phone', label: 'Emergency Phone Number(s)', value: phone }
          ]}
          onSave={handleUpdate}
        />
      )}

      {activeModal === 'location' && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Edit Ashram Address"
          fields={[{ name: 'location', label: 'Address / Location', value: location }]}
          onSave={(vals) => handleUpdate({ location: vals.location })}
        />
      )}

      {activeModal === 'email' && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Edit Official Email"
          fields={[{ name: 'email', label: 'Email Address', value: email }]}
          onSave={(vals) => handleUpdate({ email: vals.email })}
        />
      )}

      {activeModal === 'phone' && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Edit Emergency Phone"
          fields={[{ name: 'phone', label: 'Phone Number', value: phone }]}
          onSave={(vals) => handleUpdate({ phone: vals.phone })}
        />
      )}

    </div>
  );
}
