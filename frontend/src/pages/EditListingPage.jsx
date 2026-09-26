import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/listings/${id}`);
      const l = res.data.listing;
      setTitle(l.title || '');
      setDescription(l.description || '');
      setImageUrl(l.image?.url || '');
      setImagePreview(l.image?.url || '');
      setPrice(l.price || '');
      setLocation(l.location || '');
      setCountry(l.country || '');
    } catch (err) {
      setError('Could not load listing for editing.');
    } finally {
      setLoading(false);
    }
  };

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
    setSubmitting(true);

    try {
      if (imageFile) {
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
        await api.put(`/listings/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.put(`/listings/${id}`, {
          listing: {
            title,
            description,
            image: imageUrl,
            price: Number(price),
            location,
            country
          }
        });
      }

      navigate(`/listings/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container main-content" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#ff385c' }}></i>
        <p style={{ marginTop: '1rem', color: '#717171' }}>Loading listing details...</p>
      </div>
    );
  }

  return (
    <div className="container main-content">
      <div className="form-container">
        <div className="form-header">
          <h2>Edit Your Listing</h2>
          <p>Update property information, pricing, or photos.</p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Property Title</label>
            <input
              type="text"
              className="form-control"
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
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Image Source</label>
            <input
              type="url"
              className="form-control"
              placeholder="Paste new image URL"
              value={imageUrl}
              onChange={handleUrlChange}
            />
            <div style={{ textAlign: 'center', margin: '0.4rem 0', color: '#717171', fontSize: '0.85rem' }}>
              &mdash; OR upload a new photo &mdash;
            </div>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

          {imagePreview && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#717171', marginBottom: '0.35rem' }}>
                Current / New Preview:
              </div>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #ddd' }}
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
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
            <button
              type="submit"
              className="primary-btn"
              style={{ flex: 1 }}
              disabled={submitting}
            >
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate(`/listings/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
