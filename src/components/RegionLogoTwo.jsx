import React from 'react';
import './RegionLogoTwo.css';

/**
 * RegionLogoTwo Component
 * Rebuilt from live element on Shree Abhay Das Ji Maharaj (https://shreeabhaydas.com/)
 * 
 * Authoritative CSS specification:
 * - Selector: .elementor-element.region-logo-two
 * - Anatomy: 227.04px × 127.6px (rendered box size)
 * - Tokens: --donatm-font-sans-serif, --height, --width
 * - Pseudo-elements: ::before (w: 482.038px, opacity: 0.36) and ::after (w: 472.038px, opacity: 1.0)
 *   curved with border-radius: 100px extending -250px to the left to form the signature orange tab.
 */
export default function RegionLogoTwo({
  href = '/',
  logoSrc = '/images/img_1.png',
  alt = 'HH Pujya Acharya Swami Shri Abhaydas Ji Maharaj',
  onNavigate,
  className = '',
  style = {}
}) {
  const handleClick = (e) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <div
      className={`elementor-element elementor-element-fe2a1f8 e-con-full region-logo-two e-flex e-con e-child ${className}`}
      data-id="fe2a1f8"
      data-element_type="container"
      data-e-type="container"
      data-settings='{"background_background":"classic"}'
      style={style}
    >
      <div
        className="elementor-element elementor-element-fd3cae6 logo-one elementor-widget elementor-widget-gva-logo"
        data-id="fd3cae6"
        data-element_type="widget"
        data-e-type="widget"
        data-widget_type="gva-logo.default"
      >
        <div className="elementor-widget-container">
          <div className="gva-element-gva-logo gva-element">
            <div className="gsc-logo text-left">
              <a
                className="site-branding-logo"
                href={href}
                title="Home"
                rel="Home"
                onClick={handleClick}
              >
                <img
                  src={logoSrc}
                  alt={alt}
                  onError={(e) => {
                    // Fallback to secondary asset if primary fails
                    if (!e.target.dataset.triedFallback) {
                      e.target.dataset.triedFallback = 'true';
                      e.target.src = '/images/logo_white.png';
                    }
                  }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
