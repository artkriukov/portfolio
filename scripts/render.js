const Render = {
  about: function(data, lang = 'ru') {
    const shared = data.shared;
    const content = data[lang] || data.ru;
    
    return `
      <section class="about-section">
        <div class="about-content">
          <div class="about-header">
            ${shared.photo ? `<img src="${shared.photo}" alt="${content.name}" class="profile-image">` : ''}
            <div>
              <h1 class="about-title">${content.name}</h1>
              <p class="about-role">${content.role}</p>
            </div>
          </div>
          <div class="about-description">
            ${content.description.map(line => `<p>${line}</p>`).join('')}
          </div>
          <div class="social-links">
            ${shared.socialLinks.map(link => `
              <a href="${link.url}" target="_blank" class="social-link">
                ${link.icon}
                <span>${link.name[lang] || link.name.ru}</span>
              </a>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  },
  
    stack: function(data) {
      return `
        <div class="stack-grid">
          ${data.stack.map(category => `
            <div class="stack-category card">
              <h3>${category.category}</h3>
              <div class="stack-items">
                ${category.items.map(item => `
                  <div class="stack-item">
                    ${item.icon ? `<img src="${item.icon}" alt="${item.name}" class="stack-icon">` : ''}
                    <span>${item.name}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    },
  
    projects: function(data, lang = 'ru') {
      const translations = {
        all: { ru: 'Все проекты', en: 'All Projects' },
        personal: { ru: 'Индивидуальные', en: 'Personal' },
        team: { ru: 'Командные', en: 'Team' },
        features: { ru: 'Особенности', en: 'Features' },
        tasks: { ru: 'Реализованные задачи', en: 'Implemented Tasks' },
        github: { ru: 'Посмотреть на GitHub', en: 'View on GitHub' }
      };
    
      const projectsData = data[lang] || data.ru;
      
      return `
        <section class="projects-section">
          <div class="projects-tabs">
            <button class="projects-tab active" data-category="all">
              ${translations.all[lang] || translations.all.ru}
            </button>
            <button class="projects-tab" data-category="personal">
              ${translations.personal[lang] || translations.personal.ru}
            </button>
            <button class="projects-tab" data-category="team">
              ${translations.team[lang] || translations.team.ru}
            </button>
          </div>
          <div class="projects-grid">
            ${projectsData.projects.map(project => `
              <div class="project-card" data-project="${project.id}" data-category="${project.category}">
                <div class="project-image-container">
                  <img src="${project.image}" alt="${project.title}" class="project-image" 
                    onerror="this.onerror=null;this.src='assets/images/default-project.png'">
                </div>
                <div class="project-info">
                  <h3 class="project-title">${project.title}</h3>
                  <div class="project-stack">
                    ${project.stack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    },
  
    experience: function(data) {
      return `
        <section class="experience-section">
          <div class="experience-list">
            ${data.experiences.map(exp => `
              <div class="experience-card">
                <h3>${exp.company}</h3>
                <p class="experience-period">${exp.period}</p>
                <p class="experience-position">${exp.position}</p>
                <p>${exp.description}</p>
                <div class="experience-tasks">
                  <h4>Основные задачи:</h4>
                  <ul>
                    ${exp.tasks.map(task => `<li>${task}</li>`).join('')}
                  </ul>
                </div>
                ${exp.achievements && exp.achievements.length > 0 ? `
                  <div class="experience-achievements">
                    <h4>Достижения:</h4>
                    <ul>
                      ${exp.achievements.map(ach => `<li>${ach}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      `;
    }
  };
  
  export default Render;