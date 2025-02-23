document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioData();
    initFilters();
    initModal();
});

function loadPortfolioData() {
    fetch('Data/portfolio.json')
        .then(response => response.json())
        .then(data => {
            window.portfolioData = data.projects;
            renderProjects(data.projects);
            initFilters();
            initModal();
        })
        .catch(error => console.error("Ошибка загрузки данных:", error));
}

function renderProjects(projects) {
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
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;
            const filteredProjects = category === 'all'
                ? window.portfolioData
                : window.portfolioData.filter(p => p.category === category);

            renderProjects(filteredProjects);
        });
    });
}

function initModal() {
    const drawer = document.getElementById('project-drawer');
    const closeBtn = drawer.querySelector('.drawer-close');

    closeBtn.addEventListener('click', closeModal);
    drawer.querySelector('.drawer-overlay').addEventListener('click', closeModal);
}

function openModal(project) {
    const drawer = document.getElementById('project-drawer');
    
    drawer.querySelector('.drawer-image').src = project.image;
    drawer.querySelector('.drawer-title').textContent = project.title;
    drawer.querySelector('.drawer-description').textContent = project.details;
    drawer.querySelector('.drawer-role span').textContent = project.role;
    drawer.querySelector('.drawer-github').href = project.github;

    const stackContainer = drawer.querySelector('.drawer-stack');
    stackContainer.innerHTML = project.stack.map(tech => `
        <span class="stack-item" style="background: ${tech.color}">${tech.name}</span>
    `).join('');

    drawer.style.display = 'block';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
        drawer.classList.add('active');
    });
}

function closeModal() {
    const drawer = document.getElementById('project-drawer');
    drawer.classList.remove('active');
    
    setTimeout(() => {
        drawer.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}