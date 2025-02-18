window.loadExperienceData = function () {
    setTimeout(() => {
        const experienceList = document.getElementById('experience-list');

        if (!experienceList) {
            console.error("Ошибка: не найден элемент 'experience-list'");
            return;
        }

        fetch('Data/experience.json')
            .then(response => response.json())
            .then(data => {
                if (!data.experiences || data.experiences.length === 0) {
                    experienceList.innerHTML = "<p>Опыт работы пока не добавлен.</p>";
                    return;
                }

                experienceList.innerHTML = data.experiences.map(exp => `
                    <div class="experience-item">
                        <h3>${exp.company} - ${exp.position}</h3>
                        <p class="experience-period">${exp.period}</p>
                        <div class="experience-tasks">
                            <h4>Обязанности:</h4>
                            <ul>
                                ${exp.tasks.map(task => `<li>${task}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="experience-achievements">
                            <h4>Достижения:</h4>
                            <ul>
                                ${exp.achievements.map(ach => `<li>${ach}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('');
            })
            .catch(error => console.error('Ошибка загрузки опыта работы:', error));
    }, 100);
};