import React, { useState, useEffect } from 'react';

export default function PhotoGalleryModal({ isOpen, onClose, photos = [], title = 'Property Photos' }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, photos.length]);

  if (!isOpen || !photos.length) return null;

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="gallery-modal-overlay" onClick={onClose}>
      <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Gallery Top Bar */}
        <div className="gallery-top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="gallery-close-btn" onClick={onClose} aria-label="Close photos">
              <i className="fa-solid fa-xmark"></i>
              <span>Close</span>
            </button>
            <div className="gallery-brand-tag">
              <i className="fa-solid fa-compass" style={{ color: '#ff385c' }}></i>
              <span>WANDERLUST VIRTUAL TOUR</span>
            </div>
          </div>

          <div className="gallery-counter-pill">
            <i className="fa-regular fa-image" style={{ marginRight: '6px' }}></i>
            {currentIndex + 1} of {photos.length}
          </div>

          <div className="gallery-right-info">
            <span className="gallery-keyboard-tip">Use keys &larr; &rarr; to browse</span>
            <div className="gallery-title-clamp">{title}</div>
          </div>
        </div>

        {/* Main Photo View */}
        <div className="gallery-viewer">
          <button
            className="gallery-nav-btn prev"
            onClick={prevPhoto}
            aria-label="Previous photo"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <div className="gallery-main-image-wrap">
            <img
              key={currentIndex}
              src={photos[currentIndex]}
              alt={`${title} - photo ${currentIndex + 1}`}
              className="gallery-main-img"
            />
          </div>

          <button
            className="gallery-nav-btn next"
            onClick={nextPhoto}
            aria-label="Next photo"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        {/* Thumbnail Strip */}
        <div className="gallery-thumbnails-strip">
          {photos.map((src, idx) => (
            <button
              key={idx}
              className={`gallery-thumb-btn ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            >
              <img src={src} alt={`Thumbnail ${idx + 1}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
