document.addEventListener('DOMContentLoaded', function() {
    loadPortfolioData();

    const tapbarButtons = document.querySelectorAll('.portfolio-tapbar button');
    tapbarButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProjects(category);
        });
    });
});

function loadPortfolioData() {
    fetch('Data/portfolio.json')
        .then(response => response.json())
        .then(data => {
            window.portfolioData = data.projects; // Сохраняем данные в глобальной переменной
            displayProjects(data.projects);
        })
        .catch(error => console.error('Error loading portfolio data:', error));
}

function displayProjects(projects) {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = ''; // Очищаем список перед добавлением новых элементов

    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.classList.add('project-card');

        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="stack">
                    ${project.stack.map(tech => `
                        <span style="background-color: ${tech.color};">${tech.name}</span>
                    `).join('')}
                </div>
                <p class="role">${project.role}</p>
                <a href="${project.github}" target="_blank">GitHub →</a>
            </div>
        `;

        projectsList.appendChild(projectCard);
    });
}

function filterProjects(category) {
    let filteredProjects = window.portfolioData;

    if (category !== 'all') {
        filteredProjects = window.portfolioData.filter(project => project.category === category);
    }

    displayProjects(filteredProjects);
}

// Экспортируем функцию для использования в main.js
window.loadPortfolioData = loadPortfolioData;