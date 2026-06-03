'use client'
// ============================================================
// Header — converted from Claude Design index.html
// 'use client' needed for hamburger menu interactivity
// ============================================================
import Link from 'next/link'
import Image from 'next/image'

export default function Header({ activePage = 'home' }: { activePage?: string }) {
  return (
    <>
      {/* TOP CONTACT BAR */}
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
              <a href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.24 2H21.5l-7.13 8.15L22.75 22h-6.56l-5.14-6.72L5.16 22H1.9l7.62-8.71L1.25 2h6.72l4.64 6.14L18.24 2zm-1.15 18h1.81L7.01 3.9H5.06L17.09 20z"/></svg></a>
              <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg></a>
            </div>
            <div className="lang-toggle" role="group" aria-label="Language">
              <button data-lang="en" className="active" type="button">EN</button>
              <button data-lang="es" type="button">ES</button>
            </div>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="header" id="header">
        <div className="container">
          <Link href="/" className="brand" aria-label="One Stop Immigration Station home">
            <span className="brand-mark">
              <Image className="brand-bird" src="/logo-bird.png" alt="One Stop Immigration Station" width={40} height={40} />
            </span>
            <span className="brand-text">
              <span className="bl-top">One Stop</span>
              <span className="bl-mid">Immigration</span>
              <span className="bl-bot">Station <span className="bl-stars">★★★★★</span></span>
            </span>
          </Link>

          <nav className="nav" aria-label="Primary">
            <div className="nav-item">
              <Link className={`nav-link${activePage === 'home' ? ' is-active' : ''}`} href="/" data-en="Home" data-es="Inicio">Home</Link>
            </div>
            <div className="nav-item">
              <Link className={`nav-link${activePage === 'success-stories' ? ' is-active' : ''}`} href="/success-stories" data-en="Success Stories" data-es="Casos de Éxito">Success Stories</Link>
            </div>

            <div className="nav-item">
              <a className="nav-link" href="/#services" id="servicesToggle" aria-haspopup="true" aria-expanded="false" data-en="Services" data-es="Servicios">
                Services
                <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </a>
              <div className="mega" role="menu" aria-label="Services">
                <div className="mega-grid">
                  <div className="mega-col">
                    <h4 data-en="Work Visas" data-es="Visas de Trabajo">Work Visas</h4>
                    <a href="#"><b>H-1B</b><span data-en="Specialty workers" data-es="Trabajadores especializados">Specialty workers</span></a>
                    <a href="#"><b>L-1</b><span data-en="Intra-company transfer" data-es="Transferencia intra-empresa">Intra-company transfer</span></a>
                    <a href="#"><b>O-1</b><span data-en="Extraordinary ability" data-es="Habilidad extraordinaria">Extraordinary ability</span></a>
                    <a href="#"><b>TN</b><span data-en="NAFTA professionals" data-es="Profesionales TLCAN">NAFTA professionals</span></a>
                    <a href="#"><b>E-2</b><span data-en="Treaty investors" data-es="Inversionistas de tratado">Treaty investors</span></a>
                  </div>
                  <div className="mega-col">
                    <h4 data-en="Student & Exchange" data-es="Estudiante e Intercambio">Student &amp; Exchange</h4>
                    <a href="#"><b>F-1</b><span data-en="Academic students" data-es="Estudiantes académicos">Academic students</span></a>
                    <a href="#"><b>M-1</b><span data-en="Vocational students" data-es="Estudiantes vocacionales">Vocational students</span></a>
                    <a href="#"><b>J-1</b><span data-en="Exchange visitors" data-es="Visitantes de intercambio">Exchange visitors</span></a>
                    <h4 style={{marginTop:'16px'}} data-en="Family & Fiancé" data-es="Familia y Prometido(a)">Family &amp; Fiancé</h4>
                    <a href="#"><b>K-1</b><span data-en="Fiancé visa" data-es="Visa de prometido(a)">Fiancé visa</span></a>
                    <a href="#"><b>K-3</b><span data-en="Spousal visa" data-es="Visa de cónyuge">Spousal visa</span></a>
                  </div>
                  <div className="mega-col">
                    <h4 data-en="Humanitarian" data-es="Humanitaria">Humanitarian</h4>
                    <a href="#"><b>U</b><span data-en="Crime victims" data-es="Víctimas de delitos">Crime victims</span></a>
                    <a href="#"><b>SIJ</b><span data-en="Special juvenile" data-es="Juvenil especial">Special juvenile</span></a>
                    <a href="#"><b>DACA</b><span data-en="Childhood arrivals" data-es="Llegados en la infancia">Childhood arrivals</span></a>
                    <a href="#"><b>—</b><span data-en="Asylum & Refugee" data-es="Asilo y Refugiado">Asylum &amp; Refugee</span></a>
                    <a href="#"><b>F2–F4</b><span data-en="Family preference" data-es="Preferencia familiar">Family preference</span></a>
                  </div>
                </div>
                <div className="mega-foot">
                  <p><strong data-en="Not sure which visa fits your situation?" data-es="¿No sabe qué visa se ajusta a su situación?">Not sure which visa fits your situation?</strong></p>
                  <Link href="/contact" className="btn btn--navy btn--sm" data-en="Book a Free Consultation" data-es="Reserve una Consulta Gratis">Book a Free Consultation</Link>
                </div>
              </div>
            </div>

            <div className="nav-item">
              <Link className={`nav-link${activePage === 'press-media' ? ' is-active' : ''}`} href="/press-media" data-en="Press & Media" data-es="Prensa y Medios">Press &amp; Media</Link>
            </div>
            <div className="nav-item">
              <Link className={`nav-link${activePage === 'videos' ? ' is-active' : ''}`} href="/videos" data-en="Videos" data-es="Videos">Videos</Link>
            </div>
            <div className="nav-item">
              <Link className={`nav-link${activePage === 'blog' ? ' is-active' : ''}`} href="/blog" data-en="Blog" data-es="Blog">Blog</Link>
            </div>
            <div className="nav-item">
              <Link className={`nav-link${activePage === 'contact' ? ' is-active' : ''}`} href="/contact" data-en="Contact Us" data-es="Contáctenos">Contact Us</Link>
            </div>
          </nav>

          <div className="header-cta">
            <Link href="/contact" className="btn btn--gold btn--sm" data-en="Free Consultation" data-es="Consulta Gratis">Free Consultation</Link>
            <button className="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE PANEL */}
      <div className="mobile-overlay" id="mobileOverlay"></div>
      <aside className="mobile-panel" id="mobilePanel" aria-label="Mobile menu">
        <div className="mobile-head">
          <span className="brand-text">
            <span className="bl-top">One Stop</span>
            <span className="bl-mid">Immigration</span>
            <span className="bl-bot">Station <span className="bl-stars">★★★★★</span></span>
          </span>
          <button className="mobile-close" id="mobileClose" aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <nav className="mobile-nav" aria-label="Mobile primary">
          <Link href="/" data-en="Home" data-es="Inicio">Home</Link>
          <Link href="/success-stories" data-en="Success Stories" data-es="Casos de Éxito">Success Stories</Link>
          <div className="m-acc">
            <button className="m-acc-trigger" type="button">
              <span data-en="Services" data-es="Servicios">Services</span>
              <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div className="m-acc-body">
              <a href="#"><strong>Work Visas</strong> — H-1B, L-1, O-1, TN, E-2</a>
              <a href="#"><strong>Student &amp; Exchange</strong> — F-1, M-1, J-1</a>
              <a href="#"><strong>Family &amp; Fiancé</strong> — K-1, K-3, F2–F4</a>
              <a href="#"><strong>Humanitarian</strong> — U, SIJ, DACA, Asylum</a>
            </div>
          </div>
          <Link href="/press-media" data-en="Press & Media" data-es="Prensa y Medios">Press &amp; Media</Link>
          <Link href="/videos" data-en="Videos" data-es="Videos">Videos</Link>
          <Link href="/blog" data-en="Blog" data-es="Blog">Blog</Link>
          <Link href="/contact" data-en="Contact Us" data-es="Contáctenos">Contact Us</Link>
        </nav>
        <div className="mobile-foot">
          <Link href="/contact" className="btn btn--gold" data-en="Free Consultation" data-es="Consulta Gratis">Free Consultation</Link>
          <div className="topbar-contact">
            <a href="tel:18007824769">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              (800) SUB-HROY
            </a>
            <a href="mailto:admin@mylegalimigrationservices.com">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>
              admin@mylegalimigrationservices.com
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
