// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn?.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

// Year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Admin Panel Override (localStorage) =====
// This reads data saved from /admin.html and applies it to the main page.
try {
  const saved = JSON.parse(localStorage.getItem("portfolioContent") || "{}");

  // Name
  if (saved.name) {
    const brandName = document.getElementById("brandName");
    const heroName = document.getElementById("heroName");
    const footerName = document.getElementById("footerName");
    if (brandName) brandName.textContent = saved.name;
    if (heroName) heroName.textContent = saved.name;
    if (footerName) footerName.textContent = saved.name;
  }

  // Role
  if (saved.role) {
    const heroRole = document.getElementById("heroRole");
    if (heroRole) heroRole.textContent = saved.role;
  }

  // Intro
  if (saved.intro) {
    const heroIntro = document.getElementById("heroIntro");
    if (heroIntro) heroIntro.textContent = saved.intro;
  }

  // Email (contact section)
  if (saved.email) {
    const emailLink = document.getElementById("emailLink");
    if (emailLink) {
      emailLink.textContent = saved.email;
      emailLink.href = "mailto:" + saved.email;
    }
  }
} catch (e) {
  console.log("Admin override error:", e);
}

// Resume button (optional)
const resumeBtn = document.getElementById("resumeBtn");
resumeBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  alert("رزومه هنوز اضافه نشده. بعداً فایل PDF رو داخل پروژه می‌ذاریم و لینک می‌کنیم.");
});

// Contact form (demo)
const contactForm = document.getElementById("contactForm");
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("پیام شما ثبت شد ✅ (در مرحله بعد ارسال واقعی رو وصل می‌کنیم)");
  e.target.reset();
});
