import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Press & Media — One Stop Immigration Station',
  description: 'Press releases, media coverage, and news about One Stop Immigration Station.',
}

export default function PressMediaPage() {
  const pressItems = [
    { type: 'Press Release', title: 'One Stop Immigration Station Expands Humanitarian Visa Practice', date: 'Coming Soon', excerpt: 'The firm announces expanded services for asylum seekers, DACA recipients, and U visa applicants as immigration demand grows.' },
    { type: 'Media Coverage', title: 'How Small Law Firms Are Adapting to USCIS Processing Delays', date: 'Coming Soon', excerpt: 'One Stop Immigration Station was quoted in a regional legal journal discussing strategies for managing client expectations during extended processing times.' },
    { type: 'Press Release', title: 'Firm Launches Bilingual Immigration Helpline for Spanish-Speaking Clients', date: 'Coming Soon', excerpt: 'New Spanish-language consultation service makes expert immigration guidance accessible to the growing Latino community in the Southeast.' },
    { type: 'Award', title: 'One Stop Immigration Recognized Among Top Immigration Law Practices in Georgia', date: 'Coming Soon', excerpt: 'The firm received recognition for excellence in client service and case outcomes in the annual legal services directory.' },
    { type: 'Media Coverage', title: 'Immigration Attorney Commentary: Impact of Recent H-1B Rule Changes', date: 'Coming Soon', excerpt: 'Our lead attorney provided expert commentary on new USCIS H-1B lottery rules and what they mean for employers and petitioners.' },
    { type: 'Press Release', title: 'New I-9 Compliance Workshop Series for Georgia Employers', date: 'Coming Soon', excerpt: 'Free quarterly workshops help employers understand Form I-9 requirements, E-Verify, and how to avoid costly audit violations.' },
  ]

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header activePage="press-media" />

      <main id="main">
        {/* PAGE HERO */}
        <section className="page-hero">
          <div className="container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              <span className="current">Press &amp; Media</span>
            </nav>
            <h1>Press &amp; Media</h1>
            <p className="page-lead">News, press releases, and media coverage from One Stop Immigration Station.</p>
          </div>
        </section>

        {/* COMING SOON */}
        <section className="section">
          <div className="container">
            <div className="coming-soon reveal">
              <div className="cs-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
              </div>
              <span className="cs-badge">Coming Soon</span>
              <h2>Press coverage is on its way</h2>
              <p>Our media coverage, press releases, and awards will be published here. For press inquiries, please contact our communications team directly.</p>
              <a href="mailto:admin@mylegalimigrationservices.com" className="btn btn--navy">
                Media Inquiries
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </section>

        {/* PRESS ITEMS */}
        <section className="section" style={{paddingTop:0}}>
          <div className="container">
            <div className="section-head section-head--center reveal">
              <span className="eyebrow eyebrow--center">Recent Coverage</span>
              <h2 className="section-title">In the news</h2>
            </div>
            <div className="press-grid">
              {pressItems.map((item, i) => (
                <article className="press-card reveal" key={i}>
                  <span className={`press-type press-type--${item.type.toLowerCase().replace(/\s+/g, '-')}`}>{item.type}</span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <span className="press-date">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    {item.date}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* MEDIA CONTACT */}
        <section className="section section--tight" style={{paddingTop:0}}>
          <div className="container">
            <div className="media-contact reveal">
              <div className="mc-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
              </div>
              <div className="mc-body">
                <h3>Media Contact</h3>
                <p>For press inquiries, interview requests, or media kit, please reach out to our communications team.</p>
                <a href="mailto:admin@mylegalimigrationservices.com" className="btn btn--navy">Contact Media Team</a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-strip">
          <div className="container cta-inner">
            <div className="reveal">
              <h2>Need Immigration Help?</h2>
              <p>Whether you read about us in the press or found us through a referral — we&apos;re here to help with a free consultation.</p>
            </div>
            <div className="cta-actions reveal">
              <Link href="/contact" className="btn btn--gold">Free Consultation</Link>
              <a href="tel:18007824769" className="btn btn--outline-light">Call (800) SUB-HROY</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
