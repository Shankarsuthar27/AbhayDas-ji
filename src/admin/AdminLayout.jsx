import React, { useState, useEffect } from 'react';
import { useAdminAuth } from './AdminAuthContext';
import { 
  LayoutDashboard, 
  Newspaper, 
  Calendar, 
  Image as ImageIcon, 
  Globe, 
  LogOut, 
  Menu, 
  X,
  User,
  ChevronRight,
  ShieldCheck,
  Sliders,
  MoreHorizontal
} from 'lucide-react';
import './Admin.css';

export default function AdminLayout({ children, currentAdminRoute, onNavigate }) {
  const { currentUser, isAuthenticated, loading, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Strict route protection: redirect unauthenticated users to /admin
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      if (onNavigate) {
        onNavigate('/admin');
      } else {
        window.history.pushState({}, '', '/admin');
        window.dispatchEvent(new Event('popstate'));
      }
    }
  }, [isAuthenticated, loading, onNavigate]);

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner-large" />
        <p>Verifying credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      desc: 'Overview & statistics'
    },
    {
      id: 'homepage-cms',
      label: 'Homepage CMS',
      icon: Sliders,
      path: '/admin/homepage',
      desc: 'Manage all 9 homepage sections'
    },
    {
      id: 'news',
      label: 'News & Press',
      icon: Newspaper,
      path: '/admin/news',
      desc: 'Manage press & articles'
    },
    {
      id: 'events',
      label: 'Events & Yatras',
      icon: Calendar,
      path: '/admin/events',
      desc: 'Schedules & yatras'
    },
    {
      id: 'gallery',
      label: 'Photo Gallery',
      icon: ImageIcon,
      path: '/admin/gallery',
      desc: 'Upload & remove photos'
    }
  ];

  const handleNavClick = (path) => {
    setSidebarOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  const handleLogout = async () => {
    await logout();
    if (onNavigate) {
      onNavigate('/admin');
    } else {
      window.history.pushState({}, '', '/admin');
      window.dispatchEvent(new Event('popstate'));
    }
  };

  const currentItem = navItems.find((n) => currentAdminRoute.startsWith(n.path));

  return (
    <div className="admin-portal-wrapper">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Minimal Sleek Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand Banner */}
        <div className="admin-sidebar-brand">
          <div className="admin-brand-icon-box">SA</div>
          <div className="admin-brand-text">
            <h2 className="admin-brand-title">Shree Abhaydas</h2>
            <span className="admin-brand-badge">Admin Portal</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="admin-nav-list" aria-label="Admin Navigation">
          <div className="admin-nav-section-title">Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentAdminRoute === item.path ||
              (item.id === 'dashboard' && (currentAdminRoute === '/admin' || currentAdminRoute === '/wp-admin'));
            return (
              <button
                key={item.id}
                type="button"
                className={`admin-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path)}
              >
                <Icon size={18} className="admin-nav-icon" />
                <span className="admin-nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Links & Sign Out Footer */}
        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="admin-footer-btn live-site"
            onClick={() => {
              if (onNavigate) onNavigate('/');
              else {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new Event('popstate'));
              }
            }}
          >
            <Globe size={15} />
            <span>Public Website</span>
          </button>

          <button
            type="button"
            className="admin-footer-btn logout"
            onClick={handleLogout}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Menu matching template */}
      {sidebarOpen && (
        <>
          <div
            className="admin-sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="mobile-menu">
            <div className="menu-label">Navigation</div>
            {navItems.map((item) => {
              const isActive =
                currentAdminRoute === item.path ||
                (item.id === 'dashboard' && (currentAdminRoute === '/admin' || currentAdminRoute === '/wp-admin'));
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`menu-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.path)}
                >
                  {item.label}
                </button>
              );
            })}
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
              <button
                type="button"
                className="menu-item"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => {
                  setSidebarOpen(false);
                  if (onNavigate) onNavigate('/');
                  else window.open('/', '_blank');
                }}
              >
                <Globe size={15} /> Public Website
              </button>
              <button
                type="button"
                className="menu-item"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}
                onClick={handleLogout}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        {/* Exact Topbar from Screenshot */}
        <header className="topbar">
          <button
            type="button"
            className="icon-button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="brand-lockup">
            <div className="brand-mark">SA</div>
            <div>
              <div className="brand-name">Shree Abhayadas</div>
              <div className="brand-meta">Admin portal</div>
            </div>
          </div>

          <div className="status-dot" title="Connected" />

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="icon-button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-label="More options"
            >
              <MoreHorizontal size={18} />
            </button>

            {userMenuOpen && (
              <div
                className="topbar-dropdown"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '46px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--line)',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(17, 27, 49, 0.15)',
                  minWidth: '170px',
                  padding: '6px',
                  zIndex: 90,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <button
                  type="button"
                  className="menu-item"
                  style={{ padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => {
                    setUserMenuOpen(false);
                    if (onNavigate) onNavigate('/');
                    else window.open('/', '_blank');
                  }}
                >
                  <Globe size={14} /> Public Website
                </button>
                <button
                  type="button"
                  className="menu-item"
                  style={{ padding: '8px 12px', fontSize: '12px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content-body">
          {children}
        </main>
      </div>
    </div>
  );
}
