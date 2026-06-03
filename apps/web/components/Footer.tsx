// ============================================================
// Footer — converted from Claude Design index.html
// ============================================================
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <Link href="/" className="brand">
                <span className="brand-mark">
                  <Image className="brand-bird" src="/logo-bird.png" alt="One Stop Immigration Station" width={40} height={40} />
                </span>
                <span className="brand-text">
                  <span className="bl-top">One Stop</span>
                  <span className="bl-mid">Immigration</span>
                  <span className="bl-bot">Station <span className="bl-stars">★★★★★</span></span>
                </span>
              </Link>
              <p data-en="Centralizing U.S. immigration for businesses, families, and individuals — with legal expertise, attention to detail, and technology that keeps your case moving." data-es="Centralizando la inmigración a EE.UU. para empresas, familias e individuos — con experiencia legal, atención al detalle y tecnología que mantiene su caso en marcha.">
                Centralizing U.S. immigration for businesses, families, and individuals — with legal expertise, attention to detail, and technology that keeps your case moving.
              </p>
              <div className="footer-social">
                <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 16.99 22 12z"/></svg></a>
                <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.2 8h4.6v13H.2V8zm7.4 0h4.4v1.78h.06c.61-1.16 2.11-2.38 4.34-2.38 4.64 0 5.5 3.05 5.5 7.02V21h-4.6v-6.18c0-1.47-.03-3.37-2.05-3.37-2.06 0-2.37 1.6-2.37 3.26V21H7.6V8z"/></svg></a>
                <a href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.24 2H21.5l-7.13 8.15L22.75 22h-6.56l-5.14-6.72L5.16 22H1.9l7.62-8.71L1.25 2h6.72l4.64 6.14L18.24 2zm-1.15 18h1.81L7.01 3.9H5.06L17.09 20z"/></svg></a>
                <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg></a>
              </div>
            </div>

            <div className="footer-col">
              <h4 data-en="Navigate" data-es="Navegar">Navigate</h4>
              <div className="footer-links">
                <Link href="/" data-en="Home" data-es="Inicio">Home</Link>
                <Link href="/success-stories" data-en="Success Stories" data-es="Casos de Éxito">Success Stories</Link>
                <Link href="/press-media" data-en="Press & Media" data-es="Prensa y Medios">Press &amp; Media</Link>
                <Link href="/videos" data-en="Videos" data-es="Videos">Videos</Link>
                <Link href="/blog" data-en="Blog" data-es="Blog">Blog</Link>
                <Link href="/#testimonials" data-en="Testimonials" data-es="Testimonios">Testimonials</Link>
                <Link href="/contact" data-en="Contact Us" data-es="Contáctenos">Contact Us</Link>
              </div>
            </div>

            <div className="footer-col">
              <h4 data-en="Services" data-es="Servicios">Services</h4>
              <div className="footer-links">
                <a href="/#services" data-en="Work Visas" data-es="Visas de Trabajo">Work Visas</a>
                <a href="/#services" data-en="Student Visas" data-es="Visas de Estudiante">Student Visas</a>
                <a href="/#services" data-en="Fiancé & Spousal" data-es="Prometido(a) y Cónyuge">Fiancé &amp; Spousal</a>
                <a href="/#services" data-en="Humanitarian" data-es="Humanitaria">Humanitarian</a>
                <a href="/#services" data-en="Family Visas" data-es="Visas Familiares">Family Visas</a>
                <a href="/#services" data-en="I-9 Audits" data-es="Auditorías I-9">I-9 Audits</a>
              </div>
            </div>

            <div className="footer-news">
              <h4 data-en="Join our E-Newsletter" data-es="Únase a Nuestro Boletín">Join our E-Newsletter</h4>
              <p data-en="Stay current on important immigration law reform and news." data-es="Manténgase al día sobre reformas y noticias importantes de la ley migratoria.">
                Stay current on important immigration law reform and news.
              </p>
              <form className="news-form" id="newsForm">
                <input type="email" required placeholder="you@email.com" aria-label="Email address" data-ph-en="you@email.com" data-ph-es="usted@correo.com" />
                <button type="submit" className="btn btn--gold" data-en="Join" data-es="Unirse">Join</button>
              </form>
              <address className="footer-addr">
                69 Station Avenue, Suite 2445<br />
                New York, NY 10001, USA<br />
                <a href="tel:18007824769">(800) SUB-HROY</a><br />
                <a href="mailto:admin@mylegalimigrationservices.com">admin@mylegalimigrationservices.com</a>
              </address>
            </div>
          </div>

          <div className="footer-bar">
            <span>© 2026 One Stop Immigration Station. <span data-en="All rights reserved." data-es="Todos los derechos reservados.">All rights reserved.</span></span>
            <nav aria-label="Legal">
              <a href="#" data-en="Privacy Policy" data-es="Política de Privacidad">Privacy Policy</a>
              <a href="#" data-en="Terms of Use" data-es="Términos de Uso">Terms of Use</a>
              <a href="#" data-en="Disclaimer" data-es="Aviso Legal">Disclaimer</a>
            </nav>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY CALL BAR */}
      <nav className="mobile-bar" aria-label="Quick contact">
        <a className="mb-call" href="tel:18007824769">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span data-en="Call Us" data-es="Llamar">Call Us</span>
        </a>
        <Link className="mb-consult" href="/contact">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span data-en="Free Consult" data-es="Consulta">Free Consult</span>
        </Link>
      </nav>
    </>
  )
}
