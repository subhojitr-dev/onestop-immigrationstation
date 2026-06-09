import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Watch Videos — One Stop Immigration Station",
  description: "Clear, plain-language immigration explainers and USCIS updates — watch at your own pace.",
};

/** Convert YouTube watch URL to embed URL */
function toEmbed(url: string): string | null {
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (short) return `https://www.youtube.com/embed/${short[1]}`
  const long = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (long) return `https://www.youtube.com/embed/${long[1]}`
  if (url.includes('youtube.com/embed/')) return url
  return null
}

/** Split videos into active (<90 days) and archived (90d–1yr) */
function splitByAge(videos: any[]) {
  const now = Date.now(), d90 = 90 * 24 * 60 * 60 * 1000
  const active: any[] = [], archived: any[] = []
  for (const v of videos) {
    const age = v.published_at ? now - new Date(v.published_at).getTime() : 0
    if (age > d90) archived.push(v)
    else active.push(v)
  }
  return { active, archived }
}

// ── Shared header / footer (same as blog page) ──────────────────────────────

const TopBar = () => (
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
          <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg></a>
        </div>
        <div className="lang-toggle" role="group" aria-label="Language">
          <button data-lang="en" className="active" type="button">EN</button>
          <button data-lang="es" type="button">ES</button>
        </div>
      </div>
    </div>
  </div>
)

const SiteHeader = () => (
  <>
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
                  <h4>Family &amp; Fiancé</h4>
                  <a href="/#services"><b>K-1</b><span>Fiancé visa</span></a>
                  <a href="/#services"><b>K-3</b><span>Spousal visa</span></a>
                  <h4 style={{marginTop:"16px"}}>Humanitarian</h4>
                  <a href="/#services"><b>DACA</b><span>Childhood arrivals</span></a>
                  <a href="/#services"><b>Asylum</b><span>Refugee protection</span></a>
                </div>
              </div>
              <div className="mega-foot">
                <Link href="/contact" className="btn btn--navy btn--sm">Book a Free Consultation</Link>
              </div>
            </div>
          </div>
          <div className="nav-item"><Link className="nav-link" href="/press-media">Press &amp; Media</Link></div>
          <div className="nav-item"><Link className="nav-link is-active" href="/videos">Videos</Link></div>
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
        <Link href="/press-media">Press &amp; Media</Link>
        <Link href="/videos">Videos</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/contact">Contact Us</Link>
      </nav>
      <div className="mobile-foot">
        <Link href="/contact" className="btn btn--gold">Free Consultation</Link>
      </div>
    </aside>
  </>
)

const SiteFooter = () => (
  <>
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Link href="/" className="brand">
              <span className="brand-mark"><img className="brand-bird" src="/logo-bird.png" alt="One Stop Immigration Station" /></span>
              <span className="brand-text"><span className="bl-top">One Stop</span><span className="bl-mid">Immigration</span><span className="bl-bot">Station <span className="bl-stars">★★★★★</span></span></span>
            </Link>
            <p>Centralizing U.S. immigration for businesses, families, and individuals — with legal expertise and technology that keeps your case moving.</p>
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
              <a href="/#services">Work Visas</a><a href="/#services">Family Visas</a>
              <a href="/#services">Humanitarian</a><a href="/#services">Green Card</a>
            </div>
          </div>
          <div className="footer-news">
            <h4>Join our E-Newsletter</h4>
            <p>Stay current on immigration law reform and news.</p>
            <form className="news-form"><input type="email" required placeholder="you@email.com" aria-label="Email address" /><button type="submit" className="btn btn--gold">Join</button></form>
            <address className="footer-addr">69 Station Avenue, Suite 2445<br />New York, NY 10001, USA<br /><a href="tel:18007824769">(800) SUB-HROY</a></address>
          </div>
        </div>
        <div className="footer-bar">
          <span>© 2026 One Stop Immigration Station. All rights reserved.</span>
          <nav aria-label="Legal"><a href="#">Privacy Policy</a><a href="#">Terms of Use</a></nav>
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
)

// ── Placeholder cards shown when no videos are published yet ─────────────────
const PLACEHOLDER_VIDEOS = [
  { tag:"Work", title:"H-1B Visa Process Explained", desc:"A step-by-step walkthrough from labor condition application to approval." },
  { tag:"Family", title:"Family-Based Immigration Overview", desc:"Preference categories and how to sponsor a spouse, child, or parent." },
  { tag:"Business", title:"I-9 Compliance for Employers", desc:"What every business needs to keep employment eligibility records audit-ready." },
  { tag:"Humanitarian", title:"DACA — What You Need to Know", desc:"Eligibility, renewals, and the latest on Deferred Action for Childhood Arrivals." },
  { tag:"Citizenship", title:"Path to U.S. Citizenship", desc:"From green card to naturalization — requirements and the oath ceremony." },
  { tag:"Work", title:"Green Card Through Employment", desc:"The EB categories explained, including PERM labor certification." },
]

export default async function VideosPage() {
  const supabase = await createClient()

  // Fetch published youtube_video posts
  const { data: dbVideos } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, category, published_at, youtube_url, author_name')
    .eq('is_published', true)
    .eq('post_type', 'youtube_video')
    .order('published_at', { ascending: false })
    .limit(50)

  const hasVideos = dbVideos && dbVideos.length > 0
  const { active, archived } = hasVideos ? splitByAge(dbVideos) : { active: [], archived: [] }

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <TopBar />
      <SiteHeader />

      <main id="main">
        <section className="page-hero">
          <div className="container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              <span className="current">Videos</span>
            </nav>
            <h1>Watch Videos</h1>
            <p className="page-lead">Clear, plain-language immigration explainers — watch at your own pace.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">

            {/* ── Live videos from CMS ── */}
            {hasVideos && active.length > 0 && (
              <>
                <div className="section-head reveal" style={{ marginBottom: '36px' }}>
                  <span className="eyebrow">Video Library</span>
                  <h2 className="section-title">Latest Videos</h2>
                </div>

                <div className="video-grid">
                  {active.map((video: any) => {
                    const embed = toEmbed(video.youtube_url || '')
                    if (!embed) return null
                    return (
                      <article key={video.id} className="video-card reveal">
                        <div style={{ borderRadius: '12px 12px 0 0', overflow: 'hidden', aspectRatio: '16/9' }}>
                          <iframe
                            src={embed}
                            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            title={video.title}
                            loading="lazy"
                          />
                        </div>
                        <div className="video-body">
                          {video.category && <span className="v-tag">{video.category}</span>}
                          <h3 style={{ marginTop: '8px' }}>{video.title}</h3>
                          {video.excerpt && <p>{video.excerpt}</p>}
                          {video.published_at && (
                            <div style={{ fontSize: '12px', color: '#98a0b0', marginTop: '6px' }}>
                              {new Date(video.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                          )}
                        </div>
                      </article>
                    )
                  })}
                </div>

                {/* Archive section */}
                {archived.length > 0 && (
                  <details style={{ marginTop: '40px' }}>
                    <summary style={{ cursor: 'pointer', padding: '12px 18px', background: '#f5f6fa', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#586176', listStyle: 'none', display: 'flex', alignItems: 'center', gap: '8px', userSelect: 'none' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      Archive — Older Videos ({archived.length})
                    </summary>
                    <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                      {archived.map((video: any) => {
                        const embed = toEmbed(video.youtube_url || '')
                        if (!embed) return null
                        return (
                          <article key={video.id} className="video-card">
                            <div style={{ borderRadius: '12px 12px 0 0', overflow: 'hidden', aspectRatio: '16/9', opacity: 0.8 }}>
                              <iframe src={embed} style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} allowFullScreen title={video.title} loading="lazy" />
                            </div>
                            <div className="video-body">
                              <h3 style={{ fontSize: '14px' }}>{video.title}</h3>
                              <div style={{ fontSize: '12px', color: '#98a0b0', marginTop: '4px' }}>
                                {video.published_at ? new Date(video.published_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                              </div>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  </details>
                )}
              </>
            )}

            {/* ── Coming soon placeholder (no videos yet) ── */}
            {!hasVideos && (
              <>
                <div className="coming-soon reveal">
                  <div className="cs-ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
                  </div>
                  <span className="cs-badge">Coming Soon</span>
                  <h2>Our video library is in production</h2>
                  <p>We&apos;re filming a full series of immigration explainers. Get notified when they go live.</p>
                  <Link href="/contact" className="btn btn--navy">Get Notified <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></Link>
                </div>

                <div style={{ paddingTop: '40px' }}>
                  <div className="section-head section-head--center reveal" style={{ marginBottom: '36px' }}>
                    <span className="eyebrow eyebrow--center">Video Library</span>
                    <h2 className="section-title">Coming to the channel</h2>
                  </div>
                  <div className="video-grid">
                    {PLACEHOLDER_VIDEOS.map((v, i) => (
                      <article key={i} className="video-card reveal">
                        <div className="video-thumb">
                          <span className="v-tag">{v.tag}</span>
                          <span className="play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>
                        </div>
                        <div className="video-body">
                          <h3>{v.title}</h3>
                          <p>{v.desc}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>
        </section>

        <section className="cta-strip">
          <div className="container cta-inner">
            <div className="reveal">
              <h2>Have Questions About Your Case?</h2>
              <p>Videos are a great start — but nothing beats personalized advice. Talk to our bilingual team for free.</p>
            </div>
            <div className="cta-actions reveal">
              <Link href="/contact" className="btn btn--gold">Book a Free Consultation</Link>
              <a href="tel:18007824769" className="btn btn--outline-light">Call (800) SUB-HROY</a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
