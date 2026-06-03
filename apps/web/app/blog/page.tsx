import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Blog & News — One Stop Immigration Station',
  description: 'Immigration insights, USCIS updates, and practical guidance for families and employers.',
}

const calIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
const arrowIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
const chevron = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>

export default function BlogPage() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header activePage="blog" />

      <main id="main">
        {/* PAGE HERO */}
        <section className="page-hero">
          <div className="container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              {chevron}
              <span className="current">Blog</span>
            </nav>
            <h1>Blog &amp; News</h1>
            <p className="page-lead">Immigration insights, USCIS updates, and practical guidance for families and employers.</p>
          </div>
        </section>

        {/* BLOG LAYOUT */}
        <section className="section">
          <div className="container blog-layout">
            <div className="post-list">

              <article className="post-item reveal">
                <div className="post-thumb ph" data-label="IPH7">
                  <span className="iph-badge">IPH7</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ph-img" src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=700&q=80&auto=format&fit=crop" alt="" loading="lazy" referrerPolicy="no-referrer" />
                  <div className="blog-date"><div className="d">25</div><div className="m">Feb</div></div>
                </div>
                <div className="post-body">
                  <div className="post-meta">
                    <span className="cat-badge">Workplace</span>
                    <span className="meta-date">{calIcon}Feb 25, 2022</span>
                  </div>
                  <h2><a href="#">Maintaining Employee Well-Being During Times of Uncertainty</a></h2>
                  <p>A mindful approach can help organizations maintain a positive employee experience in uncertain business conditions as economic conditions continue to shift across industries.</p>
                  <a href="#" className="link-arrow">Read More {arrowIcon}</a>
                </div>
              </article>

              <article className="post-item reveal">
                <div className="post-thumb ph" data-label="IPH8">
                  <span className="iph-badge">IPH8</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ph-img" src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=700&q=80&auto=format&fit=crop" alt="" loading="lazy" referrerPolicy="no-referrer" />
                  <div className="blog-date"><div className="d">02</div><div className="m">Jun</div></div>
                </div>
                <div className="post-body">
                  <div className="post-meta">
                    <span className="cat-badge">USCIS Updates</span>
                    <span className="meta-date">{calIcon}Jun 2, 2020</span>
                  </div>
                  <h2><a href="#">USCIS Releases Timetable to Resume Premium Processing for I-129 and I-140</a></h2>
                  <p>USCIS announced that premium processing will resume for all I-129 and I-140 petitions in phases throughout the month — note these dates remain subject to change.</p>
                  <a href="#" className="link-arrow">Read More {arrowIcon}</a>
                </div>
              </article>

              <article className="post-item reveal">
                <div className="post-thumb ph" data-label="IPH9">
                  <span className="iph-badge">IPH9</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ph-img" src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=700&q=80&auto=format&fit=crop" alt="" loading="lazy" referrerPolicy="no-referrer" />
                  <div className="blog-date"><div className="d">02</div><div className="m">Jun</div></div>
                </div>
                <div className="post-body">
                  <div className="post-meta">
                    <span className="cat-badge">Court Decisions</span>
                    <span className="meta-date">{calIcon}Jun 2, 2020</span>
                  </div>
                  <h2><a href="#">Court Decision Overturns Employer-Employee Relationship Scrutiny in H-1B Cases</a></h2>
                  <p>USCIS settled a lawsuit to overturn restrictive H-1B policies, following a District Court opinion ruling that key practices limiting the employer-employee relationship were unlawful.</p>
                  <a href="#" className="link-arrow">Read More {arrowIcon}</a>
                </div>
              </article>

              <article className="post-item reveal">
                <div className="post-thumb ph" data-label="IPH10">
                  <span className="iph-badge">IPH10</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ph-img" src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=700&q=80&auto=format&fit=crop" alt="" loading="lazy" referrerPolicy="no-referrer" />
                  <div className="blog-date"><div className="d">02</div><div className="m">Jun</div></div>
                </div>
                <div className="post-body">
                  <div className="post-meta">
                    <span className="cat-badge">Workplace</span>
                    <span className="meta-date">{calIcon}Jun 2, 2020</span>
                  </div>
                  <h2><a href="#">Maintaining Employee Well-Being During Times of Uncertainty</a></h2>
                  <p>Practical guidance for HR leaders and sponsoring employers on supporting foreign-national staff through processing delays and policy changes.</p>
                  <a href="#" className="link-arrow">Read More {arrowIcon}</a>
                </div>
              </article>

              <article className="post-item reveal">
                <div className="post-thumb ph" data-label="IPH11">
                  <span className="iph-badge">IPH11</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ph-img" src="https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=700&q=80&auto=format&fit=crop" alt="" loading="lazy" referrerPolicy="no-referrer" />
                  <div className="blog-date"><div className="d">20</div><div className="m">Jul</div></div>
                </div>
                <div className="post-body">
                  <div className="post-meta">
                    <span className="cat-badge">Policy</span>
                    <span className="meta-date">{calIcon}Jul 20, 2018</span>
                  </div>
                  <h2><a href="#">COVID-19&apos;s Impact on Immigrants, the Labor Market and the Economy</a></h2>
                  <p>An overview of how pandemic-era restrictions reshaped visa processing, the labor market, and the broader economic outlook for immigrant communities.</p>
                  <a href="#" className="link-arrow">Read More {arrowIcon}</a>
                </div>
              </article>

            </div>

            {/* SIDEBAR */}
            <aside className="sidebar">
              <div className="widget reveal">
                <h3>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
                  <span>Categories</span>
                </h3>
                <div className="cat-list">
                  <a href="#"><span>Workplace</span><span className="count">8</span></a>
                  <a href="#"><span>USCIS Updates</span><span className="count">12</span></a>
                  <a href="#"><span>Court Decisions</span><span className="count">5</span></a>
                  <a href="#"><span>Policy</span><span className="count">9</span></a>
                  <a href="#"><span>Employer Compliance</span><span className="count">6</span></a>
                  <a href="#"><span>Family Immigration</span><span className="count">7</span></a>
                </div>
              </div>
              <div className="widget reveal">
                <h3>{calIcon}<span>Archives</span></h3>
                <div className="archive-list">
                  <a href="#"><span>February 2022</span>{chevron}</a>
                  <a href="#"><span>June 2020</span>{chevron}</a>
                  <a href="#"><span>July 2018</span>{chevron}</a>
                  <a href="#"><span>March 2018</span>{chevron}</a>
                  <a href="#"><span>November 2017</span>{chevron}</a>
                </div>
              </div>
              <div className="help-card reveal">
                <div className="hc-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <h3>Need Help?</h3>
                <p>Have a question about your case? Our bilingual team is one click away.</p>
                <Link href="/contact" className="btn btn--gold">Free Consultation</Link>
              </div>
            </aside>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-strip">
          <div className="container cta-inner">
            <div className="reveal">
              <h2>Never Miss an Update</h2>
              <p>Subscribe to our e-newsletter for important immigration law reform and news, delivered to your inbox.</p>
            </div>
            <div className="cta-actions reveal" style={{flex:1, maxWidth:'440px'}}>
              <form className="news-form" style={{width:'100%'}}>
                <input type="email" required placeholder="you@email.com" aria-label="Email address" />
                <button type="submit" className="btn btn--gold">Subscribe</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
