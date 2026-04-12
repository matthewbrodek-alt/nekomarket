// Конфигурация темы
tailwind.config = {
  theme: {
    extend: {
      colors: {
        "primary": "#94464f",
        "secondary": "#5f5e5e",
        "background": "#f9f9f9",
        "on-surface": "#1a1c1c"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans"],
        "body": ["Inter"],
        "montserrat": ["Montserrat"]
      }
    }
  }
}

// СЛОВАРЬ ПЕРЕВОДОВ
const translations = {
    ru: {
        "nav-subtitle": "Ваш помощник в аренде пушистого друга",
        "nav-boutique": "Бутик",
        "nav-felines": "Наши коты",
        "nav-about": "О нас",
        "btn-rent": "Арендовать кота",
        "hero-quote": "«Найдите идеального компаньона для успокоения души»",
        "why-title": "Почему выбирают NEKOmarket?",
        "why-1-t": "Гарантия качества",
        "why-1-d": "Каждый кот проходит строгую проверку здоровья и характера.",
        "why-2-t": "Опыт Пхукета",
        "why-2-d": "Наш бутик в сердце Пхукета — это спокойствие и уют.",
        "why-3-t": "Гибкая бронь",
        "why-3-d": "На пару часов или на неделю — мы подстроимся под ваш график.",
        "team-title": "Наши сотрудники",
        "name-1": "Пьетро санчез мл.",
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
        "nav-about": "About Us",
        "btn-rent": "Rent a Cat",
        "hero-quote": "“Finding the perfect companion for your afternoon soul-soothing.”",
        "why-title": "Why Choose NEKOmarket?",
        "why-1-t": "Quality Assurance",
        "why-1-d": "Every feline undergoes rigorous health checks and temperament assessments.",
        "why-2-t": "Phuket Experience",
        "why-2-d": "Located in the heart of Phuket, our boutique offers a serene environment.",
        "why-3-t": "Flexible Booking",
        "why-3-d": "Whether for a few hours or a week, we cater to your schedule.",
        "team-title": "Our Feline Team",
        "name-1": "Pietro Sanchez Jr.",
        "age-1": "1 month",
        "name-2": "Luna",
        "age-2": "2 months",
        "name-3": "Arseniy",
        "age-3": "3 months"
    }
};

// Функция переключения
function changeLanguage(lang) {
    // 1. Обновляем текст на странице
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.innerText = translations[lang][key];
        }
    });

    // 2. Визуально переключаем кнопки
    document.getElementById('btn-ru').classList.toggle('bg-primary', lang === 'ru');
    document.getElementById('btn-ru').classList.toggle('text-white', lang === 'ru');
    document.getElementById('btn-en').classList.toggle('bg-primary', lang === 'en');
    document.getElementById('btn-en').classList.toggle('text-white', lang === 'en');
    
    // Сохраняем выбор в браузере
    localStorage.setItem('preferredLang', lang);
}

// Загрузка языка при старте
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'ru';
    changeLanguage(savedLang);
});
