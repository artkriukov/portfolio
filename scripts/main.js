import Theme from './theme.js';
import Router from './router.js';
import Language from './lang.js';

class MainApp {
  constructor() {
    this.language = new Language();
    this.init();
  }
  init() {
    Theme.init();
    Router.init();
    this.setupModalClose();
    this.setupGlobalEventListeners();
    this.handleInitialLoad();
  }
  setupModalClose() {
    const closeModal = () => {
      document.querySelectorAll('.modal-container,.modal-overlay').forEach(el => el.classList.remove('active'));
      document.body.classList.remove('modal-open');
      const video = document.querySelector('.video-player');
      if (video) video.pause();
    };
    document.querySelectorAll('.modal-close,.modal-overlay').forEach(el => {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.querySelector('.modal-container.active')) {
        closeModal();
      }
    });
  }
  setupGlobalEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  handleInitialLoad() {
    // Any extra initialization logic
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MainApp();
});
