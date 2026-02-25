// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn?.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Helpers
const qs = (id) => document.getElementById(id);
const safeText = (id, value) => { const el = qs(id); if (el) el.textContent = value ?? ""; };
const safeHref = (id, value) => { const el = qs(id); if (el && value) el.setAttribute("href", value); };
const renderTags = (containerId, items) => {
  const el = qs(containerId);
  if (!el) return;
  el.innerHTML = (items || []).map(t => `<span>${t}</span>`).join("");
};

// Title + meta
document.title = CONTENT.site.title;
safeText("siteTitle", CONTENT.site.title);
const descEl = qs("siteDesc");
if (descEl) descEl.setAttribute("content", `پورتفولیوی ${CONTENT.site.name} - ${CONTENT.site.role}`);

// Header / Hero / Footer text
safeText("brandName", CONTENT.site.name);
safeText("heroName", CONTENT.site.name);
safeText("heroRole", CONTENT.site.role);
safeText("heroIntro", CONTENT.site.intro);
safeText("footerName", CONTENT.site.name);

// Stats
const statsEl = qs("stats");
if (statsEl) {
  statsEl.innerHTML = (CONTENT.stats || []).map(s => `
    <div class="stat">
      <div class="stat__num">${s.num}</div>
      <div class="stat__label">${s.label}</div>
    </div>
  `).join("");
}

// About
safeText("aboutHeading", CONTENT.about.heading);
safeText("aboutText", CONTENT.about.text);
safeText("whyTitle", CONTENT.about.whyTitle);
const whyList = qs("whyList");
if (whyList) whyList.innerHTML = (CONTENT.about.why || []).map(x => `<li>${x}</li>`).join("");

// Skills
renderTags("skillsFrontend", CONTENT.skills.frontend);
renderTags("skillsBackend", CONTENT.skills.backend);
renderTags("skillsTools", CONTENT.skills.tools);

// Projects
const projectsGrid = qs("projectsGrid");
if (projectsGrid) {
  projectsGrid.innerHTML = (CONTENT.projects || []).map(p => {
    const thumb = p.image
      ? `<img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;display:block;">`
      : `<span>${p.emoji || "📁"}</span>`;

    const tags = (p.tags || []).map(t => `<span class="pill">${t}</span>`).join("");

    return `
      <article class="project card">
        <div class="project__thumb">${thumb}</div>
        <div class="project__body">
          <h3>${p.title}</h3>
          <p>${p.desc || ""}</p>
          <div class="project__meta">${tags}</div>
          <div class="project__links">
            <a class="btn btn--small" href="${p.demo || "#"}" target="_blank" rel="noreferrer">دمو</a>
            <a class="btn btn--small btn--ghost" href="${p.github || "#"}" target="_blank" rel="noreferrer">گیت‌هاب</a>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// Experience
const timeline = qs("timeline");
if (timeline) {
  timeline.innerHTML = (CONTENT.experience || []).map(e => `
    <div class="timeline-item card">
      <div class="timeline-item__top">
        <h3>${e.title}</h3>
        <span class="muted">${e.time}</span>
      </div>
      <ul class="list">${(e.bullets || []).map(b => `<li>${b}</li>`).join("")}</ul>
    </div>
  `).join("");
}

// Contact
safeText("contactHeadline", CONTENT.contact.headline);

safeHref("emailLink", `mailto:${CONTENT.site.email}`);
safeText("emailLink", CONTENT.site.email);

safeHref("linkedinLink", CONTENT.links.linkedin);
safeHref("githubLink", CONTENT.links.github);
safeHref("telegramLink", CONTENT.links.telegram);
safeHref("instagramLink", CONTENT.links.instagram);

// Resume button
qs("resumeBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  const url = CONTENT.site.resumeUrl;
  if (url && url !== "#") window.open(url, "_blank");
  else alert("رزومه هنوز اضافه نشده. بعداً فایل PDF رو داخل پروژه می‌ذاریم و لینک می‌کنیم.");
});

// Profile image
const profileImg = qs("profileImg");
const profileFallback = qs("profileFallback");
if (profileImg && CONTENT.images.profile) {
  profileImg.src = CONTENT.images.profile;
  profileImg.style.display = "block";
  if (profileFallback) profileFallback.style.display = "none";
}

// Demo form
qs("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("پیام شما ثبت شد ✅ (در مرحله بعد ارسال واقعی رو وصل می‌کنیم)");
  e.target.reset();

});
alert("SCRIPT LOADED ✅");
