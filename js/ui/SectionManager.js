/**
 * SECTION MANAGER
 * Full production implementations of all 9 city sections with honest data,
 * interactive 3D viewports, and seamless city integration.
 */

import { SkillNetwork3D } from "../city/SkillNetwork3D.js";
import { GitHubService } from "./GitHubService.js";
import { createPVMonogramMesh } from "../city/PVLogoGeometry.js";

export class SectionManager {
  constructor(container, config, onCloseToCity, soundEngine) {
    this.container = container;
    this.config = config;
    this.onCloseToCity = onCloseToCity;
    this.sound = soundEngine;

    this.activeSectionId = null;
    this.overlayEl = null;
    this.skillNetwork = null;
    this.githubService = new GitHubService(config.personal.githubUsername);
    this.pvViewerAnim = null;

    this.init();
  }

  init() {
    this.overlayEl = document.createElement("div");
    this.overlayEl.id = "section-modal-overlay";
    this.overlayEl.className = "section-modal-overlay";
    this.overlayEl.setAttribute("role", "dialog");
    this.overlayEl.setAttribute("aria-modal", "true");

    this.overlayEl.innerHTML = `
      <div class="modal-backdrop" id="modal-backdrop"></div>
      <div class="modal-window" id="modal-window">
        <!-- Persistent Modal Header -->
        <div class="modal-header">
          <button class="btn-back-city" id="btn-back-city" data-cursor="BACK">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>BACK TO CITY [ESC]</span>
          </button>

          <div class="modal-sector-indicator" id="modal-sector-indicator">
            <span class="sector-badge">01 / ABOUT</span>
            <span class="sector-title">HOME BASE</span>
          </div>

          <button class="btn-close-modal" id="btn-close-modal" aria-label="Close" data-cursor="CLOSE">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Dynamic Content Body -->
        <div class="modal-body" id="modal-body"></div>
      </div>
    `;

    this.container.appendChild(this.overlayEl);
    this.bindGlobalEvents();
  }

  bindGlobalEvents() {
    const backBtn = this.overlayEl.querySelector("#btn-back-city");
    const closeBtn = this.overlayEl.querySelector("#btn-close-modal");
    const backdrop = this.overlayEl.querySelector("#modal-backdrop");

    const closeHandler = () => {
      this.sound?.playClick();
      this.close();
    };

    backBtn?.addEventListener("click", closeHandler);
    closeBtn?.addEventListener("click", closeHandler);
    backdrop?.addEventListener("click", closeHandler);

    window.addEventListener("keydown", (e) => {
      if (this.activeSectionId && e.key === "Escape") {
        this.close();
      }
    });
  }

  open(buildingId) {
    this.cleanupDynamicFeatures();
    this.activeSectionId = buildingId;
    const bData = this.config.buildings.find((b) => b.id === buildingId);
    if (!bData) return;

    this.sound?.playTransition();

    // Update Header Indicator
    const indicator = this.overlayEl.querySelector("#modal-sector-indicator");
    if (indicator) {
      indicator.innerHTML = `
        <span class="sector-badge">${bData.number} / ${bData.label}</span>
        <span class="sector-title">${bData.title}</span>
      `;
    }

    // Render Section Content
    const bodyEl = this.overlayEl.querySelector("#modal-body");
    bodyEl.scrollTop = 0;
    bodyEl.innerHTML = this.renderSectionContent(buildingId);

    // Show Overlay IMMEDIATELY so container has dimensions
    this.overlayEl.classList.add("active");
    document.body.classList.add("modal-open");

    // Initialize section-specific dynamic features safely
    try {
      this.postRenderSetup(buildingId);
    } catch (err) {
      console.warn("postRenderSetup handled error:", err);
    }
  }

  close() {
    if (!this.activeSectionId) return;
    this.cleanupDynamicFeatures();
    this.activeSectionId = null;

    this.overlayEl.classList.remove("active");
    document.body.classList.remove("modal-open");

    if (this.onCloseToCity) {
      this.onCloseToCity();
    }
  }

  renderSectionContent(id) {
    switch (id) {
      case "about":
        return this.renderAboutSection();
      case "education":
        return this.renderEducationSection();
      case "skills":
        return this.renderSkillsSection();
      case "projects":
        return this.renderProjectsSection();
      case "github":
        return this.renderGitHubSection();
      case "goals":
        return this.renderGoalsSection();
      case "resume":
        return this.renderResumeSection();
      case "contact":
        return this.renderContactSection();
      case "innovation":
        return this.renderInnovationSection();
      default:
        return `<p>Sector data not found.</p>`;
    }
  }

  // 01 / ABOUT — HOME BASE
  renderAboutSection() {
    const p = this.config.personal;
    return `
      <div class="section-layout about-layout">
        <div class="about-grid">
          <!-- Left: Narrative Bio -->
          <div class="about-text-column">
            <div class="section-header-tag">01 / ABOUT</div>
            <h2 class="section-main-title">${p.name}</h2>
            <div class="about-subtitle">${p.role}</div>

            <div class="narrative-paragraphs">
              ${p.longBio.map((para) => `<p>${para}</p>`).join("")}
            </div>

            <!-- Quick Specs -->
            <div class="specs-card">
              <div class="specs-header">DEVELOPER PROFILE // TELEMETRY</div>
              <div class="specs-grid">
                <div class="spec-item">
                  <span class="spec-label">INSTITUTION</span>
                  <span class="spec-val">${p.university}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">PROGRAM</span>
                  <span class="spec-val">${p.degree}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">LOCATION</span>
                  <span class="spec-val">${p.location}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">CORE TOOLS</span>
                  <span class="spec-val">C, C++, DSA, GitHub, VS Code</span>
                </div>
              </div>
            </div>

            <div class="about-actions">
              <button class="btn btn-primary" id="about-to-skills" data-cursor="INSPECT">
                <span>INSPECT SKILL NETWORK (03)</span>
              </button>
              <a href="${p.githubUrl}" target="_blank" rel="noopener" class="btn btn-secondary" data-cursor="EXTERNAL">
                <span>VISIT GITHUB REPOSITORY</span>
              </a>
            </div>
          </div>

          <!-- Right: Signature 3D PV Artifact Monolith -->
          <div class="about-artifact-column">
            <div class="artifact-card">
              <div class="artifact-meta">
                <span class="meta-tag">SIGNATURE 3D IDENTITY OBJECT</span>
                <span class="meta-code">PV_OBSIDIAN_v1.0</span>
              </div>
              <div class="artifact-canvas-wrapper" id="pv-artifact-canvas-container">
                <!-- Three.js PV artifact will be injected here -->
              </div>
              <div class="artifact-footer">
                <div class="artifact-caption">DARK OBSIDIAN • MIDNIGHT VIOLET LUMINANCE</div>
                <div class="artifact-hint">DRAG TO INSPECT GEOMETRY</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 02 / EDUCATION — JECRC UNIVERSITY
  renderEducationSection() {
    const edu = this.config.education;
    return `
      <div class="section-layout education-layout">
        <div class="section-header-tag">02 / ACADEMIC FOUNDATION</div>
        <h2 class="section-main-title">${edu.institution}</h2>
        <div class="education-snapshot-card">
          <div class="snapshot-header">
            <span class="snapshot-badge">CURRENT ENROLLMENT</span>
            <span class="snapshot-term">${edu.duration}</span>
          </div>
          <h3 class="snapshot-degree">${edu.degree}</h3>
          <div class="snapshot-branch">${edu.branch}</div>
          <p class="snapshot-overview">${edu.overview}</p>
        </div>

        <div class="timeline-container">
          <h3 class="timeline-title">COMPUTER SCIENCE ROADMAP &amp; TIMELINE</h3>
          <div class="timeline-track">
            ${edu.timeline
              .map(
                (item, idx) => `
              <div class="timeline-node">
                <div class="node-marker">
                  <span class="marker-dot"></span>
                  <span class="marker-year">${item.year}</span>
                </div>
                <div class="node-content">
                  <div class="node-top">
                    <h4 class="node-heading">${item.title}</h4>
                    <span class="node-badge">${item.badge}</span>
                  </div>
                  <div class="node-sub">${item.subtitle}</div>
                  <p class="node-desc">${item.desc}</p>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  // 03 / SKILLS — TECH TOWER
  renderSkillsSection() {
    return `
      <div class="section-layout skills-layout">
        <div class="section-header-tag">03 / ACTIVE COMPETENCIES</div>
        <h2 class="section-main-title">3D SKILL NETWORK</h2>
        <div class="skills-banner">
          <span class="banner-badge">CURRENTLY LEARNING</span>
          <p class="banner-text">Honest documentation of foundational programming languages, algorithmic problem solving, and engineering workstations. No fake percentage bars or vanity ratings.</p>
        </div>

        <div class="skills-grid-wrapper">
          <!-- 3D Interactive Skill Network Canvas -->
          <div class="skill-3d-box">
            <div class="box-header">
              <span>CONSTELLATION VIEW</span>
              <span class="box-status">INTERACTIVE 3D MESH</span>
            </div>
            <div id="skills-3d-canvas" class="skills-3d-canvas"></div>
            <div class="box-footer">CLICK A NODE OR DRAG TO ROTATE</div>
          </div>

          <!-- Real-Time Learning Status Panel -->
          <div class="skill-inspector-box" id="skill-inspector-box">
            <div class="inspector-empty" id="inspector-placeholder">
              <span class="empty-icon">⚡</span>
              <h4>SELECT A SKILL NODE</h4>
              <p>Click on any 3D node or list item to view what Pranay is currently practicing and mastering.</p>
            </div>
            <div class="inspector-content" id="inspector-content" style="display: none;">
              <!-- Populated dynamically -->
            </div>
          </div>
        </div>

        <!-- Clean Skill Cards List -->
        <div class="skills-card-list">
          ${this.config.skills
            .map(
              (s) => `
            <div class="skill-card-item" data-id="${s.id}" data-cursor="INSPECT">
              <div class="skill-card-header">
                <span class="skill-icon">${s.icon}</span>
                <span class="skill-name">${s.name}</span>
                <span class="skill-cat">${s.category}</span>
              </div>
              <p class="skill-card-summary">${s.summary}</p>
              <div class="skill-card-status">${s.status}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  // 04 / PROJECTS — PROJECT LABS
  renderProjectsSection() {
    const proj = this.config.projects;
    return `
      <div class="section-layout projects-layout">
        <div class="section-header-tag">04 / PROTOTYPING &amp; BUILDS</div>
        <h2 class="section-main-title">PROJECT LABS</h2>
        <p class="projects-intro">
          Transparent development slots. No fabricated achievements or mock client portfolios. Each build follows our structured engineering storytelling framework.
        </p>

        <!-- Storytelling Methodology Framework Banner -->
        <div class="story-framework-strip">
          <div class="framework-title">ENGINEERING STORYTELLING ARCHITECTURE:</div>
          <div class="framework-steps">
            ${proj.storytellingFramework
              .map(
                (f) => `
              <div class="framework-step">
                <span class="step-num">${f.step}</span>
                <span class="step-name">${f.name}</span>
                <span class="step-desc">${f.desc}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Project Slots Grid -->
        <div class="project-slots-grid">
          ${proj.slots
            .map(
              (slot) => `
            <div class="project-slot-card" data-slot="${slot.slotNumber}">
              <div class="slot-header">
                <span class="slot-badge">SLOT ${slot.slotNumber}</span>
                <span class="slot-status ${slot.status.toLowerCase().replace(/ /g, "-")}">${slot.status}</span>
              </div>

              <h3 class="slot-title">${slot.title}</h3>
              <div class="slot-category">${slot.category}</div>
              <p class="slot-summary">${slot.summary}</p>

              <!-- Deep Story Breakdown -->
              <div class="slot-story-breakdown">
                <div class="story-phase">
                  <span class="phase-label">PROBLEM:</span>
                  <span class="phase-text">${slot.story.problem}</span>
                </div>
                <div class="story-phase">
                  <span class="phase-label">IDEA:</span>
                  <span class="phase-text">${slot.story.idea}</span>
                </div>
                <div class="story-phase">
                  <span class="phase-label">BUILD:</span>
                  <span class="phase-text">${slot.story.build}</span>
                </div>
                <div class="story-phase">
                  <span class="phase-label">RESULT:</span>
                  <span class="phase-text">${slot.story.result}</span>
                </div>
              </div>

              <div class="slot-tech-tags">
                ${slot.techStack.map((t) => `<span class="tech-tag">${t}</span>`).join("")}
              </div>

              <div class="slot-footer">
                <span class="slot-role">ROLE: ${slot.role}</span>
                <a href="${slot.githubUrl}" target="_blank" rel="noopener" class="btn btn-outline" data-cursor="EXTERNAL">
                  <span>FOLLOW ON GITHUB</span>
                </a>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  // 05 / GITHUB — COMMAND CENTER
  renderGitHubSection() {
    const username = this.config.personal.githubUsername;
    return `
      <div class="section-layout github-layout">
        <div class="section-header-tag">05 / TELEMETRY &amp; VERSION CONTROL</div>
        <h2 class="section-main-title">GITHUB COMMAND CENTER</h2>
        
        <div class="command-center-hud">
          <div class="hud-top">
            <div class="hud-left">
              <span class="pulse-green"></span>
              <span class="hud-user">@${username}</span>
              <span class="hud-host">api.github.com</span>
            </div>
            <div class="hud-right">
              <a href="${this.config.personal.githubUrl}" target="_blank" rel="noopener" class="btn btn-primary" data-cursor="EXTERNAL">
                <span>VIEW PROFILE ON GITHUB</span>
              </a>
            </div>
          </div>

          <div class="hud-body">
            <div id="github-repos-container" class="github-repos-grid">
              <div class="repos-loading">
                <span class="loading-spinner"></span>
                <span>FETCHING REPOSITORY TELEMETRY...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 06 / GOALS — FUTURE TOWER
  renderGoalsSection() {
    const goals = this.config.goals;
    return `
      <div class="section-layout goals-layout">
        <div class="section-header-tag">06 / CAREER TRAJECTORY</div>
        <h2 class="section-main-title">FUTURE TOWER</h2>
        <p class="goals-intro">A clear roadmap bridging foundational undergraduate study to impactful software engineering.</p>

        <!-- Pipeline Progression -->
        <div class="progression-track">
          ${goals.progression
            .map(
              (p, i) => `
            <div class="progression-step">
              <div class="step-indicator">
                <span class="step-num">0${i + 1}</span>
                <span class="step-stage">${p.stage}</span>
              </div>
              <div class="step-box">
                <span class="step-phase">${p.phase}</span>
                <p class="step-desc">${p.desc}</p>
                <span class="step-status">${p.status}</span>
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Milestones Grid -->
        <h3 class="milestones-heading">ACTIVE OBJECTIVES</h3>
        <div class="milestones-grid">
          ${goals.concreteMilestones
            .map(
              (m) => `
            <div class="milestone-card">
              <div class="milestone-top">
                <span class="milestone-target">${m.target}</span>
                <span class="milestone-status">${m.status}</span>
              </div>
              <h4 class="milestone-title">${m.title}</h4>
              <p class="milestone-desc">${m.desc}</p>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  // 07 / RESUME — CAREER CENTER
  renderResumeSection() {
    const res = this.config.resume;
    return `
      <div class="section-layout resume-layout">
        <div class="section-header-tag">07 / RECRUITER SUITE</div>
        <h2 class="section-main-title">CAREER CENTER</h2>

        <!-- Recruiter Fast-Scan Panel -->
        <div class="recruiter-fast-scan">
          <div class="fast-scan-header">
            <span class="scan-badge">QUICK SCAN // RECRUITER PREVIEW</span>
            <span class="scan-status">${res.statusNote}</span>
          </div>
          <p class="fast-scan-summary">${res.summary}</p>
          <div class="quick-facts-grid">
            ${res.quickFacts
              .map(
                (f) => `
              <div class="qfact">
                <span class="qfact-label">${f.label}:</span>
                <span class="qfact-val">${f.value}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- In-Site Resume Viewer -->
        <div class="resume-document-viewer">
          <div class="viewer-toolbar">
            <span class="toolbar-filename">PRANAY_VYAS_RESUME.PDF</span>
            <div class="toolbar-actions">
              <button class="btn btn-secondary btn-sm" id="btn-print-resume" data-cursor="PRINT">
                <span>PRINT DOCUMENT</span>
              </button>
              <a href="mailto:${this.config.personal.email}?subject=Resume%20Inquiry%20-%20Pranay%20Vyas" class="btn btn-primary btn-sm" data-cursor="EMAIL">
                <span>REQUEST UPDATED RESUME</span>
              </a>
            </div>
          </div>

          <div class="resume-sheet">
            <div class="resume-header">
              <h1 class="sheet-name">${this.config.personal.name}</h1>
              <div class="sheet-contact-line">
                <span>${this.config.personal.degree} • ${this.config.personal.university}</span>
                <span class="sep">|</span>
                <span>${this.config.personal.email}</span>
                <span class="sep">|</span>
                <span>Jaipur, India</span>
              </div>
            </div>

            ${res.sections
              .map(
                (sec) => `
              <div class="sheet-section">
                <h3 class="sheet-section-title">${sec.heading}</h3>
                <div class="sheet-section-content">
                  ${sec.items
                    .map(
                      (item) => `
                    <div class="sheet-item">
                      <div class="sheet-item-header">
                        <span class="item-title">${item.title}</span>
                        <span class="item-date">${item.date}</span>
                      </div>
                      <div class="item-sub">${item.subtitle}</div>
                      <ul class="item-bullets">
                        ${item.bullets.map((b) => `<li>${b}</li>`).join("")}
                      </ul>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  // 08 / CONTACT — COMMUNICATION TOWER
  renderContactSection() {
    const p = this.config.personal;
    return `
      <div class="section-layout contact-layout">
        <div class="section-header-tag">08 / TRANSMISSION TERMINAL</div>
        <h2 class="section-main-title">COMMUNICATION TOWER</h2>
        <p class="contact-intro">Direct transmission channels for internships, project collaborations, and professional networking.</p>

        <div class="contact-grid">
          <!-- Social & Direct Channels -->
          <div class="social-channels-card">
            <h3 class="channels-title">VERIFIED CONTACT CHANNELS</h3>
            
            <div class="channel-row">
              <div class="channel-info">
                <span class="channel-type">EMAIL</span>
                <a href="mailto:${p.email}" class="channel-link">${p.email}</a>
              </div>
              <button class="btn btn-sm btn-outline" id="copy-email-btn" data-cursor="COPY">
                <span>COPY EMAIL</span>
              </button>
            </div>

            <div class="channel-row">
              <div class="channel-info">
                <span class="channel-type">GITHUB</span>
                <a href="${p.githubUrl}" target="_blank" rel="noopener" class="channel-link">${p.githubUrl}</a>
              </div>
              <a href="${p.githubUrl}" target="_blank" rel="noopener" class="btn btn-sm btn-outline" data-cursor="EXTERNAL">
                <span>VISIT</span>
              </a>
            </div>

            <div class="channel-row">
              <div class="channel-info">
                <span class="channel-type">LINKEDIN</span>
                <a href="${p.linkedinUrl}" target="_blank" rel="noopener" class="channel-link">linkedin.com/in/pranay-vyas</a>
              </div>
              <a href="${p.linkedinUrl}" target="_blank" rel="noopener" class="btn btn-sm btn-outline" data-cursor="EXTERNAL">
                <span>CONNECT</span>
              </a>
            </div>

            <div class="channel-status-box">
              <span class="status-dot"></span>
              <span>${p.availability}</span>
            </div>
          </div>

          <!-- Contact Terminal Form -->
          <div class="terminal-form-card">
            <div class="terminal-header">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
              <span class="terminal-title">TRANSMISSION_DISPATCHER // PORT_443</span>
            </div>

            <form id="contact-terminal-form" class="terminal-form">
              <div class="form-group">
                <label for="contact-name">SENDER_NAME:</label>
                <input type="text" id="contact-name" required placeholder="Your name or organization..." />
              </div>

              <div class="form-group">
                <label for="contact-email">RETURN_ADDRESS:</label>
                <input type="email" id="contact-email" required placeholder="Your email address..." />
              </div>

              <div class="form-group">
                <label for="contact-subject">TRANSMISSION_SUBJECT:</label>
                <input type="text" id="contact-subject" required placeholder="Internship / Collaboration / Hello..." />
              </div>

              <div class="form-group">
                <label for="contact-msg">TRANSMISSION_PACKET:</label>
                <textarea id="contact-msg" rows="4" required placeholder="Type your message packet here..."></textarea>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" id="btn-send-transmission" data-cursor="TRANSMIT">
                  <span class="btn-text">DISPATCH TRANSMISSION</span>
                </button>
                <span class="form-feedback" id="terminal-feedback"></span>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  // 09 / INNOVATION — INNOVATION LAB
  renderInnovationSection() {
    const inno = this.config.innovation;
    return `
      <div class="section-layout innovation-layout">
        <div class="section-header-tag">09 / EXPERIMENTATION &amp; EDP</div>
        <h2 class="section-main-title">${inno.heading}</h2>
        <p class="innovation-intro">${inno.subtitle}</p>

        <!-- Innovation Interactive Timeline -->
        <div class="innovation-timeline">
          ${inno.timeline
            .map(
              (item) => `
            <div class="inno-card">
              <div class="inno-top">
                <span class="inno-date">${item.date}</span>
                <h4 class="inno-event">${item.event}</h4>
              </div>
              <div class="inno-body">
                <div class="inno-block">
                  <span class="block-tag">WHAT I DID:</span>
                  <p>${item.whatIDid}</p>
                </div>
                <div class="inno-block">
                  <span class="block-tag">WHAT I LEARNED:</span>
                  <p>${item.whatILearned}</p>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  // Dynamic initialization per section
  postRenderSetup(id) {
    if (id === "about") {
      this.initPVArtifactViewer();
      const skillsBtn = document.getElementById("about-to-skills");
      skillsBtn?.addEventListener("click", () => {
        this.open("skills");
      });
    } else if (id === "skills") {
      this.initSkillsSection3D();
      this.bindSkillCardClicks();
    } else if (id === "github") {
      this.fetchAndRenderGitHubTelemetry();
    } else if (id === "contact") {
      this.bindContactEvents();
    } else if (id === "resume") {
      const printBtn = document.getElementById("btn-print-resume");
      printBtn?.addEventListener("click", () => window.print());
    }
  }

  // Interactive 3D Canvas for Signature PV Obsidian Artifact
  initPVArtifactViewer() {
    const container = document.getElementById("pv-artifact-canvas-container");
    if (!container) return;

    // Clear previous elements
    container.innerHTML = "";

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0, 7.8);
    camera.lookAt(0, -0.15, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Studio Lighting tailored for obsidian metal & violet bevels
    const ambLight = new THREE.AmbientLight(0x281848, 1.4);
    scene.add(ambLight);

    // Key Light (Lavender soft illumination)
    const keyLight = new THREE.DirectionalLight(0xc4b5fd, 2.4);
    keyLight.position.set(3.5, 4.5, 5.0);
    scene.add(keyLight);

    // Rim Light (Cool Blue edge definition)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    rimLight.position.set(-4.5, -1.5, -3.0);
    scene.add(rimLight);

    // Top Backlight (Violet crown halo)
    const backLight = new THREE.DirectionalLight(0x8b5cf6, 1.2);
    backLight.position.set(0, 4.0, -3.5);
    scene.add(backLight);

    // Build the unmistakable, beveled 3D PV monogram
    const pvGroup = createPVMonogramMesh({ scale: 1.0, isCityVersion: false });
    scene.add(pvGroup);

    // Interactive Drag to Inspect (returns smoothly to front view)
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    const currentRot = { x: 0.05, y: 0.0 };
    const targetRot = { x: 0.05, y: 0.0 };

    renderer.domElement.addEventListener("mousedown", (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      targetRot.y += dx * 0.008;
      targetRot.x = Math.max(-0.35, Math.min(0.35, targetRot.x + dy * 0.008));
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    // Touch controls for mobile inspection
    renderer.domElement.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener("touchend", () => {
      isDragging = false;
    });

    renderer.domElement.addEventListener("touchmove", (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouse.x;
      const dy = e.touches[0].clientY - prevMouse.y;
      targetRot.y += dx * 0.009;
      targetRot.x = Math.max(-0.35, Math.min(0.35, targetRot.x + dy * 0.009));
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    const animatePV = () => {
      this.pvViewerAnim = requestAnimationFrame(animatePV);
      const time = performance.now() * 0.001;

      if (!isDragging) {
        // Controlled cinematic sway: yaw oscillates +/- 14 degrees so "PV" remains completely readable!
        const autoSwayY = Math.sin(time * 0.8) * 0.24;
        const autoSwayX = Math.sin(time * 0.5) * 0.05;
        targetRot.y += (autoSwayY - targetRot.y) * 0.04;
        targetRot.x += (autoSwayX - targetRot.x) * 0.04;
      }

      currentRot.y += (targetRot.y - currentRot.y) * 0.1;
      currentRot.x += (targetRot.x - currentRot.x) * 0.1;

      pvGroup.rotation.y = currentRot.y;
      pvGroup.rotation.x = currentRot.x;
      pvGroup.position.y = Math.sin(time * 1.2) * 0.06; // Subtle floating motion

      renderer.render(scene, camera);
    };
    animatePV();
  }

  // Skills 3D Constellation
  initSkillsSection3D() {
    const container = document.getElementById("skills-3d-canvas");
    if (!container) return;

    this.skillNetwork = new SkillNetwork3D(container, this.config.skills, (skillId) => {
      this.displaySkillInspector(skillId);
    });

    // Default select first skill
    setTimeout(() => {
      if (this.config.skills.length > 0) {
        this.skillNetwork.selectNode(this.config.skills[0].id);
      }
    }, 150);
  }

  bindSkillCardClicks() {
    const cards = this.overlayEl.querySelectorAll(".skill-card-item");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        this.sound?.playClick();
        if (this.skillNetwork) {
          this.skillNetwork.selectNode(id);
        } else {
          this.displaySkillInspector(id);
        }
      });
    });
  }

  displaySkillInspector(skillId) {
    const s = this.config.skills.find((item) => item.id === skillId);
    if (!s) return;

    const placeholder = document.getElementById("inspector-placeholder");
    const content = document.getElementById("inspector-content");
    if (!content) return;

    if (placeholder) placeholder.style.display = "none";
    content.style.display = "block";

    content.innerHTML = `
      <div class="inspector-badge">
        <span class="badge-icon">${s.icon}</span>
        <span class="badge-name">${s.name}</span>
        <span class="badge-status">${s.status}</span>
      </div>
      <h3 class="inspector-category">${s.category}</h3>
      <p class="inspector-details">${s.details}</p>
      
      <div class="inspector-topics">
        <div class="topics-title">KEY CONCEPTS UNDER MASTERY:</div>
        <div class="topics-tags">
          ${s.topics.map((t) => `<span class="topic-pill">${t}</span>`).join("")}
        </div>
      </div>
    `;
  }

  // GitHub Telemetry Fetch
  async fetchAndRenderGitHubTelemetry() {
    const container = document.getElementById("github-repos-container");
    if (!container) return;

    const res = await this.githubService.fetchRepositories();
    const repos = res.success ? res.data : res.fallbackData;

    if (!repos || repos.length === 0) {
      container.innerHTML = `
        <div class="repos-empty">
          <h4>NO PUBLIC REPOSITORIES FOUND</h4>
          <p>Repositories are being organized. Follow development directly on GitHub.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = repos
      .map(
        (repo) => `
      <div class="repo-card" data-cursor="VIEW">
        <div class="repo-card-top">
          <span class="repo-folder">📁</span>
          <h4 class="repo-name">${repo.name}</h4>
          ${repo.stargazers_count > 0 ? `<span class="repo-stars">★ ${repo.stargazers_count}</span>` : ""}
        </div>
        <p class="repo-desc">${repo.description || "Core programming code repository and algorithmic studies."}</p>
        <div class="repo-card-footer">
          <span class="repo-lang"><span class="lang-dot"></span>${repo.language || "C++"}</span>
          <a href="${repo.html_url}" target="_blank" rel="noopener" class="btn btn-outline btn-sm" data-cursor="EXTERNAL">
            <span>VIEW ON GITHUB</span>
          </a>
        </div>
      </div>
    `
      )
      .join("");
  }

  bindContactEvents() {
    const copyBtn = document.getElementById("copy-email-btn");
    copyBtn?.addEventListener("click", () => {
      navigator.clipboard.writeText(this.config.personal.email).then(() => {
        copyBtn.querySelector("span").textContent = "COPIED TO CLIPBOARD!";
        this.sound?.playClick();
        setTimeout(() => {
          copyBtn.querySelector("span").textContent = "COPY EMAIL";
        }, 2200);
      });
    });

    const form = document.getElementById("contact-terminal-form");
    const feedback = document.getElementById("terminal-feedback");

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.sound?.playTransition();

      const name = document.getElementById("contact-name").value;
      const email = document.getElementById("contact-email").value;
      const subject = document.getElementById("contact-subject").value;
      const msg = document.getElementById("contact-msg").value;

      if (feedback) {
        feedback.textContent = "TRANSMITTING PACKET VIA CLIENT PROTOCOL...";
        feedback.style.color = "#a78bfa";
      }

      setTimeout(() => {
        // Prepare mailto fallback link and notify user
        const mailtoUrl = `mailto:${this.config.personal.email}?subject=${encodeURIComponent(
          "[Portfolio] " + subject
        )}&body=${encodeURIComponent("Sender: " + name + " (" + email + ")\n\n" + msg)}`;

        if (feedback) {
          feedback.textContent = "PACKET DISPATCHED! OPENING CLIENT LINK...";
          feedback.style.color = "#38bdf8";
        }

        window.location.href = mailtoUrl;
        form.reset();
      }, 700);
    });
  }

  cleanupDynamicFeatures() {
    if (this.pvViewerAnim) {
      cancelAnimationFrame(this.pvViewerAnim);
      this.pvViewerAnim = null;
    }
    if (this.skillNetwork) {
      this.skillNetwork.destroy();
      this.skillNetwork = null;
    }
  }
}
