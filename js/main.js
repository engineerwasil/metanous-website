// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Reduced motion check
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Animated stat counters (triggered on view)
const counters = document.querySelectorAll('.stat-num');
const animateCount = (el) => {
  const target = parseInt(el.getAttribute('data-count'), 10);
  if (reduceMotion) { el.textContent = target; return; }
  const duration = 1200;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

// Scroll reveal + counter trigger
const revealTargets = document.querySelectorAll('.service-card, .approach-row, .industry-card, .work-card, .section-head');
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => io.observe(el));

const statIo = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      counters.forEach(animateCount);
      statIo.disconnect();
    }
  });
}, { threshold: 0.4 });

const statsSection = document.querySelector('.stats');
if (statsSection) statIo.observe(statsSection);

// Sprinkle faint dots across the schematic grid background
const dotsGroup = document.querySelector('.schematic-dots');
if (dotsGroup) {
  const ns = 'http://www.w3.org/2000/svg';
  for (let x = 20; x < 1000; x += 40) {
    for (let y = 20; y < 260; y += 40) {
      const c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', x);
      c.setAttribute('cy', y);
      c.setAttribute('r', 1);
      c.setAttribute('fill', 'rgba(79,163,209,0.12)');
      dotsGroup.appendChild(c);
    }
  }
}

// Sticky nav shadow on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    nav.style.borderBottomColor = 'rgba(79,163,209,0.35)';
  } else {
    nav.style.borderBottomColor = '';
  }
});
