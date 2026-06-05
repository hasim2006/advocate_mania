import React, { useState } from 'react';
import { Shield, Menu, X, Sun, Moon, PhoneCall } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const advocateName = import.meta.env.VITE_ADVOCATE_NAME || 'Shivam Chaturvedi';
  const advocatePhone = import.meta.env.VITE_ADVOCATE_PHONE || '+91 75100 91599';
  const advocatePhoneRaw = import.meta.env.VITE_ADVOCATE_PHONE_RAW || '7510091599';

  const nameParts = advocateName.split(' ');
  const firstName = nameParts[0].toUpperCase();
  const lastNameTitle = (nameParts.slice(1).join(' ') + ' LAW CHAMBERS').toUpperCase();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'practice', label: 'Practice Areas' },
    { id: 'cases', label: 'Case Flow' },
    { id: 'dashboard', label: 'Practice Dashboard' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <div className="navbar-logo" onClick={() => handleNavClick('home')}>
          <div className="logo-icon-wrapper">
            <Shield className="logo-icon" size={24} />
          </div>
          <div className="logo-text">
            <span className="logo-title">{firstName}</span>
            <span className="logo-subtitle">{lastNameTitle}</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-menu-desktop">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right CTA / Controls */}
        <div className="navbar-actions">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme} 
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <a href={`tel:+91${advocatePhoneRaw}`} className="btn btn-primary nav-cta" rel="noopener noreferrer">
            <PhoneCall size={16} />
            <span>{advocatePhone}</span>
          </a>

          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`navbar-menu-mobile ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`mobile-nav-link ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
          <a href={`tel:+91${advocatePhoneRaw}`} className="btn btn-primary mobile-cta" rel="noopener noreferrer">
            <PhoneCall size={16} />
            <span>Call: {advocatePhone}</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
