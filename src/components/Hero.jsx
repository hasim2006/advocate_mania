import React from 'react';
import { Award, CheckCircle, Scale, ShieldAlert, ArrowRight } from 'lucide-react';
import './Hero.css';

export default function Hero({ setActiveTab }) {
  const advocateName = import.meta.env.VITE_ADVOCATE_NAME || 'Shivam Chaturvedi';
  const nameUpper = advocateName.toUpperCase();

  return (
    <section className="hero">
      <div className="hero-container container">
        <div className="hero-content">

          <h1 className="hero-title">
            Advocate <span className="highlight-text">{advocateName}</span>
          </h1>
          <p className="hero-subtitle">
            Senior Counsel & Litigator practicing at Ballia District Courts, Uttar Pradesh. Committed to delivering strategic representation in Criminal Defense, Check Bounce Matters, Matrimonial Disputes, and Civil Litigation.
          </p>

          <div className="hero-trust-bullets">
            <div className="bullet-item">
              <CheckCircle size={18} className="bullet-icon" />
              <span>1+ Year Litigation Experience</span>
            </div>
            <div className="bullet-item">
              <CheckCircle size={18} className="bullet-icon" />
              <span>Dedicated Helpline Support & Prompt Counsel</span>
            </div>
          </div>

          <div className="hero-actions">
            <button 
              onClick={() => {
                const contactSec = document.getElementById('contact-section');
                if (contactSec) {
                  contactSec.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab('contact');
                }
              }} 
              className="btn btn-primary btn-lg"
            >
              <span>Schedule Consultation</span>
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => {
                const practiceSec = document.getElementById('practice-section');
                if (practiceSec) {
                  practiceSec.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab('practice');
                }
              }} 
              className="btn btn-secondary btn-lg"
            >
              <span>Explore Practice Areas</span>
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="photo-card">
            <div className="photo-frame">
              <img 
                src="/advocate.jpg" 
                alt={`Advocate ${advocateName} in Professional Robes`} 
                className="advocate-photo"
              />
              <div className="photo-glass-overlay">
                <div className="overlay-content">
                  <span className="overlay-title">{nameUpper}</span>
                  <span className="overlay-subtitle">District & Sessions Court, Ballia</span>
                </div>
              </div>
            </div>
            <div className="gold-accent-border border-top-right"></div>
            <div className="gold-accent-border border-bottom-left"></div>
          </div>

          {/* Animated scales of justice background icon */}
          <div className="animated-scales-container">
            <svg 
              className="animated-scales" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Pillar/Base */}
              <path d="M50 85V20" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round"/>
              <path d="M35 85H65" stroke="var(--accent-color)" strokeWidth="4" strokeLinecap="round"/>
              <path d="M45 20H55" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round"/>
              
              {/* Beam (tilts dynamically using CSS keyframes) */}
              <g className="scales-beam">
                <path d="M20 30H80" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round"/>
                
                {/* Left Pan */}
                <g className="left-pan">
                  <path d="M20 30L12 55H28L20 30Z" stroke="var(--accent-color)" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M12 55C12 60 28 60 28 55" stroke="var(--accent-color)" strokeWidth="2"/>
                </g>
                
                {/* Right Pan */}
                <g className="right-pan">
                  <path d="M80 30L72 55H88L80 30Z" stroke="var(--accent-color)" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M72 55C72 60 88 60 88 55" stroke="var(--accent-color)" strokeWidth="2"/>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
