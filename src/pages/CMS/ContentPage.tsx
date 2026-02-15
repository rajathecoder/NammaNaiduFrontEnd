import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api.config';
import logo from '../../assets/images/logoonly.png';
import './CMSPublic.css';

interface PageData {
  slug: string;
  title: string;
  content: string;
  metaDescription?: string;
  updatedAt: string;
}

const ContentPage = () => {
  const location = useLocation();
  const slug = location.pathname.replace('/', '');
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CMS.PAGE(slug)}`);
        const data = await res.json();
        if (data.success && data.data) {
          setPage(data.data);
        } else {
          setError('Page not found or not yet published.');
        }
      } catch {
        setError('Failed to load page content.');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

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
        {loading && (
          <div className="cms-loading">
            <div className="cms-skeleton-title" />
            <div className="cms-skeleton-line" />
            <div className="cms-skeleton-line short" />
            <div className="cms-skeleton-line" />
            <div className="cms-skeleton-line short" />
            <div className="cms-skeleton-line" />
          </div>
        )}

        {!loading && error && (
          <div className="cms-error">
            <h2>Page Not Available</h2>
            <p>{error}</p>
            <Link to="/" className="cms-back-link">Back to Home</Link>
          </div>
        )}

        {!loading && page && (
          <article className="cms-article">
            <h1>{page.title}</h1>
            {page.content ? (
              <div
                className="cms-html-content"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <p className="cms-empty">This page has no content yet. Please check back later.</p>
            )}
            <p className="cms-updated">
              Last updated: {new Date(page.updatedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </article>
        )}
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

export default ContentPage;
