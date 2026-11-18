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
  projectGallery,
  contact,
} from "../data/portfolioData";
import "./Portfolio.css";

export default function Portfolio() {
  const [certificateField, setCertificateField] = useState("All");
  const [isCertificateAutoScrollActive, setIsCertificateAutoScrollActive] = useState(true);
  const [isCertificateVisible, setIsCertificateVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatDraft, setChatDraft] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const chatApiUrl = import.meta.env.VITE_CHAT_API_URL?.trim();
  const certificatesSection = useRef(null);
  const navRef = useRef(null);
  const navInnerRef = useRef(null);
  const navMarkRef = useRef(null);
  const navNameRef = useRef(null);
  const navMonogramRef = useRef(null);
  const certificatesScroller = useRef(null);
  const certificateDrag = useRef(null);

  const sendChatMessage = async (event) => {
    event.preventDefault();
    const message = chatDraft.trim();
    if (!message || isChatLoading) return;

    const conversation = [...chatMessages, { role: "user", text: message }].slice(-12);
    setChatMessages(conversation);
    setChatError("");
    setIsChatLoading(true);

    try {
      if (!chatApiUrl) {
        throw new Error("Chat isn't configured yet. Add VITE_CHAT_API_URL to the portfolio environment.");
      }

      const response = await fetch(chatApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation.map(({ role, text }) => ({ role, content: text })),
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || "The chat service couldn't complete that request.");
      }
      if (typeof payload?.reply !== "string" || !payload.reply.trim()) {
        throw new Error("The chat service returned an empty response. Please try again.");
      }

      setChatMessages((messages) => [...messages, { role: "assistant", text: payload.reply }]);
      setChatDraft("");
    } catch (error) {
      setChatMessages((messages) => messages.slice(0, -1));
      setChatError(error instanceof Error ? error.message : "The chat request failed. Please try again.");
    } finally {
      setIsChatLoading(false);
    }
  };

  const certificateFields = ["All", ...new Set(certificates.map((certificate) => certificate.field))];
  const visibleCertificates = certificateField === "All"
    ? certificates
    : certificates.filter((certificate) => certificate.field === certificateField);
  const hasCarousel = visibleCertificates.length > 1;
  const carouselCertificates = hasCarousel
    ? [0, 1, 2, 3, 4].flatMap((copy) => visibleCertificates.map((certificate) => ({
      ...certificate,
      id: `${certificate.id}-${copy}`,
    })))
    : visibleCertificates;

  const scrollCertificates = (direction) => {
    const scroller = certificatesScroller.current;
    const firstCard = scroller?.firstElementChild;
    if (!scroller || !firstCard || !hasCarousel) return;

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

  const startCertificateDrag = (event) => {
    if (event.button !== 0) return;
    certificateDrag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
      didDrag: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveCertificateDrag = (event) => {
    const drag = certificateDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 5) drag.didDrag = true;
    if (drag.didDrag) event.currentTarget.scrollLeft = drag.startScrollLeft - distance;
  };

  const finishCertificateDrag = (event) => {
    const drag = certificateDrag.current;
    if (drag?.pointerId === event.pointerId) {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      certificateDrag.current = { ...drag, pointerId: null };
    }
  };

  const preventClickAfterCertificateDrag = (event) => {
    if (!certificateDrag.current?.didDrag) return;
    event.preventDefault();
    event.stopPropagation();
    certificateDrag.current = null;
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
    const carousel = certificatesSection.current;
    if (!carousel || !hasCarousel) {
      setIsCertificateVisible(false);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsCertificateVisible(entry.isIntersecting);
    }, { threshold: 0.1 });
    observer.observe(carousel);
    return () => observer.disconnect();
  }, [certificateField, hasCarousel]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isCertificateVisible || !isCertificateAutoScrollActive || prefersReducedMotion || !hasCarousel) return undefined;

    const autoScrollTimer = window.setInterval(() => {
      const scroller = certificatesScroller.current;
      const firstCard = scroller?.firstElementChild;
      if (!scroller || !firstCard || !hasCarousel) return;
      const cardStep = firstCard.getBoundingClientRect().width + 28;
      scroller.scrollBy({ left: cardStep, behavior: "smooth" });
    }, 3000);

    return () => window.clearInterval(autoScrollTimer);
  }, [hasCarousel, isCertificateAutoScrollActive, isCertificateVisible]);

  useEffect(() => {
    const stopWhenClickingOutside = (event) => {
      if (!certificatesSection.current?.contains(event.target)) {
        setIsCertificateAutoScrollActive(false);
      }
    };
    document.addEventListener("pointerdown", stopWhenClickingOutside);

    return () => {
      document.removeEventListener("pointerdown", stopWhenClickingOutside);
    };
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    const navInner = navInnerRef.current;
    if (!nav || !navInner) return undefined;

    let animationFrame = 0;
    const updateNav = () => {
      animationFrame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / 240));
      const isMobile = window.innerWidth <= 720;
      const compactMarkSize = isMobile ? 34 : 38;
      const fullNameWidth = navNameRef.current
        ? navNameRef.current.scrollWidth + (isMobile ? 12 : 16)
        : compactMarkSize;
      const initialWidth = isMobile ? window.innerWidth : Math.min(980, window.innerWidth);
      const compactWidth = Math.min(window.innerWidth - 32, isMobile ? 230 : 310);

      nav.style.setProperty("--nav-progress", progress.toString());
      nav.style.setProperty("--nav-header-bg", `rgba(238, 241, 245, ${0.88 * (1 - progress)})`);
      nav.style.setProperty("--nav-header-border", `rgba(213, 219, 228, ${1 - progress})`);
      nav.style.setProperty("--nav-header-blur", `${8 * (1 - progress)}px`);
      navInner.style.setProperty("--nav-width", `${initialWidth + (compactWidth - initialWidth) * progress}px`);
      navInner.style.setProperty("--nav-padding-y", `${(isMobile ? 14 : 18) + ((isMobile ? 7 : 8) - (isMobile ? 14 : 18)) * progress}px`);
      navInner.style.setProperty("--nav-padding-x", `${(isMobile ? 16 : 32) + ((isMobile ? 10 : 14) - (isMobile ? 16 : 32)) * progress}px`);
      navInner.style.setProperty("--nav-margin-y", `${14 * progress}px`);
      navInner.style.setProperty("--nav-radius", `${22 * progress}px`);
      navInner.style.setProperty("--nav-gap", `${(isMobile ? 8 : 18) * progress}px`);
      navInner.style.setProperty("--nav-background", `rgba(255, 255, 255, ${0.94 * progress})`);
      navInner.style.setProperty("--nav-border", `rgba(213, 219, 228, ${0.9 * progress})`);
      navInner.style.setProperty("--nav-shadow", `0 8px 26px rgba(23, 27, 36, ${0.12 * progress})`);
      navInner.style.setProperty("--nav-blur", `${12 * progress}px`);
      navMarkRef.current?.style.setProperty("--nav-mark-width", `${fullNameWidth + (compactMarkSize - fullNameWidth) * progress}px`);
      navMarkRef.current?.style.setProperty("--nav-mark-height", `${42 + (compactMarkSize - 42) * progress}px`);
      navMarkRef.current?.style.setProperty("--nav-mark-radius", `${12 * progress}px`);
      navMarkRef.current?.style.setProperty("--nav-mark-background", `rgba(255, 255, 255, ${0.94 * progress})`);
      navMarkRef.current?.style.setProperty("--nav-mark-border", `rgba(213, 219, 228, ${0.9 * progress})`);
      navNameRef.current?.style.setProperty("--nav-name-opacity", `${1 - progress}`);
      navMonogramRef.current?.style.setProperty("--nav-monogram-opacity", progress.toString());
      navInner.style.setProperty("--nav-link-gap", isMobile ? "4px" : `${28 + (8 - 28) * progress}px`);
      navInner.style.setProperty("--nav-label-size", isMobile ? "0" : `${1 - progress}`);
      navInner.style.setProperty("--nav-icon-size", `${(isMobile ? 16 : 17) * (isMobile ? 1 : progress)}px`);
      navInner.style.setProperty("--nav-icon-opacity", isMobile ? "1" : progress.toString());
      navInner.style.setProperty("--nav-icon-gap", `${(isMobile ? 0 : 7) * progress}px`);

      navInner.querySelectorAll(".nav-link-label").forEach((label) => {
        const linkWidth = isMobile
          ? 30
          : label.scrollWidth + (compactMarkSize - label.scrollWidth) * progress;
        label.parentElement.style.setProperty("--nav-link-width", `${linkWidth}px`);
        label.style.setProperty("--nav-label-width", `${label.scrollWidth * (isMobile ? 0 : 1 - progress)}px`);
      });
    };
    const scheduleNavUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateNav);
    };

    updateNav();
    window.addEventListener("scroll", scheduleNavUpdate, { passive: true });
    window.addEventListener("resize", scheduleNavUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleNavUpdate);
      window.removeEventListener("resize", scheduleNavUpdate);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <NeuralBackground />

      <header className="nav" ref={navRef}>
        <div className="nav-inner" ref={navInnerRef}>
          <a className="nav-mark" href="#" ref={navMarkRef} aria-label={`${profile.name} — back to top`} title="Back to top">
            <span className="nav-name" ref={navNameRef}>{profile.name}</span>
            <span className="nav-monogram" ref={navMonogramRef} aria-hidden="true">KR</span>
          </a>
          <ul className="nav-links">
            <li>
              <a href="#projects" aria-label="Projects" title="Projects">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 4V2m8 2V2M3 9h18M8 13h3m-3 4h8" /></svg>
                <span className="nav-link-label">Projects</span>
              </a>
            </li>
            <li>
              <a href="#experience" aria-label="Experience" title="Experience">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V4h8v3M3 12h18m-11 0v2h4v-2" /></svg>
                <span className="nav-link-label">Experience</span>
              </a>
            </li>
            <li>
              <a href="#certificates" aria-label="Certificates" title="Certificates">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-3-6 3z" /><path d="m9 10 2 2 4-4" /></svg>
                <span className="nav-link-label">Certificates</span>
              </a>
            </li>
            <li>
              <a href="#project-gallery" aria-label="Project Gallery" title="Project Gallery">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="5" rx="1" /><rect x="13" y="10" width="8" height="11" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /></svg>
                <span className="nav-link-label">Gallery</span>
              </a>
            </li>
            <li>
              <a href="#contact" aria-label="Contact" title="Contact">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                <span className="nav-link-label">Contact</span>
              </a>
            </li>
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
                    <span className="tech-item" key={`${copy}-${tool.name}`}>
                      <img className="tech-item-logo" src={tool.logo} alt="" aria-hidden="true" />
                      {tool.name}
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
            <span className="count">{String(projects.length).padStart(2, "0")} projects</span>
          </div>
          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.number}>
                <div className={`project-visual project-visual-${project.visual}`}>
                  <span className="project-index">{project.number}</span>
                  <span className="project-orbit project-orbit-one" />
                  <span className="project-orbit project-orbit-two" />
                  <span className="project-visual-mark">{project.mark}</span>
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
                  <a
                    className="project-repo-link"
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Explore on GitHub <span aria-hidden="true">↗</span>
                  </a>
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
        <section
          id="certificates"
          ref={certificatesSection}
          onClick={() => setIsCertificateAutoScrollActive(true)}
        >
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
          <div className={hasCarousel ? "certificate-carousel" : "certificate-carousel is-static"}>
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
              onPointerDown={startCertificateDrag}
              onPointerMove={moveCertificateDrag}
              onPointerUp={finishCertificateDrag}
              onPointerCancel={finishCertificateDrag}
              onClickCapture={preventClickAfterCertificateDrag}
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

        {/* ---------- PROJECT GALLERY ---------- */}
        <section id="project-gallery">
          <div className="project-gallery-heading">
            <span className="eyebrow">Visual archive</span>
            <h2>Project Gallery</h2>
            <p>A collection of project images and snapshots.</p>
          </div>
          <div className="project-screenshot-grid">
            {projectGallery.map((item) => (
              <figure className="project-screenshot" key={item.number}>
                {item.image ? (
                  <img className="project-gallery-image" src={item.image} alt={`${item.title} project`} />
                ) : (
                  <div className="project-gallery-placeholder">
                    <span className="project-gallery-placeholder-icon" aria-hidden="true">+</span>
                  </div>
                )}
                <figcaption className="project-screenshot-caption">{item.title}</figcaption>
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
              <a href={l.href} key={l.label}>
                <span className="contact-label">{l.label}</span>
                <span className="contact-value">{l.value}</span>
              </a>
            ))}
            </div>
          </div>
        </section>
      </main>

      <footer>built with React — edit src/data/portfolioData.js to make it yours</footer>

      <aside className="portfolio-chat" aria-label="Portfolio chat preview">
        {isChatOpen && (
          <section className="portfolio-chat-panel" aria-label="Chat with Kyle's portfolio assistant">
            <div className="portfolio-chat-header">
              <div className="portfolio-chat-avatar" aria-hidden="true">KR</div>
              <div className="portfolio-chat-heading">
                <h2>Ask about my work</h2>
                <span><i aria-hidden="true" /> {chatApiUrl ? "Llama 3.1 · Hugging Face" : "API setup required"}</span>
              </div>
              <button
                className="portfolio-chat-close"
                type="button"
                onClick={() => setIsChatOpen(false)}
                aria-label="Close chat"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </div>

            <div className="portfolio-chat-messages" aria-live="polite">
              <div className="portfolio-chat-message portfolio-chat-message-assistant">
                <span className="portfolio-chat-message-label">KR assistant</span>
                <p>Hey! I can help you explore Kyle&apos;s projects, experience, skills, and AI work.</p>
              </div>
              {chatMessages.map((message, index) => (
                <div
                  className={`portfolio-chat-message portfolio-chat-message-${message.role}`}
                  key={`${message.role}-${index}`}
                >
                  {message.role === "assistant" && (
                    <span className="portfolio-chat-message-label">KR assistant</span>
                  )}
                  <p>{message.text}</p>
                </div>
              ))}
              {isChatLoading && (
                <div className="portfolio-chat-message portfolio-chat-message-assistant portfolio-chat-typing" role="status">
                  <span className="portfolio-chat-message-label">KR assistant</span>
                  <p>Thinking<span aria-hidden="true">...</span></p>
                </div>
              )}
              {chatError && (
                <p className="portfolio-chat-error" role="alert">{chatError}</p>
              )}
              {chatMessages.length === 0 && (
                <div className="portfolio-chat-suggestions">
                  <span className="portfolio-chat-suggestions-label">Try asking</span>
                  <div className="portfolio-chat-prompts" aria-label="Suggested questions">
                    {[
                      "What projects has Kyle built?",
                      "Tell me about his AI work",
                      "What technologies does he use?",
                    ].map((prompt) => (
                      <button
                        type="button"
                        key={prompt}
                        onClick={() => setChatDraft(prompt)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="portfolio-chat-footer">
              <form className="portfolio-chat-composer" onSubmit={sendChatMessage}>
                <label className="portfolio-chat-input-label" htmlFor="portfolio-chat-input">
                  Message the portfolio assistant
                </label>
                <input
                  id="portfolio-chat-input"
                  type="text"
                  value={chatDraft}
                  onChange={(event) => setChatDraft(event.target.value)}
                  placeholder="Ask about Kyle's work..."
                  autoComplete="off"
                  maxLength={1200}
                  disabled={isChatLoading}
                />
                <button type="submit" disabled={!chatDraft.trim() || isChatLoading} aria-label="Send message">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" /></svg>
                </button>
              </form>
              <p className="portfolio-chat-note">Powered by Llama 3.1 8B Instruct</p>
            </div>
          </section>
        )}

        <button
          className={`portfolio-chat-launcher${isChatOpen ? " is-open" : ""}`}
          type="button"
          onClick={() => setIsChatOpen((open) => !open)}
          aria-expanded={isChatOpen}
          aria-label={isChatOpen ? "Close portfolio chat" : "Open portfolio chat"}
        >
          {isChatOpen ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 2 1.5-4A7.5 7.5 0 1 1 20 11.5Z" /><path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" /></svg>
          )}
        </button>
      </aside>
    </>
  );
}
