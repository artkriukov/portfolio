// scripts/render.js
var Render = {
    about: function(data) {
        return `
            <div class="about-card card">
                <h2>${data.name}</h2>
                <p class="role">${data.role}</p>
                <div class="social-links">
                    ${data.socialLinks.map(link => `
                        <a href="${link.url}" target="_blank" class="social-link">
                            ${link.icon}
                            <span>${link.name}</span>
                        </a>
                    `).join('')}
                </div>
                <p>${data.about.description}</p>
            </div>
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
            <div class="projects-list">
                ${data.projects.map(project => `
                    <div class="project-card card">
                        <h3>${project.title}</h3>
                        <a href="${project.github}" target="_blank" class="github-link">GitHub</a>
                        ${project.image ? `<img src="${project.image}" alt="${project.title}" class="project-image">` : ''}
                        <div class="tech-stack">
                            ${project.stack.map(tech => `
                                <span class="tech-tag" style="background: ${tech.color}">${tech.name}</span>
                            `).join('')}
                        </div>
                        <p class="project-description">${project.details}</p>
                        <div class="project-tasks">
                            <h4>Реализованные задачи:</h4>
                            <ul>
                                ${project.roleTasks.map(task => `<li>${task}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
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
                        </div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }
};