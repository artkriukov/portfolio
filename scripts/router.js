import Http from './http.js';
import Animator from './animator.js';
import Render from './render.js';
import Language from './lang.js';

const Router = (() => {
    let currentPage = null;
    const language = new Language();
    const pageEvent = new CustomEvent('pageChanged', { detail: { page: null, prevPage: null } });

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

    // Рендер страницы с анимацией
    const renderPage = async (page, data) => {
        const contentContainer = document.querySelector('.content-container');
        if (!contentContainer) return;
        
        // Анимация исчезновения
        contentContainer.style.opacity = '0';
        contentContainer.style.transform = 'translateY(10px)';
        contentContainer.style.transition = 'opacity 0.3s, transform 0.3s';
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const title = language.t(page);
        const content = Render[page](data, language.getCurrentLang());
        
        contentContainer.innerHTML = `
            <h1 class="content-title">${title}</h1>
            <div class="content-body">${content}</div>
        `;
        
        // Анимация появления
        setTimeout(() => {
            contentContainer.style.opacity = '1';
            contentContainer.style.transform = 'translateY(0)';
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

    // Настройка табов проектов с анимацией
    const setupProjectTabs = () => {
        const tabsContainer = document.querySelector('.projects-tabs');
        if (!tabsContainer) return;

        // Создаем индикатор активного таба
        const indicator = document.createElement('div');
        indicator.className = 'tab-indicator';
        tabsContainer.appendChild(indicator);

        // Обновляем табы с переводами
        updateProjectTabs();

        // Обработчик кликов
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.projects-tab');
            if (tab) {
                const category = tab.dataset.category;
                filterProjects(category);
                updateTabIndicator(tab);
            }
        });
    };

    // Обновление табов с переводами
    const updateProjectTabs = () => {
        const tabsContainer = document.querySelector('.projects-tabs');
        if (!tabsContainer) return;

        const lang = language.getCurrentLang();
        const translations = {
            all: language.t('all'),
            personal: language.t('personal'),
            team: language.t('team')
        };

        tabsContainer.innerHTML = `
            <button class="projects-tab active" data-category="all">${translations.all}</button>
            <button class="projects-tab" data-category="personal">${translations.personal}</button>
            <button class="projects-tab" data-category="team">${translations.team}</button>
        `;

        // Обновляем индикатор
        const activeTab = tabsContainer.querySelector('.projects-tab.active');
        if (activeTab) {
            updateTabIndicator(activeTab);
        }
    };

    // Фильтрация проектов с анимацией
    const filterProjects = (category) => {
        const projectsGrid = document.querySelector('.projects-grid');
        const projectCards = document.querySelectorAll('.project-card');
        
        if (!projectsGrid || !projectCards.length) return;

        // Анимация фильтрации
        projectsGrid.classList.add('filtering');
        
        setTimeout(() => {
            projectCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            // Обновляем активный таб
            document.querySelectorAll('.projects-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.category === category);
            });

            // Завершение анимации
            setTimeout(() => {
                projectsGrid.classList.remove('filtering');
            }, 300);
        }, 50);
    };

    // Обновление индикатора таба
    const updateTabIndicator = (tab) => {
        const indicator = document.querySelector('.tab-indicator');
        if (!indicator || !tab) return;

        const tabRect = tab.getBoundingClientRect();
        const containerRect = tab.parentNode.getBoundingClientRect();
        
        indicator.style.width = `${tabRect.width}px`;
        indicator.style.left = `${tabRect.left - containerRect.left}px`;
    };

    // Обработчики кликов по проектам
    const setupProjectClickHandlers = () => {
        document.addEventListener('click', (e) => {
            const projectCard = e.target.closest('.project-card');
            if (projectCard) {
                // Анимация нажатия
                projectCard.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    projectCard.style.transform = 'scale(1)';
                }, 200);
                
                openProjectModal(projectCard.dataset.project);
            }
        });
    };

    // Открытие модалки проекта
    const openProjectModal = async (projectId) => {
      try {
          const lang = language.getCurrentLang();
          const data = await Http.fetchPage('projects');
          const projectsData = data[lang] || data.ru;
          const project = projectsData.projects.find(p => p.id === projectId);
          
          if (!project) throw new Error('Project not found');
          
          // Получаем элементы модального окна
          const modal = document.querySelector('.modal-container');
          const overlay = document.querySelector('.modal-overlay');
          const modalTitle = modal.querySelector('.modal-title');
          const modalDescription = modal.querySelector('.modal-description');
          const modalImageContainer = modal.querySelector('.modal-image-container');
          const featuresTitle = modal.querySelector('.features-title');
          const featuresList = modal.querySelector('.features-list');
          const tasksTitle = modal.querySelector('.tasks-title');
          const tasksList = modal.querySelector('.tasks-list');
          const githubLink = modal.querySelector('.github-link');
          
          // Заполняем данные
          modalTitle.textContent = project.title;
          modalDescription.textContent = project.details.description;
          
          // Обработка изображения - полностью переработанный блок
          if (modalImageContainer) {
              // Очищаем контейнер
              modalImageContainer.innerHTML = '';
              
              // Создаем элемент изображения
              const img = document.createElement('img');
              img.className = 'modal-project-image';
              img.alt = project.title;
              img.src = project.image;
              
              // Обработчик ошибки загрузки
              img.onerror = () => {
                  img.src = 'assets/images/default-project.png';
                  img.onerror = null; // Предотвращаем зацикливание
              };
              
              // Добавляем прелоадер
              const loader = document.createElement('div');
              loader.className = 'image-loader';
              loader.innerHTML = '<div class="spinner"></div>';
              
              modalImageContainer.appendChild(loader);
              modalImageContainer.appendChild(img);
              
              // Убираем прелоадер после загрузки
              img.onload = () => {
                  loader.style.display = 'none';
                  img.style.opacity = '0';
                  setTimeout(() => {
                      img.style.transition = 'opacity 0.3s ease';
                      img.style.opacity = '1';
                  }, 10);
              };
              
              // Если изображение уже загружено (из кеша)
              if (img.complete && img.naturalWidth !== 0) {
                  loader.style.display = 'none';
                  img.style.opacity = '1';
              }
          }
          
          // Устанавливаем переводы для заголовков
          if (featuresTitle) featuresTitle.textContent = language.t('features');
          if (tasksTitle) tasksTitle.textContent = language.t('tasks');
          
          // Заполняем списки
          featuresList.innerHTML = project.details.features.map(f => `<li>${f}</li>`).join('');
          tasksList.innerHTML = project.details.tasks.map(t => `<li>${t}</li>`).join('');
          
          // Настройка GitHub ссылки
          if (githubLink) {
              githubLink.href = project.details.github || '#';
              githubLink.textContent = language.t('github');
              githubLink.style.display = project.details.github ? 'inline-flex' : 'none';
          }
          
          // Показываем модальное окно
          overlay.classList.add('active');
          modal.classList.add('active');
          document.body.classList.add('modal-open');
      } catch (error) {
          console.error('Error opening project modal:', error);
      }
  };

    // Вспомогательные функции
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
    
    // Обработчик изменения языка
    const setupLanguageHandlers = () => {
        document.addEventListener('languageChanged', () => {
            // Перезагружаем текущую страницу с новым языком
            navigate(currentPage, true);
            
            // Особенная обработка для страницы проектов
            if (currentPage === 'projects') {
                updateProjectTabs();
            }
        });
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
    
    return {
        init,
        navigate,
        openProjectModal
    };
})();

export default Router;