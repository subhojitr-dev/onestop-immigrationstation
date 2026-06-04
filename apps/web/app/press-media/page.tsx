import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Press & Media — One Stop Immigration Station",
  description: "News, announcements, and recognition from One Stop Immigration Station — and resources for journalists.",
};

const pressItems = [
  {tag:"src-release", label:"Press Release", title:"MyLegal Expands Humanitarian Visa Practice", desc:"The firm announces a dedicated team for U, T, SIJ, and asylum cases to meet rising demand for humanitarian relief.", date:"Mar 2026"},
  {tag:"src-coverage", label:"Media Coverage", title:"How Small Law Firms Are Adapting to USCIS Processing Delays", desc:"Our managing attorney is featured discussing technology-driven case management amid record backlogs.", date:"Feb 2026"},
  {tag:"src-release", label:"Press Release", title:"Firm Launches Bilingual Immigration Helpline", desc:"A new English/Español helpline gives prospective clients direct access to guidance within one business day.", date:"Jan 2026"},
  {tag:"src-award", label:"Award", title:"Recognized Among Top Immigration Practices in Georgia", desc:"MyLegal earns a place on the regional list honoring excellence in client outcomes and service.", date:"Dec 2025"},
  {tag:"src-coverage", label:"Media Coverage", title:"Attorney Commentary: H-1B Rule Changes", desc:"Expert analysis on the latest H-1B modernization rule and what it means for employers and applicants.", date:"Nov 2025"},
  {tag:"src-release", label:"Press Release", title:"New I-9 Compliance Workshop Series for Georgia Employers", desc:"A free workshop series helps local businesses build audit-ready employment eligibility processes.", date:"Oct 2025"},
];

export default function PressMediaPage() {
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
            <div className="nav-item"><Link className="nav-link is-active" href="/press-media">Press &amp; Media</Link></div>
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
              <span className="current">Press &amp; Media</span>
            </nav>
            <h1>Press &amp; Media</h1>
            <p className="page-lead">News, announcements, and recognition from One Stop Immigration Station — and resources for journalists.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="coming-soon reveal">
              <div className="cs-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z"/></svg></div>
              <span className="cs-badge">Coming Soon</span>
              <h2>Our newsroom is taking shape</h2>
              <p>Full press releases and media kits are on the way. Members of the press can reach us directly for interviews, commentary, and data.</p>
              <a href="mailto:admin@mylegalimigrationservices.com?subject=Media%20Inquiry" className="btn btn--navy">Media Inquiries <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
            </div>
          </div>
        </section>

        <section className="section" style={{paddingTop:0}}>
          <div className="container">
            <div className="section-head section-head--center reveal" style={{marginBottom:"46px"}}>
              <span className="eyebrow eyebrow--center">In the News</span>
              <h2 className="section-title">Press releases &amp; coverage</h2>
            </div>
            <div className="press-grid">
              {pressItems.map((item, i) => (
                <article key={i} className="press-card reveal">
                  <span className={`src-tag ${item.tag}`}>{item.label}</span>
                  <h3><a href="#">{item.title}</a></h3>
                  <p>{item.desc}</p>
                  <div className="press-foot">
                    <span className="pf-date"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>{item.date}</span>
                    <a href="#" className="link-arrow" style={{fontSize:"14px"}}>Read <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{paddingTop:0}}>
          <div className="container">
            <div className="media-banner reveal">
              <div>
                <h2>Working on a story?</h2>
                <p>Our attorneys are available for expert commentary on immigration policy, USCIS updates, and employer compliance.</p>
              </div>
              <a href="mailto:admin@mylegalimigrationservices.com?subject=Media%20Inquiry" className="btn btn--gold">Email the Press Desk <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
            </div>
          </div>
        </section>

        <section className="cta-strip">
          <div className="container cta-inner">
            <div className="reveal">
              <h2>Need Immigration Help?</h2>
              <p>Beyond the headlines, we help real families and businesses every day. Start with a free consultation.</p>
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
