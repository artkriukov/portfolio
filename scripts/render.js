const Render = {
    about: function(data) {
      return `
        <section class="about-section">
          <div class="about-content">
            <div class="about-header">
              ${data.photo ? `<img src="${data.photo}" alt="${data.name}" class="profile-image">` : ''}
              <div>
                <h1 class="about-title">${data.name}</h1>
                <p class="about-role">${data.role}</p>
              </div>
            </div>
            <div class="about-description">
              ${data.description.map(line => `<p>${line}</p>`).join('')}
            </div>
            <div class="social-links">
              ${data.socialLinks.map(link => `
                <a href="${link.url}" target="_blank" class="social-link">
                  ${link.icon}<span>${link.name}</span>
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
  
    projects: function(data) {
      return `
        <section class="projects-section">
          <div class="projects-tabs">
            <button class="projects-tab active" data-category="all">Все проекты</button>
            <button class="projects-tab" data-category="personal">Индивидуальные</button>
            <button class="projects-tab" data-category="team">Командные</button>
          </div>
          <div class="projects-grid">
            ${data.projects.map(project => `
              <div class="project-card" data-project="${project.id}" data-category="${project.category}">
                <!-- остальная разметка проекта -->
              </div>
            `).join('')}
          </div>
        </section>
      `;
    },
  
    experience: function(data) {
      return `
        <div class="experience-list">
          ${data.experiences.map(exp => `
            <div class="experience-card card">
              <h3>${exp.company}</h3>
              <p class="experience-period">${exp.period}</p>
              <p class="experience-position">${exp.position}</p>
              <p>${exp.description}</p>
              <div class="experience-tasks">
                <h4>Основные задачи:</h4>
                <ul>${exp.tasks.map(task => `<li>${task}</li>`).join('')}</ul>
              </div>
              ${exp.achievements && exp.achievements.length > 0 ? `
                <div class="experience-achievements">
                  <h4>Достижения:</h4>
                  <ul>${exp.achievements.map(ach => `<li>${ach}</li>`).join('')}</ul>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }
  };
  
  export default Render;