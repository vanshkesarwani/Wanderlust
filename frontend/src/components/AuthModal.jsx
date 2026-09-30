import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AuthModal() {
  const { authModalOpen, authMode, redirectPath, closeAuthModal, setAuthMode, login, signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && authModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  // Reset form when modal closes or mode changes
  useEffect(() => {
    setError('');
  }, [authMode, authModalOpen]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (authMode === 'login') {
        await login(username, password);
        toast.login(username);
      } else {
        await signup(username, email, password);
        toast.success('Account created successfully', 'Signed up');
      }
      // Reset form on success
      setUsername('');
      setEmail('');
      setPassword('');

      // If a destination was requested (e.g. /listings/new for 'Airbnb your home'), navigate there!
      if (redirectPath) {
        navigate(redirectPath);
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Authentication failed';
      setError(msg);
      toast.error(msg, 'Auth Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <button className="modal-close-btn" onClick={closeAuthModal} aria-label="Close modal">
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h3>{authMode === 'login' ? 'Log in to Wanderlust' : 'Sign up for Wanderlust'}</h3>
          <div style={{ width: '32px' }}></div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {redirectPath && (
            <div className="auth-notice-banner">
              <i className="fa-solid fa-house-chimney" style={{ color: '#ff385c' }}></i>
              <span>Sign in or create an account to start hosting your property on Wanderlust.</span>
            </div>
          )}

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('login');
                setError('');
              }}
            >
              Log In
            </button>
            <button
              type="button"
              className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('signup');
                setError('');
              }}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="auth-error-banner">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="on">
            <div className="form-group">
              <label htmlFor="auth-username">Username</label>
              <input
                id="auth-username"
                type="text"
                className="form-control"
                placeholder="Enter username"
                required
                autoFocus
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {authMode === 'signup' && (
              <div className="form-group">
                <label htmlFor="auth-email">Email Address</label>
                <input
                  id="auth-email"
                  type="email"
                  className="form-control"
                  placeholder="Enter email (e.g. name@example.com)"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingRight: '2.5rem' }}
                  placeholder="Enter password"
                  required
                  autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#717171',
                    fontSize: '0.9rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="primary-btn"
              style={{ width: '100%', marginTop: '0.75rem', height: '48px' }}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                  Processing...
                </>
              ) : authMode === 'login' ? (
                'Continue'
              ) : (
                'Agree and create account'
              )}
            </button>
          </form>

          {/* Switch Prompt */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: '#717171' }}>
            {authMode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setError('');
                  }}
                  style={{ color: '#222', fontWeight: 700, textDecoration: 'underline' }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setError('');
                  }}
                  style={{ color: '#222', fontWeight: 700, textDecoration: 'underline' }}
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
