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
  
      // Сначала делаем контейнер прозрачным для анимации
      container.style.opacity = '0';
      container.style.transform = 'translateY(10px)';
  
      const filtered = this.activeCategory === 'all' 
        ? this.projectsData 
        : this.projectsData.filter(p => p.category === this.activeCategory);
  
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
  
      // Запускаем анимацию появления
      setTimeout(() => {
        container.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
        
        // После анимации убираем transition
        setTimeout(() => {
          container.style.transition = 'none';
        }, 400);
      }, 10);
    }
  
    setupTabs() {
      const tabsContainer = document.querySelector('.projects-tabs');
      if (!tabsContainer) return;
  
      // Создаем индикатор активного таба
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
          this.animateTabSwitch(tab);
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
  
    animateTabSwitch(clickedTab) {
      // Анимация переключения табов
      const tabs = document.querySelectorAll('.projects-tab');
      tabs.forEach(tab => {
        tab.classList.remove('active');
        tab.style.transform = 'scale(0.98)';
        tab.style.transition = 'transform 0.2s ease-out';
      });
  
      clickedTab.classList.add('active');
      clickedTab.style.transform = 'scale(1.02)';
  
      setTimeout(() => {
        clickedTab.style.transform = 'scale(1)';
        this.updateTabIndicator();
      }, 200);
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
      // Анимация нажатия на карточку
      card.style.transform = 'scale(0.97)';
      card.style.transition = 'transform 0.2s ease-out';
  
      setTimeout(() => {
        card.style.transform = 'scale(1)';
      }, 200);
    }
  
    async openModal(projectId) {
      const project = this.projectsData.find(p => p.id === projectId);
      if (!project) return;
  
      // Анимация открытия модального окна
      const modal = document.querySelector('.modal-container');
      const overlay = document.querySelector('.modal-overlay');
      
      modal.style.opacity = '0';
      modal.style.transform = 'scale(0.95) translateY(20px)';
      overlay.style.opacity = '0';
      
      modal.classList.add('active');
      overlay.classList.add('active');
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
  
      // Анимация появления
      setTimeout(() => {
        modal.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        overlay.style.transition = 'opacity 0.3s ease-out';
        
        modal.style.opacity = '1';
        modal.style.transform = 'scale(1) translateY(0)';
        overlay.style.opacity = '1';
      }, 10);
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