import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

const ContactUs = () => {
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CMS.PAGE('contact-us')}`);
        const data = await res.json();
        if (data.success && data.data) {
          setPage(data.data);
        }
      } catch {
        // Silent fail — contact form still shows
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields.');
      return;
    }
    // Simple mailto fallback
    const subject = encodeURIComponent(formData.subject || 'Contact from Namma Naidu');
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n${formData.message}`
    );
    window.open(`mailto:support@nammanaidu.cloud?subject=${subject}&body=${body}`);
    setSubmitted(true);
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
        <article className="cms-article">
          <h1>Contact Us</h1>

          {/* CMS content section */}
          {!loading && page?.content && (
            <div
              className="cms-html-content contact-intro"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          )}

          {/* Contact info cards */}
          <div className="contact-info-grid">
            <div className="contact-card">
              <span className="contact-icon">📧</span>
              <h3>Email</h3>
              <p>support@nammanaidu.cloud</p>
            </div>
            <div className="contact-card">
              <span className="contact-icon">📞</span>
              <h3>Phone</h3>
              <p>+91 98765 43210</p>
            </div>
            <div className="contact-card">
              <span className="contact-icon">📍</span>
              <h3>Office</h3>
              <p>Chennai, Tamil Nadu, India</p>
            </div>
          </div>

          {/* Contact form */}
          {submitted ? (
            <div className="contact-success">
              <span className="success-icon">✅</span>
              <h2>Thank you for reaching out!</h2>
              <p>We have received your message and will get back to you within 24-48 hours.</p>
              <Link to="/" className="cms-back-link">Back to Home</Link>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>Send us a Message</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group full-width">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="contact-submit-btn">Send Message</button>
            </form>
          )}
        </article>
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

export default ContactUs;
