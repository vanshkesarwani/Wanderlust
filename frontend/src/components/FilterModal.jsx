import React, { useState } from 'react';

export default function FilterModal({ isOpen, onClose, minPrice, setMinPrice, maxPrice, setMaxPrice, onApply }) {
  if (!isOpen) return null;

  const handleClear = () => {
    setMinPrice('');
    setMaxPrice('');
    onApply();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Filters</h3>
          <div style={{ width: '32px' }}></div>
        </div>

        <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Price Range */}
          <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #ebebeb' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Price range</h4>
            <p style={{ color: '#717171', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Nightly prices before taxes and fees
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="airbnb-input-group">
                <label>Minimum (&#8377;)</label>
                <input
                  type="number"
                  className="airbnb-input"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="airbnb-input-group">
                <label>Maximum (&#8377;)</label>
                <input
                  type="number"
                  className="airbnb-input"
                  placeholder="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Type of Place */}
          <div style={{ padding: '1.5rem 0', borderBottom: '1px solid #ebebeb' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Type of place</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#222' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Any type</div>
                  <div style={{ color: '#717171', fontSize: '0.82rem' }}>Villas, lofts, cabins and apartments</div>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#222' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Entire place</div>
                  <div style={{ color: '#717171', fontSize: '0.82rem' }}>A place all to yourself</div>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#222' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Rooms</div>
                  <div style={{ color: '#717171', fontSize: '0.82rem' }}>Your own room, plus access to shared spaces</div>
                </div>
              </label>
            </div>
          </div>

          {/* Amenities */}
          <div style={{ padding: '1.5rem 0' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Amenities</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {['Wifi', 'Kitchen', 'Free parking', 'Air conditioning', 'Pool', 'Dedicated workspace'].map((am) => (
                <label key={am} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#222' }} />
                  <span>{am}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid #ebebeb' }}>
          <button
            type="button"
            onClick={handleClear}
            style={{ fontWeight: 600, textDecoration: 'underline', color: '#222', fontSize: '0.9rem' }}
          >
            Clear all
          </button>
          <button
            type="button"
            className="airbnb-reserve-btn"
            style={{ padding: '0.75rem 1.5rem' }}
            onClick={() => {
              onApply();
              onClose();
            }}
          >
            Show places
          </button>
        </div>
      </div>
    </div>
  );
}
