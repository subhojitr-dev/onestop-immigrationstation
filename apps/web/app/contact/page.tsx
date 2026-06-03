import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Contact Us — One Stop Immigration Station',
  description: 'Have a question about your case or ready to begin? Reach out and our bilingual team will respond within one business day.',
}

export default function ContactPage() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header activePage="contact" />

      <main id="main">
        {/* PAGE HERO */}
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

        {/* CONTACT LAYOUT */}
        <section className="section">
          <div className="container contact-layout">

            {/* INFO CARD */}
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

            {/* FORM CARD */}
            <div className="form-card reveal">
              <h2>Send us a message</h2>
              <p className="fc-lead">Fill out the form and we&apos;ll get back to you shortly. Fields marked * are required.</p>
              <div className="form-success" id="formSuccess">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span>Thank you! Your message has been sent. We&apos;ll reply within one business day.</span>
              </div>
              <form id="contactForm" noValidate>
                <div className="form-grid">
                  <div className="field">
                    <label>First Name <span className="req">*</span></label>
                    <input type="text" name="first" required autoComplete="given-name" />
                    <span className="field-msg"></span>
                  </div>
                  <div className="field">
                    <label>Last Name <span className="req">*</span></label>
                    <input type="text" name="last" required autoComplete="family-name" />
                    <span className="field-msg"></span>
                  </div>
                  <div className="field">
                    <label>Email <span className="req">*</span></label>
                    <input type="email" name="email" required autoComplete="email" />
                    <span className="field-msg"></span>
                  </div>
                  <div className="field">
                    <label>Phone <span className="req">*</span></label>
                    <input type="tel" name="phone" required autoComplete="tel" />
                    <span className="field-msg"></span>
                  </div>
                  <div className="field full">
                    <label>Subject <span className="req">*</span></label>
                    <input type="text" name="subject" required />
                    <span className="field-msg"></span>
                  </div>
                  <div className="field full">
                    <label>Service Needed <span className="req">*</span></label>
                    <select name="service" required>
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
                    <span className="field-msg"></span>
                  </div>
                  <div className="field full">
                    <label>Message <span className="req">*</span></label>
                    <textarea name="message" required placeholder="Tell us a little about your situation…"></textarea>
                    <span className="field-msg"></span>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn--navy">
                    Send Message
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                  <span className="form-privacy">We respect your privacy. No spam, ever.</span>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* MAP */}
        <section className="section section--tight" style={{paddingTop:0}}>
          <div className="container">
            <div className="map-ph" role="img" aria-label="Map showing office location at 123 Main St, Cumming, GA 30041">
              <span className="iph-badge">IPH6</span>
              <div className="map-pin">
                <span className="pin"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span>
                <span className="pin-label">123 Main St, Cumming, GA 30041</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
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

      <Footer />
    </>
  )
}
