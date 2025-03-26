import Theme from './theme.js';
import Router from './router.js';
import Projects from './projects.js';

class MainApp {
  constructor() {
    this.init();
  }

  init() {
    console.log('Initializing application...');
    
    // Инициализация основных модулей
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
    // Обработчик для всех внутренних ссылок
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    // Подписка на изменение страниц
    document.addEventListener('pageChanged', (e) => {
      this.initPageSpecificModules(e.detail.page);
    });
  }

  handleInitialLoad() {
    const initialPage = window.location.hash.substring(1) || 'about';
    this.initPageSpecificModules(initialPage);
    
    // Инициализация анимаций для текущей страницы
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
      case 'about':
        // Можно добавить специфичную логику для страницы "О себе"
        break;
      default:
        console.log(`No specific modules for ${page}`);
    }
  }

  initScrollAnimations() {
    // Инициализация всех анимаций при скролле
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('[data-animate]');
      
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.75) {
          element.classList.add('animated');
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Инициализация при загрузке
  }

  initTimelineAnimation() {
    const timeline = document.querySelector('.experience-list');
    if (!timeline) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          
          // Анимация для каждого элемента временной линии
          const items = entry.target.querySelectorAll('.experience-card');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('animate-item');
            }, index * 200);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(timeline);
    console.log('Timeline animation initialized');
  }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
  new MainApp();
});