import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api.config';
import logo from '../../assets/images/logoonly.png';
import './CMSPublic.css';

interface Story {
  id: number;
  groomName: string;
  brideName: string;
  subcaste?: string;
  marriedYear?: number;
  story: string;
  photoUrl?: string;
  rating: number;
  createdAt: string;
}

const SuccessStoriesPage = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CMS.SUCCESS_STORIES}`);
        const data = await res.json();
        if (data.success && data.data) {
          setStories(data.data);
        }
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.min(rating, 5)) + '☆'.repeat(Math.max(0, 5 - rating));
  };

  return (
    <div className="cms-public-page">
      {/* Header */}
      <header className="cms-header">
        <div className="cms-header-inner">
          <Link to="/" className="cms-logo">
            <img src={logo} alt="Namma Naidu" />
            <span>
              <span className="brand-green">Namma</span>{' '}
              <span className="brand-gold">Naidu</span>
            </span>
          </Link>
          <nav className="cms-header-nav">
            <Link to="/login">Login</Link>
            <Link to="/register" className="cms-btn-register">Register Free</Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="cms-content-wrapper">
        <div className="stories-hero">
          <h1>Success Stories</h1>
          <p>Real couples, real love stories. Discover how Namma Naidu Matrimony brought families together.</p>
        </div>

        {loading && (
          <div className="stories-loading">
            {[1, 2, 3].map(i => (
              <div key={i} className="story-card-skeleton">
                <div className="skeleton-img" />
                <div className="skeleton-text" />
                <div className="skeleton-text short" />
              </div>
            ))}
          </div>
        )}

        {!loading && stories.length === 0 && (
          <div className="cms-error">
            <h2>Coming Soon</h2>
            <p>Success stories are being collected. Check back soon!</p>
            <Link to="/" className="cms-back-link">Back to Home</Link>
          </div>
        )}

        {!loading && stories.length > 0 && (
          <div className="stories-grid">
            {stories.map(story => (
              <div
                key={story.id}
                className={`story-card ${expandedId === story.id ? 'expanded' : ''}`}
                onClick={() => setExpandedId(expandedId === story.id ? null : story.id)}
              >
                {story.photoUrl && (
                  <div className="story-photo">
                    <img src={story.photoUrl} alt={`${story.groomName} & ${story.brideName}`} />
                  </div>
                )}
                <div className="story-body">
                  <h3>{story.groomName} & {story.brideName}</h3>
                  <div className="story-meta">
                    {story.subcaste && <span className="story-subcaste">{story.subcaste}</span>}
                    {story.marriedYear && <span className="story-year">Married {story.marriedYear}</span>}
                  </div>
                  <div className="story-rating">{renderStars(story.rating)}</div>
                  <p className={expandedId === story.id ? 'story-text expanded' : 'story-text'}>
                    {story.story}
                  </p>
                  <button className="story-toggle">
                    {expandedId === story.id ? 'Read Less' : 'Read More'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="stories-cta">
          <h2>Share Your Story</h2>
          <p>Found your soulmate through Namma Naidu? We'd love to hear from you!</p>
          <Link to="/contact-us" className="cta-btn">Contact Us</Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="cms-footer">
        <div className="cms-footer-inner">
          <div className="cms-footer-links">
            <Link to="/about-us">About Us</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-use">Terms of Use</Link>
            <Link to="/security-tips">Security Tips</Link>
            <Link to="/contact-us">Contact Us</Link>
          </div>
          <p>&copy; 2026 Namma Naidu Matrimony. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SuccessStoriesPage;
