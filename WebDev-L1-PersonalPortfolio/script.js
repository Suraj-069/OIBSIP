/* =========================================================
   SURAJ AGLAVE — PORTFOLIO SCRIPT (LIGHT THEME)
   Beginner-friendly vanilla JavaScript only.
   Handles: mobile menu toggle, closing menu on link click,
   active nav link highlighting, and simple scroll reveal.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- MOBILE HAMBURGER MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', function () {
    const isActive = navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });

  /* Close mobile menu whenever a nav link is clicked */
  const allNavLinks = document.querySelectorAll('.nav-link, .nav-cta-mobile a');
  allNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navItems.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSectionId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  /* ---------- SIMPLE SCROLL REVEAL ---------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- CONTACT FORM (FRONTEND ONLY, NO BACKEND) ---------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      // Prevent default page reload. No backend is connected,
      // so this form does not actually send the message anywhere yet.
      e.preventDefault();
      contactForm.reset();
    });
  }

});
