import Theme from './theme.js';
import Router from './router.js';
import Projects from './projects.js';

class MainApp {
  constructor() {
    this.init();
  }

  init() {
    console.log('Initializing application...');
    
    // Инициализация темы
    Theme.init();
    
    // Инициализация роутера
    Router.init();
    
    // Настройка обработчиков модальных окон
    this.setupModalClose();
    
    // Обработка начальной загрузки страницы
    this.handleInitialLoad();
    
    // Подписка на события изменения страницы
    this.setupPageChangeListener();
  }

  setupModalClose() {
    const closeModal = () => {
      const modal = document.querySelector('.modal-container');
      const overlay = document.querySelector('.modal-overlay');
      
      // Анимация закрытия
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

  handleInitialLoad() {
    // Проверяем текущую страницу при загрузке
    const initialPage = window.location.hash.substring(1) || 'about';
    this.initPageSpecificModules(initialPage);
  }

  setupPageChangeListener() {
    document.addEventListener('pageChanged', (e) => {
      const newPage = e.detail.page;
      console.log(`Page changed to: ${newPage}`);
      this.initPageSpecificModules(newPage);
    });
  }

  initPageSpecificModules(page) {
    switch(page) {
      case 'projects':
        this.initProjectsModule();
        break;
      // Можно добавить инициализацию других модулей для других страниц
      default:
        console.log(`No specific modules for page: ${page}`);
    }
  }

  initProjectsModule() {
    console.log('Initializing Projects module...');
    try {
      new Projects();
      console.log('Projects module initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Projects module:', error);
    }
  }
}

// Запуск приложения при полной загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  new MainApp();
});