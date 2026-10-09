import React, { Component } from 'react';
import { CmsContext } from '../../context/CmsContext';
import HeroVisualEditor from './HeroVisualEditor';
import AboutVisualEditor from './visual/AboutVisualEditor';
import KathasVisualEditor from './visual/KathasVisualEditor';
import DonationsVisualEditor from './visual/DonationsVisualEditor';
import GalleryVisualEditor from './visual/GalleryVisualEditor';
import RecentKathaVisualEditor from './visual/RecentKathaVisualEditor';
import TestimonialsVisualEditor from './visual/TestimonialsVisualEditor';
import ContactVisualEditor from './visual/ContactVisualEditor';
import FooterVisualEditor from './visual/FooterVisualEditor';

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
  onNotify,
  activeSlideIdx,
  setActiveSlideIdx
}) {
  const handlePreviewClick = (e) => {
    const anchor = e.target.closest('a');
    if (anchor && !anchor.closest('.visual-editable-item')) {
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
            activeSlideIdx={activeSlideIdx}
            setActiveSlideIdx={setActiveSlideIdx}
          />
        );
      case 'about':
        return (
          <AboutVisualEditor
            formData={formData}
            updateSection={updateSection}
            viewport={viewport}
            onNotify={onNotify}
          />
        );
      case 'kathas':
        return (
          <KathasVisualEditor
            formData={formData}
            updateSection={updateSection}
            viewport={viewport}
            onNotify={onNotify}
          />
        );
      case 'donations':
        return (
          <DonationsVisualEditor
            formData={formData}
            updateSection={updateSection}
            viewport={viewport}
            onNotify={onNotify}
          />
        );
      case 'gallery':
        return (
          <GalleryVisualEditor
            formData={formData}
            updateSection={updateSection}
            viewport={viewport}
            onNotify={onNotify}
          />
        );
      case 'recentKatha':
        return (
          <RecentKathaVisualEditor
            formData={formData}
            updateSection={updateSection}
            viewport={viewport}
            onNotify={onNotify}
          />
        );
      case 'testimonials':
        return (
          <TestimonialsVisualEditor
            formData={formData}
            updateSection={updateSection}
            viewport={viewport}
            onNotify={onNotify}
          />
        );
      case 'contact':
        return (
          <ContactVisualEditor
            formData={formData}
            updateSection={updateSection}
            viewport={viewport}
            onNotify={onNotify}
          />
        );
      case 'footer':
        return (
          <FooterVisualEditor
            formData={formData}
            updateSection={updateSection}
            viewport={viewport}
            onNotify={onNotify}
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
            <AboutVisualEditor
              formData={formData}
              updateSection={updateSection}
              viewport={viewport}
              onNotify={onNotify}
            />
            <KathasVisualEditor
              formData={formData}
              updateSection={updateSection}
              viewport={viewport}
              onNotify={onNotify}
            />
            <DonationsVisualEditor
              formData={formData}
              updateSection={updateSection}
              viewport={viewport}
              onNotify={onNotify}
            />
            <GalleryVisualEditor
              formData={formData}
              updateSection={updateSection}
              viewport={viewport}
              onNotify={onNotify}
            />
            <RecentKathaVisualEditor
              formData={formData}
              updateSection={updateSection}
              viewport={viewport}
              onNotify={onNotify}
            />
            <TestimonialsVisualEditor
              formData={formData}
              updateSection={updateSection}
              viewport={viewport}
              onNotify={onNotify}
            />
            <ContactVisualEditor
              formData={formData}
              updateSection={updateSection}
              viewport={viewport}
              onNotify={onNotify}
            />
            <FooterVisualEditor
              formData={formData}
              updateSection={updateSection}
              viewport={viewport}
              onNotify={onNotify}
            />
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
      className="cms-preview-isolation-wrap cms-preview-outer-wrap"
      style={{
        width: '100%',
        backgroundColor: '#f8fafc',
        padding: viewport === 'desktop' ? '0' : '20px',
        boxSizing: 'border-box'
      }}
    >
      <div
        className={`cms-preview-frame ${viewport === 'mobile' ? 'is-mobile-frame' : ''}`}
        style={getViewportStyle()}
      >
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
