import Theme from './theme.js';
import Router from './router.js';
import Projects from './projects.js';
import Language from './lang.js';

class MainApp {
  constructor() {
    this.language = new Language(); // Инициализация языка первой
    this.init();
  }

  init() {
    console.log('Initializing application...');
    
    // Инициализация модулей
    Theme.init();
    Router.init();
    
    // Настройка обработчиков
    this.setupModalClose();
    this.setupGlobalEventListeners();
    this.handleInitialLoad();
    
    console.log('Application initialized');
  }

  setupModalClose() {
    const closeModal = () => {
      const modal = document.querySelector('.modal-container');
      const overlay = document.querySelector('.modal-overlay');
      
      modal.classList.add('closing');
      overlay.classList.remove('active');
      
      setTimeout(() => {
        modal.classList.remove('active', 'closing');
        document.body.style.overflow = '';
      }, 300);
    };

    document.querySelector('.modal-close')?.addEventListener('click', closeModal);
    document.querySelector('.modal-overlay')?.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.querySelector('.modal-container.active')) {
        closeModal();
      }
    });
  }

  setupGlobalEventListeners() {
    // Обработчик внутренних ссылок
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Обработчик изменения страниц
    document.addEventListener('pageChanged', (e) => {
      this.initPageSpecificModules(e.detail.page);
    });
  }

  handleInitialLoad() {
    const initialPage = window.location.hash.substring(1) || 'about';
    this.initPageSpecificModules(initialPage);
    this.initScrollAnimations();
  }

  initPageSpecificModules(page) {
    console.log(`Initializing modules for: ${page}`);
    
    switch(page) {
      case 'projects':
        new Projects();
        break;
      case 'experience':
        this.initTimelineAnimation();
        break;
      default:
        // Для остальных страниц специфичная логика не требуется
    }
  }

  initScrollAnimations() {
    const animateOnScroll = () => {
      document.querySelectorAll('[data-animate]').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.75) {
          el.classList.add('animated');
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
  }

  initTimelineAnimation() {
    const timeline = document.querySelector('.experience-list');
    if (!timeline) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          
          entry.target.querySelectorAll('.experience-card').forEach((item, index) => {
            setTimeout(() => item.classList.add('animate-item'), index * 200);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(timeline);
  }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
  new MainApp();
});