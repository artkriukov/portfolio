import Http from './http.js';
import Animator from './animator.js';
import Render from './render.js';

const Router = (() => {
  let currentPage = null;
  const pageEvent = new CustomEvent('pageChanged', { detail: {} });

  const setupModalCloseHandlers = () => {
    const closeModal = () => {
      document.querySelector('.modal-overlay').classList.remove('active');
      document.querySelector('.modal-container').classList.remove('active');
      document.body.style.overflow = '';
    };

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay') || 
          e.target.classList.contains('modal-close')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.querySelector('.modal-container.active')) {
        closeModal();
      }
    });
  };

  const openProjectModal = async (projectId) => {
    try {
      console.log(`[Router] Opening project modal: ${projectId}`);
      const data = await Http.fetchPage('projects');
      const project = data.projects.find(p => p.id === projectId);
      
      if (!project) throw new Error('Project not found');

      // Заполнение модалки
      document.querySelector('.modal-title').textContent = project.title;
      document.querySelector('.modal-description').textContent = project.details.description;
      
      const imgContainer = document.querySelector('.modal-image-container');
      imgContainer.innerHTML = project.image 
        ? `<img src="${project.image}" alt="${project.title}" class="modal-project-image"
             onerror="this.onerror=null;this.src='assets/images/default-project.png'">`
        : '';

      document.querySelector('.features-list').innerHTML = 
        project.details.features.map(f => `<li>${f}</li>`).join('');

      document.querySelector('.tasks-list').innerHTML = 
        project.details.tasks.map(t => `<li>${t}</li>`).join('');

      const githubLink = document.querySelector('.github-link');
      githubLink.href = project.details.github || '#';
      githubLink.style.display = project.details.github ? 'inline-block' : 'none';

      // Показ модалки
      document.querySelector('.modal-overlay').classList.add('active');
      document.querySelector('.modal-container').classList.add('active');
      document.body.style.overflow = 'hidden';

    } catch (error) {
      console.error('[Router] Error opening project modal:', error);
    }
  };

  const renderers = {
    about: Render.about,
    stack: Render.stack,
    experience: Render.experience,
    projects: Render.projects
  };

  const init = () => {
    console.log('[Router] Initializing router');
    setupModalCloseHandlers();

    // Навигация по табам
    document.querySelectorAll('.sidebar__tab').forEach(tab => {
      tab.addEventListener('click', () => navigate(tab.dataset.content));
    });

    // Обработчик кликов по проектам
    document.addEventListener('click', (e) => {
      const projectCard = e.target.closest('.project-card');
      if (projectCard) openProjectModal(projectCard.dataset.project);
    });

    // Первая загрузка
    if (!currentPage) navigate('about');
  };

  const navigate = async (page) => {
    if (currentPage === page) return;
    console.log(`[Router] Navigating to: ${page}`);

    Animator.startTransition();
    updateActiveTab(page);
    
    try {
      const data = await Http.fetchPage(page);
      renderPage(page, data);
      currentPage = page;
      
      // Отправляем событие о смене страницы
      pageEvent.detail.page = page;
      document.dispatchEvent(pageEvent);
      
    } catch (error) {
      console.error('[Router] Navigation error:', error);
      showError();
    }
  };

  const renderPage = (page, data) => {
    console.log(`[Router] Rendering page: ${page}`);
    document.querySelector('.content__title').textContent = getTitle(page);
    document.querySelector('.content__body').innerHTML = renderers[page](data);
    Animator.completeTransition();
  };

  const getTitle = (page) => {
    const titles = {
      about: 'Обо мне',
      projects: 'Проекты',
      stack: 'Технологии',
      experience: 'Опыт работы'
    };
    return titles[page];
  };

  const updateActiveTab = (page) => {
    console.log(`[Router] Updating active tab to: ${page}`);
    document.querySelectorAll('.sidebar__tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.content === page);
    });
  };

  const showError = (message = 'Ошибка загрузки данных') => {
    console.error(`[Router] Showing error: ${message}`);
    document.querySelector('.content__body').innerHTML = `
      <div class="error-message">${message}</div>
    `;
    Animator.completeTransition();
  };

  return {
    init,
    navigate,
    openProjectModal
  };
})();

export default Router;