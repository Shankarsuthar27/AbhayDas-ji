import React, { useState, useEffect } from 'react';
import { useAdminAuth } from './AdminAuthContext';
import './Admin.css';

export default function LoginPage({ onNavigate }) {
  const { login, isAuthenticated } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showLostPasswordHint, setShowLostPasswordHint] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (onNavigate) {
        onNavigate('/admin/dashboard');
      } else {
        window.history.pushState({}, '', '/admin/dashboard');
        window.dispatchEvent(new Event('popstate'));
      }
    }
  }, [isAuthenticated, onNavigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setShowLostPasswordHint(false);
    setIsLoading(true);

    try {
      await login(username, password);
      // Navigate to dashboard
      if (onNavigate) {
        onNavigate('/admin/dashboard');
      } else {
        window.history.pushState({}, '', '/admin/dashboard');
        window.dispatchEvent(new Event('popstate'));
      }
    } catch (err) {
      setErrorMessage(
        err.message ||
          'The password you entered for the username is incorrect. Please verify credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnHome = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('/');
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new Event('popstate'));
    }
  };

  return (
    <div className="wp-login-page">
      <div className="wp-login-wrap">
        {/* WordPress Logo */}
        {/* <div className="wp-login-logo">
          <a
            href="/"
            onClick={handleReturnHome}
            title="Shree Abhay Das Ji Maharaj"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              width="84"
              height="84"
              aria-label="WordPress Logo"
            >
              <path
                fill="#2271b1"
                d="M4.548 31.999c0 10.9 6.3 20.3 15.5 24.706L6.925 20.827C5.402 24.2 4.5 28 4.5 31.999z M50.531 30.614c0-3.394-1.219-5.742-2.264-7.57c-1.391-2.263-2.695-4.177-2.695-6.439c0-2.523 1.912-4.872 4.609-4.872 c0.121 0 0.2 0 0.4 0.022C45.653 7.3 39.1 4.5 32 4.548c-9.591 0-18.027 4.921-22.936 12.4 c0.645 0 1.3 0 1.8 0.033c2.871 0 7.316-0.349 7.316-0.349c1.479-0.086 1.7 2.1 0.2 2.3 c0 0-1.487 0.174-3.142 0.261l9.997 29.735l6.008-18.017l-4.276-11.718c-1.479-0.087-2.879-0.261-2.879-0.261 c-1.48-0.087-1.306-2.349 0.174-2.262c0 0 4.5 0.3 7.2 0.349c2.87 0 7.317-0.349 7.317-0.349 c1.479-0.086 1.7 2.1 0.2 2.262c0 0-1.489 0.174-3.142 0.261l9.92 29.508l2.739-9.148 C49.628 35.7 50.5 33 50.5 30.614z M32.481 34.4l-8.237 23.934c2.46 0.7 5.1 1.1 7.8 1.1 c3.197 0 6.262-0.552 9.116-1.556c-0.072-0.118-0.141-0.243-0.196-0.379L32.481 34.4z M56.088 18.8 c0.119 0.9 0.2 1.8 0.2 2.823c0 2.785-0.521 5.916-2.088 9.832l-8.385 24.242c8.161-4.758 13.65-13.6 13.65-23.728 C59.451 27.2 58.2 22.7 56.1 18.83z M32 0c-17.645 0-32 14.355-32 32C0 49.6 14.4 64 32 64s32-14.355 32-32.001 C64 14.4 49.6 0 32 0z M32 62.533c-16.835 0-30.533-13.698-30.533-30.534C1.467 15.2 15.2 1.5 32 1.5 s30.534 13.7 30.5 30.532C62.533 48.8 48.8 62.5 32 62.533z"
              />
            </svg>
          </a>
        </div> */}

        {/* Error Notice */}
        {errorMessage && (
          <div id="login_error" className="wp-login-error" role="alert">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {/* Password Recovery Hint */}
        {showLostPasswordHint && (
          <div className="wp-login-info" role="status">
            Use the assigned administrator credentials: username <strong>admin2233</strong> and password <strong>admin@2233</strong>.
          </div>
        )}

        {/* Login Form Card */}
        <div className="wp-login-form-card">
          <form
            name="loginform"
            id="loginform"
            onSubmit={handleSubmit}
            autoComplete="on"
          >
            <p className="wp-form-row">
              <label htmlFor="user_login">Username or Email Address</label>
              <input
                type="text"
                name="log"
                id="user_login"
                className="wp-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoCapitalize="off"
                autoFocus
                required
              />
            </p>

            <p className="wp-form-row">
              <label htmlFor="user_pass">Password</label>
              <span className="wp-pwd-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="pwd"
                  id="user_pass"
                  className="wp-input wp-pwd-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  spellCheck="false"
                  required
                />
                <button
                  type="button"
                  className="wp-pwd-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2271b1"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" fill="#2271b1" />
                    {showPassword && (
                      <line x1="2" y1="2" x2="22" y2="22" stroke="#2271b1" strokeWidth="2.2" />
                    )}
                  </svg>
                </button>
              </span>
            </p>

            <div className="wp-form-bottom-row">
              <label htmlFor="rememberme" className="wp-rememberme-label">
                <input
                  name="rememberme"
                  type="checkbox"
                  id="rememberme"
                  value="forever"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>

              <button
                type="submit"
                name="wp-submit"
                id="wp-submit"
                className="wp-login-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Logging In...' : 'Log In'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Navigation Links */}
        <p id="nav" className="wp-login-nav">
          <a
            href="#lost-password"
            onClick={(e) => {
              e.preventDefault();
              setShowLostPasswordHint((prev) => !prev);
            }}
          >
            Lost your password?
          </a>
        </p>

        <p id="backtoblog" className="wp-login-back">
          <a href="/" onClick={handleReturnHome}>
            ← Go to Shree Abhay Das Ji Maharaj
          </a>
        </p>
      </div>
    </div>
  );
}
