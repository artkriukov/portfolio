export default class Projects {
    constructor() {
      console.log('[Projects] Constructor called');
      this.projectsData = [];
      this.activeCategory = 'all';
      this.initialized = false;
      
      this.init = this.init.bind(this);
      this.handleTabClick = this.handleTabClick.bind(this);
      this.handleProjectClick = this.handleProjectClick.bind(this);
  
      // Отложенная инициализация при полной загрузке DOM
      if (document.readyState === 'complete') {
        this.init();
      } else {
        document.addEventListener('DOMContentLoaded', this.init);
      }
    }
  
    async init() {
      if (this.initialized) return;
      console.log('[Projects] Initializing...');
      
      try {
        await this.loadProjects();
        this.setupTabs();
        this.setupProjectClick();
        this.initialized = true;
        console.log('[Projects] Initialization complete');
      } catch (error) {
        console.error('[Projects] Initialization failed:', error);
      }
    }
  
    async loadProjects() {
      console.log('[Projects] Loading projects data...');
      try {
        const response = await fetch('data/projects.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        this.projectsData = data.projects || [];
        console.log(`[Projects] Loaded ${this.projectsData.length} projects`);
        this.renderProjects();
      } catch (error) {
        console.error('[Projects] Failed to load projects:', error);
        this.showError();
        throw error;
      }
    }
  
    renderProjects() {
        const container = document.querySelector('.projects-grid');
        if (!container) return;
      
        const filtered = this.activeCategory === 'all' 
          ? this.projectsData 
          : this.projectsData.filter(p => p.category === this.activeCategory);
      
        container.innerHTML = filtered.map(project => `
          <div class="project-card" data-project="${project.id}">
            <img src="/${project.image}" 
                 alt="${project.title}" 
                 class="project-image"
                 onerror="this.onerror=null; this.src='/assets/images/default-project.png'">
            <div class="project-info">
              <h3>${project.title}</h3>
              <div class="project-stack">
                ${project.stack.map(tech => `<span>${tech}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('');
      }
  
    setupTabs() {
      const tabsContainer = document.querySelector('.projects-tabs');
      if (!tabsContainer) {
        console.error('[Projects] Tabs container not found');
        return;
      }
  
      console.log('[Projects] Setting up tabs');
      tabsContainer.innerHTML = `
        <button class="projects-tab ${this.activeCategory === 'all' ? 'active' : ''}" 
                data-category="all">Все проекты</button>
        <button class="projects-tab ${this.activeCategory === 'personal' ? 'active' : ''}" 
                data-category="personal">Индивидуальные</button>
        <button class="projects-tab ${this.activeCategory === 'team' ? 'active' : ''}" 
                data-category="team">Командные</button>
      `;
  
      // Удаляем старые обработчики перед добавлением новых
      tabsContainer.querySelectorAll('.projects-tab').forEach(tab => {
        tab.removeEventListener('click', this.handleTabClick);
      });
      
      tabsContainer.addEventListener('click', this.handleTabClick);
    }
  
    handleTabClick(e) {
      const tab = e.target.closest('.projects-tab');
      if (!tab) return;
  
      const category = tab.dataset.category;
      console.log(`[Projects] Tab clicked: ${category}`);
      
      if (this.activeCategory !== category) {
        this.activeCategory = category;
        this.updateActiveTab();
        this.renderProjects();
      }
    }
  
    updateActiveTab() {
      console.log(`[Projects] Updating active tab to: ${this.activeCategory}`);
      document.querySelectorAll('.projects-tab').forEach(tab => {
        const isActive = tab.dataset.category === this.activeCategory;
        tab.classList.toggle('active', isActive);
      });
    }
  
    setupProjectClick() {
      const grid = document.querySelector('.projects-grid');
      if (!grid) {
        console.error('[Projects] Projects grid not found');
        return;
      }
  
      // Удаляем старый обработчик перед добавлением нового
      grid.removeEventListener('click', this.handleProjectClick);
      grid.addEventListener('click', this.handleProjectClick);
    }
  
    handleProjectClick(e) {
      const card = e.target.closest('.project-card');
      if (card) {
        const projectId = card.dataset.project;
        console.log(`[Projects] Project clicked: ${projectId}`);
        this.openModal(projectId);
      }
    }
  
    async openModal(projectId) {
      console.log(`[Projects] Opening modal for project: ${projectId}`);
      try {
        const project = this.projectsData.find(p => p.id === projectId);
        if (!project) throw new Error('Project not found');
  
        // Заполнение модального окна
        document.querySelector('.modal-title').textContent = project.title;
        document.querySelector('.modal-description').textContent = project.details.description;
        
        const imgContainer = document.querySelector('.modal-image-container');
        imgContainer.innerHTML = `
          <img src="${project.image}" 
               alt="${project.title}" 
               onerror="this.onerror=null;this.src='assets/images/default-project.png'">
        `;
  
        document.querySelector('.features-list').innerHTML = 
          project.details.features.map(f => `<li>${f}</li>`).join('');
  
        document.querySelector('.tasks-list').innerHTML = 
          project.details.tasks.map(t => `<li>${t}</li>`).join('');
  
        const githubLink = document.querySelector('.github-link');
        githubLink.href = project.details.github || '#';
        githubLink.style.display = project.details.github ? 'block' : 'none';
  
        // Показ модалки
        document.querySelector('.modal-overlay').classList.add('active');
        document.querySelector('.modal-container').classList.add('active');
        document.body.style.overflow = 'hidden';
  
      } catch (error) {
        console.error('[Projects] Error opening modal:', error);
      }
    }
  
    showError() {
      console.log('[Projects] Showing error message');
      const container = document.querySelector('.projects-grid');
      if (container) {
        container.innerHTML = `
          <div class="error-message">
            Не удалось загрузить проекты. Пожалуйста, попробуйте позже.
          </div>
        `;
      }
    }
  }