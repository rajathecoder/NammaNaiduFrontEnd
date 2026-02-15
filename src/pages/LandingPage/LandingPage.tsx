import { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import FloatingParticles from './FloatingParticles';
import logo from '../../assets/images/logoonly.png';
import './LandingPage.css';

/* ═══════════════════════════════════════════════════
   Mock Data
   ═══════════════════════════════════════════════════ */

const subCastes = [
  { name: 'Balija Naidu', icon: '🏛️', count: '12,500+', desc: 'One of the largest Naidu sub-communities in Tamil Nadu & Andhra Pradesh' },
  { name: 'Kamma Naidu', icon: '🌾', count: '18,200+', desc: 'Prominent agricultural and business community across South India' },
  { name: 'Kapu Naidu', icon: '🪷', count: '15,800+', desc: 'Traditional landowning community with rich heritage' },
  { name: 'Reddy Naidu', icon: '🏵️', count: '9,400+', desc: 'Distinguished community known for leadership and enterprise' },
  { name: 'Gavara Naidu', icon: '🪔', count: '7,600+', desc: 'Business-oriented community with deep cultural roots' },
  { name: 'Velama Naidu', icon: '⚜️', count: '6,300+', desc: 'Historic warrior and landowning community' },
  { name: 'Ontari Naidu', icon: '🌿', count: '4,900+', desc: 'Community known for their agricultural traditions' },
  { name: 'Perika Naidu', icon: '🎋', count: '3,200+', desc: 'Traditional trading community with strong family values' },
  { name: 'Naidu (General)', icon: '🪷', count: '20,000+', desc: 'All other Naidu sub-communities welcome' },
];

const mockProfiles = [
  { name: 'Karthik R.', age: 28, profession: 'Software Architect', city: 'Chennai', match: '98%', img: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?auto=format&fit=crop&q=80&w=400&h=600' },
  { name: 'Revathi S.', age: 26, profession: 'Product Designer', city: 'Madurai', match: '95%', img: 'https://images.unsplash.com/photo-1596433811232-aeffa09794cb?auto=format&fit=crop&q=80&w=400&h=600' },
  { name: 'Vignesh M.', age: 30, profession: 'Data Scientist', city: 'Coimbatore', match: '92%', img: 'https://images.unsplash.com/photo-1620935514040-7e6163f9ebba?auto=format&fit=crop&q=80&w=400&h=600' },
  { name: 'Meenakshi P.', age: 27, profession: 'Chartered Accountant', city: 'Trichy', match: '90%', img: 'https://images.unsplash.com/photo-1621348880689-f308945625ec?auto=format&fit=crop&q=80&w=400&h=600' },
  { name: 'Aravind K.', age: 29, profession: 'Civil Engineer', city: 'Tirunelveli', match: '88%', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=600' },
];

const testimonials = [
  { quote: 'We found each other on Namma Naidu within a month. The community-specific matching made all the difference — our families were so happy!', names: 'Priya & Suresh', detail: 'Married in 2025 • Kamma Naidu', initials: 'PS', rating: 5 },
  { quote: 'As a working professional in Bangalore, finding a match from our Balija Naidu community seemed impossible. This platform changed everything.', names: 'Divya & Karthik', detail: 'Married in 2025 • Balija Naidu', initials: 'DK', rating: 5 },
  { quote: 'The verified profiles gave us confidence. Within 3 months we found the perfect alliance. Thank you Namma Naidu Matrimony!', names: 'Lakshmi & Venkat', detail: 'Married in 2024 • Gavara Naidu', initials: 'LV', rating: 5 },
];

const pricingPlans = [
  {
    name: 'Free', price: '₹0', period: '', subtitle: 'Get started', popular: false,
    features: ['Create your profile', 'Browse 50 profiles/day', 'Basic search filters', 'Send 5 interests/day', 'View contact details (limited)'],
  },
  {
    name: 'Silver', price: '₹999', period: '/3 months', subtitle: 'Most popular choice', popular: true,
    features: ['Unlimited profile browsing', 'Send 30 interests/day', 'View all contact details', 'Priority customer support', 'Profile boost (2x visibility)', 'Advanced search filters'],
  },
  {
    name: 'Gold', price: '₹1,999', period: '/6 months', subtitle: 'Premium experience', popular: false,
    features: ['Everything in Silver', 'Unlimited interests', 'Dedicated relationship advisor', 'Profile highlight (5x visibility)', 'Video call feature', 'Kundali matching report', 'VIP badge on profile'],
  },
];

/* ═══════════════════════════════════════════════════
   Animated Counter Hook (Intersection Observer)
   ═══════════════════════════════════════════════════ */

function useCounter(end: number, suffix = '', duration = 2000) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !triggered.current) {
            triggered.current = true;
            const start = performance.now();
            const animate = (now: number) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // ease out quad
              const eased = 1 - (1 - progress) * (1 - progress);
              setValue(Math.round(eased * end));
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return { ref, display: `${value.toLocaleString()}${suffix}` };
}

/* ═══════════════════════════════════════════════════
   Kolam SVG Pattern (decorative)
   ═══════════════════════════════════════════════════ */

const KolamCornerSVG = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" stroke="#1B5E20" strokeWidth="1" opacity="0.3" />
    <circle cx="100" cy="100" r="60" stroke="#D4A017" strokeWidth="0.8" opacity="0.25" />
    <circle cx="100" cy="100" r="40" stroke="#1B5E20" strokeWidth="0.8" opacity="0.2" />
    <path d="M100 20 Q140 60 100 100 Q60 60 100 20Z" stroke="#1B5E20" strokeWidth="0.6" opacity="0.15" fill="none" />
    <path d="M20 100 Q60 140 100 100 Q60 60 20 100Z" stroke="#D4A017" strokeWidth="0.6" opacity="0.15" fill="none" />
    <path d="M100 180 Q60 140 100 100 Q140 140 100 180Z" stroke="#1B5E20" strokeWidth="0.6" opacity="0.15" fill="none" />
    <path d="M180 100 Q140 60 100 100 Q140 140 180 100Z" stroke="#D4A017" strokeWidth="0.6" opacity="0.15" fill="none" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <circle key={deg} cx={100 + 80 * Math.cos((deg * Math.PI) / 180)} cy={100 + 80 * Math.sin((deg * Math.PI) / 180)} r="3" fill="#D4A017" opacity="0.2" />
    ))}
  </svg>
);

/* ═══════════════════════════════════════════════════
   Main Landing Page
   ═══════════════════════════════════════════════════ */

const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Animated counters for stats bar */
  const counter1 = useCounter(100000, '+', 2.5);
  const counter2 = useCounter(25000, '+', 2);
  const counter3 = useCounter(8, '+', 1.5);
  const counter4 = useCounter(100, '%', 1);

  /* Scroll-aware navbar + progress bar */
  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 40);
      const bar = document.querySelector('.scroll-progress-bar') as HTMLElement;
      if (bar) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${docHeight > 0 ? scrollTop / docHeight : 0})`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on nav click */
  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

  /* ── Intersection Observer for scroll reveal ─────── */
  useEffect(() => {
    const revealElements = containerRef.current?.querySelectorAll('.gs-reveal, .gs-scale, .stagger-children');
    if (!revealElements) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));

    // Hero animations — trigger immediately after mount
    const heroContent = containerRef.current?.querySelector('.hero-content');
    const heroVisual = containerRef.current?.querySelector('.hero-visual');
    requestAnimationFrame(() => {
      heroContent?.classList.add('revealed');
      heroVisual?.classList.add('revealed');
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page" ref={containerRef}>
      {/* Scroll progress bar */}
      <div className="scroll-progress-bar" />

      {/* ═══ Navigation ═══ */}
      <nav className={`landing-nav ${navScrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Namma Naidu" />
          <span>
            <span className="brand-green">Namma</span>{' '}
            <span className="brand-gold">Naidu</span>
          </span>
        </Link>

        <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#subcastes" onClick={closeMobile}>Sub-Castes</a>
          <a href="#how-it-works" onClick={closeMobile}>How It Works</a>
          <a href="#profiles" onClick={closeMobile}>Profiles</a>
          <a href="#pricing" onClick={closeMobile}>Pricing</a>
          <a href="#stories" onClick={closeMobile}>Stories</a>
        </div>

        <div className="nav-auth">
          <Link to="/login" className="btn-login">Login</Link>
          <Link to="/register" className="btn-register">Register Free</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`nav-hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ═══ Hero Section ═══ */}
      <section className="hero-section">
        <FloatingParticles />

        <div className="kolam-corner top-left"><KolamCornerSVG /></div>
        <div className="kolam-corner bottom-right"><KolamCornerSVG /></div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Trusted by 1 Lakh+ Naidu Families
          </div>
          <h1>
            Find Your <span className="green">Perfect</span>{' '}
            <span className="gold-text">Life Partner</span>
          </h1>
          <p className="hero-desc">
            South India's most trusted Naidu community matrimony platform.
            We honour tradition while using modern technology to help you find
            your soulmate within the Naidu community.
          </p>

          <div className="hero-cta">
            <Link to="/register" className="btn-cta-primary">
              <span>Register Free</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <a href="#how-it-works" className="btn-cta-secondary">How It Works</a>
          </div>

          <div className="hero-trust">
            <div className="trust-avatars">
              {['P', 'S', 'M', 'K'].map((l, i) => (
                <div key={i} className="trust-avatar" style={{ zIndex: 4 - i }}>{l}</div>
              ))}
            </div>
            <span>
              <strong>25,000+</strong> couples matched successfully
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-frame">
            <img
              src="/krishna-radha.png"
              alt="Krishna and Radha"
            />
            <div className="hero-image-overlay">
              <h3>Naidu Soulmates</h3>
              <p>Where Tradition Meets Modern Matchmaking</p>
            </div>
          </div>

          {/* Floating stat chips */}
          <div className="hero-chip chip-top">
            <span className="chip-icon">🛡️</span>
            <div>
              <strong>100% Verified</strong>
              <small>Government ID checked</small>
            </div>
          </div>
          <div className="hero-chip chip-bottom">
            <span className="chip-icon">💍</span>
            <div>
              <strong>25K+ Marriages</strong>
              <small>And counting...</small>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Stats Bar ═══ */}
      <section className="stats-bar">
        <div className="stat-item">
          <div className="stat-number" ref={counter1.ref}>{counter1.display}</div>
          <div className="stat-label">Verified Profiles</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-number" ref={counter2.ref}>{counter2.display}</div>
          <div className="stat-label">Successful Matches</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-number" ref={counter3.ref}>{counter3.display}</div>
          <div className="stat-label">Naidu Sub-Castes</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-number" ref={counter4.ref}>{counter4.display}</div>
          <div className="stat-label">Privacy Protected</div>
        </div>
      </section>

      {/* ═══ Naidu Sub-Castes ═══ */}
      <section className="landing-section bg-soft" id="subcastes">
        <div className="torana-border" />
        <div className="section-header gs-reveal">
          <span className="section-tag">Our Community</span>
          <h2>
            Browse by <span className="accent">Naidu</span>{' '}
            <span className="gold-text">Sub-Caste</span>
          </h2>
          <div className="kolam-divider" />
          <p>Find matches specifically within your sub-community. Each sub-caste has thousands of verified profiles waiting for you.</p>
        </div>

        <div className="subcaste-grid stagger-children">
          {subCastes.map((sc) => (
            <Link to="/register" key={sc.name} className="subcaste-card">
              <div className="sc-icon">{sc.icon}</div>
              <div className="sc-name">{sc.name}</div>
              <div className="sc-count">{sc.count} Profiles</div>
              <div className="sc-desc">{sc.desc}</div>
              <div className="sc-arrow">→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section className="landing-section" id="how-it-works">
        <div className="section-header gs-reveal">
          <span className="section-tag">Simple Process</span>
          <h2>How <span className="accent">It</span> Works</h2>
          <div className="kolam-divider" />
          <p>Three simple steps to find your perfect life partner from the Naidu community.</p>
        </div>

        <div className="steps-container stagger-children">
          {[
            { icon: '📝', num: '01', title: 'Create Your Profile', desc: 'Register for free and fill in your family details, preferences, education, and horoscope information. It takes just 5 minutes.' },
            { icon: '🔍', num: '02', title: 'Find Your Match', desc: 'Browse verified profiles from your specific Naidu sub-caste. Use smart filters for age, education, profession, and location.' },
            { icon: '💐', num: '03', title: 'Connect & Marry', desc: 'Send interest, chat securely, and let your families take it forward. We\'ve helped 25,000+ couples find each other.' },
          ].map((step) => (
            <div className="step-card" key={step.num}>
              <div className="step-icon">{step.icon}</div>
              <div className="step-number">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Why Choose Us ═══ */}
      <section className="landing-section bg-soft">
        <div className="torana-border" />
        <div className="section-header gs-reveal">
          <span className="section-tag">Our Promise</span>
          <h2>Why Families <span className="accent">Trust</span> Us</h2>
          <div className="kolam-divider" />
          <p>Built specifically for the Naidu community with features that matter to your family.</p>
        </div>

        <div className="features-grid stagger-children">
          {[
            { icon: '🛡️', title: '100% Verified Profiles', desc: 'Every profile is manually verified with government ID and phone number. No fake profiles, guaranteed.' },
            { icon: '🏛️', title: 'Community Specific', desc: 'Exclusively for Naidu families. Filter by sub-caste, gothram, native place, and family values.' },
            { icon: '🔒', title: 'Privacy First', desc: 'Control who sees your photos and contact details. Advanced privacy controls for your peace of mind.' },
            { icon: '🤝', title: 'Trusted by Families', desc: 'Over 1 lakh Naidu families registered. South India\'s most trusted community matrimony platform.' },
            { icon: '📊', title: 'Smart Compatibility', desc: 'Our AI matching engine scores compatibility across 15+ parameters including horoscope, education & values.' },
            { icon: '💬', title: '24/7 Support', desc: 'Dedicated relationship advisors and customer support available round the clock via chat, email & phone.' },
          ].map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Featured Profiles ═══ */}
      <section className="landing-section" id="profiles">
        <div className="section-header gs-reveal">
          <span className="section-tag">Premium Members</span>
          <h2>Featured <span className="gold-text">Premium</span> Profiles</h2>
          <div className="kolam-divider" />
          <p>Hand-picked verified profiles from the Naidu community. Register to see more.</p>
        </div>

        <div className="profiles-row stagger-children">
          {mockProfiles.map((p) => (
            <div className="profile-card" key={p.name}>
              <div className="profile-badge">{p.match} Match</div>
              <img src={p.img} alt={p.name} loading="lazy" />
              <div className="profile-info">
                <h4>{p.name}, {p.age}</h4>
                <p>{p.profession} • {p.city}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="section-cta gs-reveal">
          <Link to="/register" className="btn-cta-primary">
            <span>View All Profiles</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* ═══ Success Stories ═══ */}
      <section className="landing-section bg-cream" id="stories">
        <div className="section-header gs-reveal">
          <span className="section-tag">Real Stories</span>
          <h2>Our <span className="accent">Success</span> Stories</h2>
          <div className="kolam-divider" />
          <p>Real couples, real stories from the Naidu community.</p>
        </div>

        <div className="testimonials-grid stagger-children">
          {testimonials.map((t) => (
            <div className="testimonial-card" key={t.names}>
              <div className="quote-icon">"</div>
              <div className="stars">{'★'.repeat(t.rating)}</div>
              <p className="quote">{t.quote}</p>
              <div className="couple-info">
                <div className="couple-avatar">{t.initials}</div>
                <div className="couple-details">
                  <h4>{t.names}</h4>
                  <p>{t.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Pricing ═══ */}
      <section className="landing-section" id="pricing">
        <div className="section-header gs-reveal">
          <span className="section-tag">Plans & Pricing</span>
          <h2>Membership <span className="gold-text">Plans</span></h2>
          <div className="kolam-divider" />
          <p>Choose the plan that fits your matchmaking journey.</p>
        </div>

        <div className="pricing-grid stagger-children">
          {pricingPlans.map((plan) => (
            <div className={`pricing-card ${plan.popular ? 'popular' : ''}`} key={plan.name}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <h3>{plan.name}</h3>
              <div className="price">
                {plan.price}
                {plan.period && <span>{plan.period}</span>}
              </div>
              <div className="price-sub">{plan.subtitle}</div>
              <ul className="pricing-features">
                {plan.features.map((f) => (
                  <li key={f}><span className="check">✓</span> {f}</li>
                ))}
              </ul>
              <Link to="/register" className="btn-pricing">
                {plan.popular ? 'Get Started' : 'Choose Plan'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Final CTA ═══ */}
      <section className="final-cta-section">
        <div className="final-cta-content gs-scale">
          <h2>Ready to Find Your <span className="gold-text">Soulmate</span>?</h2>
          <p>Join 1 lakh+ Naidu families who trust us for their most important decision.</p>
          <div className="final-cta-buttons">
            <Link to="/register" className="btn-cta-primary large">
              <span>Register Free Today</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link to="/login" className="btn-cta-secondary">Already a Member? Login</Link>
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="landing-footer">
        <div className="torana-border" />
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="nav-logo" style={{ marginBottom: '0.75rem' }}>
              <img src={logo} alt="Namma Naidu" />
              <span>
                <span className="brand-green">Namma</span>{' '}
                <span className="brand-gold">Naidu</span>
              </span>
            </Link>
            <p>South India's most trusted Naidu community matrimony service. Helping thousands of families find the perfect life partner through tradition, trust, and technology.</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/login">Member Login</Link></li>
              <li><Link to="/register">Register Free</Link></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/success-stories">Success Stories</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-use">Terms of Use</Link></li>
              <li><Link to="/security-tips">Security Tips</Link></li>
              <li><Link to="/cookie-policy">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Namma Naidu Matrimony. All rights reserved.</p>
          <p>Trusted Naidu Community Matrimony &bull; Premium Matchmaking for Perfect Life Partners</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
