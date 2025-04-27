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
    
            // Элементы основной модалки
            const projectModal = document.querySelector('.project-modal');
            const projectOverlay = document.querySelector('.project-modal-overlay');
            const title = projectModal.querySelector('.modal-title');
            const description = projectModal.querySelector('.modal-description');
            const tasksList = projectModal.querySelector('.tasks-list');
            const githubLink = projectModal.querySelector('.github-link');
            const headerActions = projectModal.querySelector('.modal-header-actions');
            const imageContainer = projectModal.querySelector('.modal-image-container');
            const tasksTitle = projectModal.querySelector('.modal-tasks-title');
    
            // Очистка содержимого
            title.textContent = '';
            description.textContent = '';
            tasksList.innerHTML = '';
            imageContainer.innerHTML = '';
            headerActions.innerHTML = '';
    
            // Заполнение данных с переводами
            title.textContent = project.title;
            description.textContent = project.details.description;
            
            // Заголовок задач
            if (tasksTitle) {
                tasksTitle.textContent = language.t('tasks');
            }
            
            // Список задач
            tasksList.innerHTML = project.details.tasks
                .map(t => `<li>${language.t(t)}</li>`) // Перевод каждой задачи
                .join('');
    
            // Ссылка на GitHub
            githubLink.href = project.details.github || '#';
            githubLink.textContent = language.t('github');
            githubLink.style.display = project.details.github ? 'inline' : 'none';
    
            // Добавление изображения
            const img = document.createElement('img');
            img.src = project.image;
            img.alt = project.title;
            img.className = 'modal-project-image';
            img.onerror = () => img.src = 'assets/images/default-project.png';
            imageContainer.appendChild(img);
    
            // Добавление кнопки видео
            if (project.details.videoUrl) {
                const videoButton = document.createElement('button');
                videoButton.className = 'video-button';
                videoButton.innerHTML = `
                    <span class="play-icon">▶</span>
                    ${language.t('watch_video')}
                `;
    
                videoButton.addEventListener('click', () => {
                    const videoModal = document.querySelector('.video-modal');
                    const videoOverlay = document.querySelector('.video-modal-overlay');
                    const videoWrapper = videoModal.querySelector('.video-wrapper');
                    
                    // Очистка предыдущего видео
                    videoWrapper.innerHTML = '';
                    
                    // Создание видео элемента
                    const video = document.createElement('video');
                    video.controls = true;
                    video.autoplay = true;
                    video.className = 'video-player';
                    video.innerHTML = `
                        <source src="${project.details.videoUrl}" type="video/mp4">
                        ${language.t('video_not_supported')}
                    `;
                    
                    videoWrapper.appendChild(video);
                    videoModal.classList.add('active');
                    videoOverlay.classList.add('active');
                });
    
                headerActions.appendChild(videoButton);
            }
    
            // Показ основной модалки
            projectModal.classList.add('active');
            projectOverlay.classList.add('active');
            document.body.classList.add('modal-open');
    
        } catch (error) {
            console.error('Error opening modal:', error);
            alert(language.t('load_error'));
        }
    };
    
    // Обработчики закрытия
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal-container, .modal-overlay').forEach(el => {
                el.classList.remove('active');
            });
            document.body.classList.remove('modal-open');
            
            // Остановка видео
            const video = document.querySelector('.video-player');
            if (video) video.pause();
        });
    });
    
    // Закрытие по клику на оверлей
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.querySelectorAll('.modal-container, .modal-overlay').forEach(el => {
                    el.classList.remove('active');
                });
                document.body.classList.remove('modal-open');
                
                // Остановка видео
                const video = document.querySelector('.video-player');
                if (video) video.pause();
            }
        });
    });
    

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