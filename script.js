tailwind.config = {
  theme: {
    extend: {
      colors: {
        "primary": "#94464f", "secondary": "#5f5e5e", "background": "#f9f9f9",
        "surface-container": "#eeeeee", "on-surface": "#1a1c1c"
      },
      fontFamily: { "headline": ["Plus Jakarta Sans"], "body": ["Inter"], "montserrat": ["Montserrat"] }
    }
  }
}

const translations = {
    ru: {
        "nav-subtitle": "Ваш помощник в аренде пушистого друга",
        "btn-rent": "Арендовать",
        "team-title": "Наши сотрудники",
        "collection-title": "Наша коллекция",
        "name-1": "Пьетро Санчез младший", "age-1": "1 месяц",
        "name-2": "Луна", "age-2": "2 месяца",
        "name-3": "Арсений", "age-3": "3 месяца",
        "footer-privacy": "Приватность"
    },
    en: {
        "nav-subtitle": "Your assistant in renting a furry friend",
        "btn-rent": "Rent Now",
        "team-title": "Our Feline Team",
        "collection-title": "Our Feline Collection",
        "name-1": "Pietro Sanchez Jr.", "age-1": "1 month",
        "name-2": "Luna", "age-2": "2 months",
        "name-3": "Arseniy", "age-3": "3 months",
        "footer-privacy": "Privacy"
    }
};

function changeLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.innerText = translations[lang][key];
    });
    document.getElementById('btn-ru').className = lang === 'ru' ? 'px-2 py-1 rounded-full bg-primary text-white' : 'px-2 py-1 text-secondary';
    document.getElementById('btn-en').className = lang === 'en' ? 'px-2 py-1 rounded-full bg-primary text-white' : 'px-2 py-1 text-secondary';
}

document.addEventListener('DOMContentLoaded', () => changeLanguage('ru'));
