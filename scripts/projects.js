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
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      // Добавляем проверку структуры данных
      if (!data?.ru?.projects || !data?.en?.projects) {
        throw new Error('Invalid data format');
      }
      
      this.projectsData = data[new Language().getCurrentLang()]?.projects || [];
      
      if (this.projectsData.length === 0) {
        throw new Error('No projects available');
      }
      
      this.renderProjects();
    } catch (error) {
      console.error("Failed to load projects:", error);
      this.showError(error.message); // Передаем сообщение об ошибке
    }
  }

  renderProjects() {
    const container = document.querySelector('.projects-grid');
  if (!container) return;

  const filtered = this.activeCategory === 'all' 
    ? (this.projectsData || []) 
    : (this.projectsData || []).filter(p => p.category === this.activeCategory);

  // Добавляем проверку на наличие данных
  if (!filtered || filtered.length === 0) {
    container.innerHTML = '<div class="no-projects">No projects found</div>';
    return;
  }

    // Анимация исчезновения перед обновлением
    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';
    container.style.transition = 'opacity 0.3s, transform 0.3s';

    setTimeout(() => {
      // 1. Сначала рендерим только скелетоны
      container.innerHTML = filtered.map((project, index) => `
        <div class="project-card" data-project="${project.id}" style="animation-delay:${index * 50}ms">
          <div class="project-image-container">
            <div class="skeleton" style="width:100%; height:100%;"></div>
            <!-- Пустой img с data-src -->
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

      // Анимация появления скелетонов
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';

      // 2. Искусственная задержка (3 секунды) перед загрузкой реальных изображений
      setTimeout(() => {
        // Загружаем изображения
        document.querySelectorAll('.project-image').forEach(img => {
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.onload = function() {
              // Показываем изображение и скрываем скелетон
              this.classList.add('loaded');
              const skeleton = this.previousElementSibling;
              if (skeleton) {
                skeleton.style.opacity = '0';
                setTimeout(() => skeleton.remove(), 300);
              }
              
              // Показываем реальный контент
              const card = this.closest('.project-card');
              if (card) {
                card.querySelector('.project-info').innerHTML = `
                  <h3 class="project-title">${project.title}</h3>
                  <div class="project-stack">
                    ${project.stack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                  </div>
                `;
              }
            };
          }
        });
      }, 3000); // 3 секунды задержка

    }, 10);
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
    // Закрытие основной модалки
    const closeProjectModal = () => {
        document.querySelector('.project-modal').classList.remove('active');
        document.querySelector('.project-modal-overlay').classList.remove('active');
    };

    // Закрытие видео модалки
    const closeVideoModal = () => {
        document.querySelector('.video-modal').classList.remove('active');
        document.querySelector('.video-modal-overlay').classList.remove('active');
        const video = document.querySelector('.video-player');
        if(video) {
            video.pause();
            video.remove();
        }
    };

    // Обработчики для основной модалки
    document.querySelector('.project-modal .modal-close').addEventListener('click', closeProjectModal);
    document.querySelector('.project-modal-overlay').addEventListener('click', (e) => {
        if(e.target === document.querySelector('.project-modal-overlay')) {
            closeProjectModal();
        }
    });

    // Обработчики для видео модалки
    document.querySelector('.video-close').addEventListener('click', closeVideoModal);
    document.querySelector('.video-modal-overlay').addEventListener('click', (e) => {
        if(e.target === document.querySelector('.video-modal-overlay')) {
            closeVideoModal();
        }
    });

    // Обработчики клавиши Esc
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') {
            if(document.querySelector('.video-modal.active')) {
                closeVideoModal();
            } else if(document.querySelector('.project-modal.active')) {
                closeProjectModal();
            }
        }
    });
}

async openModal(projectId) {
  const project = this.projectsData.find(p => p.id === projectId);
  if (!project) return;

  const projectModal = document.querySelector('.project-modal');
  const projectOverlay = document.querySelector('.project-modal-overlay');
  const headerActions = projectModal.querySelector('.modal-header-actions');
  
  // Очищаем предыдущие элементы
  headerActions.innerHTML = '';

  // Добавляем кнопку видео
  if (project.details.videoUrl) {
      const videoButton = document.createElement('button');
      videoButton.className = 'video-button';
      videoButton.innerHTML = `
          <span class="play-icon">▶</span>
          ${new Language().t('watch_video')}
      `;

      videoButton.addEventListener('click', (e) => {
          e.stopPropagation();
          const videoWrapper = document.querySelector('.video-wrapper');
          
          videoWrapper.innerHTML = `
              <video controls class="video-player">
                  <source src="${project.details.videoUrl}" type="video/mp4">
                  ${new Language().t('video_not_supported')}
              </video>
          `;

          document.querySelector('.video-modal').classList.add('active');
          document.querySelector('.video-modal-overlay').classList.add('active');
      });

      headerActions.appendChild(videoButton);
  }

  // Показываем основную модалку
  projectModal.classList.add('active');
  projectOverlay.classList.add('active');
}


  showError(message = 'Не удалось загрузить проекты') {
    const container = document.querySelector('.projects-grid');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <p>${message}</p>
          <p>Попробуйте обновить страницу.</p>
        </div>
      `;
    }
  }
}