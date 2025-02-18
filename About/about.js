document.addEventListener('DOMContentLoaded', function() {
    fetch('Data/about.json')
        .then(response => response.json())
        .then(data => {
            // Вставляем заголовок и описание
            document.getElementById('about-title').textContent = data.title;
            document.getElementById('about-description').textContent = data.description;

            // Вставляем навыки
            const skillsList = document.getElementById('skills-list');
            data.skills.forEach(skill => {
                const skillElement = document.createElement('div');
                skillElement.classList.add('skill');
                skillElement.textContent = skill.name;
                skillElement.style.backgroundColor = skill.color; // Устанавливаем цвет фона
                skillsList.appendChild(skillElement);
            });
        })
        .catch(error => console.error('Error loading about data:', error));
});