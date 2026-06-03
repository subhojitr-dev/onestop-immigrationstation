import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Videos — One Stop Immigration Station',
  description: 'Watch our immigration law video guides covering visas, green cards, DACA, and more.',
}

export default function VideosPage() {
  const videos = [
    { title: 'H-1B Visa Process Explained Step by Step', cat: 'Work Visas', dur: '12:34' },
    { title: 'Family-Based Immigration: K-1 & K-3 Visas', cat: 'Family Visas', dur: '9:18' },
    { title: 'I-9 Compliance for Employers — What You Need to Know', cat: 'Employer', dur: '15:02' },
    { title: 'DACA Renewal — A Complete Walkthrough', cat: 'Humanitarian', dur: '11:45' },
    { title: 'Path to U.S. Citizenship — Naturalization Guide', cat: 'Citizenship', dur: '18:27' },
    { title: 'Green Card Through Employment — PERM & I-140', cat: 'Work Visas', dur: '14:56' },
  ]

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header activePage="videos" />

      <main id="main">
        {/* PAGE HERO */}
        <section className="page-hero">
          <div className="container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              <span className="current">Videos</span>
            </nav>
            <h1>Immigration Videos</h1>
            <p className="page-lead">Watch our library of immigration guides — from H-1B basics to naturalization — in English and Español.</p>
          </div>
        </section>

        {/* COMING SOON */}
        <section className="section">
          <div className="container">
            <div className="coming-soon reveal">
              <div className="cs-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
              </div>
              <span className="cs-badge">Coming Soon</span>
              <h2>Video library launching soon</h2>
              <p>We&apos;re producing a full library of immigration explainer videos in both English and Español. Subscribe to our newsletter to be notified on launch.</p>
              <Link href="/contact" className="btn btn--navy">
                Get Notified
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* VIDEO GRID */}
        <section className="section" style={{paddingTop:0}}>
          <div className="container">
            <div className="section-head section-head--center reveal">
              <span className="eyebrow eyebrow--center">Placeholder Library</span>
              <h2 className="section-title">Topics we&apos;ll cover</h2>
            </div>
            <div className="vid-grid">
              {videos.map((v, i) => (
                <div className="vid-card reveal" key={i}>
                  <div className="vid-thumb">
                    <span className="iph-badge">IPH{12 + i}</span>
                    <button className="play-btn" type="button" aria-label={`Play: ${v.title}`}>
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
                    </button>
                    <span className="vid-dur">{v.dur}</span>
                  </div>
                  <div className="vid-body">
                    <span className="cat-badge">{v.cat}</span>
                    <h3>{v.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-strip">
          <div className="container cta-inner">
            <div className="reveal">
              <h2>Still Have Questions?</h2>
              <p>Our bilingual attorneys are ready to walk you through your specific situation — no obligation, no pressure.</p>
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
