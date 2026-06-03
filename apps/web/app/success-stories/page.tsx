import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Success Stories — One Stop Immigration Station',
  description: 'Real people, real outcomes. Behind every case is a family reunited, a career secured, or a business protected.',
}

const stars = (
  <div className="testi-stars" aria-label="5 out of 5">
    {[...Array(5)].map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg>
    ))}
  </div>
)

export default function SuccessStoriesPage() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header activePage="success-stories" />

      <main id="main">
        {/* PAGE HERO */}
        <section className="page-hero">
          <div className="container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/" data-en="Home" data-es="Inicio">Home</Link>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              <span className="current">Success Stories</span>
            </nav>
            <h1>Success Stories</h1>
            <p className="page-lead">Real people, real outcomes. Behind every case is a family reunited, a career secured, or a business protected.</p>
          </div>
        </section>

        {/* COMING SOON */}
        <section className="section">
          <div className="container">
            <div className="coming-soon reveal">
              <div className="cs-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
              </div>
              <span className="cs-badge">Coming Soon</span>
              <h2>A wall of wins is on its way</h2>
              <p>We&apos;re collecting detailed case studies and client video stories. In the meantime, here&apos;s what some of the people we&apos;ve helped have to say.</p>
              <Link href="/contact" className="btn btn--navy">
                Share Your Story
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="section testi" style={{paddingTop:0}}>
          <div className="container">
            <div className="section-head section-head--center reveal" style={{marginBottom:'8px'}}>
              <span className="eyebrow eyebrow--center">Client Testimonials</span>
              <h2 className="section-title">Outcomes our clients celebrate</h2>
            </div>
            <div className="testi-grid">
              <article className="testi-card reveal">
                {stars}
                <p className="testi-quote">&ldquo;After an initial denial, they rebuilt our H-1B case from the ground up and won the approval. We never felt alone in the process.&rdquo;</p>
                <div className="testi-person"><span className="testi-avatar">R</span><span><span className="name">Rahul &amp; Anita M.</span><span className="role">H-1B Approval</span></span></div>
              </article>
              <article className="testi-card reveal">
                {stars}
                <p className="testi-quote">&ldquo;They reunited me with my husband through the F2A category faster than we ever expected. Forever grateful to this team.&rdquo;</p>
                <div className="testi-person"><span className="testi-avatar">L</span><span><span className="name">Lucía F.</span><span className="role">F2A Family Reunion</span></span></div>
              </article>
              <article className="testi-card reveal">
                {stars}
                <p className="testi-quote">&ldquo;Facing removal was terrifying. Their defense strategy was meticulous and they fought for me until the case was closed in my favor.&rdquo;</p>
                <div className="testi-person"><span className="testi-avatar">J</span><span><span className="name">James O.</span><span className="role">Removal Defense Win</span></span></div>
              </article>
              <article className="testi-card reveal">
                {stars}
                <p className="testi-quote">&ldquo;As an artist, the O-1 felt out of reach. They organized my evidence beautifully and made an undeniable case for my talent.&rdquo;</p>
                <div className="testi-person"><span className="testi-avatar">S</span><span><span className="name">Sofia &amp; Daniel</span><span className="role">O-1 Visa</span></span></div>
              </article>
              <article className="testi-card reveal">
                {stars}
                <p className="testi-quote">&ldquo;Our K-1 fiancé visa journey was smooth from start to finish. Every form, every interview — they prepared us perfectly.&rdquo;</p>
                <div className="testi-person"><span className="testi-avatar">M</span><span><span className="name">Maria &amp; Kevin</span><span className="role">K-1 Fiancé Visa</span></span></div>
              </article>
              <article className="testi-card reveal">
                {stars}
                <p className="testi-quote">&ldquo;Their I-9 audit left our records spotless and audit-ready. Professional, thorough, and genuinely invested in protecting our business.&rdquo;</p>
                <div className="testi-person"><span className="testi-avatar">T</span><span><span className="name">TechFlow Inc.</span><span className="role">I-9 Compliance</span></span></div>
              </article>
            </div>
          </div>
        </section>

        {/* CTA */}
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

      <Footer />
    </>
  )
}
