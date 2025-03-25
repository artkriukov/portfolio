import Theme from './theme.js';
import Router from './router.js';
import Projects from './projects.js';

function setupModalClose() {
  const closeModal = () => {
    document.querySelector('.modal-overlay').classList.remove('active');
    document.querySelector('.modal-container').classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.querySelector('.modal-overlay').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// Явная инициализация Projects при загрузке страницы проектов
function initProjects() {
  console.log('Checking for projects section...');
  const projectsSection = document.querySelector('.projects-section');
  if (projectsSection) {
    console.log('Projects section found, initializing...');
    new Projects();
  } else {
    console.log('No projects section found on this page');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, initializing app...');
  
  Theme.init();
  Router.init();
  setupModalClose();
  
  // Инициализируем Projects сразу, если это страница проектов
  initProjects();
  
  // И при смене страниц через роутер
  document.addEventListener('pageChanged', initProjects);
});