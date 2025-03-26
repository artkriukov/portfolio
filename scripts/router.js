import Http from './http.js';
import Animator from './animator.js';
import Render from './render.js';

const Router = (() => {
  let currentPage = null;
  const pageEvent = new CustomEvent('pageChanged', {
    detail: { page: null, prevPage: null }
  });

  // Настройка модального окна
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

  // Открытие модалки проекта
  const openProjectModal = async (projectId) => {
    try {
      const data = await Http.fetchPage('projects');
      const project = data.projects.find(p => p.id === projectId);
      if (!project) throw new Error('Project not found');

      document.querySelector('.modal-title').textContent = project.title;
      document.querySelector('.modal-description').textContent = project.details.description;
      
      const imgContainer = document.querySelector('.modal-image-container');
      imgContainer.innerHTML = project.image ? 
        `<img src="${project.image}" alt="${project.title}" class="modal-project-image" onerror="this.onerror=null;this.src='assets/images/default-project.png'">` : '';
      
      document.querySelector('.features-list').innerHTML = 
        project.details.features.map(f => `<li>${f}</li>`).join('');
      
      document.querySelector('.tasks-list').innerHTML = 
        project.details.tasks.map(t => `<li>${t}</li>`).join('');
      
      const githubLink = document.querySelector('.github-link');
      githubLink.href = project.details.github || '#';
      githubLink.style.display = project.details.github ? 'inline-block' : 'none';

      document.querySelector('.modal-overlay').classList.add('active');
      document.querySelector('.modal-container').classList.add('active');
      document.body.style.overflow = 'hidden';
    } catch (error) {
      console.error('Error opening project modal:', error);
    }
  };

  // Обработчики табов проектов
  const setupProjectTabs = () => {
    const tabs = document.querySelectorAll('.projects-tab');
    const projectCards = document.querySelectorAll('.project-item'); // Изменил класс на project-item
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Удаляем активный класс у всех табов
        tabs.forEach(t => t.classList.remove('active'));
        // Добавляем активный класс текущему табу
        this.classList.add('active');
        
        const category = this.dataset.category;
        
        // Фильтруем проекты с анимацией
        projectCards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  };

  // Обработчики кликов по проектам
  const setupProjectClickHandlers = () => {
    document.addEventListener('click', (e) => {
      const projectCard = e.target.closest('.project-item'); // Изменил класс на project-item
      if (projectCard) {
        openProjectModal(projectCard.dataset.project);
      }
    });
  };

  // Объект с функциями рендеринга
  const renderers = {
    about: Render.about,
    stack: Render.stack,
    experience: Render.experience,
    projects: function(data) {
      return `
        <section class="projects">
          <div class="projects-tabs">
            <button class="projects-tab active" data-category="all">Все проекты</button>
            <button class="projects-tab" data-category="personal">Индивидуальные</button>
            <button class="projects-tab" data-category="team">Командные</button>
          </div>
          <div class="projects-list">
            ${data.projects.map(project => `
              <div class="project-item" data-project="${project.id}" data-category="${project.category}">
                <div class="project-card">
                  <div class="project-image-wrapper">
                    <img src="${project.image}" alt="${project.title}" class="project-image" onerror="this.onerror=null;this.src='assets/images/default-project.png'">
                  </div>
                  <div class="project-content">
                    <h3 class="project-name">${project.title}</h3>
                    <div class="project-technologies">
                      ${project.stack.map(tech => `<span class="technology-badge">${tech}</span>`).join('')}
                    </div>
                    <div class="project-footer">
                      <span class="project-category">${project.category === 'personal' ? 'Индивидуальный' : 'Командный'} проект</span>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    }
  };

  // Инициализация роутера
  const init = () => {
    setupModalCloseHandlers();
    setupNavbarHandlers();
    setupProjectClickHandlers();
    
    window.addEventListener('hashchange', () => {
      const page = window.location.hash.substring(1) || 'about';
      navigate(page);
    });
    
    const initialPage = window.location.hash.substring(1) || 'about';
    navigate(initialPage);
  };

  // Навигация
  const navigate = async (page) => {
    if (currentPage === page) return;
    
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
      showError('Ошибка загрузки страницы');
    }
  };

  // Рендер страницы
  const renderPage = async (page, data) => {
    const contentContainer = document.querySelector('.content-container');
    if (!contentContainer) return;
    
    contentContainer.style.opacity = '0';
    contentContainer.style.transform = 'translateY(10px)';
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const title = getTitle(page);
    const content = renderers[page](data);
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
      setupProjectTabs();
    }
  };

  // Вспомогательные функции
  const getTitle = (page) => {
    const titles = {
      about: 'Обо мне',
      projects: 'Мои проекты',
      stack: 'Технологии',
      experience: 'Опыт работы'
    };
    return titles[page] || 'Страница';
  };

  const updateActiveTab = (page) => {
    document.querySelectorAll('.navbar-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.content === page);
    });
  };

  const setupNavbarHandlers = () => {
    document.querySelectorAll('.navbar-tab').forEach(tab => {
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
          <h1>Ошибка</h1>
          <p>${message}</p>
          <button class="retry-button">Попробовать снова</button>
        </div>
      `;
      
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