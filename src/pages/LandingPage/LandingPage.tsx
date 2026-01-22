import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import logo from '../../assets/images/logoonly.png';

const LandingPage: React.FC = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [cursorOutlinePos, setCursorOutlinePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Smooth follower for cursor outline
    useEffect(() => {
        const followMouse = () => {
            setCursorOutlinePos(prev => ({
                x: prev.x + (mousePos.x - prev.x) * 0.15,
                y: prev.y + (mousePos.y - prev.y) * 0.15
            }));
            requestAnimationFrame(followMouse);
        };
        const animId = requestAnimationFrame(followMouse);
        return () => cancelAnimationFrame(animId);
    }, [mousePos]);

    return (
        <div className="landing-container">
            {/* Custom 3D Cursor */}
            <div
                className="custom-cursor"
                style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
            ></div>
            <div
                className="custom-cursor-outline"
                style={{ left: `${cursorOutlinePos.x - 10}px`, top: `${cursorOutlinePos.y - 10}px` }}
            ></div>

            {/* Background blobs */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>

            {/* Navigation */}
            <nav className="nav">
                <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={logo} alt="Logo" style={{ height: '40px' }} />
                    <span style={{ color: 'var(--text-main)' }}>PERFECT</span> <span style={{ color: 'var(--primary)' }}>MATRIMONY APP</span>
                </div>
                <div className="nav-auth">
                    <Link to="/login" className="btn btn-login">Login</Link>
                    <Link to="/register" className="btn btn-signup">Register Free</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Find Your <span>Perfect</span> Life Partner</h1>
                    <p>
                        The world's most innovative matrimony platform.
                        We combine 3D visualization with advanced matchmaking
                        to help you find "The One".
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
                        <div className="stat-item">
                            <h3 style={{ color: 'var(--primary)', fontSize: '1.8rem' }}>80L+</h3>
                            <p style={{ fontSize: '0.9rem' }}>Success Stories</p>
                        </div>
                        <div className="stat-item" style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
                            <h3 style={{ color: 'var(--primary)', fontSize: '1.8rem' }}>100%</h3>
                            <p style={{ fontSize: '0.9rem' }}>Verified Profiles</p>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="floating-3d-card">
                        <div className="hero-logo-badge">
                            <img src={logo} alt="Logo" />
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1510103757531-9f9361a97d8c?auto=format&fit=crop&q=80&w=800"
                            alt="South Indian Couple"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2.5rem', background: 'linear-gradient(transparent, rgba(164, 19, 237, 0.95))', color: 'white', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: '800' }}>South Indian Soulmates.</h3>
                            <p style={{ color: '#f1f5f9', fontSize: '0.9rem', marginTop: '5px' }}>Where Traditional Values meet Modern Innovation</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Smart Matching Visualization */}
            <section className="section" style={{ background: '#f8fafc' }}>
                <div className="section-header">
                    <h2>Premium Platform Innovation</h2>
                    <p>Experience matchmaking like never before with our signature matching engine.</p>
                </div>

                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="icon-3d">🧠</div>
                        <h3>Cognitive Match</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Our engine understands your personality traits and values to find deeply compatible partners.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-3d">🛡️</div>
                        <h3>Safe & Secure</h3>
                        <p style={{ color: 'var(--text-muted)' }}>100% manual verification and advanced photo privacy controls for your peace of mind.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-3d">📈</div>
                        <h3>Compatibility Score</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Get a detailed 3D visualization of how well you match with someone across 15+ parameters.</p>
                    </div>
                </div>
            </section>

            {/* Premium Profile Showcase */}
            <section className="section">
                <div className="section-header">
                    <h2>Verified Premium Profiles</h2>
                    <p>Hand-picked profiles that match your standards of elegance and success.</p>
                </div>

                <div className="profile-showcase">
                    <div className="profile-card-3d">
                        <div className="match-score-badge">98% Match</div>
                        <img src="https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?auto=format&fit=crop&q=80&w=400&h=600" alt="Karthik" />
                        <div className="profile-info-overlay">
                            <h4>Karthik, 28</h4>
                            <p>Software Architect • Chennai</p>
                        </div>
                    </div>
                    <div className="profile-card-3d">
                        <div className="match-score-badge">95% Match</div>
                        <img src="https://images.unsplash.com/photo-1596433811232-aeffa09794cb?auto=format&fit=crop&q=80&w=400&h=600" alt="Revathi" />
                        <div className="profile-info-overlay">
                            <h4>Revathi, 26</h4>
                            <p>Product Designer • Madurai</p>
                        </div>
                    </div>
                    <div className="profile-card-3d">
                        <div className="match-score-badge">92% Match</div>
                        <img src="https://images.unsplash.com/photo-1620935514040-7e6163f9ebba?auto=format&fit=crop&q=80&w=400&h=600" alt="Vignesh" />
                        <div className="profile-info-overlay">
                            <h4>Vignesh, 30</h4>
                            <p>Data Scientist • Coimbatore</p>
                        </div>
                    </div>
                    <div className="profile-card-3d">
                        <div className="match-score-badge">90% Match</div>
                        <img src="https://images.unsplash.com/photo-1621348880689-f308945625ec?auto=format&fit=crop&q=80&w=400&h=600" alt="Meenakshi" />
                        <div className="profile-info-overlay">
                            <h4>Meenakshi, 27</h4>
                            <p>Chartered Accountant • Trichy</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search by Category */}
            <section className="section" style={{ background: 'var(--bg-soft)' }}>
                <div className="section-header">
                    <h2>Browse by Category</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {[
                        'Tamil Matrimony', 'Telugu Matrimony', 'Hindi Matrimony', 'Kerala Matrimony',
                        'Bengali Matrimony', 'Brahmin Matrimony', 'Rajput Matrimony', 'Christian Matrimony'
                    ].map(cat => (
                        <div key={cat} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', background: 'white', borderRadius: '15px', border: '1.5px solid var(--secondary)', cursor: 'pointer' }}>
                            <span style={{ fontWeight: '600' }}>{cat}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-grid">
                    <div>
                        <div className="logo" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={logo} alt="Logo" style={{ height: '30px' }} />
                            <span style={{ color: 'var(--text-main' }}>PERFECT MATRIMONY APP</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)' }}>
                            India's most trusted and innovative matrimony service.
                            Helping millions find their perfect life partner through
                            advanced technology and human touch.
                        </p>
                    </div>
                    <div className="footer-links">
                        <h4>Need Help?</h4>
                        <ul>
                            <li><a href="#">Member Login</a></li>
                            <li><a href="#">Sign Up</a></li>
                            <li><a href="#">Partner Search</a></li>
                            <li><a href="#">How to use</a></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Shaadi Blog</a></li>
                            <li><a href="#">Success Stories</a></li>
                            <li><a href="#">Contact Us</a></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Privacy & Terms</h4>
                        <ul>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Use</a></li>
                            <li><a href="#">Security Tips</a></li>
                            <li><a href="#">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div style={{ textAlign: 'center', paddingTop: '40px', borderTop: '1px solid #e2e8f0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <p>© 2026 Perfect Matrimony App Platform. All rights reserved.</p>
                    <p style={{ marginTop: '10px' }}>Best Matrimony Website | Premium Matchmaking for Perfect Life Partner</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

