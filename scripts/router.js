import Http from './http.js';
import Animator from './animator.js';
import Render from './render.js';
import Language from './lang.js';

const Router = (() => {
  let currentPage = null;
  const language = new Language();
  const pageEvent = new CustomEvent('pageChanged', {
    detail: { page: null, prevPage: null }
  });

  // Настройка модального окна
  const setupModalCloseHandlers = () => {
    const closeModal = () => {
      document.querySelector('.modal-overlay').classList.remove('active');
      document.querySelector('.modal-container').classList.remove('active');
      document.body.classList.remove('modal-open');
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

  // Навигация
  const navigate = async (page, forceReload = false) => {
    if (currentPage === page && !forceReload) return;
    
    Animator.startTransition();
    updateActiveTab(page);
    
    try {
      const data = await Http.fetchPage(page);
      renderPage(page, data);
      currentPage = page;
      window.location.hash = page;
      
      pageEvent.detail.page = page;
      pageEvent.detail.prevPage = currentPage;
      document.dispatchEvent(pageEvent);
    } catch (error) {
      console.error('Navigation error:', error);
      showError(language.t('load_error'));
    }
  };

  // Рендер страницы
  const renderPage = async (page, data) => {
    const contentContainer = document.querySelector('.content-container');
    if (!contentContainer) return;
    
    contentContainer.style.opacity = '0';
    contentContainer.style.transform = 'translateY(10px)';
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const title = getTitle(page, language.getCurrentLang());
    const content = Render[page](data, language.getCurrentLang());
    
    contentContainer.innerHTML = `
      <h1 class="content-title">${title}</h1>
      <div class="content-body">${content}</div>
    `;
    
    setTimeout(() => {
      contentContainer.style.opacity = '1';
      contentContainer.style.transform = 'translateY(0)';
      contentContainer.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    }, 50);

    if (page === 'projects') {
      initProjectsPage();
    }
  };

  // Инициализация страницы проектов
  const initProjectsPage = () => {
    setupProjectTabs();
    setupProjectClickHandlers();
  };

  // Настройка табов проектов
  const setupProjectTabs = () => {
    const tabs = document.querySelectorAll('.projects-tab');
    const projectsGrid = document.querySelector('.projects-grid');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Удаляем активный класс у всех табов
        tabs.forEach(t => t.classList.remove('active'));
        
        // Добавляем активный класс текущему табу
        this.classList.add('active');
        const category = this.dataset.category;
        
        // Добавляем класс для анимации
        projectsGrid.classList.add('filtering');
        
        // Через небольшой таймаут начинаем фильтрацию
        setTimeout(() => {
          const projectCards = document.querySelectorAll('.project-card');
          
          projectCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
              card.classList.remove('hidden');
            } else {
              card.classList.add('hidden');
            }
          });
          
          // После завершения фильтрации убираем класс анимации
          setTimeout(() => {
            projectsGrid.classList.remove('filtering');
          }, 300);
        }, 50);
      });
    });
  };

  // Обработчики кликов по проектам
  const setupProjectClickHandlers = () => {
    document.addEventListener('click', (e) => {
      const projectCard = e.target.closest('.project-card');
      if (projectCard) {
        openProjectModal(projectCard.dataset.project);
      }
    });
  };

  // Открытие модалки проекта
  const openProjectModal = async (projectId) => {
    try {
      const data = await Http.fetchPage('projects');
      const project = data.projects.find(p => p.id === projectId);
      
      if (!project) throw new Error('Project not found');
      
      // Заполнение модального окна
      document.querySelector('.modal-title').textContent = project.title;
      document.querySelector('.modal-description').textContent = project.details.description;
      
      const imgContainer = document.querySelector('.modal-image-container');
      imgContainer.innerHTML = project.image ? 
        `<img src="${project.image}" alt="${project.title}" class="modal-project-image" 
          onerror="this.onerror=null;this.src='assets/images/default-project.png'">` : '';
      
      document.querySelector('.features-list').innerHTML = 
        project.details.features.map(f => `<li>${f}</li>`).join('');
      
      document.querySelector('.tasks-list').innerHTML = 
        project.details.tasks.map(t => `<li>${t}</li>`).join('');
      
      const githubLink = document.querySelector('.github-link');
      githubLink.href = project.details.github || '#';
      githubLink.style.display = project.details.github ? 'inline-flex' : 'none';
      
      // Показ модального окна
      document.querySelector('.modal-overlay').classList.add('active');
      document.querySelector('.modal-container').classList.add('active');
      document.body.classList.add('modal-open');
    } catch (error) {
      console.error('Error opening project modal:', error);
    }
  };

  // Вспомогательные функции
  const getTitle = (page, lang) => {
    const titles = {
      about: { ru: 'Обо мне', en: 'About' },
      projects: { ru: 'Мои проекты', en: 'Projects' },
      stack: { ru: 'Технологии', en: 'Tech Stack' },
      experience: { ru: 'Опыт работы', en: 'Experience' }
    };
    return titles[page]?.[lang] || titles[page]?.ru || page;
  };

  const updateActiveTab = (page) => {
    document.querySelectorAll('.navbar-tab, .mobile-tab').forEach(tab => {
      const shouldBeActive = tab.dataset.content === page;
      tab.classList.toggle('active', shouldBeActive);
    });
  };

  const setupNavbarHandlers = () => {
    document.querySelectorAll('.navbar-tab, .mobile-tab').forEach(tab => {
      tab.addEventListener('click', function(e) {
        e.preventDefault();
        navigate(this.dataset.content);
      });
    });
  };

  const showError = (message) => {
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
      contentContainer.innerHTML = `
        <div class="error-message">
          <h1>${language.t('error')}</h1>
          <p>${message}</p>
          <button class="retry-button">${language.t('retry')}</button>
        </div>
      `;
      document.querySelector('.retry-button')?.addEventListener('click', () => {
        navigate(currentPage, true);
      });
    }
    Animator.completeTransition();
  };

  // Инициализация
  const init = () => {
    setupModalCloseHandlers();
    setupNavbarHandlers();
    setupLanguageHandlers();
    
    window.addEventListener('hashchange', () => {
      const page = window.location.hash.substring(1) || 'about';
      navigate(page);
    });

    const initialPage = window.location.hash.substring(1) || 'about';
    navigate(initialPage);
  };

  const setupLanguageHandlers = () => {
    document.addEventListener('languageChanged', () => {
      navigate(currentPage, true);
    });
  };

  return { init, navigate, openProjectModal };
})();

export default Router;