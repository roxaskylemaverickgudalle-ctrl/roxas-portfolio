import { useEffect, useRef, useState } from "react";
import NeuralBackground from "./NeuralBackground";
import {
  profile,
  heroChart,
  skills,
  toolbelt,
  experience,
  certificates,
  contact,
} from "../data/portfolioData";
import "./Portfolio.css";

export default function Portfolio() {
  const [typedName, setTypedName] = useState("");
  const [certificateField, setCertificateField] = useState("All");
  const [isCertificatePaused, setIsCertificatePaused] = useState(false);
  const [canScrollCertificates, setCanScrollCertificates] = useState({ left: false, right: true });
  const certificatesScroller = useRef(null);
  const resumeAutoScrollTimer = useRef(null);

  const certificateFields = ["All", ...new Set(certificates.map((certificate) => certificate.field))];
  const visibleCertificates = certificateField === "All"
    ? certificates
    : certificates.filter((certificate) => certificate.field === certificateField);

  const updateCertificateScrollState = () => {
    const scroller = certificatesScroller.current;
    if (!scroller) return;

    setCanScrollCertificates({
      left: scroller.scrollLeft > 4,
      right: scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 4,
    });
  };

  const scrollCertificates = (direction) => {
    const scroller = certificatesScroller.current;
    if (!scroller) return;

    pauseAutoScrollTemporarily();
    scroller.scrollBy({
      left: direction * (scroller.clientWidth + 28) / 2,
      behavior: "smooth",
    });
    window.setTimeout(updateCertificateScrollState, 350);
  };

  const pauseAutoScrollTemporarily = () => {
    setIsCertificatePaused(true);
    window.clearTimeout(resumeAutoScrollTimer.current);
    resumeAutoScrollTimer.current = window.setTimeout(() => {
      setIsCertificatePaused(false);
    }, 3000);
  };

  useEffect(() => {
    const scroller = certificatesScroller.current;
    if (!scroller) return;

    scroller.scrollTo({ left: 0, behavior: "smooth" });
    window.requestAnimationFrame(updateCertificateScrollState);
  }, [certificateField]);

  useEffect(() => {
    const scroller = certificatesScroller.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!scroller || certificateField !== "All" || isCertificatePaused || prefersReducedMotion) return undefined;

    const autoScroll = () => {
      const reachedEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2;
      if (reachedEnd) {
        scroller.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroller.scrollBy({
          left: (scroller.clientWidth + 28) / 2,
          behavior: "smooth",
        });
      }
      window.setTimeout(updateCertificateScrollState, 700);
    };

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
            <li><a href="#skills">Skills</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#certificates">Certificates</a></li>
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

        {/* ---------- SKILLS ---------- */}
        <section id="skills">
          <div className="section-head">
            <h2>Skills</h2>
            <span className="count">{String(skills.length).padStart(2, "0")} core areas</span>
          </div>
          <div className="skills-grid">
            {skills.map((s) => (
              <div className="skill-row" key={s.name}>
                <span className="name">{s.name}</span>
                <span className="bar"><span style={{ width: `${s.pct}%` }} /></span>
                <span className="pct">{s.pct}%</span>
              </div>
            ))}
          </div>
          <div className="toolbelt">
            {toolbelt.map((tool) => <span key={tool}>{tool}</span>)}
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
            className="certificate-carousel"
            onPointerDown={pauseAutoScrollTemporarily}
            onTouchStart={pauseAutoScrollTemporarily}
            onFocus={pauseAutoScrollTemporarily}
          >
            <button
              className="certificate-arrow certificate-arrow-left"
              type="button"
              onClick={() => scrollCertificates(-1)}
              disabled={!canScrollCertificates.left}
              aria-label="Show previous certificates"
            >
              <span aria-hidden="true">←</span>
            </button>
            <div className="cert-grid" ref={certificatesScroller} onScroll={updateCertificateScrollState}>
            {visibleCertificates.map((c) => (
              <article className="certificate-document" key={c.id}>
                {c.asset ? (
                  c.assetType === "image" ? (
                    <img className="certificate-preview" src={c.asset} alt={`${c.title} certificate`} />
                  ) : (
                    <iframe
                      className="certificate-preview"
                      src={`${c.asset}#toolbar=0&navpanes=0`}
                      title={`${c.title} certificate`}
                    />
                  )
                ) : (
                  <div className="certificate-preview certificate-placeholder">
                    <strong>Add certificate {c.assetType.toUpperCase()}</strong>
                    <span>Set the asset path in portfolioData.js</span>
                  </div>
                )}
                <div className="certificate-caption">
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.issuer} · {c.year}</p>
                  </div>
                  {c.asset && (
                    <a href={c.asset} target="_blank" rel="noreferrer" aria-label={`Open ${c.title} full certificate`}>
                      ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
            </div>
            <button
              className="certificate-arrow certificate-arrow-right"
              type="button"
              onClick={() => scrollCertificates(1)}
              disabled={!canScrollCertificates.right}
              aria-label="Show next certificates"
            >
              <span aria-hidden="true">→</span>
            </button>
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
