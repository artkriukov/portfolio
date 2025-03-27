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
        'Other': 'Другое',
        'experience_title': 'Опыт работы',
        'position': 'Должность',
        'main_tasks': 'Основные задачи',
        'achievements': 'Достижения',
        'tab_about': 'Обо мне',
        'tab_experience': 'Опыт',
        'tab_projects': 'Проекты',
        'tab_stack': 'Технологии',
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
        'Other': 'Other',
        'experience_title': 'Work Experience',
        'position': 'Position',
        'main_tasks': 'Main Responsibilities',
        'achievements': 'Achievements',
        'tab_about': 'About',
        'tab_experience': 'Experience',
        'tab_projects': 'Projects',
        'tab_stack': 'Stack',
      }
    };
    this.init();
  }

  detectLanguage() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) return savedLang;
    
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('ru')) return 'ru';
    if (browserLang.startsWith('en')) return 'en';
    
    return 'ru';
  }

  init() {
    this.saveLanguage();
    this.setupToggle();
    this.updateNavTabs(); // Добавляем вызов при инициализации
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
    this.updateNavTabs(); // Добавляем вызов при переключении языка
    document.dispatchEvent(new CustomEvent('languageChanged'));
  }

  updateNavTabs() {
    const tabs = {
      about: this.t('tab_about'),
      experience: this.t('tab_experience'),
      projects: this.t('tab_projects'),
      stack: this.t('tab_stack')
    };

    // Обновляем десктопные табы
    document.querySelectorAll('.navbar-tab').forEach(tab => {
      const contentKey = tab.dataset.content;
      if (tabs[contentKey]) {
        tab.textContent = tabs[contentKey];
      }
    });

    // Обновляем мобильные табы (если есть)
    document.querySelectorAll('.mobile-tab .tab-text').forEach(tab => {
      const contentKey = tab.closest('.mobile-tab').dataset.content;
      if (tabs[contentKey]) {
        tab.textContent = tabs[contentKey];
      }
    });
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