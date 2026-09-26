import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ searchQuery, setSearchQuery }) {
  const { user, logout, openAuthModal } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close menus on outside click
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate(`/?search=${encodeURIComponent(searchQuery || '')}`);
  };

  const handleRegionClick = (region) => {
    setSearchQuery(region);
    setSearchOpen(false);
    navigate(`/?search=${encodeURIComponent(region)}`);
  };

  const handleHostClick = (e) => {
    if (!user) {
      e.preventDefault();
      openAuthModal('login');
    } else {
      navigate('/listings/new');
    }
  };

  return (
    <header className="airbnb-header">
      <div className="airbnb-nav-container">
        {/* Brand Logo */}
        <Link to="/" className="airbnb-brand">
          <i className="fa-regular fa-compass"></i>
          <span>Wanderlust</span>
        </Link>

        {/* Iconic 3-Part Search Bar */}
        <div style={{ position: 'relative' }} ref={searchRef}>
          <div
            className="airbnb-search-bar"
            onClick={() => setSearchOpen(!searchOpen)}
            role="button"
            tabIndex={0}
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

          {/* Expanded Search Drawer */}
          {searchOpen && (
            <div className="search-expanded-drawer">
              <form onSubmit={handleSearchSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Where to?
                  </label>
                  <input
                    type="text"
                    className="airbnb-input"
                    style={{ marginTop: '0.4rem' }}
                    placeholder="Search destinations (e.g. Goa, Malibu, Italy, New York)"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#222', marginTop: '1.25rem' }}>
                  Search by region
                </div>

                <div className="search-region-grid">
                  {[
                    { label: "I'm flexible", icon: "fa-solid fa-map-location-dot", val: "" },
                    { label: "Europe", icon: "fa-solid fa-landmark", val: "Europe" },
                    { label: "United States", icon: "fa-solid fa-flag-usa", val: "United States" },
                    { label: "Italy", icon: "fa-solid fa-wine-glass", val: "Italy" },
                    { label: "India", icon: "fa-solid fa-sun", val: "India" },
                    { label: "Mexico", icon: "fa-solid fa-umbrella-beach", val: "Mexico" },
                  ].map((r) => (
                    <div
                      key={r.label}
                      className="search-region-card"
                      onClick={() => handleRegionClick(r.val)}
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

        {/* Right Navigation */}
        <div className="airbnb-nav-right">
          <button onClick={handleHostClick} className="airbnb-host-btn">
            Airbnb your home
          </button>

          <button
            className="airbnb-globe-btn"
            onClick={() => alert('Wanderlust supports English (IN) & INR (₹).')}
            aria-label="Language & Currency"
          >
            <i className="fa-solid fa-globe"></i>
          </button>

          {/* User Menu Pill */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              className="airbnb-user-pill"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="User navigation"
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

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="airbnb-dropdown-menu">
                {user ? (
                  <>
                    <div style={{ padding: '0.65rem 1.25rem', borderBottom: '1px solid #ebebeb' }}>
                      <div style={{ fontSize: '0.75rem', color: '#717171' }}>Signed in as</div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#222' }}>{user.username}</div>
                    </div>
                    <Link
                      to="/listings/new"
                      className="dropdown-link bold"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="fa-solid fa-plus" style={{ color: '#ff385c' }}></i>
                      Airbnb your home
                    </Link>
                    <div className="dropdown-separator"></div>
                    <button
                      className="dropdown-link"
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="dropdown-link bold"
                      onClick={() => {
                        openAuthModal('signup');
                        setDropdownOpen(false);
                      }}
                    >
                      Sign up
                    </button>
                    <button
                      className="dropdown-link"
                      onClick={() => {
                        openAuthModal('login');
                        setDropdownOpen(false);
                      }}
                    >
                      Log in
                    </button>
                    <div className="dropdown-separator"></div>
                    <button
                      className="dropdown-link"
                      onClick={() => {
                        openAuthModal('login');
                        setDropdownOpen(false);
                      }}
                    >
                      Airbnb your home
                    </button>
                    <button
                      className="dropdown-link"
                      onClick={() => {
                        alert('Help Centre: Contact support@wanderlust.com');
                        setDropdownOpen(false);
                      }}
                    >
                      Help Centre
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
