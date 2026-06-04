import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PracticeAreas from './components/PracticeAreas';
import CaseStudies from './components/CaseStudies';
import Dashboard from './components/Dashboard';
import ContactForm from './components/ContactForm';
import HelplinePanel from './components/HelplinePanel';
import { Award, Briefcase, GraduationCap, Scale, ShieldAlert, CheckCircle2 } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState('light');
  const [cookieConsent, setCookieConsent] = useState(false);
  const [showConsentBanner, setShowConsentBanner] = useState(false);

  // Initialize Theme and Cookie Consent
  useEffect(() => {
    // Theme setup
    const savedTheme = localStorage.getItem('advocate_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Cookie consent setup
    const consent = localStorage.getItem('advocate_cookie_consent');
    if (!consent) {
      // Show consent banner after a short delay
      setTimeout(() => setShowConsentBanner(true), 1500);
    } else {
      setCookieConsent(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('advocate_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleAcceptCookies = () => {
    localStorage.setItem('advocate_cookie_consent', 'accepted');
    setCookieConsent(true);
    setShowConsentBanner(false);
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('advocate_cookie_consent', 'declined');
    setShowConsentBanner(false);
  };

  return (
    <div className="app-container">
      {/* Top Bar Council Compliance Banner */}
      <div className="legal-disclaimer-bar">
        <strong>Compliance Notice:</strong> As per the rules of the Bar Council of India, advocates are restricted from advertising or soliciting work. This website contains general information for informational purposes only.
      </div>

      {/* Header Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* Main Sections */}
      <main className="main-content">
        {activeTab === 'home' && (
          <div className="home-view fade-in-enter-active">
            {/* Hero Section */}
            <Hero setActiveTab={setActiveTab} />

            {/* About / Professional Bio Section */}
            <section className="bio-section" id="bio-section" style={{ padding: '6rem 0', backgroundColor: 'var(--bg-primary)' }}>
              <div className="container">
                <div className="section-header text-center" style={{ marginBottom: '4rem' }}>
                  <span className="section-subtitle">Professional Profile</span>
                  <h2 className="section-title center">Credentials & Legal Experience</h2>
                  <p className="section-desc">
                    A dedication to justice, ethical representation, and strategic counsel.
                  </p>
                </div>

                <div className="bio-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '4rem', alignItems: 'center' }}>
                  <div className="bio-text" style={{ textAlign: 'left' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', marginBottom: '1.25rem' }}>
                      Advocate Shivam Chaturvedi
                    </h3>
                    <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                      Practicing at the District & Sessions Court, Ballia, Uttar Pradesh. He has represented clients across critical litigation verticals—defense in complex criminal trials, securing remedies in 138 NI Act check bounces, and protecting domestic rights in matrimonial and maintenance disputes.
                    </p>
                    <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                      He believes in transparent and honest client relationships. Every case is handled with meticulous attention to detail, drafting, and local procedural compliance, ensuring that clients are fully briefed at every stage of their litigation journey.
                    </p>

                    <div className="qualifications-box" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="qual-item" style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                        <div style={{ color: 'var(--accent-color)', marginTop: '0.2rem' }}><GraduationCap size={22} /></div>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Academic Credentials</h4>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>LL.B. (Honours) — Prof. Rajendra Singh (Rajju Bhaiya) University, Prayagraj</p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Specialization in Criminal Procedure and Family Law</p>
                        </div>
                      </div>

                      <div className="qual-item" style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                        <div style={{ color: 'var(--accent-color)', marginTop: '0.2rem' }}><Award size={22} /></div>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Bar Admissions & Enrolment</h4>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>Enrolled with the Bar Council of Uttar Pradesh</p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Registration Number: UP/6412/2015</p>
                        </div>
                      </div>

                      <div className="qual-item" style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                        <div style={{ color: 'var(--accent-color)', marginTop: '0.2rem' }}><Briefcase size={22} /></div>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Court Chambers</h4>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>District & Sessions Court Premises, Ballia, U.P.</p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Active practitioner in revenue, civil, and criminal jurisdictions</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bio-visual" style={{ position: 'relative' }}>
                    <div style={{ padding: '2.5rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', textAlign: 'left', boxShadow: 'var(--shadow-md)' }}>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Scale size={20} className="bullet-icon" /> Core Practice Ethics
                      </h3>
                      
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
                          <CheckCircle2 size={16} style={{ color: 'var(--success-color)', flexShrink: 0, marginTop: '0.2rem' }} />
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Zero Placeholder Representation:</strong> We review case files with direct personal attention.</span>
                        </li>
                        <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
                          <CheckCircle2 size={16} style={{ color: 'var(--success-color)', flexShrink: 0, marginTop: '0.2rem' }} />
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Full Compliance:</strong> Strictly bounded by the Professional Ethics standards under Bar Council Rules.</span>
                        </li>
                        <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
                          <CheckCircle2 size={16} style={{ color: 'var(--success-color)', flexShrink: 0, marginTop: '0.2rem' }} />
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Confidential Counsel:</strong> Complete protection of client briefs, records, and disclosures.</span>
                        </li>
                      </ul>

                      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                          * Under Section 126 of the Indian Evidence Act, 1872, all communication between a client and their registered advocate is protected by professional privilege.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Practice Areas preview */}
            <PracticeAreas setActiveTab={setActiveTab} />
            
            {/* Case Studies preview */}
            <CaseStudies />

            {/* Contact Form preview */}
            <ContactForm />
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="practice-view fade-in-enter-active">
            <PracticeAreas setActiveTab={setActiveTab} />
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="cases-view fade-in-enter-active">
            <CaseStudies />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="dashboard-view fade-in-enter-active">
            <Dashboard />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="contact-view fade-in-enter-active">
            <ContactForm />
          </div>
        )}
      </main>

      {/* Floating Action Helpline / Support Panel */}
      <HelplinePanel />

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container container">
          <div className="footer-grid">
            <div className="footer-col footer-about">
              <h3>Shivam Chaturvedi Law Chambers</h3>
              <p>
                Providing honest, compliant, and strategic litigation counsel at the District & Sessions Court, Ballia, Uttar Pradesh. Specializing in bail, trials, NI Act recoveries, family disputes, and partition suits.
              </p>
              <div className="footer-socials">
                <a href="#" className="social-link" aria-label="LinkedIn Profile"><Scale size={18} /></a>
                <a href="#" className="social-link" aria-label="Bar Council Listing"><Award size={18} /></a>
              </div>
            </div>

            <div className="footer-col">
              <h3>Quick Navigation</h3>
              <div className="footer-links-list">
                <button className="footer-link-btn" onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home & Bio</button>
                <button className="footer-link-btn" onClick={() => { setActiveTab('practice'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Practice Areas</button>
                <button className="footer-link-btn" onClick={() => { setActiveTab('cases'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Indian Case Flow</button>
                <button className="footer-link-btn" onClick={() => { setActiveTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Practice Dashboard</button>
                <button className="footer-link-btn" onClick={() => { setActiveTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Contact Chambers</button>
              </div>
            </div>

            <div className="footer-col">
              <h3>BCI Disclaimer</h3>
              <p className="footer-disclaimer-text">
                The rules of the Bar Council of India do not permit advertisement or solicitation. By browsing this website, the user acknowledges that they are seeking information of their own accord and that no advocate-client relationship is created through any material here. The contents are not legal opinions or counsel.
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Shivam Chaturvedi Law Chambers. All Rights Reserved. Ballia, UP.</p>
            <div className="footer-legal-links">
              <button className="legal-sub-link" onClick={() => alert('Privacy Policy: All inquiries are processed locally. No personal data is shared with third-party networks.')}>Privacy Policy</button>
              <button className="legal-sub-link" onClick={() => alert('Disclaimer Notice: The information on this site is not a substitute for professional legal advice.')}>Terms & Disclaimers</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie & Privacy Consent Banner */}
      {showConsentBanner && (
        <div className="cookie-consent-overlay">
          <div className="cookie-container container">
            <div className="cookie-text">
              <p>We value your privacy. This website uses minimal local browser storage to manage your layout preference and sync contact inquiries.</p>
              <span>By clicking "Accept", you consent to our privacy terms and local storage utilization.</span>
            </div>
            <div className="cookie-actions">
              <button className="btn btn-secondary btn-sm" onClick={handleDeclineCookies}>Decline</button>
              <button className="btn btn-primary btn-sm" onClick={handleAcceptCookies}>Accept & Allow</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
