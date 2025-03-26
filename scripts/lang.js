export default class Language {
    constructor() {
      this.currentLang = this.detectLanguage();
      this.translations = {
        'ru': {
            'about': 'Обо мне',
            'experience': 'Опыт работы',
            'projects': 'Проекты',
            'stack': 'Технологии',
            'error': 'Ошибка',
            'load_error': 'Ошибка загрузки страницы',
            'retry': 'Попробовать снова',
            'features': 'Особенности',
            'tasks': 'Реализованные задачи',
            'github': 'Посмотреть на GitHub',
            'all': 'Все проекты',
            'personal': 'Индивидуальные',
            'team': 'Командные',
            'navbar_about': 'Обо мне',
            'navbar_experience': 'Опыт',
            'navbar_projects': 'Проекты',
            'navbar_stack': 'Технологии',
            'Languages': 'Языки',
            'Frameworks & Libraries': 'Фреймворки и библиотеки',
            'Architectural Patterns': 'Архитектурные паттерны',
            'Databases': 'Базы данных',
            'Tools & Platforms': 'Инструменты и платформы',
            'Other': 'Другое'
        },
        'en': {
            'about': 'About',
            'experience': 'Experience',
            'projects': 'Projects',
            'stack': 'Tech Stack',
            'error': 'Error',
            'load_error': 'Page load error',
            'retry': 'Try again',
            'features': 'Features',
            'tasks': 'Implemented Tasks',
            'github': 'View on GitHub',
            'all': 'All Projects',
            'personal': 'Personal',
            'team': 'Team',
            'navbar_about': 'About',
            'navbar_experience': 'Experience',
            'navbar_projects': 'Projects',
            'navbar_stack': 'Technologies',
            'Languages': 'Languages',
            'Frameworks & Libraries': 'Frameworks & Libraries',
            'Architectural Patterns': 'Architectural Patterns',
            'Databases': 'Databases',
            'Tools & Platforms': 'Tools & Platforms',
            'Other': 'Other'
        }
      };
      this.init();
    }
  
    detectLanguage() {
      // 1. Проверяем сохраненный язык
      const savedLang = localStorage.getItem('lang');
      if (savedLang) return savedLang;
      
      // 2. Проверяем язык браузера
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang.startsWith('ru')) return 'ru';
      if (browserLang.startsWith('en')) return 'en';
      
      // 3. Дефолтный язык
      return 'ru';
    }
  
    init() {
      this.saveLanguage();
      this.setupToggle();
    }
  
    saveLanguage() {
      localStorage.setItem('lang', this.currentLang);
      document.documentElement.lang = this.currentLang;
    }
  
    setupToggle() {
      const toggle = document.querySelector('.lang-toggle');
      if (toggle) {
        toggle.addEventListener('click', () => this.toggleLanguage());
        this.updateToggle();
      }
    }
  
    toggleLanguage() {
      this.currentLang = this.currentLang === 'ru' ? 'en' : 'ru';
      this.saveLanguage();
      this.updateToggle();
      document.dispatchEvent(new CustomEvent('languageChanged'));
    }
  
    updateToggle() {
      const langText = document.querySelector('.lang-text');
      if (langText) {
        langText.textContent = this.currentLang.toUpperCase();
      }
    }
  
    t(key) {
      return this.translations[this.currentLang]?.[key] || 
             this.translations['ru'][key] || 
             key;
    }
  
    getCurrentLang() {
      return this.currentLang;
    }
  }