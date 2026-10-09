import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './index.css';
import './mobile-home.css';
import App from './App.jsx';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Shree Abhaydas Portal – Caught Unhandled Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif",
            backgroundColor: '#fffaf3',
            color: '#1e293b',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              background: '#ffffff',
              borderRadius: '20px',
              padding: '40px 32px',
              boxShadow: '0 25px 50px -12px rgba(252, 121, 26, 0.15)',
              border: '1px solid #fed7aa'
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                margin: '0 auto 20px',
                background: '#ffedd5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px'
              }}
            >
              🕉️
            </div>

            <h1
              style={{
                fontSize: '22px',
                fontWeight: '800',
                marginBottom: '10px',
                color: '#122f2a'
              }}
            >
              Shree Abhay Das Ji Maharaj
            </h1>

            <p
              style={{
                fontSize: '14px',
                color: '#64748b',
                marginBottom: '28px',
                lineHeight: '1.6'
              }}
            >
              A connection or loading hiccup occurred while loading this page. Click below to refresh or return to the main homepage.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  background: 'linear-gradient(135deg, #fc791a, #ea580c)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 26px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(252, 121, 26, 0.35)',
                  transition: 'transform 0.15s'
                }}
              >
                Reload Page
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  background: '#043424',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 26px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s'
                }}
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </StrictMode>
);
