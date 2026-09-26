import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Map from '../components/Map';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapToken, setMapToken] = useState('');
  const [saved, setSaved] = useState(false);

  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Booking widget state
  const [nights, setNights] = useState(5);
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    fetchListing();
    fetchConfig();
  }, [id]);

  const fetchConfig = async () => {
    try {
      const res = await api.get('/config');
      setMapToken(res.data.mapToken || '');
    } catch (e) {
      console.warn("Could not load config", e);
    }
  };

  const fetchListing = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/listings/${id}`);
      setListing(res.data.listing);
    } catch (err) {
      setError(err.response?.data?.error || 'Listing not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/listings/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete listing');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    setReviewError('');
    setSubmittingReview(true);
    try {
      const res = await api.post(`/listings/${id}/reviews`, { rating, comment });
      setListing((prev) => ({
        ...prev,
        reviews: [...prev.reviews, res.data.review]
      }));
      setComment('');
      setRating(5);
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Failed to post review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/listings/${id}/reviews/${reviewId}`);
      setListing((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((r) => r._id !== reviewId)
      }));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete review');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Listing link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2.5rem', color: '#ff385c' }}></i>
        <p style={{ marginTop: '1rem', color: '#717171', fontWeight: 500 }}>Loading accommodation details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Listing Not Found</h2>
        <p style={{ color: '#717171', margin: '1rem 0 2rem 0' }}>{error || 'This property may have been removed or unpublished.'}</p>
        <Link to="/" className="airbnb-reserve-btn" style={{ display: 'inline-block' }}>
          Explore Other Stays
        </Link>
      </div>
    );
  }

  const isOwner = user && listing.owner && (user._id === listing.owner._id || user._id === listing.owner);
  const mainImage = listing.image?.url || 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b';
  
  // Complementary photos for Airbnb 5-photo mosaic
  const galleryPhotos = [
    mainImage,
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
  ];

  const subtotal = listing.price * nights;
  const cleaningFee = 600;
  const serviceFee = Math.round(subtotal * 0.14);
  const total = subtotal + cleaningFee + serviceFee;

  return (
    <div className="airbnb-show-container">
      {/* Title & Actions Row */}
      <div className="show-header-top">
        <h1 className="show-title">{listing.title}</h1>
        
        <div className="show-header-actions-row">
          <div className="show-subtitle-links">
            <span className="bold"><i className="fa-solid fa-star" style={{ color: '#222', fontSize: '0.82rem', marginRight: '4px' }}></i> 4.95</span>
            <span>&bull;</span>
            <a href="#reviews" className="underline">{listing.reviews?.length || 0} reviews</a>
            <span>&bull;</span>
            <span style={{ color: '#ff385c', fontWeight: 600 }}><i className="fa-solid fa-award"></i> Superhost</span>
            <span>&bull;</span>
            <span className="underline">{listing.location}, {listing.country}</span>
          </div>

          <div className="show-action-btns">
            <button className="show-action-btn" onClick={handleShare}>
              <i className="fa-solid fa-arrow-up-from-bracket"></i>
              <span>Share</span>
            </button>
            <button className="show-action-btn" onClick={() => setSaved(!saved)}>
              <i className={saved ? "fa-solid fa-heart" : "fa-regular fa-heart"} style={{ color: saved ? '#ff385c' : 'inherit' }}></i>
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Iconic 5-Photo Airbnb Mosaic */}
      <div className="airbnb-photo-mosaic">
        <div className="photo-mosaic-item main">
          <img src={galleryPhotos[0]} alt={listing.title} />
        </div>
        <div className="photo-mosaic-item secondary">
          <img src={galleryPhotos[1]} alt="Interior view" />
        </div>
        <div className="photo-mosaic-item secondary">
          <img src={galleryPhotos[2]} alt="Living area" />
        </div>
        <div className="photo-mosaic-item secondary">
          <img src={galleryPhotos[3]} alt="Kitchen amenities" />
        </div>
        <div className="photo-mosaic-item secondary">
          <img src={galleryPhotos[4]} alt="Outdoor view" />
        </div>

        <button className="show-all-photos-btn" onClick={() => alert('Viewing all 5 high-resolution photos.')}>
          <i className="fa-solid fa-grip-vertical"></i>
          <span>Show all photos</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="show-columns-layout">
        {/* Left Column: Details, Highlights, Amenities, Reviews, Map */}
        <div className="show-details-left">
          {/* Host Header */}
          <div className="show-host-header">
            <div className="show-host-title">
              <h2>Entire home hosted by {listing.owner?.username || 'Superhost'}</h2>
              <p>6 guests &bull; 3 bedrooms &bull; 3 beds &bull; 2.5 baths</p>
            </div>
            <div className="show-host-avatar">
              {(listing.owner?.username || 'H').charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Key Feature Highlights */}
          <div className="show-highlights-list">
            <div className="highlight-row">
              <i className="fa-solid fa-laptop highlight-icon"></i>
              <div className="highlight-text">
                <h4>Dedicated workspace</h4>
                <p>A private room with fast wifi that's well-suited for working.</p>
              </div>
            </div>
            <div className="highlight-row">
              <i className="fa-solid fa-key highlight-icon"></i>
              <div className="highlight-text">
                <h4>Self check-in</h4>
                <p>Check yourself in with the smart lock system.</p>
              </div>
            </div>
            <div className="highlight-row">
              <i className="fa-regular fa-calendar-check highlight-icon"></i>
              <div className="highlight-text">
                <h4>Free cancellation for 48 hours</h4>
                <p>Get a full refund if you change your mind.</p>
              </div>
            </div>
          </div>

          {/* AirCover Banner */}
          <div className="aircover-banner">
            <div className="aircover-logo">
              <span className="red">air</span>cover
            </div>
            <p className="aircover-text">
              Every booking includes free protection from Host cancellations, listing inaccuracies, and other issues like trouble checking in.
            </p>
          </div>

          {/* Description */}
          <div className="show-description-box">
            <h3>About this space</h3>
            <p>{listing.description}</p>
          </div>

          {/* Amenities Grid */}
          <div className="show-amenities-box">
            <h3>What this place offers</h3>
            <div className="amenities-two-col">
              <div className="amenity-item"><i className="fa-solid fa-wifi"></i> Fast Wifi (250 Mbps)</div>
              <div className="amenity-item"><i className="fa-solid fa-square-parking"></i> Free parking on premises</div>
              <div className="amenity-item"><i className="fa-solid fa-kitchen-set"></i> Fully equipped kitchen</div>
              <div className="amenity-item"><i className="fa-solid fa-person-swimming"></i> Private pool access</div>
              <div className="amenity-item"><i className="fa-solid fa-snowflake"></i> Central air conditioning</div>
              <div className="amenity-item"><i className="fa-solid fa-tv"></i> 65" 4K Smart TV with Netflix</div>
              <div className="amenity-item"><i className="fa-solid fa-shirt"></i> In-unit washer & dryer</div>
              <div className="amenity-item"><i className="fa-solid fa-shield-halved"></i> Exterior security cameras</div>
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="show-owner-actions">
              <Link to={`/listings/${listing._id}/edit`} className="owner-btn-edit">
                <i className="fa-solid fa-pen-to-square"></i>
                <span>Edit Listing</span>
              </Link>
              <button onClick={handleDeleteListing} className="owner-btn-delete">
                <i className="fa-solid fa-trash"></i>
                <span>Delete Listing</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Floating Airbnb Booking Card */}
        <div className="show-booking-right">
          <div className="airbnb-booking-card">
            <div className="booking-header-price">
              <div>
                <span className="amount">&#8377; {listing.price?.toLocaleString('en-IN')}</span>
                <span className="per-night"> night</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                <i className="fa-solid fa-star" style={{ color: '#222', marginRight: '3px' }}></i>
                4.95 &bull; <span style={{ color: '#717171', textDecoration: 'underline' }}>{listing.reviews?.length || 0} reviews</span>
              </div>
            </div>

            {/* Dates & Guests Box */}
            <div className="booking-inputs-table">
              <div className="booking-date-inputs">
                <div className="booking-sub-field border-right">
                  <div className="booking-sub-label">CHECK-IN</div>
                  <div className="booking-sub-value">12/10/2026</div>
                </div>
                <div className="booking-sub-field">
                  <div className="booking-sub-label">CHECKOUT</div>
                  <div className="booking-sub-value">17/10/2026</div>
                </div>
              </div>
              <div className="booking-guests-field">
                <div className="booking-sub-label">GUESTS</div>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', color: '#222', marginTop: '2px', cursor: 'pointer' }}
                >
                  <option value={1}>1 guest</option>
                  <option value={2}>2 guests</option>
                  <option value={3}>3 guests</option>
                  <option value={4}>4 guests</option>
                  <option value={5}>5 guests</option>
                </select>
              </div>
            </div>

            {/* Reserve Button */}
            <button
              className="airbnb-reserve-btn"
              onClick={() => alert(`Reservation confirmed for ${guests} guest(s) for ${nights} nights! Total: ₹${total.toLocaleString('en-IN')}`)}
            >
              Reserve
            </button>
            <p className="booking-notice">You won't be charged yet</p>

            {/* Fee Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div className="booking-calc-row underline">
                <span>&#8377; {listing.price?.toLocaleString('en-IN')} &times; {nights} nights</span>
                <span>&#8377; {subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="booking-calc-row underline">
                <span>Cleaning fee</span>
                <span>&#8377; {cleaningFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="booking-calc-row underline">
                <span>Wanderlust service fee</span>
                <span>&#8377; {serviceFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="booking-calc-total">
                <span>Total before taxes</span>
                <span>&#8377; {total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="show-reviews-container" id="reviews">
        <div className="reviews-overall-header">
          <i className="fa-solid fa-star" style={{ color: '#222' }}></i>
          <span>4.95 &bull; {listing.reviews?.length || 0} reviews</span>
        </div>

        {/* Airbnb Rating Breakdown Bars */}
        <div className="reviews-breakdown-grid">
          {[
            { label: 'Cleanliness', score: '5.0' },
            { label: 'Accuracy', score: '4.9' },
            { label: 'Communication', score: '5.0' },
            { label: 'Location', score: '4.9' },
            { label: 'Check-in', score: '5.0' },
            { label: 'Value', score: '4.8' },
          ].map((cat) => (
            <div key={cat.label} className="breakdown-row">
              <span>{cat.label}</span>
              <div className="breakdown-bar-wrap">
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${(parseFloat(cat.score) / 5) * 100}%` }}></div>
                </div>
                <span className="breakdown-score">{cat.score}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Leave Review Form */}
        <div className="leave-review-card">
          <h4>Leave a Review</h4>
          {reviewError && <div className="auth-error-banner">{reviewError}</div>}
          <form onSubmit={handleReviewSubmit}>
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                Overall Rating: {rating} {rating === 1 ? 'Star' : 'Stars'}
              </label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((s) => (
                  <i
                    key={s}
                    className={s <= rating ? 'fa-solid fa-star' : 'fa-regular fa-star'}
                    onClick={() => setRating(s)}
                  ></i>
                ))}
              </div>
            </div>

            <div className="airbnb-input-group">
              <label>Your Review</label>
              <textarea
                className="airbnb-input"
                rows="3"
                placeholder="Share your stay experience, what you enjoyed most, or tips for future guests..."
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="airbnb-reserve-btn" style={{ padding: '0.75rem 1.5rem', display: 'inline-block' }} disabled={submittingReview}>
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Existing Reviews Cards */}
        {listing.reviews && listing.reviews.length > 0 ? (
          <div className="reviews-cards-grid">
            {listing.reviews.map((rev) => {
              const isReviewOwner = user && rev.author && (user._id === rev.author._id || user._id === rev.author);
              return (
                <div key={rev._id} className="airbnb-review-card">
                  <div className="reviewer-profile">
                    <div className="reviewer-avatar">
                      {(rev.author?.username || 'G').charAt(0).toUpperCase()}
                    </div>
                    <div className="reviewer-meta">
                      <h5>{rev.author?.username || 'Guest'}</h5>
                      <span>October 2026 &bull; Stayed a few nights</span>
                    </div>
                  </div>

                  <div className="review-stars-row">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </div>

                  <p className="review-body-text">{rev.comment}</p>

                  {isReviewOwner && (
                    <button
                      onClick={() => handleDeleteReview(rev._id)}
                      style={{ alignSelf: 'flex-start', color: '#c13515', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'underline' }}
                    >
                      Delete review
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: '#717171', fontStyle: 'italic' }}>
            No reviews yet. Be the first guest to share your experience!
          </p>
        )}
      </section>

      {/* Mapbox Map Section */}
      <section className="show-map-section">
        <h3>Where you'll be</h3>
        <p><i className="fa-solid fa-location-dot" style={{ color: '#ff385c', marginRight: '6px' }}></i>{listing.location}, {listing.country}</p>
        <Map
          coordinates={listing.geometry?.coordinates}
          location={listing.location}
          country={listing.country}
          mapToken={mapToken}
        />
      </section>
    </div>
  );
}
