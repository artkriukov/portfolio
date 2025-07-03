import Language from './lang.js';

const Render = {
  about(data, lang = 'ru') {
    const content = data.profile;
    return `
      <section class="about-section">
        <div class="about-content">
          <div class="about-header">
            ${content.photo ? `<img src="${content.photo}" alt="${content.name[lang]}" class="profile-image">` : ''}
            <div>
              <h1 class="about-title">${content.name[lang]}</h1>
              <p class="about-role">${content.role[lang]}</p>
            </div>
          </div>
          <div class="about-description">
            ${content.description[lang].map(line => `<p>${line}</p>`).join('')}
          </div>
          <div class="social-links">
            ${content.socialLinks.map(link => `
              <a href="${link.url}" target="_blank" class="social-link">
                ${link.icon}<span>${link.name[lang]}</span>
              </a>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  },

  stack(data) {
    const language = new Language();
    const lang = language.getCurrentLang();
    return `
      <div class="stack-grid">
        ${data.stack.map(category => `
          <div class="stack-category card">
            <h3>${category.category[lang]}</h3>
            <div class="stack-items">
              ${category.items.map(item => `
                <div class="stack-item">
                  ${item.icon ? `<img src="${item.icon}" alt="${item.name}" class="stack-icon" onerror="this.onerror=null;this.src='assets/icons/default-icon.svg'">` : ''}
                  <span>${item.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  projects(data, lang = 'ru') {
    const translations = new Language();
    const projectsData = data.projects;
    return `
      <section class="projects-section">
        <div class="projects-tabs">
          <button class="projects-tab active" data-category="all">${translations.t('all')}</button>
          <button class="projects-tab" data-category="personal">${translations.t('personal')}</button>
          <button class="projects-tab" data-category="team">${translations.t('team')}</button>
        </div>
        <div class="projects-grid">
          ${projectsData.map(project => `
            <div class="project-card" data-project="${project.id}" data-category="${project.category}">
              <div class="project-image-container">
                <img src="${project.image}" alt="${project.title[lang]}" class="project-image" onerror="this.onerror=null;this.src='assets/images/default-project.png'">
              </div>
              <div class="project-info">
                <h3 class="project-title">${project.title[lang]}</h3>
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

  experience(data, lang = 'ru') {
    const language = new Language();
    const t = (key) => language.t(key);
    return `
      <section class="experience-section">
        <div class="experience-list">
          ${data.experiences.map(exp => {
            const currentLang = language.getCurrentLang();
            const tasks = exp.tasks[currentLang] || exp.tasks.ru || [];
            const achievements = exp.achievements ? (exp.achievements[currentLang] || exp.achievements.ru || []) : [];
            return `
              <div class="experience-card">
                <h3>${exp.company}</h3>
                <p class="experience-period">${exp.period}</p>
                <p class="experience-position">${t('position')}: ${exp.position[currentLang] || exp.position.ru || exp.position}</p>
                <p>${exp.description[currentLang] || exp.description.ru || exp.description}</p>
                <div class="experience-tasks">
                  <h4>${t('main_tasks')}:</h4>
                  <ul>${tasks.map(task => `<li>${task}</li>`).join('')}</ul>
                </div>
                ${achievements.length > 0 ? `
                  <div class="experience-achievements">
                    <h4>${t('achievements')}:</h4>
                    <ul>${achievements.map(ach => `<li>${ach}</li>`).join('')}</ul>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }
};

export default Render;
