import React from 'react';
import { Gavel, AlertCircle, HeartHandshake, Home, Coins, ArrowUpRight } from 'lucide-react';
import './PracticeAreas.css';

export default function PracticeAreas({ setActiveTab }) {
  const areas = [
    {
      id: 'criminal',
      title: 'Criminal Cases',
      icon: <Gavel className="area-icon" size={28} />,
      desc: 'Expert representation for criminal matters including regular & anticipatory bail, trials, appeals, revision petitions, and defense strategy.',
      statutes: ['Bhartiya Nyaya Sanhita (BNS) / IPC', 'Bhartiya Nagarik Suraksha Sanhita (BNSS) / CrPC', 'Bhartiya Sakshya Adhiniyam (BSA) / Evidence Act'],
      remedies: ['Bail Applications', 'Trial Defense', 'FIR Quashing', 'Criminal Appeals']
    },
    {
      id: 'check-bounce',
      title: '138 NI Act Check Bounce',
      icon: <AlertCircle className="area-icon" size={28} />,
      desc: 'Legal counsel for check bounce disputes, helping corporate and individual clients in speedy debt recovery, legal notices, and defense proceedings.',
      statutes: ['Section 138 of Negotiable Instruments Act, 1881', 'Summary Suit (Order 37, CPC)'],
      remedies: ['Legal Notice Drafting', 'Criminal Prosecution', 'Settlement Mediation', 'Defense Representation']
    },
    {
      id: 'matrimonial',
      title: 'Matrimonial Matters',
      icon: <HeartHandshake className="area-icon" size={28} />,
      desc: 'Compassionate and assertive legal support for family disputes, mutual/contested divorce, child custody, and domestic violence.',
      statutes: ['Hindu Marriage Act, 1955', 'Special Marriage Act, 1954', 'Protection of Women from Domestic Violence Act, 2005'],
      remedies: ['Divorce Petitions', 'Child Custody Claims', 'Protection Orders', 'Mediation Counsel']
    },
    {
      id: 'civil',
      title: 'Civil Disputes',
      icon: <Home className="area-icon" size={28} />,
      desc: 'Resolving complex civil litigation related to property, partition suits, recovery of money, land acquisition, execution of wills, and specific performance of contracts.',
      statutes: ['Code of Civil Procedure (CPC), 1908', 'Specific Relief Act, 1963', 'Indian Succession Act, 1925'],
      remedies: ['Partition Suits', 'Injunction Claims', 'Specific Performance Suit', 'Wills & Probate Probate']
    },
    {
      id: 'alimony',
      title: 'Alimony & Maintenance',
      icon: <Coins className="area-icon" size={28} />,
      desc: 'Securing fair alimony and maintenance for spouses and children to ensure post-matrimonial financial stability.',
      statutes: ['Section 125 of CrPC / BNSS Section 144', 'Section 24 & 25 of Hindu Marriage Act', 'HMA Maintenance pendente lite'],
      remedies: ['Monthly Maintenance Claims', 'Interim Alimony Petitions', 'Execution of Maintenance Orders', 'Alimony Enhancements']
    }
  ];

  return (
    <section className="practice-section" id="practice-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-subtitle">Areas of Practice</span>
          <h2 className="section-title center">Comprehensive Legal Services</h2>
          <p className="section-desc">
            Providing tailored litigation strategies and advisory across key divisions of Indian Law.
          </p>
        </div>

        <div className="practice-grid">
          {areas.map((area) => (
            <div key={area.id} className="practice-card">
              <div className="card-top">
                <div className="icon-box">
                  {area.icon}
                </div>
                <h3 className="card-title">{area.title}</h3>
              </div>
              
              <p className="card-desc">{area.desc}</p>
              
              <div className="card-details">
                <div className="detail-group">
                  <h4>Key Governing Laws:</h4>
                  <ul>
                    {area.statutes.map((statute, idx) => (
                      <li key={idx}>{statute}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="detail-group">
                  <h4>Typical Services:</h4>
                  <div className="tags-wrapper">
                    {area.remedies.map((remedy, idx) => (
                      <span key={idx} className="remedy-tag">{remedy}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button 
                  onClick={() => {
                    const contactSec = document.getElementById('contact-section');
                    if (contactSec) {
                      contactSec.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      setActiveTab('contact');
                    }
                  }} 
                  className="card-cta-btn"
                >
                  <span>Request Advice</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
