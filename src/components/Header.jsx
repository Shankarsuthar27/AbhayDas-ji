import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Plus, Minus, ChevronDown } from 'lucide-react';
import { websiteData } from '../data/websiteData';
import { useCms } from '../context/CmsContext';

/* =========================================================================
   CRISP BRAND SOCIAL ICONS (White SVGs matching reference image exactly)
   ========================================================================= */
const FacebookIcon = ({ size = 13, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ display: 'block' }}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterBirdIcon = ({ size = 13, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ display: 'block' }}
  >
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
  </svg>
);

const InstagramIcon = ({ size = 13, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ display: 'block' }}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YouTubeIcon = ({ size = 14, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ display: 'block' }}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const OrangeEnvelopeIcon = ({ size = 14, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fc791a"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ display: 'block', flexShrink: 0 }}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const WarningTriangleIcon = ({ size = 11, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffffff"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ display: 'block' }}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

/* =========================================================================
   NAVIGATION LINKS SPECIFICATION (Matching the exact labels from reference image)
   ========================================================================= */
const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About Us', href: '/about' },
  { id: 'events', label: 'Event', href: '/events' },
  {
    id: 'volunteers',
    label: 'Volunteers',
    href: '#team',
    dropdown: [
      { label: 'Become a Volunteer', action: 'volunteer' },
      { label: 'Our Volunteers / Team', href: '#team' },
    ],
  },
  { id: 'kathas', label: 'Kathas', href: '/kathas' },
  { id: 'gallery', label: 'Gallery', href: '/gallery' },
  {
    id: 'pages',
    label: 'Pages',
    href: '#pages',
    dropdown: [
      { label: 'News & Updates', href: '/news' },
      { label: 'Contact Us', href: '#contact' },
    ],
  },
];

/* =========================================================================
   MAIN HEADER COMPONENT
   ========================================================================= */
export default function Header({
  onOpenDonate,
  onOpenSearch,
  onOpenVolunteer,
  currentRoute = '/',
  onNavigate,
}) {
  const { cms } = useCms();
  const headerData = cms?.header || {};
  const logoSrc = headerData.logo || '/images/img_1.png';
  const actionButtonText = headerData.actionButtonText || 'The form is not published.';
  const actionButtonUrl = headerData.actionButtonUrl || '#donate';

  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileAccordion, setMobileAccordion] = useState(null);

  // Derive nav items from CMS if available (published only), else use NAV_ITEMS matching screenshot
  const rawList = (headerData.menuItems && headerData.menuItems.length > 0)
    ? headerData.menuItems.filter(item => item.status !== 'draft')
    : NAV_ITEMS;

  const activeNavList = rawList.map(item => {
    const matched = NAV_ITEMS.find(
      n => n.label.toLowerCase() === item.label.toLowerCase() || n.href === item.url || n.id === item.id
    );
    const isVolunteers = item.label.toLowerCase() === 'volunteers';
    const isPages = item.label.toLowerCase() === 'pages';
    return {
      id: item.id || (matched ? matched.id : item.label.toLowerCase().replace(/\s+/g, '-')),
      label: item.label,
      href: item.url || item.href || (matched ? matched.href : '/'),
      dropdown: matched?.dropdown || (isVolunteers ? [
        { label: 'Become a Volunteer', action: 'volunteer' },
        { label: 'Our Volunteers / Team', href: '#team' },
      ] : isPages ? [
        { label: 'News & Updates', href: '/news' },
        { label: 'Contact Us', href: '#contact' },
      ] : null)
    };
  });

  // Active navigation highlighting based on currentRoute
  const getActiveId = () => {
    if (currentRoute === '/about') return 'about';
    if (currentRoute.startsWith('/event') || currentRoute.startsWith('/events')) return 'events';
    if (currentRoute.startsWith('/kathas') || currentRoute.includes('spiritual-discourses-kathas')) return 'kathas';
    if (currentRoute === '/gallery' || currentRoute.startsWith('/gallery')) return 'gallery';
    if (currentRoute === '/news' || currentRoute.startsWith('/news') || currentRoute.startsWith('/blog')) return 'pages';
    return 'home';
  };

  const activeNavId = getActiveId();

  // Scroll listener for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (e, item) => {
    if (e && e.preventDefault) e.preventDefault();
    setMobileMenuOpen(false);
    setOpenDropdown(null);

    if (item.action === 'volunteer' && onOpenVolunteer) {
      onOpenVolunteer();
      return;
    }

    const href = item.href || '/';

    if (href.startsWith('#')) {
      if (currentRoute !== '/') {
        if (onNavigate) onNavigate('/');
        setTimeout(() => {
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (onNavigate) {
      onNavigate(href);
    } else {
      window.history.pushState({}, '', href);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  const toggleAccordion = (id) => {
    setMobileAccordion((prev) => (prev === id ? null : id));
  };

  const socialLinks = websiteData?.general?.socialLinks || {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
  };

  return (
    <>
      <header
        className={`site-header ${isSticky ? 'is-sticky' : ''}`}
        style={{
          width: '100%',
          position: isSticky ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: '#ffffff',
          boxShadow: isSticky ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
          transition: 'box-shadow 0.25s ease',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        }}
      >
        {/* 
          =====================================================================
          SIGNATURE CURVED ORANGE LOGO STADIUM TAB
          - Spans continuous height across both Top Bar (38px) and Navbar (74px)
          - Total height = 112px (Sticky = 68px)
          - Left: 0 (anchored to screen edge)
          - Outer translucent rim: opacity 0.36, extending 10px beyond inner solid pill
          =====================================================================
        */}
        <div
          className="header-logo-tab-wrapper"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* Outer Translucent Orange Crescent Rim (Opacity 0.36) */}
          <div
            className="header-logo-rim"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: isSticky ? '206px' : '230px',
              backgroundColor: '#fc791a',
              opacity: 0.36,
              borderRadius: '0 100px 100px 0',
              transition: 'width 0.25s ease',
            }}
          />

          {/* Inner Solid Orange Pill Shape */}
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, { href: '/' })}
            className="header-orange-logo-tab"
            style={{
              position: 'relative',
              left: 0,
              top: 0,
              bottom: 0,
              width: isSticky ? '196px' : '220px',
              height: '100%',
              backgroundColor: '#fc791a',
              borderRadius: '0 100px 100px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: '12px',
              paddingRight: '22px',
              textDecoration: 'none',
              cursor: 'pointer',
              pointerEvents: 'auto',
              boxShadow: '0 4px 18px rgba(252, 121, 26, 0.25)',
              transition: 'width 0.25s ease',
            }}
            title="HH Pujya Acharya Swami Shri Abhaydas Ji Maharaj"
          >
            <img
              src={logoSrc}
              alt="HH Pujya Acharya Swami Shri Abhaydas Ji Maharaj"
              style={{
                maxHeight: isSticky ? '44px' : '52px',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                display: 'block',
                transition: 'max-height 0.25s ease',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.12))',
              }}
              onError={(e) => {
                if (!e.target.dataset.triedFallback) {
                  e.target.dataset.triedFallback = 'true';
                  e.target.src = '/images/logo_white.png';
                }
              }}
            />
          </a>
        </div>

        {/* 
          =====================================================================
          1. DARK TOP BAR (Deep Forest Green #0e261f, Height: 38px)
          - Left: HelpLine Number: +91 8696298489, +919509587824 | ✉ info@shreeabhaydas.com
          - Right: Signature Orange "Follow Us:" Badge with layered outer rim
          =====================================================================
        */}
        {!isSticky && (
          <div
            className="header-top-bar"
            style={{
              backgroundColor: '#0e261f',
              color: '#ffffff',
              height: '38px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              position: 'relative',
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div
              className="header-top-bar-inner"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%',
                paddingLeft: '238px', // Starts directly after the orange logo curve
                paddingRight: '0px',
              }}
            >
              {/* Left Section: HelpLine Number & Email Address (Desktop) */}
              <div
                className="d-none d-lg-flex"
                style={{
                  alignItems: 'center',
                  fontSize: '12.5px',
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                }}
              >
                {/* Helpline */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontWeight: '700', color: '#ffffff' }}>HelpLine Number:</span>
                  <a
                    href="tel:+918696298489"
                    style={{ color: '#ffffff', fontWeight: '600', textDecoration: 'none' }}
                  >
                    +91 8696298489
                  </a>
                  <span style={{ color: '#ffffff' }}>,</span>
                  <a
                    href="tel:+919509587824"
                    style={{ color: '#ffffff', fontWeight: '600', textDecoration: 'none' }}
                  >
                    +919509587824
                  </a>
                </div>

                {/* Thin Vertical Divider */}
                <span style={{ color: 'rgba(255,255,255,0.25)', margin: '0 15px', fontWeight: '300' }}>
                  |
                </span>

                {/* Email with Orange Envelope Icon */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                  <OrangeEnvelopeIcon size={14} />
                  <a
                    href="mailto:info@shreeabhaydas.com"
                    style={{ color: '#ffffff', fontWeight: '500', textDecoration: 'none' }}
                  >
                    info@shreeabhaydas.com
                  </a>
                </div>
              </div>

              {/* Right Section: Signature Orange Follow Us Pill Badge */}
              <div
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {/* Desktop: Orange Pill with Layered Outer Rim */}
                <div
                  className="d-none d-xl-flex"
                  style={{
                    position: 'relative',
                    alignItems: 'center',
                  }}
                >
                  {/* Outer Translucent Left Rim (Opacity 0.36) */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-8px',
                      top: 0,
                      bottom: 0,
                      width: '24px',
                      backgroundColor: '#fc791a',
                      opacity: 0.36,
                      borderRadius: '20px 0 0 20px',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Inner Solid Orange Pill */}
                  <div
                    style={{
                      position: 'relative',
                      backgroundColor: '#fc791a',
                      color: '#ffffff',
                      height: '38px',
                      paddingLeft: '16px',
                      paddingRight: '22px',
                      borderRadius: '20px 0 0 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      zIndex: 1,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        letterSpacing: '0.2px',
                        whiteSpace: 'nowrap',
                        color: '#ffffff',
                      }}
                    >
                      Follow Us:
                    </span>

                    {/* Pure White Social Icons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                      <a
                        href={socialLinks.facebook}
                        target="_blank"
                        rel="noreferrer"
                        title="Facebook"
                        style={{ color: '#ffffff', display: 'flex', alignItems: 'center', opacity: 0.95 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.95')}
                      >
                        <FacebookIcon size={13} />
                      </a>
                      <a
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noreferrer"
                        title="Twitter"
                        style={{ color: '#ffffff', display: 'flex', alignItems: 'center', opacity: 0.95 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.95')}
                      >
                        <TwitterBirdIcon size={13} />
                      </a>
                      <a
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noreferrer"
                        title="Instagram"
                        style={{ color: '#ffffff', display: 'flex', alignItems: 'center', opacity: 0.95 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.95')}
                      >
                        <InstagramIcon size={13} />
                      </a>
                      <a
                        href={socialLinks.youtube}
                        target="_blank"
                        rel="noreferrer"
                        title="YouTube"
                        style={{ color: '#ffffff', display: 'flex', alignItems: 'center', opacity: 0.95 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.95')}
                      >
                        <YouTubeIcon size={14} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Mobile & Tablet: Pure White Social Icons on Dark Bar */}
                <div
                  className="d-flex d-xl-none"
                  style={{
                    alignItems: 'center',
                    gap: '14px',
                    paddingRight: '6px',
                  }}
                >
                  <a href={socialLinks.facebook} target="_blank" rel="noreferrer" title="Facebook" style={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}>
                    <FacebookIcon size={13} />
                  </a>
                  <a href={socialLinks.twitter} target="_blank" rel="noreferrer" title="Twitter" style={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}>
                    <TwitterBirdIcon size={13} />
                  </a>
                  <a href={socialLinks.instagram} target="_blank" rel="noreferrer" title="Instagram" style={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}>
                    <InstagramIcon size={13} />
                  </a>
                  <a href={socialLinks.youtube} target="_blank" rel="noreferrer" title="YouTube" style={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}>
                    <YouTubeIcon size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 
          =====================================================================
          2. MAIN NAVBAR BAR (White #ffffff, Height: 74px / Sticky: 68px)
          - Left: Nav Links (Home, About Us, Event, Volunteers, Kathas, Gallery, Pages)
          - Right: Search Magnifying Glass + Notice Box ("The form is not published.")
          =====================================================================
        */}
        <div
          className="header-main-navbar"
          style={{
            height: isSticky ? '68px' : '74px',
            backgroundColor: '#ffffff',
            position: 'relative',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            transition: 'height 0.25s ease',
          }}
        >
          <div
            className="header-main-navbar-inner"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%',
              paddingLeft: isSticky ? '218px' : '238px', // Directly alongside the curved orange tab
              paddingRight: '24px',
            }}
          >
            {/* Mobile / Tablet Green Hamburger Button (Directly beside the orange logo tab) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation"
              className="header-mobile-hamburger-btn d-flex d-xl-none"
              style={{
                background: 'transparent',
                border: 'none',
                padding: '6px 2px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: '4.8px',
                outline: 'none',
                boxShadow: 'none',
              }}
            >
              <span style={{ width: '25px', height: '2.8px', backgroundColor: '#02A95C', borderRadius: '3px', display: 'block' }} />
              <span style={{ width: '25px', height: '2.8px', backgroundColor: '#02A95C', borderRadius: '3px', display: 'block' }} />
              <span style={{ width: '25px', height: '2.8px', backgroundColor: '#02A95C', borderRadius: '3px', display: 'block' }} />
            </button>

            {/* Desktop Navigation Links (>= 1150px) */}
            <nav
              className="d-none d-xl-flex"
              style={{
                alignItems: 'center',
                gap: '28px',
                height: '100%',
              }}
            >
              {activeNavList.map((item) => {
                const hasDropdown = Boolean(item.dropdown);
                const isActive = activeNavId === item.id;
                const isOpen = openDropdown === item.id;

                return (
                  <div
                    key={item.id}
                    style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={() => hasDropdown && setOpenDropdown(item.id)}
                    onMouseLeave={() => hasDropdown && setOpenDropdown(null)}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => {
                        if (hasDropdown) {
                          e.preventDefault();
                          setOpenDropdown(isOpen ? null : item.id);
                        } else {
                          handleLinkClick(e, item);
                        }
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: isActive ? '#fc791a' : '#1f2937',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        padding: '6px 0',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#fc791a')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? '#fc791a' : '#1f2937')}
                    >
                      {item.label}
                      {hasDropdown && (
                        <ChevronDown
                          size={13}
                          strokeWidth={2.5}
                          style={{
                            color: '#6b7280',
                            transition: 'transform 0.2s ease, color 0.2s ease',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      )}
                    </a>

                    {/* Dropdown Menu UI */}
                    {hasDropdown && isOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% - 6px)',
                          left: 0,
                          backgroundColor: '#ffffff',
                          boxShadow: '0 10px 28px rgba(0,0,0,0.12)',
                          borderRadius: '8px',
                          padding: '6px 0',
                          minWidth: '200px',
                          zIndex: 1000,
                          border: '1px solid #f1f5f9',
                          animation: 'fadeIn 0.15s ease',
                        }}
                      >
                        {item.dropdown.map((sub, idx) => (
                          <a
                            key={idx}
                            href={sub.href || '#'}
                            onClick={(e) => handleLinkClick(e, sub)}
                            style={{
                              display: 'block',
                              padding: '10px 18px',
                              color: '#334155',
                              fontSize: '14px',
                              fontWeight: '600',
                              textDecoration: 'none',
                              transition: 'background-color 0.15s, color 0.15s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#fff7ed';
                              e.currentTarget.style.color = '#fc791a';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#334155';
                            }}
                          >
                            {sub.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* 
              ---------------------------------------------------------------
              RIGHT SECTION:
              - Desktop: Search Button + Notice Box ("The form is not published.")
              - Mobile: 3 Green Bars Hamburger Button + Search Button
              ---------------------------------------------------------------
            */}
            <div
              className="header-right-group"
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              {/* Desktop Search Button */}
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label="Search"
                className="d-none d-xl-flex"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#1f2937',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'color 0.2s ease, transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fc791a';
                  e.currentTarget.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#1f2937';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Search size={19} strokeWidth={2.1} />
              </button>

              {/* Dynamic Desktop Action Button or Notice Box (Matching Screenshot) */}
              {actionButtonText === 'The form is not published.' ? (
                <div
                  onClick={() => onOpenDonate && onOpenDonate()}
                  title="The form is not published."
                  className="d-none d-xl-flex"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '38px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    paddingRight: '16px',
                    cursor: 'default',
                    position: 'relative',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Left Vertical Amber Accent Line with Centered Warning Triangle Badge */}
                  <div
                    style={{
                      position: 'relative',
                      height: '100%',
                      width: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        bottom: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '2.5px',
                        backgroundColor: '#ffba00',
                        borderRadius: '1px',
                      }}
                    />
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#ffba00',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 4px rgba(255, 186, 0, 0.4)',
                      }}
                    >
                      <WarningTriangleIcon size={11} />
                    </div>
                  </div>
                  <span
                    style={{
                      color: '#556372',
                      fontSize: '13.5px',
                      fontWeight: '500',
                      marginLeft: '8px',
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.1px',
                      userSelect: 'none',
                    }}
                  >
                    The form is not published.
                  </span>
                </div>
              ) : (
                <a
                  href={actionButtonUrl}
                  onClick={(e) => {
                    if (actionButtonUrl.includes('donate')) {
                      e.preventDefault();
                      onOpenDonate && onOpenDonate();
                    } else if (actionButtonUrl.startsWith('#')) {
                      e.preventDefault();
                      const el = document.querySelector(actionButtonUrl);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    } else if (onNavigate && !actionButtonUrl.startsWith('http')) {
                      e.preventDefault();
                      onNavigate(actionButtonUrl);
                    }
                  }}
                  className="d-none d-xl-flex"
                  style={{
                    backgroundColor: '#fc791a',
                    color: '#ffffff',
                    height: '38px',
                    padding: '0 20px',
                    borderRadius: '4px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(252, 121, 26, 0.28)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e0600a';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fc791a';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  {actionButtonText}
                </a>
              )}

              {/* Mobile Search Button (Dark Slate matching reference screenshot) */}
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label="Search"
                className="header-mobile-search-btn d-flex d-xl-none"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#374151',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none',
                  borderRadius: '50%',
                  transition: 'opacity 0.2s',
                }}
              >
                <Search size={20} strokeWidth={2} color="#374151" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent layout shift when header fixes to top in sticky state */}
      {isSticky && <div className="header-sticky-spacer" style={{ width: '100%', height: '112px' }} />}

      {/* 
        =====================================================================
        MOBILE SLIDE-IN SIDEBAR MENU (Drawer)
        =====================================================================
      */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                zIndex: 999998,
              }}
            />

            {/* Slide-in White Panel */}
            <motion.div
              key="mobile-drawer-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '88vw',
                maxWidth: '380px',
                backgroundColor: '#ffffff',
                zIndex: 999999,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
              }}
            >
              {/* Drawer Header: Logo on left, distinct Close "X" button on right */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: '#ffffff',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    backgroundColor: '#fc791a',
                    padding: '8px 18px',
                    borderRadius: '0 0 24px 0',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={logoSrc}
                    alt="Logo"
                    style={{ maxHeight: '38px', width: 'auto', display: 'block' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  style={{
                    background: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1f2937',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <X size={22} strokeWidth={2.4} />
                </button>
              </div>

              {/* Navigation Items (Stacked with accordion dropdowns) */}
              <div style={{ flex: 1, padding: '8px 0' }}>
                {activeNavList.map((item) => {
                  const hasDropdown = Boolean(item.dropdown);
                  const isExpanded = mobileAccordion === item.id;
                  const isActive = activeNavId === item.id;

                  return (
                    <div key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {hasDropdown ? (
                        <div>
                          <div
                            onClick={() => toggleAccordion(item.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '16px 24px',
                              cursor: 'pointer',
                              userSelect: 'none',
                              backgroundColor: isExpanded ? '#f8fafc' : 'transparent',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: isActive ? '#fc791a' : '#1f2937',
                              }}
                            >
                              {item.label}
                            </span>
                            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}>
                              {isExpanded ? <Minus size={18} /> : <Plus size={18} />}
                            </span>
                          </div>

                          {/* Accordion Sub-links */}
                          {isExpanded && (
                            <div style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                              {item.dropdown.map((sub, i) => (
                                <a
                                  key={i}
                                  href={sub.href || '#'}
                                  onClick={(e) => handleLinkClick(e, sub)}
                                  style={{
                                    display: 'block',
                                    padding: '12px 24px 12px 38px',
                                    fontSize: '14.5px',
                                    fontWeight: '500',
                                    color: '#475569',
                                    textDecoration: 'none',
                                    borderBottom: i < item.dropdown.length - 1 ? '1px solid #edf2f7' : 'none',
                                  }}
                                >
                                  • {sub.label}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <a
                          href={item.href}
                          onClick={(e) => handleLinkClick(e, item)}
                          style={{
                            display: 'block',
                            padding: '16px 24px',
                            fontSize: '16px',
                            fontWeight: isActive ? '700' : '600',
                            color: isActive ? '#fc791a' : '#1f2937',
                            textDecoration: 'none',
                            backgroundColor: isActive ? '#fff7ed' : 'transparent',
                          }}
                        >
                          {item.label}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Drawer Footer: Helpline & Social Icons */}
              <div
                style={{
                  padding: '20px',
                  borderTop: '1px solid #f1f5f9',
                  backgroundColor: '#f8fafc',
                  marginTop: 'auto',
                }}
              >
                {/* Dynamic Mobile Action Button / Notice Box */}
                {actionButtonText === 'The form is not published.' ? (
                  <div
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenDonate) onOpenDonate();
                    }}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '16px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#ffba00',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <WarningTriangleIcon size={11} />
                    </div>
                    <span style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>
                      The form is not published.
                    </span>
                  </div>
                ) : (
                  <a
                    href={actionButtonUrl}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      if (actionButtonUrl.includes('donate')) {
                        e.preventDefault();
                        onOpenDonate && onOpenDonate();
                      } else if (actionButtonUrl.startsWith('#')) {
                        e.preventDefault();
                        const el = document.querySelector(actionButtonUrl);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      } else if (onNavigate && !actionButtonUrl.startsWith('http')) {
                        e.preventDefault();
                        onNavigate(actionButtonUrl);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#fc791a',
                      color: '#ffffff',
                      padding: '12px 20px',
                      borderRadius: '6px',
                      fontWeight: '700',
                      fontSize: '15px',
                      textDecoration: 'none',
                      marginBottom: '16px',
                      boxShadow: '0 2px 8px rgba(252, 121, 26, 0.3)',
                    }}
                  >
                    {actionButtonText}
                  </a>
                )}

                {/* Helpline info */}
                <div style={{ fontSize: '12.5px', color: '#64748b', textAlign: 'center', lineHeight: '1.8' }}>
                  <div>📞 +91 8696298489, +919509587824</div>
                  <div>✉ info@shreeabhaydas.com</div>
                </div>

                {/* Social icons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '14px' }}>
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#fc791a',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FacebookIcon size={13} />
                  </a>
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#fc791a',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TwitterBirdIcon size={13} />
                  </a>
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#fc791a',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <InstagramIcon size={13} />
                  </a>
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#fc791a',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <YouTubeIcon size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
