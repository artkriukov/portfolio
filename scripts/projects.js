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
    this.setupModalClose();
  }

  async loadProjects() {
    try {
      const response = await fetch('data/projects.json');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      this.projectsData = data.projects;
      this.renderProjects();
    } catch (error) {
      console.error("Failed to load projects:", error);
      this.showError();
    }
  }

  renderProjects() {
    const container = document.querySelector('.projects-grid');
    if (!container) return;

    // Анимация исчезновения перед обновлением
    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';
    container.style.transition = 'opacity 0.3s, transform 0.3s';

    const filtered = this.activeCategory === 'all' 
      ? this.projectsData 
      : this.projectsData.filter(p => p.category === this.activeCategory);

    setTimeout(() => {
      container.innerHTML = filtered.map((project, index) => `
        <div class="project-card" 
             data-project="${project.id}"
             style="animation-delay: ${index * 50}ms">
          <div class="project-image-container">
            <img src="${project.image}" 
                 alt="${project.title}" 
                 class="project-image"
                 onerror="this.onerror=null; this.src='assets/images/default-project.png'">
          </div>
          <div class="project-info">
            <h3 class="project-title">${project.title}</h3>
            <div class="project-stack">
              ${project.stack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('');

      // Анимация появления
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 300);
  }

  setupTabs() {
    const tabsContainer = document.querySelector('.projects-tabs');
    if (!tabsContainer) return;

    // Индикатор активного таба
    const indicator = document.createElement('div');
    indicator.className = 'tab-indicator';
    tabsContainer.appendChild(indicator);

    tabsContainer.innerHTML = `
      <button class="projects-tab ${this.activeCategory === 'all' ? 'active' : ''}" 
              data-category="all">Все проекты</button>
      <button class="projects-tab ${this.activeCategory === 'personal' ? 'active' : ''}" 
              data-category="personal">Индивидуальные</button>
      <button class="projects-tab ${this.activeCategory === 'team' ? 'active' : ''}" 
              data-category="team">Командные</button>
    `;

    this.updateTabIndicator();

    tabsContainer.addEventListener('click', (e) => {
      const tab = e.target.closest('.projects-tab');
      if (tab) {
        this.activeCategory = tab.dataset.category;
        this.updateActiveTab();
        this.updateTabIndicator();
        this.renderProjects();
      }
    });
  }

  updateTabIndicator() {
    const activeTab = document.querySelector('.projects-tab.active');
    const indicator = document.querySelector('.tab-indicator');
    if (!activeTab || !indicator) return;

    const tabRect = activeTab.getBoundingClientRect();
    const containerRect = activeTab.parentNode.getBoundingClientRect();
    
    indicator.style.width = `${tabRect.width}px`;
    indicator.style.left = `${tabRect.left - containerRect.left}px`;
  }

  updateActiveTab() {
    document.querySelectorAll('.projects-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === this.activeCategory);
    });
  }

  setupProjectClick() {
    document.querySelector('.projects-grid')?.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (card) {
        this.animateProjectClick(card);
        this.openModal(card.dataset.project);
      }
    });
  }

  animateProjectClick(card) {
    card.style.transform = 'scale(0.97)';
    card.style.transition = 'transform 0.2s ease-out';

    setTimeout(() => {
      card.style.transform = 'scale(1)';
    }, 200);
  }

  setupModalClose() {
    const closeModal = () => {
      const modal = document.querySelector('.modal-container');
      const overlay = document.querySelector('.modal-overlay');
      
      // Анимация закрытия
      modal.classList.add('closing');
      overlay.classList.remove('active');
      
      setTimeout(() => {
        modal.classList.remove('active', 'closing');
        document.body.style.overflow = '';
      }, 400);
    };

    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.querySelector('.modal-overlay').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.querySelector('.modal-container.active')) {
        closeModal();
      }
    });
  }

  async openModal(projectId) {
    const project = this.projectsData.find(p => p.id === projectId);
    if (!project) return;

    // Показываем overlay
    document.querySelector('.modal-overlay').classList.add('active');
    
    // Показываем модалку
    const modal = document.querySelector('.modal-container');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Заполняем данные
    document.querySelector('.modal-title').textContent = project.title;
    document.querySelector('.modal-description').textContent = project.details.description;
    
    const imgContainer = document.querySelector('.modal-image-container');
    imgContainer.innerHTML = `
      <img src="${project.image}" 
           alt="${project.title}" 
           class="modal-project-image"
           onerror="this.onerror=null; this.src='assets/images/default-project.png'">
    `;

    document.querySelector('.features-list').innerHTML = 
      project.details.features.map(f => `<li>${f}</li>`).join('');

    document.querySelector('.tasks-list').innerHTML = 
      project.details.tasks.map(t => `<li>${t}</li>`).join('');

    const githubLink = document.querySelector('.github-link');
    githubLink.href = project.details.github || '#';
    githubLink.style.display = project.details.github ? 'block' : 'none';
  }

  showError() {
    const container = document.querySelector('.projects-grid');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <p>Не удалось загрузить проекты.</p>
          <p>Попробуйте обновить страницу.</p>
        </div>
      `;
    }
  }
}