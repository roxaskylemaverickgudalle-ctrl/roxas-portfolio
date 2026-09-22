import { useEffect, useRef, useState } from "react";
import NeuralBackground from "./NeuralBackground";
import {
  profile,
  heroChart,
  toolbelt,
  experience,
  certificates,
  coreTechGroups,
  projects,
  projectScreenshots,
  contact,
} from "../data/portfolioData";
import "./Portfolio.css";

export default function Portfolio() {
  const [typedName, setTypedName] = useState("");
  const [certificateField, setCertificateField] = useState("All");
  const [isCertificatePaused, setIsCertificatePaused] = useState(false);
  const certificatesScroller = useRef(null);
  const resumeAutoScrollTimer = useRef(null);

  const certificateFields = ["All", ...new Set(certificates.map((certificate) => certificate.field))];
  const visibleCertificates = certificateField === "All"
    ? certificates
    : certificates.filter((certificate) => certificate.field === certificateField);
  const hasCarousel = visibleCertificates.length > 2;
  const carouselCertificates = hasCarousel
    ? [0, 1, 2, 3, 4].flatMap((copy) => visibleCertificates.map((certificate) => ({
      ...certificate,
      id: `${certificate.id}-${copy}`,
    })))
    : visibleCertificates;

  const pauseAutoScrollTemporarily = () => {
    setIsCertificatePaused(true);
    window.clearTimeout(resumeAutoScrollTimer.current);
    resumeAutoScrollTimer.current = window.setTimeout(() => {
      setIsCertificatePaused(false);
    }, 3000);
  };

  const scrollCertificates = (direction, pause = true) => {
    const scroller = certificatesScroller.current;
    const firstCard = scroller?.firstElementChild;
    if (!scroller || !firstCard || !hasCarousel) return;

    if (pause) pauseAutoScrollTemporarily();

    const cardStep = firstCard.getBoundingClientRect().width + 28;
    scroller.scrollBy({ left: direction * cardStep, behavior: "smooth" });
  };

  const normalizeCertificateScroll = () => {
    const scroller = certificatesScroller.current;
    const firstCard = scroller?.firstElementChild;
    if (!scroller || !firstCard || visibleCertificates.length < 2) return;

    const cycleWidth = (firstCard.getBoundingClientRect().width + 28) * visibleCertificates.length;
    if (scroller.scrollLeft < cycleWidth) {
      scroller.scrollLeft += cycleWidth;
    } else if (scroller.scrollLeft > cycleWidth * 3) {
      scroller.scrollLeft -= cycleWidth;
    }
  };

  const scrollCertificatesWithWheel = (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    pauseAutoScrollTemporarily();
    certificatesScroller.current?.scrollBy({ left: event.deltaY, behavior: "auto" });
  };

  useEffect(() => {
    const scroller = certificatesScroller.current;
    if (!scroller) return;

    const firstCard = scroller.firstElementChild;
    const cardStep = firstCard ? firstCard.getBoundingClientRect().width + 28 : 0;
    const cycleWidth = cardStep * visibleCertificates.length;
    scroller.scrollTo({ left: hasCarousel ? cycleWidth * 2 : 0, behavior: "auto" });
  }, [certificateField, visibleCertificates.length, hasCarousel]);

  useEffect(() => {
    const scroller = certificatesScroller.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!scroller || certificateField !== "All" || isCertificatePaused || prefersReducedMotion) return undefined;

    const autoScroll = () => scrollCertificates(1, false);

    const autoScrollTimer = window.setInterval(autoScroll, 6500);
    return () => window.clearInterval(autoScrollTimer);
  }, [certificateField, isCertificatePaused]);

  useEffect(() => () => window.clearTimeout(resumeAutoScrollTimer.current), []);

  useEffect(() => {
    let characterIndex = 0;
    const typingTimer = window.setInterval(() => {
      characterIndex += 1;
      setTypedName(profile.name.slice(0, characterIndex));

      if (characterIndex === profile.name.length) {
        window.clearInterval(typingTimer);
      }
    }, 110);

    return () => window.clearInterval(typingTimer);
  }, []);

  return (
    <>
      <NeuralBackground />

      <header className="nav">
        <div className="nav-inner">
          <div className="nav-mark" aria-label={profile.name}>
            <span aria-hidden="true">{typedName}</span>
            <span className="typing-caret" aria-hidden="true" />
          </div>
          <ul className="nav-links">
            <li><a href="#projects">Projects</a></li>
            
            <li><a href="#experience">Experience</a></li>
            <li><a href="#certificates">Certificates</a></li>
            <li><a href="#project-gallery">Project Gallery</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </header>

      <main className="wrap">
        {/* ---------- HERO ---------- */}
        <section className="hero" style={{ borderTop: "none" }}>
          <div>
            <span className="role">{profile.role}</span>
            <h1>{profile.headline}</h1>
            <p className="lede">{profile.lede}</p>
            <div className="hero-actions">
              <a href="#certificates" className="btn btn-primary">View certificates</a>
              <a href="#contact" className="btn btn-secondary">Get in touch</a>
            </div>
          </div>
          <div className="hero-chart">
            <div className="chart-label"><span>{heroChart.label}</span><span>{heroChart.meta}</span></div>
            <svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="20" x2="320" y2="20" stroke="#D5DBE4" strokeWidth="1" />
              <line x1="0" y1="60" x2="320" y2="60" stroke="#D5DBE4" strokeWidth="1" />
              <line x1="0" y1="100" x2="320" y2="100" stroke="#D5DBE4" strokeWidth="1" />
              <path d="M0,14 C 20,20 35,55 55,68 C 80,84 100,90 130,98 C 160,104 190,108 220,112 C 250,115 280,117 320,119"
                fill="none" stroke="#2F5FF6" strokeWidth="2.2" />
              <path d="M0,30 C 25,45 45,70 70,85 C 100,100 140,108 180,115 C 220,120 270,124 320,126"
                fill="none" stroke="#E88B1B" strokeWidth="1.6" strokeDasharray="3 4" opacity="0.75" />
            </svg>
          </div>
        </section>

        {/* ---------- CORE TECH ---------- */}
        <section id="core-tech">
          <div className="section-head core-tech-head">
            <div>
              <span className="eyebrow">The engine room</span>
              <h2>Core Tech</h2>
              <p className="core-tech-lede">The frameworks, libraries, and platforms I build real things with.</p>
            </div>
            <span className="count">{String(coreTechGroups.length).padStart(2, "0")} stacks</span>
          </div>
          <div className="tech-stack-marquee" aria-label="Core technology stacks">
            <div className="tech-stack-track">
              {[0, 1].map((copy) => (
                <div className="tech-stack-set" aria-hidden={copy === 1} key={copy}>
                  {coreTechGroups.map((group) => (
                    <article
                      className={group.background ? "tech-stack-card has-background" : "tech-stack-card"}
                      key={`${copy}-${group.title}`}
                      style={group.background ? { backgroundImage: `linear-gradient(rgba(5, 18, 35, 0.42), rgba(5, 18, 35, 0.58)), url("${group.background}")` } : undefined}
                    >
                      <h3>{group.title}</h3>
                      <p>{group.description}</p>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="tech-marquee" aria-label="Core technology and software tools">
            <div className="tech-marquee-track">
              {[0, 1].map((copy) => (
                <div className="tech-marquee-set" aria-hidden={copy === 1} key={copy}>
                  {toolbelt.map((tool) => (
                    <span className="tech-item" key={`${copy}-${tool}`}>
                      <span className="tech-item-mark" aria-hidden="true">{tool.slice(0, 2).toUpperCase()}</span>
                      {tool}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- PROJECTS ---------- */}
        <section id="projects">
          <div className="section-head">
            <h2>Projects</h2>
            <span className="count">{String(projects.length).padStart(2, "0")} studies</span>
          </div>
          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.number}>
                <div className={`project-visual project-visual-${project.visual}`}>
                  <span className="project-index">{project.number}</span>
                  <span className="project-orbit project-orbit-one" />
                  <span className="project-orbit project-orbit-two" />
                  <span className="project-visual-mark">ML</span>
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="project-notes">
                    <p><strong>Problem:</strong> {project.problem}</p>
                    <p><strong>Stack:</strong> {project.stack}</p>
                    <p><strong>Use case:</strong> {project.useCase}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- EXPERIENCE ---------- */}
        <section id="experience">
          <div className="section-head">
            <h2>Experience</h2>
            <span className="count">{String(experience.length).padStart(2, "0")} roles</span>
          </div>
          <div className="timeline">
            {experience.map((role) => (
              <div className="tl-item" key={role.title + role.period}>
                <div className="meta">{role.period}</div>
                <h3>{role.title}</h3>
                <div className="org">{role.org}</div>
                <ul>
                  {role.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- CERTIFICATES ---------- */}
        <section id="certificates">
          <div className="section-head">
            <h2>Certificates</h2>
            <span className="count">{String(certificates.length).padStart(2, "0")} credentials</span>
          </div>
          <div className="certificate-filters" role="group" aria-label="Filter certificates by field">
            {certificateFields.map((field) => (
              <button
                className={certificateField === field ? "filter-button is-active" : "filter-button"}
                type="button"
                key={field}
                onClick={() => setCertificateField(field)}
              >
                {field}
              </button>
            ))}
          </div>
          <div
            className={hasCarousel ? "certificate-carousel" : "certificate-carousel is-static"}
            onPointerDown={pauseAutoScrollTemporarily}
            onTouchStart={pauseAutoScrollTemporarily}
            onFocus={pauseAutoScrollTemporarily}
          >
            {hasCarousel && <button
              className="certificate-arrow certificate-arrow-left"
              type="button"
              onClick={() => scrollCertificates(-1)}
              aria-label="Show previous certificates"
            >
              <span aria-hidden="true">←</span>
            </button>}
            <div
              className="cert-grid"
              ref={certificatesScroller}
              onScroll={normalizeCertificateScroll}
              onWheel={scrollCertificatesWithWheel}
            >
            {carouselCertificates.map((c) => (
              <article className="certificate-document" key={c.id}>
                {c.asset ? (
                  <img className="certificate-preview" src={c.asset} alt={`${c.title} certificate`} />
                ) : (
                  <div className="certificate-preview certificate-placeholder">
                    <strong>Add certificate image</strong>
                    <span>Set the asset path in portfolioData.js</span>
                  </div>
                )}
                <div className="certificate-caption">
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.issuer} · {c.year}</p>
                  </div>
                </div>
                {c.asset && (
                  <a className="certificate-open" href={c.asset} target="_blank" rel="noreferrer" aria-label={`Open ${c.title} full certificate`}>
                    <span>Open full certificate</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </article>
            ))}
            </div>
            {hasCarousel && <button
              className="certificate-arrow certificate-arrow-right"
              type="button"
              onClick={() => scrollCertificates(1)}
              aria-label="Show next certificates"
            >
              <span aria-hidden="true">→</span>
            </button>}
          </div>
        </section>

        {/* ---------- PROJECT SCREENSHOTS ---------- */}
        <section id="project-gallery">
          <div className="project-gallery-heading">
            <span className="eyebrow">Visual archive</span>
            <h2>Project Gallery</h2>
            <p>Screenshot previews from projects, interfaces, and experiments.</p>
          </div>
          <div className="project-screenshot-grid">
            {projectScreenshots.map((screenshot) => (
              <figure className={`project-screenshot project-visual-${screenshot.visual}`} key={screenshot.number}>
                <span className="project-index">{screenshot.number}</span>
                <span className="project-screenshot-placeholder">Add screenshot here</span>
                <figcaption>{screenshot.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ---------- CONTACT ---------- */}
        <section id="contact">
          <div className="contact">
            <div>
              <h2>{contact.heading}</h2>
              <p>{contact.blurb}</p>
            </div>
            <div className="contact-links">
              {contact.links.map((l) => (
                <a href={l.href} key={l.label}>{l.label} <span>{l.value}</span></a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer>built with React — edit src/data/portfolioData.js to make it yours</footer>
    </>
  );
}
