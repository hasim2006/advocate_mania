import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, X, Send, User, ChevronUp } from 'lucide-react';
import { safeGetJSON, safeSetJSON } from '../utils/storage';
import { sanitizeText, isValidIndianPhone, sanitizeForUrl } from '../utils/sanitize';
import './HelplinePanel.css';

export default function HelplinePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('call'); // 'call' or 'chat'
  
  const advocateName = import.meta.env.VITE_ADVOCATE_NAME || 'Shivam Chaturvedi';
  const advocatePhone = import.meta.env.VITE_ADVOCATE_PHONE || '+91 75100 91599';
  const advocatePhoneRaw = import.meta.env.VITE_ADVOCATE_PHONE_RAW || '7510091599';

  // Callback form state
  const [cbName, setCbName] = useState('');
  const [cbPhone, setCbPhone] = useState('');
  const [cbType, setCbType] = useState('Criminal');
  const [cbSubmitted, setCbSubmitted] = useState(false);

  // Chatbot state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: `Namaste! Welcome to ${import.meta.env.VITE_ADVOCATE_NAME || 'Shivam Chaturvedi'} Law Chambers. How can we assist you with your legal matters today?` }
  ]);
  const [userMsg, setUserMsg] = useState('');

  // Scroll to top FAB state
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [cbError, setCbError] = useState('');

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    setCbError('');
    if (!cbName.trim() || !cbPhone.trim()) {
      setCbError('Please fill in your name and phone number.');
      return;
    }
    if (!isValidIndianPhone(cbPhone)) {
      setCbError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    const newInquiry = {
      id: 'cb-' + Date.now(),
      name: sanitizeText(cbName),
      phone: sanitizeText(cbPhone),
      email: 'Requested via Callback Widget',
      subject: `Immediate Callback - ${sanitizeText(cbType)}`,
      message: `Client requested a quick callback regarding ${sanitizeText(cbType)} matters. Contact ASAP.`,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'unread'
    };

    // Save to localStorage so it syncs with Dashboard!
    const existing = safeGetJSON('advocate_inquiries', []);
    if (!safeSetJSON('advocate_inquiries', [newInquiry, ...existing])) {
      console.error('[HelplinePanel] Failed to persist callback request');
      return;
    }

    // Dispatch event to trigger dashboard update if it is open!
    window.dispatchEvent(new Event('inquiry_submitted'));

    setCbSubmitted(true);
    setCbName('');
    setCbPhone('');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userMsg.trim()) return;

    const queryText = userMsg;
    const userMessage = { sender: 'user', text: queryText };
    setChatMessages((prev) => [...prev, userMessage]);
    const typedMsg = queryText.toLowerCase();
    setUserMsg('');

    // Simulated lawyer chatbot replies
    setTimeout(() => {
      let botResponse = '';
      const articleMatch = typedMsg.match(/art(icle)?\s*(\d+)/i);
      
      if (articleMatch) {
        const artNum = parseInt(articleMatch[2], 10);
        if (artNum === 14) {
          botResponse = `Article 14 of the Constitution of India guarantees 'Equality before Law' and 'Equal Protection of Laws' within the territory of India. It prohibits discrimination on arbitrary grounds and ensures reasonable classification in state actions. We invoke Article 14 in writ petitions challenging arbitrary government decisions.`;
        } else if (artNum === 19) {
          botResponse = `Article 19 guarantees six basic freedoms: Freedom of Speech and Expression, Assembly, Association, Movement, Residence, and Practice of any Profession/Trade. These rights are subject to reasonable restrictions like public order, decency, and national security.`;
        } else if (artNum === 21) {
          botResponse = `Article 21 guarantees the 'Protection of Life and Personal Liberty' stating that no person shall be deprived of their life or personal liberty except according to procedure established by law. The Supreme Court has expanded this to include the right to privacy, clean environment, livelihood, free legal aid, and speedy trial. It is the cornerstone of constitutional defense.`;
        } else if (artNum === 22) {
          botResponse = `Article 22 protects against arbitrary arrest and detention. It ensures that an arrested person must be informed of the grounds of arrest, has the right to consult a legal practitioner of choice, and must be produced before a Magistrate within 24 hours of arrest. We heavily rely on this for criminal defense representation.`;
        } else if (artNum === 32) {
          botResponse = `Article 32 gives citizens the 'Right to Constitutional Remedies' by allowing them to petition the Supreme Court of India directly for the enforcement of Fundamental Rights. Under this, the SC can issue writs like Habeas Corpus, Mandamus, Certiorari, Prohibition, and Quo Warranto. Dr. B.R. Ambedkar called it the 'Heart and Soul' of the Constitution.`;
        } else if (artNum === 44) {
          botResponse = `Article 44 is a Directive Principle of State Policy (DPSP) that directs the State to secure a Uniform Civil Code (UCC) for all citizens throughout the territory of India, aiming to replace diverse personal laws with a unified set of family laws.`;
        } else if (artNum === 226) {
          botResponse = `Article 226 empowers the High Courts to issue writs (Habeas Corpus, Mandamus, Certiorari, etc.) for the enforcement of Fundamental Rights and for 'any other purpose' (legal rights violation). It is much broader in scope than Article 32. We draft and file Writ Petitions under Article 226 for administrative and civil remedy claims.`;
        } else if (artNum === 227) {
          botResponse = `Article 227 vests superintendence power over all subordinate courts and tribunals in the High Court. We file petitions under Article 227 to challenge interlocutory orders, jurisdictional errors, or delays in lower courts (like the Civil and Family Courts in Ballia).`;
        } else if (artNum === 300 || typedMsg.includes('300a')) {
          botResponse = `Article 300A protects the 'Right to Property' by declaring that no person shall be deprived of their property save by authority of law. While no longer a Fundamental Right, it remains a vital Constitutional Right frequently invoked in land acquisition, partition, and mutation disputes.`;
        } else if (artNum === 311) {
          botResponse = `Article 311 provides constitutional protection to civil servants of the Union or States. It ensures they cannot be dismissed or reduced in rank by an authority subordinate to that by which they were appointed, and only after an inquiry where they are informed of charges. We represent government employees in departmental inquiry disputes.`;
        } else if (artNum === 370) {
          botResponse = `Article 370 formerly granted temporary special status to the state of Jammu & Kashmir. In August 2019, the President of India issued orders rendering all provisions of Article 370 inoperative, thereby integrating J&K fully with the rest of India. This was upheld by the Supreme Court of India.`;
        } else {
          let partName = "";
          let partTopic = "";
          if (artNum >= 1 && artNum <= 4) {
            partName = "Part I";
            partTopic = "The Union and its Territory";
          } else if (artNum >= 5 && artNum <= 11) {
            partName = "Part II";
            partTopic = "Citizenship rights in India";
          } else if (artNum >= 12 && artNum <= 35) {
            partName = "Part III";
            partTopic = "Fundamental Rights (enforceable by filing writs under Articles 32 or 226)";
          } else if (artNum >= 36 && artNum <= 51) {
            partName = "Part IV";
            partTopic = "Directive Principles of State Policy (non-justiciable state guidelines)";
          } else if (artNum === 51) {
            partName = "Part IV-A";
            partTopic = "Fundamental Duties of Indian citizens";
          } else if (artNum >= 52 && artNum <= 151) {
            partName = "Part V";
            partTopic = "The Union Executive, Parliament, and Union Judiciary (Supreme Court)";
          } else if (artNum >= 152 && artNum <= 237) {
            partName = "Part VI";
            partTopic = "The State Governments, State Legislatures, and High Courts";
          } else if (artNum >= 239 && artNum <= 242) {
            partName = "Part VIII";
            partTopic = "Union Territories administration";
          } else if (artNum >= 243 && artNum <= 243) {
            partName = "Part IX / IX-A";
            partTopic = "Panchayats and Municipalities local self-government rules";
          } else if (artNum >= 245 && artNum <= 263) {
            partName = "Part XI";
            partTopic = "Relations between the Union and the States";
          } else if (artNum >= 264 && artNum <= 300) {
            partName = "Part XII";
            partTopic = "Finance, Property, Contracts, and Civil suits against government";
          } else if (artNum >= 301 && artNum <= 307) {
            partName = "Part XIII";
            partTopic = "Trade, Commerce, and Intercourse within the territory of India";
          } else if (artNum >= 308 && artNum <= 323) {
            partName = "Part XIV";
            partTopic = "Public Services under the Union and the States (UPSC/UPPSC)";
          } else if (artNum >= 324 && artNum <= 329) {
            partName = "Part XV";
            partTopic = "Elections and the Election Commission of India";
          } else if (artNum >= 330 && artNum <= 342) {
            partName = "Part XVI";
            partTopic = "Special Provisions relating to certain classes (SC, ST, and OBC reservations)";
          } else if (artNum >= 343 && artNum <= 351) {
            partName = "Part XVII";
            partTopic = "Official Languages of the Union and regional languages";
          } else if (artNum >= 352 && artNum <= 360) {
            partName = "Part XVIII";
            partTopic = "Emergency Provisions (National, State President Rule, and Financial Emergency)";
          } else if (artNum === 368) {
            partName = "Part XX";
            partTopic = "Amendment of the Constitution of India and parliamentary power";
          } else if (artNum >= 369 && artNum <= 392) {
            partName = "Part XXI";
            partTopic = "Temporary, Transitional and Special Provisions (including J&K and State-specific clauses)";
          } else {
            partName = "Part XXII";
            partTopic = "Short Title, Commencement, and Repeals of the Constitution";
          }
          botResponse = `Article ${artNum} of the Constitution of India is located within ${partName}, which governs "${partTopic}". Advocate ${advocateName} handles writ petitions and legal disputes that challenge state actions invoking these Article rights in High Courts.`;
        }
      } else if (typedMsg.includes('constitution') || typedMsg.includes('preamble') || typedMsg.includes('fundamental right') || typedMsg.includes('directive principle') || typedMsg.includes('dpsp') || typedMsg.includes('citizen') || typedMsg.includes('republic') || typedMsg.includes('democracy')) {
        botResponse = "The Constitution of India is the supreme law of India, establishing the political framework, government structure, powers, and duties of institutions, alongside setting out fundamental rights, directive principles, and duties of citizens. If you believe a state authority has violated your constitutional rights (such as liberty under Art 21 or equality under Art 14), we can file a Writ Petition under Article 226 in the High Court.";
      } else if (typedMsg.includes('bail') || typedMsg.includes('arrest') || typedMsg.includes('fir') || typedMsg.includes('police') || typedMsg.includes('jail') || typedMsg.includes('criminal') || typedMsg.includes('bns') || typedMsg.includes('bnss')) {
        botResponse = `For Criminal Defense, regular/anticipatory bail, and FIR quashing under the Bhartiya Nyaya Sanhita (BNS) / Bhartiya Nagarik Suraksha Sanhita (BNSS), Advocate ${advocateName} offers direct court representation in Ballia. In urgent arrest/bail scenarios, call ${advocatePhone} immediately.`;
      } else if (typedMsg.includes('check') || typedMsg.includes('bounce') || typedMsg.includes('cheque') || typedMsg.includes('138') || typedMsg.includes('ni act')) {
        botResponse = 'Under Section 138 of the Negotiable Instruments Act, check bounce is a criminal offense. A statutory demand notice must be served within 30 days of receiving the bank memo. If unpaid within 15 days, a complaint can be filed in court. We manage both recovery prosecution and defense.';
      } else if (typedMsg.includes('divorce') || typedMsg.includes('matrimonial') || typedMsg.includes('marriage') || typedMsg.includes('wife') || typedMsg.includes('husband') || typedMsg.includes('family') || typedMsg.includes('domestic violence') || typedMsg.includes('dv') || typedMsg.includes('dowry')) {
        botResponse = `Matrimonial disputes (divorce, custody, and domestic violence) are sensitive matters governed by the Hindu Marriage Act, 1955 or Special Marriage Acts. Advocate ${advocateName} offers confidential legal counseling and representation in Family Court, Ballia.`;
      } else if (typedMsg.includes('maintenance') || typedMsg.includes('alimony') || typedMsg.includes('125')) {
        botResponse = 'Spousal and child maintenance claims are filed under Section 125 of CrPC (BNSS Section 144) or under Hindu Marriage Act Section 24. We represent clients in securing monthly maintenance or defending against disproportionate claims in Family Courts.';
      } else if (typedMsg.includes('property') || typedMsg.includes('partition') || typedMsg.includes('land') || typedMsg.includes('civil') || typedMsg.includes('suit') || typedMsg.includes('rent') || typedMsg.includes('tenant') || typedMsg.includes('injunction') || typedMsg.includes('cpc') || typedMsg.includes('contract') || typedMsg.includes('agreement')) {
        botResponse = 'Civil disputes involving property partition, injunction claims, rent/tenant matters, land acquisition, and breach of contracts are governed by the Code of Civil Procedure (CPC), 1908. We handle draft filings, plaints, and trial defense in Ballia Civil Courts.';
      } else if (typedMsg.includes('fundamental') || typedMsg.includes('rights') || typedMsg.includes('constitution') || typedMsg.includes('writ') || typedMsg.includes('appeal') || typedMsg.includes('hc') || typedMsg.includes('sc')) {
        botResponse = 'Writ petitions for violation of fundamental rights are filed under Article 226 in the High Court or Article 32 in the Supreme Court. We provide specialized appellate drafting and counsel for writs.';
      } else if (typedMsg.includes('consumer') || typedMsg.includes('cheat') || typedMsg.includes('service') || typedMsg.includes('forum')) {
        botResponse = 'Consumer issues are governed by the Consumer Protection Act, 2019. If you have received deficient services or faced cheating, a claim can be filed in the District Consumer Forum, Ballia. We represent both consumers and service providers.';
      } else if (typedMsg.includes('will') || typedMsg.includes('succession') || typedMsg.includes('inheritance') || typedMsg.includes('gift') || typedMsg.includes('deed') || typedMsg.includes('probate')) {
        botResponse = 'Inheritance and property partition are governed by the Indian Succession Act, 1925. We help clients in drafting wills, partition deeds, gift deeds, and obtaining probate of wills in Ballia.';
      } else if (typedMsg.includes('fee') || typedMsg.includes('charge') || typedMsg.includes('cost')) {
        botResponse = 'Initial advice consultations are nominal. Litigation fees vary based on the court complex and complexity of the case facts. Please request a callback or connect on WhatsApp to discuss details.';
      } else if (typedMsg.includes('address') || typedMsg.includes('office') || typedMsg.includes('location') || typedMsg.includes('court') || typedMsg.includes('ballia')) {
        botResponse = 'Our chambers are located at "Chamber infront of jm 2 court, Ballia, Uttar Pradesh - 277001". We practice primarily at the Ballia District and Sessions Courts. You can visit us between 10 AM to 5 PM.';
      } else {
        const queryTopic = queryText.length > 25 ? queryText.substring(0, 25) + '...' : queryText;
        botResponse = `Under Indian Civil/Criminal Jurisprudence, matters concerning "${queryTopic}" require fact-specific reviews. Advocate ${advocateName} can evaluate your case files to construct a strategic legal plan. Please click the button below to send this query directly to our WhatsApp.`;
      }

      setChatMessages((prev) => [
        ...prev, 
        { 
          sender: 'bot', 
          text: botResponse,
          showWhatsapp: true,
          queryText: queryText
        }
      ]);
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll to Top Button */}
      <button 
        className={`scroll-top-btn ${showScrollTop ? 'show' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to Top"
      >
        <ChevronUp size={20} />
      </button>

      {/* Floating Action Button for Helpline */}
      <div className="helpline-wrapper">
        <button 
          className={`helpline-fab ${isOpen ? 'open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Legal Helpline Support Panel"
        >
          {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
          {!isOpen && <span className="fab-pulse"></span>}
        </button>

        {/* Support Panel */}
        <div className={`helpline-panel ${isOpen ? 'open' : ''}`}>
          <div className="panel-header">
            <div className="panel-header-title">
              <div className="bot-avatar">
                <Phone size={16} />
              </div>
              <div>
                <h4>Legal Counsel Helpline</h4>
                <p>Online Support & Call Request</p>
              </div>
            </div>
          </div>

          <div className="panel-tabs">
            <button 
              className={`panel-tab-btn ${activeTab === 'call' ? 'active' : ''}`}
              onClick={() => setActiveTab('call')}
            >
              Request Callback
            </button>
            <button 
              className={`panel-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              Virtual Assistant
            </button>
          </div>

          <div className="panel-content">
            {activeTab === 'call' && (
              <div className="tab-callback-view">
                {cbSubmitted ? (
                  <div className="callback-success">
                    <CheckCircle2 size={44} className="success-icon" />
                    <h5>Callback Registered!</h5>
                    <p>Advocate {advocateName}\'s chambers will call you back within 2 hours on your number.</p>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => setCbSubmitted(false)}
                    >
                      Request Another Call
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCallbackSubmit} className="callback-form">
                    <p className="form-info-text">
                      Fill your details and we will call you back shortly.
                    </p>
                    
                    <div className="form-group">
                      <label className="form-label" htmlFor="cb-name">Full Name</label>
                      <input 
                        id="cb-name"
                        type="text" 
                        className="form-control" 
                        placeholder="Your Name" 
                        value={cbName}
                        onChange={(e) => setCbName(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="cb-phone">Phone Number</label>
                      <input 
                        id="cb-phone"
                        type="tel" 
                        className="form-control" 
                        placeholder="10-digit mobile number" 
                        value={cbPhone}
                        onChange={(e) => setCbPhone(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="cb-type">Practice Area</label>
                      <select 
                        id="cb-type"
                        className="form-control"
                        value={cbType}
                        onChange={(e) => setCbType(e.target.value)}
                      >
                        <option value="Criminal Defense">Criminal Defense</option>
                        <option value="Check Bounce (Sec 138)">Check Bounce (Sec 138)</option>
                        <option value="Matrimonial (Divorce)">Matrimonial (Divorce)</option>
                        <option value="Civil Disputes">Civil Dispute</option>
                        <option value="Alimony / Maintenance">Alimony / Maintenance</option>
                      </select>
                    </div>

                    {cbError && <div className="form-error-banner" style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{cbError}</div>}

                    <button type="submit" className="btn btn-primary w-full callback-submit-btn">
                      Request Call Back
                    </button>

                    <div className="emergency-call-box">
                      <span>Or call directly for urgent bail:</span>
                      <a href={`tel:+91${advocatePhoneRaw}`} className="direct-call-link" rel="noopener noreferrer">
                        <Phone size={14} /> {advocatePhone}
                      </a>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="tab-chat-view">
                <div className="chat-messages-container">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`chat-message-bubble ${msg.sender}`}>
                      {msg.sender === 'bot' && (
                        <div className="message-icon-indicator">
                          <User size={10} />
                        </div>
                      )}
                      <div className="message-text-wrapper-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                        <div className="message-text-wrapper">{msg.text}</div>
                        {msg.showWhatsapp && (
                          <button 
                            onClick={() => {
                              const waUrl = `https://wa.me/91${advocatePhoneRaw}?text=${sanitizeForUrl(`Hello Advocate Shivam, I have a legal query: "${msg.queryText}"`)}`;
                              window.open(waUrl, '_blank', 'noopener,noreferrer');
                            }}
                            className="chat-whatsapp-btn"
                          >
                            💬 Send Query to WhatsApp
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="chat-input-bar">
                  <input 
                    type="text" 
                    placeholder="Ask a legal query..." 
                    className="form-control chat-input" 
                    value={userMsg}
                    onChange={(e) => setUserMsg(e.target.value)}
                  />
                  <button type="submit" className="chat-send-btn" aria-label="Send Message">
                    <Send size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
