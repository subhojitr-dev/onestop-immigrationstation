import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <a href="#main" className="skip-link" data-en="Skip to content" data-es="Saltar al contenido">Skip to content</a>
      <Header activePage="home" />

      <main id="main">

        {/* HERO */}
        <section className="hero">
          <div className="container">
            <div className="hero-copy">
              <span className="hero-pill">
                <span className="dot"></span>
                <span data-en="Trusted U.S. immigration representation" data-es="Representación migratoria confiable en EE.UU.">Trusted U.S. immigration representation</span>
              </span>
              <h1 data-en='Navigating U.S. Immigration — <span class="accent">One Step at a Time</span>' data-es='Navegando la Inmigración a EE.UU. — <span class="accent">Un Paso a la Vez</span>'>
                Navigating U.S. Immigration — <span className="accent">One Step at a Time</span>
              </h1>
              <p className="hero-lead" data-en="From work and family visas to humanitarian relief, we centralize every step of your immigration journey — combining legal expertise with technology to make the process clear and hassle-free." data-es="Desde visas de trabajo y familiares hasta alivio humanitario, centralizamos cada paso de su proceso migratorio.">
                From work and family visas to humanitarian relief, we centralize every step of your immigration journey — combining legal expertise with technology to make the process clear and hassle-free.
              </p>
              <div className="hero-cta hero-cta--single">
                <Link href="/contact" className="btn btn--gold" data-en="Book a Free Consultation" data-es="Reserve una Consulta Gratis">
                  Book a Free Consultation
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <a href="#services" className="hero-textlink" data-en="or explore our services" data-es="o explore nuestros servicios">
                  or explore our services
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
              <div className="hero-assurance">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span data-en="No-obligation" data-es="Sin compromiso">No-obligation</span></span>
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span data-en="Bilingual — EN / ES" data-es="Bilingüe — EN / ES">Bilingual — EN / ES</span></span>
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span data-en="Reply within 24 hours" data-es="Respuesta en 24 horas">Reply within 24 hours</span></span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="sit-card">
                <h3 data-en="Find your path" data-es="Encuentre su camino">Find your path</h3>
                <p className="sit-lead" data-en="Tell us your situation and we'll point you to the right starting line." data-es="Cuéntenos su situación y le indicaremos el punto de partida correcto.">Tell us your situation and we&apos;ll point you to the right starting line.</p>
                <div className="sit-grid" id="sitGrid">
                  <button className="sit-chip" type="button" data-key="work" data-en-msg="Work visas (H-1B, L-1, O-1, TN, E-2) — let's match your role." data-es-msg="Visas de trabajo (H-1B, L-1, O-1, TN, E-2) — encontremos la suya.">
                    <span className="sit-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></span>
                    <span className="sit-name" data-en="Work & Talent" data-es="Trabajo y Talento">Work &amp; Talent</span>
                  </button>
                  <button className="sit-chip" type="button" data-key="family" data-en-msg="Family & fiancé visas (K-1, K-3, F2–F4) — reunite with loved ones." data-es-msg="Visas familiares y de prometido(a) (K-1, K-3, F2–F4) — reúnase con los suyos.">
                    <span className="sit-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
                    <span className="sit-name" data-en="Family & Fiancé" data-es="Familia y Prometido(a)">Family &amp; Fiancé</span>
                  </button>
                  <button className="sit-chip" type="button" data-key="humanitarian" data-en-msg="Humanitarian relief (U, SIJ, DACA, Asylum) — we'll handle it with care." data-es-msg="Alivio humanitario (U, SIJ, DACA, Asilo) — lo manejamos con cuidado.">
                    <span className="sit-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg></span>
                    <span className="sit-name" data-en="Humanitarian" data-es="Humanitaria">Humanitarian</span>
                  </button>
                  <button className="sit-chip" type="button" data-key="business" data-en-msg="Employer sponsorship & I-9 compliance — let's protect your business." data-es-msg="Patrocinio de empleador y cumplimiento I-9 — protejamos su empresa.">
                    <span className="sit-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg></span>
                    <span className="sit-name" data-en="Employer / Business" data-es="Empleador / Empresa">Employer / Business</span>
                  </button>
                </div>
                <div className="sit-result" id="sitResult"></div>
                <Link href="/contact" className="btn btn--gold" id="sitCta" data-en="Get my free consultation" data-es="Obtener mi consulta gratis">Get my free consultation</Link>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="trust-strip" aria-label="Credentials">
          <div className="container">
            <div className="trust-item">
              <span className="t-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.3 8 10 4.6-1.7 8-5 8-10V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg></span>
              <span><span className="t-name">AILA</span><span className="t-sub" data-en="Member association" data-es="Asociación miembro">Member association</span></span>
            </div>
            <div className="trust-item">
              <span className="t-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></span>
              <span><span className="t-name">15+ <span data-en="Years" data-es="Años">Years</span></span><span className="t-sub" data-en="Of practice" data-es="De práctica">Of practice</span></span>
            </div>
            <div className="trust-item">
              <span className="t-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></span>
              <span><span className="t-name" data-en="Bar Admitted" data-es="Colegiado">Bar Admitted</span><span className="t-sub" data-en="Licensed representation" data-es="Representación con licencia">Licensed representation</span></span>
            </div>
            <div className="trust-item">
              <span className="t-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11.5 2 14 8l6 .5-4.6 4 1.5 6L11.5 15 6 18.5l1.5-6L3 8.5 9 8 11.5 2Z"/></svg></span>
              <span><span className="t-name">BBB A+</span><span className="t-sub" data-en="Accredited & rated" data-es="Acreditado y calificado">Accredited &amp; rated</span></span>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="section" id="about">
          <div className="container about-grid">
            <div className="about-media reveal">
              <div className="about-img ph has-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="ph-img" src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=720&h=792&q=80" alt="Immigration consultation" loading="lazy" referrerPolicy="no-referrer" />
              </div>
              <div className="about-img-2 ph has-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="ph-img" src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&h=600&q=80" alt="Handshake" loading="lazy" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="about-body reveal">
              <span className="eyebrow" data-en="Know About Us" data-es="Conózcanos">Know About Us</span>
              <h2 className="section-title" data-en="Your single destination for U.S. immigration" data-es="Su único destino para la inmigración a EE.UU.">Your single destination for U.S. immigration</h2>
              <p data-en="One Stop Immigration Station centralizes your U.S. immigration services." data-es="One Stop Immigration Station centraliza sus servicios de inmigración a EE.UU.">
                One Stop Immigration Station centralizes your U.S. immigration services. We represent businesses, as well as individuals and families, undergoing the U.S. immigration process — and we are committed to helping you with all your immigration needs.
              </p>
              <p>We strive to make this process hassle-free by understanding your needs, paying attention to detail, applying our legal expertise, and leveraging technology to the fullest extent possible.</p>
              <a href="#services" className="btn btn--outline-navy" data-en="Know More" data-es="Saber Más">Know More</a>
              <div className="stats">
                <div className="stat"><div className="num" data-count="500" data-suffix="+">0<span className="plus"></span></div><div className="lbl" data-en="Cases Handled" data-es="Casos Gestionados">Cases Handled</div></div>
                <div className="stat"><div className="num" data-count="15" data-suffix="+">0<span className="plus"></span></div><div className="lbl" data-en="Years of Experience" data-es="Años de Experiencia">Years of Experience</div></div>
                <div className="stat"><div className="num" data-count="30" data-suffix="+">0<span className="plus"></span></div><div className="lbl" data-en="Visa Types" data-es="Tipos de Visa">Visa Types</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="section services" id="services">
          <div className="container">
            <div className="section-head section-head--center reveal">
              <span className="eyebrow eyebrow--center" data-en="Our Services" data-es="Nuestros Servicios">Our Services</span>
              <h2 className="section-title" data-en="How we represent you" data-es="Cómo le representamos">How we represent you</h2>
              <p className="section-sub" data-en="Whether you are sponsoring talent, reuniting your family, or ensuring compliance, we guide each path from start to approval." data-es="Ya sea que patrocine talento, reúna a su familia o necesite cumplimiento, guiamos cada camino.">Whether you are sponsoring talent, reuniting your family, or ensuring compliance, we guide each path from start to approval.</p>
            </div>
            <div className="svc-grid">
              <article className="svc-card reveal">
                <span className="svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg></span>
                <h3 data-en="Employers & Businesses" data-es="Empleadores y Empresas">Employers &amp; Businesses</h3>
                <p>Discussing immigration for your business or employees? Register as a sponsor. We work cost-effectively through the needs of your company, employees, and the families who are beneficiaries of your sponsorship.</p>
                <a href="#" className="link-arrow" data-en="Register as sponsor" data-es="Registrarse como patrocinador">Register as sponsor <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
              </article>
              <article className="svc-card reveal">
                <span className="svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
                <h3 data-en="Families & Individuals" data-es="Familias e Individuos">Families &amp; Individuals</h3>
                <p>Individuals and families applying through company sponsorship or on their own should register as a beneficiary and continue through the guided application process with our support at every step.</p>
                <a href="#" className="link-arrow" data-en="Register as beneficiary" data-es="Registrarse como beneficiario">Register as beneficiary <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
              </article>
              <article className="svc-card reveal">
                <span className="svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg></span>
                <h3 data-en="I-9 Audits & Investigations" data-es="Auditorías e Investigaciones I-9">I-9 Audits &amp; Investigations</h3>
                <p>If you are a company that needs assistance with I-9 audits and compliance, we are here to help. We prepare your documentation, identify risks, and keep your workforce records audit-ready.</p>
                <a href="#" className="link-arrow" data-en="Get compliance help" data-es="Obtener ayuda de cumplimiento">Get compliance help <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
              </article>
            </div>
          </div>
        </section>

        {/* VISA CATEGORIES */}
        <section className="section" id="visas">
          <div className="container">
            <div className="section-head section-head--center reveal">
              <span className="eyebrow eyebrow--center" data-en="Visa Categories" data-es="Categorías de Visa">Visa Categories</span>
              <h2 className="section-title" data-en="Visas we process" data-es="Visas que procesamos">Visas we process</h2>
              <p className="section-sub">Work, study, family, and humanitarian — explore the most common categories or ask us about yours.</p>
              <div className="vfilters" id="vfilters" role="tablist" aria-label="Filter visa categories">
                <button className="vfilter active" data-filter="all" data-en="All" data-es="Todas">All<span className="vcount">12</span></button>
                <button className="vfilter" data-filter="Work" data-en="Work" data-es="Trabajo">Work<span className="vcount">5</span></button>
                <button className="vfilter" data-filter="Study" data-en="Study" data-es="Estudio">Study<span className="vcount">2</span></button>
                <button className="vfilter" data-filter="Family" data-en="Family" data-es="Familia">Family<span className="vcount">2</span></button>
                <button className="vfilter" data-filter="Humanitarian" data-en="Humanitarian" data-es="Humanitaria">Humanitarian<span className="vcount">3</span></button>
              </div>
            </div>
            <div className="visa-grid" id="visaGrid"></div>
            <div className="visa-foot reveal">
              <a href="#" className="btn btn--outline-navy" data-en="View All Visa Types" data-es="Ver Todos los Tipos de Visa">View All Visa Types</a>
            </div>
          </div>
        </section>

        {/* BLOG */}
        <section className="section blog" id="blog">
          <div className="container">
            <div className="blog-head reveal">
              <div className="section-head">
                <span className="eyebrow" data-en="From the Blog" data-es="Desde el Blog">From the Blog</span>
                <h2 className="section-title" data-en="Immigration news & insights" data-es="Noticias y perspectivas de inmigración">Immigration news &amp; insights</h2>
              </div>
              <Link href="/blog" className="link-arrow" data-en="View all articles" data-es="Ver todos los artículos">View all articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></Link>
            </div>
            <div className="blog-grid">
              <article className="blog-card reveal">
                <div className="blog-media ph has-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ph-img" src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&h=500&q=80" alt="" loading="lazy" referrerPolicy="no-referrer" />
                  <div className="blog-date"><div className="d">25</div><div className="m">Feb</div></div>
                </div>
                <div className="blog-body">
                  <div className="blog-cat">Workplace</div>
                  <h3><a href="#">Maintaining Employee Well-Being During Times of Uncertainty</a></h3>
                  <p>A mindful approach can help organizations maintain a positive employee experience in uncertain business conditions as economic conditions continue to shift.</p>
                  <a href="#" className="link-arrow">Read More <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
                </div>
              </article>
              <article className="blog-card reveal">
                <div className="blog-media ph has-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ph-img" src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&h=500&q=80" alt="" loading="lazy" referrerPolicy="no-referrer" />
                  <div className="blog-date"><div className="d">02</div><div className="m">Jun</div></div>
                </div>
                <div className="blog-body">
                  <div className="blog-cat">USCIS Updates</div>
                  <h3><a href="#">USCIS Releases Timetable to Resume Premium Processing for I-129 &amp; I-140</a></h3>
                  <p>USCIS announced that premium processing will resume for all I-129 and I-140 petitions in phases throughout the month.</p>
                  <a href="#" className="link-arrow">Read More <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
                </div>
              </article>
              <article className="blog-card reveal">
                <div className="blog-media ph has-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ph-img" src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&h=500&q=80" alt="" loading="lazy" referrerPolicy="no-referrer" />
                  <div className="blog-date"><div className="d">02</div><div className="m">Jun</div></div>
                </div>
                <div className="blog-body">
                  <div className="blog-cat">Court Decisions</div>
                  <h3><a href="#">Recent Court Decision Overturns Employer-Employee Relationship Scrutiny</a></h3>
                  <p>USCIS settled a lawsuit to overturn H-1B policies, following a District Court opinion ruling that key USCIS practices were unlawful.</p>
                  <a href="#" className="link-arrow">Read More <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="section testi" id="testimonials">
          <div className="container">
            <div className="section-head section-head--center reveal">
              <span className="eyebrow eyebrow--center">Client Stories</span>
              <h2 className="section-title">Trusted by families and employers alike</h2>
            </div>
            <div className="testi-grid">
              <article className="testi-card reveal">
                <div className="testi-stars" aria-label="5 out of 5"><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg></div>
                <p className="testi-quote">&ldquo;They turned our H-1B denial into an approval. Clear updates the whole way through.&rdquo;</p>
                <div className="testi-person"><span className="testi-avatar">P</span><span><span className="name">Priya R.</span><span className="role">Software Engineer</span></span></div>
              </article>
              <article className="testi-card reveal">
                <div className="testi-stars" aria-label="5 out of 5"><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg></div>
                <p className="testi-quote">&ldquo;My fiancé visa felt impossible. They made every form and interview simple and stress-free.&rdquo;</p>
                <div className="testi-person"><span className="testi-avatar">M</span><span><span className="name">Miguel A.</span><span className="role">Reunited with family</span></span></div>
              </article>
              <article className="testi-card reveal">
                <div className="testi-stars" aria-label="5 out of 5"><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8L12 2Z"/></svg></div>
                <p className="testi-quote">&ldquo;Our I-9 audit was handled flawlessly. We finally feel compliant and protected.&rdquo;</p>
                <div className="testi-person"><span className="testi-avatar">D</span><span><span className="name">Dana W.</span><span className="role">HR Director</span></span></div>
              </article>
            </div>
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="cta-strip" id="contact">
          <div className="container cta-inner">
            <div className="reveal">
              <h2>Ready to Start Your Immigration Journey?</h2>
              <p>Book a free, no-obligation consultation. We&apos;ll review your situation, explain your options in plain language, and map out the next steps — in English or Español.</p>
            </div>
            <div className="cta-actions reveal">
              <a href="tel:18007824769" className="btn btn--gold">Call (800) SUB-HROY</a>
              <a href="mailto:admin@mylegalimigrationservices.com" className="btn btn--outline-light">Email Us</a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
