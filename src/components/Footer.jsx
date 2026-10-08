import React from 'react';
import { Mail, Phone, Calendar } from 'lucide-react';
import { websiteData } from '../data/websiteData';
import { newsArticles } from '../data/newsData';
import { useCms } from '../context/CmsContext';

export default function Footer({ currentRoute = '/', onNavigate }) {
  const { cms } = useCms();
  const footerData = cms?.footer || {};
  const footerLogo = footerData.logo || '/images/img_1.png';
  const footerDesc = footerData.description || 'Discover the life, teachings, discourses, spiritual lineage, seva initiatives, and mission of HH Pujya Acharya Swami Shri Abhaydas Ji Maharaj.';
  const showNewsWidget = footerData.showLatestNewsWidget !== false;
  const copyrightText = footerData.copyright || `Shree Abhay Das Ji Maharaj © ${new Date().getFullYear()} Copyrights | All Rights Reserved & Developed By AsthaSoftIndia`;

  const socialUrls = {
    facebook: footerData.socialLinks?.facebook || websiteData.general.socialLinks.facebook,
    twitter: footerData.socialLinks?.twitter || websiteData.general.socialLinks.twitter || '#',
    instagram: footerData.socialLinks?.instagram || websiteData.general.socialLinks.instagram,
    youtube: footerData.socialLinks?.youtube || websiteData.general.socialLinks.youtube
  };

  const handleFooterLinkClick = (e, href, label) => {
    if (!href) return;
    if (label === 'About Us' || href === '/about') {
      e.preventDefault();
      if (onNavigate) onNavigate('/about');
      else { window.history.pushState({}, '', '/about'); window.dispatchEvent(new Event('popstate')); }
      return;
    }
    if (label === 'Upcoming Events' || href === '/events' || href === '#events') {
      e.preventDefault();
      if (onNavigate) onNavigate('/events');
      else { window.history.pushState({}, '', '/events'); window.dispatchEvent(new Event('popstate')); }
      return;
    }
    if (label === 'Photo Gallery' || href === '/gallery' || href === '#gallery') {
      e.preventDefault();
      if (onNavigate) onNavigate('/gallery');
      else { window.history.pushState({}, '', '/gallery'); window.dispatchEvent(new Event('popstate')); }
      return;
    }
    if (label === 'News' || href === '/news' || href === '#news') {
      e.preventDefault();
      if (onNavigate) onNavigate('/news');
      else { window.history.pushState({}, '', '/news'); window.dispatchEvent(new Event('popstate')); }
      return;
    }
    if (href.startsWith('/news/')) {
      e.preventDefault();
      if (onNavigate) onNavigate(href);
      else { window.history.pushState({}, '', href); window.dispatchEvent(new Event('popstate')); }
      return;
    }
    if (label === 'Home' || href === '#hero' || href === '/') {
      e.preventDefault();
      if (onNavigate) onNavigate('/');
      else { window.history.pushState({}, '', '/'); window.dispatchEvent(new Event('popstate')); }
      return;
    }
    if (href.startsWith('http')) {
      return; // allow normal link click
    }
    if (currentRoute !== '/') {
      e.preventDefault();
      if (onNavigate) onNavigate('/');
      else { window.history.pushState({}, '', '/'); window.dispatchEvent(new Event('popstate')); }
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const defaultQuickLinks = [
    { label: 'Upcoming Events', href: '/events' },
    { label: 'Volunteers',      href: '#team' },
    { label: 'Photo Gallery',   href: '/gallery' },
    { label: 'About Us',        href: '/about' },
    { label: 'Contact Us',      href: '#contact' },
  ];

  const quickLinks = (footerData.quickLinks && footerData.quickLinks.length > 0)
    ? footerData.quickLinks
        .filter(l => l.status !== 'draft')
        .map(l => ({ label: l.label, href: l.url || '/' }))
    : defaultQuickLinks;

  const ourServices = (footerData.ourServices && footerData.ourServices.length > 0)
    ? footerData.ourServices
        .filter(s => s.status !== 'draft')
        .map(s => ({ label: s.label, href: s.url || '#campaigns' }))
    : [
        { label: 'Gau Seva & Gaushala', href: '#campaigns' },
        { label: 'Gurukulam Education', href: '#campaigns' },
        { label: 'Food & Nutrition Seva', href: '#campaigns' },
        { label: 'Daily Satsang & Katha', href: '/kathas' }
      ];

  const recentNewsItems = [
    {
      id: 1,
      title: "तखतगढ़ के गुरुकुलम में 500 जनजातीय बच्चों को मिलेगी शिक्षा: उद्घाटन से पहले सर्व समाज की बैठक, स्वामी अभयदास ने दिया संदेश",
      date: "22 Mar 26",
      image: "/images/img_25.jpg",
      slug: "takhatgarh-gurukulam-education"
    },
    {
      id: 2,
      title: "भीनमाल में लक्षार्चन महायज्ञ: 27 मार्च से 2 अप्रैल तक चलेगा महोत्सव, तैयारियां तेज",
      date: "22 Mar 26",
      image: "/images/img_22.jpg",
      slug: "bheenmal-laksharchan-mahayagya"
    }
  ];

  /* ─── Social Button ─── */
  const socialBtn = (href, title, child) => (
    <a
      key={title}
      href={href}
      target="_blank"
      rel="noreferrer"
      title={title}
      style={{
        width: '40px',
        height: '40px',
        border: '1px solid rgba(255,255,255,0.22)',
        borderRadius: '6px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e2e8f0',
        textDecoration: 'none',
        transition: 'all 0.25s ease',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#fc791a';
        e.currentTarget.style.borderColor = '#fc791a';
        e.currentTarget.style.color = '#ffffff';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
        e.currentTarget.style.color = '#e2e8f0';
      }}
    >
      {child}
    </a>
  );

  /* ─── Dual-color Accent Underline (Orange + Green) ─── */
  const DualColorUnderline = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px', marginBottom: '24px' }}>
      <div style={{ height: '3.5px', width: '28px', backgroundColor: '#fc791a', borderRadius: '3px' }} />
      <div style={{ height: '3.5px', width: '80px', backgroundColor: '#02A95C', borderRadius: '3px' }} />
    </div>
  );

  return (
    <footer id="contact" style={{ backgroundColor: '#0b231c', color: '#b0bec5', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '64px 28px 48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '44px',
          alignItems: 'start',
        }}>

          {/* ── COL 1: Logo + Tagline + Socials ── */}
          <div style={{ maxWidth: '340px' }}>
            {/* Logo image from CMS */}
            <div style={{ marginBottom: '22px' }}>
              <img
                src={footerLogo}
                alt="HH Pujya Acharya Swami Shri Abhaydas Ji Maharaj"
                style={{
                  maxHeight: '76px',
                  width: 'auto',
                  maxWidth: '100%',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Description matching CMS */}
            <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#9db4ae', margin: '0 0 26px 0' }}>
              {footerDesc}
            </p>

            {/* Social Icons row */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {socialBtn(socialUrls.facebook, 'Facebook',
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 8H6v4h3v12h5V12h3.64L18 8h-4V6.33C14 5.37 14.5 5 15.6 5H18V0h-3.8C10.6 0 9 1.58 9 4.62V8z"/>
                </svg>
              )}
              {socialBtn(socialUrls.twitter, 'X (Twitter)',
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              )}
              {socialBtn(socialUrls.instagram, 'Instagram',
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              )}
              {socialBtn(socialUrls.youtube, 'YouTube',
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.13C4.5 20.45 12 20.45 12 20.45s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.13C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/>
                </svg>
              )}
            </div>
          </div>

          {/* ── COL 2: Quick Link ── */}
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
              Quick Link
            </h3>
            <DualColorUnderline />

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    onClick={e => handleFooterLinkClick(e, link.href, link.label)}
                    style={{
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '15.5px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fc791a'}
                    onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
                  >
                    <span style={{ color: '#ffffff', fontWeight: '800', fontSize: '18px', lineHeight: 1 }}>»</span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 3: Our Services (Matching CMS) ── */}
          {ourServices.length > 0 && (
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Our Services
              </h3>
              <DualColorUnderline />

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {ourServices.map((service, i) => (
                  <li key={i}>
                    <a
                      href={service.href}
                      onClick={e => handleFooterLinkClick(e, service.href, service.label)}
                      style={{
                        color: '#ffffff',
                        textDecoration: 'none',
                        fontSize: '15.5px',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fc791a'}
                      onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
                    >
                      <span style={{ color: '#ffffff', fontWeight: '800', fontSize: '18px', lineHeight: 1 }}>»</span>
                      <span>{service.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── COL 4: Recent News (Controlled by CMS toggle) ── */}
          {showNewsWidget && (
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Recent News
              </h3>
              <DualColorUnderline />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {((cms?.news?.articles && cms.news.articles.length > 0)
                  ? cms.news.articles.filter(a => a.status !== 'draft').slice(0, 2).map((a, i) => ({
                      id: a.id || i,
                      title: a.title,
                      date: a.date,
                      image: a.featuredImage || '/images/img_35.png',
                      href: a.readMoreUrl || '/news'
                    }))
                  : recentNewsItems.map(n => ({ ...n, href: `/news/${n.slug}` }))
                ).map(n => (
                  <a
                    key={n.id}
                    href={n.href}
                    onClick={e => handleFooterLinkClick(e, n.href, 'News')}
                    style={{ display: 'flex', gap: '14px', textDecoration: 'none', alignItems: 'flex-start' }}
                  >
                    {/* Square Thumbnail */}
                    <img
                      src={n.image}
                      alt={n.title}
                      style={{
                        width: '74px',
                        height: '74px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                      onError={e => { e.target.src = '/images/img_35.png'; }}
                    />

                    {/* Text Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <Calendar size={13} color="#9db4ae" />
                        <span style={{ fontSize: '12px', color: '#9db4ae', fontWeight: '600' }}>{n.date}</span>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '13.5px',
                          fontWeight: '700',
                          color: '#ffffff',
                          lineHeight: '1.45',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fc791a'}
                        onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
                      >
                        {n.title}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── COL 5: Contact Us ── */}
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
              Contact Us
            </h3>
            <DualColorUnderline />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '14px' }}>
              
              {/* Email */}
              <a
                href={`mailto:${websiteData.general.email}`}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ffffff', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fc791a'}
                onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
              >
                <Mail size={18} color="#9db4ae" />
                <span style={{ fontWeight: '500' }}>{websiteData.general.email}</span>
              </a>

              {/* Phone */}
              <a
                href={`tel:${websiteData.general.phone}`}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ffffff', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fc791a'}
                onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
              >
                <Phone size={18} color="#9db4ae" />
                <span style={{ fontWeight: '600' }}>{websiteData.general.phoneDisplay}</span>
              </a>

            </div>
          </div>

        </div>
      </div>

      {/* ── BOTTOM COPYRIGHT BAR ── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '20px 24px',
        textAlign: 'center',
        maxWidth: '1300px',
        margin: '0 auto',
      }}>
        <div style={{ fontSize: '13px', color: '#8ca19b', lineHeight: '1.6' }}>
          {copyrightText}
        </div>
      </div>

    </footer>
  );
}
