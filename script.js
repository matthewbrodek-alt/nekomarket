tailwind.config = {
  theme: {
    extend: {
      colors: {
        "primary": "#94464f",
        "secondary": "#5f5e5e",
        "background": "#f9f9f9",
        "on-surface": "#1a1c1c",
        "primary-container": "#dd828a"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans"],
        "body": ["Inter"],
        "montserrat": ["Montserrat"]
      }
    }
  }
}

// Словарь переводов
const translations = {
    ru: {
        "nav-subtitle": "Ваш помощник в аренде пушистого друга",
        "nav-boutique": "Бутик",
        "nav-felines": "Наши коты",
        "btn-rent": "Арендовать",
        "team-title": "Наши сотрудники",
        "name-1": "Пьетро Санчез младший",
        "age-1": "1 месяц",
        "name-2": "Луна",
        "age-2": "2 месяца",
        "name-3": "Арсений",
        "age-3": "3 месяца"
    },
    en: {
        "nav-subtitle": "Your assistant in renting a furry friend",
        "nav-boutique": "Boutique",
        "nav-felines": "Our Felines",
        "btn-rent": "Rent Now",
        "team-title": "Our Feline Team",
        "name-1": "Pietro Sanchez Jr.",
        "age-1": "1 month",
        "name-2": "Luna",
        "age-2": "2 months",
        "name-3": "Arseniy",
        "age-3": "3 months"
    }
};

function changeLanguage(lang) {
    // Обновляем текст
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    // Переключаем активный вид кнопок
    document.getElementById('btn-ru').className = lang === 'ru' 
        ? 'px-2 py-1 rounded-full transition-all bg-primary text-white' 
        : 'px-2 py-1 rounded-full transition-all text-secondary';
    
    document.getElementById('btn-en').className = lang === 'en' 
        ? 'px-2 py-1 rounded-full transition-all bg-primary text-white' 
        : 'px-2 py-1 rounded-full transition-all text-secondary';

    localStorage.setItem('nekoLang', lang);
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('nekoLang') || 'ru';
    changeLanguage(saved);
});
