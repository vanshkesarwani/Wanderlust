import React from 'react';

export default function Footer() {
  return (
    <footer className="airbnb-footer">
      <div className="footer-inner">
        {/* Top 4-Column Navigation */}
        <div className="footer-top-columns">
          <div className="footer-col">
            <h5>Support</h5>
            <ul>
              <li><a href="#help">Help Centre</a></li>
              <li><a href="#aircover">AirCover</a></li>
              <li><a href="#anti-discrimination">Anti-discrimination</a></li>
              <li><a href="#disability">Disability support</a></li>
              <li><a href="#cancellation">Cancellation options</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Hosting</h5>
            <ul>
              <li><a href="/listings/new">Airbnb your home</a></li>
              <li><a href="#aircover-hosts">AirCover for Hosts</a></li>
              <li><a href="#hosting-resources">Hosting resources</a></li>
              <li><a href="#community-forum">Community forum</a></li>
              <li><a href="#hosting-responsibly">Hosting responsibly</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Wanderlust</h5>
            <ul>
              <li><a href="#newsroom">Newsroom</a></li>
              <li><a href="#new-features">New features</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#investors">Investors</a></li>
              <li><a href="#emergency-stays">Emergency stays</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Destinations</h5>
            <ul>
              <li><a href="/?search=Goa">Goa rentals</a></li>
              <li><a href="/?search=Malibu">Malibu beach villas</a></li>
              <li><a href="/?search=New%20York">New York lofts</a></li>
              <li><a href="/?search=Florence">Florence luxury stays</a></li>
              <li><a href="/?search=Aspen">Aspen ski chalets</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-row">
          <div className="footer-copy-links">
            <span>&copy; {new Date().getFullYear()} Wanderlust, Inc.</span>
            <span>&bull;</span>
            <a href="#privacy">Privacy</a>
            <span>&bull;</span>
            <a href="#terms">Terms</a>
            <span>&bull;</span>
            <a href="#sitemap">Sitemap</a>
            <span>&bull;</span>
            <a href="#company-details">Company details</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <i className="fa-solid fa-globe"></i>
              <span>English (IN)</span>
            </div>
            <div style={{ fontWeight: 600 }}>
              <span>&#8377; INR</span>
            </div>
            <div className="footer-social-icons">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="fa-brands fa-square-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <i className="fa-brands fa-square-x-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="fa-brands fa-square-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
