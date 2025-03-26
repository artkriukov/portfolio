import Http from './http.js';
import Animator from './animator.js';
import Render from './render.js';

const Router = (() => {
  // Текущая активная страница
  let currentPage = null;
  
  // Кастомное событие для изменения страницы
  const pageEvent = new CustomEvent('pageChanged', { 
    detail: { 
      page: null,
      prevPage: null 
    } 
  });

  // Настройка обработчиков закрытия модального окна
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

  // Открытие модального окна проекта
  const openProjectModal = async (projectId) => {
    try {
      console.log(`[Router] Opening project modal: ${projectId}`);
      
      // Загружаем данные проектов
      const data = await Http.fetchPage('projects');
      const project = data.projects.find(p => p.id === projectId);
      
      if (!project) throw new Error('Project not found');

      // Заполняем модальное окно данными
      fillModalContent(project);

      // Показываем модальное окно
      showModal();

    } catch (error) {
      console.error('[Router] Error opening project modal:', error);
      showErrorModal();
    }
  };

  // Заполнение содержимого модального окна
  const fillModalContent = (project) => {
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
  };

  // Показать модальное окно
  const showModal = () => {
    document.querySelector('.modal-overlay').classList.add('active');
    document.querySelector('.modal-container').classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Показать ошибку в модальном окне
  const showErrorModal = () => {
    document.querySelector('.modal-title').textContent = 'Ошибка';
    document.querySelector('.modal-description').textContent = 'Не удалось загрузить данные проекта';
    document.querySelector('.modal-image-container').innerHTML = '';
    document.querySelector('.features-list').innerHTML = '';
    document.querySelector('.tasks-list').innerHTML = '';
    document.querySelector('.github-link').style.display = 'none';
    showModal();
  };

  // Объект с функциями рендеринга для каждой страницы
  const renderers = {
    about: Render.about,
    stack: Render.stack,
    experience: Render.experience,
    projects: Render.projects
  };

  // Инициализация роутера
  const init = () => {
    console.log('[Router] Initializing router');
    
    setupModalCloseHandlers();
    setupNavbarHandlers();
    setupProjectClickHandlers();

    // Первая загрузка страницы
    if (!currentPage) {
      const initialPage = window.location.hash.substring(1) || 'about';
      navigate(initialPage);
    }
  };

  // Настройка обработчиков навбара
  const setupNavbarHandlers = () => {
    document.querySelectorAll('.navbar-tab').forEach(tab => {
      tab.addEventListener('click', () => navigate(tab.dataset.content));
    });
  };

  // Настройка обработчиков кликов по проектам
  const setupProjectClickHandlers = () => {
    document.addEventListener('click', (e) => {
      const projectCard = e.target.closest('.project-card');
      if (projectCard) {
        openProjectModal(projectCard.dataset.project);
      }
    });
  };

  // Навигация между страницами
  const navigate = async (page) => {
    if (currentPage === page) return;
    console.log(`[Router] Navigating to: ${page}`);

    // Запуск анимации перехода
    Animator.startTransition();
    
    // Обновление активной вкладки
    updateActiveTab(page);
    
    try {
      // Загрузка данных страницы
      const data = await Http.fetchPage(page);
      
      // Рендер страницы
      renderPage(page, data);
      
      // Обновление текущей страницы и истории браузера
      currentPage = page;
      window.location.hash = page;
      
      // Отправка события о смене страницы
      pageEvent.detail.page = page;
      pageEvent.detail.prevPage = currentPage;
      document.dispatchEvent(pageEvent);
      
    } catch (error) {
      console.error('[Router] Navigation error:', error);
      showError('Ошибка загрузки страницы');
    }
  };

  // Рендер страницы
  const renderPage = async (page, data) => {
    console.log(`[Router] Rendering page: ${page}`);
    
    try {
      const contentContainer = document.querySelector('.content-container');
      if (!contentContainer) {
        throw new Error('Content container not found');
      }
  
      // Анимация исчезновения старого контента
      contentContainer.style.opacity = '0';
      contentContainer.style.transform = 'translateY(10px)';
      
      // Небольшая задержка для анимации
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Рендер нового контента
      const title = getTitle(page);
      const content = renderers[page](data);
      
      contentContainer.innerHTML = `
        <h1 class="content__title">${title}</h1>
        <div class="content__body">
          ${content}
        </div>
      `;
      
      // Анимация появления нового контента
      setTimeout(() => {
        contentContainer.style.opacity = '1';
        contentContainer.style.transform = 'translateY(0)';
        contentContainer.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      }, 50);
      
    } catch (error) {
      console.error('[Router] Render error:', error);
      showError('Ошибка отображения страницы');
    }
  };

  // Получение заголовка страницы
  const getTitle = (page) => {
    const titles = {
      about: 'Обо мне',
      projects: 'Мои проекты',
      stack: 'Технологии',
      experience: 'Опыт работы'
    };
    return titles[page] || 'Страница';
  };

  // Обновление активной вкладки в навбаре
  const updateActiveTab = (page) => {
    console.log(`[Router] Updating active tab to: ${page}`);
    document.querySelectorAll('.navbar-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.content === page);
    });
  };

  // Показать ошибку
  const showError = (message = 'Ошибка загрузки данных') => {
    console.error(`[Router] Showing error: ${message}`);
    const contentContainer = document.querySelector('.content-container');
    
    if (contentContainer) {
      contentContainer.innerHTML = `
        <div class="error-message">
          <h1>Ошибка</h1>
          <p>${message}</p>
          <button class="retry-button">Попробовать снова</button>
        </div>
      `;
      
      // Добавляем обработчик для кнопки повтора
      document.querySelector('.retry-button')?.addEventListener('click', () => {
        navigate(currentPage);
      });
    }
    
    Animator.completeTransition();
  };

  return {
    init,
    navigate,
    openProjectModal
  };
})();

export default Router;