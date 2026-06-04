"use client";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>

      <div className="topbar">
        <div className="container">
          <div className="topbar-contact">
            <a href="tel:18007824769">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>(800) SUB-HROY</span>
            </a>
            <a href="mailto:admin@mylegalimigrationservices.com" className="email-text">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>
              <span>admin@mylegalimigrationservices.com</span>
            </a>
          </div>
          <div className="topbar-right">
            <div className="lang-toggle" role="group" aria-label="Language">
              <button data-lang="en" className="active" type="button">EN</button>
              <button data-lang="es" type="button">ES</button>
            </div>
          </div>
        </div>
      </div>

      <header className="header" id="header">
        <div className="container">
          <Link href="/" className="brand" aria-label="One Stop Immigration Station home">
            <span className="brand-mark"><img className="brand-bird" src="/logo-bird.png" alt="One Stop Immigration Station" /></span>
            <span className="brand-text">
              <span className="bl-top">One Stop</span><span className="bl-mid">Immigration</span>
              <span className="bl-bot">Station <span className="bl-stars">★★★★★</span></span>
            </span>
          </Link>
          <nav className="nav" aria-label="Primary">
            <div className="nav-item"><Link className="nav-link" href="/">Home</Link></div>
            <div className="nav-item"><Link className="nav-link" href="/success-stories">Success Stories</Link></div>
            <div className="nav-item">
              <a className="nav-link" href="/#services" id="servicesToggle" aria-haspopup="true" aria-expanded="false">Services
                <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </a>
              <div className="mega" role="menu" aria-label="Services">
                <div className="mega-grid">
                  <div className="mega-col">
                    <h4>Work Visas</h4>
                    <a href="/#services"><b>H-1B</b><span>Specialty workers</span></a>
                    <a href="/#services"><b>L-1</b><span>Intra-company transfer</span></a>
                    <a href="/#services"><b>O-1</b><span>Extraordinary ability</span></a>
                    <a href="/#services"><b>TN</b><span>NAFTA professionals</span></a>
                    <a href="/#services"><b>E-2</b><span>Treaty investors</span></a>
                  </div>
                  <div className="mega-col">
                    <h4>Student &amp; Exchange</h4>
                    <a href="/#services"><b>F-1</b><span>Academic students</span></a>
                    <a href="/#services"><b>M-1</b><span>Vocational students</span></a>
                    <a href="/#services"><b>J-1</b><span>Exchange visitors</span></a>
                    <h4 style={{marginTop:"16px"}}>Family &amp; Fiancé</h4>
                    <a href="/#services"><b>K-1</b><span>Fiancé visa</span></a>
                    <a href="/#services"><b>K-3</b><span>Spousal visa</span></a>
                  </div>
                  <div className="mega-col">
                    <h4>Humanitarian</h4>
                    <a href="/#services"><b>U</b><span>Crime victims</span></a>
                    <a href="/#services"><b>SIJ</b><span>Special juvenile</span></a>
                    <a href="/#services"><b>DACA</b><span>Childhood arrivals</span></a>
                    <a href="/#services"><b>—</b><span>Asylum &amp; Refugee</span></a>
                    <a href="/#services"><b>F2–F4</b><span>Family preference</span></a>
                  </div>
                </div>
                <div className="mega-foot">
                  <p><strong>Not sure which visa fits your situation?</strong></p>
                  <Link href="/contact" className="btn btn--navy btn--sm">Book a Free Consultation</Link>
                </div>
              </div>
            </div>
            <div className="nav-item"><Link className="nav-link" href="/press-media">Press &amp; Media</Link></div>
            <div className="nav-item"><Link className="nav-link" href="/videos">Videos</Link></div>
            <div className="nav-item"><Link className="nav-link" href="/blog">Blog</Link></div>
            <div className="nav-item"><Link className="nav-link is-active" href="/contact">Contact Us</Link></div>
          </nav>
          <div className="header-cta">
            <Link href="/contact" className="btn btn--gold btn--sm">Free Consultation</Link>
            <button className="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <div className="mobile-overlay" id="mobileOverlay"></div>
      <aside className="mobile-panel" id="mobilePanel" aria-label="Mobile menu">
        <div className="mobile-head">
          <span className="brand-text">
            <span className="bl-top">One Stop</span><span className="bl-mid">Immigration</span>
            <span className="bl-bot">Station <span className="bl-stars">★★★★★</span></span>
          </span>
          <button className="mobile-close" id="mobileClose" aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <nav className="mobile-nav" aria-label="Mobile primary">
          <Link href="/">Home</Link><Link href="/success-stories">Success Stories</Link>
          <div className="m-acc">
            <button className="m-acc-trigger" type="button">
              <span>Services</span>
              <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div className="m-acc-body">
              <a href="/#services"><strong>Work Visas</strong> — H-1B, L-1, O-1, TN, E-2</a>
              <a href="/#services"><strong>Student &amp; Exchange</strong> — F-1, M-1, J-1</a>
              <a href="/#services"><strong>Family &amp; Fiancé</strong> — K-1, K-3, F2–F4</a>
              <a href="/#services"><strong>Humanitarian</strong> — U, SIJ, DACA, Asylum</a>
            </div>
          </div>
          <Link href="/press-media">Press &amp; Media</Link>
          <Link href="/videos">Videos</Link><Link href="/blog">Blog</Link><Link href="/contact">Contact Us</Link>
        </nav>
        <div className="mobile-foot">
          <Link href="/contact" className="btn btn--gold">Free Consultation</Link>
        </div>
      </aside>

      <main id="main">
        <section className="page-hero">
          <div className="container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              <span className="current">Contact Us</span>
            </nav>
            <h1>Contact Us</h1>
            <p className="page-lead">Have a question about your case or ready to begin? Reach out and our bilingual team will respond within one business day.</p>
          </div>
        </section>

        <section className="section">
          <div className="container contact-layout">
            <aside className="info-card reveal">
              <h2>Get in touch</h2>
              <p className="ic-lead">We&apos;re here to guide you — in English or Español.</p>

              <div className="info-row">
                <span className="ir-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span>
                <div><div className="ir-label">Office</div><div className="ir-val">123 Main St<br />Cumming, GA 30041</div></div>
              </div>
              <div className="info-row">
                <span className="ir-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
                <div><div className="ir-label">Phone</div><div className="ir-val"><a href="tel:18007824769">(800) SUB-HROY</a></div></div>
              </div>
              <div className="info-row">
                <span className="ir-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg></span>
                <div><div className="ir-label">Email</div><div className="ir-val"><a href="mailto:admin@mylegalimigrationservices.com">admin@mylegalimigrationservices.com</a></div></div>
              </div>
              <div className="info-row">
                <span className="ir-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>
                <div><div className="ir-label">Office Hours</div><div className="ir-val">Mon–Fri: 9:00 AM – 6:00 PM<br />Sat: 10:00 AM – 2:00 PM<br />Sun: Closed</div></div>
              </div>

              <div className="consult-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                <div>
                  <div className="cn-t">2 free consultations</div>
                  <div className="cn-s">Create a free account to unlock two complimentary consultations with our team.</div>
                </div>
              </div>
            </aside>

            <div className="form-card reveal">
              <h2>Send us a message</h2>
              <p className="fc-lead">Fill out the form and we&apos;ll get back to you shortly. Fields marked * are required.</p>

              {submitted && (
                <div className="form-success">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  <span>Thank you! Your message has been sent. We&apos;ll reply within one business day.</span>
                </div>
              )}

              {!submitted && (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-grid">
                    <div className="field">
                      <label htmlFor="first">First Name <span className="req">*</span></label>
                      <input id="first" type="text" name="first" required autoComplete="given-name" />
                    </div>
                    <div className="field">
                      <label htmlFor="last">Last Name <span className="req">*</span></label>
                      <input id="last" type="text" name="last" required autoComplete="family-name" />
                    </div>
                    <div className="field">
                      <label htmlFor="email">Email <span className="req">*</span></label>
                      <input id="email" type="email" name="email" required autoComplete="email" />
                    </div>
                    <div className="field">
                      <label htmlFor="phone">Phone <span className="req">*</span></label>
                      <input id="phone" type="tel" name="phone" required autoComplete="tel" />
                    </div>
                    <div className="field full">
                      <label htmlFor="subject">Subject <span className="req">*</span></label>
                      <input id="subject" type="text" name="subject" required />
                    </div>
                    <div className="field full">
                      <label htmlFor="service">Service Needed <span className="req">*</span></label>
                      <select id="service" name="service" required>
                        <option value="">Select a service…</option>
                        <option>Green Card Through Employment</option>
                        <option>Family</option>
                        <option>Removal</option>
                        <option>Appeals</option>
                        <option>Non-Immigrant Visa</option>
                        <option>Citizenship</option>
                        <option>I-9 Audit</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="field full">
                      <label htmlFor="message">Message <span className="req">*</span></label>
                      <textarea id="message" name="message" required placeholder="Tell us a little about your situation…"></textarea>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn--navy">Send Message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
                    <span className="form-privacy">We respect your privacy. No spam, ever.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="section section--tight" style={{paddingTop:0}}>
          <div className="container">
            <div className="map-ph" role="img" aria-label="Map showing office location at 123 Main St, Cumming, GA 30041">
              <div className="map-pin">
                <span className="pin"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span>
                <span className="pin-label">123 Main St, Cumming, GA 30041</span>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-strip">
          <div className="container cta-inner">
            <div className="reveal">
              <h2>Prefer to Call?</h2>
              <p>Speak directly with our bilingual team. We&apos;ll answer your questions and help you map out the next step — no obligation.</p>
            </div>
            <div className="cta-actions reveal">
              <a href="tel:18007824769" className="btn btn--gold">Call (800) SUB-HROY</a>
              <a href="mailto:admin@mylegalimigrationservices.com" className="btn btn--outline-light">Email Us</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <Link href="/" className="brand">
                <span className="brand-mark"><img className="brand-bird" src="/logo-bird.png" alt="One Stop Immigration Station" /></span>
                <span className="brand-text"><span className="bl-top">One Stop</span><span className="bl-mid">Immigration</span><span className="bl-bot">Station <span className="bl-stars">★★★★★</span></span></span>
              </Link>
              <p>Centralizing U.S. immigration for businesses, families, and individuals — with legal expertise, attention to detail, and technology that keeps your case moving.</p>
            </div>
            <div className="footer-col">
              <h4>Navigate</h4>
              <div className="footer-links">
                <Link href="/">Home</Link><Link href="/success-stories">Success Stories</Link>
                <Link href="/press-media">Press &amp; Media</Link><Link href="/videos">Videos</Link>
                <Link href="/blog">Blog</Link><Link href="/contact">Contact Us</Link>
              </div>
            </div>
            <div className="footer-col">
              <h4>Services</h4>
              <div className="footer-links">
                <a href="/#services">Work Visas</a><a href="/#services">Student Visas</a>
                <a href="/#services">Fiancé &amp; Spousal</a><a href="/#services">Humanitarian</a>
                <a href="/#services">Family Visas</a><a href="/#services">I-9 Audits</a>
              </div>
            </div>
            <div className="footer-news">
              <h4>Join our E-Newsletter</h4>
              <p>Stay current on important immigration law reform and news.</p>
              <form className="news-form">
                <input type="email" required placeholder="you@email.com" aria-label="Email address" />
                <button type="submit" className="btn btn--gold">Join</button>
              </form>
              <address className="footer-addr">
                69 Station Avenue, Suite 2445<br />New York, NY 10001, USA<br />
                <a href="tel:18007824769">(800) SUB-HROY</a><br />
                <a href="mailto:admin@mylegalimigrationservices.com">admin@mylegalimigrationservices.com</a>
              </address>
            </div>
          </div>
          <div className="footer-bar">
            <span>© 2026 One Stop Immigration Station. All rights reserved.</span>
            <nav aria-label="Legal"><a href="#">Privacy Policy</a><a href="#">Terms of Use</a><a href="#">Disclaimer</a></nav>
          </div>
        </div>
      </footer>
      <nav className="mobile-bar" aria-label="Quick contact">
        <a className="mb-call" href="tel:18007824769">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>Call Us</span>
        </a>
        <Link className="mb-consult" href="/contact">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>Free Consult</span>
        </Link>
      </nav>
    </>
  );
}
