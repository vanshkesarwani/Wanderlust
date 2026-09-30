import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import CategoryFilter from '../components/CategoryFilter';
import ListingCard from '../components/ListingCard';
import FilterModal from '../components/FilterModal';

export default function ListingsPage({ searchQuery, setSearchQuery }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlSearch = searchParams.get('search') || '';

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTaxes, setShowTaxes] = useState(false);
  const [error, setError] = useState(null);

  // Filter modal state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchListings();
  }, [urlSearch]);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = urlSearch ? `?search=${encodeURIComponent(urlSearch)}` : '';
      const res = await api.get(`/listings${query}`);
      setListings(res.data.listings || []);
    } catch (err) {
      setError('Failed to load listings. Please verify the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
    if (setSearchQuery) setSearchQuery('');
    navigate('/');
  };

  // Comprehensive client-side category and price filtering with multi-token search
  const filteredListings = listings.filter((item) => {
    const activeSearch = (urlSearch || searchQuery || '').trim().toLowerCase();
    if (activeSearch) {
      const terms = activeSearch.split(/[,\s]+/).filter(Boolean);
      const combined = `${item.title || ''} ${item.location || ''} ${item.country || ''} ${item.description || ''}`.toLowerCase();
      const allMatch = terms.every((term) => combined.includes(term));
      if (!allMatch) return false;
    }

    if (minPrice && item.price < Number(minPrice)) return false;
    if (maxPrice && item.price > Number(maxPrice)) return false;

    if (selectedCategory === 'all') return true;

    const textToMatch = `${item.title} ${item.description} ${item.location}`.toLowerCase();
    switch (selectedCategory) {
      case 'trending':
        return item.price >= 1500;
      case 'beachfront':
        return textToMatch.includes('beach') || textToMatch.includes('ocean') || textToMatch.includes('coast');
      case 'cabins':
        return textToMatch.includes('cabin') || textToMatch.includes('cottage') || textToMatch.includes('wood');
      case 'mansions':
        return textToMatch.includes('villa') || textToMatch.includes('mansion') || textToMatch.includes('penthouse');
      case 'views':
        return textToMatch.includes('view') || textToMatch.includes('mountain') || textToMatch.includes('scenic');
      case 'rooms':
        return textToMatch.includes('room') || textToMatch.includes('studio') || textToMatch.includes('loft');
      case 'iconic-cities':
        return ['new york', 'mumbai', 'florence', 'paris', 'tokyo', 'los angeles', 'dubai'].some((c) =>
          textToMatch.includes(c)
        );
      case 'mountains':
        return textToMatch.includes('mountain') || textToMatch.includes('aspen') || textToMatch.includes('ski');
      case 'castles':
        return textToMatch.includes('castle') || textToMatch.includes('palace') || textToMatch.includes('fort');
      case 'pools':
        return textToMatch.includes('pool') || textToMatch.includes('swim');
      case 'camping':
        return textToMatch.includes('camp') || textToMatch.includes('tent') || textToMatch.includes('nature');
      case 'farms':
        return textToMatch.includes('farm') || textToMatch.includes('countryside') || textToMatch.includes('rural');
      case 'arctic':
        return textToMatch.includes('igloo') || textToMatch.includes('snow') || textToMatch.includes('finland');
      case 'lakefront':
        return textToMatch.includes('lake') || textToMatch.includes('tahoe') || textToMatch.includes('water');
      case 'skiing':
        return textToMatch.includes('ski') || textToMatch.includes('snow') || textToMatch.includes('verbier');
      default:
        return true;
    }
  });

  return (
    <div>
      {/* Category Filter Bar */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        showTaxes={showTaxes}
        setShowTaxes={setShowTaxes}
        onOpenFilterModal={() => setFilterModalOpen(true)}
      />

      {/* Wanderlust Travel Status & Explore Ribbon */}
      <div className="wanderlust-explore-ribbon">
        <div className="container ribbon-inner">
          <div className="ribbon-brand-lead">
            <span className="ribbon-compass-icon"><i className="fa-solid fa-compass"></i></span>
            <span className="ribbon-text">
              Over <strong>{listings.length || '1,000+'}</strong> verified retreats across the world's most breathtaking destinations
            </span>
          </div>
          <div className="ribbon-perks">
            <span className="ribbon-perk-item"><i className="fa-solid fa-shield-halved"></i> 100% Verified Hosts</span>
            <span className="ribbon-perk-item"><i className="fa-solid fa-bolt"></i> Instant Confirmation</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#ff385c' }}></i>
            <p style={{ marginTop: '1rem', color: '#717171', fontWeight: 500 }}>
              Finding the best stays around the world...
            </p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <p style={{ color: '#c13515', fontWeight: 600, fontSize: '1.1rem' }}>{error}</p>
            <button
              onClick={fetchListings}
              className="airbnb-reserve-btn"
              style={{ marginTop: '1.5rem', display: 'inline-block' }}
            >
              Retry
            </button>
          </div>
        ) : filteredListings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏖️</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              No exact matches found
            </h3>
            <p style={{ color: '#717171', marginBottom: '1.5rem' }}>
              Try changing or clearing some of your filters or searching for another destination.
            </p>
            <button
              onClick={handleResetFilters}
              className="airbnb-filters-pill"
              style={{ margin: '0 auto' }}
            >
              Remove all filters
            </button>
          </div>
        ) : (
          <>
            {(searchQuery || urlSearch || selectedCategory !== 'all' || minPrice || maxPrice) && (
              <div className="search-results-feedback-row">
                <span className="results-count-text">
                  <strong>{filteredListings.length}</strong> {filteredListings.length === 1 ? 'place' : 'places'} found
                  {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                  {(searchQuery || urlSearch) && ` matching "${searchQuery || urlSearch}"`}
                </span>
                <button
                  className="clear-search-pill-btn"
                  onClick={handleResetFilters}
                >
                  <i className="fa-solid fa-rotate-left"></i> Reset
                </button>
              </div>
            )}

            <div className="airbnb-listings-grid">
              {filteredListings.map((listing, index) => (
                <ListingCard
                  key={listing._id}
                  listing={listing}
                  showTaxes={showTaxes}
                  isNewListing={index === 0}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        onApply={() => {}}
      />
    </div>
  );
}
