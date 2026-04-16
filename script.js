/* ═══════════════════════════════════════════════════════════
   RaidGuide.pro — script.js
   Без внешних библиотек | Тёмная тема | Hash-routing
   ═══════════════════════════════════════════════════════════ */

/* ── ПРЕЛОАДЕР ──────────────────────────────────────────── */
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
const bgVideo    = document.getElementById('bgVideo');
const bgVideoWrap = document.getElementById('bgVideoWrap');

function tryPlayVideo() {
  if (!bgVideo) return;
  bgVideo.muted = true;
  bgVideo.loop  = true;
  bgVideo.playsInline = true;
  if (bgVideoWrap) bgVideoWrap.style.display = 'block';
  const p = bgVideo.play();
  if (p !== undefined) {
    p.catch(() => {
      const unlock = () => {
        bgVideo.play().catch(() => {});
        document.removeEventListener('click',      unlock);
        document.removeEventListener('touchstart', unlock);
        document.removeEventListener('keydown',    unlock);
      };
      document.addEventListener('click',      unlock);
      document.addEventListener('touchstart', unlock);
      document.addEventListener('keydown',    unlock);
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
const html       = document.documentElement;
const langToggle = document.getElementById('langToggle');
const langLabel  = document.getElementById('langLabel');
let currentLang  = localStorage.getItem('rg-lang') || 'ru';

function applyLang(lang) {
  html.setAttribute('data-lang', lang);
  if (langLabel) langLabel.textContent = lang.toUpperCase();
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
if (langToggle) {
  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    applyLang(currentLang);
  });
}

/* ── НАВИГАЦИЯ: BURGER ──────────────────────────────────── */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const topnav   = document.getElementById('topnav');

if (burger) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = burger.querySelectorAll('span');
    const open  = navLinks.classList.contains('open');
    spans[0].style.transform = open ? 'translateY(7px) rotate(45deg)'  : '';
    spans[1].style.opacity   = open ? '0' : '1';
    spans[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
    burger.setAttribute('aria-expanded', open);
  });
}
if (navLinks) {
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      if (burger) {
        const spans = burger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '1';
        spans[2].style.transform = '';
        burger.setAttribute('aria-expanded', false);
      }
    });
  });
}

/* ── СКРОЛЛ: nav scrolled + progress ───────────────────── */
const scrollProgress = document.getElementById('scrollProgress');
const scrollTopBtn   = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (topnav) topnav.classList.toggle('scrolled', y > 50);
  if (scrollProgress) scrollProgress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  if (scrollTopBtn)   scrollTopBtn.classList.toggle('visible', y > 400);
});
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── INTERSECTION OBSERVER — секции ────────────────────── */
const io = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  }),
  { threshold: 0.08 }
);
document.querySelectorAll('.section').forEach(s => io.observe(s));

/* ── АКТИВНЫЙ NAV ПО СКРОЛЛУ ────────────────────────────── */
const navAnchors = document.querySelectorAll('.nav-link[href^="#"]');
const sectionEls = [];
navAnchors.forEach(a => {
  const el = document.getElementById(a.getAttribute('href').slice(1));
  if (el) sectionEls.push({ link: a, el });
});
const activeObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    const match = sectionEls.find(s => s.el === e.target);
    if (match && e.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active-nav'));
      match.link.classList.add('active-nav');
    }
  }),
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
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

/* ── ПАРАЛЛАКС БАННЕР ───────────────────────────────────── */
const parallaxBanner = document.getElementById('parallaxBanner');
function handleParallax() {
  if (!parallaxBanner) return;
  const rect     = parallaxBanner.getBoundingClientRect();
  const progress = ((rect.top + rect.height / 2) - window.innerHeight / 2) / window.innerHeight;
  const runes = parallaxBanner.querySelector('.parallax-runes');
  const text  = parallaxBanner.querySelector('.parallax-text');
  const glow  = parallaxBanner.querySelector('.parallax-glow');
  if (runes) { runes.style.transform = 'translateY(' + (progress * 60) + 'px)'; runes.style.opacity = Math.max(0.02, 0.06 - Math.abs(progress) * 0.08); }
  if (text)  { text.style.transform  = 'translateY(' + (progress * -20) + 'px)'; }
  if (glow)  { glow.style.transform  = 'translateY(' + (progress * 30) + 'px) scale(' + (1 + Math.abs(progress) * 0.3) + ')'; }
}
function handleHeroParallax() {
  const progress = Math.min(window.scrollY / window.innerHeight, 1);
  document.querySelectorAll('.rune-float').forEach((rune, i) => {
    rune.style.transform = 'translateY(' + (-progress * 80 * (0.3 + i * 0.08) * (i % 2 === 0 ? 1 : -1)) + 'px)';
  });
  const gemInner = document.querySelector('.gem-inner');
  if (gemInner) gemInner.style.transform = 'scale(' + (1 - progress * 0.1) + ') translateY(' + (progress * -20) + 'px)';
  document.querySelectorAll('.orbit-ring').forEach((ring, i) => {
    ring.style.transform = 'rotate(' + (progress * 30 * (i + 1)) + 'deg)';
  });
}
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => { handleParallax(); handleHeroParallax(); ticking = false; });
    ticking = true;
  }
});

/* ── CANVAS: АНИМИРОВАННЫЕ РУНЫ ────────────────────────── */
function initRuneCanvas() {
  const canvas = document.getElementById('runeCanvas');
  if (!canvas) return;
  const ctx   = canvas.getContext('2d');
  const RUNES = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ'];
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  const particles = Array.from({ length: 28 }, () => ({
    x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
    rune: RUNES[Math.floor(Math.random() * RUNES.length)],
    speed: 0.15 + Math.random() * 0.25, size: 14 + Math.random() * 16,
    alpha: 0.2 + Math.random() * 0.5, drift: (Math.random() - 0.5) * 0.3,
    phase: Math.random() * Math.PI * 2,
  }));
  function animate(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#c8922a';
    particles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift + Math.sin(t * 0.001 + p.phase) * 0.2;
      if (p.y < -30) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; p.rune = RUNES[Math.floor(Math.random() * RUNES.length)]; }
      ctx.globalAlpha = p.alpha * (0.5 + Math.sin(t * 0.002 + p.phase) * 0.5);
      ctx.font = p.size + 'px serif';
      ctx.fillText(p.rune, p.x, p.y);
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
initRuneCanvas();

/* ── PROMO STRIP ────────────────────────────────────────── */
const promoTrack = document.querySelector('.promo-track');
if (promoTrack) {
  promoTrack.addEventListener('mouseenter', () => { promoTrack.style.animationPlayState = 'paused'; });
  promoTrack.addEventListener('mouseleave', () => { promoTrack.style.animationPlayState = 'running'; });
}

/* ── СЧЁТЧИК hero-stats ─────────────────────────────────── */
function animateCounter(el, target, duration) {
  let start = null;
  const suffix = el.dataset.suffix || '';
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    [800, 16, 100].forEach((val, i) => {
      const el = document.querySelectorAll('.stat-n')[i];
      if (el) { el.dataset.suffix = ['+', '', '+'][i]; animateCounter(el, val, 1800); }
    });
    heroObserver.disconnect();
  }
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

/* ── CURSOR TRAIL ───────────────────────────────────────── */
let lastTrailTime = 0;
const sparkStyle = document.createElement('style');
sparkStyle.textContent = '@keyframes sparkFly{0%{opacity:1;transform:translate(0,0) scale(1);}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0.2);}}';
document.head.appendChild(sparkStyle);
function createSpark(x, y) {
  const spark = document.createElement('div');
  const size = 3 + Math.random() * 5, angle = Math.random() * 360, dist = 20 + Math.random() * 30;
  spark.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:radial-gradient(circle,#ffd966,#c8922a);pointer-events:none;z-index:9998;animation:sparkFly 0.6s ease-out forwards;--dx:' + (Math.cos(angle * Math.PI / 180) * dist) + 'px;--dy:' + (Math.sin(angle * Math.PI / 180) * dist) + 'px;';
  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 600);
}
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastTrailTime < 60) return;
    lastTrailTime = now;
    if (Math.random() > 0.6) createSpark(e.clientX, e.clientY);
  });
}

/* ── KONAMI CODE ────────────────────────────────────────── */
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let ki = 0;
document.addEventListener('keydown', e => {
  ki = (e.key === konami[ki]) ? ki + 1 : (e.key === konami[0] ? 1 : 0);
  if (ki === konami.length) {
    const g = document.querySelector('.hero-gem .gem-inner');
    if (g) {
      g.style.cssText += 'background:linear-gradient(135deg,#ff6b9d,#c44dff,#4d94ff,#ff6b9d);transform:scale(1.4) rotate(360deg);transition:all 1s ease;box-shadow:0 0 60px #c44dff,0 0 120px rgba(196,77,255,0.4);';
      setTimeout(() => { g.style.background = ''; g.style.transform = ''; g.style.boxShadow = ''; }, 3000);
    }
    ki = 0;
  }
});

/* ══════════════════════════════════════════════════════════
   РОУТИНГ (HASH ROUTING) + ОВЕРЛЕЙ СТРАНИЦ
   URL: index.html#page-faction-banner-lords
   ══════════════════════════════════════════════════════════ */
const pageOverlay       = document.getElementById('pageOverlay');
const pageOverlayClose  = document.getElementById('pageOverlayClose');
const pageOverlayIcon   = document.getElementById('pageOverlayIcon');
const pageOverlayTitle  = document.getElementById('pageOverlayTitle');
const pageOverlayContent = document.getElementById('pageOverlayContent');

/* ─── ВСПОМОГАТЕЛЬНЫЕ БЛОКИ HTML ───────────────────────── */
function infoCard(icon, label, value) {
  return '<div class="pg-card"><span class="pg-card-icon"><i class="fa-solid ' + icon + '"></i></span><span class="pg-card-label">' + label + '</span><span class="pg-card-val">' + value + '</span></div>';
}
function section(title, body) {
  return '<div class="pg-section"><h3 class="pg-h3">' + title + '</h3>' + body + '</div>';
}
function ul(items) {
  return '<ul class="pg-list">' + items.map(i => '<li>' + i + '</li>').join('') + '</ul>';
}
function championTag(name, rarity) {
  const cls = { Legendary: 'pg-tag-leg', Epic: 'pg-tag-epic', Rare: 'pg-tag-rare' }[rarity] || 'pg-tag-rare';
  return '<span class="pg-tag ' + cls + '">' + name + '</span>';
}

/* ═══════════════════════════════════════════════════════════
   КОНТЕНТ СТРАНИЦ
   ═══════════════════════════════════════════════════════════ */
const PAGE_CONTENT = {

  /* ────────────────────────────────────────────────────────
     ФРАКЦИИ
  ──────────────────────────────────────────────────────── */
  'faction-banner-lords': {
    title_ru: 'Знаменосцы (Banner Lords)',
    title_en: 'Banner Lords',
    iconImg: 'faction/icon1.png',
    content_ru: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Тип','Светлая / Нейтральная')}
        ${infoCard('fa-shield-halved','Стиль боя','Атака · Защита')}
        ${infoCard('fa-star','Война Фракций','★★★★☆')}
      </div>
      ${section('О фракции',
        '<p>Знаменосцы — рыцарская фракция Теленерии, защитники королевских знамён. Они известны высоким уровнем защиты, щитовыми способностями и надёжными дебаффами. Многие из них специализируются на ускорении атаки и уменьшении защиты врагов, что делает их универсальными в большинстве видов контента.</p>'
      )}
      ${section('Сильные стороны',
        ul(['Отличные щиты и защитные баффы','Сильные дебаффы: снижение защиты, яд, оглушение','Легко собрать сильную команду из Эпиков','Хорошие варианты для Клан-Босса (Frozen Banshee)','Несколько топовых Легендарных чемпионов (Sethalia, Trunda и др.)'])
      )}
      ${section('Слабые стороны',
        ul(['Дефицит масштабируемых лечильщиков','Война Фракций закрывается с трудом на стадии 21+','Мало чемпионов с «пройти ход» (TM Boost) для начальных игроков'])
      )}
      ${section('Топ чемпионы',
        '<div class="pg-tags">'
        + championTag('Sethalia','Legendary')
        + championTag('Trunda Giltmallet','Legendary')
        + championTag('Versulf the Grim','Legendary')
        + championTag('Ursuga Warcaller','Legendary')
        + championTag('Frozen Banshee','Epic')
        + championTag('Chancellor Yasmin','Epic')
        + championTag('Richtoff the Bold','Epic')
        + championTag('Hordin','Rare')
        + '</div>'
      )}
      ${section('Советы по Войне Фракций',
        ul(['Frozen Banshee — ключ к Клан-Боссу и многим подземельям фракции','Используйте Chancellor Yasmin для поддержки скорости','Трунда Гилтмаллет уничтожает при 100% крите и высокой атаке','Для щита используйте Richtoff the Bold или Chancellor Yasmin'])
      )}
    `,
    content_en: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Type','Light / Neutral')}
        ${infoCard('fa-shield-halved','Combat Style','Attack · Defense')}
        ${infoCard('fa-star','Faction Wars','★★★★☆')}
      </div>
      ${section('About the Faction',
        '<p>Banner Lords are the knightly faction of Teleria, defenders of royal banners. They are known for high defense, shield abilities, and reliable debuffs. Many specialize in attack speed boosts and defense reduction, making them versatile across most content types.</p>'
      )}
      ${section('Strengths',
        ul(['Excellent shields and defensive buffs','Strong debuffs: defense down, poison, stun','Easy to build a strong Epic team','Good Clan Boss options (Frozen Banshee)','Several top Legendary champions (Sethalia, Trunda, etc.)'])
      )}
      ${section('Weaknesses',
        ul(['Lack of scalable healers','Faction Wars is hard to clear 21+','Few TM Boost champions for early game'])
      )}
      ${section('Top Champions',
        '<div class="pg-tags">'
        + championTag('Sethalia','Legendary')
        + championTag('Trunda Giltmallet','Legendary')
        + championTag('Versulf the Grim','Legendary')
        + championTag('Ursuga Warcaller','Legendary')
        + championTag('Frozen Banshee','Epic')
        + championTag('Chancellor Yasmin','Epic')
        + championTag('Richtoff the Bold','Epic')
        + championTag('Hordin','Rare')
        + '</div>'
      )}
      ${section('Faction Wars Tips',
        ul(['Frozen Banshee is key for Clan Boss and many faction dungeons','Use Chancellor Yasmin for speed support','Trunda destroys with 100% crit and high ATK','For shields use Richtoff the Bold or Chancellor Yasmin'])
      )}
    `,
  },

  'faction-high-elves': {
    title_ru: 'Высшие Эльфы (High Elves)',
    title_en: 'High Elves',
    iconImg: 'faction/icon2.png',
    content_ru: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Тип','Светлая')}
        ${infoCard('fa-shield-halved','Стиль боя','Поддержка · Атака')}
        ${infoCard('fa-star','Война Фракций','★★★★★')}
      </div>
      ${section('О фракции',
        '<p>Высшие Эльфы — одна из самых сильных фракций в игре. Они обладают выдающимися чемпионами поддержки, мощными АоЕ-атаками и эффективными способностями контроля. Арбитр является одним из самых желанных чемпионов в игре и относится именно к этой фракции.</p>'
      )}
      ${section('Сильные стороны',
        ul(['Лучший саппорт в игре (Arbiter)','Сильный контроль: заморозка, оглушение, провокация','Отличные варианты для Паука, Дракона и Arena','Arbiter — лучший чемпион для Арены и скоростного контента','Много крепких Эпиков для новичков'])
      )}
      ${section('Слабые стороны',
        ul(['Сильно зависит от Легендарных','Некоторые Рары устарели'])
      )}
      ${section('Топ чемпионы',
        '<div class="pg-tags">'
        + championTag('Arbiter','Legendary')
        + championTag('Lyssandra','Legendary')
        + championTag('Tayrel','Legendary')
        + championTag('Vergis','Legendary')
        + championTag('Rector Drath','Epic')
        + championTag('Elhain','Epic')
        + championTag('Aothar','Epic')
        + '</div>'
      )}
      ${section('Советы по Войне Фракций',
        ul(['Арбитр — абсолютный MVP фракции','Tayrel отлично работает для снижения защиты','Lyssandra незаменима в Arena и ранговых боях','Фракция легко закрывает FW на 21 стадии'])
      )}
    `,
    content_en: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Type','Light')}
        ${infoCard('fa-shield-halved','Combat Style','Support · Attack')}
        ${infoCard('fa-star','Faction Wars','★★★★★')}
      </div>
      ${section('About',
        '<p>High Elves is one of the strongest factions in the game. They boast outstanding support champions, powerful AoE attacks, and effective crowd control abilities. Arbiter is one of the most coveted champions and belongs to this faction.</p>'
      )}
      ${section('Strengths',
        ul(['Best support in the game (Arbiter)','Strong CC: freeze, stun, provoke','Excellent for Spider, Dragon, and Arena','Many solid Epics for beginners'])
      )}
      ${section('Weaknesses',
        ul(['Heavily dependent on Legendaries','Some Rares are outdated'])
      )}
      ${section('Top Champions',
        '<div class="pg-tags">'
        + championTag('Arbiter','Legendary')
        + championTag('Lyssandra','Legendary')
        + championTag('Tayrel','Legendary')
        + championTag('Vergis','Legendary')
        + championTag('Rector Drath','Epic')
        + championTag('Elhain','Epic')
        + '</div>'
      )}
    `,
  },

  'faction-sacred-order': {
    title_ru: 'Священный Орден (Sacred Order)',
    title_en: 'Sacred Order',
    iconImg: 'faction/icon3.png',
    content_ru: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Тип','Светлая')}
        ${infoCard('fa-shield-halved','Стиль боя','Поддержка · Защита')}
        ${infoCard('fa-star','Война Фракций','★★★☆☆')}
      </div>
      ${section('О фракции',
        '<p>Священный Орден — религиозная рыцарская фракция. Их сила — в исцелении, снятии дебаффов и восстановлении команды. Нехватка урона компенсируется надёжной поддержкой и провокацией.</p>'
      )}
      ${section('Сильные стороны',
        ul(['Лучшие лекари среди всех фракций','Снятие дебаффов и щиты','Несколько уникальных Легендарных (Cardiel, Godseeker Aniri)','Сильная провокация через Lordly Legionary'])
      )}
      ${section('Слабые стороны',
        ul(['Мало чемпионов с высоким уроном','FW закрывается тяжелее без Легендарных','Медленный темп для Arena'])
      )}
      ${section('Топ чемпионы',
        '<div class="pg-tags">'
        + championTag('Cardiel','Legendary')
        + championTag('Godseeker Aniri','Legendary')
        + championTag('Deacon Armstrong','Epic')
        + championTag('Dracomorph','Epic')
        + championTag('Rugnor Goldgleam','Epic')
        + championTag('Lordly Legionary','Rare')
        + '</div>'
      )}
    `,
    content_en: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Type','Light')}
        ${infoCard('fa-shield-halved','Combat Style','Support · Defense')}
        ${infoCard('fa-star','Faction Wars','★★★☆☆')}
      </div>
      ${section('About',
        '<p>Sacred Order is a religious knight faction. Their strength lies in healing, debuff cleansing, and team recovery. Lack of damage is offset by reliable support and provoke.</p>'
      )}
      ${section('Top Champions',
        '<div class="pg-tags">'
        + championTag('Cardiel','Legendary')
        + championTag('Godseeker Aniri','Legendary')
        + championTag('Deacon Armstrong','Epic')
        + championTag('Dracomorph','Epic')
        + '</div>'
      )}
    `,
  },

  'faction-barbarians': {
    title_ru: 'Варвары (Barbarians)',
    title_en: 'Barbarians',
    iconImg: 'faction/icon4.png',
    content_ru: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Тип','Нейтральная')}
        ${infoCard('fa-shield-halved','Стиль боя','Атака · Скорость')}
        ${infoCard('fa-star','Война Фракций','★★★★☆')}
      </div>
      ${section('О фракции',
        '<p>Варвары — грубая, но эффективная фракция. Известны высоким уроном, способностями к стелсу и огромными показателями атаки. Кабула считается одним из лучших Легендарных в игре в нескольких категориях контента.</p>'
      )}
      ${section('Сильные стороны',
        ul(['Kabhu — один из лучших DPS во всей игре','Сильные способности «стелс» и антиревайв','Высокий разовый и AoE урон','Хорошая синергия с Гидрой и Башней Рока'])
      )}
      ${section('Слабые стороны',
        ul(['Относительно слабые лекари','FW закрывается тяжело без ключевых Легендарных'])
      )}
      ${section('Топ чемпионы',
        '<div class="pg-tags">'
        + championTag('Kabhu','Legendary')
        + championTag('Rotos the Lost Groom','Legendary')
        + championTag('Tormin the Cold','Legendary')
        + championTag('Soulless','Epic')
        + championTag('Skullcrown','Epic')
        + championTag('Sethallia','Epic')
        + '</div>'
      )}
    `,
    content_en: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Type','Neutral')}
        ${infoCard('fa-shield-halved','Combat Style','Attack · Speed')}
        ${infoCard('fa-star','Faction Wars','★★★★☆')}
      </div>
      ${section('About',
        '<p>Barbarians are a rough but effective faction known for high damage, stealth abilities, and massive ATK stats. Kael and Kabhu are top picks across multiple content areas.</p>'
      )}
      ${section('Top Champions',
        '<div class="pg-tags">'
        + championTag('Kabhu','Legendary')
        + championTag('Rotos the Lost Groom','Legendary')
        + championTag('Tormin the Cold','Legendary')
        + championTag('Soulless','Epic')
        + '</div>'
      )}
    `,
  },

  'faction-ogryn-tribes': {
    title_ru: 'Племена Огрынов (Ogryn Tribes)',
    title_en: 'Ogryn Tribes',
    iconImg: 'faction/icon5.png',
    content_ru: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Тип','Тёмная / Нейтральная')}
        ${infoCard('fa-shield-halved','Стиль боя','Защита · Поддержка')}
        ${infoCard('fa-star','Война Фракций','★★★☆☆')}
      </div>
      ${section('О фракции',
        '<p>Огрыны — массивные существа с огромным запасом здоровья. Специализируются на провокации, блоке ревайвов и дебаффах. Не имеют сильных лекарей, но умеют держать удар.</p>'
      )}
      ${section('Топ чемпионы',
        '<div class="pg-tags">'
        + championTag('Gurgoh the Augur','Legendary')
        + championTag('Gnut','Legendary')
        + championTag('Big\'Un','Epic')
        + championTag('Maneater','Epic')
        + championTag('Towering Titan','Epic')
        + '</div>'
      )}
    `,
    content_en: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Type','Dark / Neutral')}
        ${infoCard('fa-shield-halved','Combat Style','Defense · Support')}
        ${infoCard('fa-star','Faction Wars','★★★☆☆')}
      </div>
      ${section('Top Champions',
        '<div class="pg-tags">'
        + championTag('Gurgoh the Augur','Legendary')
        + championTag('Gnut','Legendary')
        + championTag('Maneater','Epic')
        + '</div>'
      )}
    `,
  },

  'faction-lizardmen': {
    title_ru: 'Ящеролюди (Lizardmen)',
    title_en: 'Lizardmen',
    iconImg: 'faction/icon6.png',
    content_ru: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Тип','Тёмная / Нейтральная')}
        ${infoCard('fa-shield-halved','Стиль боя','Атака · Контроль')}
        ${infoCard('fa-star','Война Фракций','★★★★☆')}
      </div>
      ${section('О фракции',
        '<p>Ящеролюди — многогранная фракция с сильными DPS, лекарями и чемпионами поддержки. Stag Knight и Skullcrusher делают их конкурентоспособными в самых сложных видах контента, включая Клан-Босса.</p>'
      )}
      ${section('Топ чемпионы',
        '<div class="pg-tags">'
        + championTag('Stag Knight','Legendary')
        + championTag('Rhazin Scarhide','Legendary')
        + championTag('Fu-Shan','Legendary')
        + championTag('Skullcrusher','Epic')
        + championTag('Jareg','Epic')
        + championTag('Vergumkaar','Epic')
        + '</div>'
      )}
      ${section('Советы',
        ul(['Skullcrusher — один из лучших для Клан-Босса','Stag Knight обеспечивает ускорение хода для всей команды','Rhazin снижает защиту и скорость — отлично для подземелий'])
      )}
    `,
    content_en: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Type','Dark / Neutral')}
        ${infoCard('fa-shield-halved','Combat Style','Attack · Control')}
        ${infoCard('fa-star','Faction Wars','★★★★☆')}
      </div>
      ${section('Top Champions',
        '<div class="pg-tags">'
        + championTag('Stag Knight','Legendary')
        + championTag('Rhazin Scarhide','Legendary')
        + championTag('Skullcrusher','Epic')
        + championTag('Jareg','Epic')
        + '</div>'
      )}
    `,
  },

  'faction-skinwalkers': {
    title_ru: 'Скинволкеры (Skinwalkers)',
    title_en: 'Skinwalkers',
    iconImg: 'faction/icon7.png',
    content_ru: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Тип','Тёмная')}
        ${infoCard('fa-shield-halved','Стиль боя','Атака · Яд')}
        ${infoCard('fa-star','Война Фракций','★★★☆☆')}
      </div>
      ${section('О фракции',
        '<p>Скинволкеры — оборотни и хищники. Специализируются на ядах, высоком уроне и агрессивной атаке. Несмотря на слабые ряды Раров, Легендарные из этой фракции крайне ценны.</p>'
      )}
      ${section('Топ чемпионы',
        '<div class="pg-tags">'
        + championTag('Lydia the Deathsiren','Legendary')
        + championTag('Gnarlhorn','Legendary')
        + championTag('Longbeard','Epic')
        + championTag('Norog','Epic')
        + championTag('Channeler','Rare')
        + '</div>'
      )}
    `,
    content_en: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Type','Dark')}
        ${infoCard('fa-shield-halved','Combat Style','Attack · Poison')}
        ${infoCard('fa-star','Faction Wars','★★★☆☆')}
      </div>
      ${section('Top Champions',
        '<div class="pg-tags">'
        + championTag('Lydia the Deathsiren','Legendary')
        + championTag('Gnarlhorn','Legendary')
        + championTag('Norog','Epic')
        + '</div>'
      )}
    `,
  },

  'faction-orcs': {
    title_ru: 'Орки (Orcs)',
    title_en: 'Orcs',
    iconImg: 'faction/icon8.png',
    content_ru: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Тип','Тёмная')}
        ${infoCard('fa-shield-halved','Стиль боя','Атака · АоЕ')}
        ${infoCard('fa-star','Война Фракций','★★★★☆')}
      </div>
      ${section('О фракции',
        '<p>Орки — мощная агрессивная фракция с выдающимся АоЕ-уроном. Особенно сильны в Паучьей Королеве, Башне Рока и Arena. Обладают несколькими топовыми Легендарными, включая великолепного Nekmo Thaar.</p>'
      )}
      ${section('Топ чемпионы',
        '<div class="pg-tags">'
        + championTag('Nekmo Thaar','Legendary')
        + championTag('Warlord','Legendary')
        + championTag('Zephyr Sniper','Epic')
        + championTag('Tork','Epic')
        + championTag('Valerie','Rare')
        + '</div>'
      )}
      ${section('Советы',
        ul(['Nekmo Thaar — один из лучших DP-чемпионов для Паука','Warlord уменьшает время отката — мощь в Клан-Боссе','Zephyr Sniper идеален для убийства с одного удара'])
      )}
    `,
    content_en: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Type','Dark')}
        ${infoCard('fa-shield-halved','Combat Style','Attack · AoE')}
        ${infoCard('fa-star','Faction Wars','★★★★☆')}
      </div>
      ${section('Top Champions',
        '<div class="pg-tags">'
        + championTag('Nekmo Thaar','Legendary')
        + championTag('Warlord','Legendary')
        + championTag('Zephyr Sniper','Epic')
        + '</div>'
      )}
    `,
  },

  'faction-demonspawn': {
    title_ru: 'Отродья Демонов (Demonspawn)',
    title_en: 'Demonspawn',
    iconImg: 'faction/icon9.png',
    content_ru: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Тип','Тёмная')}
        ${infoCard('fa-shield-halved','Стиль боя','Атака · Контроль')}
        ${infoCard('fa-star','Война Фракций','★★★★☆')}
      </div>
      ${section('О фракции',
        '<p>Отродья Демонов — тёмные существа с выдающимися атакующими способностями и непредсказуемым контролем. Включают несколько лучших Легендарных в игре — Pyxniel, Tormin the Cold (Demonspawn версия) и др.</p>'
      )}
      ${section('Топ чемпионы',
        '<div class="pg-tags">'
        + championTag('Pyxniel','Legendary')
        + championTag('Prince Kymar','Legendary')
        + championTag('Drexthar Bloodtwin','Legendary')
        + championTag('Inquisitor Shamael','Epic')
        + championTag('Sicia Flametongue','Epic')
        + '</div>'
      )}
    `,
    content_en: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Type','Dark')}
        ${infoCard('fa-shield-halved','Combat Style','Attack · Control')}
        ${infoCard('fa-star','Faction Wars','★★★★☆')}
      </div>
      ${section('Top Champions',
        '<div class="pg-tags">'
        + championTag('Pyxniel','Legendary')
        + championTag('Prince Kymar','Legendary')
        + championTag('Inquisitor Shamael','Epic')
        + '</div>'
      )}
    `,
  },

  'faction-undead-hordes': {
    title_ru: 'Нежить (Undead Hordes)',
    title_en: 'Undead Hordes',
    iconImg: 'faction/icon10.png',
    content_ru: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Тип','Тёмная')}
        ${infoCard('fa-shield-halved','Стиль боя','Атака · Яд · Дебаффы')}
        ${infoCard('fa-star','Война Фракций','★★★★★')}
      </div>
      ${section('О фракции',
        '<p>Нежить — одна из наиболее заполненных сильными чемпионами фракций. Mausoleum Mage, Bad-el-Kazar и Rotos — абсолютные доминаторы в своих областях. Сильны в Клан-Боссе, Arena, ранговых боях.</p>'
      )}
      ${section('Топ чемпионы',
        '<div class="pg-tags">'
        + championTag('Rotos the Lost Groom','Legendary')
        + championTag('Bad-el-Kazar','Legendary')
        + championTag('Seeker','Epic')
        + championTag('Mausoleum Mage','Epic')
        + championTag('Sorceress','Rare')
        + '</div>'
      )}
      ${section('Советы',
        ul(['Bad-el-Kazar — лучший универсальный лекарь-атакующий','Mausoleum Mage снимает дебаффы с команды','Seeker — обеспечивает ускорение хода для всей команды'])
      )}
    `,
    content_en: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Type','Dark')}
        ${infoCard('fa-shield-halved','Combat Style','Attack · Poison · Debuffs')}
        ${infoCard('fa-star','Faction Wars','★★★★★')}
      </div>
      ${section('Top Champions',
        '<div class="pg-tags">'
        + championTag('Rotos the Lost Groom','Legendary')
        + championTag('Bad-el-Kazar','Legendary')
        + championTag('Seeker','Epic')
        + championTag('Mausoleum Mage','Epic')
        + '</div>'
      )}
    `,
  },

  'faction-dark-elves': {
    title_ru: 'Тёмные Эльфы (Dark Elves)',
    title_en: 'Dark Elves',
    iconImg: 'faction/icon11.png',
    content_ru: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Тип','Тёмная')}
        ${infoCard('fa-shield-halved','Стиль боя','Атака · Скорость')}
        ${infoCard('fa-star','Война Фракций','★★★★★')}
      </div>
      ${section('О фракции',
        '<p>Тёмные Эльфы обладают одними из самых высоких показателей ATK и SPD в игре. Kael — один из лучших стартовых чемпионов, а Visix the Unbowed и Lydia отлично работают в Arena и Гидре.</p>'
      )}
      ${section('Топ чемпионы',
        '<div class="pg-tags">'
        + championTag('Visix the Unbowed','Legendary')
        + championTag('Madame Serris','Legendary')
        + championTag('Kael','Epic')
        + championTag('Spirithost','Epic')
        + championTag('Coldheart','Epic')
        + '</div>'
      )}
      ${section('Советы',
        ul(['Kael — лучший стартовый чемпион в игре благодаря ядам','Coldheart — один из лучших чемпионов для Дракона (ещё одиночный удар)','Madame Serris — незаменима в Arena: снимает баффы','Visix the Unbowed уменьшает скорость и A-скор врагов'])
      )}
    `,
    content_en: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Type','Dark')}
        ${infoCard('fa-shield-halved','Combat Style','Attack · Speed')}
        ${infoCard('fa-star','Faction Wars','★★★★★')}
      </div>
      ${section('Top Champions',
        '<div class="pg-tags">'
        + championTag('Visix the Unbowed','Legendary')
        + championTag('Madame Serris','Legendary')
        + championTag('Kael','Epic')
        + championTag('Coldheart','Epic')
        + '</div>'
      )}
    `,
  },

  'faction-knights-revenant': {
    title_ru: 'Рыцари Ревенанты (Knights Revenant)',
    title_en: 'Knights Revenant',
    iconImg: 'faction/icon12.png',
    content_ru: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Тип','Тёмная')}
        ${infoCard('fa-shield-halved','Стиль боя','Защита · Дебаффы')}
        ${infoCard('fa-star','Война Фракций','★★★☆☆')}
      </div>
      ${section('О фракции',
        '<p>Рыцари Ревенанты — мрачная фракция нежити-рыцарей. Их сила в контроле, снятии баффов и защитных способностях. Немного слабее в прямом уроне, но незаменимы для блока ревайва.</p>'
      )}
      ${section('Топ чемпионы',
        '<div class="pg-tags">'
        + championTag('Septimus','Legendary')
        + championTag('Warchief','Epic')
        + championTag('Sinesha','Epic')
        + championTag('Kytis','Epic')
        + '</div>'
      )}
    `,
    content_en: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Type','Dark')}
        ${infoCard('fa-shield-halved','Combat Style','Defense · Debuffs')}
        ${infoCard('fa-star','Faction Wars','★★★☆☆')}
      </div>
      ${section('Top Champions',
        '<div class="pg-tags">'
        + championTag('Septimus','Legendary')
        + championTag('Sinesha','Epic')
        + '</div>'
      )}
    `,
  },

  'faction-dwarves': {
    title_ru: 'Дварфы (Dwarves)',
    title_en: 'Dwarves',
    iconImg: 'faction/icon13.png',
    content_ru: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Тип','Светлая')}
        ${infoCard('fa-shield-halved','Стиль боя','Защита · Поддержка')}
        ${infoCard('fa-star','Война Фракций','★★★☆☆')}
      </div>
      ${section('О фракции',
        '<p>Дварфы — выносливые бойцы с высокими показателями DEF и HP. Специализируются на щитах, провокации и контрударах. Magnus the Devil — один из лучших Легендарных, меняющий исход Arena-боёв.</p>'
      )}
      ${section('Топ чемпионы',
        '<div class="pg-tags">'
        + championTag('Magnus the Devil','Legendary')
        + championTag('Runekeeper Dazdurk','Epic')
        + championTag('Grizzled Jarl','Epic')
        + championTag('Rearguard Sergeant','Rare')
        + '</div>'
      )}
    `,
    content_en: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Type','Light')}
        ${infoCard('fa-shield-halved','Combat Style','Defense · Support')}
        ${infoCard('fa-star','Faction Wars','★★★☆☆')}
      </div>
      ${section('Top Champions',
        '<div class="pg-tags">'
        + championTag('Magnus the Devil','Legendary')
        + championTag('Grizzled Jarl','Epic')
        + '</div>'
      )}
    `,
  },

  'faction-shadowkin': {
    title_ru: 'Теневой Народ (Shadowkin)',
    title_en: 'Shadowkin',
    iconImg: 'faction/icon14.png',
    content_ru: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Тип','Нейтральная')}
        ${infoCard('fa-shield-halved','Стиль боя','Атака · Стелс')}
        ${infoCard('fa-star','Война Фракций','★★★★☆')}
      </div>
      ${section('О фракции',
        '<p>Теневой Народ — уникальная фракция с концепцией «стелс» (Stealth). Чемпионы из этой фракции уходят в невидимость, что делает их неуязвимыми к одиночным атакам. Включает мощных дебаффёров и DPS.</p>'
      )}
      ${section('Топ чемпионы',
        '<div class="pg-tags">'
        + championTag('Genbo the Dishonored','Legendary')
        + championTag('Burangiri','Legendary')
        + championTag('Toragi the Frog','Epic')
        + championTag('Riho Bonespear','Epic')
        + '</div>'
      )}
      ${section('Советы',
        ul(['Toragi the Frog — один из лучших чемпионов для Гидры (ядовитая сфера)','Genbo обходит защиту и наносит огромный урон','Stealth синергирует со многими комбо-стратегиями в Arena'])
      )}
    `,
    content_en: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Type','Neutral')}
        ${infoCard('fa-shield-halved','Combat Style','Attack · Stealth')}
        ${infoCard('fa-star','Faction Wars','★★★★☆')}
      </div>
      ${section('Top Champions',
        '<div class="pg-tags">'
        + championTag('Genbo the Dishonored','Legendary')
        + championTag('Toragi the Frog','Epic')
        + '</div>'
      )}
    `,
  },

  'faction-sylvan-watchers': {
    title_ru: 'Лесные Стражи (Sylvan Watchers)',
    title_en: 'Sylvan Watchers',
    iconImg: 'faction/icon15.png',
    content_ru: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Тип','Нейтральная')}
        ${infoCard('fa-shield-halved','Стиль боя','Атака · Поддержка')}
        ${infoCard('fa-star','Война Фракций','★★★★☆')}
      </div>
      ${section('О фракции',
        '<p>Лесные Стражи — природная фракция эльфов-хранителей и лесных существ. Специализируются на AoE-уроне, дебаффах и природных способностях. Относительно новая фракция с сильным пулом чемпионов.</p>'
      )}
      ${section('Топ чемпионы',
        '<div class="pg-tags">'
        + championTag('Duchess Lilitu','Legendary')
        + championTag('Longbeard','Epic')
        + championTag('Ronda','Epic')
        + '</div>'
      )}
    `,
    content_en: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Type','Neutral')}
        ${infoCard('fa-shield-halved','Combat Style','Attack · Support')}
        ${infoCard('fa-star','Faction Wars','★★★★☆')}
      </div>
      ${section('Top Champions',
        '<div class="pg-tags">'
        + championTag('Duchess Lilitu','Legendary')
        + '</div>'
      )}
    `,
  },

  'faction-argonites': {
    title_ru: 'Аргониты (Argonites) — НОВАЯ',
    title_en: 'Argonites — NEW',
    iconImg: 'faction/icon16.png',
    content_ru: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Тип','Нейтральная')}
        ${infoCard('fa-shield-halved','Стиль боя','Атака · Дебаффы')}
        ${infoCard('fa-star','Война Фракций','★★★☆☆')}
      </div>
      ${section('О фракции',
        '<p>Аргониты — 16-я и новейшая фракция в Raid: Shadow Legends. Введена в 2025–2026 году. Механика этой фракции отличается уникальными условными способностями и синергией с новым контентом игры. Пул чемпионов активно пополняется.</p>'
      )}
      ${section('Особенности',
        ul(['Самая новая фракция в игре','Уникальные механики, отличные от старых фракций','Пул чемпионов будет расти со временем','Война Фракций находится в стадии формирования метагейма'])
      )}
      ${section('Советы',
        ul(['Следи за обновлениями — фракция активно развивается','Новые Легендарные могут изменить мету сразу после релиза','Инвестируй в Легендарных фракции — они скоро станут ключевыми в FW'])
      )}
    `,
    content_en: `
      <div class="pg-meta-row">
        ${infoCard('fa-users','Type','Neutral')}
        ${infoCard('fa-shield-halved','Combat Style','Attack · Debuffs')}
        ${infoCard('fa-star','Faction Wars','★★★☆☆')}
      </div>
      ${section('About',
        '<p>Argonites is the 16th and newest faction in Raid: Shadow Legends, introduced in 2025–2026. Their mechanics feature unique conditional abilities and synergy with the latest game content. The champion pool is actively growing.</p>'
      )}
      ${section('Tips',
        ul(['Stay updated — faction is actively developing','New Legendaries may shift the meta immediately on release','Invest in faction Legendaries for Faction Wars'])
      )}
    `,
  },

  /* ────────────────────────────────────────────────────────
     НОВОМУ ИГРОКУ
  ──────────────────────────────────────────────────────── */
  'new-player-promo-link-generator': {
    title_ru: 'Генератор ссылок для новичков',
    title_en: 'New Player Link Generator',
    icon: 'fa-link',
    content_ru: `
      ${section('Что это?','<p>Генератор ссылок для новичков позволяет опытным игрокам создавать реферальные ссылки и делиться ими с новыми игроками. Новый игрок, перешедший по ссылке, получает бонусного чемпиона и дополнительные ресурсы при создании аккаунта.</p>')}
      ${section('Как использовать',ul(['Зайди в меню настроек игры → «Пригласить друга»','Скопируй свою уникальную реферальную ссылку','Отправь другу — он получит стартовый бонусный чемпион','Ты получишь награду, когда друг достигнет определённого прогресса']))}
      ${section('Советы',ul(['Лучше всего делиться ссылкой с теми, кто точно будет играть','Убедись, что друг создаёт аккаунт именно по твоей ссылке','Некоторые промо-коды доступны только для новых игроков']))}
    `,
    content_en: `
      ${section('What is this?','<p>The New Player Link Generator lets experienced players create referral links to share with new players. A new player joining through your link gets a bonus champion and extra resources at account creation.</p>')}
      ${section('How to use',ul(['Go to game settings → "Invite a Friend"','Copy your unique referral link','Send it to a friend — they get a starter bonus champion','You get a reward when your friend reaches certain milestones']))}
    `,
  },

  'new-player-guide': {
    title_ru: 'Начало игры в Raid',
    title_en: 'Getting Started in Raid',
    icon: 'fa-book-open',
    content_ru: `
      ${section('Первые шаги','<p>Raid: Shadow Legends — это RPG с сотнями чемпионов, множеством режимов и глубокой системой прокачки. Для новичка первые дни могут казаться overwhelming — но следуя этим советам, ты быстро разберёшься.</p>')}
      ${section('Приоритеты новичка',ul(['Не трать кристаллы — береги их на Священный призыв','Прокачай стартового чемпиона до 60 уровня первым','Проходи Великую Кампанию — это лучший источник опыта','Ежедневно заходи в игру и выполняй задания','Вступи в Клан как можно раньше — это даёт ресурсы']))}
      ${section('Важные системы',ul(['Аффинити (стихии) — Маг > Сила > Дух > Магия (и обратно)','Звёзды и ранги чемпионов — чем выше, тем сильнее','Артефакты — основной источник силы чемпиона','Масштабирование статов — важно знать, на чём масштабируется чемпион']))}
      ${section('Чего избегать',ul(['Не 60-ти всех подряд — фокусируйся на одном чемпионе','Не трать кристаллы в первый день','Не продавай Эпиков и Легендарных']))}
    `,
    content_en: `
      ${section('First Steps','<p>Raid: Shadow Legends is an RPG with hundreds of champions, many game modes and deep progression systems. Follow these tips to get started efficiently.</p>')}
      ${section('New Player Priorities',ul(['Don\'t spend gems — save for Sacred Shards','Level your starter champion to 60 first','Complete the Campaign — best source of XP','Log in daily and complete missions','Join a Clan early — it provides resources']))}
      ${section('Common Mistakes',ul(['Don\'t 60 every champion — focus on one','Don\'t spend gems on day one','Don\'t sell Epic or Legendary champions']))}
    `,
  },

  'guide-to-affinity': {
    title_ru: 'Руководство по аффинити',
    title_en: 'Guide to Affinity',
    icon: 'fa-yin-yang',
    content_ru: `
      ${section('Что такое Аффинити?','<p>Аффинити (стихия) определяет взаимодействие чемпионов в бою. Каждый чемпион принадлежит к одной из четырёх аффинити: Сила, Дух, Магия и Пустота.</p>')}
      ${section('Круг аффинити','<ul class="pg-list"><li><strong style="color:#e86060">⚔ Сила (Force)</strong> — сильна против Духа, слаба против Магии</li><li><strong style="color:#60c8e8">💧 Дух (Spirit)</strong> — силён против Магии, слаб против Силы</li><li><strong style="color:#b060e8">✨ Магия (Magic)</strong> — сильна против Силы, слаба против Духа</li><li><strong style="color:#c8c8c8">🌑 Пустота (Void)</strong> — нейтральна ко всем, и все нейтральны к ней</li></ul>')}
      ${section('Эффекты аффинити в бою',ul(['Преимущество → +15% к урону, шанс на слабое место (дополнительный дебафф)','Слабость → −15% к урону, шанс дебаффа снижается','Нейтральная → без бонусов и штрафов']))}
      ${section('Советы',ul(['Против красных боссов → используй синих чемпионов','Для Arena — Пустота нейтральна, поэтому Void-чемпионы надёжны','В подземельях важно совпадать по аффинити с тактикой']))}
    `,
    content_en: `
      ${section('What is Affinity?','<p>Affinity determines champion interactions in combat. Every champion belongs to one of four affinities: Force, Spirit, Magic, and Void.</p>')}
      ${section('Affinity Circle','<ul class="pg-list"><li><strong>⚔ Force</strong> — strong vs Spirit, weak vs Magic</li><li><strong>💧 Spirit</strong> — strong vs Magic, weak vs Force</li><li><strong>✨ Magic</strong> — strong vs Force, weak vs Spirit</li><li><strong>🌑 Void</strong> — neutral to all</li></ul>')}
      ${section('Combat Effects',ul(['Advantage → +15% damage, chance for Weak Hit (extra debuff)','Weakness → −15% damage, reduced debuff chance','Neutral → no bonuses or penalties']))}
    `,
  },

  'champion-ascension': {
    title_ru: 'Вознесение чемпионов',
    title_en: 'Champion Ascension',
    icon: 'fa-arrow-up-right-dots',
    content_ru: `
      ${section('Что такое Вознесение?','<p>Вознесение (Ascension) — процесс повышения максимального уровня чемпиона и открытия новых характеристик. Для вознесения необходимы Зелья вознесения, которые добываются в Зале Чемпионов (Миnotaur).</p>')}
      ${section('Ступени вознесения',ul(['1 звезда → максимум 20 уровень','2 звезды → максимум 30 уровень','3 звезды → максимум 40 уровень','4 звезды → максимум 50 уровень','5 звёзд → максимум 60 уровень','6 звёзд → максимум 60 уровень (с 6-звёздной силой)']))}
      ${section('Приоритет вознесения',ul(['Прокачивай только нужных чемпионов до 6 звёзд','Основной фарм зелий — в Миnotaur подземелье','На каждое вознесение уходит от 4 до 10 зелий','Зелья бывают разных стихий — совпадай с аффинити чемпиона']))}
    `,
    content_en: `
      ${section('What is Ascension?','<p>Ascension is the process of raising a champion\'s max level and unlocking new stats. It requires Ascending Potions from the Minotaur dungeon.</p>')}
      ${section('Ascension Stars',ul(['1 star → max level 20','2 stars → max level 30','3 stars → max level 40','4 stars → max level 50','5 stars → max level 60','6 stars → max level 60 (with 6-star power)']))}
      ${section('Priority Tips',ul(['Only ascend champions you need at 6 stars','Farm Minotaur for potions','Each ascension costs 4–10 potions','Match potion affinity to champion affinity']))}
    `,
  },

  'buffs-debuffs': {
    title_ru: 'Баффы и Дебаффы',
    title_en: 'Buffs and Debuffs',
    icon: 'fa-wand-sparkles',
    content_ru: `
      ${section('Ключевые Баффы',ul(['<strong>Блок урона</strong> — поглощает 60% урона','<strong>Непробиваемость</strong> — иммунитет к дебаффам','<strong>Ускорение атаки</strong> — +30% скорость атаки','<strong>Усиление атаки</strong> — +50% урон','<strong>Усиление защиты</strong> — +60% к защите','<strong>Перманентная сила</strong> — постоянный бафф урона','<strong>Щит</strong> — дополнительный запас HP']))}
      ${section('Ключевые Дебаффы',ul(['<strong>Яд</strong> — 2.5% от MAX HP в ход (снимается в Клан-Боссе)','<strong>Горение</strong> — 4% от MAX HP в ход','<strong>Снижение защиты</strong> — −30% или −60% к защите','<strong>Замедление</strong> — снижает SPD врага','<strong>Оглушение</strong> — пропускает ход','<strong>Провокация</strong> — враг атакует только провокатора','<strong>Сон</strong> — нельзя действовать, снимается от урона']))}
      ${section('Важно знать',ul(['Яды НЕ складываются через граничное значение у Клан-Босса','Блок дебаффов — приоритет в большинстве сложного контента','Снижение защиты стакается до 2 стаков']))}
    `,
    content_en: `
      ${section('Key Buffs',ul(['<strong>Block Damage</strong> — absorbs 60% of damage','<strong>Immunity</strong> — immune to debuffs','<strong>Increase ATK Speed</strong> — +30% attack speed','<strong>Increase ATK</strong> — +50% damage','<strong>Increase DEF</strong> — +60% defense','<strong>Shield</strong> — extra HP pool']))}
      ${section('Key Debuffs',ul(['<strong>Poison</strong> — 2.5% of Max HP per turn','<strong>HP Burn</strong> — 4% of Max HP per turn','<strong>Decrease DEF</strong> — −30% or −60% defense','<strong>Decrease SPD</strong> — slows enemy','<strong>Stun</strong> — skip turn','<strong>Provoke</strong> — enemy targets only provoker','<strong>Sleep</strong> — removed by damage']))}
    `,
  },

  'who-to-60': {
    title_ru: 'Кого прокачать до 60?',
    title_en: 'Who should I 60 next?',
    icon: 'fa-medal',
    content_ru: `
      ${section('Как выбрать чемпиона',ul(['Всегда сначала 60-ти стартового чемпиона (Kael, Athel, Galek, Elhain или Spirithost)','Затем — лучший чемпион для Клан-Босса','Потом — лучший для Дракона (12+)','Не трать ресурсы на чемпионов, которых не будешь использовать']))}
      ${section('Лучшие чемпионы для первого 60',ul(['<strong>Kael</strong> — яды для Клан-Босса, универсален','<strong>Arbiter</strong> — если повезло получить — ставь в приоритет','<strong>Frozen Banshee</strong> — отличный выбор для новичка (Клан-Босс)','<strong>Spirithost</strong> — отличная поддержка для любого контента','<strong>Coldheart</strong> — лучший чемпион для Дракона и вообще']))}
      ${section('Чего избегать',ul(['Не прокачивай Раров, которых ты заменишь','Не прокачивай нескольких Легендарных одновременно','Фокус — главный принцип для новичка']))}
    `,
    content_en: `
      ${section('How to choose',ul(['Always 60 your starter first (Kael, Athel, Galek, Elhain or Spirithost)','Then — best Clan Boss champion','Then — best for Dragon 12+','Don\'t waste resources on champions you won\'t use']))}
      ${section('Best First 60s',ul(['<strong>Kael</strong> — poisons for Clan Boss, universal','<strong>Arbiter</strong> — priority if you pulled one','<strong>Frozen Banshee</strong> — great beginner Clan Boss pick','<strong>Coldheart</strong> — best for Dragon']))}
    `,
  },

  'daily-login-champions': {
    title_ru: 'Ежедневные чемпионы входа',
    title_en: 'Daily Login Champions',
    icon: 'fa-calendar-check',
    content_ru: `
      ${section('Что это?','<p>При ежедневном входе в игру ты получаешь накапливаемые награды. Раз в 30 дней можно выбрать одного из предложенных чемпионов как ежемесячную награду.</p>')}
      ${section('Какие чемпионы бывают',ul(['Обычно это сильные Эпики или иногда Легендарные','Выбор меняется каждый месяц','Некоторые особо ценные: Seeker, Coldheart, Spirithost']))}
      ${section('Советы',ul(['Не пропускай ежедневные входы — streak важен','Ежемесячный выбор не повторяется — выбирай мудро','Для новичков Seeker и Coldheart — приоритет']))}
    `,
    content_en: `
      ${section('What is this?','<p>Daily login rewards give you accumulating bonuses. Every 30 days you can choose one champion from a selection as your monthly reward.</p>')}
      ${section('Tips',ul(['Don\'t skip daily logins — streak matters','Monthly choice doesn\'t repeat — choose wisely','For beginners, Seeker and Coldheart are priorities']))}
    `,
  },

  'arbiter-missions': {
    title_ru: 'Миссии Арбитра',
    title_en: 'Arbiter Missions',
    icon: 'fa-chess-knight',
    content_ru: `
      ${section('Цель','<p>Арбитр — один из самых мощных чемпионов в игре. Чтобы разблокировать его, нужно выполнить серию сложных миссий. Эта цель — один из главных ориентиров для ранней и средней игры.</p>')}
      ${section('Ключевые этапы',ul(['Пройти Кампанию на Жестоком уровне','Закрыть Дракона на 12+ уровне за определённое время','Закрыть Паука на 12+ уровне','Достичь Золота 1 в Arena','Победить Клан-Босса на сложности Ультра-Кошмар']))}
      ${section('Советы',ul(['Начни работать над Арбитром с первых недель игры','Фокусируйся на Драконе — это основное препятствие','Команда для Arena — обязательна','Терпение — миссии занимают от 2 до 6 месяцев']))}
    `,
    content_en: `
      ${section('Goal','<p>Arbiter is one of the most powerful champions. To unlock her you must complete a series of challenging missions — a key milestone for early/mid game.</p>')}
      ${section('Key Milestones',ul(['Complete Campaign on Brutal difficulty','Close Dragon 12+ within a time limit','Close Spider 12+','Reach Gold 1 in Arena','Defeat Clan Boss on Ultra-Nightmare difficulty']))}
      ${section('Tips',ul(['Start working on Arbiter from week one','Focus on Dragon — it\'s the main obstacle','Build an Arena team','Patience — missions take 2–6 months']))}
    `,
  },

  'ramantu-missions': {
    title_ru: 'Миссии Рамантуша',
    title_en: 'Ramantu Missions',
    icon: 'fa-r',
    content_ru: `
      ${section('Цель','<p>Рамантуш Зиззолт — чемпион, которого можно получить через выполнение специальной цепочки миссий. Он уникален тем, что наносит урон в зависимости от количества дебаффов на враге.</p>')}
      ${section('Требования',ul(['Выполнить ряд задач по Войне Фракций','Достичь определённого уровня в подземельях','Выполнить условия по Клан-Боссу']))}
      ${section('Ценность чемпиона',ul(['Массовые атаки с масштабированием по дебаффам','Хорош в связке с ядами и другими дебаффами','Не обязателен для большинства контента, но полезен']))}
    `,
    content_en: `
      ${section('Goal','<p>Ramantu Drakesblood is obtained through a special mission chain. He\'s unique in dealing damage based on the number of debuffs on the enemy.</p>')}
      ${section('Tips',ul(['He scales with debuffs — pair with poison champions','Complete Faction Wars and dungeon requirements','Good but not essential for most content']))}
    `,
  },

  'marius-missions': {
    title_ru: 'Миссии Мариуса',
    title_en: 'Marius Missions',
    icon: 'fa-m',
    content_ru: `
      ${section('Цель','<p>Мариус Эдварс — чемпион, доступный через цепочку развития. Специализируется на атаке и имеет уникальные пассивные способности.</p>')}
      ${section('Советы',ul(['Следи за задачами раздела «Кузница»','Миссии Мариуса менее приоритетны, чем Арбитр','Хорошая цель для опытных игроков со свободными ресурсами']))}
    `,
    content_en: `
      ${section('Goal','<p>Marius is a champion available through a development chain. He specializes in attack and has unique passive abilities.</p>')}
    `,
  },

  'promo-codes': {
    title_ru: 'Промо-коды',
    title_en: 'Promo Codes',
    icon: 'fa-tag',
    content_ru: `
      ${section('Как использовать промо-коды',ul(['Открой игру → Профиль → Промо-код','Введи код точно как написан (учитывай регистр)','Нажми «Применить» — получишь награду']))}
      ${section('Где искать коды',ul(['Официальный сайт Plarium','Официальный YouTube канал (часто в начале видео)','Стримы Hellhades и других создателей контента','Официальные социальные сети Raid']))}
      ${section('Типы наград',ul(['Кристаллы (Gems)','Осколки для призыва (Shards)','Зелья опыта и вознесения','Серебро','Специальные косметические предметы']))}
      ${section('Важно',ul(['Промо-коды имеют срок действия — используй как можно скорее','Большинство кодов работают один раз на аккаунт','Некоторые коды только для новых игроков']))}
    `,
    content_en: `
      ${section('How to Use Promo Codes',ul(['Open game → Profile → Promo Code','Enter the code exactly as written (case sensitive)','Press Apply — collect your reward']))}
      ${section('Where to Find Codes',ul(['Official Plarium website','Official YouTube channel (often at video start)','Hellhades and other content creator streams','Official Raid social media']))}
      ${section('Note',ul(['Codes expire — use them as soon as possible','Most codes work once per account','Some codes are new-player only']))}
    `,
  },

  /* ────────────────────────────────────────────────────────
     ГАЙДЫ И TIER-ЛИСТЫ
  ──────────────────────────────────────────────────────── */
  'tier-list': {
    title_ru: 'Tier-лист чемпионов',
    title_en: 'Champion Tier List',
    icon: 'fa-trophy',
    content_ru: `
      ${section('О Tier-листе','<p>Tier-лист ранжирует чемпионов по их универсальности и силе в разных режимах игры. Учитываются Arena, Клан-Босс, Гидра, подземелья и Башня Рока.</p>')}
      ${section('Лучшие чемпионы 2026',
        '<div class="pg-tags">'
        + championTag('Arbiter','Legendary')
        + championTag('Lyssandra','Legendary')
        + championTag('Lydia the Deathsiren','Legendary')
        + championTag('Trunda Giltmallet','Legendary')
        + championTag('Duchess Lilitu','Legendary')
        + championTag('Bad-el-Kazar','Legendary')
        + championTag('Coldheart','Epic')
        + championTag('Frozen Banshee','Epic')
        + championTag('Seeker','Epic')
        + '</div>'
      )}
      ${section('Градация тиров',ul(['<strong>S-тир</strong> — доминируют в нескольких режимах','<strong>A-тир</strong> — сильны в конкретном контенте','<strong>B-тир</strong> — хорошие, но не топ','<strong>C-тир</strong> — ситуативны','<strong>D/F-тир</strong> — устарели или слабы']))}
    `,
    content_en: `
      ${section('About','<p>The tier list ranks champions by their versatility and power across game modes: Arena, Clan Boss, Hydra, Dungeons, and Doom Tower.</p>')}
      ${section('Best Champions 2026',
        '<div class="pg-tags">'
        + championTag('Arbiter','Legendary')
        + championTag('Lyssandra','Legendary')
        + championTag('Lydia the Deathsiren','Legendary')
        + championTag('Coldheart','Epic')
        + championTag('Frozen Banshee','Epic')
        + championTag('Seeker','Epic')
        + '</div>'
      )}
    `,
  },

  'faction-wars-tier-list': {
    title_ru: 'Tier-листы по Войне Фракций',
    title_en: 'Faction Wars Tier Lists',
    icon: 'fa-shield-halved',
    content_ru: `
      ${section('О Войне Фракций','<p>Война Фракций — режим, в котором команда строится только из чемпионов одной фракции. Проходи до 21 стадии включительно для получения максимальных наград.</p>')}
      ${section('Лучшие фракции для FW',ul(['<strong>Высшие Эльфы</strong> — Arbiter делает их непробиваемыми','<strong>Нежить</strong> — Bad-el-Kazar и Seeker закрывают легко','<strong>Тёмные Эльфы</strong> — Coldheart и Kael — мощная база','<strong>Знаменосцы</strong> — Frozen Banshee + Chancellor Yasmin']))}
      ${section('Слабые фракции для FW',ul(['Огрыны — мало урона','Рыцари Ревенанты — нет лекарей','Дварфы — сложно без Легендарных']))}
    `,
    content_en: `
      ${section('About Faction Wars','<p>Faction Wars is a mode where teams consist only of champions from one faction. Complete stage 21 for maximum rewards.</p>')}
      ${section('Easiest Factions for FW',ul(['<strong>High Elves</strong> — Arbiter makes them unbeatable','<strong>Undead Hordes</strong> — Bad-el-Kazar and Seeker handle it','<strong>Dark Elves</strong> — Coldheart and Kael strong base']))}
    `,
  },

  'blessings-tier-list': {
    title_ru: 'Tier-лист Благословений',
    title_en: 'Blessings Tier List',
    icon: 'fa-star',
    content_ru: `
      ${section('Что такое Благословения?','<p>Благословения — система бонусов для прокачанных чемпионов. Добываются у Тёмных Эльфов, Нежити и других фракций через особый режим.</p>')}
      ${section('Топ Благословения',ul(['<strong>Brimstone</strong> — для DPS (наносит дополнительный урон)','<strong>Cruelty</strong> — снижение защиты','<strong>Polymorph</strong> — контроль в Arena','<strong>Temporal Chains</strong> — замедление врагов']))}
    `,
    content_en: `
      ${section('What are Blessings?','<p>Blessings are bonus systems for leveled-up champions, obtained through various game modes.</p>')}
      ${section('Top Blessings',ul(['<strong>Brimstone</strong> — extra damage for DPS','<strong>Cruelty</strong> — defense reduction','<strong>Polymorph</strong> — crowd control in Arena']))}
    `,
  },

  'blessings-team-builder': {
    title_ru: 'Конструктор команды Благословений',
    title_en: 'Blessings Team Builder',
    icon: 'fa-users',
    content_ru: `
      ${section('Как работает конструктор','<p>Конструктор команды помогает подобрать оптимальные Благословения для каждого чемпиона в зависимости от того, в каком контенте ты используешь эту команду.</p>')}
      ${section('Стратегии',ul(['<strong>Клан-Босс</strong>: DPS чемпионы → Brimstone; Поддержка → Cruelty','<strong>Arena</strong>: Атакующие → Polymorph; Скоростные → Temporal Chains','<strong>Башня Рока</strong>: зависит от босса']))}
    `,
    content_en: `
      ${section('How it works','<p>The team builder helps select optimal Blessings for each champion based on the content you\'re using them in.</p>')}
    `,
  },

  'relic-tier-list': {
    title_ru: 'Tier-лист Реликвий',
    title_en: 'Relic Tier List',
    icon: 'fa-gem',
    content_ru: `
      ${section('Что такое Реликвии?','<p>Реликвии — мощные предметы, усиливающие команду или отдельных чемпионов. Добываются в Башне Рока и Башне Скорби.</p>')}
      ${section('Топ Реликвии',ul(['<strong>Reaper</strong> — одна из лучших для DPS','<strong>Defiant</strong> — лучшая защитная реликвия','<strong>Arcane Keep</strong> — для контроля']))}
    `,
    content_en: `
      ${section('What are Relics?','<p>Relics are powerful items that enhance your team or specific champions, obtained from Doom Tower.</p>')}
    `,
  },

  'artifact-tier-list': {
    title_ru: 'Tier-листы Артефактов',
    title_en: 'Artifact Tier Lists',
    icon: 'fa-shield',
    content_ru: `
      ${section('Важность артефактов','<p>Артефакты — ключевой элемент силы чемпиона. Правильные сеты могут удвоить его эффективность.</p>')}
      ${section('Топ сеты артефактов',ul(['<strong>Speed</strong> — скорость, основа большинства команд','<strong>Lifesteal</strong> — выживание в подземельях','<strong>Immortal</strong> — постоянное восстановление HP','<strong>Toxic</strong> — яд каждый ход','<strong>Savage</strong> — игнорирует 25% защиты врага','<strong>Cruel</strong> — снижение защиты пассивно','<strong>Relentless</strong> — шанс дополнительного хода']))}
      ${section('Статы артефактов',ul(['<strong>SPD</strong> — самый важный стат для большинства контента','<strong>ATK%</strong> — для атакующих чемпионов','<strong>DEF%</strong> — для защитников','<strong>HP%</strong> — для лекарей и поддержки','<strong>ACC</strong> — для дебаффёров']))}
    `,
    content_en: `
      ${section('Importance','<p>Artifacts are the core of champion power. The right sets can double a champion\'s effectiveness.</p>')}
      ${section('Top Artifact Sets',ul(['<strong>Speed</strong> — foundation of most teams','<strong>Lifesteal</strong> — sustain in dungeons','<strong>Savage</strong> — ignores 25% enemy defense','<strong>Toxic</strong> — poisons every turn']))}
    `,
  },

  'guaranteed-champion-summons': {
    title_ru: 'Прошлые гарантированные чемпионы',
    title_en: 'Past Guaranteed Champions',
    icon: 'fa-hourglass-half',
    content_ru: `
      ${section('Система гарантированных призывов','<p>В Raid периодически проводятся события, в которых игроки могут гарантированно получить определённого Легендарного чемпиона через накопление осколков или выполнение заданий.</p>')}
      ${section('Известные прошлые события',ul(['Fusion-события с Легендарными чемпионами','Специальные марафоны и турниры','«Выбор игроков» — голосование за следующего Guaranteed чемпиона']))}
    `,
    content_en: `
      ${section('System','<p>Raid periodically holds events where players can get a guaranteed Legendary champion by accumulating shards or completing missions.</p>')}
    `,
  },

  'champion-fusions': {
    title_ru: 'Прошлые Fusion-события',
    title_en: 'Past Fusion Events',
    icon: 'fa-calendar-days',
    content_ru: `
      ${section('Что такое Fusion?','<p>Fusion — специальное событие, в котором нужно собрать 4 Эпика через различные задания и объединить их в одного Легендарного. Это один из лучших способов получить сильного Лега без траты кристаллов.</p>')}
      ${section('Типичный план Fusion',ul(['3-4 недели активных заданий','Получение 4 Эпиков через события','Объединение в Легендарного','Параллельно идут боковые задания на артефакты']))}
    `,
    content_en: `
      ${section('What is Fusion?','<p>Fusion is a special event where you combine 4 Epic champions through various missions to get one Legendary. One of the best ways to get a strong Legendary without spending gems.</p>')}
    `,
  },

  'preparing-for-fusion': {
    title_ru: 'Подготовка к Fusion',
    title_en: 'Preparing for Fusions',
    icon: 'fa-object-group',
    content_ru: `
      ${section('Как готовиться',ul(['Накапливай осколки: Sacred, Ancient, Void','Копи Турниры — они часть Fusion-событий','Следи за анонсами — обычно за 1–2 недели до старта','Готовь серебро для апгрейда артефактов','Имей Энергию и Токены для ускорения']))}
      ${section('Стоит ли делать Fusion?',ul(['Если чемпион S-тира — однозначно да','Если слабый или ситуативный — оцени стоимость','Учитывай, сколько ресурсов потратишь и что потеряешь']))}
    `,
    content_en: `
      ${section('How to Prepare',ul(['Stockpile shards: Sacred, Ancient, Void','Save tournament points — they\'re part of Fusion events','Watch for announcements 1–2 weeks early','Stockpile silver for artifact upgrades','Have Energy and Tokens ready']))}
    `,
  },

  'defining-progress': {
    title_ru: 'Определи свой прогресс',
    title_en: 'Defining Your Progress',
    icon: 'fa-chart-line',
    content_ru: `
      ${section('Стадии развития игрока',ul(['<strong>Ранняя игра</strong>: Кампания Brutal, Клан-Босс Кошмар, Дракон 12','<strong>Средняя игра</strong>: Клан-Босс Ультра-Кошмар, Дракон 20, Арена Золото','<strong>Поздняя игра</strong>: Гидра, Башня Рока 100, Arena Платина']))}
      ${section('Ключевые ориентиры',ul(['✓ Арбитр — получен и прокачан','✓ Дракон 20 — стабильно','✓ Паук 20 — стабильно','✓ Клан-Босс Ultra-Nightmare — стабильно','✓ Гидра Hard+','✓ Башня Рока — 100 этаж']))}
    `,
    content_en: `
      ${section('Player Stages',ul(['<strong>Early Game</strong>: Brutal Campaign, Nightmare CB, Dragon 12','<strong>Mid Game</strong>: UNM CB, Dragon 20, Gold Arena','<strong>Late Game</strong>: Hydra, Doom Tower 100, Platinum Arena']))}
    `,
  },

  /* ────────────────────────────────────────────────────────
     ПОДЗЕМЕЛЬЯ
  ──────────────────────────────────────────────────────── */
  'clan-boss-guide': {
    title_ru: 'Гайд по Клан-Боссу',
    title_en: 'Guide to Clan Boss',
    icon: 'fa-skull',
    content_ru: `
      ${section('Что такое Клан-Босс?','<p>Клан-Босс — ежедневный бой с огромным боссом, открытый для всех членов клана. Урон суммируется по всему клану. Дает одни из лучших наград в игре.</p>')}
      ${section('Уровни сложности',ul(['Нормальный — для новичков','Сложный — более высокие награды','Жестокий — требует сильной команды','Кошмар — 4-я ступень','Ультра-Кошмар (UNM) — самый сложный, лучшие награды']))}
      ${section('Ключевые механики',ul(['Боссу нельзя нанести больше 10% HP за один удар','Яды проходят этот лимит — поэтому они главный урон','Нужна команда с «Блок дебаффов» — Босс накладывает Яд сам','Оглушение не работает на Жестоком+ после определённого хода']))}
      ${section('Лучшие чемпионы',
        '<div class="pg-tags">'
        + championTag('Frozen Banshee','Epic')
        + championTag('Siegfrund the Nephilim','Epic')
        + championTag('Doompriest','Epic')
        + championTag('Seeker','Epic')
        + championTag('Skullcrusher','Epic')
        + championTag('Lydia the Deathsiren','Legendary')
        + '</div>'
      )}
    `,
    content_en: `
      ${section('What is Clan Boss?','<p>Clan Boss is a daily fight with a massive boss, open to all clan members. Damage is cumulative. Gives some of the best rewards in the game.</p>')}
      ${section('Key Mechanics',ul(['Boss can\'t take more than 10% HP per hit (cap)','Poisons bypass this cap — that\'s why they\'re key','Need Block Debuffs team — Boss poisons your team','Stun stops working on Brutal+ after certain turn']))}
      ${section('Best Champions',
        '<div class="pg-tags">'
        + championTag('Frozen Banshee','Epic')
        + championTag('Doompriest','Epic')
        + championTag('Seeker','Epic')
        + championTag('Skullcrusher','Epic')
        + '</div>'
      )}
    `,
  },

  'chimera-guide': {
    title_ru: 'Гайд по Химере',
    title_en: 'Guide to Chimera Boss',
    icon: 'fa-dragon',
    content_ru: `
      ${section('О боссе Химера','<p>Химера — относительно новый босс в Raid: Shadow Legends. Многоголовое чудовище с уникальными фазами и механиками. Требует специально собранных команд и понимания очерёдности голов.</p>')}
      ${section('Механики',ul(['Несколько голов с разными способностями','Убийство одной головы усиливает другие','Важна высокая скорость и непробиваемость к дебаффам','Рекомендуется Immunity-сет на всю команду']))}
      ${section('Лучшие чемпионы',
        '<div class="pg-tags">'
        + championTag('Duchess Lilitu','Legendary')
        + championTag('Arbiter','Legendary')
        + championTag('Seeker','Epic')
        + championTag('Doompriest','Epic')
        + '</div>'
      )}
    `,
    content_en: `
      ${section('About Chimera','<p>Chimera is a relatively new multi-headed boss in Raid with unique phases. Requires specially built teams and understanding of head order.</p>')}
      ${section('Mechanics',ul(['Multiple heads with different abilities','Killing one head buffs others','High speed and debuff immunity is key','Immunity set recommended for whole team']))}
    `,
  },

  'speed-tuned-team': {
    title_ru: 'Speed-тюн команды',
    title_en: 'Speed Tuned Team',
    icon: 'fa-gauge-high',
    content_ru: `
      ${section('Что такое Speed-тюн?','<p>Speed-тюн — это настройка скоростей чемпионов так, чтобы они ходили в строго определённом порядке. Это ключевой навык для UNM Клан-Босса и многих других режимов.</p>')}
      ${section('Зачем нужен тюн',ul(['Синхронизация команды с Боссом','Гарантия Блока дебаффов в нужный момент','Максимальный урон через яды']))}
      ${section('Базовый тюн для CB',ul(['Поддержка ходит перед атакующими','Скорость тюнится кратно скорости Босса','Используй Seeker для ускорения хода']))}
      ${section('Пример скоростей для UNM CB',ul(['Герой 1 (Поддержка): 260+ SPD','Герой 2 (Atk): 250 SPD','Герой 3 (Atk): 240 SPD','Герой 4 (Atk): 230 SPD','Герой 5 (Atk): 220 SPD']))}
    `,
    content_en: `
      ${section('What is Speed Tuning?','<p>Speed tuning is configuring champion speeds so they take turns in a precise order. Essential skill for UNM Clan Boss and many other modes.</p>')}
      ${section('Why it matters',ul(['Synchronize with the Boss cycle','Guarantee Block Debuffs at the right moment','Maximize poison damage']))}
    `,
  },

  'dragon-dungeon': {
    title_ru: 'Дракон (подземелье)',
    title_en: 'Dragon Dungeon',
    icon: 'fa-fire',
    content_ru: `
      ${section('О Драконе','<p>Дракон — один из ключевых боссов подземелий. Лучший источник Speed-артефактов в игре. Цель каждого игрока — стабильно фармить Дракона 20.</p>')}
      ${section('Механики Дракона',ul(['Имеет иммунитет к яду на определённых фазах','Атакует случайного члена команды','Накладывает щиты на себя','На 20 уровне наносит огромный урон']))}
      ${section('Лучшие чемпионы',
        '<div class="pg-tags">'
        + championTag('Coldheart','Epic')
        + championTag('Rhazin Scarhide','Legendary')
        + championTag('Tayrel','Legendary')
        + championTag('Doompriest','Epic')
        + championTag('Seeker','Epic')
        + '</div>'
      )}
      ${section('Советы',ul(['Coldheart — лучший DPS для Дракона (HP Burn)','Снижение защиты — обязательно','Нужен хилер или Lifesteal-сет','20 уровень фармится со временем подготовки команды']))}
    `,
    content_en: `
      ${section('About Dragon','<p>Dragon is a key dungeon boss and the best source of Speed artifacts. Every player\'s goal is to farm Dragon 20 stably.</p>')}
      ${section('Best Champions',
        '<div class="pg-tags">'
        + championTag('Coldheart','Epic')
        + championTag('Rhazin Scarhide','Legendary')
        + championTag('Tayrel','Legendary')
        + '</div>'
      )}
    `,
  },

  'fire-knight': {
    title_ru: 'Огненный Рыцарь',
    title_en: 'Fire-Knight',
    icon: 'fa-fire-flame-curved',
    content_ru: `
      ${section('О боссе','<p>Огненный Рыцарь — особый подземельный босс. Имеет щит, который нужно разбивать МНОЖЕСТВОМ ударов. Одиночные сильные удары не работают — нужны многоударные чемпионы.</p>')}
      ${section('Механика щита',ul(['Щит: 10 зарядов → каждый удар снимает 1 заряд','Пока щит активен → урон по боссу невозможен','Нужны чемпионы с множеством ударов в одной атаке']))}
      ${section('Лучшие чемпионы',
        '<div class="pg-tags">'
        + championTag('Zephyr Sniper','Epic')
        + championTag('Coldheart','Epic')
        + championTag('Cruetraxa','Legendary')
        + '</div>'
      )}
    `,
    content_en: `
      ${section('About','<p>Fire-Knight has a shield that must be broken by many hits. Single powerful strikes don\'t work — you need multi-hit champions.</p>')}
      ${section('Shield Mechanic',ul(['Shield: 10 charges → each hit removes 1 charge','Damage impossible while shield is active','Need champions with many hits per skill']))}
    `,
  },

  'spider-dungeon': {
    title_ru: 'Паучья Королева',
    title_en: 'Spider Dungeon',
    icon: 'fa-spider',
    content_ru: `
      ${section('О боссе','<p>Паучья Королева порождает маленьких Паучков, которые атакуют и восстанавливают HP Королеве при смерти. Нужно убивать их быстро или по одному.</p>')}
      ${section('Стратегии',ul(['Стратегия «один за раз» — убивай паучков по одному','Стратегия «все сразу» — AoE урон и убивай всех одновременно','Блок ревайва — критично, иначе паучки будут воскрешать']))}
      ${section('Лучшие чемпионы',
        '<div class="pg-tags">'
        + championTag('Nekmo Thaar','Legendary')
        + championTag('Deacon Armstrong','Epic')
        + championTag('Geomancer','Epic')
        + '</div>'
      )}
    `,
    content_en: `
      ${section('About','<p>Spider Queen spawns small Spiderlings that heal the Queen when they die. You need to kill them quickly or one by one.</p>')}
      ${section('Strategies',ul(['One by one — kill spiderlings individually','Nuke all — AoE damage and kill all simultaneously','Block Revive is critical']))}
    `,
  },

  'ice-golem': {
    title_ru: 'Ледяной Голем',
    title_en: 'Ice Golem',
    icon: 'fa-snowflake',
    content_ru: `
      ${section('О боссе','<p>Ледяной Голем создаёт ледяных двойников, которые лечат его. При смерти замораживает всю команду. Нужно убить двойников первыми или защититься от заморозки.</p>')}
      ${section('Механики',ul(['При смерти Голема — заморозка команды (если нет Immunity)','Двойники постоянно хилят Голема','Нужна высокая скорость для быстрого прохождения']))}
    `,
    content_en: `
      ${section('About','<p>Ice Golem spawns Ice Clones that heal it. On death it freezes the entire team — bring Immunity or be prepared.</p>')}
    `,
  },

  'minotaur': {
    title_ru: 'Минотавр (Зал Чемпионов)',
    title_en: 'Minotaur (Hall of Champions)',
    icon: 'fa-horse',
    content_ru: `
      ${section('О Минотавре','<p>Минотавр — основной источник Зелий Вознесения. Проходи его ежедневно для фарма зелий, необходимых для вознесения чемпионов.</p>')}
      ${section('Советы',ul(['Фармить Минотавра нужно каждый день','Уровень 14–15 даёт лучший КПД по зельям','Приоритет — зелья нужной стихии для твоих чемпионов']))}
    `,
    content_en: `
      ${section('About','<p>Minotaur is the main source of Ascending Potions. Farm it daily for potions needed to ascend champions.</p>')}
      ${section('Tips',ul(['Farm daily for best efficiency','Levels 14–15 give best potion rates','Prioritize potions matching your champions\' affinity']))}
    `,
  },

  'iron-twins': {
    title_ru: 'Железные Близнецы',
    title_en: 'Iron Twins',
    icon: 'fa-people-group',
    content_ru: `
      ${section('О боссе','<p>Железные Близнецы — два мощных босса, которые делятся HP. Урон делится между ними. Особая механика: нельзя использовать Яды — они усиливают Близнецов.</p>')}
      ${section('Механики',ul(['Общий пул HP между двумя боссами','Яды под запретом — они буферизируются в усиление атаки','Нужны множество ударов и крит-урон','Контроль важен для замедления']))}
      ${section('Лучшие чемпионы',
        '<div class="pg-tags">'
        + championTag('Cruetraxa','Legendary')
        + championTag('Coldheart','Epic')
        + championTag('Zephyr Sniper','Epic')
        + '</div>'
      )}
    `,
    content_en: `
      ${section('About','<p>Iron Twins are two powerful bosses that share HP. Poisons are forbidden — they buff the twins. Focus on multi-hit and critical damage.</p>')}
    `,
  },

  'phantom-grove': {
    title_ru: 'Призрачная Роща',
    title_en: 'Phantom Grove',
    icon: 'fa-torii-gate',
    content_ru: `
      ${section('О боссе','<p>Призрачная Роща — подземелье с уникальными духовными боссами. Требует специальных команд с Блоком ревайва и AoE-уроном.</p>')}
      ${section('Советы',ul(['Блок ревайва — критически важен','Высокий AoE урон ускоряет прохождение','Следи за порядком целей']))}`
      ,
    content_en: `
      ${section('About','<p>Phantom Grove is a dungeon with unique spirit bosses requiring Block Revive and AoE damage.</p>')}
    `,
  },

  'sand-devil': {
    title_ru: 'Песчаный Дьявол',
    title_en: 'Sand Devil',
    icon: 'fa-sun',
    content_ru: `
      ${section('О боссе','<p>Песчаный Дьявол — босс с механикой барьеров. Требует чемпионов, способных снять барьеры или нанести большой разовый урон для их пробития.</p>')}
      ${section('Советы',ul(['Собирай чемпионов с HP Burn','Снижение защиты критично','Нужны чемпионы с Подрывом барьера']))}
    `,
    content_en: `
      ${section('About','<p>Sand Devil has barrier mechanics. You need champions that can strip barriers or deal massive burst damage.</p>')}
    `,
  },

  'event-dungeon': {
    title_ru: 'Событийное подземелье',
    title_en: 'Event Dungeon',
    icon: 'fa-calendar-days',
    content_ru: `
      ${section('Что это?','<p>Событийные подземелья появляются временно во время специальных акций. Как правило, это обновлённые или уникальные версии стандартных подземелий с особыми наградами.</p>')}
      ${section('Советы',ul(['Участвуй, пока доступно','Награды, как правило, уникальные и не повторяются','Откладывай Энергию перед началом события']))}
    `,
    content_en: `
      ${section('About','<p>Event dungeons appear temporarily during special promotions, featuring unique or modified versions of standard dungeons with special rewards.</p>')}
    `,
  },

  /* ────────────────────────────────────────────────────────
     БАШНЯ РОКА
  ──────────────────────────────────────────────────────── */
  'doom-tower-guide': {
    title_ru: 'Гайд по Башне Рока',
    title_en: 'Doom Tower Guide',
    icon: 'fa-tower-observation',
    content_ru: `
      ${section('О Башне Рока','<p>Башня Рока — сложный многоуровневый режим из 100 этажей. Обновляется каждые 2 месяца с новыми боссами. Даёт Реликвии и другие ценные награды.</p>')}
      ${section('Структура',ul(['100 этажей в нормальном режиме','100 этажей в сложном режиме','Боссы каждые 10 этажей','Секретные комнаты каждые 5 этажей']))}
      ${section('Ключевые боссы',ul(['Этаж 10: Сплавленный Голиаф или Скаарл','Этаж 20: Кальнар','Этаж 30: Шардра','Этаж 50: Нора / Пустотный Паук','Этаж 100: Финальный босс']))}
    `,
    content_en: `
      ${section('About Doom Tower','<p>Doom Tower is a complex 100-floor mode. It refreshes every 2 months with new bosses. Gives Relics and other valuable rewards.</p>')}
      ${section('Structure',ul(['100 floors in Normal mode','100 floors in Hard mode','Bosses every 10 floors','Secret Rooms every 5 floors']))}
    `,
  },

  'doom-tower-rotations': {
    title_ru: 'Ротации Башни Рока',
    title_en: 'Doom Tower Rotations',
    icon: 'fa-rotate',
    content_ru: `
      ${section('Что такое ротации?','<p>Башня Рока обновляется раз в ~2 месяца. Боссы, секретные комнаты и состав волн меняются. Зная текущую ротацию, можно подготовиться заранее.</p>')}
      ${section('Советы',ul(['Следи за анонсами новых ротаций','Подготовь команды под конкретных боссов','Секретные комнаты сбрасываются вместе с ротацией']))}
    `,
    content_en: `
      ${section('What are Rotations?','<p>Doom Tower refreshes every ~2 months. Bosses, secret rooms, and wave compositions change. Knowing the current rotation helps you prepare.</p>')}
    `,
  },

  'doom-tower-secret-rooms': {
    title_ru: 'Секретные комнаты Башни Рока',
    title_en: 'Doom Tower Secret Rooms',
    icon: 'fa-door-open',
    content_ru: `
      ${section('О Секретных комнатах','<p>Секретные комнаты — специальные бои с уникальными ограничениями (только определённые аффинити, редкость или типы чемпионов). Дают Реликвии и дополнительные награды.</p>')}
      ${section('Типы ограничений',ul(['Только Эпики','Только Рары','Только чемпионы определённой стихии','Только чемпионы без иммунитета']))}
    `,
    content_en: `
      ${section('About Secret Rooms','<p>Secret Rooms are special battles with unique restrictions (specific affinities, rarities, or champion types). They reward Relics and bonus drops.</p>')}
    `,
  },

  'doom-tower-bosses': {
    title_ru: 'Боссы Башни Рока',
    title_en: 'Doom Tower Bosses',
    icon: 'fa-skull',
    content_ru: `
      ${section('Список боссов',ul(['<strong>Сплавленный Голиаф</strong> — танк с огромным запасом HP','<strong>Скаарл</strong> — убийца с быстрыми атаками','<strong>Кальнар</strong> — отравляет всю команду','<strong>Шардра</strong> — дракон с заморозкой','<strong>Нора Хаоса</strong> — создаёт порталы','<strong>Пустотный Паук</strong> — порождает маленьких пауков']))}
      ${section('Советы',ul(['Каждый босс требует уникальной стратегии','Изучи механики перед боем','Проигрыш не тратит Токены Башни Рока']))}
    `,
    content_en: `
      ${section('Boss List',ul(['<strong>Fused Goliath</strong> — massive HP tank','<strong>Scarab</strong> — fast attacking killer','<strong>Calnar</strong> — poisons the whole team','<strong>Shardra</strong> — dragon with freeze','<strong>Nether Spider</strong> — spawns spiderlings']))}
    `,
  },

  'doom-tower-artifact-sets': {
    title_ru: 'Сеты артефактов Башни Рока',
    title_en: 'Doom Tower Artifact Sets',
    icon: 'fa-shield',
    content_ru: `
      ${section('Уникальные сеты Башни',ul(['<strong>Refresh</strong> — сокращает время отката способностей','<strong>Destroy</strong> — уничтожает часть MAX HP врага','<strong>Stun</strong> — шанс оглушения при атаке','<strong>Retaliation</strong> — контрудар при получении урона','<strong>Deflection</strong> — шанс снизить входящий урон','<strong>Frenzy</strong> — увеличивает скорость при получении дебаффа']))}
    `,
    content_en: `
      ${section('Doom Tower Sets',ul(['<strong>Refresh</strong> — reduces skill cooldowns','<strong>Destroy</strong> — reduces enemy MAX HP','<strong>Stun</strong> — chance to stun on attack','<strong>Retaliation</strong> — counterattack when hit','<strong>Deflection</strong> — reduces incoming damage','<strong>Frenzy</strong> — increases speed when debuffed']))}
    `,
  },

  /* ────────────────────────────────────────────────────────
     ГИДРА
  ──────────────────────────────────────────────────────── */
  'hydra-guide': {
    title_ru: 'Гайд по Гидре',
    title_en: 'Hydra Clan Boss Guide',
    icon: 'fa-skull',
    content_ru: `
      ${section('О Гидре','<p>Гидра — это клановый многоголовый босс. Атаковать одну голову — увеличивать силу другой. Наносит огромный урон и требует 100+ оборотов для максимального эффекта.</p>')}
      ${section('Ключевые механики',ul(['6 голов, каждая со своей способностью','Убийство головы → отрастает новая, более сильная','Buff Сtealing — Гидра крадёт баффы','Яды — лучший источник урона для Гидры']))}
      ${section('Рекомендуемые команды',ul(['Команда ядов: Toragi the Frog, Lydia, Sepulcher Sentinel','Команда Hyrdra Debuff: Lyssandra, Tayrel, Arbiter']))}
    `,
    content_en: `
      ${section('About Hydra','<p>Hydra is a multi-headed clan boss. Attacking one head increases others\' power. Requires 100+ turns for maximum damage.</p>')}
      ${section('Key Mechanics',ul(['6 heads with unique abilities','Killing a head grows a stronger one back','Buff Stealing — Hydra steals your buffs','Poisons — best damage source for Hydra']))}
    `,
  },

  'hydra-getting-started': {
    title_ru: 'Первые шаги с Гидрой',
    title_en: 'Getting Started With Hydra',
    icon: 'fa-play',
    content_ru: `
      ${section('Требования для старта',ul(['Клан должен быть Уровня 3+','Собственный счёт — нужен UNM Клан-Босс уровень развития','Минимум 100 оборотов команды — цель']))}
      ${section('Первая команда для Гидры',ul(['Торраги Лягушка — яды + щит','Поддержка с Block Debuffs','Два мощных DPS с ядами','Хилер для выживания']))}
    `,
    content_en: `
      ${section('Requirements',ul(['Clan must be Level 3+','You need UNM Clan Boss progression level','Target 100+ turns per key']))}
    `,
  },

  'hydra-heads': {
    title_ru: 'Головы Гидры',
    title_en: 'Hydra Clan Boss Heads',
    icon: 'fa-circle-nodes',
    content_ru: `
      ${section('Виды голов',ul(['<strong>Голова Повреждения</strong> — наносит большой урон','<strong>Голова Кражи Баффов</strong> — крадёт все баффы команды','<strong>Голова Ядов</strong> — накладывает яды','<strong>Голова Восстановления</strong> — хилит других голов','<strong>Голова Щита</strong> — даёт щит другим','<strong>Голова Сна</strong> — усыпляет чемпионов']))}
      ${section('Советы',ul(['Приоритет: Голова Кражи Баффов — самая опасная','Голову Восстановления убивай последней (или никогда)','Контроль головы Сна критичен']))}
    `,
    content_en: `
      ${section('Head Types',ul(['<strong>Damage Head</strong> — deals massive damage','<strong>Buff Steal Head</strong> — steals all team buffs','<strong>Poison Head</strong> — applies poisons','<strong>Heal Head</strong> — heals other heads','<strong>Shield Head</strong> — shields others','<strong>Sleep Head</strong> — puts champions to sleep']))}
    `,
  },

  'hydra-rewards': {
    title_ru: 'Награды Гидры',
    title_en: 'Hydra Clan Boss Rewards',
    icon: 'fa-gift',
    content_ru: `
      ${section('Что даёт Гидра',ul(['Сундуки с уникальными артефактами','Осколки призыва (Void, Ancient)','Серебро','Ресурсы для прокачки','Уникальные Charm-артефакты']))}
      ${section('Уровни наград',ul(['Normal — базовые награды','Hard — улучшенные награды','Brutal — значительно лучше','Nightmare — лучшие награды Гидры']))}
    `,
    content_en: `
      ${section('What Hydra Gives',ul(['Chests with unique artifacts','Summon shards (Void, Ancient)','Silver','Progression resources','Unique Charm artifacts']))}
    `,
  },

  'hydra-blessings': {
    title_ru: 'Лучшие Благословения для Гидры',
    title_en: 'Best Blessings for Hydra',
    icon: 'fa-star',
    content_ru: `
      ${section('Топ Благословения',ul(['<strong>Brimstone</strong> — дополнительный урон от способностей','<strong>Cruelty</strong> — снижение защиты при каждой атаке','<strong>Intimidating Presence</strong> — дебафф в начале боя']))}
      ${section('Советы',ul(['Brimstone на основных DPS — максимальный урон','Cruelty на саппортах — постоянное снижение защиты','Не бери Polymorph — не работает в Гидре']))}
    `,
    content_en: `
      ${section('Top Blessings',ul(['<strong>Brimstone</strong> — bonus damage from skills','<strong>Cruelty</strong> — defense reduction per hit','<strong>Intimidating Presence</strong> — debuff at battle start']))}
    `,
  },

  /* ────────────────────────────────────────────────────────
     СИНТРАНОС
  ──────────────────────────────────────────────────────── */
  'sintranos-tour': {
    title_ru: 'Тур по Синтраносу',
    title_en: 'Sintranos Tour Guide',
    icon: 'fa-route',
    content_ru: `
      ${section('О Синтраносе','<p>Проклятый Город Синтранос — специальный режим с уникальными правилами фракций. Открывается для высокоуровневых игроков. Предлагает интересные ограничения и мощные награды.</p>')}
      ${section('Особенности',ul(['Ограничения по фракциям и типам чемпионов','Два режима: Нормальный и Сложный','Финальный босс — Амиус, Лунный Архон']))}
    `,
    content_en: `
      ${section('About Sintranos','<p>The Cursed City of Sintranos is a special mode with unique faction rules, available for high-level players with interesting restrictions and powerful rewards.</p>')}
    `,
  },

  'sintranos-normal': {
    title_ru: 'Ограничения (Обычный режим)',
    title_en: 'Normal Mode Restrictions',
    icon: 'fa-list-check',
    content_ru: `
      ${section('Ограничения Нормального режима',ul(['Нельзя использовать одного и того же чемпиона дважды','Определённые фракции запрещены в некоторых зонах','Ограничение по максимальному уровню в некоторых комнатах']))}
    `,
    content_en: `
      ${section('Normal Mode Restrictions',ul(['Same champion cannot be used twice','Certain factions restricted in some zones','Level caps in some rooms']))}
    `,
  },

  'sintranos-hard': {
    title_ru: 'Ограничения (Сложный режим)',
    title_en: 'Hard Mode Restrictions',
    icon: 'fa-triangle-exclamation',
    content_ru: `
      ${section('Ограничения Сложного режима',ul(['Все ограничения нормального режима','Повышенный HP и урон врагов','Более строгие запреты на фракции','Требуются Иммунити- и Refresh-сеты']))}
    `,
    content_en: `
      ${section('Hard Mode Restrictions',ul(['All Normal mode restrictions apply','Increased enemy HP and damage','Stricter faction bans','Immunity and Refresh sets required']))}
    `,
  },

  'amius-boss': {
    title_ru: 'Босс Амиус — Лунный Архон',
    title_en: 'Amius the Lunar Archon',
    icon: 'fa-moon',
    content_ru: `
      ${section('О боссе','<p>Амиус, Лунный Архон — финальный босс Синтраноса. Обладает мощными лунными атаками и уникальными механиками фаз.</p>')}
      ${section('Механики',ul(['Фазы луны изменяют силу атак','Нужен Блок дебаффов в критических фазах','Высокий DEF снижает получаемый урон']))}
    `,
    content_en: `
      ${section('About','<p>Amius the Lunar Archon is the final boss of Sintranos with powerful moon attacks and unique phase mechanics.</p>')}
    `,
  },

  /* ────────────────────────────────────────────────────────
     ИНСТРУМЕНТЫ
  ──────────────────────────────────────────────────────── */
  'all-tools': {
    title_ru: 'Все инструменты Raid',
    title_en: 'All Raid Tools',
    icon: 'fa-toolbox',
    content_ru: `
      ${section('Доступные инструменты',ul(['<strong>Инструмент этапов Raid</strong> — определи лучший этап для фарма','<strong>Калькулятор акций</strong> — оцени стоимость предложений','<strong>Clan vs Clan Calculator</strong> — планируй клановые события','<strong>EHP Calculator</strong> — рассчитай выживаемость чемпиона','<strong>Damage Efficiency Tool</strong> — оптимизируй урон','<strong>CB Chest Simulator</strong> — предскажи награды Клан-Босса']))}
    `,
    content_en: `
      ${section('Available Tools',ul(['<strong>Raid Stages Tool</strong> — find the best farming stage','<strong>Pack Offer Calculator</strong> — evaluate offer value','<strong>Clan vs Clan Calculator</strong> — plan clan events','<strong>EHP Calculator</strong> — calculate champion survivability','<strong>Damage Efficiency Tool</strong> — optimize damage','<strong>CB Chest Simulator</strong> — predict Clan Boss rewards']))}
    `,
  },

  'stages-tool': {
    title_ru: 'Инструмент этапов Raid',
    title_en: 'Raid Stages Tool',
    icon: 'fa-map-location-dot',
    content_ru: `
      ${section('Описание','<p>Инструмент этапов помогает определить оптимальный этап Кампании или Подземелья для фарма опыта, серебра и артефактов с учётом твоих показателей Энергии.</p>')}
      ${section('Как использовать',ul(['Введи доступные этапы и количество Энергии','Инструмент рассчитает КПД фарма','Учитывается время, серебро и опыт']))}
    `,
    content_en: `
      ${section('Description','<p>The Stages Tool helps identify the optimal Campaign or Dungeon stage for farming XP, silver, and artifacts based on your Energy budget.</p>')}
    `,
  },

  'pack-offer-calculator': {
    title_ru: 'Калькулятор акционных предложений',
    title_en: 'Pack Offer Calculator',
    icon: 'fa-box-open',
    content_ru: `
      ${section('Описание','<p>Калькулятор помогает оценить реальную стоимость платных предложений в игре. Сравнивает стоимость кристаллов, осколков и других ресурсов с базовыми ценами.</p>')}
      ${section('Что считать',ul(['Сколько кристаллов дают за цену','Стоимость одного Void/Ancient осколка','Ценность «эксклюзивных» предметов в предложении']))}
    `,
    content_en: `
      ${section('Description','<p>The calculator evaluates the real value of paid offers in the game. Compares gem, shard, and resource values against baseline prices.</p>')}
    `,
  },

  'clan-vs-clan-calculator': {
    title_ru: 'Калькулятор Клан vs Клан',
    title_en: 'Clan vs Clan Calculator',
    icon: 'fa-users-between-lines',
    content_ru: `
      ${section('Описание','<p>Калькулятор Клан vs Клан помогает клану спланировать оптимальную стратегию распределения очков в событии CvC для максимальных наград.</p>')}
    `,
    content_en: `
      ${section('Description','<p>The Clan vs Clan Calculator helps your clan plan the optimal point distribution strategy for the CvC event for maximum rewards.</p>')}
    `,
  },

  'ehp-calculator': {
    title_ru: 'Калькулятор EHP',
    title_en: 'EHP Efficiency Calculator',
    icon: 'fa-shield-virus',
    content_ru: `
      ${section('Что такое EHP?','<p>EHP (Effective Hit Points) — эффективные очки здоровья с учётом защиты. Формула: EHP = HP × (1 + DEF/135). Позволяет сравнить выживаемость чемпионов.</p>')}
      ${section('Как использовать',ul(['Введи HP и DEF чемпиона','Калькулятор покажет EHP и сравнение','Используй для оптимизации артефактов']))}
    `,
    content_en: `
      ${section('What is EHP?','<p>Effective Hit Points factor in defense: EHP = HP × (1 + DEF/135). Lets you compare champion survivability.</p>')}
    `,
  },

  'damage-efficiency': {
    title_ru: 'Эффективность урона',
    title_en: 'Damage Efficiency Tool',
    icon: 'fa-chart-bar',
    content_ru: `
      ${section('Описание','<p>Инструмент эффективности урона помогает определить оптимальное соотношение ATK, CRIT Rate и CRIT DMG для максимального урона.</p>')}
      ${section('Формула',['<p class="pg-formula">Средний урон = ATK × (1 + CRIT_RATE × CRIT_DMG)</p>'])}
    `,
    content_en: `
      ${section('Description','<p>The Damage Efficiency Tool finds the optimal balance of ATK, CRIT Rate, and CRIT DMG for maximum damage output.</p>')}
    `,
  },

  'clan-boss-chest-simulator': {
    title_ru: 'Симулятор сундука Клан-Босса',
    title_en: 'Clan Boss Chest Simulator',
    icon: 'fa-treasure-chest',
    content_ru: `
      ${section('Описание','<p>Симулятор позволяет заранее увидеть примерные награды из сундука Клан-Босса в зависимости от нанесённого урона и уровня сложности.</p>')}
    `,
    content_en: `
      ${section('Description','<p>The simulator lets you preview likely Clan Boss chest rewards based on damage dealt and difficulty level.</p>')}
    `,
  },
};

/* ══════════════════════════════════════════════════════════
   HASH ROUTING
   Формат: #page-{pageId}
   Пример: index.html#page-faction-banner-lords
   ══════════════════════════════════════════════════════════ */
const HASH_PREFIX = 'page-';

function getPageIdFromHash() {
  const hash = window.location.hash;
  if (hash.startsWith('#' + HASH_PREFIX)) {
    return hash.slice(1 + HASH_PREFIX.length);
  }
  return null;
}

function setHash(pageId) {
  if (history.pushState) {
    history.pushState(null, '', '#' + HASH_PREFIX + pageId);
  } else {
    window.location.hash = HASH_PREFIX + pageId;
  }
}

function clearHash() {
  if (history.pushState) {
    history.pushState(null, '', window.location.pathname + window.location.search);
  } else {
    window.location.hash = '';
  }
}

/* ── ОТКРЫТЬ ОВЕРЛЕЙ ────────────────────────────────────── */
function openPage(pageId, updateHash) {
  const data = PAGE_CONTENT[pageId];
  if (!data || !pageOverlay) return;

  const lang = currentLang || 'ru';
  const title   = data['title_' + lang]   || data.title_ru   || '';
  const content = data['content_' + lang] || data.content_ru || '';

  pageOverlayTitle.textContent  = title;
  pageOverlayContent.innerHTML  = content;

  if (data.iconImg) {
    pageOverlayIcon.innerHTML = '<img src="' + data.iconImg + '" alt="">';
  } else {
    pageOverlayIcon.innerHTML = '<i class="fa-solid ' + (data.icon || 'fa-scroll') + '"></i>';
  }

  pageOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (updateHash !== false) {
    setHash(pageId);
  }
}

/* ── ЗАКРЫТЬ ОВЕРЛЕЙ ────────────────────────────────────── */
function closePage() {
  if (!pageOverlay) return;
  pageOverlay.classList.remove('active');
  document.body.style.overflow = '';
  clearHash();
}

/* ── ВЕШАЕМ ОБРАБОТЧИКИ НА КНОПКИ ──────────────────────── */
document.querySelectorAll('[data-page]').forEach(btn => {
  btn.addEventListener('click', () => openPage(btn.getAttribute('data-page')));
});

/* ── ЗАКРЫТИЕ ───────────────────────────────────────────── */
if (pageOverlayClose) pageOverlayClose.addEventListener('click', closePage);
if (pageOverlay) {
  pageOverlay.addEventListener('click', e => {
    if (e.target === pageOverlay) closePage();
  });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePage();
});

/* ── ОБРАБОТЧИК КНОПКИ «НАЗАД» БРАУЗЕРА ────────────────── */
window.addEventListener('popstate', () => {
  const pageId = getPageIdFromHash();
  if (pageId && PAGE_CONTENT[pageId]) {
    openPage(pageId, false);
  } else {
    if (pageOverlay && pageOverlay.classList.contains('active')) {
      pageOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

/* ── ОТКРЫТИЕ ПО ХЭШУ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const pageId = getPageIdFromHash();
  if (pageId && PAGE_CONTENT[pageId]) {
    setTimeout(() => openPage(pageId, false), 1400);
  }
});

console.log('%cRaidGuide.pro v2.1 — Hash Routing + Full Content ✓', 'color:#c8922a; font-size:14px; font-weight:bold;');
console.log('%c⚔ Konami Code активен. Прямые ссылки работают: #page-faction-banner-lords ⚔', 'color:#8b1a1a; font-size:11px;');
