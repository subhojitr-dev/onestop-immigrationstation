import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Blog & News — One Stop Immigration Station",
  description: "Immigration insights, USCIS updates, and practical guidance for families and employers.",
};

const NavBar = ({ active }: { active: string }) => (
  <>
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
          <div className="nav-item"><Link className={`nav-link${active==='home'?' is-active':''}`} href="/">Home</Link></div>
          <div className="nav-item"><Link className={`nav-link${active==='success'?' is-active':''}`} href="/success-stories">Success Stories</Link></div>
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
          <div className="nav-item"><Link className={`nav-link${active==='press'?' is-active':''}`} href="/press-media">Press &amp; Media</Link></div>
          <div className="nav-item"><Link className={`nav-link${active==='videos'?' is-active':''}`} href="/videos">Videos</Link></div>
          <div className="nav-item"><Link className={`nav-link${active==='blog'?' is-active':''}`} href="/blog">Blog</Link></div>
          <div className="nav-item"><Link className={`nav-link${active==='contact'?' is-active':''}`} href="/contact">Contact Us</Link></div>
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
  </>
);

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
            <p>Centralizing U.S. immigration for businesses, families, and individuals — with legal expertise, attention to detail, and technology that keeps your case moving.</p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 16.99 22 12z"/></svg></a>
              <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.2 8h4.6v13H.2V8zm7.4 0h4.4v1.78h.06c.61-1.16 2.11-2.38 4.34-2.38 4.64 0 5.5 3.05 5.5 7.02V21h-4.6v-6.18c0-1.47-.03-3.37-2.05-3.37-2.06 0-2.37 1.6-2.37 3.26V21H7.6V8z"/></svg></a>
              <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg></a>
            </div>
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
            <form className="news-form" id="newsForm">
              <input type="email" required placeholder="you@email.com" aria-label="Email address" />
              <button type="submit" className="btn btn--gold">Join</button>
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
          <span>© 2026 One Stop Immigration Station. All rights reserved.</span>
          <nav aria-label="Legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Disclaimer</a>
          </nav>
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

// Hardcoded fallback posts shown when Supabase has no published posts yet
const FALLBACK_POSTS = [
  { id:'1', slug:'#', title:'Maintaining Employee Well-Being During Times of Uncertainty', excerpt:'A mindful approach can help organizations maintain a positive employee experience in uncertain business conditions.', category:'Workplace', author_name:'OSIS Team', published_at:'2022-02-25', featured_image:'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&h=450&q=80' },
  { id:'2', slug:'#', title:'USCIS Releases Timetable to Resume Premium Processing for I-129 and I-140', excerpt:'USCIS announced that premium processing will resume for all I-129 and I-140 petitions in phases.', category:'USCIS Updates', author_name:'OSIS Team', published_at:'2020-06-02', featured_image:'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&h=450&q=80' },
  { id:'3', slug:'#', title:'H-1B Cap Season: What Employers Need to Know', excerpt:'As the H-1B cap season approaches, employers must prepare their petitions well in advance of the April filing window.', category:'H-1B', author_name:'OSIS Team', published_at:'2024-01-15', featured_image:'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&h=450&q=80' },
]

/** Split a date into active (<90 days) vs archived (90d–1yr) */
function splitByAge(posts: any[]) {
  const now   = Date.now()
  const d90   = 90 * 24 * 60 * 60 * 1000
  const active: any[] = []
  const archived: any[] = []
  for (const p of posts) {
    const age = p.published_at ? now - new Date(p.published_at).getTime() : 0
    if (age > d90) archived.push(p)
    else active.push(p)
  }
  return { active, archived }
}

const PAGE_SIZE = 8

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const { category: rawCategory, page: rawPage } = await searchParams
  const activeCategory = rawCategory || ''
  const page = Math.max(1, parseInt(rawPage || '1', 10))
  const offset = (page - 1) * PAGE_SIZE

  const supabase = await createClient()

  // Build the main query with optional category filter
  let query = supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, category, author_name, published_at, featured_image, post_type', { count: 'exact' })
    .eq('is_published', true)
    .in('post_type', ['article', 'uscis_news'])
    .order('published_at', { ascending: false })

  if (activeCategory) query = query.eq('category', activeCategory)

  const { data: dbPosts, count: totalCount } = await query
    .range(offset, offset + PAGE_SIZE - 1)

  // Legacy posts (pre-migration, null post_type) — only on page 1, no category filter
  let legacyPosts: any[] = []
  if (!activeCategory && page === 1) {
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, category, author_name, published_at, featured_image, post_type')
      .eq('is_published', true)
      .is('post_type', null)
      .order('published_at', { ascending: false })
      .limit(10)
    legacyPosts = data ?? []
  }

  // Fetch category counts for sidebar (only article + uscis_news)
  const { data: categoryData } = await supabase
    .from('blog_posts')
    .select('category')
    .eq('is_published', true)
    .in('post_type', ['article', 'uscis_news'])

  const categoryCounts: Record<string, number> = {}
  for (const row of categoryData ?? []) {
    if (row.category) categoryCounts[row.category] = (categoryCounts[row.category] || 0) + 1
  }
  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])

  const allPosts = [...(dbPosts ?? []), ...legacyPosts]
  const totalPages = Math.ceil((totalCount ?? 0) / PAGE_SIZE)

  const { active, archived } = splitByAge(allPosts.length > 0 ? allPosts : (page === 1 && !activeCategory ? FALLBACK_POSTS : []))
  const posts = active.length > 0 ? active : (page === 1 && !activeCategory ? FALLBACK_POSTS : [])

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <NavBar active="blog" />

      <main id="main">
        <section className="page-hero">
          <div className="container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              <span className="current">Blog</span>
            </nav>
            <h1>Blog &amp; News</h1>
            <p className="page-lead">Immigration insights, USCIS updates, and practical guidance for families and employers.</p>
          </div>
        </section>

        <section className="section">
          <div className="container blog-layout">
            <div className="post-list">
              {/* USCIS News banner if any uscis_news posts are in the active list */}
              {posts.some((p: any) => p.post_type === 'uscis_news') && (
                <div style={{ background: '#e6f6ef', border: '1px solid #047857', borderRadius: '12px', padding: '12px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#047857' }}>
                  🏛️ <strong>USCIS Updates</strong> — Official news imported from USCIS.gov
                </div>
              )}
              {posts.map((post: any) => {
                const date = post.published_at ? new Date(post.published_at) : null
                const day  = date ? date.getDate().toString().padStart(2,'0') : ''
                const mon  = date ? date.toLocaleDateString('en-US',{month:'short'}) : ''
                const href = post.slug === '#' ? '#' : `/blog/${post.slug}`
                return (
                  <article key={post.id} className="post-item reveal">
                    <div className="post-thumb ph has-img">
                      {post.featured_image
                        ? <img className="ph-img" src={post.featured_image} alt="" loading="lazy" referrerPolicy="no-referrer" />
                        : <div className="ph-img" style={{background:'linear-gradient(135deg,#1a2744,#243355)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'40px'}}>📰</div>
                      }
                      {day && <div className="blog-date"><div className="d">{day}</div><div className="m">{mon}</div></div>}
                    </div>
                    <div className="post-body">
                      <div className="post-meta">
                        <span className="cat-badge">{post.category || 'Immigration'}</span>
                        {date && (
                          <span className="meta-date">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                            {date.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                          </span>
                        )}
                      </div>
                      <h2><a href={href}>{post.title}</a></h2>
                      {post.excerpt && <p>{post.excerpt}</p>}
                      <a href={href} className="link-arrow">
                        Read More <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </a>
                    </div>
                  </article>
                )
              })}
              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '24px 0 8px', borderTop: '1px solid #e7e9f0', marginTop: '24px' }}>
                  <Link
                    href={page > 1 ? `/blog?${activeCategory ? `category=${encodeURIComponent(activeCategory)}&` : ''}page=${page - 1}` : '#'}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '9px', border: '1.5px solid', borderColor: page > 1 ? '#1a2744' : '#e7e9f0', background: '#fff', color: page > 1 ? '#1a2744' : '#98a0b0', fontWeight: 600, fontSize: '14px', textDecoration: 'none', pointerEvents: page > 1 ? 'auto' : 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    Previous
                  </Link>
                  <span style={{ fontSize: '13px', color: '#586176' }}>Page {page} of {totalPages}</span>
                  <Link
                    href={page < totalPages ? `/blog?${activeCategory ? `category=${encodeURIComponent(activeCategory)}&` : ''}page=${page + 1}` : '#'}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '9px', border: '1.5px solid', borderColor: page < totalPages ? '#1a2744' : '#e7e9f0', background: page < totalPages ? '#1a2744' : '#fff', color: page < totalPages ? '#fff' : '#98a0b0', fontWeight: 600, fontSize: '14px', textDecoration: 'none', pointerEvents: page < totalPages ? 'auto' : 'none' }}>
                    Next
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </Link>
                </div>
              )}

              {/* Empty state for filtered view */}
              {posts.length === 0 && activeCategory && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#98a0b0' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
                  <p style={{ fontSize: '15px' }}>No posts in <strong style={{ color: '#1a2744' }}>{activeCategory}</strong> yet.</p>
                  <Link href="/blog" style={{ color: '#b8952a', fontWeight: 600, textDecoration: 'none', fontSize: '14px' }}>View all posts →</Link>
                </div>
              )}

              {/* Archive section — posts 90–365 days old */}
              {archived.length > 0 && (
                <details style={{ marginTop: '24px' }}>
                  <summary style={{ cursor: 'pointer', padding: '12px 18px', background: '#f5f6fa', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#586176', listStyle: 'none', display: 'flex', alignItems: 'center', gap: '8px', userSelect: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    Archive ({archived.length} older {archived.length === 1 ? 'post' : 'posts'})
                  </summary>
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {archived.map((post: any) => (
                      <a key={post.id} href={`/blog/${post.slug}`}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f9fafb', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', color: '#1a2744', gap: '12px' }}>
                        <span style={{ fontWeight: 500 }}>{post.title}</span>
                        <span style={{ fontSize: '12px', color: '#98a0b0', flexShrink: 0 }}>
                          {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                        </span>
                      </a>
                    ))}
                  </div>
                </details>
              )}
            </div>

            <aside className="sidebar">
              <div className="widget reveal">
                <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h18M3 12h18M3 17h18"/></svg><span>Categories</span></h3>
                <div className="cat-list">
                  {/* All Categories link */}
                  <Link href="/blog"
                    style={{ fontWeight: activeCategory === '' ? 700 : 400, color: activeCategory === '' ? '#1a2744' : undefined }}>
                    <span>All Categories</span>
                    <span className="count">{(totalCount ?? 0) + legacyPosts.length}</span>
                  </Link>
                  {sortedCategories.length > 0
                    ? sortedCategories.map(([cat, cnt]) => (
                        <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`}
                          style={{ fontWeight: activeCategory === cat ? 700 : 400, color: activeCategory === cat ? '#1a2744' : undefined }}>
                          <span>{cat}</span>
                          <span className="count">{cnt}</span>
                        </Link>
                      ))
                    : /* fallback when DB is empty */
                      ['Policy & News','USCIS Updates','H-1B','Green Card','Family Immigration','Workplace'].map(cat => (
                        <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`}>
                          <span>{cat}</span>
                        </Link>
                      ))
                  }
                </div>
              </div>

              {/* Active filter indicator */}
              {activeCategory && (
                <div className="widget reveal" style={{ background: '#f0f4ff', border: '1px solid #1a2744' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a2744' }}>
                      Filtered: {activeCategory}
                    </span>
                    <Link href="/blog" style={{ fontSize: '12px', color: '#b42318', textDecoration: 'none', fontWeight: 600 }}>✕ Clear</Link>
                  </div>
                </div>
              )}
              <div className="help-card reveal">
                <div className="hc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg></div>
                <h3>Need Help?</h3>
                <p>Have a question about your case? Our bilingual team is one click away.</p>
                <Link href="/contact" className="btn btn--gold">Free Consultation</Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="cta-strip">
          <div className="container cta-inner">
            <div className="reveal">
              <h2>Never Miss an Update</h2>
              <p>Subscribe to our e-newsletter for important immigration law reform and news, delivered to your inbox.</p>
            </div>
            <div className="cta-actions reveal" style={{flex:"1",maxWidth:"440px"}}>
              <form className="news-form" style={{width:"100%"}}>
                <input type="email" required placeholder="you@email.com" aria-label="Email address" />
                <button type="submit" className="btn btn--gold">Subscribe</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
