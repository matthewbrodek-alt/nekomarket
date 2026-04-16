window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.add('page-loaded');
    }, 1200);
  }
});

/* ── ВИДЕО: Надёжный запуск ─────────────
   Проблема: z-index и opacity мешали видео
   Решение: убираем конфликт слоёв, запускаем
   через несколько методов               */
const bgVideo = document.getElementById('bgVideo');
const bgVideoWrap = document.getElementById('bgVideoWrap');

function tryPlayVideo() {
  if (!bgVideo) return;

  // Убеждаемся что видео настроено правильно
  bgVideo.muted = true;
  bgVideo.loop = true;
  bgVideo.playsInline = true;

  // Показываем обёртку
  if (bgVideoWrap) bgVideoWrap.style.display = 'block';

  const playPromise = bgVideo.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.info('%c🎬 Видео запущено ✓', 'color:#c8922a;');
      })
      .catch(err => {
        // Автозапуск заблокирован — ждём взаимодействия
        console.info('%c⚠ Autoplay blocked — waiting for interaction', 'color:#ff7070;');
        const unlockVideo = () => {
          bgVideo.play().catch(() => {});
          document.removeEventListener('click', unlockVideo);
          document.removeEventListener('touchstart', unlockVideo);
          document.removeEventListener('keydown', unlockVideo);
        };
        document.addEventListener('click', unlockVideo);
        document.addEventListener('touchstart', unlockVideo);
        document.addEventListener('keydown', unlockVideo);
      });
  }
}

// Запускаем сразу и при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tryPlayVideo);
} else {
  tryPlayVideo();
}
// Повторный запуск после полной загрузки страницы
window.addEventListener('load', () => setTimeout(tryPlayVideo, 300));

/* ── ТЕМА: ТЁМНАЯ / СВЕТЛАЯ ────────────── */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

// Восстанавливаем сохранённую тему
const savedTheme = localStorage.getItem('rg-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle && themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('rg-theme', next);
  // Обновляем видео прозрачность
  if (bgVideo) {
    bgVideo.style.opacity = next === 'dark' ? '0.35' : '0.12';
  }
});

/* ── ЯЗЫК: RU / EN ──────────────────────
   Сохраняем выбор в localStorage
   Переключаем все элементы с data-ru/data-en */
const langToggle = document.getElementById('langToggle');
const langLabel  = document.getElementById('langLabel');
let currentLang = localStorage.getItem('rg-lang') || 'ru';

function applyLang(lang) {
  html.setAttribute('data-lang', lang);
  langLabel && (langLabel.textContent = lang.toUpperCase());
  document.title = lang === 'ru'
    ? 'RaidGuide.pro — Гайды по Raid: Shadow Legends'
    : 'RaidGuide.pro — Raid: Shadow Legends Guides';

  // Переключаем все элементы с атрибутами data-ru / data-en
  document.querySelectorAll('[data-ru]').forEach(el => {
    const txt = el.getAttribute(`data-${lang}`);
    if (txt) el.textContent = txt;
  });

  // Атрибут aria-label на бургере
  const burger = document.getElementById('burger');
  if (burger) burger.setAttribute('aria-label', lang === 'ru' ? 'Меню' : 'Menu');

  localStorage.setItem('rg-lang', lang);
}

// Применяем при загрузке
document.addEventListener('DOMContentLoaded', () => applyLang(currentLang));

langToggle && langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'ru' ? 'en' : 'ru';
  applyLang(currentLang);
});

/* ── НАВИГАЦИЯ: BURGER ──────────────────── */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const topnav   = document.getElementById('topnav');

burger && burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  const open  = navLinks.classList.contains('open');
  spans[0].style.transform = open ? 'translateY(7px) rotate(45deg)'  : '';
  spans[1].style.opacity   = open ? '0' : '1';
  spans[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
  burger.setAttribute('aria-expanded', open);
});

navLinks && navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = burger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = '';
    burger.setAttribute('aria-expanded', false);
  });
});

/* ── СКРОЛЛ: nav scrolled + progress ────── */
const scrollProgress = document.getElementById('scrollProgress');
const scrollTopBtn   = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;

  // Scrolled nav
  topnav && topnav.classList.toggle('scrolled', y > 50);

  // Progress bar
  if (scrollProgress) {
    scrollProgress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }

  // Scroll-to-top кнопка
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', y > 400);
  }
});

scrollTopBtn && scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── INTERSECTION OBSERVER — секции ──────── */
const sections = document.querySelectorAll('.section');
const io = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  }),
  { threshold: 0.08 }
);
sections.forEach(s => io.observe(s));

/* ── АКТИВНЫЙ NAV ПО СКРОЛЛУ ─────────────── */
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

/* ── SMOOTH SCROLL ───────────────────────── */
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

/* ── SCROLL KILLER: ПАРАЛЛАКС БАННЕР ────────
   При скролле: руны двигаются с разной скоростью
   Текст движется навстречу (parallax effect)    */
const parallaxBanner = document.getElementById('parallaxBanner');

function handleParallax() {
  if (!parallaxBanner) return;
  const bannerRect = parallaxBanner.getBoundingClientRect();
  const windowH = window.innerHeight;

  // Вычисляем как далеко баннер от центра экрана
  const centerOffset = (bannerRect.top + bannerRect.height / 2) - windowH / 2;
  const progress = centerOffset / windowH; // от -0.5 до 0.5

  const runes    = parallaxBanner.querySelector('.parallax-runes');
  const text     = parallaxBanner.querySelector('.parallax-text');
  const glow     = parallaxBanner.querySelector('.parallax-glow');

  if (runes) {
    runes.style.transform = `translateY(${progress * 60}px)`;
    runes.style.opacity = Math.max(0.02, 0.06 - Math.abs(progress) * 0.08);
  }
  if (text) {
    text.style.transform = `translateY(${progress * -20}px)`;
  }
  if (glow) {
    glow.style.transform = `translateY(${progress * 30}px) scale(${1 + Math.abs(progress) * 0.3})`;
  }
}

// Scroll killer: руны hero-секции тоже параллаксят
function handleHeroParallax() {
  const y = window.scrollY;
  const heroH = window.innerHeight;
  const progress = Math.min(y / heroH, 1);

  document.querySelectorAll('.rune-float').forEach((rune, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    const speed = 0.3 + i * 0.08;
    rune.style.transform = `translateY(${-progress * 80 * speed * dir}px)`;
  });

  // Gem parallax
  const gemInner = document.querySelector('.gem-inner');
  if (gemInner) {
    gemInner.style.transform = `scale(${1 - progress * 0.1}) translateY(${progress * -20}px)`;
  }

  // Orbit rings parallax
  document.querySelectorAll('.orbit-ring').forEach((ring, i) => {
    ring.style.transform = `rotate(${progress * 30 * (i + 1)}deg)`;
  });
}

// Объединённый scroll listener
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      handleParallax();
      handleHeroParallax();
      ticking = false;
    });
    ticking = true;
  }
});

/* ── CANVAS: АНИМИРОВАННЫЕ РУНЫ ФОН ─────────
   Тихо летящие магические символы на заднем плане */
function initRuneCanvas() {
  const canvas = document.getElementById('runeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const RUNES = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ'];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 28 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    rune: RUNES[Math.floor(Math.random() * RUNES.length)],
    speed: 0.15 + Math.random() * 0.25,
    size: 14 + Math.random() * 16,
    alpha: 0.2 + Math.random() * 0.5,
    drift: (Math.random() - 0.5) * 0.3,
    phase: Math.random() * Math.PI * 2,
  }));

  function animate(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#c8922a';

    particles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift + Math.sin((t * 0.001) + p.phase) * 0.2;
      if (p.y < -30) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
        p.rune = RUNES[Math.floor(Math.random() * RUNES.length)];
      }

      const pulse = 0.5 + Math.sin((t * 0.002) + p.phase) * 0.5;
      ctx.globalAlpha = p.alpha * pulse;
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.rune, p.x, p.y);
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
initRuneCanvas();

/* ── АНИМАЦИЯ КАРТОЧЕК ЧЕМПИОНОВ ──────────── */
document.querySelectorAll('.champ-card').forEach(card => {
  const icon = card.querySelector('.champ-icon');
  card.addEventListener('mouseenter', () => {
    if (icon) icon.style.transform = 'rotate(-8deg) scale(1.15)';
  });
  card.addEventListener('mouseleave', () => {
    if (icon) icon.style.transform = '';
  });
});

/* ── PROMO STRIP: пауза при наведении ──────── */
const promoTrack = document.querySelector('.promo-track');
if (promoTrack) {
  promoTrack.addEventListener('mouseenter', () => {
    promoTrack.style.animationPlayState = 'paused';
  });
  promoTrack.addEventListener('mouseleave', () => {
    promoTrack.style.animationPlayState = 'running';
  });
}

/* ── СЧЁТЧИК АНИМАЦИИ hero-stats ─────────── */
function animateCounter(el, target, duration) {
  let start = null;
  const suffix = el.dataset.suffix || '';
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // Easing: ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    const statNums = document.querySelectorAll('.stat-n');
    const values   = [800, 16, 100];
    const suffixes = ['+', '', '+'];
    statNums.forEach((el, i) => {
      el.dataset.suffix = suffixes[i];
      animateCounter(el, values[i], 1800);
    });
    heroObserver.disconnect();
  }
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

/* ── TOOLTIP НА GUIDE-LINK ───────────────── */
document.querySelectorAll('.guide-link, .faction-link').forEach(link => {
  link.addEventListener('mouseenter', () => {
    const text = link.textContent.trim().replace(/🔥|NEW/g, '').trim();
    link.title = text;
  });
});

/* ── CURSOR TRAIL (только десктоп) ──────────
   Золотые искры следуют за курсором           */
let trailActive = false;
let lastTrailTime = 0;

function createSpark(x, y) {
  const spark = document.createElement('div');
  const size = 3 + Math.random() * 5;
  const angle = Math.random() * 360;
  const distance = 20 + Math.random() * 30;

  spark.style.cssText = `
    position: fixed;
    left: ${x}px; top: ${y}px;
    width: ${size}px; height: ${size}px;
    border-radius: 50%;
    background: radial-gradient(circle, #ffd966, #c8922a);
    pointer-events: none;
    z-index: 9998;
    transform-origin: center;
    animation: sparkFly 0.6s ease-out forwards;
    --dx: ${Math.cos(angle * Math.PI/180) * distance}px;
    --dy: ${Math.sin(angle * Math.PI/180) * distance}px;
  `;
  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 600);
}

// Добавляем @keyframes для искр
const sparkStyle = document.createElement('style');
sparkStyle.textContent = `
  @keyframes sparkFly {
    0%   { opacity: 1; transform: translate(0, 0) scale(1); }
    100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.2); }
  }
`;
document.head.appendChild(sparkStyle);

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastTrailTime < 60) return; // throttle
    lastTrailTime = now;
    if (Math.random() > 0.6) createSpark(e.clientX, e.clientY);
  });
}

/* ── EASTER EGG: KONAMI CODE ─────────────── */
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
document.addEventListener('keydown', e => {
  if (e.key === konami[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === konami.length) {
      const gemInner = document.querySelector('.hero-gem .gem-inner');
      if (gemInner) {
        gemInner.style.background = 'linear-gradient(135deg,#ff6b9d,#c44dff,#4d94ff,#ff6b9d)';
        gemInner.style.transform  = 'scale(1.4) rotate(360deg)';
        gemInner.style.transition = 'all 1s ease';
        gemInner.style.boxShadow  = '0 0 60px #c44dff, 0 0 120px rgba(196,77,255,0.4)';
        setTimeout(() => {
          gemInner.style.transform  = '';
          gemInner.style.background = '';
          gemInner.style.boxShadow  = '';
        }, 3000);
      }
      konamiIdx = 0;
    }
  } else {
    konamiIdx = e.key === konami[0] ? 1 : 0;
  }
});

console.log('%cRaidGuide.pro v2.0 — Dark Fantasy Edition ✓', 'color:#c8922a; font-size:15px; font-weight:bold;');
console.log('%c⚔ Введи код Konami для сюрприза! ⚔', 'color:#8b1a1a; font-size:12px;');
