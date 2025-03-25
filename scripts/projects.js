export default class Projects {
    constructor() {
        this.projectsData = [];
        this.activeCategory = 'all';
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.setupTabs();
        this.setupProjectClick();
    }

    async loadProjects() {
        try {
            const response = await fetch('data/projects.json');
            const data = await response.json();
            this.projectsData = data.projects;
            this.renderProjects();
        } catch (error) {
            console.error("Failed to load projects:", error);
            this.showError();
        }
    }

    renderProjects() {
        const projectsContainer = document.querySelector('.projects-grid');
        const filteredProjects = this.activeCategory === 'all' 
            ? this.projectsData 
            : this.projectsData.filter(p => p.category === this.activeCategory);

        projectsContainer.innerHTML = filteredProjects.map(project => `
            <div class="project-card" 
                 data-project="${project.id}" 
                 data-category="${project.category}">
                <img src="${project.image}" 
                     alt="${project.title}" 
                     class="project-image"
                     onerror="this.onImageError(this)">
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-stack">
                        ${project.stack.map(tech => `
                            <span class="tech-tag" data-tech="${tech}">${tech}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    onImageError(imgElement) {
        imgElement.src = 'assets/images/default-project.png';
        imgElement.style.objectFit = 'contain';
        imgElement.style.padding = '1rem';
    }

    setupTabs() {
        const tabsContainer = document.querySelector('.projects-tabs');
        tabsContainer.innerHTML = `
            <button class="projects-tab ${this.activeCategory === 'all' ? 'active' : ''}" 
                    data-category="all">Все проекты</button>
            <button class="projects-tab ${this.activeCategory === 'personal' ? 'active' : ''}" 
                    data-category="personal">Индивидуальные</button>
            <button class="projects-tab ${this.activeCategory === 'team' ? 'active' : ''}" 
                    data-category="team">Командные</button>
        `;

        tabsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('projects-tab')) {
                this.activeCategory = e.target.dataset.category;
                this.updateActiveTab();
                this.renderProjects();
            }
        });
    }

    updateActiveTab() {
        document.querySelectorAll('.projects-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === this.activeCategory);
        });
    }

    setupProjectClick() {
        document.querySelector('.projects-grid').addEventListener('click', (e) => {
            const projectCard = e.target.closest('.project-card');
            if (projectCard) {
                this.openModal(projectCard.dataset.project);
            }
        });
    }

    async openModal(projectId) {
        try {
            const project = this.projectsData.find(p => p.id === projectId);
            if (!project) return;

            document.querySelector('.modal-title').textContent = project.title;
            document.querySelector('.modal-description').textContent = project.details.description;
            
            const imgContainer = document.querySelector('.modal-image-container');
            imgContainer.innerHTML = `
                <img src="${project.image}" 
                     alt="${project.title}" 
                     class="modal-project-image"
                     onerror="this.src='assets/images/default-project.png';this.style.objectFit='contain'">
            `;
            
            document.querySelector('.features-list').innerHTML = 
                project.details.features.map(f => `<li>${f}</li>`).join('');
            
            document.querySelector('.tasks-list').innerHTML = 
                project.details.tasks.map(t => `<li>${t}</li>`).join('');
            
            const githubLink = document.querySelector('.github-link');
            githubLink.href = project.details.github || '#';
            githubLink.style.display = project.details.github ? 'block' : 'none';

            document.querySelector('.modal-overlay').classList.add('active');
            document.querySelector('.modal-container').classList.add('active');
            document.body.style.overflow = 'hidden';
        } catch (error) {
            console.error("Error opening modal:", error);
        }
    }

    showError() {
        document.querySelector('.projects-grid').innerHTML = `
            <div class="error">
                Не удалось загрузить проекты. Пожалуйста, попробуйте позже.
            </div>
        `;
    }
}