document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioData();
    initFilters();
    initModal();
});

function loadPortfolioData() {
    fetch('Data/portfolio.json')
        .then(response => response.json())
        .then(data => {
            console.log("Данные загружены:", data); // Проверяем загруженные проекты
            window.portfolioData = data.projects;
            renderProjects(data.projects);
            initFilters(); 
            initModal();
        })
        .catch(error => console.error("Ошибка загрузки данных:", error));
}

function renderProjects(projects) {
    console.log("Рендерим проекты:", projects); // Проверяем, какие проекты рендерятся
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = projects.map(project => `
        <article class="project-card" data-category="${project.category}">
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-stack">
                    ${project.stack.map(tech => `
                        <span class="stack-item" style="background: ${tech.color}">${tech.name}</span>
                    `).join('')}
                </div>
            </div>
        </article>
    `).join('');

    addProjectCardListeners(projects);
}

function addProjectCardListeners(projects) {
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.addEventListener('click', () => openModal(projects[index]));
    });
}

function initFilters() {
    const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    
    if (filterButtons.length === 0) {
        console.error("Фильтры не найдены! Проверь HTML.");
        return;
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;
            console.log("Выбрана категория:", category);

            if (!window.portfolioData) {
                console.error("Данные о проектах не загружены!");
                return;
            }

            const filteredProjects = category === 'all'
                ? window.portfolioData
                : window.portfolioData.filter(p => p.category === category);

            console.log("Фильтрованные проекты:", filteredProjects);
            renderProjects(filteredProjects);
        });
    });
}

function initModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = modal.querySelector('.modal-close');

    if (!modal || !closeBtn) {
        console.error("Ошибка: модальное окно или кнопка закрытия не найдены!");
        return;
    }

    // Закрытие по клику на крестик
    closeBtn.addEventListener('click', closeModal);

    // Закрытие по клику на фон
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    console.log("Модальное окно инициализировано");
}

function openModal(project) {
    const modal = document.getElementById('project-modal');
    
    if (!modal) {
        console.error("Ошибка: модальное окно не найдено!");
        return;
    }

    // Заполняем данные в модалке
    modal.querySelector('.modal-image').src = project.image;
    modal.querySelector('.modal-title').textContent = project.title;
    modal.querySelector('.modal-description').textContent = project.details;
    modal.querySelector('.modal-role span').textContent = project.role;
    modal.querySelector('.modal-github').href = project.github;

    // Обновляем стек технологий
    const stackContainer = modal.querySelector('.modal-stack');
    stackContainer.innerHTML = project.stack.map(tech => `
        <span class="stack-item" style="background: ${tech.color}">${tech.name}</span>
    `).join('');

    // Открываем модалку
    modal.style.display = 'flex'; // Меняем с `block` на `flex`, если flex-центровка
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы

    console.log("Открыта модалка для проекта:", project.title);
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Возвращаем прокрутку страницы
        console.log("Модальное окно закрыто");
    }
}