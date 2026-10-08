import React, { Component } from 'react';
import { CmsContext } from '../../context/CmsContext';
import HeroSlider from '../../components/HeroSlider';
import HeroVisualEditor from './HeroVisualEditor';
import AboutSection from '../../components/AboutSection';
import SpiritualKathas from '../../components/SpiritualKathas';
import CampaignsSection from '../../components/CampaignsSection';
import GallerySection from '../../components/GallerySection';
import VideoSection from '../../components/VideoSection';
import EventsSection from '../../components/EventsSection';
import NewsSection from '../../components/NewsSection';
import TeamSection from '../../components/TeamSection';
import ContactBar from '../../components/ContactBar';
import Footer from '../../components/Footer';

// Safe Error Boundary to prevent admin crash on invalid input during typing
class PreviewErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Preview render error caught:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.sectionId !== this.props.sectionId || prevProps.formData !== this.props.formData) {
      if (this.state.hasError) {
        this.setState({ hasError: false, error: null });
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '30px',
          textAlign: 'center',
          backgroundColor: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: '12px',
          color: '#9f1239'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '700' }}>
            Preview Temporarily Unavailable
          </h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#be123c' }}>
            {this.state.error?.message || 'Please check the values entered in the form fields.'}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function CmsSectionPreview({
  sectionId,
  formData,
  updateSection,
  viewport = 'desktop',
  onNotify
}) {
  const handlePreviewClick = (e) => {
    const anchor = e.target.closest('a');
    if (anchor) {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      onNotify?.(`Preview Link clicked: ${href || '#'}`);
    }
  };

  const getViewportStyle = () => {
    if (viewport === 'mobile') {
      return {
        width: '100%',
        maxWidth: '390px',
        margin: '20px auto',
        backgroundColor: '#ffffff',
        border: '10px solid #1e293b',
        borderRadius: '36px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        position: 'relative'
      };
    }
    if (viewport === 'tablet') {
      return {
        width: '100%',
        maxWidth: '768px',
        margin: '20px auto',
        backgroundColor: '#ffffff',
        border: '2px solid #cbd5e1',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        position: 'relative'
      };
    }
    return {
      width: '100%',
      maxWidth: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      overflow: 'hidden',
      position: 'relative'
    };
  };

  const renderSectionContent = () => {
    switch (sectionId) {
      case 'hero':
        return (
          <HeroVisualEditor
            formData={formData}
            updateSection={updateSection}
            viewport={viewport}
            onNotify={onNotify}
          />
        );
      case 'about':
        return (
          <AboutSection
            onOpenDonate={() => onNotify?.('Preview: Donation popup opened')}
            onOpenVideo={(id) => onNotify?.(`Preview: Video player (${id}) opened`)}
            onNavigate={(url) => onNotify?.(`Preview: Navigate to ${url}`)}
          />
        );
      case 'kathas':
        return (
          <SpiritualKathas
            onOpenVideo={(id) => onNotify?.(`Preview: Video player (${id}) opened`)}
            onNavigate={(url) => onNotify?.(`Preview: Navigate to ${url}`)}
          />
        );
      case 'donations':
        return (
          <CampaignsSection
            onOpenDonate={() => onNotify?.('Preview: Donation popup opened')}
          />
        );
      case 'gallery':
        return (
          <GallerySection
            onOpenLightbox={() => onNotify?.('Preview: Gallery lightbox opened')}
            onNavigate={(url) => onNotify?.(`Preview: Navigate to ${url}`)}
          />
        );
      case 'recentKatha':
        return (
          <VideoSection
            onOpenVideo={(id) => onNotify?.(`Preview: Video player (${id}) opened`)}
          />
        );
      case 'events':
        return (
          <EventsSection
            onOpenVolunteer={() => onNotify?.('Preview: Volunteer/RSVP opened')}
            onNavigate={(url) => onNotify?.(`Preview: Navigate to ${url}`)}
          />
        );
      case 'news':
        return (
          <NewsSection
            onNavigate={(url) => onNotify?.(`Preview: Read article (${url})`)}
          />
        );
      case 'testimonials':
        return <TeamSection />;
      case 'contact':
        return <ContactBar />;
      case 'footer':
        return (
          <Footer
            onNavigate={(url) => onNotify?.(`Preview: Navigate to ${url}`)}
          />
        );
      case 'all':
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <HeroVisualEditor
              formData={formData}
              updateSection={updateSection}
              viewport={viewport}
              onNotify={onNotify}
            />
            <AboutSection
              onOpenDonate={() => onNotify?.('Preview: Donate')}
              onOpenVideo={() => onNotify?.('Preview: Video')}
              onNavigate={(u) => onNotify?.(`Preview: ${u}`)}
            />
            <SpiritualKathas
              onOpenVideo={() => onNotify?.('Preview: Video')}
              onNavigate={(u) => onNotify?.(`Preview: ${u}`)}
            />
            <CampaignsSection onOpenDonate={() => onNotify?.('Preview: Donate')} />
            <GallerySection
              onOpenLightbox={() => onNotify?.('Preview: Lightbox')}
              onNavigate={(u) => onNotify?.(`Preview: ${u}`)}
            />
            <VideoSection onOpenVideo={() => onNotify?.('Preview: Video')} />
            <EventsSection
              onOpenVolunteer={() => onNotify?.('Preview: Volunteer')}
              onNavigate={(u) => onNotify?.(`Preview: ${u}`)}
            />
            <NewsSection onNavigate={(u) => onNotify?.(`Preview: ${u}`)} />
            <TeamSection />
            <ContactBar />
            <Footer onNavigate={(u) => onNotify?.(`Preview: ${u}`)} />
          </div>
        );
      default:
        return (
          <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
            Select a section to preview
          </div>
        );
    }
  };

  return (
    <div
      onClickCapture={handlePreviewClick}
      className="cms-preview-isolation-wrap"
      style={{
        width: '100%',
        backgroundColor: '#f8fafc',
        padding: viewport === 'desktop' ? '0' : '20px',
        boxSizing: 'border-box'
      }}
    >
      <div style={getViewportStyle()}>
        {/* Mobile speaker notch decorative bar */}
        {viewport === 'mobile' && (
          <div style={{
            height: '24px',
            backgroundColor: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '50px',
              height: '4px',
              backgroundColor: '#475569',
              borderRadius: '2px'
            }} />
          </div>
        )}

        <PreviewErrorBoundary sectionId={sectionId} formData={formData}>
          <CmsContext.Provider
            value={{
              cms: formData,
              loading: false,
              updateCms: () => {},
              saveCms: async () => {},
              resetDefaults: async () => {}
            }}
          >
            {renderSectionContent()}
          </CmsContext.Provider>
        </PreviewErrorBoundary>
      </div>
    </div>
  );
}
