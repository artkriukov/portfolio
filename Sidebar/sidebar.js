document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.querySelector('.sidebar');

    fetch('Sidebar/sidebar.html')
        .then(response => response.text())
        .then(data => {
            sidebar.innerHTML = data;
            fetch('https://raw.githubusercontent.com/artkriukov/portfolio/main/Data/sidebar.json')
        })
        .then(response => response.json())
        .then(data => {
            // Основная информация
            const nameEl = document.getElementById('name');
            const roleEl = document.getElementById('role');
            
            if (nameEl) nameEl.textContent = data.name;
            if (roleEl) roleEl.textContent = data.role;

            // Социальные ссылки
            const socialLinksContainer = document.getElementById('social-links');
            if (socialLinksContainer && data.socialLinks) {
                socialLinksContainer.innerHTML = '';
                data.socialLinks.forEach(link => {
                    const socialLink = document.createElement('a');
                    socialLink.href = link.url;
                    socialLink.title = link.name;
                    socialLink.target = "_blank";
                    socialLink.innerHTML = link.icon;
                    socialLinksContainer.appendChild(socialLink);
                });
            }

            // Кнопка резюме
            const resumeButton = document.getElementById('resume-button');
            if (resumeButton && data.resumeButton) {
                resumeButton.href = data.resumeButton.url;
                resumeButton.textContent = data.resumeButton.text;
            }

            // Секция "Обо мне"
            const aboutDescription = document.getElementById('about-description');
            const skillsList = document.getElementById('skills-list');
            
            if (data.about) {
                // Описание
                if (aboutDescription) {
                    aboutDescription.textContent = data.about.description;
                }
                
                // Навыки
                if (skillsList) {
                    skillsList.innerHTML = '';
                    data.about.skills.forEach(skill => {
                        const skillElement = document.createElement('div');
                        skillElement.classList.add('skill');
                        
                        // Создаем контейнер для иконки и названия
                        const skillContainer = document.createElement('div');
                        skillContainer.classList.add('skill-container');
                        
                        // Добавление иконки технологии (PNG изображение)
                        const skillIcon = document.createElement('div');
                        skillIcon.classList.add('skill-icon');
                        const img = document.createElement('img');
                        img.src = skill.icon; // Путь к PNG файлу
                        img.alt = skill.name; // Добавление alt для доступности
                        img.width = 24; // Размер иконки
                        img.height = 24;
                        skillIcon.appendChild(img);
                        skillContainer.appendChild(skillIcon);

                        // Название технологии
                        const skillName = document.createElement('span');
                        skillName.textContent = skill.name;
                        skillContainer.appendChild(skillName);

                        skillElement.appendChild(skillContainer);
                        skillElement.style.backgroundColor = skill.color;
                        skillsList.appendChild(skillElement);
                    });
                }
            }
        })
        .catch(error => console.error('Ошибка загрузки:', error));
});