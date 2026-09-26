import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function NewListingPage() {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();

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

  // If user is not logged in
  if (!user) {
    return (
      <div className="container main-content" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Sign in to list your home</h2>
        <p style={{ color: '#717171', margin: '1rem 0 1.5rem 0' }}>
          You need to be logged into your Wanderlust account to host.
        </p>
        <button onClick={() => openAuthModal('login')} className="primary-btn">
          Log In / Sign Up
        </button>
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
      if (createdId) {
        navigate(`/listings/${createdId}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container main-content">
      <div className="form-container">
        <div className="form-header">
          <h2>Create a New Listing</h2>
          <p>Share your property with millions of travelers around the world.</p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Property Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Cozy Beachfront Villa with Ocean Views"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Describe what makes your space special, nearby attractions, and comfort..."
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

          <button
            type="submit"
            className="primary-btn"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Listing...' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
