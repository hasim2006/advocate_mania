import React, { useState, useEffect, useCallback } from 'react';
import { Users, FileText, CheckSquare, Calendar, MailOpen, Trash2, ArrowUpRight, BarChart2, Lock } from 'lucide-react';
import './Dashboard.css';

const DASHBOARD_PIN_KEY = 'advocate_dashboard_pin';
const DEFAULT_PIN = '1234'; // Change this or move to env var in production

// Default seed inquiries
const defaultInquiries = [
  {
    id: 'seed-1',
    name: 'Ravi Prakash Tiwari',
    phone: '9845120367',
    email: 'ravi.tiwari@gmail.com',
    subject: 'Urgent Anticipatory Bail Query',
    message: 'Need legal representation in an anticipated criminal matter. An FIR might be registered against us in Ballia. Please advise.',
    date: '04 Jun 2026, 11:20 AM',
    status: 'unread'
  },
  {
    id: 'seed-2',
    name: 'Priyanka Pandey',
    phone: '9167234589',
    email: 'priyapan@outlook.com',
    subject: 'Matrimonial Maintenance Dispute',
    message: 'Seeking legal assistance for filing maintenance and child custody petition. Want to understand Section 125 procedure.',
    date: '03 Jun 2026, 04:15 PM',
    status: 'resolved'
  },
  {
    id: 'seed-3',
    name: 'Manoj Kumar Gupta',
    phone: '8877553311',
    email: 'manoj.gupta@shoptail.com',
    subject: 'Sec 138 Check Bounce notice query',
    message: 'A client check of ₹3.5 Lakhs has bounced due to insufficient funds. The bank memo was received 10 days ago. Need to send legal notice.',
    date: '02 Jun 2026, 09:30 AM',
    status: 'unread'
  }
];

const upcomingHearings = [
  { id: 1, caseTitle: 'State of U.P. vs. Ramesh Yadav', court: 'Sessions Court, Ballia', date: '06 Jun 2026', time: '10:30 AM', type: 'Bail Hearing (BNS 115)' },
  { id: 2, caseTitle: 'Karan Singh vs. Verma Traders', court: 'Chief Judicial Magistrate Court, Ballia', date: '09 Jun 2026', time: '11:45 AM', type: '138 NI Act (Cross-Examination)' },
  { id: 3, caseTitle: 'Suman Gupta vs. Rajesh Gupta', court: 'Family Court, Ballia', date: '12 Jun 2026', time: '02:00 PM', type: 'Maintenance Petition (Sec 125)' },
  { id: 4, caseTitle: 'Aditya Mishra vs. Nagar Palika Ballia', court: 'Civil Court (Senior Division), Ballia', date: '16 Jun 2026', time: '12:30 PM', type: 'Permanent Injunction Trial' }
];

export default function Dashboard() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard state (all hooks must be declared before any conditional return)
  const [inquiries, setInquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('inquiries');
  const [metrics, setMetrics] = useState({
    totalInquiries: 0,
    activeCases: 28,
    resolutions: 485,
    pendingHearings: 6
  });

  // Check session auth on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(DASHBOARD_PIN_KEY);
    if (saved === 'authenticated') setIsAuthenticated(true);
  }, []);

  const loadInquiries = useCallback(() => {
    let stored = localStorage.getItem('advocate_inquiries');
    if (!stored) {
      localStorage.setItem('advocate_inquiries', JSON.stringify(defaultInquiries));
      stored = JSON.stringify(defaultInquiries);
    }
    const parsed = JSON.parse(stored);
    setInquiries(parsed);
    setMetrics(prev => ({
      ...prev,
      totalInquiries: parsed.length
    }));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadInquiries();

    const handleSync = () => {
      loadInquiries();
    };
    window.addEventListener('inquiry_submitted', handleSync);
    return () => window.removeEventListener('inquiry_submitted', handleSync);
  }, [isAuthenticated, loadInquiries]);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    const expectedPin = import.meta.env.VITE_DASHBOARD_PIN || DEFAULT_PIN;
    if (pinInput === expectedPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem(DASHBOARD_PIN_KEY, 'authenticated');
    } else {
      setAuthError('Incorrect PIN. Please try again.');
      setPinInput('');
    }
  };

  const toggleInquiryStatus = (id) => {
    const updated = inquiries.map(inq => {
      if (inq.id === id) {
        return { ...inq, status: inq.status === 'unread' ? 'resolved' : 'unread' };
      }
      return inq;
    });
    localStorage.setItem('advocate_inquiries', JSON.stringify(updated));
    setInquiries(updated);
  };

  const deleteInquiry = (id) => {
    const updated = inquiries.filter(inq => inq.id !== id);
    localStorage.setItem('advocate_inquiries', JSON.stringify(updated));
    setInquiries(updated);
    setMetrics(prev => ({
      ...prev,
      totalInquiries: updated.length
    }));
  };

  // Compute analytics distribution
  const analyticsData = {
    'Criminal Defense': inquiries.filter(inq => inq.subject.toLowerCase().includes('bail') || inq.subject.toLowerCase().includes('criminal') || inq.message.toLowerCase().includes('bail') || inq.message.toLowerCase().includes('criminal')).length + 8,
    '138 NI Act Check': inquiries.filter(inq => inq.subject.toLowerCase().includes('bounce') || inq.subject.toLowerCase().includes('138') || inq.message.toLowerCase().includes('check')).length + 12,
    'Matrimonial & Family': inquiries.filter(inq => inq.subject.toLowerCase().includes('maintenance') || inq.subject.toLowerCase().includes('divorce') || inq.message.toLowerCase().includes('maintenance') || inq.message.toLowerCase().includes('divorce')).length + 15,
    'Civil Disputes': inquiries.filter(inq => !inq.subject.toLowerCase().includes('bail') && !inq.subject.toLowerCase().includes('bounce') && !inq.subject.toLowerCase().includes('divorce') && !inq.subject.toLowerCase().includes('maintenance')).length + 10
  };

  const totalAnalytics = Object.values(analyticsData).reduce((a, b) => a + b, 0);

  // Auth gate
  if (!isAuthenticated) {
    return (
      <section className="dashboard-section" id="dashboard-section">
        <div className="container" style={{ maxWidth: '420px', margin: '6rem auto', textAlign: 'center' }}>
          <div style={{ padding: '3rem 2rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
            <Lock size={40} style={{ color: 'var(--accent-color)', marginBottom: '1rem' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Dashboard Access</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Enter the practice PIN to access client inquiries and case analytics.</p>
            <form onSubmit={handlePinSubmit}>
              <input
                type="password"
                className="form-control"
                placeholder="Enter PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.3rem', marginBottom: '1rem' }}
                autoFocus
              />
              {authError && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{authError}</p>}
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Unlock Dashboard</button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section" id="dashboard-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-subtitle">Management Console</span>
          <h2 className="section-title center">Practice Analytics & Dashboard</h2>
          <p className="section-desc">
            An entrepreneurial view of active operations, case calendar schedule, and inbound website client queries (Local Sync Enabled).
          </p>
        </div>

        {/* Analytics Metric Cards Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Website Queries</span>
              <Users size={20} className="metric-icon col-queries" />
            </div>
            <div className="metric-value">{metrics.totalInquiries}</div>
            <div className="metric-trend text-success">
              <span>Synchronized Locally</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Active Litigation Cases</span>
              <FileText size={20} className="metric-icon col-cases" />
            </div>
            <div className="metric-value">{metrics.activeCases}</div>
            <div className="metric-trend text-neutral">
              <span>District Court, Ballia</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Resolved Settlements</span>
              <CheckSquare size={20} className="metric-icon col-resolutions" />
            </div>
            <div className="metric-value">{metrics.resolutions}</div>
            <div className="metric-trend text-success">
              <span>Success Ratio 92%</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Upcoming Hearings</span>
              <Calendar size={20} className="metric-icon col-hearings" />
            </div>
            <div className="metric-value">{metrics.pendingHearings}</div>
            <div className="metric-trend text-warning">
              <span>Next 7 Days Timeline</span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs & Work Space */}
        <div className="dashboard-workspace">
          <div className="workspace-tabs">
            <button 
              className={`workspace-tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
              onClick={() => setActiveTab('inquiries')}
            >
              Inbound Inquiries ({inquiries.filter(i => i.status === 'unread').length} Unread)
            </button>
            <button 
              className={`workspace-tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              Hearing Calendar (Next Hearings)
            </button>
            <button 
              className={`workspace-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Case Category Analytics
            </button>
          </div>

          <div className="workspace-content">
            {/* INQUIRIES TAB */}
            {activeTab === 'inquiries' && (
              <div className="queries-tab-view">
                {inquiries.length === 0 ? (
                  <div className="empty-workspace text-center">
                    <p>No queries found. Fill out the Contact Form to test syncing!</p>
                  </div>
                ) : (
                  <div className="queries-list">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className={`query-item-card ${inq.status}`}>
                        <div className="query-card-top">
                          <div className="query-client-info">
                            <span className="client-name">{inq.name}</span>
                            <span className="client-meta">📞 {inq.phone} | ✉️ {inq.email}</span>
                          </div>
                          <span className="query-date">{inq.date}</span>
                        </div>

                        <div className="query-card-body">
                          <h4 className="query-subject">{inq.subject}</h4>
                          <p className="query-message">{inq.message}</p>
                        </div>

                        <div className="query-card-actions">
                          <button 
                            onClick={() => toggleInquiryStatus(inq.id)} 
                            className={`btn btn-sm ${inq.status === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
                          >
                            {inq.status === 'unread' ? 'Mark Resolved' : 'Mark Unread'}
                          </button>
                          <button 
                            onClick={() => deleteInquiry(inq.id)} 
                            className="btn btn-secondary btn-sm btn-delete-query"
                            title="Delete Inquiry"
                            aria-label="Delete Inquiry"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* HEARING CALENDAR TAB */}
            {activeTab === 'calendar' && (
              <div className="calendar-tab-view">
                <div className="calendar-timeline">
                  {upcomingHearings.map((hearing) => (
                    <div key={hearing.id} className="timeline-item">
                      <div className="timeline-badge-date">
                        <span className="hearing-date-text">{hearing.date}</span>
                        <span className="hearing-time-text">{hearing.time}</span>
                      </div>
                      <div className="timeline-item-content">
                        <h4 className="hearing-title-text">{hearing.caseTitle}</h4>
                        <p className="hearing-court-text">{hearing.court}</p>
                        <span className="hearing-type-badge">{hearing.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PRACTICE ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div className="analytics-tab-view">
                <h4 className="analytics-view-title">
                  <BarChart2 size={18} /> Inbound Matter Distribution (Interactive CSS Visual)
                </h4>
                
                <div className="charts-container">
                  {Object.entries(analyticsData).map(([key, value]) => {
                    const percentage = Math.round((value / totalAnalytics) * 100);
                    return (
                      <div key={key} className="chart-bar-group">
                        <div className="bar-label-info">
                          <span className="bar-label-name">{key}</span>
                          <span className="bar-label-percentage">{percentage}% ({value} inquiries)</span>
                        </div>
                        <div className="bar-outer-frame">
                          <div 
                            className="bar-inner-fill" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="analytics-disclaimer-box">
                  <p><strong>Note on Analytics Data:</strong> Percentages incorporate website form actions dynamically alongside typical historical court files under Advocate Shivam Chaturvedi.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
