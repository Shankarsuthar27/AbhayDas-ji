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
  User,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import './Admin.css';

export default function AdminLayout({ children, currentAdminRoute, onNavigate }) {
  const { currentUser, isAuthenticated, loading, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Strict route protection: redirect unauthenticated users to /wp-admin
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      if (onNavigate) {
        onNavigate('/wp-admin');
      } else {
        window.history.pushState({}, '', '/wp-admin');
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
      path: '/wp-admin/dashboard',
      desc: 'Overview & statistics'
    },
    {
      id: 'news',
      label: 'News & Press',
      icon: Newspaper,
      path: '/wp-admin/news',
      desc: 'Manage press & articles'
    },
    {
      id: 'events',
      label: 'Events & Yatras',
      icon: Calendar,
      path: '/wp-admin/events',
      desc: 'Schedules & yatras'
    },
    {
      id: 'gallery',
      label: 'Photo Gallery',
      icon: ImageIcon,
      path: '/wp-admin/gallery',
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
      onNavigate('/wp-admin');
    } else {
      window.history.pushState({}, '', '/wp-admin');
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
              (item.id === 'dashboard' && currentAdminRoute === '/wp-admin');
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

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        {/* Clean Minimal Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-hamburger-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation menu"
            >
              <Menu size={20} />
            </button>
            <div className="admin-topbar-breadcrumb">
              <span className="admin-crumb-home">Admin</span>
              <ChevronRight size={14} className="admin-crumb-sep" />
              <span className="admin-crumb-current">
                {currentItem?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-status-pill">
              <span className="admin-status-dot" />
              <span>Connected</span>
            </div>

            <div className="admin-user-pill">
              <span className="admin-user-avatar">
                <User size={13} />
              </span>
              <span className="admin-user-name">{currentUser?.username || 'admin2233'}</span>
            </div>
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
