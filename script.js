// ========= Helpers =========
const qs = (id) => document.getElementById(id);

const setText = (id, value) => {
  const el = qs(id);
  if (el && value !== undefined && value !== null && value !== "") el.textContent = value;
};

const setHref = (id, value) => {
  const el = qs(id);
  if (el && value) el.setAttribute("href", value);
};

const splitByComma = (str) =>
  (str || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const renderTags = (containerId, items) => {
  const el = qs(containerId);
  if (!el) return;
  el.innerHTML = (items || []).map((t) => `<span>${t}</span>`).join("");
};

// ========= Mobile menu =========
const menuBtn = qs("menuBtn");
const navLinks = qs("navLinks");
menuBtn?.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ========= Year =========
setText("year", new Date().getFullYear());

// ========= 1) Render from CONTENT (content.js) =========
if (typeof CONTENT !== "undefined") {
  // Title + meta
  document.title = CONTENT.site?.title || document.title;

  const siteTitle = qs("siteTitle");
  if (siteTitle) siteTitle.textContent = CONTENT.site?.title || "Portfolio";

  const siteDesc = qs("siteDesc");
  if (siteDesc) {
    siteDesc.setAttribute(
      "content",
      `پورتفولیوی ${CONTENT.site?.name || ""} - ${CONTENT.site?.role || ""}`.trim()
    );
  }

  // Header / Hero / Footer
  setText("brandName", CONTENT.site?.name);
  setText("heroName", CONTENT.site?.name);
  setText("heroRole", CONTENT.site?.role);
  setText("heroIntro", CONTENT.site?.intro);
  setText("footerName", CONTENT.site?.name);

  // Stats
  const statsEl = qs("stats");
  if (statsEl) {
    statsEl.innerHTML = (CONTENT.stats || [])
      .map(
        (s) => `
        <div class="stat">
          <div class="stat__num">${s.num}</div>
          <div class="stat__label">${s.label}</div>
        </div>
      `
      )
      .join("");
  }

  // About
  setText("aboutText", CONTENT.about?.text);

  // Skills
  renderTags("skillsFrontend", CONTENT.skills?.frontend);
  renderTags("skillsBackend", CONTENT.skills?.backend);
  renderTags("skillsTools", CONTENT.skills?.tools);

  // Projects (with image)
  const projectsGrid = qs("projectsGrid");
  if (projectsGrid) {
    projectsGrid.innerHTML = (CONTENT.projects || [])
      .map((p) => {
        const thumb = p.image
          ? `<img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;display:block;">`
          : `<span>${p.emoji || "📁"}</span>`;

        const tags = (p.tags || []).map((t) => `<span class="pill">${t}</span>`).join("");

        return `
          <article class="project card">
            <div class="project__thumb">${thumb}</div>
            <div class="project__body">
              <h3>${p.title || ""}</h3>
              <p>${p.desc || ""}</p>
              <div class="project__meta">${tags}</div>
              <div class="project__links">
                <a class="btn btn--small" href="${p.demo || "#"}" target="_blank" rel="noreferrer">دمو</a>
                <a class="btn btn--small btn--ghost" href="${p.github || "#"}" target="_blank" rel="noreferrer">گیت‌هاب</a>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  // Experience
  const timeline = qs("timeline");
  if (timeline) {
    timeline.innerHTML = (CONTENT.experience || [])
      .map(
        (e) => `
        <div class="timeline-item card">
          <div class="timeline-item__top">
            <h3>${e.title || ""}</h3>
            <span class="muted">${e.time || ""}</span>
          </div>
          <ul class="list">${(e.bullets || []).map((b) => `<li>${b}</li>`).join("")}</ul>
        </div>
      `
      )
      .join("");
  }

  // Contact headline
  setText("contactHeadline", CONTENT.contact?.headline);

  // Contact Links (from content.js)
  if (CONTENT.site?.email) {
    const el = qs("emailLink");
    if (el) {
      el.textContent = CONTENT.site.email;
      el.href = "mailto:" + CONTENT.site.email;
    }
  }

  setHref("githubLink", CONTENT.links?.github);
  setHref("linkedinLink", CONTENT.links?.linkedin);
  setHref("telegramLink", CONTENT.links?.telegram);
  setHref("instagramLink", CONTENT.links?.instagram);

  // Profile image (from content.js)
  const profileImg = qs("profileImg");
  const profileFallback = qs("profileFallback");
  if (profileImg && CONTENT.images?.profile) {
    profileImg.src = CONTENT.images.profile;
    profileImg.style.display = "block";
    if (profileFallback) profileFallback.style.display = "none";
  }

  // Resume button
  const resumeBtn = qs("resumeBtn");
  resumeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const url = CONTENT.site?.resumeUrl;
    if (url && url !== "#") window.open(url, "_blank");
    else alert("رزومه هنوز اضافه نشده. بعداً فایل PDF رو داخل پروژه می‌ذاریم و لینک می‌کنیم.");
  });
}

// ========= 2) Admin Panel Override (localStorage) =========
try {
  const saved = JSON.parse(localStorage.getItem("portfolioContent") || "{}");

  // Name / Role / Intro / Email
  if (saved.name) {
    setText("brandName", saved.name);
    setText("heroName", saved.name);
    setText("footerName", saved.name);
  }
  if (saved.role) setText("heroRole", saved.role);
  if (saved.intro) setText("heroIntro", saved.intro);

  if (saved.email) {
    const el = qs("emailLink");
    if (el) {
      el.textContent = saved.email;
      el.href = "mailto:" + saved.email;
    }
  }

  // About text
  if (saved.aboutText) setText("aboutText", saved.aboutText);

  // Skills override (comma separated)
  if (saved.skillsFrontend) renderTags("skillsFrontend", splitByComma(saved.skillsFrontend));
  if (saved.skillsBackend) renderTags("skillsBackend", splitByComma(saved.skillsBackend));
  if (saved.skillsTools) renderTags("skillsTools", splitByComma(saved.skillsTools));

  // Projects override (one line per project)
  // format: title | desc | demo | github | tag1, tag2
  if (saved.projects) {
    const lines = saved.projects
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const projects = lines.map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      const [title, desc, demo, github, tagsStr] = parts;
      return {
        title: title || "",
        desc: desc || "",
        demo: demo || "#",
        github: github || "#",
        tags: splitByComma(tagsStr || "")
      };
    });

    const projectsGrid = qs("projectsGrid");
    if (projectsGrid) {
      projectsGrid.innerHTML = projects
        .map((p) => {
          const tags = (p.tags || []).map((t) => `<span class="pill">${t}</span>`).join("");
          return `
            <article class="project card">
              <div class="project__thumb"><span>📌</span></div>
              <div class="project__body">
                <h3>${p.title}</h3>
                <p>${p.desc}</p>
                <div class="project__meta">${tags}</div>
                <div class="project__links">
                  <a class="btn btn--small" href="${p.demo}" target="_blank" rel="noreferrer">دمو</a>
                  <a class="btn btn--small btn--ghost" href="${p.github}" target="_blank" rel="noreferrer">گیت‌هاب</a>
                </div>
              </div>
            </article>
          `;
        })
        .join("");
    }
  }

  // Links override
  if (saved.github) setHref("githubLink", saved.github);
  if (saved.linkedin) setHref("linkedinLink", saved.linkedin);
  if (saved.telegram) setHref("telegramLink", saved.telegram);
  if (saved.instagram) setHref("instagramLink", saved.instagram);

  // Profile image override (dataURL saved from admin)
  if (saved.avatarDataUrl) {
    const profileImg = qs("profileImg");
    const profileFallback = qs("profileFallback");
    if (profileImg) {
      profileImg.src = saved.avatarDataUrl;
      profileImg.style.display = "block";
      if (profileFallback) profileFallback.style.display = "none";
    }
  }
} catch (e) {
  console.log("Admin override error:", e);
}

// ========= Demo contact form =========
const contactForm = qs("contactForm");
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("پیام شما ثبت شد ✅ (در مرحله بعد ارسال واقعی رو وصل می‌کنیم)");
  e.target.reset();
});
