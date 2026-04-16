const burger    = document.getElementById('burger');
const navLinks  = document.getElementById('navLinks');
const topnav    = document.getElementById('topnav');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // Animate burger
  const spans = burger.querySelectorAll('span');
  const open  = navLinks.classList.contains('open');
  spans[0].style.transform = open ? 'translateY(7px) rotate(45deg)'  : '';
  spans[1].style.opacity   = open ? '0' : '1';
  spans[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
});

// Закрыть меню при клике на ссылку
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = burger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = '';
  });
});

// ── Навигация: scrolled class ──────────
window.addEventListener('scroll', () => {
  topnav.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Intersection Observer — секции ─────
const sections = document.querySelectorAll('.section');
const io = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  }),
  { threshold: 0.1 }
);
sections.forEach(s => io.observe(s));

// ── Видео: попытка автовоспроизведения ─
const bgVideo = document.getElementById('bgVideo');
if (bgVideo) {
  bgVideo.play().catch(() => {
    // Браузер заблокировал — ничего, фон всё равно задан CSS
    console.info('Autoplay blocked — static background is active');
  });
}

// ── Активный nav-link по скроллу ───────
const navAnchors = document.querySelectorAll('.nav-link[href^="#"]');
const sectionEls = [];
navAnchors.forEach(a => {
  const id = a.getAttribute('href').slice(1);
  const el = document.getElementById(id);
  if (el) sectionEls.push({ link: a, el });
});

const activeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      const match = sectionEls.find(s => s.el === e.target);
      if (match && e.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active-nav'));
        match.link.classList.add('active-nav');
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sectionEls.forEach(s => activeObserver.observe(s.el));

// Active nav style (добавляем динамически)
const navStyle = document.createElement('style');
navStyle.textContent = '.active-nav { background: var(--cream2); color: var(--gold) !important; font-weight: 600 !important; }';
document.head.appendChild(navStyle);

// ── Smooth scroll для якорей ───────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// ── Анимация карточек чемпионов ─────────
document.querySelectorAll('.champ-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.querySelector('.champ-icon').style.transform = 'rotate(-8deg) scale(1.1)';
  });
  card.addEventListener('mouseleave', () => {
    card.querySelector('.champ-icon').style.transform = '';
  });
});

// ── Анимация promo-strip (пауза при наведении) ──
const promoTrack = document.querySelector('.promo-track');
if (promoTrack) {
  promoTrack.addEventListener('mouseenter', () => {
    promoTrack.style.animationPlayState = 'paused';
  });
  promoTrack.addEventListener('mouseleave', () => {
    promoTrack.style.animationPlayState = 'running';
  });
}

// ── Tooltip на guide-link ───────────────
document.querySelectorAll('.guide-link, .faction-link').forEach(link => {
  link.addEventListener('mouseenter', () => {
    link.title = link.textContent.trim().replace(/🔥|NEW/g, '').trim();
  });
});

// ── Easter egg: Konami code ─────────────
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
document.addEventListener('keydown', e => {
  if (e.key === konami[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === konami.length) {
      document.querySelector('.hero-gem .gem-inner').style.background = 'linear-gradient(135deg,#ff6b9d,#c44dff,#4d94ff)';
      document.querySelector('.hero-gem .gem-inner').style.transform = 'scale(1.3) rotate(360deg)';
      document.querySelector('.hero-gem .gem-inner').style.transition = 'all 0.8s ease';
      setTimeout(() => {
        document.querySelector('.hero-gem .gem-inner').style.transform = '';
        document.querySelector('.hero-gem .gem-inner').style.background = '';
      }, 2000);
      konamiIdx = 0;
    }
  } else {
    konamiIdx = 0;
  }
});

// ── Счётчик анимации для hero-stats ────
function animateCounter(el, target, duration) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Запускаем когда герой виден
const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    const statNums = document.querySelectorAll('.stat-n');
    const values = [800, 16, 100];
    const suffixes = ['+', '', '+'];
    statNums.forEach((el, i) => {
      el.dataset.suffix = suffixes[i];
      animateCounter(el, values[i], 1500);
    });
    heroObserver.disconnect();
  }
}, { threshold: 0.5 });
const heroSection = document.querySelector('.hero-stats');
if (heroSection) heroObserver.observe(heroSection);

console.log('%cRaidGuide.pro — Загружено ✓', 'color:#c8922a; font-size:14px; font-weight:bold;');
