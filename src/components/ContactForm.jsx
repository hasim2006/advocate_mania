import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, CheckCircle } from 'lucide-react';
import { isValidIndianPhone } from '../utils/sanitize';
import SectionHeader from './SectionHeader';
import { saveInquiry } from '../utils/inquiryService';
import './ContactForm.css';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [practiceArea, setPracticeArea] = useState('Criminal Cases');
  const [message, setMessage] = useState('');
  
  // Consent checkbox
  const [consent, setConsent] = useState(false);
  
  // Validation/Success state
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Form validation
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    
    if (!isValidIndianPhone(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!consent) {
      setError('You must consent to the privacy disclaimer to proceed.');
      return;
    }

    const result = saveInquiry({
      name,
      phone,
      email,
      subject: `Inquiry: ${practiceArea}`,
      message,
    });
    if (!result.success) {
      setError('Failed to save inquiry. Storage may be full — please try again later.');
      return;
    }

    setSubmitted(true);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setConsent(false);
  };

  return (
    <section className="contact-section" id="contact-section">
      <div className="container">
        <SectionHeader
          subtitle="Chambers Connect"
          title="Contact Advocate Shivam Chaturvedi"
          description="Schedule a legal consultation or submit an inquiry to our office in Ballia, Uttar Pradesh."
        />

        <div className="contact-grid">
          {/* Contact Details Column */}
          <div className="contact-info-col">
            <h3 className="info-title">Office Chambers</h3>
            <p className="info-subtitle">
              Practicing primarily at District & Sessions Court, Ballia.
            </p>

            <div className="info-list">
              <div className="info-item">
                <div className="info-icon-box">
                  <MapPin size={20} />
                </div>
                <div className="info-text-box">
                  <h4>Chamber Address</h4>
                  <p>Chamber infront of jm 2 court, Ballia, Uttar Pradesh - 277001</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-box">
                  <Phone size={20} />
                </div>
                <div className="info-text-box">
                  <h4>Telephone Helpline</h4>
                  <p>
                    <a href="tel:+917510091599" className="contact-link">+91 75100 91599</a>
                  </p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-box">
                  <Mail size={20} />
                </div>
                <div className="info-text-box">
                  <h4>Email Correspondence</h4>
                  <p>
                    <a href="mailto:shivamchaturvedi25@gmail.com" className="contact-link">shivamchaturvedi25@gmail.com</a>
                  </p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-box">
                  <Clock size={20} />
                </div>
                <div className="info-text-box">
                  <h4>Business Hours</h4>
                  <p>Monday – Saturday: 10:00 AM – 05:00 PM</p>
                  <p className="text-warning-light">Sundays: Emergency bail requests only.</p>
                </div>
              </div>
            </div>

            {/* Map iframe placeholder centering Ballia, UP */}
            <div className="map-wrapper">
              <iframe
                title="Office Map Location - Ballia Civil Court"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14371.493976214534!2d84.1437111!3d25.7747377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399285eb07469a47%3A0xe54e6057a70ce37d!2sCivil%20Court%20Ballia!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="200"
                style={{ border: 0, borderRadius: 'var(--radius-md)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Form Column */}
          <div className="contact-form-col">
            <div className="form-card">
              <h3 className="form-title">Consultation Request</h3>
              <p className="form-subtitle">
                Please share basic facts of your legal matter. Informational queries only.
              </p>

              {submitted ? (
                <div className="form-success-box text-center">
                  <CheckCircle size={56} className="success-icon" />
                  <h4>Inquiry Successfully Logged!</h4>
                  <p>
                    Thank you, your request has been recorded. Our clerk will contact you on your registered mobile number shortly.
                  </p>
                  <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="actual-form">
                  {error && <div className="form-error-banner">{error}</div>}

                  <div className="form-group">
                    <label className="form-label" htmlFor="client-name">Full Name *</label>
                    <input
                      id="client-name"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rajesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="client-phone">Mobile Number *</label>
                      <input
                        id="client-phone"
                        type="tel"
                        className="form-control"
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="client-email">Email Address (Optional)</label>
                      <input
                        id="client-email"
                        type="email"
                        className="form-control"
                        placeholder="e.g. rajesh@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="case-category">Legal Category</label>
                    <select
                      id="case-category"
                      className="form-control"
                      value={practiceArea}
                      onChange={(e) => setPracticeArea(e.target.value)}
                    >
                      <option value="Criminal Cases">Criminal Case / Bail</option>
                      <option value="138 NI Act Check Bounce">138 NI Act Check Bounce</option>
                      <option value="Matrimonial Matters">Matrimonial / Divorce</option>
                      <option value="Civil Disputes">Civil Dispute</option>
                      <option value="Alimony & Maintenance">Alimony & Maintenance</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="case-details">Brief Case Facts *</label>
                    <textarea
                      id="case-details"
                      className="form-control text-area-control"
                      rows="4"
                      placeholder="Provide a brief summary of the dispute, dates, and court details if any..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      required
                    />
                    <span>
                      I verify that the above information is shared voluntarily, and understand that sending this query does not create an advocate-client relationship.
                    </span>
                  </label>

                  <button type="submit" className="btn btn-primary submit-btn">
                    Submit Query
                  </button>

                  <div className="form-disclaimer-mini">
                    <ShieldCheck size={14} className="disclaimer-icon" />
                    <span>Compliance Check: Communication is confidential under Sec 126 of Indian Evidence Act.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
