import Language from './lang.js';

export default class Projects {
  constructor() {
    this.language = new Language();
    this.lang = this.language.getCurrentLang();
    this.activeCategory = 'all';
    this.projectsData = [];
    this.tabsContainer = document.querySelector('.projects-tabs');
    this.gridContainer = document.querySelector('.projects-grid');
    this.init();
    document.addEventListener('languageChanged', () => this.reload());
  }

  async init() {
    await this.loadProjects();
    this.renderTabs();
    this.renderProjects();
    this.setupTabs();
    this.setupProjectClick();
    this.setupModalClose();
  }

  async reload() {
    this.lang = this.language.getCurrentLang();
    await this.loadProjects();
    this.renderTabs();
    this.renderProjects();
  }

  async loadProjects() {
    try {
      const response = await fetch('data/data.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data.projects) throw new Error('Invalid data format');
      // Загружаем только нужные поля на нужном языке
      this.projectsData = data.projects.map(p => ({
        ...p,
        title: p.title[this.lang] || p.title['ru'],
        description: p.details.description[this.lang] || p.details.description['ru'],
        tasks: p.details.tasks[this.lang] || p.details.tasks['ru'],
        stack: p.stack,
        image: p.image,
        id: p.id,
        category: p.category,
        details: p.details
      }));
      if (this.projectsData.length === 0) throw new Error('No projects available');
    } catch (error) {
      this.showError(error.message);
    }
  }

  renderTabs() {
    if (!this.tabsContainer) return;
    const t = key => this.language.t(key);
    this.tabsContainer.innerHTML = `
      <button class="projects-tab ${this.activeCategory === 'all' ? 'active' : ''}" data-category="all">${t('all')}</button>
      <button class="projects-tab ${this.activeCategory === 'personal' ? 'active' : ''}" data-category="personal">${t('personal')}</button>
      <button class="projects-tab ${this.activeCategory === 'team' ? 'active' : ''}" data-category="team">${t('team')}</button>
    `;
  }

  renderProjects() {
    if (!this.gridContainer) return;
    const filtered = this.activeCategory === 'all'
      ? this.projectsData
      : this.projectsData.filter(p => p.category === this.activeCategory);

    if (!filtered.length) {
      this.gridContainer.innerHTML = `<div class="no-projects">${this.language.t('error')}</div>`;
      return;
    }

    // Анимация исчезновения (короткая)
    this.gridContainer.style.opacity = '0';
    this.gridContainer.style.transform = 'translateY(10px)';
    this.gridContainer.style.transition = 'opacity 0.3s, transform 0.3s';

    setTimeout(() => {
      this.gridContainer.innerHTML = filtered.map((project, index) => `
        <div class="project-card" data-project="${project.id}" data-category="${project.category}" style="animation-delay:${index * 50}ms">
          <div class="project-image-container">
            <div class="skeleton" style="width:100%; height:100%;"></div>
            <img 
              data-src="${project.image}" 
              alt="${project.title}" 
              class="project-image"
              loading="lazy"
              onerror="this.onerror=null; this.src='assets/images/default-project.png'"
            >
          </div>
          <div class="project-info">
            <div class="skeleton skeleton-text" style="width:80%; height:20px;"></div>
            <div class="project-stack">
              ${Array(3).fill().map(() => 
                `<span class="skeleton skeleton-text" style="width:60px; height:15px; display:inline-block; margin-right:5px;"></span>`
              ).join('')}
            </div>
          </div>
        </div>
      `).join('');

      this.gridContainer.style.opacity = '1';
      this.gridContainer.style.transform = 'translateY(0)';

      // Загружаем изображения и убираем скелетоны мгновенно после загрузки
      this.gridContainer.querySelectorAll('.project-card').forEach((card, idx) => {
        const img = card.querySelector('.project-image');
        const project = filtered[idx];
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          img.onload = function() {
            this.classList.add('loaded');
            const skeleton = this.previousElementSibling;
            if (skeleton) {
              skeleton.style.opacity = '0';
              setTimeout(() => skeleton.remove(), 200);
            }
            card.querySelector('.project-info').innerHTML = `
              <h3 class="project-title">${project.title}</h3>
              <div class="project-stack">
                ${project.stack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
              </div>
            `;
          };
          // Если изображение уже в кеше — сразу убираем скелетон
          if (img.complete) img.onload();
        }
      });
    }, 10); // минимальная задержка только для плавности
  }

  setupTabs() {
    if (!this.tabsContainer) return;
    if (this._tabHandler) this.tabsContainer.removeEventListener('click', this._tabHandler);
    this._tabHandler = (e) => {
      const tab = e.target.closest('.projects-tab');
      if (tab) {
        this.activeCategory = tab.dataset.category;
        this.renderTabs();
        this.renderProjects();
      }
    };
    this.tabsContainer.addEventListener('click', this._tabHandler);
  }


  setupProjectClick() {
    if (!this.gridContainer) return;
    if (this._cardHandler) this.gridContainer.removeEventListener('click', this._cardHandler);
    this._cardHandler = (e) => {
      const card = e.target.closest('.project-card');
      if (card) {
        this.animateProjectClick(card);
        this.openModal(card.dataset.project);
      }
    };
    this.gridContainer.addEventListener('click', this._cardHandler);
  }

  animateProjectClick(card) {
    card.style.transform = 'scale(0.97)';
    card.style.transition = 'transform 0.2s ease-out';
    setTimeout(() => {
      card.style.transform = 'scale(1)';
    }, 200);
  }

  setupModalClose() {
    const closeProjectModal = () => {
      document.querySelector('.project-modal')?.classList.remove('active');
      document.querySelector('.project-modal-overlay')?.classList.remove('active');
    };
    const closeVideoModal = () => {
      document.querySelector('.video-modal')?.classList.remove('active');
      document.querySelector('.video-modal-overlay')?.classList.remove('active');
      const video = document.querySelector('.video-player');
      if (video) {
        video.pause();
        video.remove();
      }
    };
    document.querySelector('.project-modal .modal-close')?.addEventListener('click', closeProjectModal);
    document.querySelector('.project-modal-overlay')?.addEventListener('click', (e) => {
      if (e.target === document.querySelector('.project-modal-overlay')) closeProjectModal();
    });
    document.querySelector('.video-close')?.addEventListener('click', closeVideoModal);
    document.querySelector('.video-modal-overlay')?.addEventListener('click', (e) => {
      if (e.target === document.querySelector('.video-modal-overlay')) closeVideoModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (document.querySelector('.video-modal.active')) closeVideoModal();
        else if (document.querySelector('.project-modal.active')) closeProjectModal();
      }
    });
  }

  openModal(projectId) {
    const project = this.projectsData.find(p => p.id === projectId);
    if (!project) return;
    const projectModal = document.querySelector('.project-modal');
    const projectOverlay = document.querySelector('.project-modal-overlay');
    const headerActions = projectModal.querySelector('.modal-header-actions');
    const modalTitle = projectModal.querySelector('.modal-title');
    const modalDesc = projectModal.querySelector('.modal-description');
    const modalStack = projectModal.querySelector('.modal-stack');
    const modalImageContainer = projectModal.querySelector('.modal-image-container');
    const modalGithub = projectModal.querySelector('.github-link');
    const modalTasks = projectModal.querySelector('.tasks-list');
    const modalTasksTitle = projectModal.querySelector('.modal-tasks-title');

    // Заполняем контент
    modalTitle.textContent = project.title;
    modalDesc.textContent = project.description;
    if (modalImageContainer) {
      modalImageContainer.innerHTML = `
        <img class="modal-project-image" src="${project.image}" alt="${project.title}">
    `;
}
    if (modalStack) {
      modalStack.innerHTML = project.stack.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
    }
    if (modalGithub) {
      modalGithub.href = project.details.github || '#';
      modalGithub.style.display = project.details.github ? 'inline' : 'none';
    }
    if (modalTasks) {
      modalTasks.innerHTML = project.tasks.map(task => `<li>${task}</li>`).join('');
    }
    if (modalTasksTitle) {
      modalTasksTitle.textContent = this.language.t('tasks');
    }
    // Кнопка видео
    headerActions.innerHTML = '';
    if (project.details.videoUrl) {
      const videoButton = document.createElement('button');
      videoButton.className = 'video-button';
      videoButton.innerHTML = `<span class="play-icon">▶</span>${this.language.t('watch_video')}`;
      videoButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const videoWrapper = document.querySelector('.video-wrapper');
        videoWrapper.innerHTML = `
          <video controls class="video-player">
            <source src="${project.details.videoUrl}" type="video/mp4">
            ${this.language.t('video_not_supported')}
          </video>
        `;
        document.querySelector('.video-modal').classList.add('active');
        document.querySelector('.video-modal-overlay').classList.add('active');
      });
      headerActions.appendChild(videoButton);
    }
    // Показываем модалку
    projectModal.classList.add('active');
    projectOverlay.classList.add('active');
  }

  showError(message = 'Не удалось загрузить проекты') {
    if (this.gridContainer) {
      this.gridContainer.innerHTML = `
        <div class="error-message">
          <p>${message}</p>
          <p>Попробуйте обновить страницу.</p>
        </div>
      `;
    }
  }
}
