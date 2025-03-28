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

    this.handleOptionClick = this.handleOptionClick.bind(this); 
    this.init();
    this.setupDropdown();
  }

  handleOptionClick(e) {
    e.stopPropagation();
    e.preventDefault();
    
    const newLang = e.target.dataset.lang;
    if (newLang === this.currentLang) {
      this.closeDropdown();
      return;
    }
    
    console.log(`Changing language to ${newLang}`);
    this.currentLang = newLang;
    this.saveLanguage();
    this.updateToggle();
    this.updateNavTabs();
    this.closeDropdown();
    this.animateLanguageChange();
    document.dispatchEvent(new CustomEvent('languageChanged'));
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
    this.updateToggle();
    this.updateNavTabs();
  }

  saveLanguage() {
    localStorage.setItem('lang', this.currentLang);
    document.documentElement.lang = this.currentLang;
  }

  updateNavTabs() {
    const tabs = {
      about: this.t('tab_about'),
      experience: this.t('tab_experience'),
      projects: this.t('tab_projects'),
      stack: this.t('tab_stack')
    };

    document.querySelectorAll('.navbar-tab').forEach(tab => {
      const contentKey = tab.dataset.content;
      if (tabs[contentKey]) {
        tab.textContent = tabs[contentKey];
      }
    });

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
    
    document.querySelectorAll('.lang-option').forEach(option => {
      option.classList.toggle('active', option.dataset.lang === this.currentLang);
    });
  }

  setupDropdown() {
    // Удаляем старые обработчики
    this.removeDropdownListeners();

    const toggle = document.querySelector('.lang-toggle');
    const dropdown = document.querySelector('.lang-dropdown');
    
    if (!toggle || !dropdown) {
      console.error('Lang elements not found');
      return;
    }

    // Инициализация состояния
    this.dropdownState = {
      isOpen: false,
      isAnimating: false,
      toggle: toggle,
      dropdown: dropdown
    };

    // Назначаем обработчики
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      if (this.dropdownState.isAnimating) return;
      
      if (this.dropdownState.isOpen) {
        this.closeDropdown();
      } else {
        this.openDropdown();
      }
    });

    // Важно: используем делегирование событий для динамических элементов
    document.body.addEventListener('click', (e) => {
      if (e.target.closest('.lang-option')) {
        this.handleOptionClick(e);
      } else if (!e.target.closest('.lang-selector') && this.dropdownState.isOpen) {
        this.closeDropdown();
      }
    });

    console.log('Dropdown handlers initialized');
  }
  
  removeDropdownListeners() {
    if (this.dropdownState) {
      const { toggle } = this.dropdownState;
      toggle.removeEventListener('click', this.handleToggleClick);
      document.removeEventListener('click', this.handleOutsideClick);
    }
  }
  
  initDropdownHandlers() {
    const { toggle, dropdown } = this.dropdownState;
  
    // Обработчик клика по переключателю (используем bind для сохранения контекста)
    this.handleToggleClick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      if (this.dropdownState.isAnimating) return;
      
      if (this.dropdownState.isOpen) {
        this.closeDropdown();
      } else {
        this.openDropdown();
      }
    };
  
    // Обработчик кликов вне дропдауна
    this.handleOutsideClick = (e) => {
      if (!e.target.closest('.lang-selector')) {
        this.closeDropdown();
      }
    };
  
    // Назначаем обработчики
    toggle.addEventListener('click', this.handleToggleClick);
  }
  
  openDropdown() {
    if (this.dropdownState.isOpen || this.dropdownState.isAnimating) return;
  
    this.dropdownState.isAnimating = true;
    const { toggle, dropdown } = this.dropdownState;
    
    toggle.setAttribute('aria-expanded', 'true');
    dropdown.classList.add('show');
    document.addEventListener('click', this.handleOutsideClick);
  
    setTimeout(() => {
      this.dropdownState.isOpen = true;
      this.dropdownState.isAnimating = false;
      console.log('Dropdown opened');
    }, 300);
  }

  closeDropdown() {
    if (!this.dropdownState.isOpen || this.dropdownState.isAnimating) return;
  
    this.dropdownState.isAnimating = true;
    const { toggle, dropdown } = this.dropdownState;
    
    dropdown.classList.remove('show');
    document.removeEventListener('click', this.handleOutsideClick);
  
    setTimeout(() => {
      toggle.setAttribute('aria-expanded', 'false');
      this.dropdownState.isOpen = false;
      this.dropdownState.isAnimating = false;
      console.log('Dropdown closed');
    }, 300);
  }

  animateLanguageChange() {
    const content = document.querySelector('.content-container');
    if (!content) return;

    content.style.opacity = '0';
    content.style.transform = 'translateY(10px)';
    content.style.transition = 'opacity 0.3s, transform 0.3s';

    setTimeout(() => {
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }, 300);
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
