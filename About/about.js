window.loadAboutData = function () {
    fetch('Data/about.json')
        .then(response => response.json())
        .then(data => {
            const title = document.getElementById('about-title');
            const description = document.getElementById('about-description');
            const skillsList = document.getElementById('skills-list');

            if (!title || !description || !skillsList) {
                console.error("Ошибка: элементы About не найдены.");
                return;
            }

            // Вставляем заголовок и описание
            title.textContent = data.title;
            description.textContent = data.description;

            // Очищаем список навыков перед добавлением новых
            skillsList.innerHTML = '';

            // Вставляем навыки
            data.skills.forEach(skill => {
                const skillElement = document.createElement('div');
                skillElement.classList.add('skill');
                skillElement.textContent = skill.name;
                skillElement.style.backgroundColor = skill.color; // Устанавливаем цвет фона
                skillsList.appendChild(skillElement);
            });
        })
        .catch(error => console.error('Ошибка загрузки данных About:', error));
};