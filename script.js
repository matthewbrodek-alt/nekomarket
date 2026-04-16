window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.add('page-loaded');
    }, 1200);
  }
});

/* ── ВИДЕО: Надёжный запуск ─────────────────────────────── */
const bgVideo = document.getElementById('bgVideo');
const bgVideoWrap = document.getElementById('bgVideoWrap');

function tryPlayVideo() {
  if (!bgVideo) return;

  bgVideo.muted = true;
  bgVideo.loop = true;
  bgVideo.playsInline = true;

  if (bgVideoWrap) bgVideoWrap.style.display = 'block';

  const playPromise = bgVideo.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.info('%c🎬 Видео запущено ✓', 'color:#c8922a;');
      })
      .catch(() => {
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tryPlayVideo);
} else {
  tryPlayVideo();
}
window.addEventListener('load', () => setTimeout(tryPlayVideo, 300));

/* ── ЯЗЫК: RU / EN ──────────────────────────────────────── */
const html = document.documentElement;
const langToggle = document.getElementById('langToggle');
const langLabel  = document.getElementById('langLabel');
let currentLang = localStorage.getItem('rg-lang') || 'ru';

function applyLang(lang) {
  html.setAttribute('data-lang', lang);
  langLabel && (langLabel.textContent = lang.toUpperCase());
  document.title = lang === 'ru'
    ? 'RaidGuide.pro — Гайды по Raid: Shadow Legends'
    : 'RaidGuide.pro — Raid: Shadow Legends Guides';

  document.querySelectorAll('[data-ru]').forEach(el => {
    const txt = el.getAttribute('data-' + lang);
    if (txt) el.textContent = txt;
  });

  const burger = document.getElementById('burger');
  if (burger) burger.setAttribute('aria-label', lang === 'ru' ? 'Меню' : 'Menu');

  localStorage.setItem('rg-lang', lang);
}

document.addEventListener('DOMContentLoaded', () => applyLang(currentLang));

langToggle && langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'ru' ? 'en' : 'ru';
  applyLang(currentLang);
});

/* ── НАВИГАЦИЯ: BURGER ──────────────────────────────────── */
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

/* ── СКРОЛЛ: nav scrolled + progress ───────────────────── */
const scrollProgress = document.getElementById('scrollProgress');
const scrollTopBtn   = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;

  topnav && topnav.classList.toggle('scrolled', y > 50);

  if (scrollProgress) {
    scrollProgress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }

  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', y > 400);
  }
});

scrollTopBtn && scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── INTERSECTION OBSERVER — секции ────────────────────── */
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

/* ── АКТИВНЫЙ NAV ПО СКРОЛЛУ ────────────────────────────── */
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

/* ── SMOOTH SCROLL ──────────────────────────────────────── */
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

/* ── SCROLL KILLER: ПАРАЛЛАКС БАННЕР ───────────────────── */
const parallaxBanner = document.getElementById('parallaxBanner');

function handleParallax() {
  if (!parallaxBanner) return;
  const bannerRect = parallaxBanner.getBoundingClientRect();
  const windowH = window.innerHeight;

  const centerOffset = (bannerRect.top + bannerRect.height / 2) - windowH / 2;
  const progress = centerOffset / windowH;

  const runes = parallaxBanner.querySelector('.parallax-runes');
  const text  = parallaxBanner.querySelector('.parallax-text');
  const glow  = parallaxBanner.querySelector('.parallax-glow');

  if (runes) {
    runes.style.transform = 'translateY(' + (progress * 60) + 'px)';
    runes.style.opacity = Math.max(0.02, 0.06 - Math.abs(progress) * 0.08);
  }
  if (text) {
    text.style.transform = 'translateY(' + (progress * -20) + 'px)';
  }
  if (glow) {
    glow.style.transform = 'translateY(' + (progress * 30) + 'px) scale(' + (1 + Math.abs(progress) * 0.3) + ')';
  }
}

function handleHeroParallax() {
  const y = window.scrollY;
  const heroH = window.innerHeight;
  const progress = Math.min(y / heroH, 1);

  document.querySelectorAll('.rune-float').forEach((rune, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    const speed = 0.3 + i * 0.08;
    rune.style.transform = 'translateY(' + (-progress * 80 * speed * dir) + 'px)';
  });

  const gemInner = document.querySelector('.gem-inner');
  if (gemInner) {
    gemInner.style.transform = 'scale(' + (1 - progress * 0.1) + ') translateY(' + (progress * -20) + 'px)';
  }

  document.querySelectorAll('.orbit-ring').forEach((ring, i) => {
    ring.style.transform = 'rotate(' + (progress * 30 * (i + 1)) + 'deg)';
  });
}

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

/* ── CANVAS: АНИМИРОВАННЫЕ РУНЫ ФОН ────────────────────── */
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
      ctx.font = p.size + 'px serif';
      ctx.fillText(p.rune, p.x, p.y);
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
initRuneCanvas();

/* ── АНИМАЦИЯ КАРТОЧЕК ЧЕМПИОНОВ ────────────────────────── */
document.querySelectorAll('.champ-card').forEach(card => {
  const icon = card.querySelector('.champ-icon');
  card.addEventListener('mouseenter', () => {
    if (icon) icon.style.transform = 'rotate(-8deg) scale(1.15)';
  });
  card.addEventListener('mouseleave', () => {
    if (icon) icon.style.transform = '';
  });
});

/* ── PROMO STRIP: пауза при наведении ──────────────────── */
const promoTrack = document.querySelector('.promo-track');
if (promoTrack) {
  promoTrack.addEventListener('mouseenter', () => {
    promoTrack.style.animationPlayState = 'paused';
  });
  promoTrack.addEventListener('mouseleave', () => {
    promoTrack.style.animationPlayState = 'running';
  });
}

/* ── СЧЁТЧИК АНИМАЦИИ hero-stats ───────────────────────── */
function animateCounter(el, target, duration) {
  let start = null;
  const suffix = el.dataset.suffix || '';
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
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

/* ── TOOLTIP НА GUIDE-LINK / FACTION-LINK ───────────────── */
document.querySelectorAll('.guide-link, .faction-link').forEach(link => {
  link.addEventListener('mouseenter', () => {
    const text = link.textContent.trim().replace(/🔥|NEW/g, '').trim();
    link.title = text;
  });
});

/* ── CURSOR TRAIL (только десктоп) ─────────────────────── */
let lastTrailTime = 0;

function createSpark(x, y) {
  const spark = document.createElement('div');
  const size = 3 + Math.random() * 5;
  const angle = Math.random() * 360;
  const distance = 20 + Math.random() * 30;

  spark.style.cssText =
    'position:fixed;' +
    'left:' + x + 'px;top:' + y + 'px;' +
    'width:' + size + 'px;height:' + size + 'px;' +
    'border-radius:50%;' +
    'background:radial-gradient(circle,#ffd966,#c8922a);' +
    'pointer-events:none;z-index:9998;' +
    'transform-origin:center;' +
    'animation:sparkFly 0.6s ease-out forwards;' +
    '--dx:' + (Math.cos(angle * Math.PI / 180) * distance) + 'px;' +
    '--dy:' + (Math.sin(angle * Math.PI / 180) * distance) + 'px;';
  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 600);
}

const sparkStyle = document.createElement('style');
sparkStyle.textContent =
  '@keyframes sparkFly {' +
  '0%{opacity:1;transform:translate(0,0) scale(1);}' +
  '100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0.2);}' +
  '}';
document.head.appendChild(sparkStyle);

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastTrailTime < 60) return;
    lastTrailTime = now;
    if (Math.random() > 0.6) createSpark(e.clientX, e.clientY);
  });
}

/* ── EASTER EGG: KONAMI CODE ────────────────────────────── */
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

/* ══════════════════════════════════════════════════════════
   ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ — КНОПКИ В LINKS-GRID И ФРАКЦИЯХ
   Вместо перехода по внешним href кнопки открывают
   внутренний оверлей с контентом страницы
   ══════════════════════════════════════════════════════════ */
const pageOverlay      = document.getElementById('pageOverlay');
const pageOverlayClose = document.getElementById('pageOverlayClose');
const pageOverlayIcon  = document.getElementById('pageOverlayIcon');
const pageOverlayTitle = document.getElementById('pageOverlayTitle');
const pageOverlayContent = document.getElementById('pageOverlayContent');

/* Контент страниц по идентификатору data-page */
const PAGE_CONTENT = {
  /* ── НОВОМУ ИГРОКУ ─────────────────────── */
  'new-player-promo-link-generator': {
    title_ru: 'Генератор ссылок для новичков',
    title_en: 'New Player Link Generator',
    icon: 'fa-link',
    content_ru: '<p>Здесь будет контент страницы «Генератор ссылок для новичков».</p>',
    content_en: '<p>New Player Link Generator page content goes here.</p>',
  },
  'new-player-guide': {
    title_ru: 'Начало игры в Raid',
    title_en: 'Getting Started in Raid',
    icon: 'fa-book-open',
    content_ru: '<p>Здесь будет контент страницы «Начало игры в Raid».</p>',
    content_en: '<p>Getting Started in Raid page content goes here.</p>',
  },
  'guide-to-affinity': {
    title_ru: 'Руководство по аффинити',
    title_en: 'Guide to Affinity',
    icon: 'fa-yin-yang',
    content_ru: '<p>Здесь будет контент страницы «Руководство по аффинити».</p>',
    content_en: '<p>Guide to Affinity page content goes here.</p>',
  },
  'champion-ascension': {
    title_ru: 'Вознесение чемпионов',
    title_en: 'Champion Ascension',
    icon: 'fa-arrow-up-right-dots',
    content_ru: '<p>Здесь будет контент страницы «Вознесение чемпионов».</p>',
    content_en: '<p>Champion Ascension page content goes here.</p>',
  },
  'buffs-debuffs': {
    title_ru: 'Баффы и дебаффы',
    title_en: 'Buffs and Debuffs',
    icon: 'fa-wand-sparkles',
    content_ru: '<p>Здесь будет контент страницы «Баффы и дебаффы».</p>',
    content_en: '<p>Buffs and Debuffs page content goes here.</p>',
  },
  'who-to-60': {
    title_ru: 'Кого прокачать до 60?',
    title_en: 'Who should I 60 next?',
    icon: 'fa-medal',
    content_ru: '<p>Здесь будет контент страницы «Кого прокачать до 60».</p>',
    content_en: '<p>Who to 60 next page content goes here.</p>',
  },
  'daily-login-champions': {
    title_ru: 'Ежедневные чемпионы входа',
    title_en: 'Daily Login Champions',
    icon: 'fa-calendar-check',
    content_ru: '<p>Здесь будет контент страницы «Ежедневные чемпионы входа».</p>',
    content_en: '<p>Daily Login Champions page content goes here.</p>',
  },
  'arbiter-missions': {
    title_ru: 'Миссии Арбитра',
    title_en: 'Arbiter Missions',
    icon: 'fa-chess-knight',
    content_ru: '<p>Здесь будет контент страницы «Миссии Арбитра».</p>',
    content_en: '<p>Arbiter Missions page content goes here.</p>',
  },
  'ramantu-missions': {
    title_ru: 'Миссии Рамантуша',
    title_en: 'Ramantu Missions',
    icon: 'fa-r',
    content_ru: '<p>Здесь будет контент страницы «Миссии Рамантуша».</p>',
    content_en: '<p>Ramantu Missions page content goes here.</p>',
  },
  'marius-missions': {
    title_ru: 'Миссии Мариуса',
    title_en: 'Marius Missions',
    icon: 'fa-m',
    content_ru: '<p>Здесь будет контент страницы «Миссии Мариуса».</p>',
    content_en: '<p>Marius Missions page content goes here.</p>',
  },
  'promo-codes': {
    title_ru: 'Промо-коды',
    title_en: 'Promo Codes',
    icon: 'fa-tag',
    content_ru: '<p>Здесь будет контент страницы «Промо-коды».</p>',
    content_en: '<p>Promo Codes page content goes here.</p>',
  },

  /* ── ГАЙДЫ ─────────────────────────────── */
  'tier-list': {
    title_ru: 'Tier-лист чемпионов',
    title_en: 'Champion Tier List',
    icon: 'fa-trophy',
    content_ru: '<p>Здесь будет контент страницы «Tier-лист чемпионов».</p>',
    content_en: '<p>Champion Tier List page content goes here.</p>',
  },
  'faction-wars-tier-list': {
    title_ru: 'Tier-листы по Войне фракций',
    title_en: 'Faction Wars Tier Lists',
    icon: 'fa-shield-halved',
    content_ru: '<p>Здесь будет контент страницы «Tier-листы по Войне фракций».</p>',
    content_en: '<p>Faction Wars Tier Lists page content goes here.</p>',
  },
  'blessings-tier-list': {
    title_ru: 'Tier-лист благословений',
    title_en: 'Blessings Tier List',
    icon: 'fa-star',
    content_ru: '<p>Здесь будет контент страницы «Tier-лист благословений».</p>',
    content_en: '<p>Blessings Tier List page content goes here.</p>',
  },
  'blessings-team-builder': {
    title_ru: 'Конструктор команды благословений',
    title_en: 'Blessings Team Builder',
    icon: 'fa-users',
    content_ru: '<p>Здесь будет контент страницы «Конструктор команды благословений».</p>',
    content_en: '<p>Blessings Team Builder page content goes here.</p>',
  },
  'relic-tier-list': {
    title_ru: 'Tier-лист реликвий',
    title_en: 'Relic Tier List',
    icon: 'fa-gem',
    content_ru: '<p>Здесь будет контент страницы «Tier-лист реликвий».</p>',
    content_en: '<p>Relic Tier List page content goes here.</p>',
  },
  'artifact-tier-list': {
    title_ru: 'Tier-листы артефактов',
    title_en: 'Artifact Tier Lists',
    icon: 'fa-shield',
    content_ru: '<p>Здесь будет контент страницы «Tier-листы артефактов».</p>',
    content_en: '<p>Artifact Tier Lists page content goes here.</p>',
  },
  'guaranteed-champion-summons': {
    title_ru: 'Прошлые гарантированные чемпионы',
    title_en: 'Past Guaranteed Champions',
    icon: 'fa-hourglass-half',
    content_ru: '<p>Здесь будет контент страницы «Прошлые гарантированные чемпионы».</p>',
    content_en: '<p>Past Guaranteed Champions page content goes here.</p>',
  },
  'champion-fusions': {
    title_ru: 'Прошлые Fusion-события',
    title_en: 'Past Fusion Events',
    icon: 'fa-calendar-days',
    content_ru: '<p>Здесь будет контент страницы «Прошлые Fusion-события».</p>',
    content_en: '<p>Past Fusion Events page content goes here.</p>',
  },
  'preparing-for-fusion': {
    title_ru: 'Подготовка к Fusion',
    title_en: 'Preparing for Fusions',
    icon: 'fa-object-group',
    content_ru: '<p>Здесь будет контент страницы «Подготовка к Fusion».</p>',
    content_en: '<p>Preparing for Fusions page content goes here.</p>',
  },
  'defining-progress': {
    title_ru: 'Определи свой прогресс',
    title_en: 'Defining Your Progress',
    icon: 'fa-chart-line',
    content_ru: '<p>Здесь будет контент страницы «Определи свой прогресс».</p>',
    content_en: '<p>Defining Your Progress page content goes here.</p>',
  },

  /* ── ПОДЗЕМЕЛЬЯ ─────────────────────────── */
  'clan-boss-guide': {
    title_ru: 'Гайд по Клан-Боссу',
    title_en: 'Guide to Clan Boss',
    icon: 'fa-skull',
    content_ru: '<p>Здесь будет контент страницы «Гайд по Клан-Боссу».</p>',
    content_en: '<p>Clan Boss Guide page content goes here.</p>',
  },
  'chimera-guide': {
    title_ru: 'Гайд по Химере',
    title_en: 'Guide to Chimera Boss',
    icon: 'fa-dragon',
    content_ru: '<p>Здесь будет контент страницы «Гайд по Химере».</p>',
    content_en: '<p>Chimera Boss Guide page content goes here.</p>',
  },
  'speed-tuned-team': {
    title_ru: 'Speed-тюн команды',
    title_en: 'Speed Tuned Team',
    icon: 'fa-gauge-high',
    content_ru: '<p>Здесь будет контент страницы «Speed-тюн команды».</p>',
    content_en: '<p>Speed Tuned Team page content goes here.</p>',
  },
  'dragon-dungeon': {
    title_ru: 'Дракон (подземелье)',
    title_en: 'Dragon Dungeon',
    icon: 'fa-fire',
    content_ru: '<p>Здесь будет контент страницы «Дракон».</p>',
    content_en: '<p>Dragon Dungeon page content goes here.</p>',
  },
  'fire-knight': {
    title_ru: 'Огненный Рыцарь',
    title_en: 'Fire-Knight',
    icon: 'fa-fire-flame-curved',
    content_ru: '<p>Здесь будет контент страницы «Огненный Рыцарь».</p>',
    content_en: '<p>Fire-Knight page content goes here.</p>',
  },
  'spider-dungeon': {
    title_ru: 'Паучья Королева',
    title_en: 'Spider Dungeon',
    icon: 'fa-spider',
    content_ru: '<p>Здесь будет контент страницы «Паучья Королева».</p>',
    content_en: '<p>Spider Dungeon page content goes here.</p>',
  },
  'ice-golem': {
    title_ru: 'Ледяной Голем',
    title_en: 'Ice Golem',
    icon: 'fa-snowflake',
    content_ru: '<p>Здесь будет контент страницы «Ледяной Голем».</p>',
    content_en: '<p>Ice Golem page content goes here.</p>',
  },
  'minotaur': {
    title_ru: 'Минотавр',
    title_en: 'Minotaur',
    icon: 'fa-horse',
    content_ru: '<p>Здесь будет контент страницы «Минотавр».</p>',
    content_en: '<p>Minotaur page content goes here.</p>',
  },
  'iron-twins': {
    title_ru: 'Железные Близнецы',
    title_en: 'Iron Twins',
    icon: 'fa-people-group',
    content_ru: '<p>Здесь будет контент страницы «Железные Близнецы».</p>',
    content_en: '<p>Iron Twins page content goes here.</p>',
  },
  'phantom-grove': {
    title_ru: 'Призрачная Роща',
    title_en: 'Phantom Grove',
    icon: 'fa-torii-gate',
    content_ru: '<p>Здесь будет контент страницы «Призрачная Роща».</p>',
    content_en: '<p>Phantom Grove page content goes here.</p>',
  },
  'sand-devil': {
    title_ru: 'Песчаный Дьявол',
    title_en: 'Sand Devil',
    icon: 'fa-sun',
    content_ru: '<p>Здесь будет контент страницы «Песчаный Дьявол».</p>',
    content_en: '<p>Sand Devil page content goes here.</p>',
  },
  'event-dungeon': {
    title_ru: 'Событийное подземелье',
    title_en: 'Event Dungeon',
    icon: 'fa-calendar-star',
    content_ru: '<p>Здесь будет контент страницы «Событийное подземелье».</p>',
    content_en: '<p>Event Dungeon page content goes here.</p>',
  },

  /* ── ФРАКЦИИ ─────────────────────────────── */
  'faction-banner-lords': {
    title_ru: 'Банереты',
    title_en: 'Banner Lords',
    iconImg: 'faction/icon1.png',
    content_ru: '<p>Здесь будет контент страницы «Знаменосцы».</p>',
    content_en: '<p>Banner Lords page content goes here.</p>',
  },
  'faction-high-elves': {
    title_ru: 'Высшие Эльфы',
    title_en: 'High Elves',
    iconImg: 'faction/icon2.png',
    content_ru: '<p>Здесь будет контент страницы «Высшие Эльфы».</p>',
    content_en: '<p>High Elves page content goes here.</p>',
  },
  'faction-sacred-order': {
    title_ru: 'Священный Орден',
    title_en: 'Sacred Order',
    iconImg: 'faction/icon3.png',
    content_ru: '<p>Здесь будет контент страницы «Священный Орден».</p>',
    content_en: '<p>Sacred Order page content goes here.</p>',
  },
  'faction-barbarians': {
    title_ru: 'Варвары',
    title_en: 'Barbarians',
    iconImg: 'faction/icon4.png',
    content_ru: '<p>Здесь будет контент страницы «Варвары».</p>',
    content_en: '<p>Barbarians page content goes here.</p>',
  },
  'faction-ogryn-tribes': {
    title_ru: 'Племена Огринов',
    title_en: 'Ogryn Tribes',
    iconImg: 'faction/icon5.png',
    content_ru: '<p>Здесь будет контент страницы «Племена Огрынов».</p>',
    content_en: '<p>Ogryn Tribes page content goes here.</p>',
  },
  'faction-lizardmen': {
    title_ru: 'Ящеролюди',
    title_en: 'Lizardmen',
    iconImg: 'faction/icon6.png',
    content_ru: '<p>Здесь будет контент страницы «Ящеролюди».</p>',
    content_en: '<p>Lizardmen page content goes here.</p>',
  },
  'faction-skinwalkers': {
    title_ru: 'Оборотни',
    title_en: 'Skinwalkers',
    iconImg: 'faction/icon7.png',
    content_ru: '<p>Здесь будет контент страницы «Скинволкеры».</p>',
    content_en: '<p>Skinwalkers page content goes here.</p>',
  },
  'faction-orcs': {
    title_ru: 'Орки',
    title_en: 'Orcs',
    iconImg: 'faction/icon8.png',
    content_ru: '<p>Здесь будет контент страницы «Орки».</p>',
    content_en: '<p>Orcs page content goes here.</p>',
  },
  'faction-demonspawn': {
    title_ru: 'Демоны',
    title_en: 'Demonspawn',
    iconImg: 'faction/icon9.png',
    content_ru: '<p>Здесь будет контент страницы «Отродья Демонов».</p>',
    content_en: '<p>Demonspawn page content goes here.</p>',
  },
  'faction-undead-hordes': {
    title_ru: 'Орды нежети',
    title_en: 'Undead Hordes',
    iconImg: 'faction/icon10.png',
    content_ru: '<p>Здесь будет контент страницы «Нежить».</p>',
    content_en: '<p>Undead Hordes page content goes here.</p>',
  },
  'faction-dark-elves': {
    title_ru: 'Тёмные Эльфы',
    title_en: 'Dark Elves',
    iconImg: 'faction/icon11.png',
    content_ru: '<p>Здесь будет контент страницы «Тёмные Эльфы».</p>',
    content_en: '<p>Dark Elves page content goes here.</p>',
  },
  'faction-knights-revenant': {
    title_ru: 'Отступники',
    title_en: 'Knights Revenant',
    iconImg: 'faction/icon12.png',
    content_ru: '<p>Здесь будет контент страницы «Рыцари Ревенанты».</p>',
    content_en: '<p>Knights Revenant page content goes here.</p>',
  },
  'faction-dwarves': {
    title_ru: 'Гномы',
    title_en: 'Dwarves',
    iconImg: 'faction/icon13.png',
    content_ru: '<p>Здесь будет контент страницы «Дварфы».</p>',
    content_en: '<p>Dwarves page content goes here.</p>',
  },
  'faction-shadowkin': {
    title_ru: 'Войны сумрака',
    title_en: 'Shadowkin',
    iconImg: 'faction/icon14.png',
    content_ru: '<p>Здесь будет контент страницы «Теневой Народ».</p>',
    content_en: '<p>Shadowkin page content goes here.</p>',
  },
  'faction-sylvan-watchers': {
    title_ru: 'Духи леса',
    title_en: 'Sylvan Watchers',
    iconImg: 'faction/icon15.png',
    content_ru: '<p>Здесь будет контент страницы «Лесные Стражи».</p>',
    content_en: '<p>Sylvan Watchers page content goes here.</p>',
  },
  'faction-argonites': {
    title_ru: 'Аргониты',
    title_en: 'Argonites',
    iconImg: 'faction/icon16.png',
    content_ru: '<p>Здесь будет контент страницы «Аргониты».</p>',
    content_en: '<p>Argonites page content goes here.</p>',
  },

  /* ── БАШНЯ РОКА ─────────────────────────── */
  'doom-tower-guide': {
    title_ru: 'Гайд по Башне Рока',
    title_en: 'Doom Tower Guide',
    icon: 'fa-tower-observation',
    content_ru: '<p>Здесь будет контент страницы «Гайд по Башне Рока».</p>',
    content_en: '<p>Doom Tower Guide page content goes here.</p>',
  },
  'doom-tower-rotations': {
    title_ru: 'Ротации Башни Рока',
    title_en: 'Doom Tower Rotations',
    icon: 'fa-rotate',
    content_ru: '<p>Здесь будет контент страницы «Ротации Башни Рока».</p>',
    content_en: '<p>Doom Tower Rotations page content goes here.</p>',
  },
  'doom-tower-secret-rooms': {
    title_ru: 'Секретные комнаты',
    title_en: 'Secret Rooms',
    icon: 'fa-door-open',
    content_ru: '<p>Здесь будет контент страницы «Секретные комнаты».</p>',
    content_en: '<p>Secret Rooms page content goes here.</p>',
  },
  'doom-tower-bosses': {
    title_ru: 'Боссы Башни Рока',
    title_en: 'Doom Tower Bosses',
    icon: 'fa-skull',
    content_ru: '<p>Здесь будет контент страницы «Боссы Башни Рока».</p>',
    content_en: '<p>Doom Tower Bosses page content goes here.</p>',
  },
  'doom-tower-artifact-sets': {
    title_ru: 'Сеты артефактов Башни',
    title_en: 'Doom Tower Artifact Sets',
    icon: 'fa-shield',
    content_ru: '<p>Здесь будет контент страницы «Сеты артефактов Башни».</p>',
    content_en: '<p>Doom Tower Artifact Sets page content goes here.</p>',
  },

  /* ── ГИДРА ──────────────────────────────── */
  'hydra-guide': {
    title_ru: 'Гайд по Гидре',
    title_en: 'Hydra Clan Boss Guide',
    icon: 'fa-skull',
    content_ru: '<p>Здесь будет контент страницы «Гайд по Гидре».</p>',
    content_en: '<p>Hydra Clan Boss Guide page content goes here.</p>',
  },
  'hydra-getting-started': {
    title_ru: 'Первые шаги с Гидрой',
    title_en: 'Getting Started With Hydra',
    icon: 'fa-play',
    content_ru: '<p>Здесь будет контент страницы «Первые шаги с Гидрой».</p>',
    content_en: '<p>Getting Started With Hydra page content goes here.</p>',
  },
  'hydra-heads': {
    title_ru: 'Головы Гидры',
    title_en: 'Hydra Clan Boss Heads',
    icon: 'fa-circle-nodes',
    content_ru: '<p>Здесь будет контент страницы «Головы Гидры».</p>',
    content_en: '<p>Hydra Clan Boss Heads page content goes here.</p>',
  },
  'hydra-rewards': {
    title_ru: 'Награды Гидры',
    title_en: 'Hydra Clan Boss Rewards',
    icon: 'fa-gift',
    content_ru: '<p>Здесь будет контент страницы «Награды Гидры».</p>',
    content_en: '<p>Hydra Clan Boss Rewards page content goes here.</p>',
  },
  'hydra-blessings': {
    title_ru: 'Лучшие благословения для Гидры',
    title_en: 'Best Blessings for Hydra',
    icon: 'fa-star',
    content_ru: '<p>Здесь будет контент страницы «Лучшие благословения для Гидры».</p>',
    content_en: '<p>Best Blessings for Hydra page content goes here.</p>',
  },

  /* ── СИНТРАНОС ──────────────────────────── */
  'sintranos-tour': {
    title_ru: 'Тур по Синтраносу',
    title_en: 'Sintranos Tour Guide',
    icon: 'fa-route',
    content_ru: '<p>Здесь будет контент страницы «Тур по Синтраносу».</p>',
    content_en: '<p>Sintranos Tour Guide page content goes here.</p>',
  },
  'sintranos-normal': {
    title_ru: 'Ограничения (обычный режим)',
    title_en: 'Normal Mode Restrictions',
    icon: 'fa-list-check',
    content_ru: '<p>Здесь будет контент страницы «Ограничения (обычный режим)».</p>',
    content_en: '<p>Normal Mode Restrictions page content goes here.</p>',
  },
  'sintranos-hard': {
    title_ru: 'Ограничения (сложный режим)',
    title_en: 'Hard Mode Restrictions',
    icon: 'fa-triangle-exclamation',
    content_ru: '<p>Здесь будет контент страницы «Ограничения (сложный режим)».</p>',
    content_en: '<p>Hard Mode Restrictions page content goes here.</p>',
  },
  'amius-boss': {
    title_ru: 'Босс Амиус — Лунный Архон',
    title_en: 'Amius the Lunar Archon Boss',
    icon: 'fa-moon',
    content_ru: '<p>Здесь будет контент страницы «Босс Амиус».</p>',
    content_en: '<p>Amius the Lunar Archon Boss page content goes here.</p>',
  },

  /* ── ИНСТРУМЕНТЫ ────────────────────────── */
  'all-tools': {
    title_ru: 'Все инструменты Raid',
    title_en: 'All Raid Tools',
    icon: 'fa-toolbox',
    content_ru: '<p>Здесь будет контент страницы «Все инструменты Raid».</p>',
    content_en: '<p>All Raid Tools page content goes here.</p>',
  },
  'stages-tool': {
    title_ru: 'Инструмент этапов Raid',
    title_en: 'Raid Stages Tool',
    icon: 'fa-map-location-dot',
    content_ru: '<p>Здесь будет контент страницы «Инструмент этапов Raid».</p>',
    content_en: '<p>Raid Stages Tool page content goes here.</p>',
  },
  'pack-offer-calculator': {
    title_ru: 'Калькулятор акционных предложений',
    title_en: 'Pack Offer Calculator',
    icon: 'fa-box-open',
    content_ru: '<p>Здесь будет контент страницы «Калькулятор акционных предложений».</p>',
    content_en: '<p>Pack Offer Calculator page content goes here.</p>',
  },
  'clan-vs-clan-calculator': {
    title_ru: 'Калькулятор Клан vs Клан',
    title_en: 'Clan vs Clan Calculator',
    icon: 'fa-users-between-lines',
    content_ru: '<p>Здесь будет контент страницы «Калькулятор Клан vs Клан».</p>',
    content_en: '<p>Clan vs Clan Calculator page content goes here.</p>',
  },
  'ehp-calculator': {
    title_ru: 'Калькулятор EHP',
    title_en: 'EHP Efficiency Calculator',
    icon: 'fa-shield-virus',
    content_ru: '<p>Здесь будет контент страницы «Калькулятор EHP».</p>',
    content_en: '<p>EHP Efficiency Calculator page content goes here.</p>',
  },
  'damage-efficiency': {
    title_ru: 'Эффективность урона',
    title_en: 'Damage Efficiency Tool',
    icon: 'fa-chart-bar',
    content_ru: '<p>Здесь будет контент страницы «Эффективность урона».</p>',
    content_en: '<p>Damage Efficiency Tool page content goes here.</p>',
  },
  'clan-boss-chest-simulator': {
    title_ru: 'Симулятор сундука Клан-Босса',
    title_en: 'Clan Boss Chest Simulator',
    icon: 'fa-treasure-chest',
    content_ru: '<p>Здесь будет контент страницы «Симулятор сундука Клан-Босса».</p>',
    content_en: '<p>Clan Boss Chest Simulator page content goes here.</p>',
  },
};

/* Открытие оверлея */
function openPage(pageId) {
  const data = PAGE_CONTENT[pageId];
  if (!data || !pageOverlay) return;

  const lang = currentLang || 'ru';
  const titleKey = 'title_' + lang;
  const contentKey = 'content_' + lang;

  pageOverlayTitle.textContent = data[titleKey] || data.title_ru || '';
  pageOverlayContent.innerHTML = data[contentKey] || data.content_ru || '';

  if (data.iconImg) {
    pageOverlayIcon.innerHTML = '<img src="' + data.iconImg + '" alt="">';
  } else {
    pageOverlayIcon.innerHTML = '<i class="fa-solid ' + (data.icon || 'fa-scroll') + '"></i>';
  }

  pageOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* Закрытие оверлея */
function closePage() {
  if (!pageOverlay) return;
  pageOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* Вешаем обработчики на все кнопки с data-page */
document.querySelectorAll('[data-page]').forEach(btn => {
  btn.addEventListener('click', () => {
    openPage(btn.getAttribute('data-page'));
  });
});

/* Закрыть по крестику */
pageOverlayClose && pageOverlayClose.addEventListener('click', closePage);

/* Закрыть по клику на фон */
pageOverlay && pageOverlay.addEventListener('click', e => {
  if (e.target === pageOverlay) closePage();
});

/* Закрыть по Escape */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePage();
});

console.log('%cRaidGuide.pro v2.0 — Dark Fantasy Edition ✓', 'color:#c8922a; font-size:15px; font-weight:bold;');
console.log('%c⚔ Введи код Konami для сюрприза! ⚔', 'color:#8b1a1a; font-size:12px;');
