import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import AboutSection from './components/AboutSection';
import SpiritualKathas from './components/SpiritualKathas';
import CampaignsSection from './components/CampaignsSection';
import KathaTicker from './components/KathaTicker';
import GallerySection from './components/GallerySection';
import VideoSection from './components/VideoSection';
import EventsSection from './components/EventsSection';
import NewsSection from './components/NewsSection';
import TeamSection from './components/TeamSection';
import AboutPage from './pages/AboutPage';
import EventsPage from './pages/EventsPage';
import KathasPage from './pages/KathasPage';
import GalleryPage from './pages/GalleryPage';
import NewsPage from './pages/NewsPage';
import NaniBaiKaMayraPage from './pages/NaniBaiKaMayraPage';
import ShrimadBhagwatKathaPage from './pages/ShrimadBhagwatKathaPage';
import BabaRamdevJiKathaPage from './pages/BabaRamdevJiKathaPage';

import ContactBar from './components/ContactBar';
import Footer from './components/Footer';
import {
  DonationModal,
  VolunteerModal,
  VideoPlayerModal,
  SearchModal,
  LightboxModal
} from './components/Modals';

// Standalone Admin Panel Components & Auth
import { AdminAuthProvider } from './admin/AdminAuthContext';
import LoginPage from './admin/LoginPage';
import AdminLayout from './admin/AdminLayout';
import DashboardPage from './admin/DashboardPage';
import NewsAdminPage from './admin/NewsAdminPage';
import EventsAdminPage from './admin/EventsAdminPage';
import GalleryAdminPage from './admin/GalleryAdminPage';
import HomepageCmsPage from './admin/HomepageCmsPage';
import { CmsProvider } from './context/CmsContext';

// Helper to resolve and normalize routes on initial load, browser back/forward, and manual refresh
function resolveRoute(rawPath = '/', rawHash = '') {
  try {
    const p = (rawPath || '/').toLowerCase().trim();
    // Normalize trailing slashes: e.g. "/about/" -> "/about", but keep "/" as "/"
    const path = p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
    const hash = (rawHash || '').toLowerCase().trim();

    if (
      path === '/admin' ||
      path.startsWith('/admin/') ||
      path.startsWith('/admin') ||
      path === '/wp-admin' ||
      path.startsWith('/wp-admin/') ||
      path.startsWith('/wp-admin') ||
      hash === '#/admin' ||
      hash.startsWith('#/admin') ||
      hash === '#admin' ||
      hash.startsWith('#admin') ||
      hash === '#/wp-admin' ||
      hash.startsWith('#/wp-admin')
    ) {
      return path || '/admin';
    }

    if (
      path === '/kathas/nani-bai-ka-mayra' ||
      path === '/nani-bai-ka-mayra' ||
      path.startsWith('/nani-bai-ka-mayra') ||
      hash.includes('nani-bai-ka-mayra')
    ) {
      return '/kathas/nani-bai-ka-mayra';
    }

    if (
      path === '/kathas/shrimad-bhagwat-katha' ||
      path === '/shrimad-bhagwat-katha' ||
      path === '/shrimad-bhagwad-katha' ||
      path.startsWith('/shrimad-bhagwat-katha') ||
      path.startsWith('/shrimad-bhagwad-katha') ||
      hash.includes('shrimad-bhagwat-katha') ||
      hash.includes('shrimad-bhagwad-katha')
    ) {
      return '/kathas/shrimad-bhagwat-katha';
    }

    if (
      path === '/kathas/baba-ramdev-ji-katha' ||
      path === '/baba-ramdev-ji-katha' ||
      path === '/baba-ramdev-katha' ||
      path.startsWith('/baba-ramdev-ji-katha') ||
      path.startsWith('/baba-ramdev-katha') ||
      hash.includes('baba-ramdev-ji-katha') ||
      hash.includes('baba-ramdev-katha')
    ) {
      return '/kathas/baba-ramdev-ji-katha';
    }

    if (path === '/about' || path.startsWith('/about/') || hash === '#/about' || hash === '#about') {
      return '/about';
    }

    if (
      path.startsWith('/events') ||
      path.startsWith('/event') ||
      hash.startsWith('#/events') ||
      hash.startsWith('#events')
    ) {
      return path || '/events';
    }

    if (
      path === '/kathas' ||
      path.startsWith('/kathas/') ||
      path === '/spiritual-discourses-kathas' ||
      path.startsWith('/spiritual-discourses-kathas/') ||
      hash === '#/kathas' ||
      hash === '#kathas'
    ) {
      return '/kathas';
    }

    if (
      path === '/gallery' ||
      path.startsWith('/gallery/') ||
      hash === '#/gallery' ||
      hash === '#gallery'
    ) {
      return '/gallery';
    }

    if (
      path === '/news' ||
      path.startsWith('/news/') ||
      path === '/blog' ||
      path.startsWith('/blog/') ||
      hash === '#/news' ||
      hash === '#news' ||
      hash === '#/blog' ||
      hash === '#blog'
    ) {
      return path || '/news';
    }

    return '/';
  } catch (e) {
    console.warn('Error resolving route, defaulting to /:', e);
    return '/';
  }
}

export default function App() {
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [defaultCampaign, setDefaultCampaign] = useState('water-food');
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [lightboxState, setLightboxState] = useState({ images: null, index: null });

  // Route state supporting /, /about, /events, /events/:id, /kathas, /gallery, /news, /admin seamlessly
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      return resolveRoute(window.location.pathname, window.location.hash);
    }
    return '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      if (typeof window !== 'undefined') {
        setCurrentRoute(resolveRoute(window.location.pathname, window.location.hash));
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (path) => {
    try {
      window.history.pushState({}, '', path);
    } catch (e) {
      // Ignored
    }
    setCurrentRoute(resolveRoute(path));
    try {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (e) {
      // Ignored
    }
  };

  const handleOpenDonate = (campaignId = 'water-food') => {
    setDefaultCampaign(campaignId);
    setDonateModalOpen(true);
  };

  const handleOpenVolunteer = () => {
    setVolunteerModalOpen(true);
  };

  const handleOpenVideo = (videoId) => {
    setActiveVideoId(videoId);
  };

  const handleOpenLightbox = (images, index) => {
    setLightboxState({ images, index });
  };

  // ── Standalone Admin Portal Routing (/admin and legacy /wp-admin) ──
  const isAdminPortal = currentRoute.startsWith('/admin') || currentRoute.startsWith('/wp-admin');
  if (isAdminPortal) {
    const isLoginView = currentRoute === '/admin' || currentRoute === '/wp-admin';
    return (
      <AdminAuthProvider>
        <CmsProvider>
          {isLoginView ? (
            <LoginPage onNavigate={navigateTo} />
          ) : (
            <AdminLayout currentAdminRoute={currentRoute} onNavigate={navigateTo}>
              {currentRoute.includes('/homepage') ? (
                <HomepageCmsPage onNavigate={navigateTo} />
              ) : currentRoute.includes('/news') ? (
                <NewsAdminPage onNavigate={navigateTo} />
              ) : currentRoute.includes('/events') ? (
                <EventsAdminPage onNavigate={navigateTo} />
              ) : currentRoute.includes('/gallery') ? (
                <GalleryAdminPage onNavigate={navigateTo} />
              ) : (
                <DashboardPage onNavigate={navigateTo} />
              )}
            </AdminLayout>
          )}
        </CmsProvider>
      </AdminAuthProvider>
    );
  }

  return (
    <CmsProvider>
      <div className="wrapper-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      
      {/* 1. Header with Dark Green Topbar & Orange Logo Curved Tab */}
      <Header
        onOpenDonate={handleOpenDonate}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenVolunteer={handleOpenVolunteer}
        currentRoute={currentRoute}
        onNavigate={navigateTo}
      />

      <main id="wp-main-content" style={{ flex: 1 }}>
        {currentRoute === '/about' ? (
          <AboutPage
            onNavigate={navigateTo}
            onOpenDonate={handleOpenDonate}
            onOpenVolunteer={handleOpenVolunteer}
          />
        ) : currentRoute.startsWith('/events') || currentRoute.startsWith('/event') ? (
          <EventsPage
            onNavigate={navigateTo}
            selectedEventId={currentRoute.split('/').filter(Boolean)[1]}
            onSelectEvent={(slug) => navigateTo(`/events/${slug}`)}
            onOpenDonate={handleOpenDonate}
            onOpenVolunteer={handleOpenVolunteer}
          />
        ) : currentRoute === '/kathas/nani-bai-ka-mayra' || currentRoute === '/nani-bai-ka-mayra' ? (
          <NaniBaiKaMayraPage
            onNavigate={navigateTo}
            onOpenDonate={handleOpenDonate}
            onOpenVolunteer={handleOpenVolunteer}
          />
        ) : currentRoute === '/kathas/shrimad-bhagwat-katha' || currentRoute === '/shrimad-bhagwat-katha' || currentRoute === '/shrimad-bhagwad-katha' ? (
          <ShrimadBhagwatKathaPage
            onNavigate={navigateTo}
            onOpenDonate={handleOpenDonate}
            onOpenVolunteer={handleOpenVolunteer}
          />
        ) : currentRoute === '/kathas/baba-ramdev-ji-katha' || currentRoute === '/baba-ramdev-ji-katha' || currentRoute === '/baba-ramdev-katha' ? (
          <BabaRamdevJiKathaPage
            onNavigate={navigateTo}
            onOpenDonate={handleOpenDonate}
            onOpenVolunteer={handleOpenVolunteer}
          />
        ) : currentRoute === '/kathas' || currentRoute.startsWith('/kathas') || currentRoute.includes('spiritual-discourses-kathas') ? (
          <KathasPage
            onNavigate={navigateTo}
            onOpenVideo={handleOpenVideo}
          />
        ) : currentRoute === '/gallery' || currentRoute.startsWith('/gallery') ? (
          <GalleryPage
            onNavigate={navigateTo}
            onOpenLightbox={handleOpenLightbox}
          />
        ) : currentRoute === '/news' || currentRoute.startsWith('/news') || currentRoute.startsWith('/blog') ? (
          <NewsPage
            onNavigate={navigateTo}
            articleSlug={
              currentRoute.startsWith('/news/')
                ? currentRoute.replace('/news/', '')
                : currentRoute.startsWith('/blog/')
                ? currentRoute.replace('/blog/', '')
                : null
            }
          />
        ) : (
          <>
            {/* 2. Hero Section with Stage Award Presentation (img_5.jpg) */}
            <HeroSlider
              onOpenDonate={handleOpenDonate}
              onOpenVolunteer={handleOpenVolunteer}
            />

            {/* 3. About Section ("Brief Introduction" with two photo cards and floating play button) */}
            <AboutSection
              onOpenDonate={handleOpenDonate}
              onOpenVideo={handleOpenVideo}
              onNavigate={navigateTo}
            />

            {/* 4. Spiritual Katha' (3 Temple-Arched Cards) */}
            <SpiritualKathas
              onOpenVideo={handleOpenVideo}
              onNavigate={navigateTo}
            />

            {/* 5. Donation (3 Campaign Cards & Pagination Dots) */}
            <CampaignsSection
              onOpenDonate={handleOpenDonate}
            />

            {/* 6. Katha Names Ticker ("• Shrimad Bhagwad Katha • Ram Katha •") */}
            <KathaTicker onNavigate={navigateTo} />

            {/* 7. Photo Gallery Grid (5-Photo Row) */}
            <GallerySection
              onOpenLightbox={handleOpenLightbox}
              onNavigate={navigateTo}
            />

            {/* 8. Recent Katha (4 Video Cards with Red Play Buttons) */}
            <VideoSection
              onOpenVideo={handleOpenVideo}
            />

            {/* 9. Upcoming Event Schedule (Dark Green Background with Green "Events All" Button) */}
            <EventsSection
              onOpenVolunteer={handleOpenVolunteer}
              onNavigate={navigateTo}
            />

            {/* 10. Latest News And Articles (Cards with Green "View All" Button) */}
            <NewsSection onNavigate={navigateTo} />

            {/* 11. Management Team / Virtual Darshan */}
            <TeamSection />

            {/* 12. Bright Orange Contact Banner */}
            <ContactBar />
          </>
        )}
      </main>

      {/* 13. Deep Forest Green Footer */}
      <Footer
        onOpenDonate={handleOpenDonate}
        currentRoute={currentRoute}
        onNavigate={navigateTo}
      />

      {/* Global Interactive Modals */}
      <DonationModal
        isOpen={donateModalOpen}
        onClose={() => setDonateModalOpen(false)}
        defaultCampaignId={defaultCampaign}
      />

      <VolunteerModal
        isOpen={volunteerModalOpen}
        onClose={() => setVolunteerModalOpen(false)}
      />

      <VideoPlayerModal
        videoId={activeVideoId}
        onClose={() => setActiveVideoId(null)}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      <LightboxModal
        images={lightboxState.images}
        currentIndex={lightboxState.index}
        onClose={() => setLightboxState({ images: null, index: null })}
        onNavigate={(newIdx) => setLightboxState(prev => ({ ...prev, index: newIdx }))}
      />

    </div>
    </CmsProvider>
  );
}
