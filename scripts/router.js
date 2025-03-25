import Http from './http.js';
import Animator from './animator.js';
import Render from './render.js';

const Router = (() => {
    let currentPage = null;
    
    // Функции для работы с модальным окном
    const setupModalCloseHandlers = () => {
        // Закрытие по клику на оверлей или кнопку
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || 
                e.target.classList.contains('modal-close')) {
                closeModal();
            }
        });
        
        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.querySelector('.modal-container.active')) {
                closeModal();
            }
        });
    };

    const openProjectModal = async (projectId) => {
        try {
            const data = await Http.fetchPage('projects');
            const project = data.projects.find(p => p.id === projectId);
            
            if (project) {
                // Заполняем данные проекта
                document.querySelector('.modal-title').textContent = project.title;
                document.querySelector('.modal-description').textContent = project.details.description;
                
                // Устанавливаем изображение
                const imageContainer = document.querySelector('.modal-image-container');
                imageContainer.innerHTML = project.image ? 
                    `<img src="${project.image}" alt="${project.title}" class="modal-project-image">` : 
                    '';
                
                // Заполняем списки
                document.querySelector('.features-list').innerHTML = 
                    project.details.features.map(f => `<li>${f}</li>`).join('');
                
                document.querySelector('.tasks-list').innerHTML = 
                    project.details.tasks.map(t => `<li>${t}</li>`).join('');
                
                // Настраиваем GitHub ссылку
                const githubLink = document.querySelector('.github-link');
                if (project.details.github) {
                    githubLink.href = project.details.github;
                    githubLink.style.display = 'inline-block';
                } else {
                    githubLink.style.display = 'none';
                }
                
                // Показываем модальное окно
                document.querySelector('.modal-overlay').classList.add('active');
                document.querySelector('.modal-container').classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        } catch (error) {
            console.error('Ошибка при открытии проекта:', error);
            showError('Не удалось загрузить данные проекта');
        }
    };

    const closeModal = () => {
        document.querySelector('.modal-overlay').classList.remove('active');
        document.querySelector('.modal-container').classList.remove('active');
        document.body.style.overflow = '';
    };

    // Основные функции роутера
    const renderers = {
        about: Render.about,
        stack: Render.stack,
        experience: Render.experience,
        projects: Render.projects
    };

    const init = () => {
        // Инициализация навигации
        document.querySelectorAll('.sidebar__tab').forEach(tab => {
            tab.addEventListener('click', () => navigate(tab.dataset.content));
        });
        
        // Инициализация модального окна
        setupModalCloseHandlers();
        
        // Обработчик кликов по проектам
        document.addEventListener('click', (e) => {
            const projectCard = e.target.closest('.project-card');
            if (projectCard) {
                openProjectModal(projectCard.dataset.project);
            }
        });
    };

    const navigate = async (page) => {
        if (currentPage === page) return;
        
        Animator.startTransition();
        updateActiveTab(page);
        
        try {
            const data = await Http.fetchPage(page);
            renderPage(page, data);
            currentPage = page;
        } catch (error) {
            console.error('Navigation error:', error);
            showError();
        }
    };

    const renderPage = (page, data) => {
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
        document.querySelectorAll('.sidebar__tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.content === page);
        });
    };

    const showError = (message = 'Ошибка загрузки данных') => {
        document.querySelector('.content__body').innerHTML = `
            <div class="error-message">${message}</div>
        `;
        Animator.completeTransition();
    };

    return {
        init,
        navigate,
        openProjectModal // Экспортируем для внешнего использования
    };
})();

export default Router;