import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const POPULAR_DESTINATIONS = [
  { label: 'Goa', icon: 'fa-solid fa-umbrella-beach' },
  { label: 'Malibu', icon: 'fa-solid fa-water' },
  { label: 'Paris', icon: 'fa-solid fa-landmark' },
  { label: 'New York', icon: 'fa-solid fa-city' },
  { label: 'Aspen', icon: 'fa-solid fa-person-skiing' },
  { label: 'Florence', icon: 'fa-solid fa-palette' },
  { label: 'Tokyo', icon: 'fa-solid fa-torii-gate' },
  { label: 'Bali', icon: 'fa-solid fa-sun' }
];

const REGIONS = [
  { label: "I'm flexible", icon: "fa-solid fa-map-location-dot", val: "" },
  { label: "Europe", icon: "fa-solid fa-landmark", val: "Europe" },
  { label: "United States", icon: "fa-solid fa-flag-usa", val: "United States" },
  { label: "Italy", icon: "fa-solid fa-wine-glass", val: "Italy" },
  { label: "India", icon: "fa-solid fa-sun", val: "India" },
  { label: "Mexico", icon: "fa-solid fa-umbrella-beach", val: "Mexico" },
];

export default function Navbar({ searchQuery, setSearchQuery }) {
  const toast = useToast();
  const { user, logout, openAuthModal } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on outside click or touch
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Close search, sheet, and dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setDropdownOpen(false);
        setMobileSheetOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto focus mobile search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSearchOpen(false);
    navigate(`/?search=${encodeURIComponent(searchQuery || '')}`);
  };

  const handleDestinationClick = (dest) => {
    setSearchQuery(dest);
    setSearchOpen(false);
    navigate(`/?search=${encodeURIComponent(dest)}`);
  };

  const handleRegionClick = (region) => {
    setSearchQuery(region);
    setSearchOpen(false);
    navigate(`/?search=${encodeURIComponent(region)}`);
  };

  const handleHostClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setDropdownOpen(false);
    if (!user) {
      openAuthModal('login', '/listings/new');
    } else {
      navigate('/listings/new');
    }
  };

  const renderDropdownMenu = () => (
    <div className="airbnb-dropdown-menu" role="menu">
      {user ? (
        <>
          <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #ebebeb' }}>
            <div style={{ fontSize: '0.75rem', color: '#717171' }}>Signed in as</div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#222' }}>{user.username}</div>
            {user.email && <div style={{ fontSize: '0.78rem', color: '#717171' }}>{user.email}</div>}
          </div>
          <Link
            to="/listings/new"
            className="dropdown-link bold"
            onClick={() => setDropdownOpen(false)}
          >
            <i className="fa-solid fa-plus" style={{ color: '#ff385c' }}></i>
            Host your home
          </Link>
          <div className="dropdown-separator"></div>
          <button
            type="button"
            className="dropdown-link"
            onClick={() => {
              logout();
              setDropdownOpen(false);
              toast.logout();
            }}
          >
            <i className="fa-solid fa-arrow-right-from-bracket" style={{ color: '#717171' }}></i>
            Log out
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className="dropdown-link bold"
            onClick={() => {
              openAuthModal('signup');
              setDropdownOpen(false);
            }}
          >
            <i className="fa-solid fa-user-plus" style={{ color: '#ff385c' }}></i>
            Sign up
          </button>
          <button
            type="button"
            className="dropdown-link"
            onClick={() => {
              openAuthModal('login');
              setDropdownOpen(false);
            }}
          >
            <i className="fa-solid fa-arrow-right-to-bracket" style={{ color: '#222' }}></i>
            Log in
          </button>
          <div className="dropdown-separator"></div>
          <button
            type="button"
            className="dropdown-link"
            onClick={() => {
              handleHostClick();
            }}
          >
            <i className="fa-solid fa-house" style={{ color: '#ff385c' }}></i>
            Host your home
          </button>
          <button
            type="button"
            className="dropdown-link"
            onClick={() => {
              toast.info('Our 24/7 Wanderlust Support Team is available at support@wanderlust.com', 'Help Centre 💬');
              setDropdownOpen(false);
            }}
          >
            <i className="fa-regular fa-circle-question" style={{ color: '#717171' }}></i>
            Help Centre
          </button>
        </>
      )}
    </div>
  );

  return (
    <>
      <header className="airbnb-header">
        {/* DESKTOP NAVBAR (>= 769px) */}
        <div className="airbnb-nav-container desktop-nav-wrapper">
          {/* Brand Logo */}
          <Link to="/" className="airbnb-brand" aria-label="Wanderlust Home">
            <i className="fa-regular fa-compass"></i>
            <span className="brand-text">Wanderlust</span>
          </Link>

          {/* Desktop 3-Part Search Bar */}
          <div style={{ position: 'relative' }} ref={searchRef}>
            <div
              className="airbnb-search-bar"
              onClick={() => setSearchOpen(!searchOpen)}
              role="button"
              tabIndex={0}
              aria-label="Open search drawer"
            >
              <span className="search-field-btn">
                {searchQuery || 'Anywhere'}
              </span>
              <span className="search-divider"></span>
              <span className="search-field-btn">
                Any week
              </span>
              <span className="search-divider"></span>
              <span className="search-field-btn muted">
                Add guests
              </span>
              <button
                type="button"
                className="search-search-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSearchSubmit(e);
                }}
                aria-label="Search"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>

            {/* Desktop Expanded Search Drawer */}
            {searchOpen && (
              <div className="search-expanded-drawer">
                <form onSubmit={handleSearchSubmit}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#222' }}>
                      Where to?
                    </label>
                    <input
                      type="text"
                      className="airbnb-input"
                      style={{ marginTop: '0.45rem' }}
                      placeholder="Search destinations (e.g. Goa, Malibu, Italy, New York)"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Popular suggestions */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#717171', marginBottom: '0.65rem' }}>
                      Popular destinations
                    </div>
                    <div className="search-popular-tags">
                      {POPULAR_DESTINATIONS.map((d) => (
                        <button
                          key={d.label}
                          type="button"
                          className="search-tag-chip"
                          onClick={() => handleDestinationClick(d.label)}
                        >
                          <i className={d.icon}></i>
                          <span>{d.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#222', marginTop: '1.25rem' }}>
                    Search by region
                  </div>

                  <div className="search-region-grid">
                    {REGIONS.map((r) => (
                      <div
                        key={r.label}
                        className="search-region-card"
                        onClick={() => handleRegionClick(r.val)}
                        role="button"
                        tabIndex={0}
                      >
                        <i className={r.icon}></i>
                        <span>{r.label}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.75rem' }}>
                    <button
                      type="button"
                      className="airbnb-host-btn"
                      onClick={() => {
                        setSearchQuery('');
                        navigate('/');
                        setSearchOpen(false);
                      }}
                    >
                      Clear
                    </button>
                    <button type="submit" className="airbnb-reserve-btn" style={{ padding: '0.65rem 1.5rem' }}>
                      <i className="fa-solid fa-magnifying-glass" style={{ marginRight: '6px' }}></i> Search
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Desktop Right Navigation */}
          <div className="airbnb-nav-right">
            <button
              type="button"
              onClick={handleHostClick}
              className="airbnb-host-btn header-host-btn"
            >
              Host your home
            </button>

            <button
              type="button"
              className="airbnb-globe-btn"
              onClick={() => toast.info('Wanderlust is localized for English (India) & INR (₹). Currency conversions applied automatically.', 'Region & Currency 🌐')}
              aria-label="Language & Currency"
            >
              <i className="fa-solid fa-globe"></i>
            </button>

            {/* User Menu Pill */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                type="button"
                className="airbnb-user-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen((prev) => !prev);
                }}
                aria-label="User navigation"
                aria-expanded={dropdownOpen}
              >
                <i className="fa-solid fa-bars" style={{ fontSize: '0.9rem', color: '#222' }}></i>
                <div className={`user-avatar-circle ${user ? 'active' : ''}`}>
                  {user ? (
                    user.username.charAt(0).toUpperCase()
                  ) : (
                    <i className="fa-solid fa-user" style={{ fontSize: '0.75rem' }}></i>
                  )}
                </div>
              </button>

              {dropdownOpen && renderDropdownMenu()}
            </div>
          </div>
        </div>

        {/* MOBILE NAVBAR (<= 768px) - Airbnb signature mobile header */}
        <div className="mobile-nav-wrapper">
          {/* Mobile Top Row: Logo & Back Button (Top Right User Pill Removed as requested) */}
          <div className="mobile-top-bar">
            {location.pathname !== '/' ? (
              <button
                type="button"
                className="mobile-back-nav-btn"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            ) : null}

            <Link to="/" className="airbnb-brand mobile-brand" aria-label="Wanderlust Home">
              <i className="fa-regular fa-compass"></i>
              <span className="brand-text">Wanderlust</span>
            </Link>

            {location.pathname !== '/' && <div style={{ width: '36px' }}></div>}
          </div>

          {/* Mobile Search Capsule Button - Airbnb style (shown on explore/home page) */}
          {location.pathname === '/' && (
            <div
              className="mobile-search-capsule"
              onClick={() => setSearchOpen(true)}
              role="button"
              tabIndex={0}
              aria-label="Search destinations"
            >
              <div className="mobile-search-icon-circle">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <div className="mobile-search-text">
                <div className="title">{searchQuery || 'Where to?'}</div>
                <div className="subtitle">
                  {searchQuery ? 'Tap to change destination' : 'Anywhere • Any week • Add guests'}
                </div>
              </div>
              <div className="mobile-search-filter-icon" aria-hidden="true">
                <i className="fa-solid fa-sliders"></i>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* FULL-SCREEN MOBILE SEARCH MODAL / SHEET */}
      {searchOpen && (
        <div className="mobile-search-overlay" role="dialog" aria-modal="true">
          {/* Header */}
          <div className="mobile-search-header">
            <button
              type="button"
              className="mobile-search-back-btn"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h3 className="mobile-search-title">Where to?</h3>
            {searchQuery ? (
              <button
                type="button"
                className="mobile-search-clear-text"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            ) : (
              <div style={{ width: '40px' }}></div>
            )}
          </div>

          {/* Search Body (Scrollable) */}
          <div className="mobile-search-body">
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="mobile-search-form">
              <div className="mobile-search-input-box">
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search destinations (e.g. Goa, Malibu, Paris)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="input-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear input"
                  >
                    <i className="fa-solid fa-circle-xmark"></i>
                  </button>
                )}
              </div>
            </form>

            {/* Popular Destinations Chips */}
            <div className="mobile-search-section">
              <div className="mobile-section-heading">
                <i className="fa-solid fa-fire" style={{ color: '#ff385c', marginRight: '6px' }}></i>
                Popular destinations
              </div>
              <div className="mobile-chips-cloud">
                {POPULAR_DESTINATIONS.map((d) => (
                  <button
                    key={d.label}
                    type="button"
                    className={`mobile-chip ${searchQuery.toLowerCase() === d.label.toLowerCase() ? 'active' : ''}`}
                    onClick={() => handleDestinationClick(d.label)}
                  >
                    <i className={d.icon}></i>
                    <span>{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search by Region */}
            <div className="mobile-search-section" style={{ marginTop: '0.5rem' }}>
              <div className="mobile-section-heading">
                <i className="fa-solid fa-globe" style={{ color: '#008489', marginRight: '6px' }}></i>
                Search by region
              </div>
              <div className="mobile-regions-grid">
                {REGIONS.map((r) => (
                  <div
                    key={r.label}
                    className="mobile-region-card"
                    onClick={() => handleRegionClick(r.val)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="region-icon-wrap">
                      <i className={r.icon}></i>
                    </div>
                    <span>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="mobile-search-footer">
            <button
              type="button"
              className="mobile-footer-clear-btn"
              onClick={() => {
                setSearchQuery('');
                navigate('/');
                setSearchOpen(false);
              }}
            >
              Clear all
            </button>
            <button
              type="button"
              className="mobile-footer-search-btn"
              onClick={handleSearchSubmit}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
              <span>Search</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Airbnb signature mobile experience) */}
      <nav className="airbnb-mobile-bottom-nav" aria-label="Mobile bottom navigation">
        <Link to="/" className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <i className="fa-regular fa-compass"></i>
          <span>Explore</span>
        </Link>
        <button
          type="button"
          className="mobile-nav-item"
          onClick={() => {
            setSearchOpen(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
          <span>Search</span>
        </button>
        <button
          type="button"
          className={`mobile-nav-item ${location.pathname.startsWith('/listings/new') ? 'active' : ''}`}
          onClick={handleHostClick}
        >
          <i className="fa-solid fa-house-chimney"></i>
          <span>Host home</span>
        </button>
        <button
          type="button"
          className={`mobile-nav-item ${mobileSheetOpen ? 'active' : ''}`}
          onClick={() => {
            if (!user) {
              openAuthModal('login');
            } else {
              setMobileSheetOpen(true);
            }
          }}
        >
          <div className={`mobile-nav-avatar ${user ? 'active' : ''}`}>
            {user ? user.username.charAt(0).toUpperCase() : <i className="fa-regular fa-user"></i>}
          </div>
          <span>{user ? user.username : 'Log in'}</span>
        </button>
      </nav>

      {/* MOBILE ACCOUNT ACTION SHEET (Interactive drawer for logged in users) */}
      {mobileSheetOpen && user && (
        <div className="mobile-sheet-overlay" onClick={() => setMobileSheetOpen(false)}>
          <div className="mobile-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-sheet-handle"></div>
            
            <div className="mobile-sheet-header">
              <div className="user-avatar-circle active" style={{ width: '42px', height: '42px', fontSize: '1.15rem' }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#222' }}>{user.username}</div>
                <div style={{ fontSize: '0.8rem', color: '#717171', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email || 'Wanderlust Explorer'}
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setMobileSheetOpen(false)} aria-label="Close sheet">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="mobile-sheet-actions">
              <button
                type="button"
                className="mobile-sheet-btn highlight"
                onClick={(e) => {
                  setMobileSheetOpen(false);
                  handleHostClick(e);
                }}
              >
                <i className="fa-solid fa-plus"></i>
                <span>Host your home</span>
              </button>

              <button
                type="button"
                className="mobile-sheet-btn"
                onClick={() => {
                  setMobileSheetOpen(false);
                  toast.info('Support is available 24/7 at support@wanderlust.com', 'Help & Contact');
                }}
              >
                <i className="fa-regular fa-circle-question"></i>
                <span>Help & Support</span>
              </button>

              <button
                type="button"
                className="mobile-sheet-btn danger"
                onClick={() => {
                  setMobileSheetOpen(false);
                  logout();
                  toast.logout();
                }}
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
