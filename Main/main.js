document.addEventListener('DOMContentLoaded', function() {
    const tapbarButtons = document.querySelectorAll('.tapbar button');
    const contentDiv = document.getElementById('content');

    // Функция для загрузки страницы
    function loadPage(page) {
        fetch(`${page}/${page}.html`)
            .then(response => {
                if (!response.ok) throw new Error(`Ошибка загрузки ${page}.html: ${response.statusText}`);
                return response.text();
            })
            .then(data => {
                contentDiv.innerHTML = data;
                
                // Загрузка данных сразу после вставки HTML
                switch(page) {
                    case 'experience':
                        loadExperienceData();
                        break;
                    case 'portfolio':
                        if (window.loadPortfolioData) window.loadPortfolioData();
                        break;
                    case 'certificates':
                        if (window.loadCertificatesData) window.loadCertificatesData();
                        break;
                }
            })
            .catch(error => console.error('Ошибка загрузки страницы:', error));
    }

    // Обработчики для кнопок тапбара
    tapbarButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            loadPage(page);
        });
    });

    // Загрузка данных для опыта работы
    function loadExperienceData() {
        const experienceList = document.getElementById('experience-list');
        
        if (!experienceList) {
            console.error("Ошибка: не найден элемент 'experience-list'");
            return;
        }

        fetch('Data/experience.json')
            .then(response => response.json())
            .then(data => {
                if (!data.experiences?.length) {
                    experienceList.innerHTML = "<p>Опыт работы пока не добавлен.</p>";
                    return;
                }

                experienceList.innerHTML = data.experiences.map(exp => `
                    <div class="experience-item">
                        <h3>${exp.company} - ${exp.position}</h3>
                        <p class="experience-period">${exp.period}</p>
                        <div class="experience-tasks">
                            <h4>Обязанности:</h4>
                            <ul>${exp.tasks.map(task => `<li>${task}</li>`).join('')}</ul>
                        </div>
                        <div class="experience-achievements">
                            <h4>Достижения:</h4>
                            <ul>${exp.achievements.map(ach => `<li>${ach}</li>`).join('')}</ul>
                        </div>
                    </div>
                `).join('');
            })
            .catch(error => console.error('Ошибка загрузки опыта работы:', error));
    }

    // Загружаем страницу Experience по умолчанию
    loadPage('experience');
});