import React, { useState } from 'react';
import { Edit3, Image as ImageIcon, Plus, Trash2, Link2 } from 'lucide-react';
import VisualImageModal from './VisualImageModal';
import VisualTextModal from './VisualTextModal';

export default function FooterVisualEditor({
  formData,
  updateSection,
  viewport = 'desktop',
  onNotify
}) {
  const footData = formData?.footer || {};
  const logo = footData.logo || '/images/img_1.png';
  const description = footData.description || 'Pujya Abhaydas Ji Maharaj Shri is dedicated to the preservation of Sanatan Dharma, Vedic values, humanitarian service, Gau Seva, and tribal education.';
  const copyright = footData.copyright || `© ${new Date().getFullYear()} Shree Abhaydas Ji Maharaj. All Rights Reserved.`;
  const socialLinks = footData.socialLinks || {
    facebook: 'https://facebook.com/shreeabhaydas',
    youtube: 'https://www.youtube.com/@ShreeAbhaydas',
    instagram: 'https://instagram.com/shreeabhaydas',
    twitter: 'https://twitter.com/shreeabhaydas'
  };

  const quickLinks = footData.quickLinks && footData.quickLinks.length > 0 ? footData.quickLinks : [
    { id: 'ql1', label: 'Upcoming Events', url: '/events' },
    { id: 'ql2', label: 'Volunteers', url: '#team' },
    { id: 'ql3', label: 'Photo Gallery', url: '/gallery' },
    { id: 'ql4', label: 'About Us', url: '/about' }
  ];

  const ourServices = footData.ourServices && footData.ourServices.length > 0 ? footData.ourServices : [
    { id: 'os1', label: 'Food & Water Charity', url: '#donate' },
    { id: 'os2', label: 'Sent A Gift For Children', url: '#donate' },
    { id: 'os3', label: 'Make Donation', url: '#donate' },
    { id: 'os4', label: 'Gau Seva & Gaushala', url: '#donate' }
  ];

  const [logoModal, setLogoModal] = useState(false);
  const [descModal, setDescModal] = useState(false);
  const [socialModal, setSocialModal] = useState(false);
  const [copyrightModal, setCopyrightModal] = useState(false);
  const [linkEditModal, setLinkEditModal] = useState(null); // { type: 'quick'|'services', idx }

  const handleUpdate = (updates) => {
    updateSection('footer', updates);
    onNotify?.('Updated Footer');
  };

  const handleAddQuickLink = () => {
    const list = [...quickLinks, { id: `ql_${Date.now()}`, label: 'New Link', url: '/' }];
    handleUpdate({ quickLinks: list });
    onNotify?.('Added Quick Link');
  };

  const handleDeleteQuickLink = (idx) => {
    const list = quickLinks.filter((_, i) => i !== idx);
    handleUpdate({ quickLinks: list });
  };

  const handleAddService = () => {
    const list = [...ourServices, { id: `os_${Date.now()}`, label: 'New Seva Service', url: '#donate' }];
    handleUpdate({ ourServices: list });
    onNotify?.('Added Service Item');
  };

  const handleDeleteService = (idx) => {
    const list = ourServices.filter((_, i) => i !== idx);
    handleUpdate({ ourServices: list });
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
            Visual Canvas Editor • 11. Footer Settings
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setLogoModal(true)}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#1e293b',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ImageIcon size={12} color="#38bdf8" /> Change Logo
          </button>

          <button
            type="button"
            onClick={() => setSocialModal(true)}
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
            <Link2 size={12} /> Social Media Links
          </button>

          <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginLeft: '6px' }}>
            💡 Click logo, text, links, or copyright below to edit
          </span>
        </div>
      </div>

      {/* ── Main Preview matching Footer.jsx ── */}
      <footer style={{
        backgroundColor: '#071b15',
        color: '#ffffff',
        padding: '70px 0 30px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Main 4-Column Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewport === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '50px'
          }}>
            {/* Col 1: Logo & Mission Statement */}
            <div>
              {/* Logo */}
              <div
                className="visual-editable-item"
                onClick={() => setLogoModal(true)}
                title="Click to replace Footer Logo"
                style={{
                  display: 'inline-block',
                  cursor: 'pointer',
                  marginBottom: '16px',
                  padding: '6px'
                }}
              >
                <img
                  src={logo}
                  alt="Official Logo"
                  style={{ height: '54px', width: 'auto', display: 'block' }}
                />
                <span style={{ fontSize: '10.5px', color: '#38bdf8', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <ImageIcon size={11} /> Change Logo
                </span>
              </div>

              {/* Description */}
              <p
                className="visual-editable-item"
                onClick={() => setDescModal(true)}
                title="Click to edit Footer Description"
                style={{
                  fontSize: '14px',
                  lineHeight: '1.7',
                  color: '#cbd5e1',
                  margin: '0 0 20px 0',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px'
                }}
              >
                {description}
                <Edit3 size={11} color="#38bdf8" style={{ marginLeft: '6px', opacity: 0.6 }} />
              </p>

              {/* Social Icons */}
              <div
                className="visual-editable-item"
                onClick={() => setSocialModal(true)}
                title="Click to edit Social Media Links"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.06)'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M9 8H6v4h3v12h5V12h3.64L18 8h-4V6.33C14 5.37 14.5 5 15.6 5H18V0h-3.8C10.6 0 9 1.58 9 4.62V8z"/>
                  </svg>
                </div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.13C4.5 20.45 12 20.45 12 20.45s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.13C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/>
                  </svg>
                </div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e1306c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1da1f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '700', marginLeft: '6px' }}>
                  Edit Links
                </span>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '17px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  Quick Links
                </h4>
                <button
                  type="button"
                  onClick={handleAddQuickLink}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <Plus size={12} /> Add
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {quickLinks.map((link, idx) => (
                  <div
                    key={link.id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 6px',
                      borderRadius: '6px'
                    }}
                  >
                    <span
                      className="visual-editable-item"
                      onClick={() => setLinkEditModal({ type: 'quick', idx })}
                      title="Click to edit link label & URL"
                      style={{ fontSize: '14px', color: '#cbd5e1', cursor: 'pointer', padding: '2px 4px' }}
                    >
                      • {link.label}
                      <Edit3 size={10} color="#38bdf8" style={{ marginLeft: '4px', opacity: 0.5 }} />
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteQuickLink(idx)}
                      title="Delete Link"
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Col 3: Our Services */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '17px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  Our Services
                </h4>
                <button
                  type="button"
                  onClick={handleAddService}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <Plus size={12} /> Add
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {ourServices.map((svc, idx) => (
                  <div
                    key={svc.id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 6px',
                      borderRadius: '6px'
                    }}
                  >
                    <span
                      className="visual-editable-item"
                      onClick={() => setLinkEditModal({ type: 'services', idx })}
                      title="Click to edit service label & URL"
                      style={{ fontSize: '14px', color: '#cbd5e1', cursor: 'pointer', padding: '2px 4px' }}
                    >
                      • {svc.label}
                      <Edit3 size={10} color="#38bdf8" style={{ marginLeft: '4px', opacity: 0.5 }} />
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteService(idx)}
                      title="Delete Service"
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Copyright Notice */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div
              className="visual-editable-item"
              onClick={() => setCopyrightModal(true)}
              title="Click to edit Copyright Text"
              style={{
                fontSize: '13px',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px'
              }}
            >
              <span>{copyright}</span>
              <Edit3 size={11} color="#38bdf8" style={{ marginLeft: '6px', opacity: 0.6 }} />
            </div>

            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Shree Abhaydas Ji Maharaj Spiritual Portal
            </div>
          </div>

        </div>
      </footer>

      {/* ── Modals ── */}
      {logoModal && (
        <VisualImageModal
          isOpen={true}
          onClose={() => setLogoModal(false)}
          title="Update Footer Official Logo"
          currentImage={logo}
          onSelectImage={(url) => handleUpdate({ logo: url })}
        />
      )}

      {descModal && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setDescModal(false)}
          title="Edit Footer Description Statement"
          fields={[{ name: 'description', label: 'Footer Biography / Mission Text', value: description, type: 'textarea', rows: 4 }]}
          onSave={(vals) => handleUpdate({ description: vals.description })}
        />
      )}

      {socialModal && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setSocialModal(false)}
          title="Edit Social Media Links"
          fields={[
            { name: 'facebook', label: 'Facebook URL', value: socialLinks.facebook || '' },
            { name: 'youtube', label: 'YouTube Channel URL', value: socialLinks.youtube || '' },
            { name: 'instagram', label: 'Instagram Profile URL', value: socialLinks.instagram || '' },
            { name: 'twitter', label: 'Twitter / X URL', value: socialLinks.twitter || '' }
          ]}
          onSave={(vals) => handleUpdate({ socialLinks: vals })}
        />
      )}

      {copyrightModal && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setCopyrightModal(false)}
          title="Edit Copyright Notice"
          fields={[{ name: 'copyright', label: 'Copyright String', value: copyright }]}
          onSave={(vals) => handleUpdate({ copyright: vals.copyright })}
        />
      )}

      {linkEditModal && (
        <VisualTextModal
          isOpen={true}
          onClose={() => setLinkEditModal(null)}
          title={`Edit ${linkEditModal.type === 'quick' ? 'Quick Link' : 'Service Item'}`}
          fields={[
            {
              name: 'label',
              label: 'Display Text',
              value: linkEditModal.type === 'quick'
                ? quickLinks[linkEditModal.idx]?.label
                : ourServices[linkEditModal.idx]?.label
            },
            {
              name: 'url',
              label: 'Destination URL',
              value: linkEditModal.type === 'quick'
                ? quickLinks[linkEditModal.idx]?.url
                : ourServices[linkEditModal.idx]?.url
            }
          ]}
          onSave={(vals) => {
            if (linkEditModal.type === 'quick') {
              const list = [...quickLinks];
              list[linkEditModal.idx] = { ...list[linkEditModal.idx], ...vals };
              handleUpdate({ quickLinks: list });
            } else {
              const list = [...ourServices];
              list[linkEditModal.idx] = { ...list[linkEditModal.idx], ...vals };
              handleUpdate({ ourServices: list });
            }
            setLinkEditModal(null);
          }}
        />
      )}

    </div>
  );
}
