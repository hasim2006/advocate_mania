import React, { useState } from 'react';
import { FileText, Send, Calendar, CheckCircle2, ChevronRight, Play, Square, Award } from 'lucide-react';
import './CaseStudies.css';

export default function CaseStudies() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // Typical Indian Legal Case Flow (Criminal / Civil)
  const steps = [
    {
      title: '1. Filing & Admission',
      subtitle: 'Drafting & Presentation',
      desc: 'Preparing the petition/complaint with appropriate court fees, verifying jurisdiction, and filing at the Filing Counter. The court conducts admission hearings to decide if the case has prima facie merit.',
      timeline: 'Days 1–15',
      status: 'Filing & Registration'
    },
    {
      title: '2. Summons & Notices',
      subtitle: 'Serving the Opposite Party',
      desc: 'Upon admission, the court issues formal summons or notices to the respondents/defendants. They are ordered to appear and file a written statement (defense reply) within a specified timeframe (typically 30–90 days).',
      timeline: 'Months 1–3',
      status: 'Service of summons'
    },
    {
      title: '3. Evidence & Examination',
      subtitle: 'Witness Statements & Cross-Examination',
      desc: 'Both sides present documentary evidence. Examination-in-Chief and rigorous Cross-Examination of witnesses are conducted before the Magistrate/Judge under the Indian Evidence Act / Bhartiya Sakshya Adhiniyam.',
      timeline: 'Months 4–12',
      status: 'Recording evidence'
    },
    {
      title: '4. Final Arguments',
      subtitle: 'Legal Submissions',
      desc: 'Advocates of both parties present oral arguments, referencing statutory provisions, precedents, and case laws from High Courts and the Supreme Court of India.',
      timeline: 'Months 12–15',
      status: 'Final oral arguments'
    },
    {
      title: '5. Judgment & Execution',
      subtitle: 'Verdict & Implementation',
      desc: 'The Judge pronounces the final judgment. If a decree is passed, Execution Petitions are filed to implement the court orders (e.g. monetary recovery, property possession). If needed, appeals are prepared for higher forums.',
      timeline: 'Month 16+',
      status: 'Final verdict & decree'
    }
  ];

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const toggleAutoPlay = () => {
    if (isPlaying) {
      clearInterval(intervalId);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const id = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 3000);
      setIntervalId(id);
    }
  };

  const fictionalCases = [
    {
      title: 'Successful Acquittal in Sessions Trial',
      type: 'Criminal Defense',
      location: 'Sessions Court, Ballia',
      year: '2024',
      summary: 'Represented a local business owner falsely accused under criminal assault charges. Dismantled prosecution assertions during cross-examination of key witnesses, highlighting material contradictions and securing an honorable acquittal.',
      outcome: 'Full Acquittal & Honor Restored'
    },
    {
      title: 'Speedy Recovery in 138 NI Act Dispute',
      type: 'Check Bounce Matter',
      location: 'Chief Judicial Magistrate Court, Ballia',
      year: '2025',
      summary: 'Prosecuted a check bounce complaint for a wholesale distributor regarding an unpaid invoice of ₹18 Lakhs. Drafted and served a precise statutory legal notice and filed prosecution within time. Mediated a full recovery settlement during court proceedings.',
      outcome: 'Full Settlement & ₹18L Recovery'
    },
    {
      title: 'Partition Suit & Permanent Injunction Resolution',
      type: 'Civil Property Dispute',
      location: 'Civil Judge Senior Division, Ballia',
      year: '2025',
      summary: 'Advocated for an elderly client in a long-standing ancestral property partition suit. Secured an interim injunction protecting possession, resulting in a favorable final partition decree validating the client\'s rightful share.',
      outcome: 'Property Division Secured'
    }
  ];

  return (
    <section className="cases-section" id="cases-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-subtitle">Case Flow & Experience</span>
          <h2 className="section-title center">How Litigation Works in India</h2>
          <p className="section-desc">
            Understand the typical milestones of a legal matter in the Indian Judicial System, alongside summary highlights of solved disputes.
          </p>
        </div>

        {/* Animated Case Flow Interactive Section */}
        <div className="case-flow-box">
          <h3 className="flow-title">Interactive Indian Law Litigation Flowchart (2015–2026)</h3>
          
          {/* Progress bar and dots */}
          <div className="flow-tracker">
            <div 
              className="progress-line-fill" 
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            ></div>
            {steps.map((step, idx) => (
              <button
                key={idx}
                className={`tracker-node ${idx <= activeStep ? 'active' : ''} ${idx === activeStep ? 'current' : ''}`}
                onClick={() => {
                  setActiveStep(idx);
                  if (isPlaying) {
                    clearInterval(intervalId);
                    setIsPlaying(false);
                  }
                }}
                aria-label={`Go to step ${idx + 1}`}
              >
                <span className="node-num">{idx + 1}</span>
                <span className="node-label">{step.status}</span>
              </button>
            ))}
          </div>

          {/* Details Card */}
          <div className="flow-details-card">
            <div className="details-card-header">
              <div className="step-badge">STAGE 0{activeStep + 1}</div>
              <div className="step-time">
                <Calendar size={14} />
                <span>Estimated: {steps[activeStep].timeline}</span>
              </div>
            </div>
            
            <div className="details-card-body">
              <h4 className="details-step-title">{steps[activeStep].title}</h4>
              <p className="details-step-sub">{steps[activeStep].subtitle}</p>
              <p className="details-step-desc">{steps[activeStep].desc}</p>
            </div>

            <div className="details-card-footer">
              <div className="flow-controls">
                <button 
                  onClick={toggleAutoPlay} 
                  className={`btn-flow-control play-btn ${isPlaying ? 'playing' : ''}`}
                >
                  {isPlaying ? <Square size={16} /> : <Play size={16} />}
                  <span>{isPlaying ? 'Stop Presentation' : 'Auto Play Flow'}</span>
                </button>
              </div>

              <div className="step-navigation">
                <button 
                  onClick={handlePrev} 
                  className="btn btn-secondary btn-sm"
                  disabled={activeStep === 0}
                >
                  Previous
                </button>
                <button 
                  onClick={handleNext} 
                  className="btn btn-secondary btn-sm"
                  disabled={activeStep === steps.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fictional Case Studies Grid */}
        <div className="fictional-cases-area">
          <div className="section-header text-center">
            <span className="section-subtitle">Track Record</span>
            <h3 className="sub-section-title">Case Summaries (Anonymized)</h3>
            <p className="section-desc">
              Summarized examples of litigation handles under Indian Courts (strictly compliant with privacy regulations).
            </p>
          </div>

          <div className="fictional-grid">
            {fictionalCases.map((caseItem, idx) => (
              <div key={idx} className="fictional-card">
                <div className="fictional-card-header">
                  <span className="case-type-badge">{caseItem.type}</span>
                  <span className="case-year">{caseItem.year}</span>
                </div>
                
                <h4 className="fictional-case-title">{caseItem.title}</h4>
                <p className="case-location">{caseItem.location}</p>
                <p className="case-summary">{caseItem.summary}</p>
                
                <div className="case-outcome-badge">
                  <Award size={16} />
                  <span>Outcome: {caseItem.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
