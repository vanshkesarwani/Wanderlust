import React, { useRef, useState, useEffect } from 'react';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'fa-solid fa-border-all' },
  { id: 'trending', label: 'Trending', icon: 'fa-solid fa-fire' },
  { id: 'beachfront', label: 'Beachfront', icon: 'fa-solid fa-umbrella-beach' },
  { id: 'cabins', label: 'Cabins', icon: 'fa-solid fa-house-chimney-window' },
  { id: 'mansions', label: 'Mansions', icon: 'fa-solid fa-hotel' },
  { id: 'views', label: 'Amazing views', icon: 'fa-solid fa-panorama' },
  { id: 'rooms', label: 'Rooms', icon: 'fa-solid fa-bed' },
  { id: 'iconic-cities', label: 'Iconic cities', icon: 'fa-solid fa-mountain-city' },
  { id: 'mountains', label: 'Mountains', icon: 'fa-solid fa-mountain' },
  { id: 'castles', label: 'Castles', icon: 'fa-brands fa-fort-awesome' },
  { id: 'pools', label: 'Amazing pools', icon: 'fa-solid fa-person-swimming' },
  { id: 'camping', label: 'Camping', icon: 'fa-solid fa-campground' },
  { id: 'farms', label: 'Farms', icon: 'fa-solid fa-cow' },
  { id: 'arctic', label: 'Arctic', icon: 'fa-regular fa-snowflake' },
  { id: 'lakefront', label: 'Lakefront', icon: 'fa-solid fa-water' },
  { id: 'skiing', label: 'Ski-in/out', icon: 'fa-solid fa-person-skiing' },
];

export default function CategoryFilter({
  selectedCategory,
  setSelectedCategory,
  showTaxes,
  setShowTaxes,
  onOpenFilterModal
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <div className="airbnb-categories-wrapper">
      <div className="categories-container">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            className="category-arrow-btn"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        )}

        {/* Carousel Tabs */}
        <div className="categories-carousel">
          <div
            className="categories-scroll-list"
            ref={scrollRef}
            onScroll={checkScroll}
          >
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <i className={cat.icon}></i>
                <span>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            className="category-arrow-btn"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        )}

        {/* Right Controls: Filters & Tax Toggle */}
        <div className="categories-controls-right">
          <button
            className="airbnb-filters-pill"
            onClick={onOpenFilterModal}
          >
            <i className="fa-solid fa-sliders"></i>
            <span>Filters</span>
          </button>

          <div
            className="airbnb-tax-pill"
            onClick={() => setShowTaxes(!showTaxes)}
          >
            <span>Display total before taxes</span>
            <label className="airbnb-switch" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={showTaxes}
                onChange={(e) => setShowTaxes(e.target.checked)}
              />
              <span className="airbnb-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
