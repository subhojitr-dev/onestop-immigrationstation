import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Success Stories — One Stop Immigration Station",
  description: "Real people, real outcomes. Behind every case is a family reunited, a career secured, or a business protected.",
};

const StarRow = () => (
  <div className="testi-stars" aria-label="5 out of 5">
    {[...Array(5)].map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg>
    ))}
  </div>
);

export default function SuccessStoriesPage() {
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
            <div className="topbar-social" aria-label="Social media">
              <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 16.99 22 12z"/></svg></a>
              <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.2 8h4.6v13H.2V8zm7.4 0h4.4v1.78h.06c.61-1.16 2.11-2.38 4.34-2.38 4.64 0 5.5 3.05 5.5 7.02V21h-4.6v-6.18c0-1.47-.03-3.37-2.05-3.37-2.06 0-2.37 1.6-2.37 3.26V21H7.6V8z"/></svg></a>
              <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg></a>
            </div>
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
            <div className="nav-item"><Link className="nav-link is-active" href="/success-stories">Success Stories</Link></div>
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
            <div className="nav-item"><Link className="nav-link" href="/contact">Contact Us</Link></div>
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
          <Link href="/">Home</Link>
          <Link href="/success-stories">Success Stories</Link>
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
          <Link href="/videos">Videos</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>
        <div className="mobile-foot">
          <Link href="/contact" className="btn btn--gold">Free Consultation</Link>
          <div className="topbar-contact">
            <a href="tel:18007824769"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg> (800) SUB-HROY</a>
            <a href="mailto:admin@mylegalimigrationservices.com"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg> admin@mylegalimigrationservices.com</a>
          </div>
        </div>
      </aside>

      <main id="main">
        <section className="page-hero">
          <div className="container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              <span className="current">Success Stories</span>
            </nav>
            <h1>Success Stories</h1>
            <p className="page-lead">Real people, real outcomes. Behind every case is a family reunited, a career secured, or a business protected.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="coming-soon reveal">
              <div className="cs-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></div>
              <span className="cs-badge">Coming Soon</span>
              <h2>A wall of wins is on its way</h2>
              <p>We&apos;re collecting detailed case studies and client video stories. In the meantime, here&apos;s what some of the people we&apos;ve helped have to say.</p>
              <Link href="/contact" className="btn btn--navy">Share Your Story <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></Link>
            </div>
          </div>
        </section>

        <section className="section testi" style={{paddingTop:0}}>
          <div className="container">
            <div className="section-head section-head--center reveal" style={{marginBottom:"8px"}}>
              <span className="eyebrow eyebrow--center">Client Testimonials</span>
              <h2 className="section-title">Outcomes our clients celebrate</h2>
            </div>
            <div className="testi-grid">
              <article className="testi-card reveal">
                <StarRow />
                <p className="testi-quote">&ldquo;After an initial denial, they rebuilt our H-1B case from the ground up and won the approval. We never felt alone in the process.&rdquo;</p>
                <div className="testi-person"><span className="testi-avatar">R</span><span><span className="name">Rahul &amp; Anita M.</span><span className="role">H-1B Approval</span></span></div>
              </article>
              <article className="testi-card reveal">
                <StarRow />
                <p className="testi-quote">&ldquo;They reunited me with my husband through the F2A category faster than we ever expected. Forever grateful to this team.&rdquo;</p>
                <div className="testi-person"><span className="testi-avatar">L</span><span><span className="name">Lucía F.</span><span className="role">F2A Family Reunion</span></span></div>
              </article>
              <article className="testi-card reveal">
                <StarRow />
                <p className="testi-quote">&ldquo;Facing removal was terrifying. Their defense strategy was meticulous and they fought for me until the case was closed in my favor.&rdquo;</p>
                <div className="testi-person"><span className="testi-avatar">J</span><span><span className="name">James O.</span><span className="role">Removal Defense Win</span></span></div>
              </article>
              <article className="testi-card reveal">
                <StarRow />
                <p className="testi-quote">&ldquo;As an artist, the O-1 felt out of reach. They organized my evidence beautifully and made an undeniable case for my talent.&rdquo;</p>
                <div className="testi-person"><span className="testi-avatar">S</span><span><span className="name">Sofia &amp; Daniel</span><span className="role">O-1 Visa</span></span></div>
              </article>
              <article className="testi-card reveal">
                <StarRow />
                <p className="testi-quote">&ldquo;Our K-1 fiancé visa journey was smooth from start to finish. Every form, every interview — they prepared us perfectly.&rdquo;</p>
                <div className="testi-person"><span className="testi-avatar">M</span><span><span className="name">Maria &amp; Kevin</span><span className="role">K-1 Fiancé Visa</span></span></div>
              </article>
              <article className="testi-card reveal">
                <StarRow />
                <p className="testi-quote">&ldquo;Their I-9 audit left our records spotless and audit-ready. Professional, thorough, and genuinely invested in protecting our business.&rdquo;</p>
                <div className="testi-person"><span className="testi-avatar">T</span><span><span className="name">TechFlow Inc.</span><span className="role">I-9 Compliance</span></span></div>
              </article>
            </div>
          </div>
        </section>

        <section className="cta-strip">
          <div className="container cta-inner">
            <div className="reveal">
              <h2>Your Success Story Starts Here</h2>
              <p>Join the families and businesses who trusted us with their immigration journey. Book a free consultation today.</p>
            </div>
            <div className="cta-actions reveal">
              <Link href="/contact" className="btn btn--gold">Book a Free Consultation</Link>
              <a href="tel:18007824769" className="btn btn--outline-light">Call (800) SUB-HROY</a>
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
                <Link href="/">Home</Link>
                <Link href="/success-stories">Success Stories</Link>
                <Link href="/press-media">Press &amp; Media</Link>
                <Link href="/videos">Videos</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/#testimonials">Testimonials</Link>
                <Link href="/contact">Contact Us</Link>
              </div>
            </div>
            <div className="footer-col">
              <h4>Services</h4>
              <div className="footer-links">
                <a href="/#services">Work Visas</a>
                <a href="/#services">Student Visas</a>
                <a href="/#services">Fiancé &amp; Spousal</a>
                <a href="/#services">Humanitarian</a>
                <a href="/#services">Family Visas</a>
                <a href="/#services">I-9 Audits</a>
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
