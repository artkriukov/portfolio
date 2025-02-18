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
        })
        .catch(console.error);
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
    document.querySelectorAll('.portfolio-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.portfolio-filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            const filtered = category === 'all' 
                ? window.portfolioData 
                : window.portfolioData.filter(p => p.category === category);
            
            renderProjects(filtered);
        });
    });
}

// Остальной код без изменений

function initModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = modal.querySelector('.modal-close');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function openModal(project) {
    const modal = document.getElementById('project-modal');
    const content = modal.querySelector('.modal-content');

    // Заполняем данные
    modal.querySelector('.modal-image').src = project.image;
    modal.querySelector('.modal-title').textContent = project.title;
    modal.querySelector('.modal-description').textContent = project.details;
    modal.querySelector('.modal-role span').textContent = project.role;
    modal.querySelector('.modal-github').href = project.github;
    
    // Обновляем стек
    const stackContainer = modal.querySelector('.modal-stack');
    stackContainer.innerHTML = project.stack.map(tech => `
        <span class="stack-item" style="background: ${tech.color}">${tech.name}</span>
    `).join('');

    modal.style.display = 'block';
}