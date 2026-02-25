// ========= Helpers =========
const qs = (id) => document.getElementById(id);

const setText = (id, value) => {
  const el = qs(id);
  if (el && value !== undefined && value !== null) el.textContent = value;
};

const setHref = (id, value) => {
  const el = qs(id);
  if (el && value) el.setAttribute("href", value);
};

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
// این بخش باعث میشه پروژه‌ها + عکس‌ها + مهارت‌ها و ... بیاد
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
  setText("aboutHeading", CONTENT.about?.heading);
  setText("aboutText", CONTENT.about?.text);
  setText("whyTitle", CONTENT.about?.whyTitle);

  const whyList = qs("whyList");
  if (whyList) {
    whyList.innerHTML = (CONTENT.about?.why || []).map((x) => `<li>${x}</li>`).join("");
  }

  // Skills
  renderTags("skillsFrontend", CONTENT.skills?.frontend);
  renderTags("skillsBackend", CONTENT.skills?.backend);
  renderTags("skillsTools", CONTENT.skills?.tools);

  // Projects (با عکس)
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

  // Experience / Timeline
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

  // Links (contact section)
  if (CONTENT.site?.email) {
    setHref("emailLink", `mailto:${CONTENT.site.email}`);
    setText("emailLink", CONTENT.site.email);
  }

  setHref("githubLink", CONTENT.links?.github);
  setHref("linkedinLink", CONTENT.links?.linkedin);
  setHref("telegramLink", CONTENT.links?.telegram);
  setHref("instagramLink", CONTENT.links?.instagram);

  // Profile image (Hero avatar)
  const profileImg = qs("profileImg");
  const profileFallback = qs("profileFallback");
  if (profileImg && CONTENT.images?.profile) {
    profileImg.src = CONTENT.images.profile;
    profileImg.style.display = "block";
    if (profileFallback) profileFallback.style.display = "none";
  }

  // Resume button (اگر resumeUrl داشتی)
  const resumeBtn = qs("resumeBtn");
  resumeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const url = CONTENT.site?.resumeUrl;
    if (url && url !== "#") window.open(url, "_blank");
    else alert("رزومه هنوز اضافه نشده. بعداً فایل PDF رو داخل پروژه می‌ذاریم و لینک می‌کنیم.");
  });
}

// ========= 2) Admin Panel Override (localStorage) =========
// این بخش، تغییرات ذخیره شده از /admin.html رو روی صفحه اصلی اعمال می‌کنه
try {
  const saved = JSON.parse(localStorage.getItem("portfolioContent") || "{}");

  // Name
  if (saved.name) {
    setText("brandName", saved.name);
    setText("heroName", saved.name);
    setText("footerName", saved.name);
  }

  // Role
  if (saved.role) {
    setText("heroRole", saved.role);
  }

  // Intro
  if (saved.intro) {
    setText("heroIntro", saved.intro);
  }

  // Email
  if (saved.email) {
    const el = qs("emailLink");
    if (el) {
      el.textContent = saved.email;
      el.href = "mailto:" + saved.email;
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
