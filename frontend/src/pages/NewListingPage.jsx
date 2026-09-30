import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function NewListingPage() {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If user is not logged in - Authentic Airbnb Hosting Landing Screen
  if (!user) {
    return (
      <div className="container main-content" style={{ maxWidth: '960px', margin: '0 auto', padding: '3.5rem 1.25rem 5rem 1.25rem' }}>
        {/* Hero Section */}
        <div className="airbnb-host-hero-card">
          <div className="airbnb-host-hero-badge">
            <i className="fa-solid fa-house-chimney-window"></i>
            <span>WANDERLUST HOSTING</span>
          </div>
          <h1 className="airbnb-host-hero-title">
            It's easy to host your home on Wanderlust.
          </h1>
          <p className="airbnb-host-hero-sub">
            Open your doors to curious travelers, earn extra income, and share your corner of the world with ease.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <button
              onClick={() => openAuthModal('login', '/listings/new')}
              className="primary-btn airbnb-host-cta-btn"
            >
              <i className="fa-solid fa-arrow-right-to-bracket" style={{ marginRight: '8px' }}></i>
              Get Started &mdash; Sign In / Register
            </button>
          </div>
        </div>

        {/* 3 Airbnb Value Propositions */}
        <div className="airbnb-host-pillars-grid">
          <div className="host-pillar-card">
            <div className="pillar-icon-wrap">
              <i className="fa-solid fa-user-group"></i>
            </div>
            <h4>One-to-one guidance from a Superhost</h4>
            <p>
              We'll match you with a seasoned Superhost in your region who can guide you from your very first question to your very first guest.
            </p>
          </div>

          <div className="host-pillar-card">
            <div className="pillar-icon-wrap">
              <i className="fa-solid fa-star"></i>
            </div>
            <h4>Experienced guests for your first booking</h4>
            <p>
              For your very first reservation, you can choose to welcome an experienced guest with at least 3 stays and great reviews.
            </p>
          </div>

          <div className="host-pillar-card">
            <div className="pillar-icon-wrap">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h4>Top-to-bottom WanderCover protection</h4>
            <p>
              Always included, always free. Get comprehensive damage protection, guest verification, and 24-hour safety support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl('');
    }
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImageFile(null);
    setImagePreview(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      if (imageFile) {
        // Multipart submission
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append(
          'listing',
          JSON.stringify({
            title,
            description,
            price: Number(price),
            location,
            country
          })
        );
        res = await api.post('/listings', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // JSON submission
        res = await api.post('/listings', {
          listing: {
            title,
            description,
            image: imageUrl || 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b',
            price: Number(price),
            location,
            country
          }
        });
      }

      const createdId = res.data.listing?._id;
      toast.listed(title);
      if (createdId) {
        navigate(`/listings/${createdId}`, { state: { justCreated: true } });
      } else {
        navigate('/', { state: { justCreated: true } });
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to create listing';
      setError(errMsg);
      toast.error(errMsg, 'Listing Creation Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container main-content">
      <div className="form-container">
        <div className="form-header">
          <div className="hosting-studio-brand">
            <i className="fa-solid fa-compass" style={{ color: '#ff385c', marginRight: '6px' }}></i>
            <span>WANDERLUST HOSTING STUDIO</span>
          </div>
          <h2>List Your Property</h2>
          <p>Open your doors to millions of travelers seeking unforgettable retreats worldwide.</p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ margin: 0 }}>Property Title</label>
              <span style={{ fontSize: '0.78rem', color: '#717171' }}>Be descriptive & catchy</span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Serene Beachfront Villa with Panoramic Ocean Views"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Quick Inspiration Travel Pills */}
            <div className="inspiration-pills-row">
              <span className="inspiration-label">Quick Ideas:</span>
              {[
                { tag: 'Beachfront Villa', icon: '🏖️' },
                { tag: 'Cozy Mountain Cabin', icon: '🏔️' },
                { tag: 'Luxury Penthouse', icon: '👑' },
                { tag: 'Countryside Farmstay', icon: '🌻' },
                { tag: 'Modern Forest Haven', icon: '🌲' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.tag}
                  className="inspiration-pill-btn"
                  onClick={() => setTitle(`${item.icon} ${item.tag} in ${location || 'Paradise'}`)}
                >
                  {item.icon} {item.tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Description & Amenities</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Describe what makes your retreat magical, scenic highlights, nearby adventures, and guest comforts..."
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Image Input Options */}
          <div className="form-group">
            <label>Image Source</label>
            <input
              type="url"
              className="form-control"
              placeholder="Paste image link URL (e.g. Unsplash URL)"
              value={imageUrl}
              onChange={handleUrlChange}
            />
            <div style={{ textAlign: 'center', margin: '0.4rem 0', color: '#717171', fontSize: '0.85rem' }}>
              &mdash; OR upload a local file &mdash;
            </div>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

          {/* Preview */}
          {imagePreview && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#717171', marginBottom: '0.35rem' }}>
                Image Preview:
              </div>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #ddd' }}
              />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Price (&#8377; / Night)</label>
              <input
                type="number"
                min="0"
                className="form-control"
                placeholder="1200"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Location / City</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Malibu, Goa, Paris"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. United States, India, France"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          {/* Live Interactive Card Preview */}
          {(title || price || location || imagePreview) && (
            <div className="new-listing-live-preview-box">
              <div className="live-preview-header">
                <span className="live-pulse-dot"></span>
                <span>Live Card Preview (How guests see it)</span>
              </div>
              <div className="airbnb-card live-card-mock">
                <div className="airbnb-card-media">
                  <img
                    src={imagePreview || 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b'}
                    alt="Preview"
                  />
                  <div className="guest-fav-badge" style={{ background: '#ff385c', color: '#fff' }}>
                    <i className="fa-solid fa-sparkles" style={{ fontSize: '0.7rem' }}></i>
                    <span>New Listing</span>
                  </div>
                </div>
                <div className="airbnb-card-content">
                  <div className="airbnb-card-row-top">
                    <span className="airbnb-card-location">
                      {location || 'Location'}, {country || 'Country'}
                    </span>
                    <div className="airbnb-card-rating">
                      <i className="fa-solid fa-star"></i>
                      <span>New</span>
                    </div>
                  </div>
                  <div className="airbnb-card-sub">
                    {title || 'Property Title'}
                  </div>
                  <div className="airbnb-card-dates">
                    Stay with Host {user?.username || 'You'} &bull; Available now
                  </div>
                  <div className="airbnb-card-price-row">
                    <div>
                      <span className="price-bold">
                        &#8377; {price ? Number(price).toLocaleString('en-IN') : '0'}
                      </span>{' '}
                      <span className="price-unit">night</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="primary-btn"
            style={{ width: '100%', marginTop: '1.25rem', height: '48px', fontSize: '1rem', fontWeight: 600 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                Publishing Your Stay...
              </>
            ) : (
              '🚀 Publish Listing'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
