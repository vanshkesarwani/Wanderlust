import React, { useMemo } from 'react';

export default function ReservationSuccessModal({
  isOpen,
  onClose,
  listing,
  guests,
  nights,
  subtotal,
  cleaningFee,
  serviceFee,
  total,
  onShare
}) {
  if (!isOpen || !listing) return null;

  const reservationCode = useMemo(
    () => 'WNDR-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    [isOpen]
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reservation-modal-overlay" onClick={onClose}>
      <div
        className="wanderlust-boarding-pass-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="boarding-pass-close" onClick={onClose} aria-label="Close modal">
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Top Boarding Pass Banner */}
        <div className="boarding-pass-header">
          <div className="boarding-pass-brand">
            <i className="fa-solid fa-compass boarding-pass-compass"></i>
            <div>
              <span className="boarding-brand-title">WANDERLUST</span>
              <span className="boarding-brand-sub">TRAVEL ITINERARY & STAY PASS</span>
            </div>
          </div>
          <div className="boarding-pass-class-pill">
            <i className="fa-solid fa-crown"></i> CONFIRMED
          </div>
        </div>

        {/* Flight & Travel Route Visual */}
        <div className="boarding-route-strip">
          <div className="route-point">
            <span className="route-code">EXPLORER</span>
            <span className="route-city">Your Journey Begins</span>
          </div>

          <div className="route-flight-path">
            <span className="flight-dot"></span>
            <div className="flight-line">
              <i className="fa-solid fa-plane flight-plane-icon"></i>
            </div>
            <span className="flight-dot"></span>
          </div>

          <div className="route-point right">
            <span className="route-code">{listing.country?.substring(0, 3).toUpperCase() || 'STAY'}</span>
            <span className="route-city">{listing.location}, {listing.country}</span>
          </div>
        </div>

        {/* Ticket Perforation Divider with Notches */}
        <div className="boarding-perforation-row">
          <div className="perforation-notch notch-left"></div>
          <div className="perforation-dashed-line"></div>
          <div className="perforation-notch notch-right"></div>
        </div>

        {/* Stay Summary Box */}
        <div className="boarding-stay-summary">
          <img
            src={listing.image?.url || 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b'}
            alt={listing.title}
            className="boarding-property-thumb"
          />
          <div className="boarding-property-details">
            <span className="boarding-property-badge">
              <i className="fa-solid fa-shield-halved"></i> Superhost Protected
            </span>
            <h3 className="boarding-property-title">{listing.title}</h3>
            <p className="boarding-host-name">
              Host: <strong>{listing.owner?.username || 'Wanderlust Host'}</strong> &bull; Entire retreat
            </p>
          </div>
        </div>

        {/* Grid of Trip Details */}
        <div className="boarding-details-grid">
          <div className="boarding-field">
            <span className="field-label">CONFIRMATION REF</span>
            <span className="field-value mono">{reservationCode}</span>
          </div>
          <div className="boarding-field">
            <span className="field-label">GUESTS</span>
            <span className="field-value">{guests} {guests > 1 ? 'Travelers' : 'Traveler'}</span>
          </div>
          <div className="boarding-field">
            <span className="field-label">CHECK-IN</span>
            <span className="field-value">12 Oct 2026 (3 PM)</span>
          </div>
          <div className="boarding-field">
            <span className="field-label">CHECKOUT</span>
            <span className="field-value">17 Oct 2026 (11 AM)</span>
          </div>
          <div className="boarding-field">
            <span className="field-label">DURATION</span>
            <span className="field-value">{nights} Nights</span>
          </div>
          <div className="boarding-field">
            <span className="field-label">TOTAL PAID</span>
            <span className="field-value price-green">&#8377; {total?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Realistic Barcode Visual & Protection Tag */}
        <div className="boarding-barcode-section">
          <div className="barcode-bars">
            <span>||| | ||||| || |||||| | |||| ||| ||||| |||| | |||||| ||| ||||</span>
          </div>
          <span className="barcode-number">WNDR-{reservationCode}-SECURED</span>
        </div>

        {/* Travel Actions */}
        <div className="boarding-actions-row">
          <button type="button" className="boarding-btn-outline" onClick={handlePrint}>
            <i className="fa-solid fa-print"></i>
            <span>Print Pass</span>
          </button>
          <button type="button" className="boarding-btn-outline" onClick={onShare}>
            <i className="fa-solid fa-share-nodes"></i>
            <span>Share Trip</span>
          </button>
          <button type="button" className="boarding-btn-primary" onClick={onClose}>
            <span>Ready for Adventure! 🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
}
