import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ListingCard({ listing, showTaxes }) {
  const [liked, setLiked] = useState(false);

  const basePrice = listing.price || 0;
  const priceWithTax = Math.round(basePrice * 1.18);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  // Generate stable mock distance / dates for Airbnb realism
  const seed = (listing._id || '1').charCodeAt(0);
  const distance = ((seed * 17) % 2500) + 120;
  const isGuestFav = seed % 3 === 0;

  return (
    <Link to={`/listings/${listing._id}`} className="airbnb-card">
      <div className="airbnb-card-media">
        <img
          src={listing.image?.url || 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b'}
          alt={listing.title}
          loading="lazy"
        />

        {/* Guest favourite pill badge */}
        {isGuestFav && (
          <div className="guest-fav-badge">
            <i className="fa-solid fa-trophy" style={{ fontSize: '0.7rem' }}></i>
            <span>Guest favourite</span>
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          className={`airbnb-heart-btn ${liked ? 'liked' : ''}`}
          onClick={handleHeartClick}
          aria-label="Add to favorites"
        >
          <i className={liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
        </button>
      </div>

      <div className="airbnb-card-content">
        <div className="airbnb-card-row-top">
          <span className="airbnb-card-location">
            {listing.location}, {listing.country}
          </span>
          <div className="airbnb-card-rating">
            <i className="fa-solid fa-star"></i>
            <span>4.9{seed % 9}</span>
          </div>
        </div>

        <div className="airbnb-card-sub">
          {listing.title}
        </div>

        <div className="airbnb-card-dates">
          {distance.toLocaleString('en-IN')} kilometers away &bull; 12–17 Oct
        </div>

        <div className="airbnb-card-price-row">
          {showTaxes ? (
            <div>
              <span className="price-bold price-underline">
                &#8377; {priceWithTax.toLocaleString('en-IN')}
              </span>{' '}
              <span className="price-unit">total before taxes</span>
            </div>
          ) : (
            <div>
              <span className="price-bold">
                &#8377; {basePrice.toLocaleString('en-IN')}
              </span>{' '}
              <span className="price-unit">night</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
